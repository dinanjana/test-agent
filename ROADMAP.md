# Roadmap

TestAgent is an early MVP released to the community. The five core components — **Connect,
Discover, Define, Simulate, Fix** — are implemented and working. This roadmap lists areas
where contributions would be especially valuable. None of it is committed work; it's an
invitation.

## Near term

- **Test coverage.** The backend has a Vitest setup but only minimal tests today. Service-
  and controller-level tests are the highest-value contribution.
- **Authentication.** There is no built-in auth layer yet. A pluggable local auth option
  (e.g. JWT) would make self-hosting safer out of the box.
- **Secrets at rest.** Encrypting stored LLM provider keys (the `.env.example` files
  reference a `SECRETS_ENCRYPTION_KEY` placeholder for this).
- **Onboarding / empty states.** A first-run wizard to connect an agent and create a first
  judge (see `PRD/17_PRD_EMPTY_STATES_ONBOARDING.md`).

## Later

- **More local-model ergonomics.** First-class examples for Ollama / vLLM agents over the
  HTTP connector.
- **More integrations** beyond Jira / Linear (e.g. GitHub Issues, Slack notifications).
- **Queue-backed runs.** Redis is wired into the dev stack; moving long test runs onto a
  job queue would improve scalability.
- **Broader judge library** and shareable judge/scenario templates.

Have an idea or want to pick something up? Open an issue to discuss — see
[CONTRIBUTING.md](CONTRIBUTING.md).
