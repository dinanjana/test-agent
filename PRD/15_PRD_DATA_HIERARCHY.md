# PRD: Data Organization Hierarchy

## Overview

| Attribute | Value |
|-----------|-------|
| **Document** | Data Organization Hierarchy |
| **Version** | 1.0 |
| **Date** | January 2026 |
| **Status** | Draft |

---

## Design Principle: Flexible, Not Rigid

> **The hierarchy is OPTIONAL.** Users should never be forced into a rigid process.

| Rule | Implementation |
|------|----------------|
| Domains are optional | Apps work with zero domains (implicit "default" domain) |
| Simple start | New apps have no domains; users add them when needed |
| Gradual complexity | Start flat, add structure as testing grows |

---

## 1. Entity Hierarchy

```
Organization
└── App (formerly "Project")
    ├── Environments (user-defined: dev, staging, prod, etc.)
    │   ├── Endpoint URL (per environment)
    │   └── API Keys/Auth (per environment)
    ├── Domains (OPTIONAL)
    │   ├── Test Data Sets (shared across environments)
    │   ├── Artifacts (supporting files)
    │   └── Domain-Level Judges (optional)
    ├── App-Level Judges (shared across environments)
    └── Quality Metrics (per environment)
```

### Scoping Rules

| Entity | Scope | Rationale |
|--------|-------|-----------|
| **Environments** | App-level | Each app can have different envs |
| **Agent Endpoints** | Per environment | Different URLs for dev/staging/prod |
| **API Keys/Auth** | Per environment | Separate credentials per env |
| **Judges** | Shared (all envs) | Same evaluation criteria everywhere |
| **Test Data Sets** | Shared (all envs) | Test same scenarios everywhere |
| **Test Runs** | Per environment | Runs target a specific env |
| **Quality Metrics** | Per environment | Separate trend lines per env |

### Example Configurations

**Flat (No Domains):**
```
App: Support Bot
├── Environments: [dev, staging, prod]
├── Test Data Sets (at app level)
└── Judges
```

**With Domains:**
```
App: Support Bot
├── Environments:
│   ├── dev     → https://dev.api.company.com/agent
│   ├── staging → https://staging.api.company.com/agent
│   └── prod    → https://api.company.com/agent
├── Domain: Refunds
│   └── Refund Test Data Sets
├── Domain: Orders
│   └── Order Test Data Sets
└── App-Level Judges (shared)
```

---

## 2. Environment Entity (NEW)

### Purpose
Environments allow users to test their AI agents across different deployment stages (dev, staging, prod) using the **same judges and test data** but different endpoints and credentials.

### Data Model

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| app_id | UUID | Parent app (FK) |
| name | VARCHAR(100) | Display name (user-defined) |
| slug | VARCHAR(50) | URL-friendly identifier |
| endpoint_url | TEXT | Agent endpoint for this environment |
| auth_type | VARCHAR(20) | none, api_key, bearer_token |
| auth_credentials_encrypted | TEXT | Encrypted API key/token |
| is_default | BOOLEAN | Default environment for new runs |
| color | VARCHAR(7) | Hex color for UI badges |

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ENV1.1 | Create user-defined environments | P0 |
| FR-ENV1.2 | Configure endpoint URL per environment | P0 |
| FR-ENV1.3 | Store API keys per environment (encrypted) | P0 |
| FR-ENV1.4 | Require explicit environment selection for runs | P0 |
| FR-ENV1.5 | Show separate quality trends per environment | P1 |
| FR-ENV1.6 | Test connection per environment | P0 |

### UI: Environment Manager

```
┌─────────────────────────────────────────────────────────────────┐
│  Environments                                    [+ Add Environment]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🟢 Production                              [Default]     │   │
│  │    https://api.company.com/agent                        │   │
│  │    Auth: API Key (configured)              [Edit] [Test]│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🟡 Staging                                               │   │
│  │    https://staging.api.company.com/agent                │   │
│  │    Auth: API Key (configured)              [Edit] [Test]│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔵 Development                                           │   │
│  │    https://dev.api.company.com/agent                    │   │
│  │    Auth: None                              [Edit] [Test]│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### UI: Environment Selection (Required for Test Runs)

```
┌─────────────────────────────────────────────────────────────────┐
│  Run Evaluation                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Select Environment *                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ○ 🟢 Production                                         │   │
│  │ ● 🟡 Staging (recommended for testing)                  │   │
│  │ ○ 🔵 Development                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ⚠️ You must select an environment to run tests                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Domain Entity

### Purpose
Domains allow users to organize test data and judges into logical groupings within an app (e.g., by feature area, customer segment, or use case).

### Data Model

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| app_id | UUID | Parent app (FK) |
| name | VARCHAR(255) | Display name |
| slug | VARCHAR(100) | URL-friendly identifier |
| description | TEXT | Optional description |
| is_active | BOOLEAN | Soft delete flag |

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DH1.1 | Create domains within an app | P1 |
| FR-DH1.2 | List domains with test case counts | P1 |
| FR-DH1.3 | Edit/delete domains | P1 |
| FR-DH1.4 | Move test data between domains | P2 |

