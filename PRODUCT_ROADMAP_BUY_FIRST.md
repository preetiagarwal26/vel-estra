# AI Property Intelligence Platform — Buy-First Product Roadmap

**Version:** 1.0  
**Based on:** `AI_Property_Intelligence_Module1.pptx` + investor validation (Buy as primary pain)  
**Beachhead:** Individual and small-portfolio residential real-estate investors (1–100 properties)

---

## 1. Strategic shift

### Original wedge
Hold / Sell / Refinance for owned properties.

### Revised wedge (Buy-first)
**"Should I buy this property at this price — and why?"**

### What stays the same
- Decision layer positioning (not a property-search site)
- Explainable recommendations with confidence, drivers, and alternatives
- Deterministic models for numbers; AI for explanation
- Full lifecycle vision: BUY → HOLD → SELL → REFI → RENOVATE → INVEST

### What changes
| Dimension | Hold/Sell/Refi first | Buy-first |
|---|---|---|
| Primary user moment | Owns property | Evaluating acquisition |
| Phase 1 product | Portfolio optimizer | Deal decision analyzer |
| Data emphasis | Loan + rent + equity | Price + rent forecast + rehab + financing |
| Competitive set | Spreadsheets, lender portals | PropStream, Mashvisor, deal spreadsheets |
| MLS/listings urgency | Low | Medium (but still not Day 1) |

### Buy pain to target (recommended)
Target **deal analysis**, not deal discovery:

| Pain type | Description | MVP? |
|---|---|---|
| **Analyze deals** | "I found a property — is it a good buy?" | ✅ Yes — core MVP |
| **Price correctly** | "What's the max price that still works?" | ✅ Yes — Phase 1 |
| **Compare deals** | "Which of these 3 deals is best?" | ✅ Phase 2 |
| **Find deals** | "Show me listings in this market" | ❌ Later — needs MLS/search |

---

## 2. Product vision (Buy-first)

> Help investors make confident, explainable buy decisions by unifying property data, financial assumptions, market context, and personal investment criteria into one recommendation.

### Core user journey (MVP)
```
Find deal elsewhere → Enter address + assumptions → Run scenarios → Get BUY/PASS/NEGOTIATE → Act
```

### Recommendation types (Phase 1)
| Output | Meaning |
|---|---|
| **BUY** | Deal meets return/risk thresholds at stated price |
| **PASS** | Deal fails key thresholds; better to wait or skip |
| **NEGOTIATE** | Deal works only at a lower price; show max offer |

---

## 3. Phased roadmap

### Phase 0 — Validate Buy pain (Weeks 1–4)

**Goal:** Confirm Buy analysis is the top pain across multiple investors before full build.

**Activities**
- Interview 8–10 residential investors (1–100 properties)
- Force-rank decisions: Buy, Hold/Sell, Refi, Renovate, Capital deploy
- For Buy, split pain: Find vs. Analyze vs. Price vs. Portfolio fit
- Test clickable prototype: address in → BUY/PASS out
- Define trust bar: what explainability is required?

**Key questions**
1. How many deals do you evaluate per month?
2. What tools do you use today (PropStream, spreadsheet, agent)?
3. What makes you pass on a deal?
4. Would you trust a BUY/PASS recommendation with visible assumptions?
5. Would you pay per deal, or monthly for unlimited analysis?

**Exit criteria**
- ≥60% rank Buy (or Buy analysis) in top 2 pains
- ≥5 investors say they'd use a deal analyzer weekly/monthly
- Clear willingness-to-pay signal ($29–99/mo or $5–25/deal)

**Deliverables**
- Interview synthesis doc
- Validated persona + JTBD
- Clickable Figma/prototype
- MVP scope lock

---

### Phase 1 — Buy Decision MVP (Weeks 5–12)

**Goal:** Ship a working buy analyzer for a single property/deal.

**Features**

