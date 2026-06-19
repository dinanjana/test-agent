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

echo
if [ "$FAILS" -eq 0 ]; then
  echo "SMOKE: ALL PASS ✅"
  echo "(stack is left running — 'docker compose down' to stop, 'down -v' to also wipe data)"
  exit 0
else
  echo "SMOKE: $FAILS check(s) FAILED ❌"
  exit 1
fi
