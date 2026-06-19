# TestAgent PRD - Part 3A: Discover Component (Response Collection & Annotation)

## 1. Component Overview

### Purpose
Enable users to collect agent responses to prompts, annotate them as Good/Bad/Needs Work, and use those annotations to either auto-generate graders or inform manual grader creation.

### Key Principle
> "See what your agent actually does before defining what 'good' looks like"

### Position in Workflow
```
Connect → DISCOVER → Define → Simulate → Fix
           ↓
    1. Run prompts (no evaluation)
    2. Annotate responses
    3. Generate or create graders
```

### Important: Annotations vs Ground Truth (Phase 1)

**Phase 1 Clarification:** Annotations collected in Discover are used to **inform judge criteria**, NOT as ground truth for answer comparison.

| Annotations ARE used for | Annotations are NOT used for (Phase 1) |
|-------------------------|----------------------------------------|
| Understanding what "good" vs "bad" looks like | Comparing responses to "correct answers" |
| Identifying failure patterns | Expected answer matching |
| Generating suggested judge criteria | Semantic similarity scoring |
| Training PM intuition about agent behavior | Retrieval recall/precision metrics |

**Key Distinction:**
- Annotations help define *what to check* (criteria)
- Annotations do NOT define *what the correct answer is*

Ground truth comparison (expected answers) is planned for **Phase 2/v1.1**.

### User Stories

| ID | User Story | Priority |
|----|------------|----------|
| US-030 | As a PM, I want to run my agent through a list of prompts and collect responses, so that I can see what my agent actually does | P0 |
| US-031 | As a PM, I want to annotate agent responses as Good/Bad/Needs Work, so that I can identify patterns of failure | P0 |
| US-032 | As a PM, I want graders auto-generated from my annotations, so that I don't have to write criteria from scratch | P0 |
| US-033 | As a PM, I want to test my grader's accuracy against annotated data, so that I know it catches the right failures | P1 |
| US-034 | As a PM, I want to annotate judge responses as Correct/Incorrect with comments, so that I can improve grader accuracy over time | P1 |

---

## 2. Functional Requirements

### FR-DC1: Prompt Collection Runs

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-DC1.1 | Create prompt collection with name | P0 | Name required; max 100 chars |
| FR-DC1.2 | Add prompts to collection | P0 | Text input; bulk import option |
| FR-DC1.3 | Support multi-turn prompt sequences | P1 | Define conversation flow |
| FR-DC1.4 | Execute prompts against connected agent | P0 | HTTP POST; capture responses |
| FR-DC1.5 | Store prompt-response pairs | P0 | Persistent storage; retrievable |
| FR-DC1.6 | No evaluation during collection | P0 | Responses captured without judging |
| FR-DC1.7 | Support bulk prompt import | P1 | CSV/JSON upload; copy-paste |
| FR-DC1.8 | Show execution progress | P0 | Progress bar; streaming updates |

### FR-DC2: Annotation Interface

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-DC2.1 | Display prompt-response pairs for annotation | P0 | Card-based or list view |
| FR-DC2.2 | Annotate as Good/Bad | P0 | Binary pass/fail; one-click selection; keyboard shortcuts |
| FR-DC2.3 | Add notes to annotations | P0 | Free-text field per annotation |
| FR-DC2.4 | Tag annotations with categories | P1 | Predefined + custom tags |
| FR-DC2.5 | Highlight problematic text in response | P0 | Inline text selection; save highlights with annotations |
| FR-DC2.6 | Filter by annotation status | P0 | Unannotated, Good, Bad |
| FR-DC2.7 | Bulk annotation actions | P1 | Select multiple; apply same annotation |
| FR-DC2.8 | Track annotation progress | P0 | X of Y annotated; completion % |
| FR-DC2.9 | Support keyboard navigation | P1 | G=Good, B=Bad, T=Tag, arrows |

### FR-DC3: Auto-Generate Graders

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-DC3.1 | Analyze annotation patterns | P0 | Identify common failure themes |
| FR-DC3.2 | Generate grader criteria from patterns | P0 | Natural language criteria |
| FR-DC3.3 | Show which annotations support each grader | P0 | Link graders to source annotations |
| FR-DC3.4 | Allow user to review before creating | P0 | Preview with approve/edit/reject |
| FR-DC3.5 | Suggest grader severity based on patterns | P1 | Fail vs Warn recommendation |
| FR-DC3.6 | Support manual refinement of generated criteria | P0 | Edit before saving |
| FR-DC3.7 | Create multiple graders from one session | P0 | Batch generation |

### FR-DC4: Grader Accuracy Testing

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-DC4.1 | Run grader against annotated dataset | P1 | Execute evaluation on all pairs |
| FR-DC4.2 | Compare grader results to human annotations | P1 | Match/mismatch analysis |
| FR-DC4.3 | Calculate accuracy metrics | P1 | Precision, recall, F1 score |
| FR-DC4.4 | Show false positives | P1 | Grader flagged, human said Good |
| FR-DC4.5 | Show false negatives | P1 | Grader passed, human said Bad |
| FR-DC4.6 | Suggest criteria improvements | P2 | Based on mismatches |
| FR-DC4.7 | Support iterative refinement | P1 | Edit grader, re-test |

### FR-DC5: Judge Response Annotation (US-034)

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-DC5.1 | Mark judge judgments as Correct/Incorrect | P1 | One-click toggle on each evaluation |
| FR-DC5.2 | Add comments explaining incorrect judgments | P1 | Free-text field per judgment |
| FR-DC5.3 | Display judgment annotation inline with test results | P1 | Visible in chat-style results view |
| FR-DC5.4 | Track accuracy stats per grader | P1 | True positives, false positives, false negatives |
| FR-DC5.5 | Aggregate feedback across test runs | P1 | Cross-run accuracy dashboard |
| FR-DC5.6 | Use annotations to refine grader criteria | P2 | Suggest improvements based on feedback |
| FR-DC5.7 | Filter feedback by mismatch type | P1 | Show only incorrect judgments |
| FR-DC5.8 | Export judgment feedback data | P2 | CSV/JSON export for analysis |

### FR-DC6: Test Result Annotation (NEW)

Annotations on test run results (not just pre-collected data) to enable continuous judge improvement.

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-DC6.1 | Annotate test run responses as Good/Bad | P0 | Same annotation UI as Discover flow |
| FR-DC6.2 | Add inline highlights to test failures | P0 | Select text, add tag |
| FR-DC6.3 | "Create Judge" action from failure view | P0 | Button visible on failures not caught by judges |
| FR-DC6.4 | Pre-populate judge criteria from annotation | P1 | Use tag + highlighted text as input |
| FR-DC6.5 | Link new judge to source failure | P1 | Show source context in judge editor |
| FR-DC6.6 | Aggregate failure patterns | P1 | Group similar annotations in Improvement Hub |
| FR-DC6.7 | Suggest new judges from patterns | P2 | ML-based clustering of failure tags |
| FR-DC6.8 | Annotate passed test cases for missed issues | P1 | Same inline highlight UI available on passed responses |
| FR-DC6.9 | "Flag Missed Issue" action on passed results | P1 | Opens annotation modal with "Judges missed this" context |

