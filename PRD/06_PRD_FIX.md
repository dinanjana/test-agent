# PRD: Fix Component (The Fix Loop)

## Component Overview

| Attribute | Value |
|-----------|-------|
| **Component** | Fix - Actionable Engineering Tickets |
| **Priority** | P0 (Core Differentiator) |
| **Development Phase** | Phase 3: Weeks 6-7 |
| **Primary Persona** | Engineer Evan, PM Priya |

---

## Important Context: Black-Box Constraints

> **TestAgent operates as a black-box testing solution.** We connect to AI agents via HTTP endpoint only and **never** have access to:
> - The agent's system prompt
> - The agent's internal configuration
> - The agent's training data or fine-tuning
>
> This means the Fix component focuses on **failure analysis and detailed ticket generation**, not prompt modification suggestions.

---

## Problem Statement

### Current State
> "Current tools give you beautiful dashboards showing your agent failed. Then what? Engineers dig through traces. PMs file tickets. Everyone interprets the problem differently."

### The Gap
1. **No actionable output** - Existing tools stop at "test failed"
2. **Lost context** - Manual tickets lose conversation context
3. **Interpretation mismatch** - PMs and engineers describe failures differently
4. **Slow resolution** - Time from failure to fix averages 2-3 days

### TestAgent Solution
The Fix Loop transforms failures into detailed analysis with root cause categorization, highlighted violations, and auto-generated tickets with full context - reducing the investigation time from days to hours.

---

## What Fix CAN Do (Black-Box)

| Capability | Description |
|------------|-------------|
| **Root Cause Analysis** | Categorize why it failed (HALLUCINATION, TONE_VIOLATION, etc.) |
| **Detailed Reasoning** | Explain what went wrong with evidence from the conversation |
| **Violation Highlighting** | Point to specific parts of the response that violated criteria |
| **Full Context Capture** | Include complete request/response in tickets |
| **Actionable Tickets** | Create Jira/Linear tickets engineers can act on |
| **General Recommendations** | Provide guidance (not specific prompt text) |

## What Fix CANNOT Do (Black-Box)

| Impossible Feature | Why |
|-------------------|-----|
| Suggest specific prompt changes | We don't have access to the agent's prompt |
| Show diff of prompt modifications | We don't know what to diff |
| "Apply fix" functionality | We can't modify their agent |
| Confidence scores for prompt fixes | No prompt = no fix to score |

---

## User Stories

### Primary Story (P0)
> As an **engineer**, I want **auto-generated tickets with detailed failure analysis when tests fail**, so I can **resolve issues quickly without lengthy investigation**.

### Supporting Stories

| ID | As a... | I want to... | So that... | Priority |
|----|---------|--------------|------------|----------|
| FIX-01 | Engineer | See detailed failure analysis | I understand why the test failed | P0 |
| FIX-02 | Engineer | See the exact violation highlighted | I know exactly what went wrong | P0 |
| FIX-03 | PM | Create Jira tickets with one click | Engineering has full context | P0 |
| FIX-04 | Engineer | Get general recommendations | I have guidance on what area to investigate | P1 |
| FIX-05 | PM | Track fix status from TestAgent | I know when issues are resolved | P2 |

---

## Feature Specifications

### Feature 1: Failure Analysis Engine

#### Description
Automatically analyze failed tests to identify root causes and patterns.

#### Functional Requirements

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Root cause identification | Categorize failure type | P0 |
| Pattern recognition | Identify recurring failures | P0 |
| Context extraction | Pull relevant conversation context | P0 |
| Severity classification | Distinguish critical vs. minor | P1 |
| Historical correlation | Link to similar past failures | P2 |

#### Root Cause Categories

```
Failure Categories:
1. MISSING_INSTRUCTION - Agent lacks specific guidance for this scenario
2. EDGE_CASE - Scenario not covered in agent's handling
3. CONFLICTING_RULES - Agent behaves inconsistently
4. HALLUCINATION - Agent generated false information
5. TONE_VIOLATION - Response style doesn't match criteria
6. SAFETY_BREACH - Agent exceeded guardrails
7. CONTEXT_LOSS - Multi-turn context not maintained
```

#### Analysis Output Schema

