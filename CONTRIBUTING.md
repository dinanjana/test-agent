# Contributing to TestAgent

Thanks for your interest in improving TestAgent! This project is community-maintained and
contributions of all kinds — bug reports, docs, tests, and features — are welcome.

## Getting set up

**Prerequisites:** Node.js 18+, Docker (for MongoDB + Redis), and an OpenAI API key for the
bundled mock agent.

```bash
npm install
docker compose up -d                                   # MongoDB :27017, Redis :6379
cp apps/api/.env.example        apps/api/.env
cp apps/web/.env.example        apps/web/.env
cp apps/mock-agent/.env.example apps/mock-agent/.env   # add OPENAI_API_KEY
npm run dev                                             # api :3001, web :3000, mock-agent :4000
```

Verify the API is up: `curl http://localhost:3001/health`.

## Repository layout

This is an npm-workspaces + Turbo monorepo.

- `apps/api` — Express backend. Code is organized as `controllers/` (HTTP handlers),
  `services/` (business logic), `models/` (Mongoose schemas), and `utils/`.
- `apps/web` — Next.js 14 frontend (App Router). Components live in `src/components`.
- `apps/mock-agent` — a sample HTTP agent used to exercise the platform.
- `packages/` — shared TypeScript config and utilities.
- `PRD/` — product requirement docs; read the relevant one before changing a component.

## Before you open a PR

Run the same checks CI runs:

```bash
# Type checking (must be clean)
cd apps/api && npx tsc --noEmit
cd ../web   && npx tsc --noEmit

# Lint and tests
npm run lint
npm -w apps/api run test
```

Please make sure:

- TypeScript compiles with **zero errors** in `apps/api` and `apps/web`.
- Lint passes.
- New backend logic has a Vitest test where practical (see
  `apps/api/src/services/__tests__/` for the pattern).

If your change touches Docker, the compose stack, or build config, validate the full stack
end-to-end with the smoke test:

```bash
./scripts/smoke.sh
```

It builds and starts everything, checks health + persistence, and verifies images carry no
internal material. Exit code 0 means all checks passed.

## Workflow

1. Fork and branch from `main` (e.g. `feat/...`, `fix/...`, `docs/...`).
2. Keep changes focused; reference the relevant PRD or issue in the description.
3. Use clear, conventional commit messages (`feat:`, `fix:`, `docs:`, `refactor:`…).
4. Open a PR describing **what** changed and **why**, with steps to verify.

## Reporting bugs & requesting features

Open a GitHub issue with reproduction steps (for bugs) or the problem you're trying to
solve (for features). For security issues, see [SECURITY.md](SECURITY.md) instead.

By contributing, you agree your contributions are licensed under the [MIT License](LICENSE).
