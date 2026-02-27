<div align="center">
  <img width="1200" height="475" alt="AdmitGuard Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
  <h1>AdmitGuard</h1>
  <p><strong>A rule-driven candidate admission validation and compliance system for education enrollment pipelines.</strong></p>
  <p>
    <a href="https://ai.studio/apps/002783f5-50e0-4451-a8ea-ef7190eaca38">🚀 Live App (AI Studio)</a> · 
    <a href="./prompts/">Prompt Log</a> · 
    <a href="./research-notes.md">Research Notes</a> · 
    <a href="./sprint-log.md">Sprint Log</a>
  </p>
</div>

---

## The Problem

Futurense Technologies processes hundreds of candidates per cohort for IIT/IIM programs using Excel and Google Sheets — with **zero validation, zero rule enforcement, and zero audit trail**.

This causes:
- Ineligible candidates advancing to interview stages they should never reach
- Exceptions that go undocumented — no rationale, no paper trail
- Errors only caught at final document verification, after wasting counselor time, panel time, and candidate expectations
- Institutional compliance risk with partner institutions
- Rules that change between cohorts with no structured way to update them

**The core failure:** Validation happens at the point of damage, not the point of entry.

---

## The Solution

AdmitGuard is a **rules engine disguised as a form** — a lightweight, config-driven admissions tool that:

1. **Enforces strict eligibility rules** at the moment of data entry — hard blocks, no exceptions
2. **Flags soft rule violations** with amber warnings and requires structured rationale before allowing submission
3. **Manages exceptions** via a toggleable override system with counters, audit capture, and manager-review flagging
4. **Persists an immutable audit log** across sessions using `localStorage`
5. **Surfaces summary metrics** via a real-time dashboard

Fully client-side. No backend. No auth required. Deployed via Google AI Studio Build Mode.

---

## Live App

> 🔗 [View on AI Studio](https://ai.studio/apps/002783f5-50e0-4451-a8ea-ef7190eaca38)

To run locally:

```bash
cd app
npm install
# Add your GEMINI_API_KEY to app/.env.local
npm run dev
# Opens at http://localhost:3000
```

**Prerequisites:** Node.js (v18+)

---

## Architecture

```
User Input
    ↓
Presentation Layer (React + Tailwind CSS)
    ↓
Validation Engine — reads from /config/rules.ts
    ├── Strict rules   → Hard block, inline red error
    └── Soft rules     → Amber warning → Exception toggle → Rationale validation
    ↓
Submission Gate (isFormValid computed selector)
    ↓
Persistence Layer (localStorage)
    ↓
Analytics Layer (Dashboard — metrics from audit log)
```

**Key design decision:** The validation engine (`app/src/utils/validationEngine.ts`) reads rules from a central config (`app/src/config/rules.ts`) — the form components contain zero hardcoded validation logic. Updating a rule means editing one config object, not touching UI code.

---

## Form Fields & Rules

| # | Field | Type | Rule Type | Exception Allowed |
|---|-------|------|-----------|-------------------|
| 1 | Full Name | Text | Strict | No |
| 2 | Email | Text | Strict | No |
| 3 | Phone | Text (10 digits) | Strict | No |
| 4 | Date of Birth | Date Picker | Soft | Yes — with rationale |
| 5 | Highest Qualification | Dropdown | Strict | No |
| 6 | Graduation Year | Number (2015–2025) | Soft | Yes — with rationale |
| 7 | Percentage / CGPA | Number + Mode Toggle | Soft | Yes — with rationale |
| 8 | Screening Test Score | Number (0–100) | Soft | Yes — with rationale |
| 9 | Interview Status | Dropdown | Strict | No |
| 10 | Aadhaar Number | Text (12 digits) | Strict | No |
| 11 | Offer Letter Sent | Toggle (Yes/No) | Strict (conditional) | No |
| — | Exception Count | System computed | System | N/A — auto-flagged if > 2 |

---

## App Views

| View | Description |
|------|-------------|
| **Admission Form** | Primary data entry view with real-time validation |
| **Audit Log** | Timestamped, immutable record of all submissions and exceptions |
| **Dashboard** | Aggregated metrics: total submissions, exception rate, flagged entries |

---

## Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | React 19 + TypeScript | Declarative UI, type-safe rule engine |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration, no Bootstrap |
| State | React Context API + `useState` | Contained scope — no Redux needed |
| Validation | Custom config-driven engine | Rules in config, not in UI |
| Persistence | `localStorage` | Zero backend, survives page refresh |
| Build Tool | Vite | Fast HMR, modern bundler |
| AI Build Tool | Google AI Studio (Gemini) | Primary vibe coding environment |

---

## Repository Structure

```
admitguard-avishka/
├── README.md                   ← You are here (project overview)
├── research-notes.md           ← Sprint 0 research: sources, learnings, decisions
├── sprint-log.md               ← Sprint-by-sprint build log
├── prompts/                    ← All 8 prompts used to build the app
│   ├── prompt-01-foundation.md
│   ├── prompt-02-strict.md
│   ├── prompt-03-edge-cases.md
│   ├── prompt-04-soft-rules.md
│   ├── prompt-05-exceptions.md
│   ├── prompt-06-config.md
│   ├── prompt-07-audit.md
│   ├── prompt-08-polish.md
│   └── prompt-sequence.md
├── wireframes/
│   └── napkin.pdf              ← Initial hand-drawn wireframe (Sprint 0)
├── config/                     ← Placeholder (rules live inside app/src/config/)
├── docs/
│   ├── architecture.md         ← System design and data flow
│   └── presentation.pdf        ← Solution proposal deck (Day 6)
└── app/                        ← Application source (exported from AI Studio)
    ├── src/
    │   ├── components/         ← Card, FormField, Header, Sidebar, etc.
    │   ├── config/
    │   │   └── rules.ts        ← ALL validation rules live here
    │   ├── context/
    │   │   └── AppContext.tsx
    │   ├── utils/
    │   │   ├── validationEngine.ts
    │   │   └── auditStorage.ts
    │   ├── views/
    │   │   ├── AdmissionForm.tsx
    │   │   ├── AuditLog.tsx
    │   │   └── Dashboard.tsx
    │   ├── App.tsx
    │   ├── types.ts
    │   └── constants.ts
    ├── package.json
    └── vite.config.ts
```

---

## Validation System Design

### Strict Rules — Zero Tolerance
Violations block submission entirely. No override possible. Shown as red inline errors.

### Soft Rules — Override with Justification
Violations show an amber warning. The operator can toggle **"Request Exception"** and provide a written rationale. Rationale must be:
- ≥ 30 characters
- Contains at least one of: `"approved by"`, `"special case"`, `"documentation pending"`, `"waiver granted"`

### System Rule — Auto-Flagging
If a single candidate submission has **more than 2 active exceptions**, the entry is automatically flagged for manager review. Submission is still allowed — the entry is marked `flagged: true` in the audit log.

---

## Rubric Alignment

| Dimension | Weight | Status |
|-----------|--------|--------|
| Functional Completeness (All 8 Must Haves) | 25% | ✅ Complete |
| Prompt Engineering Quality | 20% | ✅ 8 structured prompts documented |
| Presentation & Business Thinking | 25% | 🔲 In progress |
| Self-Directed Research | 15% | ✅ See `research-notes.md` |
| GitHub & Process Discipline | 15% | ✅ 15 commits, sprint log, clean structure |