```json
{
  "failure_id": "string",
  "test_run_id": "string",
  "failed_turn": {
    "turn_number": "number",
    "user_message": "string",
    "agent_response": "string"
  },
  "analysis": {
    "root_cause_category": "MISSING_INSTRUCTION | EDGE_CASE | ...",
    "confidence": "number (0-1)",
    "explanation": "string (human-readable)",
    "violation_highlight": "string (specific text that violated criteria)",
    "evidence": [
      {
        "type": "conversation_excerpt | judge_criteria | pattern_match",
        "content": "string"
      }
    ],
    "recommendation": "string (general guidance, not prompt text)"
  },
  "severity": "critical | high | medium | low",
  "similar_failures": ["failure_id_1", "failure_id_2"]
}
```

---

### Feature 2: Failure Reasoning Engine

#### Description
Generate detailed explanations of failures with highlighted violations and general recommendations.

#### Functional Requirements

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Violation highlighting | Identify exact problematic text in response | P0 |
| Evidence gathering | Collect relevant quotes from conversation | P0 |
| Recommendation generation | Provide general guidance (not prompt text) | P1 |
| Pattern matching | Link to similar failures | P2 |

#### Reasoning Generation Process

```
Failure Reasoning Pipeline:

1. INPUT: Failed judge result + conversation context

2. ANALYZE:
   - Identify the specific text that violated criteria
   - Extract evidence quotes from the conversation
   - Categorize the root cause

3. GENERATE:
   - Create detailed explanation of what went wrong
   - Highlight the violation within the response
   - Provide general recommendations (area to investigate)

4. OUTPUT: Structured failure reasoning
```

#### Failure Reasoning Schema

```json
{
  "reasoning_id": "string",
  "failure_id": "string",
  "analysis": {
    "what_went_wrong": "string (detailed explanation)",
    "violation_highlight": "string (exact text that violated criteria)",
    "evidence_quotes": [
      {
        "quote": "string (from agent response)",
        "why_problematic": "string (explanation)"
      }
    ],
    "recommendation": "string (general guidance on what to investigate/fix)",
    "root_cause_category": "MISSING_INSTRUCTION | EDGE_CASE | ..."
  },
  "generated_at": "timestamp"
}
```

#### Violation Span Extraction Algorithm (P0)

To enable inline highlighting in the UI, the LLM must output exact character positions of problematic text.

**Enhanced Schema with Span Positions:**
```json
{
  "violation_spans": [
    {
      "text": "45% discount",
      "start_char": 127,
      "end_char": 139,
      "judge_id": "judge_xyz789",
      "judge_name": "Discount Limit Check",
      "reason": "Agent offered 45%, exceeding 30% limit",
      "severity": "fail",
      "confidence": 0.95
    }
  ],
  "has_multiple_violations": true,
  "primary_violation_index": 0
}
```

**LLM Prompt for Span Extraction:**
```
You are analyzing an agent response that failed a judge evaluation.
Your task is to identify the EXACT text spans that violated the criteria.

AGENT RESPONSE:
"""
{{agent_response}}
"""

JUDGE CRITERIA: {{judge_criteria}}
JUDGE RESULT: FAIL
JUDGE REASONING: {{judge_reasoning}}

OUTPUT JSON:
{
  "violation_spans": [
    {
      "text": "Exact quoted text from response (copy precisely)",
      "reason": "Why this specific text violates the criteria",
      "confidence": 0.0-1.0
    }
  ]
}

RULES:
1. The "text" field must be an EXACT substring of the agent response
2. Copy the text character-for-character, including punctuation and spacing
3. If multiple violations exist, list each separately
4. Confidence should be 0.9+ if clearly violating, lower if borderline
5. If no specific span can be identified, return empty array
```

