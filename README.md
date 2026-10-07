# EstimateAI — Explainable Software Project Cost Estimation & Decision-Support Platform

EstimateAI is an explainable software project estimation, team-sizing, and decision-support platform built with a **deterministic-first engineering architecture**.

---

## 1. Product Architectural Layers

EstimateAI is structured into three clean, decoupled layers:

1. **AI Understanding & Decision Assistant (Phase 8 — Active & Integrated)**
   - Interprets natural-language software requirements and specifications (PRDs, user stories).
   - Extracts structured features, categories, and 7 technical complexity factors (clamped strictly [0, 5]).
   - Recommends missing features with deduplication against existing project scope.
   - Provides executive estimate explanations referencing actual calculated numbers.
   - **Guaranteed Resilient Fallback**: 100% functional offline heuristic NLP engine if AI is disabled or network fails.
   - *Strict Boundary: AI never computes pricing, rates, contingency, team sizing, or timelines.*

2. **Engineering Estimation Engine (Phases 1–4 — Active & Authoritative)**
   - **Strictly Deterministic**: No random numbers, no external LLM dependencies for price determination.
   - Three-point **PERT Estimation** for every work item ($O, M, P, E, \sigma$).
   - Base effort distributed across all project roles (**Development**, **UI/UX**, **QA**, **Project Management**, and **DevOps**).
   - **Zero Cost Double-Counting**: $\text{BuildCost} = \sum \text{RoleCost}$, where $\text{RoleCost} = \text{AllocatedHours} \times \text{HourlyRate}$. Feature costs are direct proportional shares ($\sum \text{FeatureCost} \equiv \text{BuildCost}$).
   - **Cost Isolation**: Monthly cloud infrastructure and optional annual maintenance are strictly separated from one-time build cost.
   - **Client-Side Platform Multiplier**: Applied strictly to client-side UI/UX engineering; backend microservices remain unified ($1.0\times$).
   - **Critical Path Analysis**: DFS directed acyclic graph (DAG) dependency analysis with circular dependency detection.
   - **Deterministic Confidence Model**: Realistically bounded score (52%–88%, never 100%) driven by measurable architectural parameters.

3. **Decision Support & Governance (Phases 5–7 — Active)**
   - **Results Dashboard**: Executive KPI cards, transparent role cost breakdown, Gantt timeline, and risk drivers.
   - **Explainability**: Reusable `<ExplainButton />` and `<ExplanationPanel />` providing mathematical step-by-step reasoning for every KPI.
   - **What-If Scenario Simulation**: Real-time simulation of timeline compression and platform scope using the real deterministic engine (zero arbitrary multipliers).
   - **Side-by-Side Version Comparison**: Computes exact delta metrics (Cost $\pm$₹, Effort $\pm$h, Timeline $\pm$w, Team $\pm$FTE, Risk) and feature scope diffs (added/removed/retained).
   - **Immutable Version History**: Every saved estimate is an immutable snapshot ($v1, v2, v3$) preserving complete input and output payloads with Engine/Config/Rate versions.

---

## 2. AI Intelligence Architecture & Environment Configuration

EstimateAI uses a **dual-engine architecture**:
```
User Natural Language Input / PRD
             │
      ┌──────┴──────────────────────────┐
      ▼                                 ▼
Live Google Gemini API          Fallback Heuristic NLP
(GEMINI_API_KEY / AI_API_KEY)   (Offline, deterministic regex/NLP)
      │                                 │
      └──────────────┬──────────────────┘
                     ▼
         Strict Schema Validation
  (Clamps: factors ∈ [0,5], confidence ∈ [0,1])
                     │
                     ▼
         Structured Feature Catalog
                     │
                     ▼
   DETERMINISTIC ESTIMATION ENGINE
   (SOLE authority for Cost, Effort, Timeline)
```

### Environment Variables
Configure the following in `.env` or system environment:

| Variable | Default | Description |
|---|---|---|
| `AI_PROVIDER` | `gemini` (or `fallback`) | Target provider: `gemini` or `fallback` |
| `AI_API_KEY` | *(empty)* | Google Gemini API key (or `GEMINI_API_KEY`) |
| `AI_MODEL` | `gemini-1.5-flash` | Gemini model name |
| `AI_ENABLED` | `true` | Enable/disable AI assistant features |
| `AI_TIMEOUT_SECONDS`| `30` | Request timeout before falling back |
| `AI_MAX_TOKENS` | `2048` | Maximum token response limit |

> [!NOTE]
> If no API key is set, the application automatically and gracefully operates using the built-in **FallbackNLPProvider** with zero user disruption or console crashes.

---

## 3. Mathematical Estimation Formulas