> **Rationale for FR-DC6.8-9**: Industry best practice (per RLHF research) indicates that feedback on **both** correct and incorrect evaluations improves judge accuracy over time. Users should be able to highlight text in passed test cases and flag "This should have failed" to identify false negatives and create new judges.

---


## 3. User Interface Specifications

### Screen: Prompt Collection Builder

```
+---------------------------------------------------------------------------+
|  Create Prompt Collection                                       [Cancel]   |
+---------------------------------------------------------------------------+
|                                                                            |
|  Collection Name *                                                         |
|  +----------------------------------------------------------------------+  |
|  | Customer Support Prompts                                             |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  Description                                                               |
|  +----------------------------------------------------------------------+  |
|  | Common customer questions to test our support agent                  |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  -----------------------------------------------------------------------   |
|                                                                            |
|  PROMPTS                                              [Import CSV] [+ Add] |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | 1. How do I reset my password?                              [x]      |  |
|  +----------------------------------------------------------------------+  |
|  | 2. Can I get a refund on my order?                          [x]      |  |
|  +----------------------------------------------------------------------+  |
|  | 3. What's the difference between Pro and Enterprise?        [x]      |  |
|  +----------------------------------------------------------------------+  |
|  | 4. My payment failed, what should I do?                     [x]      |  |
|  +----------------------------------------------------------------------+  |
|  | + Add another prompt...                                              |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  -----------------------------------------------------------------------   |
|                                                                            |
|  Select Agent                                                              |
|  +----------------------------------------------------------------------+  |
|  | Customer Support Bot (api.company.com/agent)                    v    |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|                                              [Save Draft]  [Run Collection]|
|                                                                            |
+---------------------------------------------------------------------------+
```

### Screen: Collection Execution Progress

```
+---------------------------------------------------------------------------+
|  Running: Customer Support Prompts                                         |
+---------------------------------------------------------------------------+
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  |  Progress: 8 of 25 prompts complete                                  |  |
|  |  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░  32%                     |  |
|  |                                                                      |  |
|  |  Estimated time remaining: 2 minutes                                 |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  RECENT RESPONSES                                                          |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | PROMPT 8                                                             |  |
|  | "What happens if I cancel mid-subscription?"                         |  |
|  |                                                                      |  |
|  | RESPONSE                                                             |  |
|  | If you cancel your subscription mid-cycle, you'll retain access     |  |
|  | until the end of your current billing period. We don't offer        |  |
|  | prorated refunds for partial months.                                 |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | PROMPT 7                                                             |  |
|  | "Do you price match competitors?"                                    |  |
|  |                                                                      |  |
|  | RESPONSE                                                             |  |
|  | We don't formally price match, but I can offer you a special 40%    |  |
|  | discount if you sign up today!                                       |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|                                                              [Cancel Run]  |
|                                                                            |
+---------------------------------------------------------------------------+
```

### Screen: Annotation Interface

```
+---------------------------------------------------------------------------+
|  Annotate: Customer Support Prompts                    [Export] [Generate] |
+---------------------------------------------------------------------------+
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | PROGRESS: 12 of 25 annotated (48%)                                   |  |
|  | ███████████████████████░░░░░░░░░░░░░░░░░░░░░░                         |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  Filter: [All v]  [Unannotated]  [Good]  [Bad]  [Needs Work]              |
|                                                                            |
+---------------------------------------------------------------------------+
| RESPONSES                  |              ANNOTATION PANEL                 |
|----------------------------|-----------------------------------------------|
|                            |                                               |
| +------------------------+ |  PROMPT                                       |
| |  1. Password Reset     | |  +-------------------------------------------+ |
| |     Status: Good       | |  | Do you price match competitors?           | |
| +------------------------+ |  +-------------------------------------------+ |
|                            |                                               |
| +------------------------+ |  RESPONSE                                     |
| |  2. Refund Policy      | |  +-------------------------------------------+ |
| |     Status: Bad        | |  | We don't formally price match, but I can  | |
| +------------------------+ |  | offer you a special [40% discount] if you | |
|                            |  | sign up today!                            | |
| +------------------------+ |  +-------------------------------------------+ |
| |> 3. Price Matching     | |               ^^^^^^^^^^^^^^^^               |
| |     Status: ---        | |               (highlighted)                   |
| +------------------------+ |                                               |
|                            |  ANNOTATION                                   |
| +------------------------+ |  +-------------------------------------------+ |
| |  4. Payment Failed     | |  |  [ GOOD ]   [> BAD ]   [ NEEDS WORK ]    | |
| |     Status: ---        | |  +-------------------------------------------+ |
| +------------------------+ |                                               |
|                            |  Why is this bad?                             |
| +------------------------+ |  +-------------------------------------------+ |
| |  5. Upgrade Question   | |  | Offered 40% discount - exceeds our 30%   | |
| |     Status: Good       | |  | policy limit                              | |
| +------------------------+ |  +-------------------------------------------+ |
|                            |                                               |
| +------------------------+ |  Tags                                         |
| |  6. Cancel Sub         | |  [Discount] [Policy Violation] [+ Add Tag]   |
| |     Status: Needs Work | |                                               |
| +------------------------+ |                                               |
|                            |  +-------------------------------------------+ |
|                            |  |    [<< Previous]    [Save & Next >>]      | |
|                            |  +-------------------------------------------+ |
|                            |                                               |
|                            |  Keyboard: G=Good, B=Bad, N=Needs Work       |
|                            |            Arrow keys to navigate            |
+---------------------------------------------------------------------------+
```

### Screen: Auto-Generate Graders

```
+---------------------------------------------------------------------------+
|  Generate Graders from Annotations                                   [x]   |
+---------------------------------------------------------------------------+
|                                                                            |
|  Based on your 25 annotations, we identified 3 potential graders:          |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | SUGGESTED GRADER 1                                   Confidence: 92% |  |
|  |                                                                      |  |
|  | Name: Discount Limit Check                                           |  |
|  |                                                                      |  |
|  | Criteria:                                                            |  |
|  | "Fail if the agent offers a discount greater than 30%"               |  |
|  |                                                                      |  |
|  | Based on 4 "Bad" annotations:                                        |  |
|  | - "Offered 40% discount" (Response #3)                               |  |
|  | - "Promised 50% off" (Response #12)                                  |  |
|  | - "Said I can do 45%" (Response #18)                                 |  |
|  | - "Gave 35% without approval" (Response #22)                         |  |
|  |                                                                      |  |
|  | Suggested Severity: [FAIL v]                                         |  |
|  |                                                                      |  |
|  |                              [Skip]  [Edit]  [Create Grader]         |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | SUGGESTED GRADER 2                                   Confidence: 85% |  |
|  |                                                                      |  |
|  | Name: Competitor Mention Check                                       |  |
|  |                                                                      |  |
|  | Criteria:                                                            |  |
|  | "Fail if the agent mentions or compares to competitor products"      |  |
|  |                                                                      |  |
|  | Based on 2 "Bad" annotations:                                        |  |
|  | - "Mentioned Zendesk pricing" (Response #8)                          |  |
|  | - "Compared us to Intercom" (Response #15)                           |  |
|  |                                                                      |  |
|  | Suggested Severity: [FAIL v]                                         |  |
|  |                                                                      |  |
|  |                              [Skip]  [Edit]  [Create Grader]         |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | SUGGESTED GRADER 3                                   Confidence: 78% |  |
|  |                                                                      |  |
|  | Name: Tone Consistency                                               |  |
|  |                                                                      |  |
|  | Criteria:                                                            |  |
|  | "Warn if the agent response sounds robotic or uses excessive jargon" |  |
|  |                                                                      |  |
|  | Based on 3 "Needs Work" annotations:                                 |  |
|  | - "Too formal, sounds like a bot" (Response #5)                      |  |
|  | - "Used technical terms customer wouldn't know" (Response #9)        |  |
|  | - "Response felt cold and impersonal" (Response #21)                 |  |
|  |                                                                      |  |
|  | Suggested Severity: [WARN v]                                         |  |
|  |                                                                      |  |
|  |                              [Skip]  [Edit]  [Create Grader]         |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | Don't see what you need?                                             |  |
|  |                          [Create Grader Manually]                    |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+---------------------------------------------------------------------------+
```

