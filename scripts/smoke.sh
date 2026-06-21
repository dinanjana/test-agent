#!/usr/bin/env bash
#
# End-to-end smoke test for the Docker stack.
# Builds and starts everything, then verifies health, web↔api↔mongo wiring,
# data persistence across a restart, and that images carry no internal material.
#
# Usage:  ./scripts/smoke.sh        (run from anywhere; cwd is normalized to repo root)
# Exit:   0 = all pass, non-zero = at least one failure.
#
# Deep functional/UI testing (Connect → Define → Simulate → Fix) is done separately
# with Playwright against http://localhost:3000.

set -uo pipefail
cd "$(dirname "$0")/.."

API=http://localhost:3001
WEB=http://localhost:3000
MOCK=http://localhost:4000

FAILS=0
ok()  { echo "  ✅ $1"; }
bad() { echo "  ❌ $1"; FAILS=$((FAILS + 1)); }

wait_http() { # url, name, tries
  local url="$1" name="$2" tries="${3:-60}" code
  for _ in $(seq 1 "$tries"); do
    code=$(curl -s -o /dev/null -w '%{http_code}' "$url" 2>/dev/null || true)
    if [ "$code" != "000" ] && [ "$code" != "" ]; then ok "$name reachable (HTTP $code)"; return 0; fi
    sleep 2
  done
  bad "$name not reachable after $((tries * 2))s"; return 1
}

echo "== 1. Build & start the full stack =="
docker compose up --build -d || { echo "docker compose up failed"; exit 1; }

echo "== 2. Wait for services =="
wait_http "$API/health" "api"        60
wait_http "$WEB"        "web"        60
wait_http "$MOCK/health" "mock-agent" 60

echo "== 3. Smoke checks =="
curl -fsS "$API/health"  2>/dev/null | grep -q '"status":"ok"' && ok "api /health ok"        || bad "api /health"
curl -fsS "$WEB"         2>/dev/null | grep -qi "<html"        && ok "web serves HTML"        || bad "web HTML"
curl -fsS "$MOCK/health" 2>/dev/null >/dev/null                && ok "mock-agent /health ok" || bad "mock-agent /health"

echo "== 4. Persistence (web→api→mongo, survives restart) =="
NAME="smoke-$(date +%s)"
RESP=$(curl -fsS -X POST "$API/api/apps" -H 'content-type: application/json' -d "{\"name\":\"$NAME\"}" 2>/dev/null || true)
ID=$(printf '%s' "$RESP" | sed -n 's/.*"_id":"\([a-f0-9]*\)".*/\1/p')
[ -n "$ID" ] && ok "created app ($ID)" || bad "create app (resp: ${RESP:0:120})"
curl -fsS "$API/api/apps" 2>/dev/null | grep -q "$NAME" && ok "app readable via api" || bad "app read-back"

echo "   restarting stack (volumes kept)..."
docker compose down >/dev/null 2>&1
docker compose up -d >/dev/null 2>&1
wait_http "$API/health" "api (after restart)" 60
curl -fsS "$API/api/apps" 2>/dev/null | grep -q "$NAME" && ok "app persisted across restart" || bad "persistence"

# cleanup the test app
if [ -n "$ID" ]; then curl -fsS -X DELETE "$API/api/apps/$ID" >/dev/null 2>&1 && ok "cleaned up test app" || echo "  (cleanup skipped)"; fi

echo "== 5. Image hygiene (no internal material baked in) =="
CID=$(docker compose ps -q api 2>/dev/null | head -1)
IMG=$(docker inspect --format '{{.Image}}' "$CID" 2>/dev/null || true)
if [ -n "$IMG" ]; then
  LEAK=$(docker run --rm "$IMG" sh -c 'ls -a /app' 2>/dev/null | grep -E '^internal-docs$|^\.git$|^\.env$' || true)
  [ -z "$LEAK" ] && ok "api image free of internal-docs/.git/.env" || bad "api image contains: $LEAK"
else
  bad "could not resolve api image"
fi

# Image-size budget assertions (1000-based MB: 1MB = 1,000,000 bytes).
# NOTE: `docker image inspect .Size` reports the image's UNIQUE CONTENT size, which under the
# containerd image store is smaller than the `docker images` SIZE column (e.g. ~58MB content
# vs ~273MB on-disk for the api). Budgets are calibrated to THIS metric with headroom over the
# slimmed images (~58/52/54MB) so a regression to full-monorepo node_modules (~250MB+ content)
# trips the gate.
API_BUDGET=$((150 * 1000 * 1000))    # 150 MB  (slimmed ~58MB)
MOCK_BUDGET=$((120 * 1000 * 1000))   # 120 MB  (slimmed ~52MB)
WEB_BUDGET=$((120 * 1000 * 1000))    # 120 MB  (slimmed ~54MB)

get_image_from_service() {
  local svc="$1"
  local cid
  cid=$(docker compose ps -q "$svc" 2>/dev/null | head -1)
  [ -n "$cid" ] && docker inspect --format '{{.Image}}' "$cid" 2>/dev/null || true
}

check_image_size() {
  local svc="$1" budget="$2" label="$3"
  local img size_bytes size_mb
  img=$(get_image_from_service "$svc")
  if [ -z "$img" ]; then
    bad "$label: could not resolve image for service '$svc'"
    return
  fi
  size_bytes=$(docker image inspect --format '{{.Size}}' "$img" 2>/dev/null || true)
  if [ -z "$size_bytes" ]; then
    bad "$label: could not inspect image size"
    return
  fi
  # Compute MB (integer division, 1000-based)
  size_mb=$(( size_bytes / 1000000 ))
  if [ "$size_bytes" -lt "$budget" ]; then
    ok "$label image size: ${size_mb}MB (budget: $(( budget / 1000000 ))MB)"
  else
    bad "$label image size: ${size_mb}MB exceeds budget of $(( budget / 1000000 ))MB"
  fi
}

check_image_size "api"        "$API_BUDGET"  "api"
check_image_size "mock-agent" "$MOCK_BUDGET" "mock-agent"
check_image_size "web"        "$WEB_BUDGET"  "web"

echo
if [ "$FAILS" -eq 0 ]; then
  echo "SMOKE: ALL PASS ✅"
  echo "(stack is left running — 'docker compose down' to stop, 'down -v' to also wipe data)"
  exit 0
else
  echo "SMOKE: $FAILS check(s) FAILED ❌"
  exit 1
fi