| Feature | Description | Priority |
|---|---|---|
| Property intake | Enter address; auto-populate attributes | P0 |
| Buy assumption form | Offer price, down payment, rate, term, rehab, rent, strategy | P0 |
| Financial models | Cap rate, cash-on-cash, DSCR, NOI, monthly cash flow | P0 |
| Scenario engine | Buy at ask / buy at target / pass | P0 |
| Max offer calculator | Highest price that still meets return threshold | P0 |
| Recommendation card | BUY / PASS / NEGOTIATE + confidence | P0 |
| Explanation panel | Key drivers, risks, assumptions, alternatives | P0 |
| Sensitivity analysis | What if rent -10%? Rate +1%? Rehab +$20K? | P1 |
| Save deal | Store analysis for later review | P1 |
| PDF/export | Share analysis with partner, agent, lender | P2 |

**Buy strategies supported (MVP)**
- Long-term rental (buy-and-hold)
- BRRRR (with simplified rehab + refi scenario)
- Fix-and-flip (simplified: purchase + rehab + ARV - hold period)

**Exit criteria**
- User completes analysis in <10 minutes
- Recommendation includes confidence + 3+ explainability drivers
- 5 pilot users analyze ≥3 deals each
- ≥70% say recommendation is "useful" or "very useful"

---

### Phase 2 — Deal pipeline + alerts (Weeks 13–20)

**Goal:** Move from one-off analysis to ongoing acquisition workflow.

**Features**

| Feature | Description |
|---|---|
| Deal pipeline | Track multiple candidate properties with status (analyzing, offer, passed, bought) |
| Deal comparison | Side-by-side rank by risk-adjusted return |
| Watchlist | Monitor saved properties for price/rent changes |
| Alerts | Price drop, deal crosses buy threshold, rent estimate shift |
| AI Buy Advisor | Conversational Q&A grounded in deal model ("What if I offer $400K?") |
| Custom criteria | Min CoC, max price, target markets, property types |
| Audit trail | Log inputs, data sources, model version, recommendation history |

**Exit criteria**
- Users return weekly during active acquisition periods
- ≥1 alert leads to real action (offer, re-analysis, pass)
- Pipeline view used by ≥50% of active users

---

### Phase 3 — Portfolio-aware investing (Weeks 21–32)

**Goal:** Connect buy decisions to existing portfolio and full lifecycle.

**Features**

| Feature | Description |
|---|---|
| Owned property profiles | Import owned assets with loan, rent, equity |
| Buy vs. portfolio | "Should I buy this OR deploy capital into existing properties?" |
| Capital deployment optimizer | Rank: buy new, pay down debt, rehab existing, hold cash |
| Hold / Sell / Refi engine | Extend to owned properties (original wedge) |
| Outcome tracking | Record what user decided; track results over time |
| Renovation ROI | Estimate rehab impact on rent and value |

**Exit criteria**
- Portfolio context changes ≥20% of buy recommendations
- Outcome data captured for ≥30% of decisions
- Platform covers Buy + at least one owned-property decision (Hold/Sell or Refi)

---

### Phase 4 — Data moat + ecosystem (Month 9+)

**Goal:** Build defensibility and expand revenue.

**Features**
- Decision → context → outcome learning loop
- Partner integrations: lenders, insurers, contractors, property managers
- Referral revenue from financing and services
- API / enterprise tier for PMs and small funds
- Optional MLS/listing feed for deal discovery (only if validated demand)
- Mobile app for deal alerts and quick analysis

**Exit criteria**
- Measurable model improvement from outcome data
- Partner referral revenue or enterprise pilot signed
- Data flywheel documented and operational

---

## 4. Data strategy (Buy-first)

### Principle
**Do not start with MLS or Zillow scraping.** Start with user-brought deals + thin external enrichment.

### Data by phase

#### Phase 0 — Validation
| Source | Cost | Use |
|---|---|---|
| Mock/sample data | Free | Prototype demos |
| Manual research | Free | Interview examples |