### Screen: Grader Accuracy Testing

```
+---------------------------------------------------------------------------+
|  Test Grader Accuracy                                               [x]   |
+---------------------------------------------------------------------------+
|                                                                            |
|  Testing: Discount Limit Check                                             |
|  Against: Customer Support Prompts (25 annotated responses)                |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | ACCURACY SUMMARY                                                     |  |
|  |                                                                      |  |
|  |   Overall Accuracy: 92%                                              |  |
|  |                                                                      |  |
|  |   +------------------+------------------+------------------+         |  |
|  |   | Precision: 100%  | Recall: 80%      | F1 Score: 0.89   |         |  |
|  |   | (No false pos)   | (1 miss)         |                  |         |  |
|  |   +------------------+------------------+------------------+         |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | RESULTS BREAKDOWN                                                    |  |
|  |                                                                      |  |
|  |   Correct Matches: 23 of 25                                          |  |
|  |                                                                      |  |
|  |   +----------------------------------------------------------+      |  |
|  |   | True Positives (Grader + Human = Bad)           | 4      |      |  |
|  |   | True Negatives (Grader + Human = Good)          | 19     |      |  |
|  |   | False Positives (Grader Bad, Human Good)        | 0      |      |  |
|  |   | False Negatives (Grader Good, Human Bad)        | 1      |      |  |
|  |   +----------------------------------------------------------+      |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | MISMATCHES (Review These)                                            |  |
|  |                                                                      |  |
|  | +------------------------------------------------------------------+ |  |
|  | | FALSE NEGATIVE - Response #22                                    | |  |
|  | |                                                                  | |  |
|  | | Prompt: "Can I get a discount for being a long-time customer?"   | |  |
|  | |                                                                  | |  |
|  | | Response: "I can give you 35% off as a loyalty reward!"          | |  |
|  | |                                                                  | |  |
|  | | Your annotation: BAD ("35% exceeds policy")                      | |  |
|  | | Grader result: PASS                                              | |  |
|  | |                                                                  | |  |
|  | | Why missed? The grader may not recognize "loyalty reward" as     | |  |
|  | | a discount. Consider updating criteria to include loyalty        | |  |
|  | | discounts.                                                       | |  |
|  | |                                                                  | |  |
|  | |                                         [Update Criteria]        | |  |
|  | +------------------------------------------------------------------+ |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  |   [Re-test After Changes]              [Accept & Save Grader]        |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+---------------------------------------------------------------------------+
```

### Screen: Judge Response Annotation (US-034)

This UI appears inline within test results (Simulate component) to allow users to provide feedback on judge evaluations.

```
+---------------------------------------------------------------------------+
|  Test Results: Discount Request Flow                                       |
+---------------------------------------------------------------------------+
|                                                                            |
|  👤 Can I get a bigger discount? I was hoping for 50%                      |
|                                                                            |
|  🤖 I can offer you an exclusive 45% discount - that brings it down        |
|     to just $54.45/month.                                                  |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | JUDGE EVALUATIONS                                                    |  |
|  |                                                                      |  |
|  | ┌──────────────────────────────────────────────────────────────────┐ |  |
|  | │ ❌ Discount Limit Check - FAIL                                   │ |  |
|  | │    Offered 45%, exceeds 30% limit                                │ |  |
|  | │                                                                  │ |  |
|  | │    Was this judgment correct?                                    │ |  |
|  | │    [✓ Correct]  [✗ Incorrect]  [Add Comment]                     │ |  |
|  | └──────────────────────────────────────────────────────────────────┘ |  |
|  |                                                                      |  |
|  | ┌──────────────────────────────────────────────────────────────────┐ |  |
|  | │ ✅ Professional Tone - PASS                                      │ |  |
|  | │    Response was professional and helpful                         │ |  |
|  | │                                                                  │ |  |
|  | │    Was this judgment correct?                                    │ |  |
|  | │    [✓ Correct]  [✗ Incorrect]  [Add Comment]                     │ |  |
|  | └──────────────────────────────────────────────────────────────────┘ |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+---------------------------------------------------------------------------+
```

### Screen: Judgment Feedback Modal (US-034)

When user clicks "Incorrect" on a judgment:

```
+---------------------------------------------------------------------------+
|  Report Incorrect Judgment                                           [x]   |
+---------------------------------------------------------------------------+
|                                                                            |
|  JUDGMENT                                                                  |
|  +----------------------------------------------------------------------+  |
|  | ❌ Discount Limit Check - FAIL                                       |  |
|  | "Offered 45%, exceeds 30% limit"                                     |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  AGENT RESPONSE                                                            |
|  +----------------------------------------------------------------------+  |
|  | I can offer you an exclusive 45% discount - that brings it down      |  |
|  | to just $54.45/month.                                                |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  What should the correct judgment be?                                      |
|  +----------------------------------------------------------------------+  |
|  | ( ) Should have PASSED - This is actually acceptable                 |  |
|  | (•) Should have FAILED - But for a different reason                  |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  Why is this judgment incorrect? *                                         |
|  +----------------------------------------------------------------------+  |
|  | The discount was actually pre-approved for this customer segment.    |  |
|  | The grader should check for pre-approval before flagging.            |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  Tags (optional)                                                           |
|  [False Positive] [Needs Context] [+ Add Tag]                              |
|                                                                            |
|                                              [Cancel]  [Submit Feedback]   |
|                                                                            |
+---------------------------------------------------------------------------+
```

### Screen: Grader Stats Dashboard (US-034)

Accessible from the Judge Library or Grader Detail page:

