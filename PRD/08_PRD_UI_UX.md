# PRD: UI/UX Design System

## Overview

| Attribute | Value |
|-----------|-------|
| **Document** | UI/UX Design System & Screen Specifications |
| **Version** | 1.0 |
| **Target Users** | Product Managers (Primary), Engineers (Secondary) |
| **Design Philosophy** | PM-First, Accessible, Actionable |

---

## Design Philosophy

### Core Principles

1. **PM-First, Not PM-Only**
   > Design for non-technical users without alienating engineers
   - Avoid technical jargon in primary UI
   - Provide advanced options for power users
   - Clear visual hierarchy favoring actions over data

2. **Actionable Over Informational**
   > Every screen should enable a clear next action
   - Don't just show data; guide to action
   - "Fix" buttons, not just "View Details"
   - Progress indicators for multi-step flows

3. **Conversation-Centric**
   > Tests are conversations, not data tables
   - Chat-style transcript views
   - Inline annotations on conversation turns
   - Human-readable, not JSON trees

4. **Immediate Value**
   > Show value quickly, explain later
   - Key metrics visible at a glance
   - Summaries before details
   - Progressive disclosure of complexity

---

## Visual Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a0a0f` | Main background |
| `--bg-secondary` | `#111118` | Cards, panels |
| `--bg-tertiary` | `#1a1a24` | Hover states, selected |
| `--border` | `rgba(255,255,255,0.06)` | Card borders |
| `--border-hover` | `rgba(255,255,255,0.12)` | Hover borders |
| `--text-primary` | `#ffffff` | Primary text |
| `--text-secondary` | `#a1a1aa` | Secondary text |
| `--text-muted` | `#71717a` | Muted text |
| `--accent-primary` | `#8b5cf6` | Primary purple |
| `--accent-gradient` | `#8b5cf6 → #6366f1` | Gradient accent |
| `--success` | `#22c55e` | Pass states |
| `--error` | `#ef4444` | Fail states |
| `--warning` | `#f59e0b` | Warning states |
| `--info` | `#3b82f6` | Info states |

### Typography

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| H1 | Inter | 36px | 700 | 1.2 |
| H2 | Inter | 28px | 600 | 1.3 |
| H3 | Inter | 20px | 600 | 1.4 |
| Body | Inter | 14px | 400 | 1.6 |
| Body Small | Inter | 12px | 400 | 1.5 |
| Code | JetBrains Mono | 13px | 400 | 1.5 |
| Label | Inter | 12px | 500 | 1.4 |

### Spacing Scale

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Badges, tags |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards |
| `--radius-xl` | 16px | Modals |
| `--radius-full` | 9999px | Pills, avatars |

---

## Component Library

### Buttons

```
Primary Button (Gradient)
┌─────────────────────────────────┐
│      Create Agent               │  bg: gradient(accent)
└─────────────────────────────────┘  text: white
                                     hover: lighten

Secondary Button
┌─────────────────────────────────┐
│      View Details               │  bg: transparent
└─────────────────────────────────┘  border: border
                                     text: text-primary
                                     hover: bg-tertiary

Ghost Button
┌─────────────────────────────────┐
│      Cancel                     │  bg: transparent
└─────────────────────────────────┘  text: text-secondary
                                     hover: text-primary

Destructive Button
┌─────────────────────────────────┐
│      Delete                     │  bg: error (light)
└─────────────────────────────────┘  text: error
                                     hover: error (darker)
```

### Cards

```
Standard Card
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Card Title                           Action Link → │
│                                                     │
│  Card content goes here. This is the main          │
│  content area of the card.                          │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Nested content or actions                    │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘

bg: bg-secondary
border: border
radius: radius-lg
padding: space-6
```

### Status Badges

```
PASS Badge          FAIL Badge          WARN Badge
┌────────┐         ┌────────┐         ┌────────┐
│ ✓ Pass │         │ ✗ Fail │         │ ⚠ Warn │
└────────┘         └────────┘         └────────┘
bg: success/10     bg: error/10       bg: warning/10
text: success      text: error        text: warning
```

### Form Elements

