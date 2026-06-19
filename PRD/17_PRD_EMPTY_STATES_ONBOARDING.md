# TestAgent PRD: Empty States & Progressive Onboarding

## Overview

| Attribute | Value |
|-----------|-------|
| **Document** | Empty States & Progressive Onboarding |
| **Version** | 1.0 |
| **Date** | January 2026 |
| **Priority** | P0 - Critical for first-time user experience |
| **Gap Identified** | No specification for user experience when app has zero data |

---

## Problem Statement

After app creation, users land on a dashboard with **zero data**. Current PRDs specify happy paths for populated states but don't address:
- What does an empty dashboard look like?
- How is the user guided to their "aha!" moment?
- What is the minimum path to value?

**Impact:** Without clear guidance, users will be confused, drop off, and TestAgent loses the "< 25 min to first test" goal.

---

## Expert Perspectives Consulted

### UI/UX Expert View
> "Empty states are not truly empty—they are intentionally designed touchpoints. An empty screen should never be a dead end. Instead, it should offer a clear path forward with action-oriented CTAs, visual illustration, and contextual guidance."

**Key principles:**
- Empty states should **educate** (explain what goes here)
- Empty states should **activate** (provide clear next action)
- Empty states should **celebrate** (acknowledge completion)

### Product Manager View
> "Time to Value (TTV) is the duration it takes for a new user to realize their first significant benefit. Most SaaS products fall into 'long time to value' where users need multiple steps. The PM's job is to ruthlessly eliminate friction and guide users to their aha! moment."

**Key principles:**
- Define what "value" means for TestAgent (= seeing first test result)
- Track onboarding completion rates
- Personalize based on user role (PM vs Engineer)

### Software Architect View
> "Progressive onboarding must be data-driven with clear state tracking. The system needs to know: what has the user completed? What's blocking them? This requires explicit onboarding state persistence and conditional UI rendering based on setup completion."

**Key principles:**
- Track onboarding checklist completion per app
- Store setup state in database
- Support skipping + resuming onboarding

---

## 1. Onboarding Checklist System

### Definition of "Value" for TestAgent

| Milestone | Achievement | Why It Matters |
|-----------|-------------|----------------|
| **First Value** | User sees first test result (pass/fail) | Proves the product works |
| **Repeat Value** | User creates second judge or scenario | Shows stickiness |
| **Full Value** | User creates Jira ticket from failure | Completes the Fix Loop |

### Required Setup Steps (Minimum Path to Value)

| Step | Required | Dependency | Est. Time |
|------|----------|------------|-----------|
| 1. Configure LLM API key | Yes | None | 2 min |
| 2. Connect first agent | Yes | None | 3 min |
| 3. Create or select first judge | Yes | None | 2 min |
| 4. Create first test scenario | Yes | Agent, Judge | 3 min |
| 5. Run first test | Yes | Scenario | 30 sec |

**Total: ~10 minutes to first value** (vs. 25 min target = buffer for learning)

### Data Model: Onboarding State

```sql
CREATE TABLE app_onboarding_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Step completion flags
  llm_configured BOOLEAN DEFAULT FALSE,
  first_agent_connected BOOLEAN DEFAULT FALSE,
  first_judge_created BOOLEAN DEFAULT FALSE,
  first_scenario_created BOOLEAN DEFAULT FALSE,
  first_test_run BOOLEAN DEFAULT FALSE,
  first_failure_reviewed BOOLEAN DEFAULT FALSE,
  first_ticket_created BOOLEAN DEFAULT FALSE,
  
  -- Onboarding metadata
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  skipped_at TIMESTAMP,
  
  UNIQUE(project_id)
);
```

---

## 2. Empty State Specifications

### 2.1 Dashboard Empty State

**Trigger:** App has zero test runs