#### Phase 1 — MVP
| Source | Cost | Use | Required? |
|---|---|---|---|
| **User-entered assumptions** | Free | Offer, financing, rehab, rent, strategy | ✅ Required |
| **FRED API** | Free | Mortgage rate benchmarks, macro context | ✅ Required |
| **Property/rent API** (pick one) | $50–500/mo | Attributes, AVM, rent estimate, comps | ✅ Required |
| **County assessor / public records** | Free | Tax history, ownership, basic attributes | ✅ Nice to have |
| **Census / ACS** | Free | Demographics, market context | Optional |
| Zillow scraping | — | ❌ Do not use | ❌ |
| MLS direct feed | $$$$ | ❌ Not yet | ❌ |

**Recommended API (choose one to start)**
- **RentCast** — good for rent estimates, value, comps; developer-friendly
- **ATTOM** — property data, tax, deed, AVM; broader but pricier
- **HouseCanary** — strong AVM; more enterprise-oriented

#### Phase 2 — Pipeline
Add:
- Local market trends (inventory, DOM, price direction) from API
- Watchlist price monitoring (manual or API if available)
- User-uploaded listing sheets / offering memos (PDF parse later)

#### Phase 3+ — Scale
Consider:
- MLS via broker partnership (only with revenue to justify)
- Off-market / wholesaler feeds
- Renovation cost databases
- Insurance estimates
- Lender product feeds

### MVP data fields

#### Auto-populated (from API/public)
- Address, beds, baths, sq ft, lot size, year built
- Estimated value (AVM)
- Estimated rent
- Tax amount (if available)
- 3–5 comps
- Current mortgage rate benchmark

#### User-entered (required)
- Offer/purchase price
- Down payment (% or $)
- Interest rate (default from FRED; user can override)
- Loan term (30yr, 15yr, etc.)
- Closing costs estimate
- Rehab budget
- Expected monthly rent (override API estimate)
- Vacancy rate assumption
- Property management fee
- Insurance, HOA, maintenance reserves
- Hold period / strategy (rental, flip, BRRRR)
- Minimum acceptable return (CoC, cap rate, or IRR)

#### Computed (engine output)
- Monthly P&I, total payment
- NOI, cash flow (monthly and annual)
- Cap rate, cash-on-cash return
- DSCR
- Gross yield, net yield
- Max offer price at target return
- 5-year projected return (simplified)
- Recommendation + confidence + drivers

---

## 5. Technical architecture (MVP)

```
┌─────────────────────────────────────────────────────────────┐
│                        Web App (React/Next.js)              │
│  Deal intake │ Assumptions form │ Results │ Explanation     │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      API Layer (Node/Python)                │
│  Deal service │ Scenario engine │ Recommendation service    │
└──────┬─────────────────┬──────────────────┬─────────────────┘
       │                 │                  │
┌──────▼──────┐  ┌───────▼───────┐  ┌───────▼────────┐
│  PostgreSQL │  │ Scenario calc │  │ LLM explanation│
│  Deals,     │  │ (deterministic│  │ (grounded in   │
│  users,     │  │  financial    │  │  calc outputs) │
│  assumptions│  │  math)        │  │                │
└─────────────┘  └───────────────┘  └────────────────┘
       │
┌──────▼──────────────────────────────────────────────────────┐
│                    External data adapters                   │
│  RentCast/ATTOM │ FRED │ Public records (optional)          │
└─────────────────────────────────────────────────────────────┘
```

### Core design rules
1. **Calculators decide; LLM explains** — never let AI invent financial numbers
2. **Store source + timestamp** for every external data point
3. **Version recommendations** — log inputs, assumptions, model version
4. **User overrides always win** — API rent estimate is a default, not gospel

---

## 6. Six-sprint build plan (Phase 1 MVP)

**Sprint length:** 2 weeks  
**Total:** 12 weeks (Phase 1)

---

### Sprint 1 — Foundation (Weeks 5–6)