```
Text Input
┌─────────────────────────────────────────────────────┐
│ Label                                               │
│ ┌─────────────────────────────────────────────────┐│
│ │ Placeholder text...                             ││
│ └─────────────────────────────────────────────────┘│
│ Helper text or error message                        │
└─────────────────────────────────────────────────────┘

Select
┌─────────────────────────────────────────────────────┐
│ Label                                               │
│ ┌─────────────────────────────────────────────────┐│
│ │ Selected option                               ▼ ││
│ └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘

Textarea
┌─────────────────────────────────────────────────────┐
│ Label                                               │
│ ┌─────────────────────────────────────────────────┐│
│ │                                                 ││
│ │ Multi-line text input...                        ││
│ │                                                 ││
│ └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

---

## Screen Specifications

### Screen 1: Landing Page

**Purpose:** Convert visitors to signups by communicating value proposition

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ NAVBAR                                                                   │
│ [Logo]              Features | Pricing | Docs       [Login] [Get Started]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                          HERO SECTION                                    │
│                                                                          │
│           80% of AI projects fail. The #1 cause isn't technical.        │
│                                                                          │
│    It's the gap between the people who understand your customers         │
│    and the people who build your AI. TestAgent closes that gap.          │
│                                                                          │
│           [Start Free]              [See Demo →]                         │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                        VALUE PROPOSITION                                 │
│                                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐               │
│  │   CONNECT    │    │    DEFINE    │    │   SIMULATE   │               │
│  │ Black-box    │    │ Natural lang │    │ Multi-turn   │               │
│  │ integration  │    │ judges       │    │ testing      │               │
│  └──────────────┘    └──────────────┘    └──────────────┘               │
│                                                                          │
│                        ┌──────────────┐                                  │
│                        │     FIX      │                                  │
│                        │ AI-suggested │                                  │
│                        │ fixes        │                                  │
│                        └──────────────┘                                  │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                      FIX LOOP EXPLANATION                                │
│                                                                          │
│         "Current tools show you failed. TestAgent shows you how         │
│          to fix it."                                                     │
│                                                                          │
│    ┌─────────────────────────────────────────────────────────────────┐  │
│    │                    [Visual Fix Loop Demo]                        │  │
│    │                                                                  │  │
│    │    Test Fails → Analysis → AI Suggestion → Jira Ticket          │  │
│    │                                                                  │  │
│    └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                      COMPARISON TABLE                                    │
│                                                                          │
│    ┌─────────────────────────────────────────────────────────────────┐  │
│    │ Feature          │TestAgent│LangSmith│Langfuse│Braintrust│       │  │
│    │──────────────────│─────────│─────────│────────│──────────│       │  │
│    │ PM Accessible    │   ✓     │   ~     │   ✗    │    ~     │       │  │
│    │ No-Code Setup    │   ✓     │   ~     │   ✗    │    ~     │       │  │
│    │ Chat-style UI    │   ✓     │   ✗     │   ✗    │    ✗     │       │  │
│    │ AI Fix Suggest   │   ✓     │   ✗     │   ✗    │    ✗     │       │  │
│    │ Framework-agnostic│   ✓    │   ~     │   ✓    │    ✓     │       │  │
│    └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                            CTA SECTION                                   │
│                                                                          │
│              Ready to close the gap between product and engineering?     │
│                                                                          │
│                      [Start Free - No Credit Card]                       │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                                   │
│ [Logo]   Product | Company | Resources | Legal     [Social Links]       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Screen 2: Dashboard Home

**Purpose:** Provide overview of all agents and recent activity

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR                │                    MAIN CONTENT                 │
│                        │                                                 │
│ [Logo]                 │  Dashboard                                      │
│                        │                                                 │
│ ───────────────────    │  Welcome back, Priya!                          │
│ ● Dashboard            │                                                 │
│ ○ Agents               │  ┌─────────────────────────────────────────────│
│ ○ Judges               │  │ QUICK STATS                                 │
│ ○ Scenarios            │  │                                             │
│ ○ Fix Loop             │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────│
│                        │  │  │ Agents  │ │ Tests   │ │ Pass    │ │Fixes│
│ ───────────────────    │  │  │   3     │ │  47     │ │  72%    │ │  8  │
│ ○ Settings             │  │  └─────────┘ └─────────┘ └─────────┘ └─────│
│ ○ Integrations         │  │                                             │
│                        │  └─────────────────────────────────────────────│
│                        │                                                 │
│                        │  ┌─────────────────────────────────────────────│
│                        │  │ YOUR AGENTS                    [+ Add Agent]│
│                        │  │                                             │
│                        │  │ ┌─────────────────────────────────────────┐ │
│                        │  │ │ Support Bot                             │ │
│                        │  │ │ Last run: 2 hours ago    Pass: 85%      │ │
│                        │  │ │ 3 pending fixes         [Run] [View]    │ │
│                        │  │ └─────────────────────────────────────────┘ │
│                        │  │                                             │
│                        │  │ ┌─────────────────────────────────────────┐ │
│                        │  │ │ Booking Agent                           │ │
│                        │  │ │ Last run: 1 day ago     Pass: 92%       │ │
│                        │  │ │ 1 pending fix          [Run] [View]     │ │
│                        │  │ └─────────────────────────────────────────┘ │
│                        │  │                                             │
│                        │  └─────────────────────────────────────────────│
│                        │                                                 │
│                        │  ┌─────────────────────────────────────────────│
│                        │  │ RECENT FAILURES                [View All →]│
│                        │  │                                             │
│                        │  │ ⚠ Support Bot: Offered discount above limit │
│                        │  │   2 hours ago                [Fix →]       │
│                        │  │                                             │
│                        │  │ ⚠ Booking Agent: Invented availability     │
│                        │  │   1 day ago                  [Fix →]       │
│                        │  │                                             │
│                        │  └─────────────────────────────────────────────│
│                        │                                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Screen 3: Agent Connection (Wizard)

**Purpose:** Guide users through connecting their agent in 3 simple steps

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                        Connect Your Agent                                │
│                                                                          │
│              Step 1 of 3: Enter Your Agent's Endpoint                   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                                                                   │   │
│  │  Agent Name                                                       │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │ Support Bot                                                │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  │                                                                   │   │
│  │  Endpoint URL                                                     │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │ https://api.example.com/agent                              │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  │  Your agent's HTTP endpoint that accepts POST requests            │   │
│  │                                                                   │   │
│  │  ┌──────────────────────────────────────────────────────────────┐│   │
│  │  │ ℹ️ Your agent should accept a JSON body with a "message"     ││   │
│  │  │    field and return a JSON response with a "response" field. ││   │
│  │  └──────────────────────────────────────────────────────────────┘│   │
│  │                                                                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│                                                  [Cancel]  [Next →]     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

Step 2: Authentication
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  Authentication Method                                            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ None                                                      ▼ │  │
│  └────────────────────────────────────────────────────────────┘  │
│  Options: None, API Key, Bearer Token                            │
│                                                                   │
│  [If API Key or Bearer Token selected:]                          │
│                                                                   │
│  API Key / Token                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ••••••••••••••••••••                                      │  │
│  └────────────────────────────────────────────────────────────┘  │
│  🔒 Encrypted and stored securely                                │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

Step 3: Test Connection
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│                     Testing Connection...                         │
│                          [Spinner]                                │
│                                                                   │
│  [On Success:]                                                    │
│                                                                   │
│                    ✓ Connection Successful!                       │
│                                                                   │
│     Response time: 234ms                                          │
│     Agent responded correctly                                     │
│                                                                   │
│              [Back]  [Create Agent]                              │
│                                                                   │
│  [On Failure:]                                                    │
│                                                                   │
│                    ✗ Connection Failed                            │
│                                                                   │
│     Error: Connection timeout after 30s                           │
│     Check that your endpoint is accessible.                       │
│                                                                   │
│              [Back]  [Retry]                                     │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

### Screen 4: Judge Builder

**Purpose:** Allow PMs to define evaluation criteria in natural language with optional AI enhancement

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR                │                    MAIN CONTENT                 │
│                        │                                                 │
│ [Navigation]           │  Judge Builder                   [+ New Judge] │
│                        │                                                 │
│                        │  ┌─────────────────────────────────────────────│
│                        │  │ TEMPLATES                                   │
│                        │  │                                             │
│                        │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│                        │  │  │Accuracy │ │  Tone   │ │ Safety  │      │
│                        │  │  └─────────┘ └─────────┘ └─────────┘      │
│                        │  │                                             │
│                        │  └─────────────────────────────────────────────│
│                        │                                                 │
│                        │  ┌─────────────────────────────────────────────│
│                        │  │ CREATE NEW JUDGE                            │
│                        │  │                                             │
│                        │  │ Name                                        │
│                        │  │ ┌─────────────────────────────────────────┐│
│                        │  │ │ Discount Limit Check                    ││
│                        │  │ └─────────────────────────────────────────┘│
│                        │  │                                             │
│                        │  │ Criteria (in plain English)      [⛶ Expand]│
│                        │  │ ┌─────────────────────────────────────────┐│
│                        │  │ │                                         ││
│                        │  │ │ Fail if the agent offers a discount     ││
│                        │  │ │ greater than 30%                        ││
│                        │  │ │                                         ││
│                        │  │ └─────────────────────────────────────────┘│
│                        │  │ 💡 Tip: Be specific. "Fail if..." works    │
│                        │  │    better than vague criteria.             │
│                        │  │                                             │
│                        │  │ ┌─────────────────────────────────────────┐│
│                        │  │ │           [Enhance with AI ✨]           ││
│                        │  │ │  Optimize for more accurate evaluations ││
│                        │  │ └─────────────────────────────────────────┘│
│                        │  │                                             │
│                        │  │ Severity                                    │
│                        │  │ ○ Fail (blocks release)                    │
│                        │  │ ○ Warn (flag for review)                   │
│                        │  │                                             │
│                        │  │ Evaluation Type                             │
│                        │  │ ┌─────────────────────────────────────────┐│
│                        │  │ │ LLM-based (Recommended)               ▼ ││
│                        │  │ └─────────────────────────────────────────┘│
│                        │  │                                             │
│                        │  │              [Cancel]  [Save Judge]        │
│                        │  │                                             │
│                        │  └─────────────────────────────────────────────│
│                        │                                                 │
│                        │  ┌─────────────────────────────────────────────│
│                        │  │ YOUR JUDGES                                 │
│                        │  │                                             │
│                        │  │ ┌─────────────────────────────────────────┐│
│                        │  │ │ ⚡ Discount Limit Check    v3 ✨  [Edit]││
│                        │  │ │ "Fail if agent offers discount > 30%"  ││
│                        │  │ │ Severity: Fail       [History]         ││
│                        │  │ └─────────────────────────────────────────┘│
│                        │  │                                             │
│                        │  │ ┌─────────────────────────────────────────┐│
│                        │  │ │ 💬 Tone Professional    v1       [Edit]││
│                        │  │ │ "Fail if agent sounds robotic"         ││
│                        │  │ │ Severity: Warn         [History]       ││
│                        │  │ └─────────────────────────────────────────┘│
│                        │  │                                             │
│                        │  └─────────────────────────────────────────────│
│                        │                                                 │
└─────────────────────────────────────────────────────────────────────────┘

Note: ✨ indicates judge is using AI-enhanced prompt
```

### Screen 4a: AI Enhancement Preview Modal (US-004)

**Purpose:** Show side-by-side comparison of original vs AI-enhanced prompt for user approval

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Review AI-Enhanced Prompt                                        [✕]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────┐   │
│  │ YOUR VERSION                │  │ AI-ENHANCED VERSION             │   │
│  │                             │  │                                 │   │
│  │ Fail if the agent offers    │  │ Evaluate the agent response    │   │
│  │ a discount higher than 30%  │  │ for discount policy compliance:│   │
│  │                             │  │                                 │   │
│  │                             │  │ FAIL CONDITIONS:                │   │
│  │                             │  │ • Any discount > 30% offered    │   │
│  │                             │  │ • Implicit discount (e.g.,      │   │
│  │                             │  │   "I'll waive the fee")         │   │
│  │                             │  │ • Stacking discounts > 30%      │   │
│  │                             │  │                                 │   │
│  │                             │  │ PASS CONDITIONS:                │   │
│  │                             │  │ • Discount ≤ 30%                │   │
│  │                             │  │ • No discount mentioned         │   │
│  │                             │  │ • Correctly declined > 30%      │   │
│  └─────────────────────────────┘  └─────────────────────────────────┘   │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ IMPROVEMENTS MADE                                                  │  │
│  │ • Added edge case for implicit discounts                          │  │
│  │ • Clarified stacking discount scenario                            │  │
│  │ • Added explicit pass conditions for clarity                      │  │
│  │                                               Confidence: 85%     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ 💡 Not happy with the enhancement? You can always use your        │  │
│  │    original criteria - it will work just fine.                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  [Skip & Use Original]      [Edit]       [✓ Use Enhanced]         │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Button Actions:**
- **Skip & Use Original** - Close modal, save judge with original criteria
- **Edit** - Open enhanced text in editable mode (full-screen optional)
- **Use Enhanced** - Save judge with AI-enhanced prompt as new version

### Screen 4b: Full-Screen Text Editor (US-004)

**Purpose:** Provide distraction-free editing for complex judge criteria

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Edit Criteria                                               [✕ Close]      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                        │ │
│  │  Fail if the agent offers a discount above 30%.                       │ │
│  │                                                                        │ │
│  │  Additional conditions:                                                │ │
│  │  - Also fail if agent implies a discount through free items           │ │
│  │  - Fail if agent stacks multiple smaller discounts exceeding 30%      │ │
│  │  - Fail if agent promises to "check with manager" for higher discount │ │
│  │                                                                        │ │
│  │  Exceptions:                                                           │ │
│  │  - Loyalty program discounts are allowed up to 40%                    │ │
│  │  - First-time customer discounts up to 35% are acceptable             │ │
│  │                                                                        │ │
│  │                                                                        │ │
│  │                                                                        │ │
│  │                                                                        │ │
│  │                                                                        │ │
│  │                                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ Words: 87  │  Lines: 12  │  💡 Be specific about edge cases           │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │       [Cancel]             [Enhance with AI ✨]              [Save]    │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  Keyboard: Esc to close • Cmd+Enter to save • Cmd+Shift+E to enhance        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Full viewport height for editing
- Word and line count in footer
- Contextual writing tips
- Keyboard shortcuts displayed
- Can trigger AI enhancement from full-screen mode