### A. Three-Point PERT Work-Item Effort
For each feature:
$$\text{Expected Effort } (E) = \frac{O + 4M + P}{6}$$
$$\text{Standard Deviation } (\sigma) = \frac{P - O}{6}$$
$$\text{Project Variance } (\sigma_{\text{project}}) = \sqrt{\sum \sigma_i^2} \times 1.10 \quad (\text{correlation factor})$$
$$\text{Effort Uncertainty Range} = [E - \sigma_{\text{project}}, E + \sigma_{\text{project}}]$$

### B. Role-Wise Build Cost (No Double Counting)
$$\text{RoleCost}_r = \text{AllocatedHours}_r \times \text{HourlyRate}_r$$
$$\text{TotalBuildCost} = \sum_{r} \text{RoleCost}_r$$
$$\text{FeatureCost}_i = \text{TotalBuildCost} \times \left( \frac{\text{FeatureEffort}_i}{\sum \text{FeatureEffort}} \right)$$

### C. Schedule Feasibility
$$\text{EffectiveWeeklyCapacity} = \text{TeamSize} \times 40\text{h} \times 0.75 \quad (\text{75\% parallel efficiency})$$
$$\text{EstimatedWeeks} = \max\left( \text{CriticalPathWeeks}, \frac{\text{TotalEffortHours}}{\text{EffectiveWeeklyCapacity}} \right) + \text{Buffers}$$
- **Feasible**: Requested Timeline $\ge$ Estimated Timeline
- **Tight**: Requested Timeline is within 85%–99% of Estimated Duration
- **Infeasible**: Requested Timeline is shorter than the Critical Path minimum

---

## 4. Centralized Versioning & Calibration Standards

Every calculation snapshot records and locks:
- **Estimation Engine Version**: `v1.0.0`
- **Configuration Version**: `v1.0.0`
- **Rate Table Version**: `v1.0.0` (`India / Mid-Level IT Standards`)
- **Productive Capacity**: 6 productive hours/day (distinguished from 75% team efficiency)

---

## 5. Running the Application Locally & in Docker

### Prerequisites
- Node.js 18+ (tested with Node 20 / 22)
- npm 9+
- Docker & Docker Compose (optional for containerized deployment)

### Local Development Commands
```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional - defaults to 100% resilient offline fallback)
cp .env.example .env

# 3. Start Development Server with Backend Middleware (Port 3000)
npm run dev

# 4. Run Automated Test Suites (All 248 Tests Green)
node scripts/testPhase9.js   # Production Hardening, Security, Auth, Isolation (53 tests)
node scripts/testPhase8.js   # AI Integration, NLP Schema & Clamping (36 tests)
node scripts/testPhase7.js   # Master Stability, Invariants & Zero Drift (44 tests)
node scripts/testPhase6.js   # Persistence, Versioning & Immutability (61 tests)
node scripts/testPhase4.js   # Core PERT & Deterministic Math Engine (54 tests)

# 5. Build Production Bundle
npm run build
```

### Docker Production Deployment
```bash
# Build and run production container image
docker compose up --build

# Verify container health check
curl http://localhost:3000/api/health
```

---

## 6. Recommended Demo Script & Evaluation Walkthrough

Follow this 10-step sequence for hackathon demonstrations or product evaluations:

1. **Authentication & Session**:
   - Open `http://localhost:3000/` and click **"Start Estimating Now"** or **Sign In**.
   - On `/login`, click **"Demo Quick Login"** (`karthik@estimateai.io` / `Demo@1234`) or register a new user.
2. **Dashboard Overview**:
   - View `/dashboard` showing real aggregate portfolio statistics, recent projects, and active operational modules.
3. **Interactive Scope Creation**:
   - Navigate to `/new-estimate`. Enter project title (e.g. *"Food Delivery Platform"*), select platform (*Web + iOS + Android*), and enter timeline (*14 weeks*).
4. **AI Assisted & Manual Feature Scope**:
   - Use the AI assistant or load standard features (*User Authentication, Menu Discovery, Cart, Real-Time Order Tracking, Stripe Payment Gateway*).
   - Click **[Suggest Complexity]** on Payment feature: observe that security and integration complexities are elevated with clear explanations.
   - Click **[What Might I Be Missing?]**: view deduplicated recommendations (*Audit Logging, Push Notifications*).
5. **Deterministic Calculation**:
   - Click **[Calculate Estimate]**: within milliseconds, the mathematical engine computes 3-point PERT effort, multidisciplinary team allocation, and build cost.