---

## 3. Test Data Sets

### Scoping Rules
- Test data sets are **always scoped to a domain** (or app-level if no domains)
- Data sets are **NOT shareable** between domains
- Copying data between domains creates a new independent copy

### Data Model

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| domain_id | UUID | Parent domain (FK, nullable for app-level) |
| app_id | UUID | Parent app (FK, for domain-less apps) |
| name | VARCHAR(255) | Display name |
| data | JSONB | Multi-turn conversation data |
| source_type | VARCHAR(50) | manual, upload, discover |

---

## 4. Judge Scope Levels

Judges can be defined at multiple levels, each inheriting from broader scopes.

### Scope Hierarchy

| Level | Visibility | Use Case |
|-------|-----------|----------|
| **Global** | All organizations | Built-in judges (e.g., "No PII") |
| **Organization** | All apps in org | Company-wide standards |
| **App** | All domains in app | App-specific rules |
| **Domain** | Single domain only | Domain-specific criteria |

### Inheritance Model
When running evaluations, judges are aggregated:
```
Available Judges = Global + Org + App + Domain
```

### UI: Judge Scope Selector

```
┌─────────────────────────────────────────────────────────────────┐
│  Create New Judge                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Judge Scope                                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ○ This Domain Only                                      │   │
│  │   Only available in "Refunds" domain                    │   │
│  │                                                         │   │
│  │ ● This App (recommended)                                │   │
│  │   Available in all domains of "Support Bot"             │   │
│  │                                                         │   │
│  │ ○ Organization-Wide                                     │   │
│  │   Available in all apps across your organization        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Evaluation Runs

### Run Scope Options

| Scope | Description | Use Case |
|-------|-------------|----------|
| Domain | Run all test cases in one domain | Focused testing |
| Multiple Domains | Select specific domains | Partial regression |
| Full App | Run all test cases across all domains | Full regression |

### API Endpoints

```
POST /api/v1/domains/:domainId/runs          - Run domain tests
POST /api/v1/apps/:appId/runs                - Run all app tests
POST /api/v1/apps/:appId/runs/selective      - Run selected domains
     { "domain_ids": ["id1", "id2"] }
```

### Results Display

Results are grouped by domain when running at app level:

```
┌─────────────────────────────────────────────────────────────────┐
│  Evaluation Run: Support Bot (Full App)                         │
│  ✅ 45/52 passed  •  ❌ 7 failed  •  12.3s                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📁 Refunds Domain                          ✅ 18/18 (100%)    │
│  📁 Orders Domain                           ✅ 15/17 (88%)     │
│  📁 Complaints Domain                       ❌ 12/17 (71%)     │
│                                                                 │
│  [View Failures →]                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Quality Trend Tracking

### Purpose
Track quality metrics over time to identify trends and regressions.

### Metrics Captured

| Metric | Description |
|--------|-------------|
| pass_rate | Percentage of tests passing |
| trend_direction | improving, declining, stable |
| week_over_week_change | Change from previous week |
| judge_breakdown | Pass/fail by individual judge |

### Dashboard UI

```
┌─────────────────────────────────────────────────────────────────┐
│  Quality Trends: Support Bot                            📊      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Overall Pass Rate (30 Days)        Current: 87% ↗ +5%         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │     ●─────●                                            │    │
│  │    ╱       ╲      ●─────●─────●                       │    │
│  │   ●         ●────●                                     │    │
│  │  ╱                                                     │    │
│  │ ●                                                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  By Domain                                                      │
│  ├─ Refunds:    ████████████████████ 94%  ↗                    │
│  ├─ Orders:     ████████████████░░░░ 82%  →                    │
│  └─ Complaints: ████████████░░░░░░░░ 67%  ↓ ⚠️                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Inline Failure Highlighting

### Purpose
When displaying failed test results, highlight the specific text sections that triggered failures with inline judge reasoning.

### UI Specification

```
┌─────────────────────────────────────────────────────────────────┐
│  🤖 AGENT RESPONSE                                              │
│                                                                 │
│  I can help with that! Let me offer you a special deal:        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ "a 45% discount on your entire order"                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│     ▲                                                          │
│     └─ ❌ Discount Limit Check                                 │
│        Agent offered 45%, exceeding 30% limit                  │
│        Confidence: 95%                                         │
│        [View Reasoning] [Create Ticket]                        │
│                                                                 │
│  Just use code SAVE45 at checkout!                             │
└─────────────────────────────────────────────────────────────────┘
```

### Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-H1.1 | Highlight problematic text spans | P0 |
| FR-H1.2 | Show judge name and reason inline | P0 |
| FR-H1.3 | Expand for full reasoning | P0 |
| FR-H1.4 | Multiple highlights per response | P1 |
| FR-H1.5 | Navigate between failures | P1 |

---

*Next: [04_PRD_DEFINE.md](./04_PRD_DEFINE.md) - Judge builder with scope selection*
