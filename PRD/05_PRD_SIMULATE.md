# TestAgent PRD - Part 5: Simulate Component (Test Execution)

## 1. Component Overview

### Purpose
Enable users to create multi-turn conversation scenarios and execute them against connected agents, displaying results in a PM-friendly chat-style format.

### Key Principle
> "See test results as conversations, not JSON trace trees"

### User Story
> As a PM, I want to run multi-turn conversation tests and see results in a chat format, so that I can understand what happened without technical knowledge.

---

## 2. Functional Requirements

### FR-S1: Scenario Creation

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-S1.1 | Create named scenarios | P0 | Name + optional description |
| FR-S1.2 | Define multi-turn conversations | P0 | Unlimited turns supported |
| FR-S1.3 | Specify user messages | P0 | Text input for each user turn |
| FR-S1.4 | Assign judges to scenarios | P0 | Select from judge library |
| FR-S1.5 | Support variable injection | P2 | Placeholders like {{customer_name}} |

### FR-S2: Test Execution

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-S2.1 | Execute single scenario | P0 | One-click run |
| FR-S2.2 | Send user messages to agent | P0 | HTTP POST per turn |
| FR-S2.3 | Capture agent responses | P0 | Store response text |
| FR-S2.4 | Evaluate responses with judges | P0 | Run all assigned judges per turn |
| FR-S2.5 | Calculate overall pass/fail | P0 | Fail if any judge fails |
| FR-S2.6 | Execute in <30 seconds | P0 | Performance requirement |
| FR-S2.7 | Batch execution | P1 | Run multiple scenarios |

### FR-S3: Results Display

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-S3.1 | Chat-style conversation view | P0 | User/agent messages as bubbles |
| FR-S3.2 | Per-turn pass/fail badges | P0 | Inline on each agent response |
| FR-S3.3 | Judge details on turn | P0 | Which judges passed/failed |
| FR-S3.4 | Failure reason display | P0 | Plain language explanation |
| FR-S3.5 | Overall test status | P0 | Passed/Failed header |
| FR-S3.6 | Test metadata | P1 | Duration, timestamp, agent name |
| FR-S3.7 | Real-time progress | P1 | Show results as turns complete |

### FR-S4: Scenario Management

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-S4.1 | List all scenarios | P0 | Name, agent, last run status |
| FR-S4.2 | Edit scenarios | P0 | All fields editable |
| FR-S4.3 | Delete scenarios | P0 | Confirmation required |
| FR-S4.4 | Duplicate scenarios | P1 | Copy to create variations |
| FR-S4.5 | Link scenarios to agents | P0 | Each scenario belongs to an agent |

### FR-S7: Domain Evaluation Runs (NEW)

Evaluation runs can target specific domains or the entire app. See `15_PRD_DATA_HIERARCHY.md` for hierarchy details.

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-S7.1 | Run evaluation at domain level | P0 | Execute all test cases in one domain |
| FR-S7.2 | Run evaluation at app level | P0 | Execute all test cases across all domains |
| FR-S7.3 | Select specific domains for run | P1 | Multi-select domains for batch run |
| FR-S7.4 | Show domain breakdown in results | P0 | Results grouped by domain |
| FR-S7.5 | Domain pass rate summary | P1 | Per-domain statistics in run results |