**Theme:** Project setup + deal data model

| Task | Output |
|---|---|
| Set up repo, CI, environments | Deployable skeleton |
| Design database schema (users, deals, assumptions, results) | Schema + migrations |
| Build address intake form | User can enter address |
| Integrate property API (RentCast or ATTOM) | Auto-populate property attributes |
| Integrate FRED for mortgage rates | Default rate available |

**Sprint 1 demo:** Enter address → see property details + current rate

---

### Sprint 2 — Assumptions + financial core (Weeks 7–8)

**Theme:** Buy assumption capture + core calculations

| Task | Output |
|---|---|
| Buy assumption form (price, financing, rent, expenses, rehab) | Full input capture |
| Financial calculation module | Cap rate, CoC, DSCR, NOI, cash flow |
| Unit tests for all calculations | Validated math |
| Save deal to database | Persisted deals |

**Sprint 2 demo:** Enter assumptions → see financial metrics

---

### Sprint 3 — Scenario engine (Weeks 9–10)

**Theme:** Multi-scenario comparison + recommendation logic

| Task | Output |
|---|---|
| Scenario engine: buy at ask, buy at target, pass | 3 scenarios computed |
| Max offer calculator | Target price at min return |
| Sensitivity toggles (rent ±10%, rate ±1%, rehab ±$X) | Sensitivity view |
| Recommendation rules (BUY/PASS/NEGOTIATE) | Deterministic recommendation |
| Confidence scoring (based on input completeness, variance) | Confidence % |

**Sprint 3 demo:** Full scenario comparison with recommendation

---

### Sprint 4 — Explainability + UX (Weeks 11–12)

**Theme:** Make the recommendation trustworthy and usable

| Task | Output |
|---|---|
| Explanation panel (drivers, risks, assumptions) | "Why this recommendation?" |
| LLM integration for natural-language explanation | Grounded narrative |
| Alternatives display ("If you pass, consider...") | Alternative actions |
| Results dashboard polish | Production-quality UI |
| Mobile-responsive layout | Works on phone |

**Sprint 4 demo:** End-to-end buy analysis with explanation

---

### Sprint 5 — Pilot readiness (Weeks 13–14)

**Theme:** Harden for real users

| Task | Output |
|---|---|
| Auth (signup/login) | User accounts |
| Deal history / saved deals list | Return to past analyses |
| Input validation + error handling | Robust UX |
| Data source attribution | "Rent estimate from X, as of DATE" |
| Onboarding flow + sample deal | New user can try immediately |

**Sprint 5 demo:** Pilot-ready MVP

---

### Sprint 6 — Pilot + iterate (Weeks 15–16)

**Theme:** Real investor feedback

| Task | Output |
|---|---|
| Recruit 5–10 pilot users | Active testers |
| Instrument analytics (time-to-analysis, completion rate) | Usage data |
| Collect feedback on trust, clarity, accuracy | Interview notes |
| Fix top 5 friction points | Iteration release |
| Define Phase 2 priorities from feedback | Phase 2 backlog |

**Sprint 6 demo:** Pilot results + Phase 2 plan

---

## 7. Success metrics

### Phase 0 (Validation)
| Metric | Target |
|---|---|
| Interviews completed | ≥8 |
| Buy ranked top-2 pain | ≥60% of respondents |
| Would use deal analyzer | ≥50% |
| Stated WTP | ≥$29/mo or $5/deal |

### Phase 1 (MVP)
| Metric | Target |
|---|---|
| Time to complete analysis | <10 min |
| Analysis completion rate | ≥70% |
| "Useful" or "very useful" rating | ≥70% |
| Pilot users analyzing ≥3 deals | ≥5 users |
| Explanation understood | ≥80% |

### Phase 2 (Pipeline)
| Metric | Target |
|---|---|
| Weekly active users (during acquisition) | ≥40% of registered |
| Deals saved per user | ≥3 |
| Alerts acted on | ≥10% |
| Return usage (2+ sessions/month) | ≥50% |