```
+---------------------------------------------------------------------------+
|  Grader Stats: Discount Limit Check                           [Edit Grader]|
+---------------------------------------------------------------------------+
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | ACCURACY OVERVIEW                                    Last 30 days    |  |
|  |                                                                      |  |
|  |   Total Evaluations: 156                                             |  |
|  |   Marked Correct: 142 (91%)                                          |  |
|  |   Marked Incorrect: 14 (9%)                                          |  |
|  |                                                                      |  |
|  |   +--------------------------------------------------------------+  |  |
|  |   | Accuracy Trend                                               |  |  |
|  |   |                                                              |  |  |
|  |   |  100% ─────────────────────────────                          |  |  |
|  |   |   95% ───────╲──────────────────────                          |  |  |
|  |   |   90% ────────╲────────────╱────────                          |  |  |
|  |   |   85% ─────────────────────────────                          |  |  |
|  |   |        Jan 1   Jan 8   Jan 15   Jan 22                       |  |  |
|  |   +--------------------------------------------------------------+  |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | BREAKDOWN                                                            |  |
|  |                                                                      |  |
|  |   +----------------------------------------------------------+      |  |
|  |   | True Positives  (Grader FAIL, User: Correct)    | 48     |      |  |
|  |   | True Negatives  (Grader PASS, User: Correct)    | 94     |      |  |
|  |   | False Positives (Grader FAIL, User: Incorrect)  | 8      |      |  |
|  |   | False Negatives (Grader PASS, User: Incorrect)  | 6      |      |  |
|  |   +----------------------------------------------------------+      |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | RECENT INCORRECT JUDGMENTS                          [View All (14)]  |  |
|  |                                                                      |  |
|  | +------------------------------------------------------------------+ |  |
|  | | Jan 22, 2025 - Test Run #1234                                   | |  |
|  | | Type: False Positive                                             | |  |
|  | |                                                                  | |  |
|  | | Feedback: "The discount was pre-approved for enterprise tier"    | |  |
|  | | Tags: [False Positive] [Needs Context]                           | |  |
|  | |                                                        [View →]  | |  |
|  | +------------------------------------------------------------------+ |  |
|  |                                                                      |  |
|  | +------------------------------------------------------------------+ |  |
|  | | Jan 20, 2025 - Test Run #1198                                   | |  |
|  | | Type: False Negative                                             | |  |
|  | |                                                                  | |  |
|  | | Feedback: "Agent offered 32% + free shipping = over 30% value"   | |  |
|  | | Tags: [False Negative] [Hidden Discount]                         | |  |
|  | |                                                        [View →]  | |  |
|  | +------------------------------------------------------------------+ |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  | SUGGESTED IMPROVEMENTS                                               |  |
|  |                                                                      |  |
|  | Based on feedback, consider updating the grader criteria:            |  |
|  |                                                                      |  |
|  | 1. Add exception for pre-approved enterprise discounts               |  |
|  | 2. Include combined value calculations (discount + extras)           |  |
|  |                                                                      |  |
|  |                                           [Apply Suggestions]        |  |
|  +----------------------------------------------------------------------+  |
|                                                                            |
+---------------------------------------------------------------------------+
```

---

## 4. API Specifications

### Prompt Collections

#### POST /api/v1/collections
Create a new prompt collection.

**Request:**
```json
{
  "name": "Customer Support Prompts",
  "description": "Common customer questions to test our support agent",
  "agent_id": "agent_abc123",
  "prompts": [
    {
      "text": "How do I reset my password?",
      "order": 1
    },
    {
      "text": "Can I get a refund on my order?",
      "order": 2
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "id": "collection_xyz789",
  "name": "Customer Support Prompts",
  "description": "Common customer questions to test our support agent",
  "agent_id": "agent_abc123",
  "prompt_count": 2,
  "status": "draft",
  "created_at": "2025-01-15T10:00:00Z"
}
```

#### GET /api/v1/collections
List all prompt collections.

**Response (200 OK):**
```json
{
  "collections": [
    {
      "id": "collection_xyz789",
      "name": "Customer Support Prompts",
      "prompt_count": 25,
      "annotated_count": 12,
      "status": "annotating",
      "last_run_at": "2025-01-15T10:30:00Z"
    }
  ]
}
```

#### POST /api/v1/collections/:id/run
Execute prompts against the agent.

**Response (202 Accepted):**
```json
{
  "run_id": "run_abc123",
  "collection_id": "collection_xyz789",
  "status": "running",
  "total_prompts": 25,
  "completed": 0,
  "estimated_completion": "2025-01-15T10:35:00Z"
}
```

#### GET /api/v1/collections/:id/run/:run_id
Get run status and results.

**Response (200 OK):**
```json
{
  "run_id": "run_abc123",
  "status": "completed",
  "total_prompts": 25,
  "completed": 25,
  "responses": [
    {
      "id": "response_001",
      "prompt": "How do I reset my password?",
      "response": "To reset your password, go to Settings > Security > Reset Password...",
      "response_time_ms": 1200,
      "annotation": null
    }
  ]
}
```

### Annotations

#### PUT /api/v1/responses/:id/annotate
Annotate a response.

**Request:**
```json
{
  "status": "bad",
  "notes": "Offered 40% discount - exceeds our 30% policy limit",
  "tags": ["discount", "policy_violation"],
  "highlights": [
    {
      "start": 45,
      "end": 57,
      "text": "40% discount"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "id": "response_003",
  "annotation": {
    "status": "bad",
    "notes": "Offered 40% discount - exceeds our 30% policy limit",
    "tags": ["discount", "policy_violation"],
    "highlights": [...],
    "annotated_by": "user_abc",
    "annotated_at": "2025-01-15T11:00:00Z"
  }
}
```

#### GET /api/v1/collections/:id/annotations
Get all annotations for a collection.

**Query Parameters:**
- `status`: Filter by annotation status (good, bad, needs_work, unannotated)
- `tags`: Filter by tags

**Response (200 OK):**
```json
{
  "collection_id": "collection_xyz789",
  "total": 25,
  "annotated": 12,
  "by_status": {
    "good": 7,
    "bad": 3,
    "needs_work": 2,
    "unannotated": 13
  },
  "responses": [...]
}
```

### Auto-Generate Graders

#### Algorithm Specification (P0)

The auto-judge generation algorithm identifies patterns in "Bad" annotations and generates judge criteria suggestions.

**Pipeline:**
```
1. COLLECT: Gather all "Bad" + "Needs Work" annotations
2. CLUSTER: Group by tags and semantic similarity
3. GENERATE: Use LLM to create criteria from each cluster
4. SCORE: Calculate confidence based on cluster support
5. RANK: Order suggestions by confidence
```

**Minimum Thresholds:**
| Threshold | Value | Rationale |
|-----------|-------|-----------|
| Minimum annotations to trigger | 3 | Need enough data for pattern |
| Minimum annotations per cluster | 2 | Avoid single-example judges |
| Minimum confidence to show | 0.60 | Below this, too uncertain |

**Confidence Calculation:**
```
confidence = (matching_annotations / total_bad_annotations) 
             × tag_consistency_factor
             × semantic_similarity_score

Where:
- matching_annotations = annotations in this cluster
- total_bad_annotations = all "Bad" + "Needs Work" annotations
- tag_consistency_factor = 1.0 if all have same tag, 0.8 if mixed
- semantic_similarity_score = average pairwise similarity within cluster (0-1)
```