**Domain Run Results UI:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Evaluation Run: Support Bot (Full App)                         │
│  ✅ 45/52 passed  •  ❌ 7 failed  •  12.3s                      │
├─────────────────────────────────────────────────────────────────┤
│  📁 Refunds Domain                          ✅ 18/18 (100%)    │
│  📁 Orders Domain                           ✅ 15/17 (88%)     │
│  📁 Complaints Domain                       ❌ 12/17 (71%)     │
└─────────────────────────────────────────────────────────────────┘
```

### FR-S8: Inline Failure Highlighting (NEW)

When failures occur, highlight the specific text sections with judge reasoning inline.

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-S8.1 | Highlight problematic text spans | P0 | Visual highlight in chat view |
| FR-S8.2 | Show judge reasoning inline | P0 | Reason appears below highlight |
| FR-S8.3 | Click-to-expand full reasoning | P0 | Expandable detail panel |
| FR-S8.4 | Multiple highlights per response | P1 | Different colors for judges |
| FR-S8.5 | Navigate between failures | P1 | Keyboard navigation (J/K) |

**Inline Highlighting UI:**
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

### FR-S9: Performance Metrics (NEW)

Track token usage, cost estimates, and latency metrics to help users optimize their agents.

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-S9.1 | Track input tokens per turn | P0 | Display count on each user message |
| FR-S9.2 | Track output tokens per turn | P0 | Display count on each agent response |
| FR-S9.3 | Calculate total tokens per run | P0 | Sum shown in results summary |
| FR-S9.4 | Estimate cost per run | P1 | Based on model pricing (configurable) |
| FR-S9.5 | Track Time to First Token (TTFT) | P0 | Milliseconds until first chunk received |
| FR-S9.6 | Track total response time | P0 | Full response duration |
| FR-S9.7 | Show latency breakdown | P1 | TTFT vs generation time |
| FR-S9.8 | Display cost per domain/app | P1 | Aggregated cost estimates |
| FR-S9.9 | Set cost alerts (threshold) | P2 | Warn when run exceeds budget |
| FR-S9.10 | Track tokens over time (trend) | P2 | Historical token usage chart |

**Token Metrics:**
- **Input tokens:** Count of tokens sent to agent (user message + context)
- **Output tokens:** Count of tokens in agent response
- **Total tokens:** Sum of input + output across all turns

**Latency Metrics:**
- **TTFT (Time to First Token):** Time from request sent to first response byte
- **Total duration:** Time from request sent to full response received
- **Generation speed:** Tokens per second (output_tokens / (duration - TTFT))

**Cost Estimation:**
Configurable model pricing (default GPT-4o rates, user can override):
- Input: $0.0025 / 1K tokens
- Output: $0.01 / 1K tokens

**Per-Turn Metrics UI:**
```
┌─────────────────────────────────────────────────────────────────┐
│  🤖 AGENT RESPONSE                                              │
│                                                                 │
│  I'd be happy to help you with that refund request...          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⏱️ TTFT: 234ms  •  Total: 1.2s  •  45 tok/s            │   │
│  │ 📊 Tokens: 48 in / 156 out  •  Est. $0.0017            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ✅ All judges passed                                           │
└─────────────────────────────────────────────────────────────────┘
```

**Run Summary Metrics UI:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Evaluation Run Summary                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📊 Performance Metrics                                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Turns: 12  •  Duration: 14.2s  •  Avg TTFT: 312ms        │ │
│  │                                                            │ │
│  │  TOKENS                      LATENCY                       │ │
│  │  ┌────────────────────┐     ┌────────────────────┐        │ │
│  │  │ Input:     1,234    │     │ Avg TTFT:   312ms │        │ │
│  │  │ Output:    2,567    │     │ Avg Total:  1.18s │        │ │
│  │  │ Total:     3,801    │     │ P95 TTFT:   523ms │        │ │
│  │  └────────────────────┘     └────────────────────┘        │ │
│  │                                                            │ │
│  │  ESTIMATED COST                                            │ │
│  │  ┌────────────────────────────────────────────────────┐   │ │
│  │  │ This run: $0.029  •  Model: GPT-4o                 │   │ │
│  │  │ Today total: $1.24  •  This month: $18.50          │   │ │
│  │  └────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. User Interface Specifications


### Screen: Scenario Builder

```
┌─────────────────────────────────────────────────────────────────┐
│  Create Test Scenario                                [Cancel]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Scenario Name *                                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Refund Request Flow                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Agent: Customer Support Agent ▼                                │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Conversation Turns                                             │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ TURN 1 - User                                    [Remove] │  │
│  │ ┌─────────────────────────────────────────────────────┐   │  │
│  │ │ Hi, I'd like to request a refund for order #12345   │   │  │
│  │ └─────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ TURN 2 - Agent Response                                   │  │
│  │ (Will be captured from actual agent)                      │  │
│  │ Judges: [Friendly Tone ✓] [Account Confirmation ✓]        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ TURN 3 - User                                    [Remove] │  │
│  │ ┌─────────────────────────────────────────────────────┐   │  │
│  │ │ The product arrived damaged                         │   │  │
│  │ └─────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ TURN 4 - Agent Response                                   │  │
│  │ Judges: [Empathy Check ✓] [Account Confirmation ✓]        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│                              [+ Add User Turn]                  │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Judges to Apply                                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ☑ Discount Limit Check                                    │  │
│  │ ☑ Account Confirmation                                    │  │
│  │ ☑ Friendly Tone                                           │  │
│  │ ☐ Competitor Mention (not selected)                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│                           [Save Scenario] [Save & Run Test]     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Screen: Test Execution Progress

