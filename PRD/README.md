# Product Requirement Docs

These are the original product specs for TestAgent, kept in the open-source repo so
contributors can understand the intended behavior of each component. They describe the
*vision* — the code is an early MVP and may not implement every detail.

For a high-level overview and setup, see the [root README](../README.md).

## Foundation

| Doc | What it covers |
| --- | --- |
| [01 — Overview](01_PRD_OVERVIEW.md) | What TestAgent is, goals, and scope |
| [02 — Personas](02_PRD_PERSONAS.md) | Who it's for and their journeys |
| [16 — User Journeys](16_PRD_USER_JOURNEYS.md) | End-to-end flows through the product |

## The five core components

| Doc | Component | What it does |
| --- | --- | --- |
| [03 — Connect](03_PRD_CONNECT.md) | **Connect** | Black-box HTTP agent integration |
| [03A — Discover](03A_PRD_DISCOVER.md) | **Discover** | Response collection, annotation, auto-grader generation |
| [04 — Define](04_PRD_DEFINE.md) | **Define** | Natural-language judge builder |
| [05 — Simulate](05_PRD_SIMULATE.md) | **Simulate** | Multi-turn conversation testing |
| [06 — Fix](06_PRD_FIX.md) | **Fix** | Failure analysis + Jira/Linear tickets (the Fix Loop) |

## Architecture & system design

| Doc | What it covers |
| --- | --- |
| [07 — Technical Architecture](07_PRD_TECHNICAL.md) | System architecture and tech stack |
| [08 — UI/UX Design System](08_PRD_UI_UX.md) | Design system and UI conventions |
| [15 — Data Hierarchy](15_PRD_DATA_HIERARCHY.md) | How apps, domains, data sets, and judges relate |
| [15 — Template Variables](15_PRD_TEMPLATE_VARIABLES.md) | The `{{response.field}}` variable system for judges |
| [17 — Empty States & Onboarding](17_PRD_EMPTY_STATES_ONBOARDING.md) | First-run experience and progressive onboarding |