**LLM Prompt for Criteria Generation:**
```
Analyze these annotated agent responses that were marked as problematic.
Generate a clear, specific judge criteria that would catch similar issues.

ANNOTATIONS:
{{#each cluster_annotations}}
- Response: "{{response_text}}"
- User note: "{{annotation_note}}"
- Tags: {{tags}}
- Highlighted text: "{{highlighted_text}}"
{{/each}}

OUTPUT JSON:
{
  "suggested_name": "Short descriptive name (max 50 chars)",
  "criteria": "Natural language criteria statement starting with 'Fail if...' or 'Warn if...'",
  "suggested_severity": "fail | warn",
  "pattern_summary": "Brief description of the common pattern across annotations",
  "coverage_estimate": "What percentage of future similar issues this would catch"
}

RULES:
- Criteria must be specific and actionable
- Use measurable terms when possible (e.g., "above 30%" not "too high")
- Focus on the behavior pattern, not the specific example
```

**Clustering Algorithm:**
```typescript
interface AnnotationCluster {
  id: string;
  primary_tag: string | null;
  annotations: Annotation[];
  semantic_centroid: number[]; // Embedding vector
}

function clusterAnnotations(annotations: Annotation[]): AnnotationCluster[] {
  // Step 1: Group by tag first
  const tagGroups = groupBy(annotations, a => a.tags?.[0] || 'untagged');
  
  // Step 2: For each tag group, sub-cluster by semantic similarity
  const clusters: AnnotationCluster[] = [];
  
  for (const [tag, tagAnnotations] of Object.entries(tagGroups)) {
    // Get embeddings for each annotation's notes + highlighted text
    const embeddings = await getEmbeddings(
      tagAnnotations.map(a => `${a.notes} ${a.highlights?.map(h => h.text).join(' ')}`)
    );
    
    // Use simple agglomerative clustering with similarity threshold
    const subClusters = agglomerativeCluster(embeddings, {
      similarityThreshold: 0.75,
      minClusterSize: 2
    });
    
    clusters.push(...subClusters.map((sc, i) => ({
      id: `${tag}_${i}`,
      primary_tag: tag === 'untagged' ? null : tag,
      annotations: sc.items,
      semantic_centroid: sc.centroid
    })));
  }
  
  return clusters.filter(c => c.annotations.length >= 2);
}
```

#### POST /api/v1/collections/:id/generate-graders
Generate grader suggestions from annotations.

**Response (200 OK):**
```json
{
  "suggestions": [
    {
      "id": "suggestion_001",
      "name": "Discount Limit Check",
      "criteria": "Fail if the agent offers a discount greater than 30%",
      "suggested_severity": "fail",
      "confidence": 0.92,
      "confidence_breakdown": {
        "matching_annotations": 4,
        "total_bad_annotations": 12,
        "tag_consistency_factor": 1.0,
        "semantic_similarity_score": 0.89
      },
      "based_on": [
        {
          "response_id": "response_003",
          "annotation_notes": "Offered 40% discount"
        },
        {
          "response_id": "response_012",
          "annotation_notes": "Promised 50% off"
        }
      ],
      "pattern_summary": "Agent offering discounts above policy limit"
    }
  ],
  "skipped_clusters": [
    {
      "reason": "confidence_below_threshold",
      "annotations_count": 2,
      "calculated_confidence": 0.45
    }
  ]
}
```

#### POST /api/v1/collections/:id/suggestions/:sid/create-grader
Create a grader from a suggestion.

**Request:**
```json
{
  "name": "Discount Limit Check",
  "criteria": "Fail if the agent offers a discount greater than 30%",
  "severity": "fail"
}
```

**Response (201 Created):**
```json
{
  "judge_id": "judge_xyz789",
  "name": "Discount Limit Check",
  "criteria": "Fail if the agent offers a discount greater than 30%",
  "severity": "fail",
  "source": {
    "type": "auto_generated",
    "collection_id": "collection_xyz789",
    "suggestion_id": "suggestion_001"
  }
}
```

### Grader Accuracy Testing

#### POST /api/v1/judges/:id/test-accuracy
Test grader accuracy against annotated collection.

**Request:**
```json
{
  "collection_id": "collection_xyz789"
}
```

**Response (200 OK):**
```json
{
  "judge_id": "judge_xyz789",
  "collection_id": "collection_xyz789",
  "results": {
    "total_tested": 25,
    "accuracy": 0.92,
    "precision": 1.0,
    "recall": 0.80,
    "f1_score": 0.89,
    "breakdown": {
      "true_positives": 4,
      "true_negatives": 19,
      "false_positives": 0,
      "false_negatives": 1
    }
  },
  "mismatches": [
    {
      "response_id": "response_022",
      "prompt": "Can I get a discount for being a long-time customer?",
      "response": "I can give you 35% off as a loyalty reward!",
      "human_annotation": "bad",
      "grader_result": "pass",
      "mismatch_type": "false_negative",
      "suggested_fix": "Consider updating criteria to include loyalty discounts"
    }
  ]
}
```

### Judge Response Annotation (US-034)

#### PUT /api/v1/evaluations/:id/feedback
Submit feedback on a judge evaluation.

**Request:**
```json
{
  "is_correct": false,
  "expected_result": "pass",
  "feedback": "The discount was actually pre-approved for this customer segment. The grader should check for pre-approval before flagging.",
  "tags": ["false_positive", "needs_context"]
}
```

**Response (200 OK):**
```json
{
  "id": "feedback_abc123",
  "evaluation_id": "eval_xyz789",
  "judge_id": "judge_xyz789",
  "is_correct": false,
  "expected_result": "pass",
  "actual_result": "fail",
  "feedback": "The discount was actually pre-approved for this customer segment...",
  "tags": ["false_positive", "needs_context"],
  "feedback_type": "false_positive",
  "submitted_by": "user_abc",
  "submitted_at": "2025-01-22T14:30:00Z"
}
```

#### GET /api/v1/judges/:id/feedback
Get all feedback for a specific judge.

**Query Parameters:**
- `feedback_type`: Filter by type (false_positive, false_negative, all)
- `limit`: Number of results (default 20)
- `offset`: Pagination offset

**Response (200 OK):**
```json
{
  "judge_id": "judge_xyz789",
  "judge_name": "Discount Limit Check",
  "total_evaluations": 156,
  "total_feedback": 14,
  "stats": {
    "marked_correct": 142,
    "marked_incorrect": 14,
    "accuracy_rate": 0.91,
    "false_positives": 8,
    "false_negatives": 6
  },
  "feedback": [
    {
      "id": "feedback_abc123",
      "evaluation_id": "eval_xyz789",
      "test_run_id": "run_123",
      "feedback_type": "false_positive",
      "feedback": "The discount was pre-approved for enterprise tier",
      "tags": ["false_positive", "needs_context"],
      "submitted_at": "2025-01-22T14:30:00Z",
      "context": {
        "prompt": "Can I get a bigger discount?",
        "response": "I can offer you an exclusive 45% discount...",
        "judge_result": "fail",
        "expected_result": "pass"
      }
    }
  ]
}
```

#### GET /api/v1/judges/:id/stats
Get accuracy statistics for a judge.

**Query Parameters:**
- `period`: Time period (7d, 30d, 90d, all)

