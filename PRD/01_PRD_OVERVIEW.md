# TestAgent PRD - Part 1: Overview

## 1. Product Vision

### Vision Statement
TestAgent closes the collaboration gap between product managers and engineers in AI agent development by providing PM-accessible testing tools with actionable fix suggestions when tests fail.

### Mission
Enable teams to ship AI agents with confidence by making quality assurance accessible to everyone involved—not just engineers.

### Value Proposition
> "Building great agents requires domain expertise and engineering rigor working together—but today's tools force a handoff where domain experts define requirements, throw them over the wall, and hope for the best. TestAgent closes this loop by giving domain experts direct visibility and actionable influence over agent quality, while giving engineers clear, testable success criteria they can ship against confidently."

---

## 2. Problem Statement

### The AI Project Failure Crisis
- **80-95%** of enterprise AI projects fail to move from pilot to production
- **#1 cause** (per RAND Corporation): Miscommunication between domain experts and engineers
- **70%** of value leakage occurs due to collaboration failures, not technical issues
- **46%** of developers don't trust AI output (Stack Overflow)

### Current Pain Points

**For Product Managers:**
- Accountable for agent quality but no visibility into testing
- Requirements get "lost in translation" to engineering
- Find out about failures from customer complaints
- Can't meaningfully participate in QA process

**For Engineers:**
- Vague requirements leading to rework
- No clear success criteria for "good enough"
- Spend time investigating rather than fixing
- Current tools show failures but not fixes

**For Leaders:**
- 80% pilot-to-production failure rate
- Cross-functional friction between PM and Engineering
- Teams lack confidence to ship

---

## 3. Solution Overview

### The Fix Loop Philosophy
Unlike competitors that stop at dashboards, TestAgent implements the "Fix Loop":

```
┌─────────────────────────────────────────────────────────────┐
│                     THE FIX LOOP                            │
│                                                             │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────┐ │
│   │ CONNECT  │───▶│  DEFINE  │───▶│ SIMULATE │───▶│ FIX  │ │
│   │ Agent    │    │  Judges  │    │  Tests   │    │      │ │
│   └──────────┘    └──────────┘    └──────────┘    └──────┘ │
│        │                                              │     │
│        └──────────────── ITERATE ◀────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### MVP Components

| Component | Description | Key Innovation |
|-----------|-------------|----------------|
| **Connect** | HTTP endpoint integration | No SDK required, framework-agnostic |
| **Define** | Natural language judges | Plain English criteria, no code |
| **Simulate** | Multi-turn testing | Chat-style results, not trace trees |
| **Fix** | AI-suggested modifications | Diff format + one-click Jira tickets |

---

## 4. Goals & Success Metrics

### Primary Goals

| Goal | Metric | Target |
|------|--------|--------|
| Fast time-to-value | Time to first test | <25 minutes |
| PM accessibility | Tasks requiring code | 0% |
| Fix Loop effectiveness | Actionable fix suggestions | >70% |
| Evaluation accuracy | Alignment with human judgment | >90% |

### MVP Launch Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to first test | <25 minutes | Onboarding funnel analytics |
| Test execution time | <30 seconds per scenario | Performance monitoring |
| Judge accuracy | >90% alignment | Human evaluation comparison |
| Fix suggestion quality | >70% actionable | User feedback |
| System uptime | >99% | Infrastructure monitoring |

### 30-Day Post-Launch Targets

| Metric | Target |
|--------|--------|
| Beta signups | 100+ |
| Agents connected | 50+ |
| Tests executed | 1,000+ |
| Tickets generated | 100+ |
| NPS from beta users | >40 |

### Long-Term Success Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| PM visibility improvement | 70%+ report better visibility | 90 days |
| Time from failure to fix | 60% reduction | 90 days |
| Customer-found issues | 50% reduction | 90 days |
| Weekly active users | 50+ | 60 days |

---

## 5. Target Market

### Primary Segment
- **Company Size:** 50-500 employees
- **Stage:** Series A-C startups
- **Signal:** Have shipped an AI agent in last 6 months
- **Pain indicator:** PM team responsible for agent quality

### Why This Segment
- Budget exists but not locked into enterprise tools
- Faster sales cycles than enterprise
- More receptive to new approaches
- Can champion adoption without procurement overhead

### Target Personas (Summary)
1. **PM Priya** - Product Manager (Primary user)
2. **Engineer Evan** - AI/ML Engineer (Secondary user)
3. **Leader Lisa** - VP Engineering (Stakeholder)

*Detailed personas in `02_PRD_PERSONAS.md`*

---

## 6. Positioning

### Strategic Positioning Decision
**Collaboration Tool** (not PM-only tool)

> "Help PMs contribute to evaluation workflows their engineering teams already run"

### Why This Positioning
- Reduces engineering resistance/gatekeeping
- Increases adoption path (eng doesn't feel replaced)
- Still delivers PM accessibility as core value
- Addresses documented concern: "PMs don't buy AI tooling—engineering does"

### Competitive Positioning

| vs Competitor | Our Position |
|---------------|--------------|
| vs LangSmith | "TestAgent evaluates everything else—including the 40% of enterprise agents built on closed platforms" |
| vs Langfuse | "Langfuse gives you traces. TestAgent gives you fixes." |
| vs Braintrust | "Braintrust lets PMs view the UI. TestAgent lets PMs define what 'good' means." |
| vs DeepEval | "DeepEval is pytest for engineers. TestAgent is QA for product teams." |

---

## 7. Timeline & Phases

### Overall Timeline: 10 Weeks

```
Week 1-2: Foundation
├── Project setup, auth, database
├── Basic UI shell and navigation
└── Agent connection flow (Connect)