6. **Results Dashboard & Zero Double Counting**:
   - View Executive KPIs: Total Cost, Timeline Feasibility, Team Size, Confidence, and Risk Score.
   - Expand **Role Allocation Breakdown**: verify that $\sum \text{RoleCost} \equiv \text{TotalBuildCost}$ and $\sum \text{FeatureCost} \equiv \text{TotalBuildCost}$ with zero rupee drift.
   - Expand **Critical Path & Gantt Schedule**: observe DAG dependency chains and bottlenecks.
7. **AI Executive Explanation**:
   - Click **"✨ AI Insights"** or **[Explain Estimate]**: review plain-English narrative referencing exact calculated numbers (₹ cost, effort hours, weeks, FTE).
8. **What-If Scenario Simulation**:
   - Open **What-If Scenarios**: compress timeline from 14 weeks to 8 weeks.
   - Observe schedule feasibility transition from *Feasible* to *Tight/Infeasible* with increased staffing velocity required.
9. **Save & Immutable Version History**:
   - Click **[Save as New Version]** with notes *"Added Real-Time Tracking"*: creates immutable snapshot $v2$.
   - Open **[Version History]**: select $v1$ and $v2$ to trigger side-by-side comparison showing exact deltas ($\pm₹$, $\pm\text{hours}$, $\pm\text{weeks}$, added/removed features).
10. **Portfolio Analytics & Settings**:
    - Navigate to `/analytics` to see cross-project portfolio metrics and risk distributions.
    - Navigate to `/settings` to inspect locked engine standards (`v1.0.0`), regional currency, and AI provider toggle.

---

## 7. System Architecture & Boundaries

```text
                      User Natural Language Input / PRD
                                     │
                                     ▼
                     Vite Middleware / Backend Proxy
                     (/api/ai/*, /api/health, /health)
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
       Google Gemini 1.5 Flash              Smart Heuristic NLP
       (Live Cloud Provider)                (Deterministic Offline Fallback)
                 │                                       │
                 └───────────────────┬───────────────────┘
                                     ▼
                         Strict Schema Normalization
                         • Clamped factors: [0, 5]
                         • Clamped confidence: [0, 1]
                         • Scope deduplication
                                     │
                                     ▼
                         Structured Feature Roster
                                     │
                                     ▼
                ┌─────────────────────────────────────────┐
                │   DETERMINISTIC ESTIMATION ENGINE       │
                │   • 3-Point PERT Effort Calculation     │
                │   • Role Workload & Hourly Allocations  │
                │   • Zero Cost Double Counting Basis     │
                │   • DAG Critical Path Schedule          │
                │   • Realistically Bounded Confidence    │
                └────────────────────┬────────────────────┘
                                     │
                                     ▼
                        Executive Results Dashboard
                         + Explainability Panels
                         + Immutable Snapshots (v1, v2)
                         + Side-by-Side Compare
```

> **Strict Product Principle**: AI enhances requirement understanding and provides narrative explanations; the deterministic engineering engine remains the sole financial authority for pricing, effort hours, team sizing, and delivery schedules.

---

## 8. Honest System Limitations

EstimateAI maintains strict transparency regarding what it does and does not do:
- **Planning Estimates, Not Binding Guarantees**: Estimates represent planning benchmarks calculated with three-point PERT probabilistic modeling. Actual project outcomes depend on vendor execution, team skill, and requirement volatility.
- **Input Quality Sensitivity**: The precision of calculations depends directly on the completeness of work-item feature definitions and selected complexity factors.
- **Rate Presets**: Default rate cards reflect standard Indian IT mid-tier engineering benchmarks ($v1.0.0$). Users should adjust role rates in custom settings for specialized offshore or onshore contractors.
- **No Statistical Dataset Calibration**: In this release, estimates are derived from structural engineering principles and PERT formulas; ISBSG empirical calibration datasets are scheduled for future enhancements.

---

## 9. Development Roadmap Status

- [x] **Phase 1**: Project Foundation & Design System
- [x] **Phase 2**: Project Creation & Feature Input System
- [x] **Phase 3**: Core Deterministic Estimation Engine
- [x] **Phase 4**: Results Dashboard & Explainability Modals
- [x] **Phase 5**: What-If Scenarios & Version Comparison
- [x] **Phase 6**: Persistence, My Projects & Immutable Version History ($v1, v2, v3$)
- [x] **Phase 7**: Comprehensive Testing, Validation, Security, UX Polish & Stabilization
- [x] **Phase 8**: AI Integration & Intelligent Estimation Layer
- [x] **Phase 9**: Production Hardening, Security, Deployment & Final Demo Readiness (Active & Verified)
- [ ] **Phase 10**: Cloud Production Staging & Hackathon Presentation (*Final Stage*)
