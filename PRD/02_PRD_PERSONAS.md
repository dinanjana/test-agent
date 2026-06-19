# TestAgent PRD - Part 2: User Personas & Journeys

## 1. Persona Overview

| Persona | Role | Primary/Secondary | Key Goal |
|---------|------|-------------------|----------|
| PM Priya | Product Manager | **Primary** | Define quality criteria, verify agent meets requirements |
| Engineer Evan | AI/ML Engineer | **Secondary** | Get clear requirements, fix issues quickly |
| Leader Lisa | VP Engineering | Stakeholder | Ship AI projects successfully, reduce friction |

---

## 2. Persona 1: PM Priya (Primary User)

### Profile

| Attribute | Details |
|-----------|---------|
| **Role** | Product Manager for AI/Conversational Products |
| **Company** | Series B SaaS company, 150 employees |
| **Experience** | 5 years PM, 1 year working on AI agents |
| **Technical Level** | Non-technical; cannot write code |
| **Reports To** | VP Product |
| **Works With** | AI Engineering team, Customer Success, Support |

### Goals
1. Define what "good" looks like for our AI agents in terms customers care about
2. Verify agents meet quality standards before shipping
3. Understand failures in terms I can explain to stakeholders
4. Reduce back-and-forth with engineering on requirements
5. Stop finding out about issues from angry customers

### Pain Points

| Pain Point | Severity | Quote |
|------------|----------|-------|
| No visibility into testing | Critical | "I'm accountable for agent quality but I can't see any of the testing" |
| Requirements lost in translation | High | "I write requirements, engineering interprets them differently" |
| Reactive discovery | Critical | "I find out something's broken from customer complaints" |
| Locked out of QA | High | "Current tools are too technical for me to use" |
| Can't explain failures | Medium | "When something fails, I don't understand the traces" |

### Success Criteria
- Can define evaluation criteria without asking engineering for help
- Sees test results in a format she understands (conversations, not JSON)
- Knows about failures before customers do
- Can explain to stakeholders exactly what's broken and why
- Reduces requirement clarification cycles by 50%

### Technical Context
- Comfortable with: Figma, Notion, Jira, Google Sheets, Slack
- Uncomfortable with: Code, APIs, JSON, command line, SQL
- Uses AI agents: ChatGPT for writing, but not for development

### Jobs To Be Done

| Job | Outcome |
|-----|---------|
| When I'm defining agent requirements, I want to express quality criteria in my own words, so that engineering knows exactly what to build toward |
| When I'm reviewing test results, I want to see conversations like a customer would, so that I can understand what went wrong |
| When a test fails, I want to understand the failure in plain language, so that I can prioritize and communicate to stakeholders |
| When shipping a new agent version, I want confidence it meets quality bar, so that I don't get surprised by customer complaints |

---

## 3. Persona 2: Engineer Evan (Secondary User)

### Profile

| Attribute | Details |
|-----------|---------|
| **Role** | Senior AI/ML Engineer |
| **Company** | Same as Priya - Series B SaaS, 150 employees |
| **Experience** | 7 years engineering, 3 years ML/AI |
| **Technical Level** | Highly technical; prefers code-based workflows |
| **Reports To** | Engineering Manager |
| **Works With** | PM team, other engineers, DevOps |

### Goals
1. Get clear, testable requirements from product
2. Know exactly when an agent is "done"
3. Fix issues quickly without extensive debugging
4. Ship with confidence, not hope
5. Reduce time spent in requirement clarification meetings

### Pain Points

| Pain Point | Severity | Quote |
|------------|----------|-------|
| Vague requirements | Critical | "The requirements say 'make it sound natural.' What does that mean?" |
| No success criteria | High | "I ship and hope for the best" |
| Time investigating | High | "Dashboards show failure but I spend hours finding root cause" |
| Rework cycles | Medium | "I build what I think PM wants, then we iterate 5 times" |
| No trust in AI output | Medium | "46% of us don't trust AI output - including me sometimes" |

### Success Criteria
- Requirements come as testable criteria, not vague PRDs
- When tests fail, gets specific fix suggestions
- Reduces debugging time by 60%
- Can validate changes against PM-defined criteria before shipping
- Fewer "that's not what I meant" cycles with PM

### Technical Context
- Comfortable with: Python, APIs, LangChain, OpenAI, Git, CI/CD
- Prefers: Code-based workflows, CLI tools, programmatic access
- Skeptical of: "No-code" tools that limit flexibility