### Phase 3 (Portfolio)
| Metric | Target |
|---|---|
| Buy rec changed by portfolio context | ≥20% |
| Outcomes tracked | ≥30% of decisions |
| Owned-property features adopted | ≥40% of users with portfolio |

---

## 8. Pricing hypothesis (Buy-first)

| Tier | Price | Includes |
|---|---|---|
| **Free** | $0 | 2 deal analyses/month, basic metrics |
| **Investor** | $49/mo | Unlimited analyses, save/compare deals, alerts |
| **Pro** | $99/mo | Portfolio context, AI advisor, export, priority support |
| **Per-deal (alt)** | $9/deal | For low-volume users; test WTP |

Validate in Phase 0 interviews before committing.

---

## 9. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Buy pain doesn't generalize beyond 1 investor | High | Complete Phase 0 before building |
| API data inaccurate for target markets | High | Allow user overrides; show confidence + source |
| Competes head-on with PropStream | Medium | Differentiate on explainability + personalized criteria, not lead gen |
| Users want deal search, not analysis | High | Validate in interviews; defer search to Phase 4 |
| AI hallucination on financial advice | High | Deterministic calcs only; LLM explains, never calculates |
| Data licensing costs exceed revenue | Medium | Start with one API; expand on paid users |
| Trust barrier on BUY/PASS | High | Show all assumptions; offer NEGOTIATE with max price |

---

## 10. What NOT to build (yet)

| Feature | Why defer |
|---|---|
| MLS listing search | Expensive, complex, competitive; users already find deals elsewhere |
| Zillow/Redfin scraping | ToS violations, unreliable |
| Mobile native app | Web-first; mobile-responsive is enough for MVP |
| Automated offer generation | Needs trust + legal review |
| Full renovation estimator | Complex; use user-entered rehab budget for now |
| Multi-market deal scanner | Phase 4; requires scale data |
| Blockchain / NFT anything | Not in scope |

---

## 11. Roadmap timeline (visual)

```
Phase 0          Phase 1              Phase 2              Phase 3              Phase 4
Validate         Buy MVP              Deal Pipeline        Portfolio+           Moat+
Weeks 1-4        Weeks 5-16           Weeks 17-24          Weeks 25-36          Month 9+

[Interviews] --> [Buy Analyzer] --> [Compare/Alerts] --> [Own+Buy Together] --> [ML+Partners]
[Prototype]      [1 deal]           [Multi-deal]         [Capital optimizer]    [MLS optional]
                 [BUY/PASS]         [AI advisor]         [Hold/Sell/Refi]       [Enterprise]
```

---

## 12. Immediate next steps

1. **This week:** Schedule 8–10 investor interviews using Buy-focused script
2. **This week:** Force-rank pain and split "find vs. analyze vs. price"
3. **Week 2:** Build clickable prototype (address → assumptions → BUY/PASS)
4. **Week 3:** Lock MVP scope based on interview results
5. **Week 4:** Choose property API (RentCast vs. ATTOM trial); set up FRED integration
6. **Week 5:** Begin Sprint 1

---

## 13. Interview script (Buy-focused)

Use this in Phase 0 conversations:

1. How many properties do you own? How many do you evaluate per month?
2. Walk me through the last deal you analyzed. What tools did you use?
3. What made you pass or proceed?
4. Rank these by pain (1 = most painful): Buy, Hold/Sell, Refi, Renovate, Deploy capital
5. For buying: is the harder part finding deals or analyzing them?
6. What numbers do you calculate every time? (cap rate, CoC, DSCR, etc.)
7. What data is hardest to get or least reliable?
8. If a tool said BUY or PASS with explanation, what would you need to trust it?
9. Would you pay for this? Per deal or monthly? How much?
10. Show prototype. Would you use this? What's missing?

---

*Document generated from Module 1 capstone deck and Buy-first pivot discussion.*