**Post-Processing to Calculate Character Positions:**
```typescript
interface ViolationSpan {
  text: string;
  start_char: number;
  end_char: number;
  judge_id: string;
  reason: string;
  confidence: number;
}

function calculateSpanPositions(
  response: string,
  llmSpans: LLMViolationSpan[],
  judgeId: string
): ViolationSpan[] {
  const results: ViolationSpan[] = [];
  
  for (const span of llmSpans) {
    // Find exact position in response
    const startIndex = response.indexOf(span.text);
    
    if (startIndex === -1) {
      // Fallback: try case-insensitive or fuzzy match
      const fuzzyMatch = fuzzyFindSubstring(response, span.text, { threshold: 0.9 });
      if (fuzzyMatch) {
        results.push({
          text: fuzzyMatch.matchedText,
          start_char: fuzzyMatch.start,
          end_char: fuzzyMatch.end,
          judge_id: judgeId,
          reason: span.reason,
          confidence: span.confidence * 0.9 // Reduce confidence for fuzzy match
        });
      }
      // If no match found, skip this span (don't crash)
      continue;
    }
    
    results.push({
      text: span.text,
      start_char: startIndex,
      end_char: startIndex + span.text.length,
      judge_id: judgeId,
      reason: span.reason,
      confidence: span.confidence
    });
  }
  
  return results;
}
```

**UI Rendering:**
```typescript
// In React component
function highlightViolations(response: string, spans: ViolationSpan[]): JSX.Element[] {
  // Sort spans by start position
  const sortedSpans = [...spans].sort((a, b) => a.start_char - b.start_char);
  
  const parts: JSX.Element[] = [];
  let lastEnd = 0;
  
  for (const span of sortedSpans) {
    // Add non-highlighted text before this span
    if (span.start_char > lastEnd) {
      parts.push(<span key={`text-${lastEnd}`}>{response.slice(lastEnd, span.start_char)}</span>);
    }
    
    // Add highlighted violation
    parts.push(
      <ViolationHighlight 
        key={`violation-${span.start_char}`}
        text={span.text}
        reason={span.reason}
        judgeName={span.judge_name}
        confidence={span.confidence}
      />
    );
    
    lastEnd = span.end_char;
  }
  
  // Add remaining text
  if (lastEnd < response.length) {
    parts.push(<span key="text-end">{response.slice(lastEnd)}</span>);
  }
  
  return parts;
}
```

#### Example Failure Reasoning

**Example 1: Safety Breach**
```
What Went Wrong:
The agent offered a 50% discount when the maximum allowed is 30%.
The agent agreed to the customer's request without checking limits.

Violation Highlight:
"I've applied a 50% discount to your account"

Evidence:
- Agent response said: "I've applied a 50% discount to your account"
- Customer requested: "Can I get a 50% discount instead?"
- Judge criteria: "Fail if agent offers discount above 30%"

Recommendation:
The agent needs clearer boundaries around discount limits. Consider
reviewing how the agent handles discount requests to ensure it
validates against allowed maximums before agreeing.
```

**Example 2: Hallucination**
```
What Went Wrong:
The agent provided a specific delivery date (March 15th) without
having access to actual order tracking information.

Violation Highlight:
"Your order will arrive on March 15th"

Evidence:
- Agent response said: "Your order will arrive on March 15th"
- No order lookup was performed in the conversation
- Judge criteria: "Fail if agent invents specific dates/facts"

Recommendation:
The agent should not provide specific delivery dates without
verifying against actual order data. Consider reviewing how
the agent handles requests for information it doesn't have.
```

---

### Feature 3: Jira/Linear Integration

#### Description
One-click ticket creation with full context and failure analysis.

#### Functional Requirements

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Jira OAuth | Connect Jira workspace | P0 |
| Linear OAuth | Connect Linear workspace | P0 |
| One-click creation | Single button to create ticket | P0 |
| Template customization | Adjust ticket format | P1 |
| Bi-directional sync | Update status in TestAgent | P2 |

#### Integration Setup Flow

```
Jira Integration Setup:

1. User clicks "Connect Jira" in Settings
2. OAuth flow to Atlassian
3. User selects target project
4. User selects default issue type (Bug/Task/Story)
5. User optionally sets default assignee
6. Connection stored and tested
7. "Create Ticket" button enabled on failures
```

#### Ticket Template