### Screen 4c: Version History Modal (US-004)

**Purpose:** View and manage all versions of a judge's criteria

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Discount Limit Check - Version History                           [✕]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ v3 (Current)                                     Jan 15, 2025     │  │
│  │ ✨ Enhanced - Added stacking discount handling                    │  │
│  │ Approved by: Priya                                                │  │
│  │                                              [View] [Compare]     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ v2                                               Jan 12, 2025     │  │
│  │ ✨ Enhanced - Initial AI enhancement                              │  │
│  │ Approved by: Priya                                                │  │
│  │                                      [View] [Compare] [Revert]    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ v1 (Original)                                    Jan 10, 2025     │  │
│  │ "Fail if agent offers discount above 30%"                         │  │
│  │ Created by: Priya                                                 │  │
│  │                                      [View] [Compare] [Revert]    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Actions:**
- **View** - Show full content of that version
- **Compare** - Diff view between two versions
- **Revert** - Restore previous version (creates new version)

---

### Screen 5: Test Results (Chat-Style)

**Purpose:** Display test results in familiar conversation format with inline pass/fail

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  Test Results: Support Bot - Cancellation Scenario                      │
│  Run: Jan 13, 2025 at 2:34 PM                    Overall: FAIL (2/3)   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ CONVERSATION                                                      │   │
│  │                                                                   │   │
│  │ ┌──────────────────────────────────────────────────────────────┐ │   │
│  │ │ 👤 USER                                                      │ │   │
│  │ │                                                               │ │   │
│  │ │ Hi, I'd like to cancel my subscription please.               │ │   │
│  │ │                                                               │ │   │
│  │ └──────────────────────────────────────────────────────────────┘ │   │
│  │                                                                   │   │
│  │ ┌──────────────────────────────────────────────────────────────┐ │   │
│  │ │ 🤖 AGENT                                        [✓ PASS]     │ │   │
│  │ │                                                               │ │   │
│  │ │ I'm sorry to hear you want to cancel! Before you go, I'd    │ │   │
│  │ │ like to understand what's not working for you. Could you     │ │   │
│  │ │ share your feedback?                                         │ │   │
│  │ │                                                               │ │   │
│  │ │ ┌────────────────────────────────────────────────────────┐  │ │   │
│  │ │ │ ✓ Professional Tone                                    │  │ │   │
│  │ │ │ ✓ Retention Attempt                                    │  │ │   │
│  │ │ └────────────────────────────────────────────────────────┘  │ │   │
│  │ └──────────────────────────────────────────────────────────────┘ │   │
│  │                                                                   │   │
│  │ ┌──────────────────────────────────────────────────────────────┐ │   │
│  │ │ 👤 USER                                                      │ │   │
│  │ │                                                               │ │   │
│  │ │ Actually, can I get a 50% discount instead to stay?         │ │   │
│  │ │                                                               │ │   │
│  │ └──────────────────────────────────────────────────────────────┘ │   │
│  │                                                                   │   │
│  │ ┌──────────────────────────────────────────────────────────────┐ │   │
│  │ │ 🤖 AGENT                                        [✗ FAIL]     │ │   │
│  │ │                                                               │ │   │
│  │ │ Absolutely! I've applied a 50% discount to your account.    │ │   │
│  │ │ You'll see this reflected on your next billing cycle.        │ │   │
│  │ │                                                               │ │   │
│  │ │ ┌────────────────────────────────────────────────────────┐  │ │   │
│  │ │ │ ✓ Professional Tone                                    │  │ │   │
│  │ │ │ ✗ Discount Limit Check                                 │  │ │   │
│  │ │ │   "Offered 50% - exceeds 30% limit"                   │  │ │   │
│  │ │ └────────────────────────────────────────────────────────┘  │ │   │
│  │ │                                                               │ │   │
│  │ │                            [View Fix Suggestion →]           │ │   │
│  │ └──────────────────────────────────────────────────────────────┘ │   │
│  │                                                                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  [Re-run Test]    [Edit Scenario]    [Create Jira Ticket]        │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key UI Elements:**
- Chat bubbles for user/agent messages
- Inline pass/fail badges on each agent turn
- Collapsible judge evaluations
- Clear call-to-action for failures

---

### Screen 6: Fix Loop (Failure Detail + Analysis)

**Purpose:** Show failure analysis with highlighted violations and actionable ticket creation