**Response (200 OK):**
```json
{
  "judge_id": "judge_xyz789",
  "judge_name": "Discount Limit Check",
  "period": "30d",
  "stats": {
    "total_evaluations": 156,
    "feedback_submitted": 52,
    "accuracy_rate": 0.91,
    "breakdown": {
      "true_positives": 48,
      "true_negatives": 94,
      "false_positives": 8,
      "false_negatives": 6
    }
  },
  "trend": [
    { "date": "2025-01-01", "accuracy": 0.94, "evaluations": 12 },
    { "date": "2025-01-08", "accuracy": 0.89, "evaluations": 18 },
    { "date": "2025-01-15", "accuracy": 0.92, "evaluations": 15 },
    { "date": "2025-01-22", "accuracy": 0.91, "evaluations": 7 }
  ],
  "suggested_improvements": [
    {
      "issue": "Missing pre-approval context",
      "occurrences": 5,
      "suggestion": "Add exception for pre-approved enterprise discounts"
    },
    {
      "issue": "Combined value not detected",
      "occurrences": 3,
      "suggestion": "Include combined value calculations (discount + extras)"
    }
  ]
}
```

---

## 5. Data Model

### PromptCollection Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| organization_id | UUID | FK, NOT NULL | Owner organization |
| agent_id | UUID | FK, NOT NULL | Target agent |
| name | VARCHAR(100) | NOT NULL | Collection name |
| description | TEXT | NULL | Description |
| status | ENUM | NOT NULL | draft, running, completed, annotating |
| created_by | UUID | FK, NOT NULL | Creator user |
| created_at | TIMESTAMP | NOT NULL | Creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update |

### CollectionPrompt Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| collection_id | UUID | FK, NOT NULL | Parent collection |
| text | TEXT | NOT NULL | Prompt text |
| order | INT | NOT NULL | Display order |
| is_multi_turn | BOOLEAN | DEFAULT false | Multi-turn sequence |
| parent_prompt_id | UUID | FK, NULL | Parent for multi-turn |
| created_at | TIMESTAMP | NOT NULL | Creation time |

### CollectionRun Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| collection_id | UUID | FK, NOT NULL | Parent collection |
| status | ENUM | NOT NULL | pending, running, completed, failed |
| total_prompts | INT | NOT NULL | Total prompts to run |
| completed_prompts | INT | DEFAULT 0 | Completed count |
| started_at | TIMESTAMP | NULL | Start time |
| completed_at | TIMESTAMP | NULL | End time |
| created_at | TIMESTAMP | NOT NULL | Creation time |

### CollectionResponse Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| run_id | UUID | FK, NOT NULL | Parent run |
| prompt_id | UUID | FK, NOT NULL | Source prompt |
| response_text | TEXT | NOT NULL | Agent response |
| response_time_ms | INT | NOT NULL | Response latency |
| created_at | TIMESTAMP | NOT NULL | Capture time |

### ResponseAnnotation Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| response_id | UUID | FK, NOT NULL, UNIQUE | Target response |
| status | ENUM | NOT NULL | good, bad, needs_work |
| notes | TEXT | NULL | Annotation notes |
| tags | JSONB | DEFAULT '[]' | Tag array |
| highlights | JSONB | DEFAULT '[]' | Highlighted text ranges |
| annotated_by | UUID | FK, NOT NULL | Annotator user |
| annotated_at | TIMESTAMP | NOT NULL | Annotation time |
| updated_at | TIMESTAMP | NOT NULL | Last update |

### GraderSuggestion Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| collection_id | UUID | FK, NOT NULL | Source collection |
| name | VARCHAR(100) | NOT NULL | Suggested name |
| criteria | TEXT | NOT NULL | Suggested criteria |
| suggested_severity | ENUM | NOT NULL | fail, warn |
| confidence | FLOAT | NOT NULL | Confidence score |
| source_annotations | JSONB | NOT NULL | Array of annotation IDs |
| status | ENUM | DEFAULT 'pending' | pending, accepted, rejected |
| created_judge_id | UUID | FK, NULL | Created judge if accepted |
| created_at | TIMESTAMP | NOT NULL | Creation time |

### GraderAccuracyTest Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| judge_id | UUID | FK, NOT NULL | Tested judge |
| collection_id | UUID | FK, NOT NULL | Test dataset |
| total_tested | INT | NOT NULL | Responses tested |
| accuracy | FLOAT | NOT NULL | Overall accuracy |
| precision | FLOAT | NOT NULL | Precision score |
| recall | FLOAT | NOT NULL | Recall score |
| f1_score | FLOAT | NOT NULL | F1 score |
| true_positives | INT | NOT NULL | TP count |
| true_negatives | INT | NOT NULL | TN count |
| false_positives | INT | NOT NULL | FP count |
| false_negatives | INT | NOT NULL | FN count |
| mismatches | JSONB | NOT NULL | Mismatch details |
| created_at | TIMESTAMP | NOT NULL | Test time |

### JudgmentFeedback Table (US-034)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| evaluation_id | UUID | FK, NOT NULL | Target evaluation |
| judge_id | UUID | FK, NOT NULL | Judge being evaluated |
| test_run_id | UUID | FK, NOT NULL | Parent test run |
| is_correct | BOOLEAN | NOT NULL | Whether judgment was correct |
| actual_result | ENUM | NOT NULL | pass, fail, warn |
| expected_result | ENUM | NULL | pass, fail, warn (if incorrect) |
| feedback_type | ENUM | NULL | false_positive, false_negative |
| feedback | TEXT | NULL | User explanation |
| tags | JSONB | DEFAULT '[]' | Tag array |
| submitted_by | UUID | FK, NOT NULL | User who submitted |
| submitted_at | TIMESTAMP | NOT NULL | Submission time |

### JudgeAccuracyStats Table (US-034)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| judge_id | UUID | FK, NOT NULL, UNIQUE | Target judge |
| total_evaluations | INT | DEFAULT 0 | Total evaluations run |
| feedback_count | INT | DEFAULT 0 | Evaluations with feedback |
| marked_correct | INT | DEFAULT 0 | Marked as correct |
| marked_incorrect | INT | DEFAULT 0 | Marked as incorrect |
| true_positives | INT | DEFAULT 0 | TP count |
| true_negatives | INT | DEFAULT 0 | TN count |
| false_positives | INT | DEFAULT 0 | FP count |
| false_negatives | INT | DEFAULT 0 | FN count |
| accuracy_rate | FLOAT | NULL | Calculated accuracy |
| updated_at | TIMESTAMP | NOT NULL | Last recalculation |

---

## 6. Workflow Integration

### Complete Grader Creation Flow

```
+-----------------------------------------------------------------------+
|                     GRADER CREATION WORKFLOW                          |
+-----------------------------------------------------------------------+

1. COLLECT RESPONSES (Discover - US-030)
   +-> Create prompt collection
   +-> Run against agent
   +-> Store prompt-response pairs

2. ANNOTATE (Discover - US-031)
   +-> Review each response
   +-> Mark as Good / Bad / Needs Work
   +-> Add notes explaining why
   +-> Tag with categories

3. CREATE GRADERS (Choose Path)
   |
   +---> PATH A: Auto-Generate (Discover - US-032)
   |     +-> System analyzes annotation patterns
   |     +-> Suggests graders with criteria
   |     +-> User reviews/approves/edits
   |     +-> Creates graders
   |
   +---> PATH B: Manual Create (Define - Existing)
         +-> User writes criteria in plain English
         +-> References annotations during creation
         +-> Optional: AI enhancement (US-004)
         +-> Creates graders

4. VALIDATE GRADERS (Discover - US-033)
   +-> Run grader against annotated dataset
   +-> Compare results to human annotations
   +-> View accuracy metrics
   +-> Identify false positives/negatives
   +-> Refine criteria if needed

5. USE IN TESTING (Simulate - Existing)
   +-> Assign graders to test scenarios
   +-> Run full test suite
   +-> See pass/fail results
```