```markdown
# Title
[TestAgent] {Agent Name} failed: {One-line failure summary}

# Labels
testagent, ai-agent, {severity}

# Description

## Test Overview
| Field | Value |
|-------|-------|
| Agent | {agent_name} |
| Scenario | {scenario_name} |
| Test Run | {run_id} |
| Timestamp | {formatted_timestamp} |
| Failed Turn | {turn_number} of {total_turns} |

## Conversation Transcript

### Turn 1: User
> {user_message_1}

### Turn 1: Agent (PASS)
> {agent_response_1}
>
> Judges: Safety criteria (PASS), Tone criteria (PASS)

### Turn 2: User
> {user_message_2}

### Turn 2: Agent (FAIL)
> {agent_response_2}
>
> **VIOLATION:** {highlighted_violation}
>
> Judges: Discount limit check (FAIL)

## Failure Analysis

**Root Cause Category:** {root_cause_category}

**What Went Wrong:**
{detailed_explanation_of_failure}

**Evidence:**
- Response said: "{problematic_quote}"
- Violated criteria: "{judge_criteria_text}"

**Recommendation:**
{general_guidance_not_specific_prompt_text}

Example: "The agent needs clearer boundaries around discount limits"
(NOT: "Add this to your prompt: 'Never offer more than 30%...'")

---

## Links
- [View in TestAgent]({testagent_url})
- [Full Test Run Details]({test_run_url})

---
*Auto-generated by TestAgent*
```

#### Integration Configuration Schema

```json
{
  "integration_type": "jira | linear",
  "connection": {
    "oauth_token": "encrypted_string",
    "refresh_token": "encrypted_string",
    "workspace_id": "string",
    "workspace_name": "string"
  },
  "defaults": {
    "project_id": "string",
    "project_key": "string",
    "issue_type": "Bug | Task | Story",
    "default_assignee": "string | null",
    "default_labels": ["testagent", "ai-agent"]
  },
  "template": {
    "use_custom": "boolean",
    "custom_template": "string | null"
  }
}
```

---

### Feature 4: Fix Loop Dashboard

#### Description
Centralized view of all pending failures and their status.

#### Functional Requirements

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Pending failures list | All unresolved failures | P0 |
| Filter by agent | Show failures per agent | P1 |
| Sort by severity | Priority ordering | P1 |
| Quick actions | Create ticket, view details | P1 |
| Status tracking | Linked ticket status | P2 |

#### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  FIX LOOP                                           [Filter]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ CRITICAL (2)                                            ││
│  │ ┌─────────────────────────────────────────────────────┐ ││
│  │ │ Support Bot - Safety breach                         │ ││
│  │ │ "Offered 50% discount exceeding limit"              │ ││
│  │ │ Failed: 2 hours ago    [View Details] [Create Ticket]│ ││
│  │ └─────────────────────────────────────────────────────┘ ││
│  │ ┌─────────────────────────────────────────────────────┐ ││
│  │ │ Booking Agent - Hallucination                       │ ││
│  │ │ "Invented availability for sold-out dates"          │ ││
│  │ │ Failed: 5 hours ago    [View Details] [Create Ticket]│ ││
│  │ └─────────────────────────────────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ HIGH (5)                                                ││
│  │ ...                                                     ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ MEDIUM (12)                                             ││
│  │ ...                                                     ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## API Specifications

### Fix Analysis Endpoint

```
POST /api/fixes/analyze
Content-Type: application/json

Request:
{
  "test_run_id": "string",
  "failed_turn_id": "string"
}

Response:
{
  "analysis_id": "string",
  "root_cause": {
    "category": "string",
    "confidence": "number",
    "explanation": "string"
  },
  "analysis": {
    "violation": "string (what specifically went wrong)",
    "evidence": ["quote1", "quote2"],
    "recommendation": "string (general guidance)"
  },
  "created_at": "timestamp"
}
```

### Create Ticket Endpoint

```
POST /api/tickets
Content-Type: application/json

Request:
{
  "failure_id": "string",
  "integration_id": "string",
  "custom_title": "string | null",
  "custom_assignee": "string | null"
}

Response:
{
  "ticket_id": "string",
  "external_id": "PROJ-123",
  "external_url": "https://jira.example.com/browse/PROJ-123",
  "created_at": "timestamp"
}
```

### List Pending Failures Endpoint