**Note:** TestAgent is a black-box solution. We do NOT have access to agent prompts, so we cannot
suggest specific prompt changes. Instead, we provide detailed failure analysis with highlighted
violations and general recommendations.

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ← Back to Results                                                       │
│                                                                          │
│  Failure: Discount Limit Violation                     Severity: HIGH   │
│  Support Bot • Cancellation Scenario • Turn 2                           │
│                                                                          │
│  ┌────────────────────────────────────────┬─────────────────────────────┐
│  │ CONVERSATION                           │ ANALYSIS                    │
│  │                                        │                             │
│  │ ┌────────────────────────────────────┐│ ROOT CAUSE                  │
│  │ │ USER                               ││ ┌─────────────────────────┐ │
│  │ │ Can I get a 50% discount instead? ││ │ SAFETY BREACH           │ │
│  │ └────────────────────────────────────┘│ └─────────────────────────┘ │
│  │                                        │                             │
│  │ ┌────────────────────────────────────┐│ WHAT WENT WRONG             │
│  │ │ AGENT                  [FAIL]      ││                             │
│  │ │                                    ││ The agent offered a 50%    │
│  │ │ Absolutely! I've applied a         ││ discount when criteria     │
│  │ │ [50% discount] to your account.    ││ requires max 30%.          │
│  │ │      ↑ HIGHLIGHTED VIOLATION       ││                             │
│  │ └────────────────────────────────────┘│ ─────────────────────────  │
│  │                                        │                             │
│  │ ─────────────────────────────────────  │ EVIDENCE                    │
│  │                                        │                             │
│  │ FAILED CRITERIA                        │ Response said:              │
│  │                                        │ "I've applied a 50%         │
│  │ ┌────────────────────────────────────┐│  discount to your account" │
│  │ │ Discount Limit Check               ││                             │
│  │ │                                    ││ ─────────────────────────  │
│  │ │ "Fail if agent offers discount    ││                             │
│  │ │  above 30%"                        ││ RECOMMENDATION              │
│  │ │                                    ││                             │
│  │ │ Result: FAIL                       ││ The agent needs clearer    │
│  │ │ Agent offered: 50%                 ││ boundaries around discount │
│  │ │ Limit: 30%                         ││ limits.                    │
│  │ └────────────────────────────────────┘│                             │
│  │                                        │                             │
│  └────────────────────────────────────────┴─────────────────────────────┘
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                                                                   │   │
│  │   [Create Jira Ticket]              [Mark as Resolved]           │   │
│  │                                                                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key UI Elements (Corrected for Black-Box Constraints):**
- NO prompt diff format (we don't have access to agent prompts)
- Violations HIGHLIGHTED within the agent response text
- General RECOMMENDATIONS (not specific prompt text to copy)
- Focus on "Create Jira Ticket" as primary action
- Evidence quotes from the actual conversation

---

### Screen 6a: Organization Settings (US-011)

**Purpose:** Allow organization owners/admins to manage team members and organization settings

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR                │                    MAIN CONTENT                         │
│                        │                                                         │
│ [Navigation]           │  Organization Settings                                  │
│                        │                                                         │
│ ● Dashboard            │  ┌─────────────────────────────────────────────────────┐│
│ ○ Agents               │  │ ORGANIZATION DETAILS                                ││
│ ○ Judges               │  │                                                     ││
│ ○ Scenarios            │  │ Organization Name                                   ││
│ ○ Fix Loop             │  │ ┌─────────────────────────────────────────────────┐ ││
│                        │  │ │ Acme Corp                                       │ ││
│ ───────────────────    │  │ └─────────────────────────────────────────────────┘ ││
│ ○ Settings             │  │                                                     ││
│   ├ Organization  ●    │  │ Organization Slug                                   ││
│   ├ Members            │  │ ┌─────────────────────────────────────────────────┐ ││
│   ├ Billing            │  │ │ acme-corp                                       │ ││
│   └ Integrations       │  │ └─────────────────────────────────────────────────┘ ││
│                        │  │                                                     ││
│                        │  │              [Save Changes]                         ││
│                        │  └─────────────────────────────────────────────────────┘│
│                        │                                                         │
│                        │  ┌─────────────────────────────────────────────────────┐│
│                        │  │ DANGER ZONE                                         ││
│                        │  │                                                     ││
│                        │  │ Delete this organization and all associated data.  ││
│                        │  │ This action cannot be undone.                       ││
│                        │  │                                                     ││
│                        │  │                         [Delete Organization]       ││
│                        │  └─────────────────────────────────────────────────────┘│
│                        │                                                         │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### Screen 6b: Team Members (US-011)

**Purpose:** Manage organization members, invite new users, and control access

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR                │                    MAIN CONTENT                         │
│                        │                                                         │
│ [Navigation]           │  Team Members                         [+ Invite Member] │
│                        │                                                         │
│ ○ Settings             │  ┌─────────────────────────────────────────────────────┐│
│   ├ Organization       │  │ SEATS: 3 of 5 used                  [Upgrade Plan] ││
│   ├ Members       ●    │  └─────────────────────────────────────────────────────┘│
│   ├ Billing            │                                                         │
│   └ Integrations       │  ┌─────────────────────────────────────────────────────┐│
│                        │  │ TEAM MEMBERS (3)                                    ││
│                        │  │                                                     ││
│                        │  │ ┌─────────────────────────────────────────────────┐ ││
│                        │  │ │ 👤 Priya Sharma                                 │ ││
│                        │  │ │    priya@acme.com                               │ ││
│                        │  │ │    Role: Owner                    [Cannot edit] │ ││
│                        │  │ │    Joined: Jan 1, 2025                          │ ││
│                        │  │ └─────────────────────────────────────────────────┘ ││
│                        │  │                                                     ││
│                        │  │ ┌─────────────────────────────────────────────────┐ ││
│                        │  │ │ 👤 Marcus Chen                                  │ ││
│                        │  │ │    marcus@acme.com                              │ ││
│                        │  │ │    Role: [Admin ▼]             [Remove Member]  │ ││
│                        │  │ │    Joined: Jan 5, 2025                          │ ││
│                        │  │ └─────────────────────────────────────────────────┘ ││
│                        │  │                                                     ││
│                        │  │ ┌─────────────────────────────────────────────────┐ ││
│                        │  │ │ 👤 Sarah Johnson                                │ ││
│                        │  │ │    sarah@acme.com                               │ ││
│                        │  │ │    Role: [Member ▼]            [Remove Member]  │ ││
│                        │  │ │    Joined: Jan 10, 2025                         │ ││
│                        │  │ └─────────────────────────────────────────────────┘ ││
│                        │  └─────────────────────────────────────────────────────┘│
│                        │                                                         │
│                        │  ┌─────────────────────────────────────────────────────┐│
│                        │  │ PENDING INVITATIONS (1)                             ││
│                        │  │                                                     ││
│                        │  │ ┌─────────────────────────────────────────────────┐ ││
│                        │  │ │ ✉️ john@acme.com                                │ ││
│                        │  │ │    Role: Member                                 │ ││
│                        │  │ │    Invited: Jan 12, 2025      [Resend] [Cancel] │ ││
│                        │  │ │    Expires: Jan 19, 2025                        │ ││
│                        │  │ └─────────────────────────────────────────────────┘ ││
│                        │  └─────────────────────────────────────────────────────┘│
│                        │                                                         │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Role Permissions:**
| Permission | Owner | Admin | Member |
|------------|-------|-------|--------|
| Manage Organization | ✓ | ✗ | ✗ |
| Invite Members | ✓ | ✓ | ✗ |
| Remove Members | ✓ | ✓ | ✗ |
| Change Roles | ✓ | ✓* | ✗ |
| Manage Billing | ✓ | ✗ | ✗ |
| Create Agents | ✓ | ✓ | ✓ |
| Create Judges | ✓ | ✓ | ✓ |
| Run Tests | ✓ | ✓ | ✓ |
| View Results | ✓ | ✓ | ✓ |

*Admins can change roles to/from Member only, not Owner/Admin

---

### Screen 6b-2: Project Selector (Gap 1.1 Resolution)

**Purpose:** Allow users to switch between projects within an organization

**Layout (in Sidebar):**
```
┌─────────────────────────────────────────┐
│ SIDEBAR                                  │
│                                          │
│ [Logo]                                   │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ 📁 Customer Support Bot          ▼ │ │
│ │    Acme Corp                       │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ─────────────────────────────────────── │
│ ● Dashboard                              │
│ ○ Agents                                 │
│ ○ Judges                                 │
│ ○ Scenarios                              │
│ ○ Fix Loop                               │
│                                          │
│ ─────────────────────────────────────── │
│ ○ Settings                               │
│ ○ Integrations                           │
│                                          │
└─────────────────────────────────────────┘

Project Dropdown (expanded):
┌─────────────────────────────────────┐
│ YOUR PROJECTS                        │
│ ┌─────────────────────────────────┐ │
│ │ ✓ Customer Support Bot          │ │
│ │   3 agents • 12 scenarios       │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │   Sales Assistant               │ │
│ │   1 agent • 5 scenarios         │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │   Booking Agent                 │ │
│ │   2 agents • 8 scenarios        │ │
│ └─────────────────────────────────┘ │
│ ─────────────────────────────────── │
│ [+ Create New Project]               │
│ ─────────────────────────────────── │
│ 🏢 Switch Organization →             │
└─────────────────────────────────────┘
```

**Project Context:**
- All resources (agents, judges, scenarios) are scoped to selected project
- Dashboard metrics are project-specific
- URL includes project slug: `/projects/customer-support-bot/agents`

---

### Screen 6c: Invite Member Modal (US-011)

**Purpose:** Allow admins to invite new team members by email

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Invite Team Member                                                        [✕]  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Invite someone to join Acme Corp on TestAgent.                                 │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │ Email Address                                                              │ │
│  │ ┌────────────────────────────────────────────────────────────────────────┐│ │
│  │ │ colleague@company.com                                                  ││ │
│  │ └────────────────────────────────────────────────────────────────────────┘│ │
│  │                                                                            │ │
│  │ Role                                                                       │ │
│  │ ┌────────────────────────────────────────────────────────────────────────┐│ │
│  │ │ Member                                                              ▼ ││ │
│  │ └────────────────────────────────────────────────────────────────────────┘│ │
│  │                                                                            │ │
│  │ ┌────────────────────────────────────────────────────────────────────────┐│ │
│  │ │ 💺 Seat Impact: This will use 4 of 5 seats in your plan.              ││ │
│  │ │                                                                        ││ │
│  │ │ Need more seats? [Upgrade Plan]                                        ││ │
│  │ └────────────────────────────────────────────────────────────────────────┘│ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                           [Cancel]  [Send Invitation]                      │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Validation States:**
- **Seat limit reached:** Show warning, disable Send button, prompt to upgrade
- **Invalid email:** Show validation error
- **Already a member:** Show "Already a member" error
- **Pending invitation exists:** Show "Already invited" with option to resend

---

### Screen 6d: Billing & Subscription (US-011)

**Purpose:** Display billing overview, seat usage, and manage subscription

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR                │                    MAIN CONTENT                         │
│                        │                                                         │
│ [Navigation]           │  Billing & Subscription                                 │
│                        │                                                         │
│ ○ Settings             │  ┌─────────────────────────────────────────────────────┐│
│   ├ Organization       │  │ CURRENT PLAN                                        ││
│   ├ Members            │  │                                                     ││
│   ├ Billing       ●    │  │  ┌──────────────────────────────────────────────┐  ││
│   └ Integrations       │  │  │  PRO PLAN                                    │  ││
│                        │  │  │                                              │  ││
│                        │  │  │  $25/seat/month                              │  ││
│                        │  │  │  5 seats included                            │  ││
│                        │  │  │                                              │  ││
│                        │  │  │  ✓ Unlimited agents                         │  ││
│                        │  │  │  ✓ Unlimited tests                          │  ││
│                        │  │  │  ✓ AI fix suggestions                       │  ││
│                        │  │  │  ✓ Jira/Linear integration                  │  ││
│                        │  │  │                                              │  ││
│                        │  │  │           [Change Plan]                      │  ││
│                        │  │  └──────────────────────────────────────────────┘  ││
│                        │  └─────────────────────────────────────────────────────┘│
│                        │                                                         │
│                        │  ┌─────────────────────────────────────────────────────┐│
│                        │  │ SEAT USAGE                                          ││
│                        │  │                                                     ││
│                        │  │  ████████████████░░░░░░░░░░  3 of 5 seats used     ││
│                        │  │                                                     ││
│                        │  │  Next billing: Feb 1, 2025                          ││
│                        │  │  Amount: $75.00 (3 seats × $25)                     ││
│                        │  │                                                     ││
│                        │  │                              [Add Seats]            ││
│                        │  └─────────────────────────────────────────────────────┘│
│                        │                                                         │
│                        │  ┌─────────────────────────────────────────────────────┐│
│                        │  │ PAYMENT METHOD                                      ││
│                        │  │                                                     ││
│                        │  │  💳 •••• •••• •••• 4242              [Update]       ││
│                        │  │  Expires: 12/2027                                   ││
│                        │  └─────────────────────────────────────────────────────┘│
│                        │                                                         │
│                        │  ┌─────────────────────────────────────────────────────┐│
│                        │  │ BILLING HISTORY                           [View All]││
│                        │  │                                                     ││
│                        │  │  Jan 1, 2025    Invoice #INV-001    $75.00   [PDF]  ││
│                        │  │  Dec 1, 2024    Invoice #INV-000    $50.00   [PDF]  ││
│                        │  └─────────────────────────────────────────────────────┘│
│                        │                                                         │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Pricing Tiers (Reference):**
| Plan | Price | Seats | Features |
|------|-------|-------|----------|
| Free | $0 | 1 | 1 agent, 100 tests/mo |
| Starter | $15/seat/mo | 1-5 | 3 agents, 1000 tests/mo |
| Pro | $25/seat/mo | 1-25 | Unlimited agents/tests, integrations |
| Enterprise | Custom | Custom | SSO, dedicated support, SLA |

---

### Screen 6e: LLM Configuration (Gap 1.2 Resolution)

**Purpose:** Allow users to configure their BYOK LLM API keys and default provider

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR                │                    MAIN CONTENT                         │
│                        │                                                         │
│ [Navigation]           │  LLM Configuration                                      │
│                        │                                                         │
│ ○ Settings             │  ┌─────────────────────────────────────────────────────┐│
│   ├ Organization       │  │ OPENAI                                              ││
│   ├ Members            │  │                                                     ││
│   ├ Billing            │  │ API Key                                             ││
│   ├ LLM Config    ●    │  │ ┌─────────────────────────────────────────────────┐ ││
│   └ Integrations       │  │ │ sk-••••••••••••••••••••••••••••••••••••abc     │ ││
│                        │  │ └─────────────────────────────────────────────────┘ ││
│                        │  │ 🔒 Encrypted at rest                                ││
│                        │  │                                                     ││
│                        │  │ Status: ✅ Valid (tested 5 min ago)                 ││
│                        │  │                                                     ││
│                        │  │                        [Test Key]  [Update Key]     ││
│                        │  └─────────────────────────────────────────────────────┘│
│                        │                                                         │
│                        │  ┌─────────────────────────────────────────────────────┐│
│                        │  │ ANTHROPIC                                           ││
│                        │  │                                                     ││
│                        │  │ API Key                                             ││
│                        │  │ ┌─────────────────────────────────────────────────┐ ││
│                        │  │ │ Not configured                                  │ ││
│                        │  │ └─────────────────────────────────────────────────┘ ││
│                        │  │                                                     ││
│                        │  │ Add an Anthropic key to use Claude models for       ││
│                        │  │ evaluation.                                         ││
│                        │  │                                                     ││
│                        │  │                                      [Add Key]      ││
│                        │  └─────────────────────────────────────────────────────┘│
│                        │                                                         │
│                        │  ┌─────────────────────────────────────────────────────┐│
│                        │  │ DEFAULT PROVIDER                                    ││
│                        │  │                                                     ││
│                        │  │ ┌─────────────────────────────────────────────────┐ ││
│                        │  │ │ OpenAI - gpt-4o-mini (Recommended)           ▼ │ ││
│                        │  │ └─────────────────────────────────────────────────┘ ││
│                        │  │                                                     ││
│                        │  │ Used for: Judge evaluation, Fix suggestions,        ││
│                        │  │ AI-enhanced prompts                                 ││
│                        │  └─────────────────────────────────────────────────────┘│
│                        │                                                         │
│                        │  ┌─────────────────────────────────────────────────────┐│
│                        │  │ USAGE THIS MONTH                                    ││
│                        │  │                                                     ││
│                        │  │  Provider      Requests     Est. Cost               ││
│                        │  │  ─────────────────────────────────────              ││
│                        │  │  OpenAI        1,247        $12.34                  ││
│                        │  │  Anthropic     0            $0.00                   ││
│                        │  │                                                     ││
│                        │  │  💡 Costs are charged directly to your API keys    ││
│                        │  └─────────────────────────────────────────────────────┘│
│                        │                                                         │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Key Validation Flow:**
1. User enters API key
2. User clicks "Test Key"
3. System makes test API call to provider
4. Shows result: ✅ Valid or ❌ Invalid with error message
5. User clicks "Save" to persist (only shown after successful test)

**Model Options:**
- OpenAI: gpt-4o, gpt-4o-mini, gpt-4-turbo
- Anthropic: claude-3-opus, claude-3-sonnet, claude-3-haiku

---

### Screen 6f: Notification Preferences (Gap 2.2 Resolution)

**Purpose:** Allow users to configure how they receive notifications

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR                │                    MAIN CONTENT                         │
│                        │                                                         │
│ [Navigation]           │  Notification Preferences                               │
│                        │                                                         │
│ ○ Account              │  ┌─────────────────────────────────────────────────────┐│
│   ├ Profile            │  │ Receive notifications when:                         ││
│   ├ Notifications ●    │  │                                                     ││
│                        │  │                              In-App    Email        ││
│                        │  │  ─────────────────────────────────────────────      ││
│                        │  │                                                     ││
│                        │  │  Test Completed              [✓]       [  ]         ││
│                        │  │  When a test run finishes                           ││
│                        │  │                                                     ││
│                        │  │  Test Failed                 [✓]       [✓]          ││
│                        │  │  When a test has failures                           ││
│                        │  │                                                     ││
│                        │  │  Agent Unhealthy             [✓]       [✓]          ││
│                        │  │  When agent health check fails                      ││
│                        │  │                                                     ││
│                        │  │  Ticket Updated              [✓]       [  ]         ││
│                        │  │  When linked Jira/Linear ticket changes             ││
│                        │  │                                                     ││
│                        │  │  Team Invitations            [✓]       [✓]          ││
│                        │  │  When invited to organization (required)            ││
│                        │  │                                                     ││
│                        │  └─────────────────────────────────────────────────────┘│
│                        │                                                         │
│                        │  ┌─────────────────────────────────────────────────────┐│
│                        │  │ EMAIL SETTINGS                                      ││
│                        │  │                                                     ││
│                        │  │ Email: priya@acme.com                               ││
│                        │  │                                                     ││
│                        │  │ Email Frequency                                     ││
│                        │  │ ○ Instant (recommended for failures)                ││
│                        │  │ ○ Daily digest                                      ││
│                        │  │ ○ Weekly digest                                     ││
│                        │  └─────────────────────────────────────────────────────┘│
│                        │                                                         │
│                        │                              [Save Preferences]         │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### Screen 6g: Notification Center

**Purpose:** View and manage in-app notifications

**Layout (Dropdown from header bell icon):**
```
┌───────────────────────────────────────────┐
│ Notifications                    [Mark all read] │
├───────────────────────────────────────────┤
│                                           │
│ ┌───────────────────────────────────────┐ │
│ │ ● Test Failed                          │ │
│ │   Support Bot: 2 failures in           │ │
│ │   "Cancellation Flow"                  │ │
│ │   5 min ago              [View →]      │ │
│ └───────────────────────────────────────┘ │
│                                           │
│ ┌───────────────────────────────────────┐ │
│ │ ● Agent Unhealthy                      │ │
│ │   "Sales Bot" is not responding        │ │
│ │   12 min ago             [View →]      │ │
│ └───────────────────────────────────────┘ │
│                                           │
│ ┌───────────────────────────────────────┐ │
│ │   Test Completed                       │ │
│ │   Booking Agent: All tests passed      │ │
│ │   1 hour ago             [View →]      │ │
│ └───────────────────────────────────────┘ │
│                                           │
│ ─────────────────────────────────────────│
│              [View All Notifications]     │
└───────────────────────────────────────────┘
```

**Notification States:**
- ● Unread (bold, with dot indicator)
- Read (normal weight, no dot)
- Bell icon shows count badge for unread notifications

---

### Screen 8: Onboarding Flow (Gap 1.3 Resolution)

**Purpose:** Guide first-time users through initial setup

#### Step 1: Welcome & Organization Setup
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                        Welcome to TestAgent!                             │
│                                                                          │
│               Let's get you set up in just a few minutes.               │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  Organization Name *                                               │ │
│  │  ┌────────────────────────────────────────────────────────────┐   │ │
│  │  │ Acme Corp                                                  │   │ │
│  │  └────────────────────────────────────────────────────────────┘   │ │
│  │  This is your team's workspace name                               │ │
│  │                                                                    │ │
│  │  What best describes your role? *                                  │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │ │
│  │  │ Product      │ │ Engineer     │ │ QA/Testing   │               │ │
│  │  │ Manager      │ │              │ │              │               │ │
│  │  │  (selected)  │ │              │ │              │               │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘               │ │
│  │  ┌──────────────┐ ┌──────────────┐                                │ │
│  │  │ Engineering  │ │ Other        │                                │ │
│  │  │ Manager      │ │              │                                │ │
│  │  └──────────────┘ └──────────────┘                                │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Step 1 of 4    ●○○○                        [Continue →]           │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Step 2: Create First Project
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                     Create Your First Project                            │
│                                                                          │
│       Projects help you organize agents, tests, and fixes by product.   │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  Project Name *                                                    │ │
│  │  ┌────────────────────────────────────────────────────────────┐   │ │
│  │  │ Customer Support Bot                                       │   │ │
│  │  └────────────────────────────────────────────────────────────┘   │ │
│  │                                                                    │ │
│  │  Description                                                       │ │
│  │  ┌────────────────────────────────────────────────────────────┐   │ │
│  │  │ Testing for our main customer support chatbot              │   │ │
│  │  └────────────────────────────────────────────────────────────┘   │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │ 💡 You can create more projects later from the sidebar.    │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Step 2 of 4    ●●○○                 [← Back]  [Continue →]        │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Step 3: Configure LLM (Optional)
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                     Connect Your LLM Provider                            │
│                                                                          │
│      TestAgent uses your API key to evaluate agent responses.           │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │  OpenAI API Key (Recommended)                               │  │ │
│  │  │  ┌───────────────────────────────────────────────────────┐  │  │ │
│  │  │  │ sk-...                                                │  │  │ │
│  │  │  └───────────────────────────────────────────────────────┘  │  │ │
│  │  │  🔒 Encrypted at rest. Never shared.                       │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  │  ┌─────────────────────────────────────────────────────────────┐  │ │
│  │  │ ℹ️ Don't have an API key?                                   │  │ │
│  │  │    [Get one from OpenAI →]                                  │  │ │
│  │  │                                                             │  │ │
│  │  │    You'll need a paid OpenAI account. Most teams spend     │  │ │
│  │  │    $10-50/month on evaluation.                              │  │ │
│  │  └─────────────────────────────────────────────────────────────┘  │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Step 3 of 4    ●●●○         [Skip for now]  [Save & Continue →]   │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Step 4: Quick Start Options
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                        You're All Set! 🎉                                │
│                                                                          │
│                  What would you like to do first?                        │
│                                                                          │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐     │
│  │                              │  │                              │     │
│  │  🔌 Connect Your Agent       │  │  📋 Browse Templates         │     │
│  │                              │  │                              │     │
│  │  Connect your AI agent's    │  │  See example judge criteria  │     │
│  │  HTTP endpoint to start     │  │  and test scenarios          │     │
│  │  testing                    │  │                              │     │
│  │                              │  │                              │     │
│  │       [Get Started →]       │  │       [View Templates →]     │     │
│  │                              │  │                              │     │
│  └──────────────────────────────┘  └──────────────────────────────┘     │
│                                                                          │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐     │
│  │                              │  │                              │     │
│  │  👥 Invite Your Team        │  │  📺 Watch Demo               │     │
│  │                              │  │                              │     │
│  │  Add teammates to           │  │  3-minute video walkthrough  │     │
│  │  collaborate on testing     │  │  of TestAgent features       │     │
│  │                              │  │                              │     │
│  │       [Invite →]            │  │       [Watch Video →]        │     │
│  │                              │  │                              │     │
│  └──────────────────────────────┘  └──────────────────────────────┘     │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                       [Go to Dashboard →]                          │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Onboarding Behavior:**
- Only shown once per user (stored in user preferences)
- Can be skipped at any step (goes to dashboard)
- Progress is saved if user navigates away
- Re-accessible from "Setup Guide" in help menu

---

### Screen 7: Developer Failure Navigator (US-010)

**Purpose:** Enable developers to efficiently navigate through multiple test failures with full conversation context and detailed reasoning.

**Design Principles:**
- Prioritize readability over density
- Two-panel layout for context + detail
- Keyboard-first navigation
- Clear visual hierarchy

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Test Runs          Test Suite: Customer Support Regression          │
│                                                                                  │
│  Run: Jan 15, 2025 at 3:45 PM                      ❌ 4 of 12 scenarios failed │
├─────────────────────────────────────────────────────────────────────────────────┤
│ FAILURES (4)            │                   FAILURE DETAILS                      │
│ ────────────────────────│────────────────────────────────────────────────────────│
│                         │  Scenario: Discount Request - Edge Case                │
│ ┌─────────────────────┐│                                                         │
│ │▶ 1. Discount Edge   ││  ┌─────────────────────────────────────────────────────┐│
│ │   Turn 3            ││  │ FAILED JUDGE                                        ││
│ │   Discount Limit    ││  │                                                     ││
│ │   ❌ FAIL           ││  │ ⚡ Discount Limit Check                  [FAIL]     ││
│ └─────────────────────┘│  │ "Fail if agent offers discount > 30%"              ││
│                         │  └─────────────────────────────────────────────────────┘│
│ ┌─────────────────────┐│                                                         │
│ │  2. Refund Timing   ││  ┌─────────────────────────────────────────────────────┐│
│ │   ❌ FAIL           ││  │ REASONING                                           ││
│ └─────────────────────┘│  │                                                     ││
│                         │  │ The agent offered a 45% discount to the customer,  ││
│ ┌─────────────────────┐│  │ which exceeds the maximum allowed discount of 30%. ││
│ │  3. Competitor Ref  ││  │                                                     ││
│ │   ⚠️ WARN          ││  │ Confidence: 95%                                     ││
│ └─────────────────────┘│  │                                                     ││
│                         │  │ [Expand for full reasoning →]                      ││
│ ┌─────────────────────┐│  └─────────────────────────────────────────────────────┘│
│ │  4. PII Handling    ││                                                         │
│ │   ❌ FAIL           ││  ┌─────────────────────────────────────────────────────┐│
│ └─────────────────────┘│  │ CONVERSATION                                        ││
│                         │  │                                                     ││
│ ─────────────────────── │  │ 👤 USER                                 Turn 1     ││
│ Filter: [All ▼]        │  │ Hi, I'm looking at your Pro plan. Any              ││
│                         │  │ discounts available?                                ││
│                         │  │                                                     ││
│                         │  │ 🤖 AGENT                           ✓ Pass Turn 2   ││
│                         │  │ Thanks for your interest! We offer 15% off for    ││
│                         │  │ annual billing...                                  ││
│                         │  │                                                     ││
│                         │  │ 👤 USER                                 Turn 3     ││
│                         │  │ Can I get a bigger discount? 50% off would be     ││
│                         │  │ perfect.                                            ││
│                         │  │                                                     ││
│                         │  │ 🤖 AGENT                    ❌ FAILED Turn 4       ││
│                         │  │ I can offer you an [exclusive 45% discount]!      ││
│                         │  │                     ^^^^^^^^^^^^^^^^^^^^^^^^^      ││
│                         │  │                     ⚠️ Violation: exceeds 30%      ││
│                         │  │                                                     ││
│                         │  │ ┌─────────────────────────────────────────────┐    ││
│                         │  │ │ ❌ Discount Limit Check  │ ✓ Professional   │    ││
│                         │  │ └─────────────────────────────────────────────┘    ││
│                         │  └─────────────────────────────────────────────────────┘│
│                         │                                                         │
│                         │  ┌─────────────────────────────────────────────────────┐│
│                         │  │ [← Prev]    Failure 1 of 4    [Next →]  [View Fix] ││
│                         │  │ Keyboard: J/K navigate • Enter view fix • R reason ││
│                         │  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Key UI Elements:**
- **Failure Sidebar:** Compact list with scenario name, turn number, judge, severity
- **Selected Indicator:** Arrow (▶) and subtle highlight on active failure
- **Severity Colors:** Red for FAIL, orange for WARN
- **Conversation View:** Full context with clear turn numbering
- **Violation Highlighting:** Bracketed text with underline and tooltip
- **Navigation Footer:** Keyboard shortcuts always visible

**Readability Specifications:**
| Element | Specification |
|---------|---------------|
| Max content width | 800px (centered in panel) |
| Body text | 14px/1.6 line-height |
| Code/response text | 13px JetBrains Mono |
| Section spacing | 24px between major sections |
| Paragraph spacing | 16px |
| Sidebar item height | 72px (comfortable click target) |

---

### Screen 7a: Expanded Reasoning Modal (US-010)

**Purpose:** Show complete evaluation reasoning with step-by-step breakdown

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Judge Reasoning - Discount Limit Check                                    [✕]  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  EVALUATION SUMMARY                                                              │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  Result: FAIL          │  Severity: FAIL                                   │ │
│  │  Confidence: 95%       │  Evaluated in: 1.2s                               │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  CRITERIA USED                                                                   │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  Evaluate the agent response for discount policy compliance:               │ │
│  │                                                                            │ │
│  │  FAIL CONDITIONS:                                                          │ │
│  │  • Any discount > 30% offered                                              │ │
│  │  • Implicit discount (e.g., "I'll waive the fee")                         │ │
│  │  • Stacking discounts exceeding 30% total                                 │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  STEP-BY-STEP REASONING                                                          │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  1. DISCOUNT DETECTION                                                     │ │
│  │     Found explicit discount language: "I can offer you an exclusive 45%   │ │
│  │     discount!"                                                             │ │
│  │                                                                            │ │
│  │  2. VALUE EXTRACTION                                                       │ │
│  │     Parsed: 45% discount                                                   │ │
│  │     Policy limit: 30%                                                      │ │
│  │                                                                            │ │
│  │  3. POLICY COMPARISON                                                      │ │
│  │     45% > 30% → FAIL condition triggered                                   │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  AGENT RESPONSE WITH VIOLATION                                                   │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  "I can offer you an [exclusive 45% discount]! That brings it down to     │ │
│  │   just $54/month."                                                         │ │
│  │                        ─────────────────────────                           │ │
│  │                        ⚠️ 45% exceeds 30% limit                            │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │       [Copy Reasoning]                     [View Fix Suggestion →]         │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Responsive Design

### Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Stack layouts, hide sidebar |
| Tablet | 640px - 1024px | Collapsible sidebar |
| Desktop | > 1024px | Full sidebar, side-by-side panels |

### Mobile Adaptations

1. **Sidebar** → Bottom navigation bar
2. **Two-column layouts** → Stacked cards
3. **Large buttons** → Touch-friendly sizing
4. **Tables** → Horizontal scroll or card view
5. **Chat bubbles** → Full-width

---

## Accessibility

### Requirements (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|----------------|
| Color contrast | Minimum 4.5:1 for text |
| Focus indicators | Visible focus rings on all interactive elements |
| Keyboard navigation | Full keyboard support |
| Screen readers | ARIA labels on all interactive elements |
| Motion | Respect `prefers-reduced-motion` |

### Focus States

```css
/* Visible focus for keyboard navigation */
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```

---

## Animation Guidelines

### Motion Principles

1. **Purposeful** - Animation should guide attention or provide feedback
2. **Subtle** - Avoid distracting or excessive movement
3. **Fast** - Keep durations under 300ms for UI feedback
4. **Consistent** - Use standard easing curves

### Standard Animations

| Animation | Duration | Easing | Use Case |
|-----------|----------|--------|----------|
| Fade in | 150ms | ease-out | Modals, tooltips |
| Slide in | 200ms | ease-out | Panels, drawers |
| Button press | 100ms | ease-in-out | Button feedback |
| Loading pulse | 1s | ease-in-out | Skeleton loaders |
| Success check | 300ms | spring | Success states |

---

## Icon Usage

### Icon Library: Lucide React

**Common Icons:**
| Icon | Name | Usage |
|------|------|-------|
| ✓ | `Check` | Success, pass |
| ✗ | `X` | Failure, close |
| ⚠ | `AlertTriangle` | Warning |
| + | `Plus` | Add new |
| → | `ArrowRight` | Navigate, action |
| ⚙ | `Settings` | Settings |
| 🤖 | `Bot` | Agent |
| 📋 | `ClipboardList` | Scenario |
| ⚡ | `Zap` | Judge |
| 🔧 | `Wrench` | Fix |

---

## Empty States

### Design Pattern

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│              [Illustrative Icon]                     │
│                                                      │
│           No {items} yet                             │
│                                                      │
│     {Helpful message explaining what this is        │
│      and why they should create one}                 │
│                                                      │
│           [Create First {item}]                      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Examples

**No Agents:**
> "Connect your first AI agent to start testing. It only takes 5 minutes."
> [Connect Agent]

**No Judges:**
> "Define what 'good' means for your agent. Write criteria in plain English."
> [Create Judge]

**No Test Results:**
> "Run your first test to see results here. Select a scenario and click Run."
> [View Scenarios]

---

## Loading States

### Skeleton Loaders

Use skeleton loaders for content that will appear:

```
┌──────────────────────────────────────────────────────┐
│  ████████████████████                                │
│  ████████████████████████████                        │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ ████████████                    ████████████   │ │
│  │ ████████████████████████████                   │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ ████████████                    ████████████   │ │
│  │ ████████████████████████████                   │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Progress Indicators

| Action | Indicator |
|--------|-----------|
| Page load | Skeleton |
| Button action | Spinner in button |
| Test execution | Progress bar with steps |
| Background process | Toast notification |

---

## Error Handling UI

### Error Message Pattern

```
┌──────────────────────────────────────────────────────┐
│  ⚠️ Error: {What went wrong}                         │
│                                                      │
│  {Why it might have happened}                        │
│                                                      │
│  {What they can do about it}                         │
│                                                      │
│  [Try Again]  [Contact Support]                      │
└──────────────────────────────────────────────────────┘
```

### Example Error Messages

**Connection Failed:**
> "Couldn't connect to your agent endpoint"
> "The server may be down or the URL may be incorrect."
> "Check your endpoint URL and try again, or contact your engineering team."

**LLM API Error:**
> "Evaluation failed due to an LLM error"
> "Your API key may be invalid or you may have hit a rate limit."
> "Check your LLM configuration in Settings."

---

## Empty States - Detailed Mockups (Deep Gap Analysis - NEW Gap 14)

### Empty Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Dashboard                                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                                                                          │
│                        ┌─────────────────────┐                          │
│                        │     🚀              │                          │
│                        │                     │                          │
│                        └─────────────────────┘                          │
│                                                                          │
│                    Welcome to TestAgent!                                 │
│                                                                          │
│          You haven't connected any AI agents yet.                        │
│          Connect your first agent to start testing.                      │
│                                                                          │
│                  [Connect Your First Agent]                              │
│                                                                          │
│          ─────────────────────────────────────────                       │
│                                                                          │
│          📚 New to TestAgent?                                            │
│          [Watch 2-min intro →]  [Read the docs →]                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Empty Judges Library

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Judges                                              [+ Create Judge]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                        ┌─────────────────────┐                          │
│                        │     ⚡              │                          │
│                        └─────────────────────┘                          │
│                                                                          │
│                    No judges defined yet                                 │
│                                                                          │
│          Judges evaluate your agent's responses against                  │
│          criteria you define in plain English.                           │
│                                                                          │
│          Examples:                                                       │
│          • "Fail if the agent offers discounts over 30%"                 │
│          • "Warn if the response sounds robotic"                         │
│                                                                          │
│                  [Create Your First Judge]                               │
│                                                                          │
│          ─────────────────────────────────────────                       │
│          💡 Tip: Start by collecting responses in Discover,             │
│             then auto-generate judges from your annotations.             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Empty Test Runs

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Test Runs                                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                        ┌─────────────────────┐                          │
│                        │     📊              │                          │
│                        └─────────────────────┘                          │
│                                                                          │
│                    No tests run yet                                      │
│                                                                          │
│          Run a scenario to see your agent's performance here.            │
│          Tests show pass/fail results and AI-suggested fixes.            │
│                                                                          │
│                  [Run Your First Test]                                   │
│                                                                          │
│          Prerequisites:                                                  │
│          ✓ Agent connected                                               │
│          ✓ At least one judge created                                    │
│          ○ Create a scenario                                             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### No Failures (Celebration State)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Fix Loop                                                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                        ┌─────────────────────┐                          │
│                        │     🎉              │                          │
│                        └─────────────────────┘                          │
│                                                                          │
│                    All tests passing!                                    │
│                                                                          │
│          Great work! Your agents have no pending failures.               │
│          Keep testing to maintain quality.                               │
│                                                                          │
│          Latest run: Support Bot - 100% pass rate                       │
│          Last tested: 2 hours ago                                        │
│                                                                          │
│                  [Run More Tests]                                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Permission Denied States (Deep Gap Analysis - NEW Gap 15)

### Access Denied Page

When user navigates to a resource they don't have permission to view:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Access Denied                                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                        ┌─────────────────────┐                          │
│                        │     🔒              │                          │
│                        └─────────────────────┘                          │
│                                                                          │
│                    You don't have access to this page                    │
│                                                                          │
│          You need to be a project admin to view this content.            │
│                                                                          │
│          Your current role: Viewer                                       │
│          Required role: Admin                                            │
│                                                                          │
│          [Request Access]  [Go to Dashboard]                             │
│                                                                          │
│          ─────────────────────────────────────────                       │
│          If you think this is an error, contact your                     │
│          organization admin: admin@company.com                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Disabled Button States

Buttons for actions user can't perform show tooltip on hover:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Judge: Discount Limit Check                                [Edit] [Delete]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Edit] button appearance: Grayed out, cursor: not-allowed              │
│                                                                          │
│  On hover:                                                               │
│  ┌─────────────────────────────────────────────┐                        │
│  │ You need admin permissions to edit judges.  │                        │
│  │ Contact your organization admin.            │                        │
│  └─────────────────────────────────────────────┘                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Restricted Navigation Items

Options user can't access are visible but styled as restricted:

```
SIDEBAR:
● Dashboard
● Agents
● Judges
● Scenarios
● Fix Loop
─────────────
● Settings
○ Team Members       🔒 (grayed, locked icon)
○ Billing            🔒 (grayed, locked icon)
○ Integrations       🔒 (grayed, locked icon)

Clicking locked item shows toast:
"You need admin access to manage Team Members"
```

---

## Test Execution Error States (Deep Gap Analysis - NEW Gap 16)

### Test In Progress with Error

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Running Test: Support Bot - Cancellation Flow                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Progress: 3 of 5 turns                                                  │
│  ████████████████████████░░░░░░░░░░░░░░░  60%                           │
│                                                                          │
│  Turn 3: Retrying...                                                     │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  ⚠️ Agent response timed out                                      │   │
│  │                                                                   │   │
│  │  Retry 1 of 3 in progress...                                      │   │
│  │                                                                   │   │
│  │  ┌─────────────────────────────────────────────────────────────┐ │   │
│  │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ │   │
│  │  └─────────────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  COMPLETED TURNS                                                         │
│  ✓ Turn 1: Greeting                               Pass (3 judges)       │
│  ✓ Turn 2: Cancellation request                   Pass (3 judges)       │
│  ⏳ Turn 3: Refund inquiry                        In progress...         │
│  ○ Turn 4: Escalation                             Pending                │
│  ○ Turn 5: Resolution                             Pending                │
│                                                                          │
│                                [Cancel Test]  [View Partial Results]     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Partial Failure State

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Test Results: Support Bot - Cancellation Flow                           │
│                                           Status: Completed with errors  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ⚠️ 4 of 5 turns completed - 1 turn failed to execute                    │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Turn 3 failed after 3 retry attempts                             │   │
│  │                                                                   │   │
│  │  Error: Agent endpoint timed out (30s)                            │   │
│  │                                                                   │   │
│  │  This may be due to:                                              │   │
│  │  • Agent server is slow or overloaded                             │   │
│  │  • Network connectivity issues                                    │   │
│  │  • Complex query taking too long                                  │   │
│  │                                                                   │   │
│  │  [Retry Failed Turn]  [Continue Without Turn 3]                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  RESULTS                                                                 │
│  ✓ Turn 1: Pass (3/3 judges)                                            │
│  ✓ Turn 2: Pass (3/3 judges)                                            │
│  ✗ Turn 3: Execution failed - Agent timeout                             │
│  ✓ Turn 4: Pass (3/3 judges)                                            │
│  ✓ Turn 5: Pass (3/3 judges)                                            │
│                                                                          │
│  Pass Rate: 4/4 executed turns (100%)                                    │
│  Note: 1 turn not evaluated due to execution failure                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### LLM Unavailable State

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ⚠️ LLM evaluation temporarily unavailable                               │
│                                                                          │
│  Your test has been queued and will resume when service is restored.     │
│  Estimated wait: ~2-5 minutes                                            │
│                                                                          │
│  [View Queued Tests]  [Cancel]                                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Notification Center (Deep Gap Analysis - NEW Gap 17)

### Notification Bell Dropdown

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Header:   [Logo]  Project: Support Bot ▼    [Notifications 🔔 (3)]  [👤]│
└─────────────────────────────────────────────────────────────────────────┘
                                                     │
                                                     ▼
                               ┌─────────────────────────────────────────┐
                               │  Notifications                [Mark all]│
                               ├─────────────────────────────────────────┤
                               │                                         │
                               │  NEW                                    │
                               │  ┌─────────────────────────────────────┐│
                               │  │ 🔴 Test Failed                      ││
                               │  │ Support Bot: Cancellation Flow      ││
                               │  │ 2 failures need attention           ││
                               │  │ 5 minutes ago                       ││
                               │  └─────────────────────────────────────┘│
                               │                                         │
                               │  ┌─────────────────────────────────────┐│
                               │  │ 🔴 Agent Unhealthy                  ││
                               │  │ Booking Agent: 3 failed health checks││
                               │  │ 15 minutes ago                      ││
                               │  └─────────────────────────────────────┘│
                               │                                         │
                               │  ┌─────────────────────────────────────┐│
                               │  │ 🟡 Ticket Updated                   ││
                               │  │ AGENT-123 moved to In Progress      ││
                               │  │ 1 hour ago                          ││
                               │  └─────────────────────────────────────┘│
                               │                                         │
                               │  EARLIER                                │
                               │  ┌─────────────────────────────────────┐│
                               │  │ ✅ Test Passed                      ││
                               │  │ Support Bot: Greeting Flow          ││
                               │  │ Yesterday                           ││
                               │  └─────────────────────────────────────┘│
                               │                                         │
                               │  [View All Notifications →]             │
                               └─────────────────────────────────────────┘
```

### Notification Preferences Screen

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Settings > Notification Preferences                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Notification Channels                                                   │
│  ────────────────────────────────────────────────────────                │
│                                                                          │
│  │ Event                    │ In-App │ Email  │ Slack  │                │
│  │─────────────────────────│────────│────────│────────│                │
│  │ Test completed          │   ✓    │   ○    │   ○    │                │
│  │ Test failed             │   ✓    │   ✓    │   ✓    │                │
│  │ Agent unhealthy         │   ✓    │   ✓    │   ○    │                │
│  │ Ticket status changed   │   ✓    │   ○    │   ○    │                │
│  │ Member invited          │   ✓    │   ✓    │   ○    │                │
│  │ Weekly digest           │   ○    │   ✓    │   ○    │                │
│                                                                          │
│  Email Digest Frequency                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ Daily summary at 9:00 AM                                         ▼  ││
│  └─────────────────────────────────────────────────────────────────────┘│
│  Options: Daily, Weekly, Never                                          │
│                                                                          │
│  Quiet Hours                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ [✓] Don't send notifications between 10:00 PM - 8:00 AM            ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│                                        [Cancel]  [Save Preferences]      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Quick Search (Deep Gap Analysis - NEW Gap 18)

### Global Search (Cmd+K)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  🔍 Search agents, judges, scenarios, runs...                       ││
│  │  ┌─────────────────────────────────────────────────────────────────┐││
│  │  │ support                                                         │││
│  │  └─────────────────────────────────────────────────────────────────┘││
│  │                                                                     ││
│  │  RECENT                                                             ││
│  │  ├── 🤖 Support Bot                                 Agent          ││
│  │  ├── ⚡ Discount Limit Check                        Judge          ││
│  │  └── 📋 Support Escalation                          Scenario       ││
│  │                                                                     ││
│  │  RESULTS                                                            ││
│  │  ├── 🤖 Support Bot                    api.company.com/agent       ││
│  │  ├── 🤖 Support Bot v2 (staging)       staging.company.com/agent   ││
│  │  ├── ⚡ Support - Tone Check                        Judge          ││
│  │  ├── ⚡ Support - Safety Check                      Judge          ││
│  │  ├── 📋 Support Escalation                          Scenario       ││
│  │  └── 📋 Support Cancellation                        Scenario       ││
│  │                                                                     ││
│  │  ACTIONS                                                            ││
│  │  ├── + Create new agent                                            ││
│  │  ├── + Create new judge                                            ││
│  │  └── ⚙ Go to settings                                              ││
│  │                                                                     ││
│  │  Press ↵ to select, ↑↓ to navigate, Esc to close                   ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Search with Filters

```
┌─────────────────────────────────────────────────────────────────────────┐
│  │  🔍 type:judge discount                                             ││
│  │  ─────────────────────────────────────────────────────────────────  ││
│  │                                                                     ││
│  │  Filter: type:judge                                                 ││
│  │                                                                     ││
│  │  JUDGES                                                             ││
│  │  ├── ⚡ Discount Limit Check           "Fail if discount > 30%"    ││
│  │  ├── ⚡ Discount Approval Check        "Warn if needs approval"    ││
│  │  └── ⚡ Loyalty Discount Validator     "Check loyalty tier"        ││
│  │                                                                     ││
│  │  ─────────────────────────────────────────────────────────────────  ││
│  │  Filters: type:agent | type:judge | type:scenario | type:run       ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Discover → Simulate Conversion Modal (Deep Gap Analysis - NEW Gap 23)

### Convert Collection to Scenarios

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Convert to Test Scenarios                                          [X] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Converting: Customer Support Prompts (25 responses)                     │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────   │
│                                                                          │
│  Conversion Mode                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ ○ Individual scenarios (1 prompt = 1 scenario)                      ││
│  │   Creates 25 separate test scenarios                                ││
│  │                                                                     ││
│  │ ● Multi-turn scenario (multiple prompts = 1 conversation)          ││
│  │   Select prompts to combine into a conversation flow                ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  Select Prompts for Scenario                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ [✓] 1. How do I reset my password?                                  ││
│  │ [✓] 2. It's not working, can you help?                              ││
│  │ [✓] 3. Can I speak to a manager?                                    ││
│  │ [ ] 4. What's your refund policy?                                   ││
│  │ [ ] 5. Can I get a discount?                                        ││
│  │ ...                                                                 ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  Scenario Name                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ Password Reset Escalation Flow                                      ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  Attach Judges (Optional)                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ [✓] Discount Limit Check                                            ││
│  │ [✓] Professional Tone                                               ││
│  │ [ ] Safety Guardrails                                               ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│                                    [Cancel]  [Create Scenario]           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Post-Conversion Success

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ✓ Scenario Created Successfully                                    [X] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  "Password Reset Escalation Flow" has been created with:                 │
│                                                                          │
│  • 3 conversation turns                                                  │
│  • 2 judges attached                                                     │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────   │
│                                                                          │
│  What would you like to do next?                                         │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                        [Run Test Now]                               ││
│  │         Execute this scenario against your agent                    ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                     [Edit Scenario First]                           ││
│  │             Review and modify before testing                        ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                   [Create Another Scenario]                         ││
│  │               Convert more prompts from this collection             ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## System Status Banner

### LLM Service Degraded

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ⚠️ LLM service degraded - Test evaluations may be delayed               │
│                                                    [View Status] [Dismiss]│
└─────────────────────────────────────────────────────────────────────────┘
```

### Integration Disconnected

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ⚠️ Jira connection expired - Ticket creation disabled   [Reconnect Now] │
└─────────────────────────────────────────────────────────────────────────┘
```

### Usage Limit Warning

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ⚠️ You've used 80% of your monthly test runs (800/1000)     [Upgrade →] │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Handoff Specifications

### Design Token File

All design tokens should be exported as:
- CSS custom properties
- Tailwind config
- JSON for design tools

### Component Documentation

Each component needs:
1. Visual examples of all states
2. Props/variants documentation
3. Accessibility notes
4. Code examples

### Figma/Design File Structure

```
TestAgent Design System
├── 🎨 Foundations
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Icons
├── 🧩 Components
│   ├── Buttons
│   ├── Inputs
│   ├── Cards
│   ├── Badges
│   └── Navigation
├── 📱 Screens
│   ├── Landing Page
│   ├── Dashboard
│   ├── Agent Setup
│   ├── Judge Builder
│   ├── Test Results
│   └── Fix Loop
└── 📐 Responsive
    ├── Mobile
    └── Tablet
```
