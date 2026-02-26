# AdmitGuard

> A rule-driven candidate admission validation system for education enrollment pipelines.

---

## Problem Statement

The current admission pipeline processes hundreds of candidates across IIT/IIM programs using Excel and Google Sheets — with **no validation, no rule enforcement, and no audit trail**.

This leads to:
- Ineligible candidates slipping through early stages
- Exceptions that go undocumented and untracked
- Errors surfacing only during final document verification
- Institutional compliance risk and operational waste

**The core failure:** Validation happens at the point of damage, not at the point of entry.

AdmitGuard fixes this.

---

## Proposed Approach

AdmitGuard is a **rules engine disguised as a form** — a lightweight, client-side, config-driven admissions tool that:

1. **Enforces strict eligibility rules** at the moment of data entry (hard blocks — no exceptions)
2. **Flags soft rule violations** and requires structured rationale before allowing submission
3. **Manages exceptions** via a toggleable override system with counters and audit capture
4. **Persists an audit log** across sessions using `localStorage`
5. **Surfaces summary metrics** via a real-time dashboard

The system is fully client-side. No backend. No auth. Fast to deploy via Google AI Studio Build Mode.

**Architecture Layers:**
- Presentation Layer — React + Tailwind CSS
- Validation Engine — Config-driven, reads from `/config/rules.json`
- Persistence Layer — `localStorage`
- Analytics Layer — Dashboard metrics computed from audit log

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | React (via Google AI Studio Build Mode) | Declarative UI, easy conditional rendering for validation states |
| Language | TypeScript (ES6+) | Type safety for rule engine, prevents silent state bugs |
| Styling | Tailwind CSS | Utility-first, fast iteration, consistent spacing, no Bootstrap bloat |
| State Management | React Context API + Local State | App scope is contained; no Redux needed |
| Validation Engine | Custom (Config-Driven) | Rules live in `rules.json`, modifiable without code changes |
| Persistence | `localStorage` | Zero backend, audit log survives page refresh |
| Deployment | Google AI Studio Build Mode | Target deployment environment |

---

## Form Fields

| Field | Type | Rule Type |
|---|---|---|
| Full Name | Text | Strict |
| Email | Text | Strict |
| Phone | Text (10 digits) | Strict |
| Date of Birth | Date Picker | Soft |
| Highest Qualification | Dropdown | Strict |
| Graduation Year | Number (2015–2025) | Soft |
| Percentage / CGPA | Number + Toggle | Soft |
| Screening Test Score | Number (0–100) | Soft |
| Interview Status | Dropdown | Strict |
| Aadhaar Number | Text (12 digits) | Strict |
| Offer Letter Sent | Toggle (Yes/No) | Strict (conditional) |

---

## App Views

- **Admission Form** — Primary data entry view (default)
- **Audit Log** — Timestamped record of all submissions and exceptions
- **Dashboard** — Aggregated metrics (total submissions, exceptions, rejection rate)

---

## Repository Structure

```
admitguard-avishka/
├── README.md
├── research-notes.md
├── prompts/
│   └── prompt-sequence.md
├── wireframes/
│   └── napkin.pdf
├── config/
│   └── rules.json          # All validation rules live here
├── src/
│   ├── components/
│   │   ├── AdmissionForm/
│   │   ├── AuditLog/
│   │   └── Dashboard/
│   ├── engine/
│   │   └── validator.ts    # Core validation logic
│   ├── context/
│   │   └── AppContext.tsx
│   └── App.tsx
└── public/
```

---

## Sprint 0 Checklist

- [x] GitHub repo created: `admitguard-avishka`
- [x] README.md written
- [x] Wireframe sketched (`wireframes/napkin.pdf`)
- [x] Google AI Studio Build Mode researched
- [x] 2+ articles on vibe coding / prompt engineering read (see `research-notes.md`)
- [x] First 3 prompts drafted (`prompts/prompt-sequence.md`)
- [x] Must-Have requirements prioritized

---

## Must-Have Priority (Sprint 1 Focus)

1. Form structure — all 11 fields rendered correctly
2. Strict validation — all 7 strict rules enforced inline
3. Interview Status = Rejected → hard block + red banner
4. Offer Letter dependency on Interview Status
5. Submit button state gate (disabled until all strict fields valid)
6. Exception toggle UI for soft fields
7. Audit log persistence via `localStorage`