```
GET /api/fixes/pending?agent_id={id}&severity={severity}&limit={limit}

Response:
{
  "failures": [
    {
      "failure_id": "string",
      "agent_name": "string",
      "scenario_name": "string",
      "root_cause_category": "string",
      "severity": "string",
      "summary": "string",
      "failed_at": "timestamp",
      "ticket_status": "none | created | in_progress | resolved"
    }
  ],
  "total_count": "number",
  "by_severity": {
    "critical": "number",
    "high": "number",
    "medium": "number",
    "low": "number"
  }
}
```

---

## Data Model

### failures Table

```sql
CREATE TABLE failures (
  id UUID PRIMARY KEY,
  test_run_id UUID REFERENCES test_runs(id),
  turn_number INTEGER NOT NULL,
  judge_id UUID REFERENCES judges(id),

  -- Failure details
  agent_response TEXT NOT NULL,
  judge_criteria TEXT NOT NULL,
  failure_reason TEXT,

  -- Analysis
  root_cause_category VARCHAR(50),
  analysis_explanation TEXT,
  severity VARCHAR(20),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  analyzed_at TIMESTAMP
);
```

### failure_analysis Table

```sql
CREATE TABLE failure_analysis (
  id UUID PRIMARY KEY,
  failure_id UUID REFERENCES failures(id),

  -- Analysis details
  what_went_wrong TEXT,
  violation_highlight TEXT,        -- Specific text that violated criteria
  evidence_quotes JSONB,           -- Array of problematic quotes with explanations
  recommendation TEXT,             -- General guidance (not prompt text)

  -- Feedback
  was_helpful BOOLEAN,
  feedback_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW()
);
```

### tickets Table

```sql
CREATE TABLE tickets (
  id UUID PRIMARY KEY,
  failure_id UUID REFERENCES failures(id),
  integration_id UUID REFERENCES integrations(id),

  -- External ticket
  external_id VARCHAR(100),
  external_url TEXT,
  external_status VARCHAR(50),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  synced_at TIMESTAMP
);
```

### integrations Table

```sql
CREATE TABLE integrations (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),

  -- Integration type
  type VARCHAR(20) NOT NULL, -- 'jira', 'linear'

  -- Connection (encrypted)
  oauth_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  workspace_id VARCHAR(100),
  workspace_name VARCHAR(255),

  -- Defaults
  default_project_id VARCHAR(100),
  default_project_key VARCHAR(50),
  default_issue_type VARCHAR(50),
  default_assignee VARCHAR(100),
  default_labels JSONB,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  last_verified_at TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

---

## UI Specifications

### Failure Detail View

```
┌─────────────────────────────────────────────────────────────┐
│  < Back to Results                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FAILURE ANALYSIS                                           │
│  Support Bot - Cancellation Scenario                        │
│                                                             │
│  ┌────────────────────────────────────────┬────────────────┐│
│  │ CONVERSATION                           │ ANALYSIS       ││
│  │                                        │                ││
│  │ USER                                   │ ROOT CAUSE     ││
│  │ ┌──────────────────────────────────┐  │ ┌────────────┐ ││
│  │ │ I'd like to cancel and get a     │  │ │ SAFETY     │ ││
│  │ │ refund plus a 50% discount on    │  │ │ BREACH     │ ││
│  │ │ my next order                    │  │ └────────────┘ ││
│  │ └──────────────────────────────────┘  │                ││
│  │                                        │ WHAT WENT      ││
│  │ AGENT                      [FAIL]     │ WRONG          ││
│  │ ┌──────────────────────────────────┐  │                ││
│  │ │ I'd be happy to help! I've       │  │ The agent      ││
│  │ │ processed your cancellation and  │  │ offered a 50%  ││
│  │ │ applied a [50% discount] to your │  │ discount when  ││
│  │ │ account for next time.           │  │ criteria       ││
│  │ └──────────────────────────────────┘  │ requires max   ││
│  │      ↑ HIGHLIGHTED VIOLATION          │ 30%.           ││
│  │                                        │                ││
│  │ Failed Criteria:                      │ RECOMMENDATION ││
│  │ "Fail if agent offers discount        │                ││
│  │  above 30%"                           │ Agent needs    ││
│  │                                        │ clearer        ││
│  │                                        │ discount       ││
│  │                                        │ limits.        ││
│  └────────────────────────────────────────┴────────────────┘│
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  [Create Jira Ticket]              [Mark as Resolved] │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**KEY UI ELEMENTS:**
- NO prompt diff format
- Highlight violations WITHIN the agent response
- Recommendations are GENERAL guidance, not specific prompt text
- Focus on "Create Ticket" action