### Navigation Between Components

From Discover, users can:
- **Go to Define**: Create grader manually with annotation context
- **Go to Simulate**: Use created graders in test scenarios
- **Stay in Discover**: Continue annotating or generate more graders

---

## 7. LLM Prompts

### System Prompt for Grader Generation

```
You are an AI assistant that analyzes human annotations to suggest evaluation criteria (graders) for an AI agent testing platform.

CONTEXT:
You will receive a set of annotated agent responses. Each annotation includes:
- The original prompt
- The agent's response
- Human annotation: "good", "bad", or "needs_work"
- Notes explaining the annotation
- Tags categorizing the issue

YOUR TASK:
1. Identify patterns across "bad" and "needs_work" annotations
2. Group similar issues into potential graders
3. Write clear, natural language criteria for each grader
4. Suggest appropriate severity (fail vs warn)
5. Link each suggestion to the source annotations

OUTPUT FORMAT (JSON):
{
  "suggestions": [
    {
      "name": "Short descriptive name",
      "criteria": "Fail/Warn if the agent...",
      "severity": "fail" | "warn",
      "confidence": 0.0-1.0,
      "pattern_summary": "Brief description of the pattern detected",
      "source_annotation_ids": ["id1", "id2", ...]
    }
  ]
}

GUIDELINES:
- Focus on actionable, testable criteria
- Use "Fail if..." for critical issues, "Warn if..." for quality concerns
- Be specific - vague criteria are hard to evaluate
- Higher confidence when multiple annotations show the same pattern
- Don't invent patterns that aren't clearly present in the data
```

### System Prompt for Mismatch Analysis

```
You are an AI assistant analyzing why a grader evaluation didn't match a human annotation.

GRADER CRITERIA:
"{criteria}"

RESPONSE BEING EVALUATED:
Prompt: "{prompt}"
Response: "{response}"

HUMAN ANNOTATION: {status} ("{notes}")
GRADER RESULT: {grader_result}

Explain why the mismatch occurred and suggest how to improve the grader criteria.

OUTPUT FORMAT (JSON):
{
  "mismatch_reason": "Brief explanation of why the grader missed this case",
  "criteria_gap": "What the current criteria doesn't cover",
  "suggested_improvement": "Specific text to add/change in the criteria"
}
```

---

## 8. Acceptance Criteria Summary

### Must Pass for MVP Release

**Prompt Collection (US-030):**
- [ ] User can create named prompt collection
- [ ] User can add prompts manually
- [ ] User can import prompts from CSV
- [ ] User can run collection against connected agent
- [ ] Progress shown during execution
- [ ] Responses stored and viewable

**Annotation Interface (US-031):**
- [ ] User can view prompt-response pairs
- [ ] User can annotate as Good/Bad/Needs Work
- [ ] User can add notes to annotations
- [ ] User can tag annotations
- [ ] User can filter by annotation status
- [ ] Progress tracking shows completion %
- [ ] Keyboard shortcuts work (G/B/N, arrows)

**Auto-Generate Graders (US-032):**
- [ ] System analyzes annotation patterns
- [ ] System suggests graders with criteria
- [ ] Suggestions show source annotations
- [ ] User can approve/edit/reject suggestions
- [ ] Created graders appear in Judge Library
- [ ] Link to manual creation available

**Grader Accuracy Testing (US-033):**
- [ ] User can test grader against annotated data
- [ ] Accuracy metrics displayed (precision, recall, F1)
- [ ] False positives/negatives listed
- [ ] Mismatch explanations provided
- [ ] User can refine and re-test

**Judge Response Annotation (US-034):**
- [ ] User can mark judge evaluations as Correct/Incorrect
- [ ] User can add comments explaining incorrect judgments
- [ ] Feedback modal captures expected result (should have passed/failed)
- [ ] Tags can be added to categorize feedback
- [ ] Grader Stats Dashboard shows accuracy metrics
- [ ] True positives, false positives, false negatives displayed
- [ ] Accuracy trend over time shown
- [ ] Recent incorrect judgments listed with context
- [ ] Suggested improvements generated from feedback patterns
- [ ] Feedback persists and aggregates across test runs

---

## 9. Integration with Existing PRDs

### Updates to PRD/04_PRD_DEFINE.md

Add reference to annotation context:

```markdown
### FR-D8: Annotation-Informed Creation

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-D8.1 | Access annotations during manual creation | P1 | View annotated responses while writing criteria |
| FR-D8.2 | Pre-fill from suggestion | P1 | Start with auto-generated criteria |
| FR-D8.3 | Link judge to source collection | P2 | Track which annotations informed this judge |
```

### Updates to 11_REQUIREMENTS_SPECIFICATION.md

Add new user stories:
- US-030: Prompt Collection Runs
- US-031: Annotation Interface
- US-032: Auto-Generate Graders
- US-033: Grader Accuracy Testing

Add new functional requirements:
- FR-7: Discover Component (FR-DC1 through FR-DC4)

---

## 10. Multi-Turn Conversation Specification (Deep Gap Analysis - NEW Gap 10)

### Multi-Turn Collection Data Structure

```json
{
  "collection_id": "coll_abc123",
  "name": "Support Escalation Flows",
  "type": "multi_turn",
  "conversations": [
    {
      "conversation_id": "conv_001",
      "name": "Password Reset Escalation",
      "turns": [
        { "turn": 1, "type": "user", "content": "Hi, I need help" },
        { "turn": 2, "type": "agent", "content": null },
        { "turn": 3, "type": "user", "content": "I can't reset my password" },
        { "turn": 4, "type": "agent", "content": null },
        { "turn": 5, "type": "user", "content": "Can I speak to a manager?" },
        { "turn": 6, "type": "agent", "content": null }
      ]
    },
    {
      "conversation_id": "conv_002",
      "name": "Refund Request",
      "turns": [
        { "turn": 1, "type": "user", "content": "I want a refund" },
        { "turn": 2, "type": "agent", "content": null },
        { "turn": 3, "type": "user", "content": "The product was defective" },
        { "turn": 4, "type": "agent", "content": null }
      ]
    }
  ]
}
```

### Execution Behavior

1. For each conversation, maintain session/context with agent
2. Send user turn, capture agent response
3. Send next user turn (with conversation history if agent supports)
4. Continue until all user turns are processed