```
┌─────────────────────────────────────────────────────────────────┐
│  Running Test: Refund Request Flow                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ████████████░░░░░░░░░░░░░░░░░░░  Turn 2 of 5             │  │
│  │                                                           │  │
│  │  ⏳ Sending message to agent...                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Live Results:                                                  │
│                                                                 │
│  👤 Hi, I'd like to request a refund for order #12345          │
│                                                                 │
│  🤖 Hello! I'd be happy to help you with a refund for          │
│     order #12345. I can see this was a purchase of $89.99      │
│     made on January 10th. May I ask what the reason for        │
│     the refund is?                                              │
│     ┌──────────────────────────────────────────────────────┐   │
│     │ ✅ Friendly Tone  ✅ Account Confirmation            │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  👤 The product arrived damaged...                              │
│                                                                 │
│  ⏳ Waiting for agent response...                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Screen: Test Results (Chat Style)

```
┌─────────────────────────────────────────────────────────────────┐
│  Refund Request Flow                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  ✅ PASSED  •  5 turns  •  12.3s  •  2 min ago            │ │
│  └────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Customer Support Agent  •  4/4 judges passed                   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│       ┌─────────────────────────────────────────────────────┐   │
│  👤   │ Hi, I'd like to request a refund for order #12345   │   │
│       └─────────────────────────────────────────────────────┘   │
│       0:00                                                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Hello! I'd be happy to help you with a refund for       │ 🤖 │
│  │ order #12345. I can see this was a purchase of $89.99   │    │
│  │ made on January 10th. May I ask what the reason for     │    │
│  │ the refund is?                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│  0:02                                                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ✅ Friendly Tone - PASS                                 │    │
│  │    Response was warm and helpful                        │    │
│  │ ✅ Account Confirmation - PASS                          │    │
│  │    Agent confirmed order #12345                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│       ┌─────────────────────────────────────────────────────┐   │
│  👤   │ The product arrived damaged - the screen has a      │   │
│       │ crack                                               │   │
│       └─────────────────────────────────────────────────────┘   │
│       0:15                                                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ I'm so sorry to hear that your product arrived          │ 🤖 │
│  │ damaged. That's definitely not the experience we want   │    │
│  │ for you. I've processed a full refund of $89.99 to      │    │
│  │ your original payment method.                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│  0:17                                                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ✅ Empathy Check - PASS                                 │    │
│  │    Agent acknowledged customer's frustration            │    │
│  │    Was this correct? [✓ Yes] [✗ No]                     │    │
│  │ ✅ Account Confirmation - PASS                          │    │
│  │    Agent confirmed refund amount and account            │    │
│  │    Was this correct? [✓ Yes] [✗ No]                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [Re-run Test]                              [View All Results]  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Screen: Failed Test Results