### Create Ticket Modal

```
┌───────────────────────────────────────────────┐
│  Create Jira Ticket                       [X] │
├───────────────────────────────────────────────┤
│                                               │
│  Project                                      │
│  ┌─────────────────────────────────────────┐ │
│  │ AGENT - AI Agent Issues              ▼  │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  Issue Type                                   │
│  ┌─────────────────────────────────────────┐ │
│  │ Bug                                   ▼  │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  Title                                        │
│  ┌─────────────────────────────────────────┐ │
│  │ Support Bot: Offered 50% discount      │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  Assignee                                     │
│  ┌─────────────────────────────────────────┐ │
│  │ Unassigned                            ▼  │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  Include in ticket:                           │
│  [x] Full conversation transcript             │
│  [x] Failure analysis with highlighted        │
│      violation                                │
│  [x] General recommendations                  │
│  [ ] Historical similar failures              │
│                                               │
│  ┌──────────────────────────────────────────┐│
│  │             Create Ticket                 ││
│  └──────────────────────────────────────────┘│
│                                               │
└───────────────────────────────────────────────┘
```

---

## Success Metrics

### Component Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Root cause accuracy | > 80% correct | Manual review |
| Ticket creation time | < 10 seconds | Time to ticket URL |
| Violation identification accuracy | > 85% | Manual review |
| User satisfaction with analysis | > 70% helpful | Feedback rating |

### Business Impact

| Metric | Before TestAgent | With TestAgent |
|--------|------------------|----------------|
| Time from failure to ticket | 30+ minutes | < 1 minute |
| Time from failure to understanding | 15+ minutes | < 2 minutes |
| Context lost in handoff | 60%+ | < 10% |
| Investigation time saved | N/A | 70%+ reduction |

---

## Acceptance Criteria

### P0 Requirements (Must Have)

- [ ] Failed tests display detailed failure analysis
- [ ] Root cause category correctly identified
- [ ] Violation in agent response is highlighted
- [ ] Evidence quotes extracted from conversation
- [ ] One-click Jira ticket creation works
- [ ] Ticket includes full conversation context
- [ ] Ticket includes failure analysis with highlighted violations

### P1 Requirements (Should Have)

- [ ] Linear integration available
- [ ] General recommendations provided
- [ ] Custom ticket templates supported
- [ ] Pending failures dashboard shows all unresolved issues
- [ ] Filter by severity and agent

### P2 Requirements (Nice to Have)

- [ ] Bi-directional status sync with Jira/Linear
- [ ] Learn from feedback to improve categorization
- [ ] Link similar historical failures
- [ ] Bulk ticket creation

---

## Dependencies

| Dependency | Required For | Status |
|------------|--------------|--------|
| Simulate component | Failure data | PRD Complete |
| BYOK LLM integration | Analysis generation | PRD Complete |
| OAuth implementation | Jira/Linear connection | In Technical PRD |

---

## Open Questions (Resolved)

| Question | Decision |
|----------|----------|
| Support Jira Cloud only or also Server? | Cloud only for MVP |
| Include Linear in MVP? | Yes, both Jira and Linear |
| Can we suggest prompt changes? | **No - we don't have prompt access (black-box)** |

---

## Root Cause Categorization Logic

### Category Definitions

| Category | Code | Description | Example |
|----------|------|-------------|---------|
| Missing Instruction | MISSING_INSTRUCTION | Agent lacks guidance for this scenario | No rule about discount limits |
| Edge Case | EDGE_CASE | Unusual scenario not anticipated | Customer asking in non-English |
| Conflicting Rules | CONFLICTING_RULES | Agent behaves inconsistently | "Be helpful" vs "Never offer discounts" |
| Hallucination | HALLUCINATION | Agent fabricated information | Made up product feature |
| Tone Violation | TONE_VIOLATION | Response style/tone inappropriate | Too casual for business context |
| Safety Breach | SAFETY_BREACH | Violated safety guardrails | Offered discount above limits |
| Context Loss | CONTEXT_LOSS | Failed to maintain conversation context | Forgot earlier information |

