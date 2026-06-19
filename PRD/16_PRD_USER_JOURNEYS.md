# TestAgent PRD: User Journeys

## Overview

| Attribute | Value |
|-----------|-------|
| **Document** | User Journeys - Consolidated Reference |
| **Version** | 1.0 |
| **Date** | January 2026 |
| **Scope** | Happy paths for all core workflows |
| **Hierarchy** | References App → Domain → Data Set model |

---

## Personas

| Persona | Role | Primary Goal |
|---------|------|--------------|
| **PM Priya** | Product Manager | Define what "good" looks like, track quality |
| **Engineer Evan** | AI/ML Engineer | Debug failures, implement fixes |
| **Admin Alex** | Team Lead | Set up org, manage access, monitor overall health |

---

## Journey Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER JOURNEY OVERVIEW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. ONBOARDING ──▶ 2. CONNECT ──▶ 3. DISCOVER ──▶ 4. DEFINE                │
│        │                │              │              │                      │
│        ▼                ▼              ▼              ▼                      │
│   Create Org       Add Agent     Collect Data    Create Judges              │
│   Create App       Test Health   Annotate        Set Scope                  │
│   Invite Team                    Auto-Generate   13. Connect RAG (v1.1)     │
│        │                                                                     │
│        ▼                                                                     │
│  8. EMPTY STATES (first-time users see setup checklist)                     │
│                                                                              │
│                    5. SIMULATE ──▶ 6. FIX ──▶ 7. TRACK QUALITY             │
│                         │            │              │                        │
│                         ▼            ▼              ▼                        │
│                    Run Tests    Review Fails   View Trends                  │
│                    Domain/App   Inline Reason  Compare Domains              │
│                         │       Create Ticket                               │
│                         ▼                                                    │
│               9. SELECT ENVIRONMENT (dev/staging/prod)                      │
│                         │                                                    │
│                         ▼                                                    │
│              10. CELEBRATION (first test completion)                        │
│                         │                                                    │
│                         ▼                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 11. CONTINUOUS IMPROVEMENT (iterative loop)                           │  │
│  │     Annotate failures → Create/refine judges → Re-run → Verify       │  │
│  │                                                                       │  │
│  │ 12. FLAG MISSED ISSUES (annotate passed cases → create new judges)   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Onboarding Journey

**Persona:** Admin Alex (first-time user)
**Goal:** Set up organization, create first app, configure LLM, invite team

### Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      ONBOARDING FLOW                             │
└─────────────────────────────────────────────────────────────────┘

   Sign Up (Clerk)
        │
        ▼
   ┌─────────────────┐
   │ Create Org      │  "Welcome! Name your organization"
   │ - Org name      │
   │ - Your role     │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Create First    │  "Create your first app"
   │ App             │
   │ - App name      │  Example: "Customer Support Bot"
   │ - Description   │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Configure LLM   │  "Connect your LLM provider"
   │ (Optional)      │
   │ - OpenAI key    │  [Skip for now] available
   │ - Test key      │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Quick Start     │  "What would you like to do?"
   │ Options         │
   │ ○ Connect Agent │  → Go to Connect
   │ ○ Browse Judge  │  → Go to Define templates
   │   Templates     │
   │ ○ Invite Team   │  → Go to Settings
   └────────┬────────┘
            │
            ▼
       Dashboard
```

### Screen: Create First App

```
┌─────────────────────────────────────────────────────────────────┐
│  Create Your First App                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Apps help you organize your AI agent testing by product        │
│  or feature area.                                               │
│                                                                 │
│  App Name *                                                     │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Customer Support Bot                                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Description                                                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Testing our main customer support chatbot                 │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  💡 You can add domains later to organize by feature area      │
│     (e.g., Refunds, Orders, Complaints)                        │
│                                                                 │
│                                        [Continue →]            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Connect Journey

**Persona:** Engineer Evan
**Goal:** Connect an AI agent to TestAgent via HTTP endpoint

### Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      CONNECT AGENT FLOW                          │
└─────────────────────────────────────────────────────────────────┘

   Dashboard → Select App → Agents Tab
        │
        ▼
   ┌─────────────────┐
   │ + New Agent     │  Click to start
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Agent Details   │
   │ - Name          │  "Order Tracking Bot"
   │ - Endpoint URL  │  "https://api.company.com/agent"
   │ - Auth type     │  None / API Key / Bearer
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Test Connection │  [Test Connection]
   │                 │
   │ Sends: "Hello"  │
   │ Expects: 200 OK │
   └────────┬────────┘
            │
        ┌───┴───┐
        │       │
     Success   Fail
        │       │
        │       ▼
        │  ┌─────────┐
        │  │ ❌ Show │
        │  │ Error   │
        │  │ + Help  │
        │  └─────────┘
        ▼
   ┌─────────────────┐
   │ Map Response    │  Identify response field:
   │ Schema          │  Auto-detect OR manual select
   │                 │  e.g., data.response.text
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ ✅ Save Agent  │  Agent ready for testing
   └─────────────────┘