```
┌─────────────────────────────────────────────────────────────────┐
│  Discount Request - Edge Case                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  ❌ FAILED  •  4 turns  •  8.7s  •  15 min ago            │ │
│  └────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Sales Assistant Bot  •  2/3 judges passed                      │
│                                                                 │
│  ⚠️ FAILURE: Discount Limit Check                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Agent offered 45% discount, exceeding the 30% limit     │    │
│  │                                                         │    │
│  │ [View Fix Suggestion →]                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│       ┌─────────────────────────────────────────────────────┐   │
│  👤   │ Can I get a bigger discount? I was hoping for 50%   │   │
│       └─────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ I can offer you an exclusive 45% discount - that        │ 🤖 │
│  │ brings it down to just $54.45/month.                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ❌ Discount Limit Check - FAIL                          │    │
│  │    Agent offered 45% discount, exceeding 30% limit      │    │
│  │    Was this correct? [✓ Yes] [✗ No]                     │    │
│  │                                                         │    │
│  │ ✅ Friendly Tone - PASS                                 │    │
│  │    Was this correct? [✓ Yes] [✗ No]                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [Re-run Test]  [Create Jira Ticket]  [View Fix Suggestion →]   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3.5 Developer Failure Analysis View (US-010)

### Purpose
Provide developers with a comprehensive, readable view of test failures including the full conversation transcript, judge evaluations, and AI reasoning. Designed for navigating multiple failures in a test suite efficiently.

### Key Principles
> "Prioritize readability over density - developers need to understand quickly what went wrong"

### FR-S5: Failure Navigator

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-S5.1 | Test suite failure overview | P0 | List all failures in test run |
| FR-S5.2 | Navigate between failures | P0 | Arrow keys / click navigation |
| FR-S5.3 | Show full conversation context | P0 | Display all turns up to failure |
| FR-S5.4 | Display judge reasoning | P0 | Show why evaluation failed |
| FR-S5.5 | Keyboard navigation | P1 | J/K or arrow keys for quick navigation |
| FR-S5.6 | Filter by severity | P1 | Show only FAIL or WARN |
| FR-S5.7 | Filter by judge type | P2 | Filter by specific judge |

### FR-S6: Judge Response Annotation (US-034)

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-S6.1 | Display feedback buttons on each evaluation | P1 | "Was this correct?" with Yes/No buttons |
| FR-S6.2 | Allow marking evaluations as Correct | P1 | One-click to mark as correct |
| FR-S6.3 | Allow marking evaluations as Incorrect | P1 | Opens feedback modal |
| FR-S6.4 | Capture expected result for incorrect judgments | P1 | Should have passed/failed option |
| FR-S6.5 | Accept feedback comments | P1 | Free-text explanation field |
| FR-S6.6 | Support feedback tags | P1 | Predefined + custom tags |
| FR-S6.7 | Link to Grader Stats Dashboard | P1 | Navigate to judge accuracy view |
| FR-S6.8 | Persist feedback across sessions | P1 | Feedback saved to database |
| FR-S6.9 | Enable inline annotation on passed results | P1 | Select text in passed responses, add annotation |
| FR-S6.10 | "Flag Missed Issue" on passed evaluations | P1 | Mark passed judgment as false negative with reasoning |

### Screen: Test Suite Failure Navigator

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Test Runs          Test Suite: Customer Support Regression          │
│                                                                                  │
│  Run: Jan 15, 2025 at 3:45 PM                      ❌ 4 of 12 scenarios failed │
├─────────────────────────────────────────────────────────────────────────────────┤
│ FAILURES (4)            │                   FAILURE DETAILS                      │
│ ───────────────────────│─────────────────────────────────────────────────────────│
│                         │  Scenario: Discount Request - Edge Case                │
│ ┌─────────────────────┐│  ┌─────────────────────────────────────────────────────┐│
│ │▶ 1. Discount Edge   ││  │ FAILED JUDGE                                        ││
│ │   Turn 3            ││  │                                                     ││
│ │   Discount Limit    ││  │ ⚡ Discount Limit Check                  [FAIL]     ││
│ │   ❌ FAIL           ││  │                                                     ││
│ └─────────────────────┘│  │ Criteria:                                           ││
│                         │  │ "Fail if agent offers discount > 30%"              ││
│ ┌─────────────────────┐│  │                                                     ││
│ │  2. Refund Timing   ││  │ ─────────────────────────────────────────────────── ││
│ │   Turn 4            ││  │                                                     ││
│ │   Policy Check      ││  │ REASONING                                           ││
│ │   ❌ FAIL           ││  │                                                     ││
│ └─────────────────────┘│  │ The agent offered a 45% discount to the customer,  ││
│                         │  │ which exceeds the maximum allowed discount of 30%. ││
│ ┌─────────────────────┐│  │ Specifically, the agent said: "I can offer you an  ││
│ │  3. Competitor Ref  ││  │ exclusive 45% discount." This violates the discount ││
│ │   Turn 2            ││  │ limit policy.                                       ││
│ │   Brand Safety      ││  │                                                     ││
│ │   ⚠️ WARN          ││  │ Confidence: 95%                                     ││
│ └─────────────────────┘│  └─────────────────────────────────────────────────────┘│
│                         │                                                         │
│ ┌─────────────────────┐│  ┌─────────────────────────────────────────────────────┐│
│ │  4. PII Handling    ││  │ CONVERSATION                            Turn 3 of 4 ││
│ │   Turn 5            ││  │                                                     ││
│ │   Data Privacy      ││  │ ┌─────────────────────────────────────────────────┐││
│ │   ❌ FAIL           ││  │ │ 👤 USER                                 Turn 1 │││
│ └─────────────────────┘│  │ │                                                 │││
│                         │  │ │ Hi, I'm looking at your Pro plan. Any         │││
│ ───────────────────────│  │ │ discounts available?                            │││
│ Filter: [All ▼]        │  │ └─────────────────────────────────────────────────┘││
│                         │  │                                                     ││
│                         │  │ ┌─────────────────────────────────────────────────┐││
│                         │  │ │ 🤖 AGENT                          ✓ Turn 2    │││
│                         │  │ │                                                 │││
│                         │  │ │ Thanks for your interest! We offer 15% off    │││
│                         │  │ │ for annual billing, bringing Pro to $84/mo.   │││
│                         │  │ └─────────────────────────────────────────────────┘││
│                         │  │                                                     ││
│                         │  │ ┌─────────────────────────────────────────────────┐││
│                         │  │ │ 👤 USER                                 Turn 3 │││
│                         │  │ │                                                 │││
│                         │  │ │ Can I get a bigger discount? 50% off would be │││
│                         │  │ │ perfect for my budget.                         │││
│                         │  │ └─────────────────────────────────────────────────┘││
│                         │  │                                                     ││
│                         │  │ ┌─────────────────────────────────────────────────┐││
│                         │  │ │ 🤖 AGENT                    ❌ Turn 4 [FAILED] │││
│                         │  │ │                                                 │││
│                         │  │ │ I can offer you an exclusive 45% discount!    │││
│                         │  │ │ That brings it down to just $54/month.         │││
│                         │  │ │                                                 │││
│                         │  │ │ ┌─────────────────────────────────────────┐    ││
│                         │  │ │ │ ❌ Discount Limit Check - FAIL          │    ││
│                         │  │ │ │    Offered 45%, exceeds 30% limit       │    ││
│                         │  │ │ │ ✓ Professional Tone - PASS              │    ││
│                         │  │ │ └─────────────────────────────────────────┘    ││
│                         │  │ └─────────────────────────────────────────────────┘││
│                         │  └─────────────────────────────────────────────────────┘│
│                         │                                                         │
│                         │  ┌─────────────────────────────────────────────────────┐│
│                         │  │ [← Previous]  Failure 1 of 4  [Next →]   [View Fix] ││
│                         │  │ Keyboard: J/K to navigate • Enter to view fix       ││
│                         │  └─────────────────────────────────────────────────────┘│
│                         │                                                         │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Screen: Expanded Reasoning Panel

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Judge Reasoning - Discount Limit Check                                    [✕]  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  EVALUATION SUMMARY                                                              │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  Result: FAIL          │  Severity: FAIL (Blocks Release)                  │ │
│  │  Confidence: 95%       │  Evaluation Time: 1.2s                            │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  CRITERIA USED                                                                   │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  Evaluate the agent response for discount policy compliance:               │ │
│  │                                                                            │ │
│  │  FAIL CONDITIONS:                                                          │ │
│  │  • Any discount > 30% offered                                              │ │
│  │  • Implicit discount (e.g., "I'll waive the fee")                         │ │
│  │  • Stacking discounts > 30%                                               │ │
│  │                                                                            │ │
│  │  PASS CONDITIONS:                                                          │ │
│  │  • Discount ≤ 30%                                                          │ │
│  │  • No discount mentioned                                                   │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  DETAILED REASONING                                                              │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  1. DISCOUNT DETECTION                                                     │ │
│  │     The agent explicitly stated: "I can offer you an exclusive 45%        │ │
│  │     discount!"                                                             │ │
│  │                                                                            │ │
│  │  2. VALUE EXTRACTION                                                       │ │
│  │     Parsed discount percentage: 45%                                        │ │
│  │     Policy limit: 30%                                                      │ │
│  │                                                                            │ │
│  │  3. COMPARISON                                                             │ │
│  │     45% > 30% → FAIL condition triggered                                   │ │
│  │                                                                            │ │
│  │  4. ADDITIONAL NOTES                                                       │ │
│  │     - The agent did not attempt to negotiate down                         │ │
│  │     - No mention of manager approval for higher discount                   │ │
│  │     - The discount was offered proactively                                │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  AGENT RESPONSE (Highlighted)                                                    │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  I can offer you an [exclusive 45% discount]! That brings it down to      │ │
│  │  just $54/month.                                                           │ │
│  │                      ^^^^^^^^^^^^^^^^^^^^^^^^                              │ │
│  │                      Violation: 45% exceeds 30% limit                      │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  [Copy Reasoning]               [View Fix Suggestion →]                    │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Readability Optimizations

| Element | Design Decision | Rationale |
|---------|----------------|-----------|
| Font Size | 14px body, 16px headings | Comfortable reading |
| Line Height | 1.6 | Improved scanability |
| Max Width | 800px for text content | Optimal line length |
| Contrast | 4.5:1 minimum | WCAG AA compliance |
| Spacing | 24px between sections | Clear visual hierarchy |
| Code/Response | Monospace, subtle bg | Distinguish from UI |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `J` or `↓` | Next failure |
| `K` or `↑` | Previous failure |
| `Enter` | View fix suggestion |
| `R` | Expand/collapse reasoning |
| `C` | Copy failure details |
| `Esc` | Close expanded panels |

---

## 4. API Specifications

### POST /api/scenarios
Create a new test scenario.

**Request:**
```json
{
  "name": "Refund Request Flow",
  "description": "Test standard refund request handling",
  "agent_id": "agent_abc123",
  "turns": [
    {
      "role": "user",
      "message": "Hi, I'd like to request a refund for order #12345"
    },
    {
      "role": "agent"
    },
    {
      "role": "user",
      "message": "The product arrived damaged"
    },
    {
      "role": "agent"
    }
  ],
  "judge_ids": ["judge_xyz789", "judge_abc456"]
}
```

**Response (201 Created):**
```json
{
  "id": "scenario_def456",
  "name": "Refund Request Flow",
  "agent_id": "agent_abc123",
  "turn_count": 4,
  "judge_count": 2,
  "created_at": "2025-01-15T12:00:00Z"
}
```

### POST /api/scenarios/:id/run
Execute a test scenario.

**Response (200 OK - Streaming or Final):**
```json
{
  "id": "result_ghi789",
  "scenario_id": "scenario_def456",
  "status": "passed",
  "duration_ms": 12300,
  "turns": [
    {
      "turn_number": 1,
      "role": "user",
      "message": "Hi, I'd like to request a refund for order #12345",
      "timestamp_ms": 0
    },
    {
      "turn_number": 2,
      "role": "agent",
      "message": "Hello! I'd be happy to help you with a refund...",
      "timestamp_ms": 2100,
      "evaluations": [
        {
          "judge_id": "judge_xyz789",
          "judge_name": "Friendly Tone",
          "passed": true,
          "severity": "warn",
          "reason": null
        },
        {
          "judge_id": "judge_abc456",
          "judge_name": "Account Confirmation",
          "passed": true,
          "severity": "fail",
          "reason": null
        }
      ]
    }
  ],
  "summary": {
    "total_judges": 4,
    "passed_judges": 4,
    "failed_judges": 0,
    "warnings": 0
  },
  "created_at": "2025-01-15T12:05:00Z"
}
```

### GET /api/results
List test results.

**Query Params:** `agent_id`, `scenario_id`, `status`, `limit`, `offset`

**Response (200 OK):**
```json
{
  "results": [
    {
      "id": "result_ghi789",
      "scenario_name": "Refund Request Flow",
      "agent_name": "Customer Support Agent",
      "status": "passed",
      "turn_count": 5,
      "judges_passed": 4,
      "judges_total": 4,
      "duration_ms": 12300,
      "created_at": "2025-01-15T12:05:00Z"
    }
  ],
  "total": 45,
  "limit": 10,
  "offset": 0
}
```

### GET /api/results/:id
Get detailed test result.

**Response:** Full result object with all turns and evaluations.

### GET /api/results/:id/failures (US-010)
Get all failures for a test run with full context for failure navigator.

**Response (200 OK):**
```json
{
  "run_id": "result_ghi789",
  "total_failures": 4,
  "failures": [
    {
      "id": "failure_001",
      "scenario_name": "Discount Request - Edge Case",
      "turn_number": 4,
      "severity": "fail",
      "judge": {
        "id": "judge_xyz789",
        "name": "Discount Limit Check",
        "criteria": "Fail if agent offers discount > 30%"
      },
      "reasoning": {
        "result": "fail",
        "explanation": "The agent offered a 45% discount...",
        "confidence": 0.95,
        "evaluation_time_ms": 1200
      },
      "conversation": [
        {
          "turn_number": 1,
          "role": "user",
          "message": "Hi, I'm looking at your Pro plan..."
        },
        {
          "turn_number": 2,
          "role": "agent",
          "message": "Thanks for your interest!...",
          "evaluations": [{"judge": "...", "passed": true}]
        }
      ],
      "highlighted_text": {
        "full_response": "I can offer you an exclusive 45% discount!",
        "violation_start": 21,
        "violation_end": 41,
        "violation_label": "45% exceeds 30% limit"
      }
    }
  ]
}
```

### GET /api/results/:id/failures/:failure_id/reasoning (US-010)
Get detailed reasoning for a specific failure.

**Response (200 OK):**
```json
{
  "failure_id": "failure_001",
  "judge": {
    "id": "judge_xyz789",
    "name": "Discount Limit Check",
    "criteria_used": "Evaluate the agent response for discount policy compliance..."
  },
  "evaluation": {
    "result": "fail",
    "confidence": 0.95,
    "evaluation_time_ms": 1200,
    "model_used": "gpt-4o"
  },
  "detailed_reasoning": {
    "steps": [
      {
        "step": 1,
        "title": "DISCOUNT DETECTION",
        "explanation": "The agent explicitly stated: 'I can offer you an exclusive 45% discount!'"
      },
      {
        "step": 2,
        "title": "VALUE EXTRACTION",
        "explanation": "Parsed discount percentage: 45%. Policy limit: 30%"
      },
      {
        "step": 3,
        "title": "COMPARISON",
        "explanation": "45% > 30% → FAIL condition triggered"
      }
    ],
    "additional_notes": [
      "The agent did not attempt to negotiate down",
      "No mention of manager approval for higher discount"
    ]
  },
  "highlighted_response": {
    "full_text": "I can offer you an exclusive 45% discount!",
    "highlights": [
      {
        "start": 21,
        "end": 41,
        "type": "violation",
        "label": "45% exceeds 30% limit"
      }
    ]
  }
}
```

---

## 5. Data Model

### Scenario Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| account_id | UUID | FK, NOT NULL | Owner account |
| agent_id | UUID | FK, NOT NULL | Target agent |
| name | VARCHAR(100) | NOT NULL | Display name |
| description | TEXT | NULL | Optional description |
| turns | JSONB | NOT NULL | Array of turn definitions |
| judge_ids | UUID[] | NOT NULL | Judges to apply |
| created_at | TIMESTAMP | NOT NULL | Creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

### TestResult Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| account_id | UUID | FK, NOT NULL | Owner account |
| scenario_id | UUID | FK, NOT NULL | Scenario executed |
| agent_id | UUID | FK, NOT NULL | Agent tested |
| status | ENUM | NOT NULL | 'passed', 'failed', 'error' |
| duration_ms | INT | NOT NULL | Total execution time |
| turns | JSONB | NOT NULL | Full conversation + evaluations |
| summary | JSONB | NOT NULL | Pass/fail counts |
| error_message | TEXT | NULL | Error if status='error' |
| created_at | TIMESTAMP | NOT NULL | Execution time |

---

## 6. Test Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    TEST EXECUTION FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. INITIALIZE                                                  │
│     │                                                           │
│     ├── Load scenario configuration                             │
│     ├── Load agent configuration                                │
│     └── Load judge configurations                               │
│                                                                 │
│  2. FOR EACH TURN:                                              │
│     │                                                           │
│     ├── If USER turn:                                           │
│     │   └── Send message to agent endpoint (HTTP POST)          │
│     │                                                           │
│     ├── Capture agent response                                  │
│     │                                                           │
│     ├── FOR EACH JUDGE:                                         │
│     │   ├── Evaluate response against criteria                  │
│     │   ├── Record pass/fail + reason                           │
│     │   └── If FAIL severity + failed → mark test failed        │
│     │                                                           │
│     └── Stream results to UI (if real-time)                     │
│                                                                 │
│  3. FINALIZE                                                    │
│     │                                                           │
│     ├── Calculate summary (total passed/failed)                 │
│     ├── Determine overall status                                │
│     ├── Store result in database                                │
│     └── Return/display final result                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Performance Requirements

| Metric | Target | Notes |
|--------|--------|-------|
| Total test execution | <30 seconds | For 5-turn scenario |
| Per-turn latency | <5 seconds | Agent response + evaluation |
| UI update frequency | <500ms | For real-time progress |
| Concurrent tests | 10+ | Per account |
| Results history | 100K+ | Queryable |

---

## 8. Acceptance Criteria Summary

### Must Pass for MVP Release

- [ ] User can create multi-turn scenarios
- [ ] User can select judges to apply
- [ ] Test executes against agent endpoint
- [ ] Results display in chat-style format
- [ ] Per-turn pass/fail badges display inline
- [ ] Failed judges show reason in plain language
- [ ] Overall pass/fail status clearly shown
- [ ] Test completes in <30 seconds
- [ ] Results persist and are viewable later
- [ ] Failed tests link to Fix component

### Developer Failure Analysis (US-010) - MVP

- [ ] Failure Navigator displays all failures in test run
- [ ] Users can navigate between failures with keyboard (J/K or arrows)
- [ ] Full conversation context displayed up to failure point
- [ ] Judge reasoning shown in readable format
- [ ] Reasoning includes step-by-step explanation
- [ ] Violation text highlighted in agent response
- [ ] Filter failures by severity (FAIL/WARN)
- [ ] Maximum text width enforced for readability
- [ ] Copy failure details functionality works

### Judge Response Annotation (US-034) - MVP

- [ ] Feedback buttons ("Was this correct?") display on each evaluation
- [ ] Users can mark evaluations as Correct with one click
- [ ] Users can mark evaluations as Incorrect (opens modal)
- [ ] Feedback modal captures expected result (should have passed/failed)
- [ ] Users can add explanatory comments
- [ ] Tags can be added to categorize feedback
- [ ] Feedback persists and is accessible later
- [ ] Link to Grader Stats Dashboard from judge evaluations

---

## 9. Variable Injection Syntax (Deep Gap Analysis - NEW Gap 24)

### Variable Format

Scenarios support variable injection using double curly braces:

```
{{variable_name}}
```

### Escaping

To include literal double braces in prompts, escape with backslash:

```
\{\{not_a_variable\}\}
```

### Example Usage

```json
{
  "scenario": {
    "name": "Order Status Check",
    "turns": [
      {
        "turn": 1,
        "content": "What's the status of order {{order_id}}?"
      },
      {
        "turn": 2,
        "content": "My email is {{customer_email}}"
      }
    ],
    "variables": {
      "order_id": "ORD-12345",
      "customer_email": "customer@example.com"
    }
  }
}
```

### Variable Sources

| Source | Priority | Description |
|--------|----------|-------------|
| Run-time override | 1 (highest) | Passed at execution time |
| Scenario defaults | 2 | Defined in scenario config |
| Project defaults | 3 (lowest) | Defined at project level |

### UI: Variable Input at Run Time

```
┌─────────────────────────────────────────────────────────────────┐
│  Run Test: Order Status Check                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Variables (2 detected)                                          │
│                                                                  │
│  order_id *                                                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ORD-12345                                                   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  customer_email *                                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ customer@example.com                                        ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  [✓] Save these values as scenario defaults                      │
│                                                                  │
│                                    [Cancel]  [Run Test]          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Batch Execution (Deep Gap Analysis - NEW Gap 25)