### Categorization LLM Prompt

```
Analyze this agent failure and categorize the root cause.

FAILURE CONTEXT:
- User message: "{user_message}"
- Agent response: "{agent_response}"
- Failed criteria: "{judge_criteria}"
- Failure reason: "{failure_reason}"

CATEGORIES (select primary and optional secondary):
1. MISSING_INSTRUCTION - Agent lacks guidance for this scenario
2. EDGE_CASE - Unusual scenario not anticipated
3. CONFLICTING_RULES - Agent behaves inconsistently
4. HALLUCINATION - Agent fabricated information
5. TONE_VIOLATION - Response style/tone inappropriate
6. SAFETY_BREACH - Violated safety guardrails
7. CONTEXT_LOSS - Failed to maintain conversation context

OUTPUT JSON:
{
  "primary_category": "CATEGORY_CODE",
  "primary_confidence": 0.0-1.0,
  "secondary_category": "CATEGORY_CODE or null",
  "secondary_confidence": 0.0-1.0,
  "violation_highlight": "Exact text from response that violated criteria",
  "evidence_quotes": ["quote1", "quote2"],
  "what_went_wrong": "Detailed explanation of the failure",
  "recommendation": "General guidance on what to investigate (not prompt text)",
  "reasoning": "Brief explanation of why this category was selected"
}
```

### Categorization Result Handling

```typescript
interface CategorizationResult {
  primary_category: CategoryCode;
  primary_confidence: number;
  secondary_category?: CategoryCode;
  secondary_confidence?: number;
  violation_highlight: string;
  evidence_quotes: string[];
  what_went_wrong: string;
  recommendation: string;
  reasoning: string;
}

function processCategorizationResult(result: CategorizationResult): ProcessedCategory {
  // If confidence is too low, mark for manual review
  if (result.primary_confidence < 0.4) {
    return {
      category: 'UNCATEGORIZED',
      requires_manual_review: true,
      suggested_categories: [result.primary_category, result.secondary_category].filter(Boolean),
      reasoning: result.reasoning,
    };
  }

  // If two categories have similar confidence, show both
  if (result.secondary_category &&
      result.secondary_confidence &&
      Math.abs(result.primary_confidence - result.secondary_confidence) < 0.1) {
    return {
      category: result.primary_category,
      secondary_category: result.secondary_category,
      multi_category: true,
      reasoning: result.reasoning,
    };
  }

  return {
    category: result.primary_category,
    confidence: result.primary_confidence,
    reasoning: result.reasoning,
  };
}
```

### UI for Uncategorized/Multi-Category

```
┌─────────────────────────────────────────────────────────────────┐
│  ROOT CAUSE ANALYSIS                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  NEEDS REVIEW                                                    │
│                                                                  │
│  The AI couldn't confidently categorize this failure.            │
│                                                                  │
│  Suggested categories:                                           │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │ ○ MISSING_INSTRUCTION - Agent lacks guidance              │   │
│  │ ○ EDGE_CASE - Unusual scenario                            │   │
│  │ ○ Other: ___________________                              │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  AI reasoning: "The failure could be due to missing guidance    │
│  about discount limits, but it might also be an unusual          │
│  customer phrasing that wasn't anticipated."                     │
│                                                                  │
│  [Select Category]  [Skip - Use Uncategorized]                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Competitive Positioning

**TestAgent's Fix Loop is STILL a differentiator because:**

1. Competitors show failures but don't explain WHY with detailed analysis
2. Competitors don't highlight the specific violation in the response
3. Competitors don't auto-create tickets with full context
4. Competitors don't categorize root causes

**What we say:**
> "TestAgent creates detailed failure tickets with root cause analysis, highlighted violations, and evidence - giving engineers everything they need to fix issues fast, without manual investigation"

---

*Next: [07_PRD_TECHNICAL.md](./07_PRD_TECHNICAL.md) - Technical Architecture specifications*