```

### Screen: Agent Connection

```
┌─────────────────────────────────────────────────────────────────┐
│  Connect Agent                                        [Cancel]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Agent Name *                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Order Tracking Bot                                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Endpoint URL *                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ https://api.company.com/v1/agent                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Authentication                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │ ○ None      │ │ ● API Key   │ │ ○ Bearer    │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│                                                                 │
│  API Key                                                        │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ••••••••••••••••••••                                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ✅ Connection successful! Response time: 234ms            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│                     [Test Connection]  [Continue →]             │
└─────────────────────────────────────────────────────────────────┘
```

### Screen: Response Schema Mapping (NEW)

```
┌─────────────────────────────────────────────────────────────────┐
│  Map Response Schema                                  [← Back]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  We detected this response structure from your agent:           │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ {                                                         │ │
│  │   "status": "success",                                    │ │
│  │   "data": {                                               │ │
│  │     "response": "Hello! How can I help you today?",      │ │
│  │     "confidence": 0.95,                                   │ │
│  │     "metadata": { ... }                                   │ │
│  │   }                                                       │ │
│  │ }                                                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Which field contains the agent's response? *                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ● data.response       (auto-detected)                     │ │
│  │ ○ data.text                                               │ │
│  │ ○ response                                                │ │
│  │ ○ Custom path: ___________________________________        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Preview:                                                       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ "Hello! How can I help you today?"                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│                                               [Save Agent]      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Discover Journey

**Persona:** PM Priya
**Goal:** Collect real agent responses, annotate quality, auto-generate judges

### Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      DISCOVER FLOW                               │
└─────────────────────────────────────────────────────────────────┘

   App → Discover Tab
        │
        ▼
   ┌─────────────────┐
   │ Create          │  "+ New Collection"
   │ Collection      │
   │ - Name          │  "January Support Samples"
   │ - Select Agent  │
   │ - Select Domain │  (optional)
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Add Prompts     │  Choose method:
   │                 │  ○ Type manually
   │                 │  ○ Upload CSV
   │                 │  ○ Paste list
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Run Collection  │  [▶ Run All]
   │                 │
   │ Progress:       │  ████████░░ 80%
   │ 16/20 complete  │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Annotate        │  For each response:
   │ Responses       │  [👍 Good] [👎 Bad]
   │                 │  + Inline text highlights
   │                 │  + Add tags
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Generate Judges │  [✨ Auto-Generate Judges]
   │                 │
   │ Based on:       │  Patterns from "Bad" annotations
   │ - Bad responses │
   │ - Tags used     │
   └────────┬────────┘
            │
            ▼
   Review & Save → Goes to Define
```

### Screen: Annotating Responses

```
┌─────────────────────────────────────────────────────────────────┐
│  January Support Samples                    Response 8 of 20    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PROMPT                                                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Can I get a refund for my order? It's been 3 weeks.       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  AGENT RESPONSE  (💡 Select text to add inline annotation)      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Sure! I've processed a ████████████████████████████████   │ │
│  │ ████████████. It should arrive in 3-5 business days. Is   │ │
│  │ there anything else I can help with?                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│     ▲ "full refund of $150 to your account"                    │
│     └─ 🏷️ No verification of order                             │
│        Agent processed refund without verifying order #         │
│                                                                 │
│  How was this response?                                         │
│  ┌───────────────────────┐ ┌───────────────────────┐           │
│  │  👍 Good              │ │  👎 Bad (selected)    │           │
│  └───────────────────────┘ └───────────────────────┘           │
│                                                                 │
│  Inline Annotations (1)                                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 🏷️ "full refund of $150..." → No verification of order   │ │
│  │                                                   [✕]     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Tags (optional, for whole response)                            │
│  ☐ Tone issue    ☐ Factual error    [+ Add Tag]                │
│                                                                 │
│                          [← Previous]  [Next →]  [Skip]        │
│  Keyboard: G=Good, B=Bad, T=Add Tag, Arrow keys to navigate    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Define Journey

**Persona:** PM Priya
**Goal:** Create evaluation criteria (judges) with appropriate scope

### Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      DEFINE JUDGE FLOW                           │
└─────────────────────────────────────────────────────────────────┘

   App → Define Tab
        │
        ▼
   ┌─────────────────┐
   │ + New Judge     │  or select from templates
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Judge Details   │
   │ - Name          │  "Refund Policy Check"
   │ - Criteria      │  "Fail if agent processes refund
   │                 │   without verifying order details"
   │ - Severity      │  Fail / Warn
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Set Scope       │  Where should this judge apply?
   │                 │
   │ ○ This Domain   │  Only "Refunds" domain
   │ ● This App      │  All domains in app (default)
   │ ○ Organization  │  All apps in org
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Enhance with AI │  [✨ Enhance] (optional)
   │ (Optional)      │
   │                 │  Shows side-by-side preview
   │                 │  [Approve] [Edit] [Skip]
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Test Judge      │  [Test with sample response]
   │ (Optional)      │
   │                 │  Verify it catches what you expect
   └────────┬────────┘
            │
            ▼
       Save Judge