```
┌─────────────────────────────────────────────────────────────────┐
│  Support Bot - Dashboard                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │            🚀 Let's run your first test                   │ │
│  │                                                           │ │
│  │   Complete these steps to see your agent's quality:       │ │
│  │                                                           │ │
│  │   ┌─────────────────────────────────────────────────────┐│ │
│  │   │ ✅ App created                                       ││ │
│  │   │ ○  Configure LLM API key                  [Set Up →] ││ │
│  │   │ ○  Connect your agent                     [Connect →]││ │
│  │   │ ○  Create your first judge                [Define →] ││ │
│  │   │ ○  Run your first test                    [Test →]   ││ │
│  │   └─────────────────────────────────────────────────────┘│ │
│  │                                                           │ │
│  │   Estimated time: 10 minutes                              │ │
│  │                                                           │ │
│  │   [Skip setup - I'll explore on my own]                   │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Functional Requirements:**

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ES1.1 | Show checklist progress on empty dashboard | P0 |
| FR-ES1.2 | Each item links to relevant setup screen | P0 |
| FR-ES1.3 | Completed items show checkmark | P0 |
| FR-ES1.4 | Allow skipping guided setup | P0 |
| FR-ES1.5 | Estimate remaining time | P1 |

---

### 2.2 Agents Tab Empty State

**Trigger:** Zero agents connected to app

```
┌─────────────────────────────────────────────────────────────────┐
│  Agents                                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│         ┌───────────────────────────────────────────┐           │
│         │       🔌                                  │           │
│         │                                           │           │
│         │   Connect your first agent                │           │
│         │                                           │           │
│         │   TestAgent tests AI agents via their     │           │
│         │   HTTP endpoint. No code changes needed.  │           │
│         │                                           │           │
│         │   You'll need:                            │           │
│         │   • Your agent's API endpoint URL         │           │
│         │   • API key (if required)                 │           │
│         │                                           │           │
│         │         [+ Connect Agent]                 │           │
│         │                                           │           │
│         │   Not sure? [View setup guide →]          │           │
│         │                                           │           │
│         └───────────────────────────────────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Design Notes:**
- Illustration communicates purpose visually
- Requirements listed upfront (reduces failed attempts)
- Link to documentation for stuck users

---

### 2.3 Judge Library Empty State

**Trigger:** Zero custom judges, only templates available

```
┌─────────────────────────────────────────────────────────────────┐
│  Judges                                          [+ New Judge]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  YOUR JUDGES                                                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │   📋 No custom judges yet                                 │ │
│  │                                                           │ │
│  │   Judges define what "good" looks like for your agent.    │ │
│  │   Start with a template or create from scratch.           │ │
│  │                                                           │ │
│  │   [Start from Template]  [Create Custom Judge]            │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  TEMPLATE LIBRARY                         [Browse All (24) →]  │
│                                                                 │
│  ┌───────────────────┐ ┌───────────────────┐ ┌───────────────┐ │
│  │ 🎯 Accuracy       │ │ 🛡️ Safety          │ │ 💬 Tone       │ │
│  │ No hallucination  │ │ Content policy    │ │ Professional  │ │
│  │ [Use Template]    │ │ [Use Template]    │ │ [Use Template]│ │
│  └───────────────────┘ └───────────────────┘ └───────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Design Notes:**
- Show templates even when empty (reduces blank feeling)
- Two paths: template (faster) or custom (flexibility)

---

### 2.4 Test Scenarios Empty State

**Trigger:** Zero scenarios created

```
┌─────────────────────────────────────────────────────────────────┐
│  Test Scenarios                                [+ New Scenario] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│     ┌───────────────────────────────────────────────────────┐   │
│     │                                                       │   │
│     │          💬                                           │   │
│     │                                                       │   │
│     │   Create your first test scenario                     │   │
│     │                                                       │   │
│     │   A scenario is a conversation you want to test.      │   │
│     │   Define user messages and which judges evaluate      │   │
│     │   the agent's responses.                              │   │
│     │                                                       │   │
│     │            [+ Create Scenario]                        │   │
│     │                                                       │   │
│     │   ────────────────────────────────────────────────    │   │
│     │                                                       │   │
│     │   💡 Tip: Start simple! Test one conversation flow    │   │
│     │      before building complex scenarios.               │   │
│     │                                                       │   │
│     └───────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 2.5 Discover Tab Empty State

**Trigger:** Zero prompt collections