### Jobs To Be Done

| Job | Outcome |
|-----|---------|
| When I receive requirements, I want them as executable tests, so that I know exactly what "done" looks like |
| When a test fails, I want suggested fixes, so that I can resolve issues quickly without extensive debugging |
| When PM asks "why did it fail?", I want shareable context, so that we're looking at the same information |
| When I'm shipping, I want automated validation, so that I'm confident the agent meets quality bar |

---

## 4. Persona 3: Leader Lisa (Stakeholder)

### Profile

| Attribute | Details |
|-----------|---------|
| **Role** | VP Engineering |
| **Company** | Same - Series B SaaS, 150 employees |
| **Experience** | 15 years engineering, 5 years leadership |
| **Technical Level** | Technical background, strategic focus |
| **Reports To** | CTO |
| **Manages** | 4 engineering teams including AI team |

### Goals
1. Ship AI projects successfully (beat the 80% failure rate)
2. Reduce cross-functional friction between PM and Engineering
3. Build team confidence in shipping AI
4. Demonstrate ROI on AI investments to leadership
5. Ensure compliance readiness (EU AI Act)

### Pain Points

| Pain Point | Severity | Quote |
|------------|----------|-------|
| High failure rate | Critical | "80% of our AI pilots don't make it to production" |
| Cross-functional friction | High | "PM and Eng speak different languages about quality" |
| Team uncertainty | High | "My engineers don't feel confident shipping agents" |
| Tool sprawl | Medium | "We have 5 different tools that don't talk to each other" |
| Compliance concerns | Medium | "EU AI Act is coming and we need to be ready" |

### Success Criteria
- Higher pilot-to-production success rate
- Reduced PM-Engineering friction (fewer escalations)
- Team shipping with confidence
- Single view of agent quality across teams
- Compliance audit trail

### Technical Context
- Reviews: Architecture decisions, tool purchases, team metrics
- Delegates: Day-to-day tool usage to team
- Cares about: ROI, team productivity, risk reduction

### Jobs To Be Done

| Job | Outcome |
|-----|---------|
| When reviewing AI initiatives, I want visibility into quality metrics, so that I can identify issues early |
| When PM and Eng disagree, I want shared data on quality, so that decisions are objective |
| When justifying AI investment, I want success metrics, so that I can demonstrate ROI |
| When auditors ask about testing, I want documentation, so that we're compliance-ready |

---

## 5. User Journey Maps

### Journey 1: PM Priya - First Test Setup