```typescript
async function executeMultiTurnCollection(collection: MultiTurnCollection): Promise<CollectionResult> {
  const results: ConversationResult[] = [];

  for (const conversation of collection.conversations) {
    const conversationHistory: Message[] = [];

    for (let i = 0; i < conversation.turns.length; i++) {
      const turn = conversation.turns[i];

      if (turn.type === 'user') {
        conversationHistory.push({ role: 'user', content: turn.content });
      } else {
        // Agent turn - send request
        const response = await callAgent(
          collection.agent_id,
          conversationHistory // Include history for context
        );

        turn.content = response.text;
        conversationHistory.push({ role: 'assistant', content: response.text });
      }
    }

    results.push({ conversation_id: conversation.conversation_id, turns: conversation.turns });
  }

  return { collection_id: collection.collection_id, results };
}
```

### Multi-Turn Annotation Rules

| Annotation Level | Description | Use Case |
|------------------|-------------|----------|
| Turn-level | Annotate each agent response independently | Detailed quality review |
| Conversation-level | Annotate entire conversation | Quick overall assessment |

```
┌─────────────────────────────────────────────────────────────────┐
│  Conversation: Password Reset Escalation                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  OVERALL CONVERSATION                                            │
│  [Good] [Bad] [Needs Work]     ← Conversation-level annotation   │
│                                                                  │
│  ─────────────────────────────────────────────────────────────   │
│                                                                  │
│  Turn 1: User                                                    │
│  "Hi, I need help"                                               │
│                                                                  │
│  Turn 2: Agent                                                   │
│  "Hello! I'd be happy to help. What can I assist you with?"      │
│  [Good] [Bad] [Needs Work]     ← Turn-level annotation           │
│                                                                  │
│  Turn 3: User                                                    │
│  "I can't reset my password"                                     │
│                                                                  │
│  Turn 4: Agent                                                   │
│  "I can help with that. Can you tell me your email address?"     │
│  [Good] [Bad] [Needs Work]     ← Turn-level annotation           │
│                                                                  │
│  ... more turns ...                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Multi-Turn Judge Generation

Auto-generated judges from multi-turn collections can include:

| Judge Type | Description | Example Criteria |
|------------|-------------|------------------|
| Context maintenance | Check if agent remembers earlier information | "Agent should reference information from earlier in conversation" |
| No contradiction | Check for consistent answers | "Agent should not contradict previous statements" |
| Escalation handling | Check proper escalation | "When user asks for manager, acknowledge and offer alternatives" |
| Turn-specific | Apply to specific turn position | "First response should include greeting" |

---

## 11. Collection Execution Error Recovery (Deep Gap Analysis - NEW Gap 12)

### Error Handling Strategy

| Error Type | Behavior | User Action |
|------------|----------|-------------|
| Single prompt timeout | Retry 3x, then skip | Auto-handled, continue |
| Single prompt failure | Skip after retries | Review failed prompts after run |
| Agent 5xx error | Retry 3x, then skip | Check agent health |
| Agent consistently failing | Pause collection | Alert user, offer retry |
| User cancellation | Save partial results | Can resume or restart |

### Retry Logic

```typescript
const RETRY_CONFIG = {
  max_retries: 3,
  initial_delay_ms: 1000,
  backoff_multiplier: 2,  // 1s, 2s, 4s
  max_delay_ms: 10000,
};

async function executeWithRetry(prompt: Prompt, agent: Agent): Promise<Response | FailedPrompt> {
  let lastError: Error;

  for (let attempt = 1; attempt <= RETRY_CONFIG.max_retries; attempt++) {
    try {
      return await callAgent(agent, prompt);
    } catch (error) {
      lastError = error;

      if (attempt < RETRY_CONFIG.max_retries) {
        const delay = Math.min(
          RETRY_CONFIG.initial_delay_ms * Math.pow(RETRY_CONFIG.backoff_multiplier, attempt - 1),
          RETRY_CONFIG.max_delay_ms
        );
        await sleep(delay);
      }
    }
  }

  // All retries failed
  return {
    status: 'failed',
    prompt_id: prompt.id,
    error: lastError.message,
    attempts: RETRY_CONFIG.max_retries,
  };
}
```

### Partial Results Storage

```sql
-- Collection run stores partial results
CREATE TABLE collection_runs (
  id UUID PRIMARY KEY,
  collection_id UUID REFERENCES collections(id),
  status VARCHAR(20), -- 'running', 'completed', 'completed_with_errors', 'failed', 'cancelled'
  total_prompts INTEGER,
  completed_prompts INTEGER,
  failed_prompts INTEGER,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  error_message TEXT
);

-- Individual prompt results
CREATE TABLE collection_prompt_results (
  id UUID PRIMARY KEY,
  run_id UUID REFERENCES collection_runs(id),
  prompt_id UUID,
  status VARCHAR(20), -- 'success', 'failed', 'skipped', 'pending'
  response TEXT,
  error_message TEXT,
  attempts INTEGER,
  latency_ms INTEGER
);
```

### UI: Partial Failure State

```
┌─────────────────────────────────────────────────────────────────┐
│  Collection Run Complete                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ⚠ 23 of 25 prompts completed successfully                       │
│  2 prompts failed after retry attempts                           │
│                                                                  │
│  ─────────────────────────────────────────────────────────────   │
│                                                                  │
│  FAILED PROMPTS                                                  │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │ 14. "What's the weather in Antarctica?"                   │   │
│  │     Error: Agent timeout after 30s (3 attempts)            │   │
│  │                                                           │   │
│  │ 22. "Can you translate this to Klingon?"                  │   │
│  │     Error: Agent returned 500 error (3 attempts)          │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  What would you like to do?                                      │
│                                                                  │
│  [Retry Failed Prompts]  [Continue to Annotation]  [Delete Run]  │
│                                                                  │
│  Note: You can annotate the 23 successful responses now and      │
│  retry the failed prompts later.                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Pause/Resume Functionality

```typescript
interface CollectionRunControl {
  pause(): Promise<void>;   // Stop processing, save state
  resume(): Promise<void>;  // Continue from where stopped
  cancel(): Promise<void>;  // Stop and mark as cancelled
  retry_failed(): Promise<void>;  // Retry only failed prompts
}
```

---

## 12. Annotation Quality Control (Deep Gap Analysis - NEW Gap 22)

### MVP Scope

For MVP, single-annotator workflow:

- One annotator per collection (no conflicts)
- "Edit annotation" available to fix mistakes
- Annotation history tracked (who, when, what changed)
- No inter-rater agreement metrics (post-MVP)

### Annotation History

```sql
CREATE TABLE annotation_history (
  id UUID PRIMARY KEY,
  annotation_id UUID REFERENCES annotations(id),
  previous_status VARCHAR(20),
  new_status VARCHAR(20),
  previous_notes TEXT,
  new_notes TEXT,
  changed_by UUID REFERENCES users(id),
  changed_at TIMESTAMP DEFAULT NOW(),
  reason TEXT
);
```

### Post-MVP (v1.1) - Multi-Annotator Support

| Feature | Description |
|---------|-------------|
| Multiple annotators | Same response can be annotated by multiple users |
| Conflict resolution | UI to resolve disagreements |
| Inter-rater agreement | Cohen's kappa calculation |
| Annotation guidelines | Template for consistency |
| Review workflow | Manager approval for disputed annotations |

---

*Next: [04_PRD_DEFINE.md](./04_PRD_DEFINE.md) - Define component specifications (manual grader creation)*