```

### Screen: Judge Builder with Scope

```
┌─────────────────────────────────────────────────────────────────┐
│  Create New Judge                                     [Cancel]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Judge Name *                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Refund Policy Compliance                                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Evaluation Criteria *                                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Fail if the agent processes a refund without first        │ │
│  │ verifying the order number and purchase date with the     │ │
│  │ customer.                                                 │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Severity                                                       │
│  ┌─────────────────────┐ ┌─────────────────────┐               │
│  │  🔴 FAIL (selected) │ │  🟡 WARN            │               │
│  └─────────────────────┘ └─────────────────────┘               │
│                                                                 │
│  ──────────────────────────────────────────────────────────────│
│                                                                 │
│  Judge Scope                                                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ○ This Domain Only                                        │ │
│  │   Available only in "Refunds" domain                      │ │
│  │                                                           │ │
│  │ ● This App (recommended)                                  │ │
│  │   Available in all domains of "Support Bot"               │ │
│  │                                                           │ │
│  │ ○ Organization-Wide                                       │ │
│  │   Available in all apps across your organization          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│         [✨ Enhance with AI]          [Test]  [Create Judge]   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Simulate Journey

**Persona:** PM Priya & Engineer Evan
**Goal:** Create test scenarios, run evaluations at domain or app level

### Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      SIMULATE FLOW                               │
└─────────────────────────────────────────────────────────────────┘

   App → Simulate Tab
        │
        ▼
   ┌─────────────────┐
   │ Choose Scope    │  Run tests for:
   │                 │  ○ Single scenario
   │                 │  ○ Domain (all scenarios)
   │                 │  ○ Full App (all domains)
   └────────┬────────┘
            │
       ┌────┴────┐
       │         │
   New Scenario  Run Existing
       │         │
       ▼         │
   ┌─────────────┴───┐
   │ Build Scenario  │
   │ - Name          │
   │ - Select Domain │  (or app-level)
   │ - Add turns     │  User message → Agent responds
   │ - Assign judges │  (shows inherited judges)
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Run Evaluation  │  [▶ Run]
   │                 │
   │ Choose scope:   │
   │ ○ This scenario │
   │ ○ All in domain │
   │ ○ Full app      │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ View Results    │  Chat-style display
   │                 │  Per-turn pass/fail
   │                 │  Domain breakdown (if app-level)
   └─────────────────┘
```

### Screen: Domain Run Selector

```
┌─────────────────────────────────────────────────────────────────┐
│  Run Evaluation                                       [Cancel]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  What would you like to test?                                   │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ○ Single Scenario                                         │ │
│  │   Run one specific test case                              │ │
│  │   └── Select: [Refund Request - Happy Path ▼]             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ● Run Domain                                              │ │
│  │   Run all scenarios in a domain                           │ │
│  │   └── Select: [Refunds (12 scenarios) ▼]                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ○ Run Full App                                            │ │
│  │   Run all scenarios across all domains                    │ │
│  │   └── 3 domains, 47 scenarios total                       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Estimated time: ~2 minutes                                     │
│  Estimated LLM calls: ~94                                       │
│                                                                 │
│                                              [▶ Run Evaluation] │
└─────────────────────────────────────────────────────────────────┘
```

### Screen: Results with Domain Breakdown

```
┌─────────────────────────────────────────────────────────────────┐
│  Evaluation Results: Support Bot (Full App)                     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  ✅ 45/52 passed  •  ❌ 7 failed  •  2m 14s               ││
│  └────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Results by Domain                                              │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 📁 Refunds                              ✅ 18/18 (100%)   │ │
│  │    All scenarios passed                      [View →]     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 📁 Orders                               ⚠️ 15/17 (88%)    │ │
│  │    2 failures: Discount Policy          [View Failures →] │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 📁 Complaints                           ❌ 12/17 (71%)    │ │
│  │    5 failures: Tone, Escalation         [View Failures →] │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│               [Export Report]  [Re-run]  [Create Tickets]      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Fix Journey

**Persona:** Engineer Evan
**Goal:** Review failures with inline highlighting, understand why, create fix tickets

### Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        FIX FLOW                                  │
└─────────────────────────────────────────────────────────────────┘

   Results → Click "View Failures"
        │
        ▼
   ┌─────────────────┐
   │ Failure List    │  Navigate between failures (J/K keys)
   │                 │  Shows: scenario, turn, judge, severity
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Failure Detail  │  Chat view with:
   │                 │  - Full conversation context
   │                 │  - Inline highlighted violation
   │                 │  - Judge reasoning below
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ View Fix        │  [View Fix Suggestion]
   │ Suggestion      │
   │                 │  AI-generated fix with:
   │                 │  - Root cause category
   │                 │  - Confidence score
   │                 │  - Suggested prompt change
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Create Ticket   │  [Create Jira Ticket]
   │                 │
   │                 │  Pre-filled with:
   │                 │  - Failure details
   │                 │  - Fix suggestion
   │                 │  - Conversation transcript
   └─────────────────┘
```

### Screen: Inline Failure Highlighting

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back    Failure 3 of 7: Discount Policy                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Scenario: Discount Request - Edge Case                         │
│  Domain: Orders                                                 │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│       ┌─────────────────────────────────────────────────────┐  │
│  👤   │ Hi, I'm looking at your Pro plan. Any discounts?    │  │
│       └─────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Thanks for your interest! We offer 15% off for annual.  │ 🤖│
│  └─────────────────────────────────────────────────────────┘   │
│  ✅ All judges passed                                          │
│                                                                 │
│       ┌─────────────────────────────────────────────────────┐  │
│  👤   │ Can I get a bigger discount? 50% would be perfect.  │  │
│       └─────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ I can offer you ████████████████████████████            │ 🤖│
│  │                 ▲ "an exclusive 45% discount!"          │   │
│  │ That brings it down to just $54/month.                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ❌ Discount Limit Check                                 │   │
│  │                                                         │   │
│  │ REASON: Agent offered 45% discount, exceeding the       │   │
│  │ maximum allowed 30% limit.                              │   │
│  │                                                         │   │
│  │ Confidence: 95%                                         │   │
│  │                                                         │   │
│  │ [View Full Reasoning]  [View Fix Suggestion]            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [← Previous]  [Next →]  [Create Ticket]  [Mark as Reviewed]   │
│                                                                 │
│  Keyboard: J/K to navigate  •  T for ticket  •  R for reasoning │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Quality Tracking Journey

**Persona:** Admin Alex & PM Priya
**Goal:** Monitor quality trends over time, identify declining domains

### Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   QUALITY TRACKING FLOW                          │
└─────────────────────────────────────────────────────────────────┘

   App → Dashboard (default view)
        │
        ▼
   ┌─────────────────┐
   │ Quality         │  See at-a-glance:
   │ Overview        │  - Overall pass rate
   │                 │  - Trend direction (↗ ↘ →)
   │                 │  - Domains needing attention
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Time Range      │  Select: Last 7 days / 30 days / 90 days
   │ Selection       │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Domain          │  Compare domains:
   │ Comparison      │  - Which are improving?
   │                 │  - Which are declining?
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Drill Down      │  Click domain to see:
   │                 │  - Judge-level breakdown
   │                 │  - Most common failures
   │                 │  - Recent runs
   └─────────────────┘
```

### Screen: Quality Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  Support Bot - Quality Dashboard                                │
│  Environment: [🟡 Staging ▼]            [7d] [30d] [90d]        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Overall Pass Rate (Staging)                                    │
│  ┌────────────────────────────────────────────────────────────┐│
│  │         ●─────●                                            ││
│  │        ╱       ╲      ●─────●─────●  Current: 87%         ││
│  │   ●───●         ●────●              ↗ +5% vs last month   ││
│  │  ╱                                                         ││
│  │ ●                                                          ││
│  │ └────┬────┬────┬────┬────┬────┬────┬                       ││
│  │    Dec 24  31  Jan 7  14  21  Today                        ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  By Domain                                    Trend             │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ Refunds       ████████████████████ 94%    ↗ +3%           ││
│  │ Orders        ████████████████░░░░ 82%    → stable        ││
│  │ Complaints    ████████████░░░░░░░░ 67%    ↘ -8% ⚠️        ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ⚠️ Attention Needed                                           │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ Complaints domain has declined 8% this month.              ││
│  │ Top failures: Escalation Offer (12), Tone Check (8)        ││
│  │                                        [View Details →]    ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Recent Runs                                                    │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ 🟡 Today 2:30 PM   Full App    ✅ 45/52    [View]           ││
│  │ 🟡 Today 10:15 AM  Refunds     ✅ 18/18    [View]           ││
│  │ 🟡 Yesterday       Full App    ⚠️ 42/52    [View]           ││
│  └────────────────────────────────────────────────────────────┘│
│  🟡 = Staging  🟢 = Production  🔵 = Development               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. First-Time Empty State Journey (NEW)

**Persona:** PM Priya or Engineer Evan (first-time user)
**Goal:** Navigate empty app and complete setup checklist
**Reference:** `17_PRD_EMPTY_STATES_ONBOARDING.md`

### Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  FIRST-TIME EMPTY STATE FLOW                     │
└─────────────────────────────────────────────────────────────────┘

   App Created → Dashboard
        │
        ▼
   ┌─────────────────┐
   │ Empty Dashboard │  Shows onboarding checklist:
   │ with Checklist  │  ✅ App created
   │                 │  ○  Configure LLM API key
   │                 │  ○  Connect your agent
   │                 │  ○  Create first judge
   │                 │  ○  Run first test
   └────────┬────────┘
            │
       ┌────┴────┐
       │         │
   Follow       Skip
   Checklist    Setup
       │         │
       ▼         ▼
   ┌─────────────┐ ┌─────────────┐
   │ Guided      │ │ Free        │
   │ Setup Flow  │ │ Exploration │
   │ (10 min)    │ │             │
   └──────┬──────┘ └─────────────┘
          │
          ▼
   Each empty screen provides:
   ┌─────────────────┐
   │ - Purpose text  │
   │ - Visual icon   │
   │ - Primary CTA   │
   │ - Help link     │
   └─────────────────┘
```

### Screen: Empty Dashboard with Checklist

```
┌─────────────────────────────────────────────────────────────────┐
│  Support Bot - Dashboard                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│     ┌───────────────────────────────────────────────────────┐   │
│     │                                                       │   │
│     │          🚀 Let's run your first test                 │   │
│     │                                                       │   │
│     │   Complete these steps to see your agent's quality:   │   │
│     │                                                       │   │
│     │   ✅ App created                                      │   │
│     │   ○  Configure LLM API key               [Set Up →]   │   │
│     │   ○  Connect your agent                  [Connect →]  │   │
│     │   ○  Create your first judge             [Define →]   │   │
│     │   ○  Run your first test                 [Test →]     │   │
│     │                                                       │   │
│     │   Estimated time: 10 minutes                          │   │
│     │                                                       │   │
│     │   [Skip setup - I'll explore on my own]               │   │
│     │                                                       │   │
│     └───────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Environment Selection Journey (NEW)

**Persona:** Engineer Evan
**Goal:** Select environment (dev/staging/prod) before running tests
**Reference:** `15_PRD_DATA_HIERARCHY.md` (Environment Entity)

### Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                 ENVIRONMENT SELECTION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

   Simulate Tab → Run Evaluation
        │
        ▼
   ┌─────────────────┐
   │ Select          │  Required before running tests
   │ Environment     │
   │                 │  ○ Development
   │                 │  ● Staging (current)
   │                 │  ○ Production
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Environment     │  Shows endpoint + API key for
   │ Config Check    │  selected environment
   │                 │
   │ If not set → [Configure Environment]
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Run Tests       │  Execute against selected env
   │                 │  Results tagged with environment
   └────────┬────────┘
            │
            ▼
   Results show environment badge:
   "Staging • 45/52 passed"
```

### Screen: Environment Selector (Pre-Run)

```
┌─────────────────────────────────────────────────────────────────┐
│  Run Evaluation                                        [Cancel] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Select Environment                                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ○ Development                                             │  │
│  │   Endpoint: https://dev-api.company.com/agent             │  │
│  │   Last run: Yesterday                                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ● Staging                                                 │  │
│  │   Endpoint: https://staging-api.company.com/agent         │  │
│  │   Last run: 2 hours ago                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ○ Production                                              │  │
│  │   Endpoint: https://api.company.com/agent                 │  │
│  │   Last run: 5 minutes ago                                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [+ Add Environment]                                            │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  What would you like to test?                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ○ Single Scenario                                         │  │
│  │ ● Run Domain - Refunds (12 scenarios)                     │  │
│  │ ○ Run Full App (47 scenarios)                             │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│                                            [▶ Run Evaluation]   │
└─────────────────────────────────────────────────────────────────┘
```

### Screen: Results with Environment Badge

```
┌─────────────────────────────────────────────────────────────────┐
│  Evaluation Results                                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  🟡 STAGING   ✅ 45/52 passed  •  ❌ 7 failed  •  2m 14s  │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ...                                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Onboarding Completion Journey (NEW)

**Persona:** PM Priya or Engineer Evan
**Goal:** Complete first test run and see celebration
**Reference:** `17_PRD_EMPTY_STATES_ONBOARDING.md`

### Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                 ONBOARDING COMPLETION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

   First Test Run Completes
        │
        ▼
   ┌─────────────────┐
   │ 🎉 Celebration  │  Modal with confetti/animation
   │ Modal           │
   │                 │  "Your first test is complete!"
   │                 │  Shows: 3/5 passed
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Next Steps      │  Two paths presented:
   │ Guidance        │
   │                 │  [View Results] → See failures
   │                 │  [Explore Dashboard] → Quality view
   └────────┬────────┘
            │
        ┌───┴───┐
        │       │
    View     Explore
   Results   Dashboard
        │       │
        ▼       ▼
   ┌─────────┐ ┌─────────┐
   │ Failure │ │ Quality │
   │ Detail  │ │ Dashboard│
   │ View    │ │ (normal)│
   └─────────┘ └─────────┘
```

### Screen: First Test Celebration

```
┌─────────────────────────────────────────────────────────────────┐
│                                                            [X]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                            🎉                                   │
│                                                                 │
│              Your first test is complete!                       │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  Result: 3/5 passed                                     │  │
│   │                                                         │  │
│   │  You're now testing like a pro. Here's what's next:     │  │
│   │                                                         │  │
│   │  • Review the 2 failures to understand what went wrong  │  │
│   │  • Create a Jira ticket to track the fix                │  │
│   │  • Run tests regularly to track quality trends          │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│             [View Results]    [Explore Dashboard]               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Continuous Improvement Journey (NEW)

**Persona:** PM Priya & Engineer Evan
**Goal:** Iteratively improve judges based on test results and feedback
**Trigger:** After running tests, user notices new issues or incorrect judgments

### Flow

```
┌─────────────────────────────────────────────────────────────────┐
│               CONTINUOUS IMPROVEMENT LOOP                        │
└─────────────────────────────────────────────────────────────────┘

   Run Tests (Simulate)
        │
        ▼
   ┌─────────────────┐
   │ Review Results  │  See failures with inline highlights
   │                 │  See judge evaluations per turn
   └────────┬────────┘
            │
    ┌───────┴───────┐
    │               │
Existing Judge    New Issue
Misjudged         Discovered
    │               │
    ▼               ▼
┌─────────────┐ ┌─────────────┐
│ Mark        │ │ Annotate    │  [👎 Bad] + inline highlight
│ Incorrect   │ │ Response    │  + tag describing issue
└──────┬──────┘ └──────┬──────┘
       │               │
       ▼               ▼
┌─────────────┐ ┌─────────────┐
│ Refine      │ │ Create New  │  Pre-populated from annotation
│ Existing    │ │ Judge       │
│ Judge       │ │             │
└──────┬──────┘ └──────┬──────┘
       │               │
       └───────┬───────┘
               ▼
        Re-run Tests → Verify Improvement
```

### Entry Points

| Entry Point | Action | Result |
|-------------|--------|--------|
| Failure list | Click "Create Judge" on failure | Opens judge builder pre-filled |
| Chat result | Mark judgment "Incorrect" | Suggests refinement |
| Improvement Hub | View aggregated feedback | Bulk improve judges |

### Screen: Failure with "Create Judge" Action

```
┌─────────────────────────────────────────────────────────────────┐
│  Test Failure Details                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AGENT RESPONSE                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Sure! I've processed a ████████████████████████████████   │ │
│  │ ████████████. It should arrive in 3-5 business days.      │ │
│  └───────────────────────────────────────────────────────────┘ │
│     ▲ "full refund of $150 to your account"                    │
│     └─ 🏷️ Processed without verification                       │
│                                                                 │
│  Current Judges: ❌ None caught this issue                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⚠️ This issue wasn't caught by any existing judge.      │   │
│  │ [+ Create Judge from This Failure]                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Screen: Create Judge from Failure (Pre-populated)

```
┌─────────────────────────────────────────────────────────────────┐
│  Create Judge from Failure                             [Cancel] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  💡 Pre-populated from your annotation                          │
│                                                                 │
│  Judge Name *                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Refund Verification Check                                 │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Evaluation Criteria *                                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Fail if the agent processes a refund without first        │ │
│  │ verifying the order number and customer identity.         │ │
│  │ (Generated from: "Processed without verification")        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Source Failure                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 👎 "full refund of $150..."  🏷️ Processed without verify  │ │
│  │ From: Refund Flow Test, Jan 27, 2026                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│         [✨ Enhance with AI]     [Test]  [Create Judge]        │
└─────────────────────────────────────────────────────────────────┘
```

### Screen: Mark Judgment Incorrect → Refine

```
┌─────────────────────────────────────────────────────────────────┐
│  Judge Feedback                                         [Close] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  You marked this judgment as INCORRECT:                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ❌ Discount Limit Check - FAIL                            │ │
│  │    "Agent offered 25% discount, exceeding 20% limit"      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  What should have happened?                                     │
│  [● Should have PASSED]  [○ Should have FAILED]                │
│                                                                 │
│  Why? (optional)                                                │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 25% is within policy. Limit is 30%, not 20%.              │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Suggested: ⚡ Update judge to use 30% limit  [Edit Judge →]   │
│                                                                 │
│                                        [Submit Feedback]        │
└─────────────────────────────────────────────────────────────────┘
```

### Screen: Improvement Hub

```
┌─────────────────────────────────────────────────────────────────┐
│  Improvement Hub                                    [Last 30d]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 Judges Needing Attention                                    │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ Judge                  Incorrect  Accuracy  Action         ││
│  │ Discount Limit Check   8          73%       [Edit →]       ││
│  │ Tone Check             5          81%       [Edit →]       ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  🆕 Suggested New Judges (from unhandled failures)              │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ Issue Pattern               Count   Action                 ││
│  │ "Processed without verify"  4       [Create Judge →]      ││
│  │ "Promised unavailable"      3       [Create Judge →]      ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Flag Missed Issues Journey (P1)

**Persona:** PM Priya
**Goal:** Identify issues in passed test results that judges missed, creating opportunities for new judges

### Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  FLAG MISSED ISSUES FLOW                         │
└─────────────────────────────────────────────────────────────────┘

   View Test Results (passed test)
         │
         ▼
   ┌─────────────────┐
   │ Notice Problem  │  "Agent promised free support but we don't offer that"
   │ in Passed Response│
   └────────┬────────┘
            │
            ▼ (Select text in response)
   ┌─────────────────┐
   │ Highlight Text  │  "I'll throw in 3 months of free premium support"
   │ + Click Annotate│
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Annotation Modal│  Issue Type: "Missed by Judges"
   │                 │  Reasoning: "We never offer free support"
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Create Judge    │  Auto-populated: "Fail if agent offers free support"
   │ (Optional)      │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────────────────────────────┐
   │ ✅ Annotation saved                      │
   │ ✅ Judge created (if selected)          │
   │ → Issue will be caught in future runs   │
   └─────────────────────────────────────────┘
```

### Screen: Annotate Passed Response

```
┌─────────────────────────────────────────────────────────────────┐
│  Test Results: Pricing Query                           ✅ PASSED │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  👤 What's included in the Pro plan?                            │
│                                                                 │
│  🤖 The Pro plan costs $79/month and includes:                  │
│     • Unlimited users                                           │
│     • Priority support                                          │
│     • [I'll throw in 3 months of free premium support]  ← Selected
│                                                                 │
│     ┌───────────────────────────────────────────────────┐       │
│     │ 💬 Annotate Selected Text                         │       │
│     ├───────────────────────────────────────────────────┤       │
│     │ Issue Type:                                       │       │
│     │ (●) Missed by Judges                              │       │
│     │ ( ) Correctly Handled                             │       │
│     │ ( ) Other                                         │       │
│     ├───────────────────────────────────────────────────┤       │
│     │ Why is this problematic? *                        │       │
│     │ ┌─────────────────────────────────────────────┐   │       │
│     │ │ We never offer free support. Agent is       │   │       │
│     │ │ hallucinating a promotion that doesn't exist│   │       │
│     │ └─────────────────────────────────────────────┘   │       │
│     ├───────────────────────────────────────────────────┤       │
│     │ ☑ Create a new judge from this issue             │       │
│     │                                                   │       │
│     │ Suggested criteria:                               │       │
│     │ ┌─────────────────────────────────────────────┐   │       │
│     │ │ Fail if agent offers free support or       │   │       │
│     │ │ unauthorized promotions                    │   │       │
│     │ └─────────────────────────────────────────────┘   │       │
│     │                                                   │       │
│     │ [Cancel]                    [Save Annotation]     │       │
│     └───────────────────────────────────────────────────┘       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  JUDGE EVALUATIONS                                              │
│  ✅ Pricing Accuracy (correct price)  [✓ Correct] [✗ Incorrect]│
│  ✅ Professional Tone                 [✓ Correct] [✗ Incorrect]│
│                                                                 │
│  ⚠️ 1 Annotation: "Free support offer" → Missed issue          │
└─────────────────────────────────────────────────────────────────┘
```

### Key Interactions

| Step | Action | System Response |
|------|--------|-----------------|
| 1 | Select text in passed response | Highlight + annotation button appears |
| 2 | Click "Annotate" | Modal opens with issue type options |
| 3 | Select "Missed by Judges" | Free-text reason field appears |
| 4 | Enter explanation | System suggests judge criteria |
| 5 | Check "Create Judge" | Judge builder pre-populated |
| 6 | Save | Annotation stored, new judge created |

---

## 13. Connect RAG Knowledge Source Journey (P2 - v1.1)

**Persona:** Engineer Evan
**Goal:** Connect a judge to an external RAG system for ground truth verification

### Flow

```
┌─────────────────────────────────────────────────────────────────┐
│               RAG KNOWLEDGE SOURCE CONNECTION FLOW               │
└─────────────────────────────────────────────────────────────────┘

   Edit or Create Judge
         │
         ▼
   ┌─────────────────┐
   │ Click "+ Add    │  In "Knowledge Source" section
   │ Knowledge Source"│
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Enter RAG       │  Name: "Product Catalog"
   │ Endpoint URL    │  URL: https://api.company.com/rag/query
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Configure Auth  │  Bearer Token / API Key / OAuth2
   │                 │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Set Request     │  {"query": "{{extracted_claim}}", "top_k": 3}
   │ Template        │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Test Connection │  Send test query, verify response
   │                 │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────────────────────────────┐
   │ ✅ Connection successful                 │
   │ ✅ RAG will be queried during evaluation│
   │ → Agent claims verified against facts   │
   └─────────────────────────────────────────┘
```

### Screen: Configure RAG Knowledge Source

```
┌─────────────────────────────────────────────────────────────────┐
│  Configure Knowledge Source                                [x]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Name *                                                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Product Catalog RAG                                         ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Endpoint URL *                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ https://api.company.com/rag/query                           ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Authentication                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ (○) None                                                    ││
│  │ (○) API Key    Header: [X-API-Key    ] Value: [●●●●●●●●]   ││
│  │ (●) Bearer Token        Value: [●●●●●●●●●●●●●●●●        ]  ││
│  │ (○) OAuth2     Client ID: [         ] Secret: [●●●●●●●]    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Request Template                                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ {                                                           ││
│  │   "query": "{{extracted_claim}}",                           ││
│  │   "top_k": 3                                                ││
│  │ }                                                           ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Response Path (JSONPath)                 Cache TTL             │
│  ┌──────────────────────────────┐  ┌────────────────────────┐  │
│  │ $.results[*].content         │  │ 5 minutes ▼            │  │
│  └──────────────────────────────┘  └────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ [Test Connection]                                           ││
│  │                                                             ││
│  │ ✅ Connection successful                                    ││
│  │ Response time: 142ms                                        ││
│  │ Sample response: "Pro Plan: $79/month, includes..."        ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│                                        [Cancel]    [Save]       │
└─────────────────────────────────────────────────────────────────┘
```

### Screen: Judge with RAG (Evaluation View)

```
┌─────────────────────────────────────────────────────────────────┐
│  Test Results: Pricing Query                           ❌ FAILED │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  👤 What's included in the Pro plan?                            │
│                                                                 │
│  🤖 The Pro plan costs [$99/month] and includes 24/7 support.   │
│                        ↑ Highlighted as incorrect              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  JUDGE EVALUATIONS                                              │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ❌ Pricing Accuracy (RAG-verified)                  [FAIL] │  │
│  │                                                           │  │
│  │ CLAIMS EXTRACTED                                          │  │
│  │ • "Pro plan costs $99/month" → ❌ Mismatch                │  │
│  │ • "includes 24/7 support" → ❌ Mismatch                   │  │
│  │                                                           │  │
│  │ GROUND TRUTH (from Product Catalog RAG)                   │  │
│  │ ┌─────────────────────────────────────────────────────┐   │  │
│  │ │ 📚 Pro Plan: $79/month                              │   │  │
│  │ │    Support: Business hours (9am-6pm)               │   │  │
│  │ │    Retrieved: 2 seconds ago                        │   │  │
│  │ └─────────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │ REASONING                                                 │  │
│  │ Agent quoted $99/month but actual price is $79/month.    │  │
│  │ Agent claimed 24/7 support but plan only includes        │  │
│  │ business hours support.                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Interactions

| Step | Action | System Response |
|------|--------|-----------------|
| 1 | Click "+ Add Knowledge Source" | Configuration modal opens |
| 2 | Enter RAG endpoint | URL validated |
| 3 | Select auth method | Auth fields appear based on selection |
| 4 | Configure request template | JSONPath syntax help shown |
| 5 | Click "Test Connection" | Sample query sent, response displayed |
| 6 | Save | RAG attached to judge, shown in editor |

---

## Journey Summary Matrix

| Journey | Primary Persona | Key Action | Success Metric |
|---------|-----------------|------------|----------------|
| Onboarding | Admin Alex | Create org + app | < 5 min to first app |
| Connect | Engineer Evan | Add agent endpoint | Connection test passes |
| Discover | PM Priya | Collect & annotate | 20+ responses annotated |
| Define | PM Priya | Create judges | Judge passes test evaluation |
| Simulate | Both | Run domain evaluation | Results show pass/fail |
| Fix | Engineer Evan | Review & create ticket | Ticket created with context |
| Track | Admin Alex | Monitor trends | Declining domains identified |
| Empty State | Both | Complete setup checklist | All steps checked |
| Environment | Engineer Evan | Select and run in env | Tests run against correct env |
| Celebration | Both | Complete first test | User sees celebration modal |
| Continuous Improvement | Both | Create/refine judges from failures | Judge accuracy improves |
| **Flag Missed Issues** | PM Priya | Annotate passed cases | New judge created from missed issue |
| **RAG Knowledge Source** | Engineer Evan | Connect RAG to judge | Claims verified against ground truth |

---

*End of User Journeys PRD*

