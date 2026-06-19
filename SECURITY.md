# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in TestAgent, please report it **privately** so it
can be addressed before public disclosure.

- Use GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
  ("Report a vulnerability" under the repository's **Security** tab), or
- Open a minimal GitHub issue asking a maintainer to contact you, **without** including
  exploit details.

Please do not open a public issue describing the vulnerability or share proof-of-concept
exploits publicly until a fix is available.

We will acknowledge your report as soon as possible and keep you updated on the fix.

## Supported versions

TestAgent is an early-stage, community-maintained project. Security fixes are applied to the
`main` branch on a best-effort basis. There are no long-term-support branches.

## Self-hosting notes

TestAgent ships **without** a built-in authentication layer and is intended to be run behind
your own gateway, VPN, or auth proxy. Before exposing an instance:

- Do **not** run it on a public network without an access-control layer in front of it.
- Treat the MongoDB and Redis services in `docker-compose.yml` as **development defaults** —
  they are unauthenticated and must be secured (credentials, network isolation) for any
  non-local deployment.
- LLM provider API keys are stored per app in application settings. Protect access to your
  instance accordingly, and consider encryption at rest for the database.

The software is provided "as is", without warranty of any kind (see [LICENSE](LICENSE)).