Week 3-5: Core Testing
├── Judge builder (Define)
├── Scenario builder
├── Test execution engine
└── Results display (Simulate)

Week 6-7: Fix Loop
├── Failure analysis
├── Fix suggestion engine
├── Jira integration
└── Ticket generation (Fix)

Week 8-10: Polish
├── UI polish and refinement
├── Performance optimization
├── Testing and bug fixes
├── Documentation
└── Beta launch preparation
```

### Phase 1 Deliverables (Weeks 1-2)
- [ ] User authentication (Clerk)
- [ ] Database schema (MongoDB)
- [ ] Agent connection UI and API
- [ ] Connection testing functionality
- [ ] Basic dashboard shell

### Phase 2 Deliverables (Weeks 3-5)
- [ ] Judge builder UI (natural language input)
- [ ] Judge templates library
- [ ] Scenario builder
- [ ] Test execution engine
- [ ] Chat-style results view

### Phase 3 Deliverables (Weeks 6-7)
- [ ] Failure analysis engine
- [ ] AI fix suggestion generation
- [ ] Jira OAuth integration
- [ ] One-click ticket creation
- [ ] Fix suggestion diff view

### Phase 4 Deliverables (Weeks 8-10)
- [ ] UI polish (dark theme, animations)
- [ ] Performance optimization
- [ ] End-to-end testing
- [ ] Documentation
- [ ] Beta launch

---

## 8. Constraints & Assumptions

### Constraints

| Category | Constraint |
|----------|------------|
| Timeline | 10 weeks to MVP |
| Deployment | Cloud-only (no self-hosted v1) |
| Team | Small team, limited resources |
| Budget | Pre-seed, must validate before heavy investment |
| Technical | Black-box testing limits debugging depth |

### Out of Scope (v1)

| Feature | Rationale |
|---------|-----------|
| Self-hosted deployment | Cloud-first, add later for enterprise |
| Advanced analytics | Post-MVP enhancement |
| Team collaboration features | Post-MVP enhancement |
| Integrations beyond Jira/Linear | Focus on core first |
| Real-time production monitoring | Testing focus, not observability |

### Key Assumptions

| Assumption | Risk if Wrong | Validation |
|------------|---------------|------------|
| PMs will champion despite eng gatekeeping | No adoption | Design partner interviews |
| Natural language judges achieve >90% accuracy | Core value fails | Technical prototype |
| Fix suggestions are actionable >70% | Differentiator fails | User testing |
| 25-min setup is achievable | Too much friction | Onboarding testing |

---

## 9. Risks & Mitigations

### Critical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Engineering gatekeeping | PMs can't buy | High | Position as collaboration tool |
| Incumbent feature parity | Differentiation erodes | Medium | Move fast, deepen Fix Loop |
| LLM judge inconsistency | Users don't trust | Medium | Hybrid eval, transparency |

### Technical Risks

| Risk | Mitigation |
|------|------------|
| LLM API rate limits | Queue management, retry logic |
| Jira API changes | Abstract integration layer |
| Performance at scale | Design for 100K+ tests from start |

---

## 10. Open Items

| Item | Status | Owner | Due |
|------|--------|-------|-----|
| Pricing model | Parked | Stakeholder | Post-validation |
| Specific Jira field mappings | TBD | Engineering | Week 6 |
| Judge template content | TBD | Product | Week 3 |
| Beta user recruitment | In progress | Marketing | Week 8 |

---

*Next: [02_PRD_PERSONAS.md](./02_PRD_PERSONAS.md) - Detailed user personas and journeys*