```
┌─────────────────────────────────────────────────────────────────┐
│                    PM FIRST TEST JOURNEY                        │
│                    Target: <25 minutes                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DISCOVER        SIGNUP         CONNECT        DEFINE          │
│  ────────        ──────         ───────        ──────          │
│  │               │              │              │                │
│  │ Hears about   │ Creates      │ Asks Eng     │ Writes        │
│  │ TestAgent     │ account      │ for endpoint │ criteria in   │
│  │ from Lenny's  │ (2 min)      │ URL          │ plain English │
│  │               │              │ (5 min)      │ (5 min)       │
│  │               │              │              │                │
│  ▼               ▼              ▼              ▼                │
│                                                                 │
│  SIMULATE        REVIEW         FIX           SHARE            │
│  ────────        ──────         ───           ─────            │
│  │               │              │              │                │
│  │ Runs first    │ Sees chat-   │ Understands  │ Shares        │
│  │ test          │ style        │ failure,     │ results       │
│  │ (2 min)       │ results      │ creates      │ with Eng      │
│  │               │ (3 min)      │ ticket       │               │
│  │               │              │ (3 min)      │               │
│  ▼               ▼              ▼              ▼                │
│                                                                 │
│  Emotions:                                                      │
│  😟 Skeptical → 😮 Surprised → 😊 Relieved → 🎉 Excited        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Journey 2: Engineer Evan - Fix a Failure

```
┌─────────────────────────────────────────────────────────────────┐
│                 ENGINEER FIX JOURNEY                            │
│                 Target: <15 minutes                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  NOTIFIED        REVIEW         UNDERSTAND     FIX             │
│  ────────        ──────         ──────────     ───             │
│  │               │              │              │                │
│  │ Gets Jira     │ Opens        │ Sees root    │ Reviews       │
│  │ ticket from   │ TestAgent    │ cause        │ AI-suggested  │
│  │ TestAgent     │ link in      │ analysis     │ prompt        │
│  │               │ ticket       │              │ modification  │
│  │               │              │              │                │
│  ▼               ▼              ▼              ▼                │
│                                                                 │
│  APPLY           VALIDATE       SHIP          CLOSE            │
│  ─────           ────────       ────          ─────            │
│  │               │              │              │                │
│  │ Copies fix    │ Re-runs      │ Deploys     │ Closes         │
│  │ to prompt     │ test -       │ with        │ ticket         │
│  │               │ passes!      │ confidence  │                │
│  │               │              │             │                 │
│  ▼               ▼              ▼              ▼                │
│                                                                 │
│  Time saved: ~2 hours debugging → 15 minutes                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Journey 3: Collaborative Testing Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│              COLLABORATIVE TESTING WORKFLOW                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PM PRIYA                        ENGINEER EVAN                  │
│  ─────────                       ────────────                   │
│  │                               │                              │
│  │ 1. Defines quality            │                              │
│  │    criteria in                │                              │
│  │    plain English              │                              │
│  │         │                     │                              │
│  │         ▼                     │                              │
│  │ ┌───────────────┐             │                              │
│  │ │ "Fail if      │             │                              │
│  │ │ discount >30%"│─────────────┼──▶ 2. Receives testable     │
│  │ └───────────────┘             │      criteria               │
│  │                               │           │                  │
│  │                               │           ▼                  │
│  │                               │    3. Builds agent          │
│  │                               │           │                  │
│  │                               │           ▼                  │
│  │ 4. Reviews test ◀─────────────┼── Runs tests                │
│  │    results in                 │                              │
│  │    chat format                │                              │
│  │         │                     │                              │
│  │         ▼                     │                              │
│  │ 5. Test fails -               │                              │
│  │    creates Jira ──────────────┼──▶ 6. Gets ticket with      │
│  │    with context               │      AI fix suggestion      │
│  │                               │           │                  │
│  │                               │           ▼                  │
│  │ 8. Verifies fix ◀─────────────┼── 7. Applies fix,           │
│  │    in TestAgent               │      re-runs test           │
│  │                               │                              │
│  └───────────────────────────────┴──────────────────────────────│
│                                                                 │
│  Result: Clear criteria + fast fixes = confident shipping      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Persona Prioritization Matrix

| Feature | PM Priya | Engineer Evan | Leader Lisa | Priority |
|---------|----------|---------------|-------------|----------|
| Natural language judges | ⭐⭐⭐ Critical | ⭐ Nice | ⭐⭐ Important | P0 |
| Chat-style results | ⭐⭐⭐ Critical | ⭐⭐ Important | ⭐ Nice | P0 |
| AI fix suggestions | ⭐⭐ Important | ⭐⭐⭐ Critical | ⭐⭐ Important | P0 |
| Jira integration | ⭐⭐ Important | ⭐⭐⭐ Critical | ⭐⭐ Important | P0 |
| No SDK required | ⭐⭐⭐ Critical | ⭐⭐ Important | ⭐ Nice | P0 |
| Dashboard overview | ⭐⭐ Important | ⭐ Nice | ⭐⭐⭐ Critical | P1 |
| Batch execution | ⭐ Nice | ⭐⭐ Important | ⭐⭐ Important | P1 |
| Scheduled tests | ⭐ Nice | ⭐⭐⭐ Critical | ⭐⭐ Important | P2 |
| Analytics/trends | ⭐ Nice | ⭐ Nice | ⭐⭐⭐ Critical | P2 |

---

## 7. Anti-Personas (Who We're NOT Building For)

### Anti-Persona 1: Solo Developer Dan
- Building personal projects
- No PM involvement
- Comfortable with code-only tools
- **Why not:** No collaboration gap to solve

### Anti-Persona 2: Enterprise Edna
- 10,000+ employee company
- 18-month procurement cycles
- Requires on-premise deployment
- **Why not:** Can't serve v1, revisit post-PMF

### Anti-Persona 3: Researcher Rita
- Academic/research context
- Needs statistical rigor, benchmarks
- Publishes papers on evaluation
- **Why not:** Different use case, not production QA

---

*Next: [03_PRD_CONNECT.md](./03_PRD_CONNECT.md) - Connect component specifications*