```
┌─────────────────────────────────────────────────────────────────┐
│  Discover                                      [+ New Collection]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│     ┌───────────────────────────────────────────────────────┐   │
│     │                                                       │   │
│     │          🔍                                           │   │
│     │                                                       │   │
│     │   Discover what your agent does                       │   │
│     │                                                       │   │
│     │   Run a set of prompts against your agent and         │   │
│     │   annotate the responses. TestAgent can then          │   │
│     │   auto-generate judges from your annotations.         │   │
│     │                                                       │   │
│     │   ┌───────────────────────────────────────────────┐   │   │
│     │   │ Great for:                                    │   │   │
│     │   │ • Understanding agent behavior                │   │   │
│     │   │ • Finding edge cases                          │   │   │
│     │   │ • Generating evaluation criteria              │   │   │
│     │   └───────────────────────────────────────────────┘   │   │
│     │                                                       │   │
│     │         [+ Create Collection]                         │   │
│     │                                                       │   │
│     └───────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 2.6 Quality Dashboard Empty State (Post First Test)

**Trigger:** At least one test run exists, but not enough data for trends

```
┌─────────────────────────────────────────────────────────────────┐
│  Support Bot - Quality Dashboard                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  Latest Run: Today 2:30 PM                                 ││
│  │  ✅ 3/5 passed  •  ❌ 2 failed                             ││
│  │                                           [View Results →] ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Trend Data                                                     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │                                                            ││
│  │   📊 Not enough data for trends yet                        ││
│  │                                                            ││
│  │   Run a few more tests to see quality trends over time.    ││
│  │   We recommend running tests at least daily.               ││
│  │                                                            ││
│  │   Current: 1 test run  •  Need: 3+ runs over 7+ days       ││
│  │                                                            ││
│  │                          [Run Another Test]                ││
│  │                                                            ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. First-Run Celebration

When user completes their first test run, show a celebration moment:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                         🎉                                      │
│                                                                 │
│               Your first test is complete!                      │
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
│               [View Results]  [Explore Dashboard]               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Contextual Tooltips

First-time users should see tooltips on key UI elements:

| Element | Tooltip Content | Trigger |
|---------|-----------------|---------|
| Severity toggle | "FAIL stops the test. WARN flags but continues." | First judge creation |
| Run button | "This sends prompts to your agent and evaluates responses" | First scenario view |
| Enhance with AI | "We'll optimize your criteria for better evaluation accuracy" | First judge creation |
| Create Ticket | "One click to create a Jira ticket with full context" | First failure view |

---

## 5. Skip + Resume Flow

Users can skip guided onboarding but should be able to resume:

### Skip Confirmation

```
┌───────────────────────────────────────────────────────────────┐
│  Skip guided setup?                                      [X]  │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  You can explore on your own, but you'll need to complete     │
│  these steps before running tests:                            │
│                                                               │
│  • Configure LLM API key (Settings → LLM Provider)            │
│  • Connect an agent (Agents tab)                              │
│  • Create at least one judge (Define tab)                     │
│  • Create a test scenario (Simulate tab)                      │
│                                                               │
│  You can restart guided setup anytime from the Help menu.     │
│                                                               │
│          [Continue Setup]  [Skip for Now]                     │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Resume from Help Menu

```
Help Menu → "Restart Guided Setup"
```

---

## 6. Metrics to Track

| Metric | Description | Target |
|--------|-------------|--------|
| Onboarding completion rate | % of users completing all setup steps | > 60% |
| Time to first test | Minutes from signup to first test run | < 25 min |
| Step drop-off rate | % abandoning at each step | < 20% per step |
| Skip rate | % choosing to skip guided setup | < 30% |
| 7-day retention | % returning after first test | > 50% |

---

## 7. Implementation Priority

| Phase | Items | Priority |
|-------|-------|----------|
| MVP | Dashboard empty state with checklist | P0 |
| MVP | Agent empty state | P0 |
| MVP | Judge empty state with templates | P0 |
| MVP | Onboarding state tracking (DB) | P0 |
| Post-MVP | First-run celebration | P1 |
| Post-MVP | Contextual tooltips | P1 |
| Post-MVP | Skip/resume flow | P1 |
| Post-MVP | Onboarding analytics | P1 |

---

*References: User Journeys PRD (16_PRD_USER_JOURNEYS.md), Connect PRD (03_PRD_CONNECT.md)*