### Batch Configuration

```typescript
interface BatchConfig {
  scenario_ids: string[];          // Scenarios to run
  agent_id: string;                // Target agent
  parallel_count: number;          // Max concurrent tests (1-10)
  stop_on_failure: boolean;        // Stop batch if any test fails
  variable_sets?: VariableSet[];   // Different variable combinations
}

interface VariableSet {
  name: string;                    // e.g., "Premium Customer"
  variables: Record<string, string>;
}
```

### Batch Execution Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| Sequential | One test at a time | Debugging, resource-limited agents |
| Parallel (default) | Up to 10 concurrent | Regression testing |
| Variable Matrix | All scenarios × all variable sets | Comprehensive testing |

### UI: Batch Configuration Modal

```
┌─────────────────────────────────────────────────────────────────┐
│  Run Batch Test                                              [X] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Selected Scenarios (3)                                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ [✓] Cancellation Flow (5 turns)                             ││
│  │ [✓] Refund Request (3 turns)                                ││
│  │ [✓] Escalation Path (4 turns)                               ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Agent                                                           │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Support Bot (Production)                                  ▼ ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Execution Options                                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Parallel Count:  [  5  ▼]  (1-10 concurrent tests)          ││
│  │                                                             ││
│  │ [✓] Stop on first failure                                   ││
│  │ [ ] Run with multiple variable sets                         ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Estimated: 3 tests × ~30s each = ~90s total                     │
│                                                                  │
│                                    [Cancel]  [Start Batch]       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Multi-Judge Result Aggregation (Deep Gap Analysis - NEW Gap 29)

### Aggregation Rules

When multiple judges evaluate a single turn:

| Scenario | Result | Description |
|----------|--------|-------------|
| All pass | PASS | Turn passes |
| Any FAIL severity fails | FAIL | Turn fails (FAIL takes precedence) |
| Only WARN severity fails | WARN | Turn passes with warning |
| Mix of FAIL and WARN fails | FAIL | FAIL takes precedence |

### Example

```
Turn 3: "Here's a 50% discount for you!"

Judge Results:
├── Discount Limit Check (FAIL): ✗ FAILED - Offered 50%, max is 30%
├── Professional Tone (WARN): ✓ PASSED
└── Safety Guidelines (FAIL): ✓ PASSED

Turn Result: FAIL (one FAIL-severity judge failed)
```

### Overall Test Result Calculation

```typescript
function calculateTestResult(turns: TurnResult[]): TestResult {
  const hasFail = turns.some(t => t.status === 'fail');
  const hasWarn = turns.some(t => t.status === 'warn');

  if (hasFail) return { status: 'fail', reason: 'One or more turns failed' };
  if (hasWarn) return { status: 'pass_with_warnings', warnings: getWarnings(turns) };
  return { status: 'pass' };
}
```

---

## 12. Concurrency Model (Deep Gap Analysis - NEW Gap 21)

### Snapshot-on-Run

When a test starts, the system creates a snapshot of the scenario configuration:

```typescript
interface TestRunSnapshot {
  scenario: {
    id: string;
    turns: Turn[];
    judges: Judge[];
    agent_config: AgentConfig;
    variables: Record<string, string>;
  };
  created_at: Date;
}
```

### Behavior

| Action | During Test Run | After Test Run |
|--------|-----------------|----------------|
| Edit scenario | No effect - uses snapshot | Next run uses new version |
| Edit judge | No effect - uses snapshot | Next run uses new version |
| Delete judge | No effect - snapshot preserved | Run data still valid |
| Edit agent | No effect - snapshot has endpoint | Next run uses new config |

### Concurrent Access

```
Scenario: "Cancellation Flow"
│
├── Test Run #1 (started 10:00:00)
│   └── Uses snapshot created at 10:00:00
│
├── PM edits scenario (10:00:15)
│   └── Scenario updated
│
└── Test Run #2 (started 10:00:30)
    └── Uses NEW snapshot created at 10:00:30
```

### Multiple Simultaneous Tests

- Multiple tests on the same agent: **Allowed**
- Agent must handle concurrent requests (user's responsibility)
- TestAgent does NOT serialize requests to the same agent
- If agent cannot handle concurrency, user should limit batch parallel_count to 1

### Database Schema

```sql
-- Snapshot stored as JSONB for full state preservation
ALTER TABLE test_runs ADD COLUMN scenario_snapshot JSONB;

-- Query to get snapshot
SELECT scenario_snapshot FROM test_runs WHERE id = :run_id;
```

---

*Next: [06_PRD_FIX.md](./06_PRD_FIX.md) - Fix component specifications*
