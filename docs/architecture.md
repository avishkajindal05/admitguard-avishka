# AdmitGuard — System Architecture
**Version:** 1.0 (Sprint 3)  
**Author:** Avishka Jindal

---

## Overview

AdmitGuard is a fully client-side, single-page application built with React + TypeScript + Tailwind CSS. It has no backend, no database, and no authentication layer — by design. The prototype is scoped for single-operator use, deployed via Google AI Studio Build Mode.

The core architectural principle: **the validation engine is completely decoupled from the UI**. Form components contain zero hardcoded validation logic. All rules are read from a central config object at runtime.

---

## System Layers

```
┌─────────────────────────────────────────────────────┐
│                 PRESENTATION LAYER                  │
│  React components — form, audit log, dashboard      │
│  Tailwind CSS — utility-first styling               │
│  React Context — shared app state                   │
└──────────────────┬──────────────────────────────────┘
                   │ reads rules from
┌──────────────────▼──────────────────────────────────┐
│               VALIDATION ENGINE                     │
│  /app/src/utils/validationEngine.ts                 │
│  validateField(fieldName, value, formData, rules)   │
│  validateRationale(rationale, rule)                 │
│  Returns: { error, warning, isValid, canOverride }  │
└──────────────────┬──────────────────────────────────┘
                   │ reads config from
┌──────────────────▼──────────────────────────────────┐
│                RULES CONFIG                         │
│  /app/src/config/rules.ts                           │
│  rulesConfig: { rules: ValidationRule[] }           │
│  One object per field — type, tokens, messages      │
│  Change a rule here → form behavior updates         │
│  No UI code changes required                        │
└──────────────────┬──────────────────────────────────┘
                   │ persists to
┌──────────────────▼──────────────────────────────────┐
│               PERSISTENCE LAYER                     │
│  localStorage key: "admitguard_audit_log"           │
│  /app/src/utils/auditStorage.ts                     │
│  loadAuditLog() / saveAuditEntry() / clearAuditLog()│
│  JSON serialized, survives page refresh             │
└──────────────────┬──────────────────────────────────┘
                   │ feeds into
┌──────────────────▼──────────────────────────────────┐
│               ANALYTICS LAYER                       │
│  Dashboard metrics computed from submissions[]      │
│  totalSubmissions, totalExceptions,                 │
│  exceptionRate, flaggedEntries                      │
│  Computed in AppContext — no separate store         │
└─────────────────────────────────────────────────────┘
```

---

## Data Flow — Form Submission

```
User types in field
        │
        ▼
handleFieldChange(field, value)
        │
        ▼
validateField(field, value, formData, rulesConfig.rules)
        │
        ├── Strict rule fails → errors[field] = errorMessage
        │                    → submit button disabled
        │
        └── Soft rule fails  → softWarnings[field] = warningMessage
                             → "Request Exception" checkbox appears
                             │
                             └── Operator checks box
                                         │
                                         ▼
                             exceptionStates[field].enabled = true
                             rationale textarea appears
                                         │
                             Operator types rationale
                                         │
                             validateRationale(rationale, rule)
                             checks: length ≥ 30 AND keyword present
                                         │
                                    ✅ Valid rationale
                                         │
                                         ▼
                             isFormValid = true → Submit enabled
                                         │
                             User clicks Submit
                                         │
                                         ▼
                             ConfirmationModal opens
                             (shows all fields + exceptions + flagged status)
                                         │
                             User clicks Confirm
                                         │
                                         ▼
                             Submission object created:
                             { id, timestamp, candidateData,
                               exceptionCount, exceptions[], flagged }
                                         │
                             addSubmission() → AppContext state
                                           → localStorage persisted
                                         │
                             SuccessScreen shown
```

---

## Validation Rule Types

### Strict Rules
- Hard block — form cannot be submitted if violated
- No override possible
- Shown as red inline error below field
- Fields: Full Name, Email, Phone, Highest Qualification, Interview Status, Aadhaar Number, Offer Letter Sent

### Soft Rules
- Block submission by default
- Operator can toggle "Request Exception"
- Requires rationale: ≥ 30 chars + one of: `"approved by"`, `"special case"`, `"documentation pending"`, `"waiver granted"`
- Shown as amber inline warning
- Fields: Date of Birth, Graduation Year, Percentage/CGPA, Screening Score

### System Rules
- Computed automatically — not operator-controlled
- If active exceptions > 2 → entry flagged for manager review
- Submission still allowed — `flagged: true` written to audit log

---

## Rule Config Schema

Each rule in `/app/src/config/rules.ts` follows this TypeScript interface:

```typescript
interface ValidationRule {
  field: keyof CandidateData;
  type: 'strict' | 'soft';
  validation: string[];        // array of token strings
  errorMessage?: string;       // for strict rules
  warningMessage?: string;     // for soft rules
  exceptionAllowed?: boolean;
  rationaleMinLength?: number; // default 30
  rationaleKeywords?: string[];
}
```

Validation tokens supported by the engine:

| Token | Meaning |
|-------|---------|
| `required` | Field cannot be empty |
| `minLength:N` | String minimum N characters |
| `noNumbers` | No digit characters allowed |
| `email` | Valid email format regex |
| `phone:india` | 10 digits, starts with 6-9 |
| `aadhaar:12digits` | Exactly 12 numeric digits |
| `ageRange:18-35` | Age calculated from DOB |
| `range:2015-2025` | Numeric range inclusive |
| `minValue:60` | Minimum numeric value |
| `scoreMin:40` | Minimum score value |
| `allowedIfYes:field=Val1\|Val2` | Cross-field dependency |
| `modeAware:modeField=mode1:token\|mode2:token` | Mode-conditional validation |

---

## Component Tree

```
App.tsx
├── AppProvider (AppContext.tsx)
│   └── AppContent
│       ├── Sidebar.tsx          — navigation (Admission Form / Audit Log / Dashboard)
│       ├── Header.tsx           — search bar, dark mode toggle, user info
│       └── main
│           ├── AdmissionForm.tsx (default view)
│           │   ├── Card.tsx
│           │   ├── FormField.tsx        — renders each field with validation UI
│           │   ├── ExceptionCounter.tsx — "Active Exceptions: X/4"
│           │   ├── ConfirmationModal.tsx
│           │   └── SuccessScreen.tsx
│           ├── AuditLog.tsx
│           │   └── Card.tsx
│           └── Dashboard.tsx
│               └── Card.tsx (×4 stat cards + chart cards)
```

---

## File Structure

```
app/src/
├── App.tsx                    — root layout, view router
├── main.tsx                   — React entry point
├── types.ts                   — TypeScript interfaces (CandidateData, Submission, etc.)
├── constants.ts               — FIELD_CONFIG, QUALIFICATIONS, INTERVIEW_STATUSES
├── index.css                  — Tailwind import + CSS custom properties (color tokens)
├── config/
│   └── rules.ts               — ALL validation rules (the only file ops team edits)
├── context/
│   └── AppContext.tsx         — global state: currentView, submissions, metrics
├── utils/
│   ├── validationEngine.ts    — validateField(), validateRationale()
│   └── auditStorage.ts        — localStorage helpers
├── components/
│   ├── Card.tsx
│   ├── FormField.tsx
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── ExceptionCounter.tsx
│   ├── ConfirmationModal.tsx
│   └── SuccessScreen.tsx
└── views/
    ├── AdmissionForm.tsx
    ├── AuditLog.tsx
    └── Dashboard.tsx
```

---

## Key Design Decisions

**Why config-driven validation, not hardcoded?**
Operations teams need to update rules between cohorts (e.g., change age range from 18–35 to 18–40 for a new program). With hardcoded logic, that's a developer task. With `rules.ts`, it's a single value change that any technically literate person can make.

**Why localStorage, not a database?**
Zero infrastructure cost, zero deployment complexity for a prototype. The tradeoff: data is per-browser and not shared across multiple ops staff. Production would replace this with a shared database (Supabase, Firebase, or a Google Sheet via Apps Script).

**Why TypeScript config over JSON?**
`rules.ts` gives compile-time type checking — if a field name in a rule doesn't match `keyof CandidateData`, TypeScript catches it before runtime. A raw `.json` file has no such safety net. The tradeoff is that non-technical ops staff can't edit it without a code editor. Acknowledged as a prototype limitation.

**Why React Context, not Redux?**
The app state is shallow — current view, submissions array, computed metrics. Redux overhead is not justified. Context with `useState` is sufficient and keeps the codebase readable without additional dependencies.

---

## Known Limitations (Prototype Scope)

| Limitation | Production Fix |
|-----------|----------------|
| localStorage — per-browser, not shared | Replace with Supabase / Firebase / Google Sheets API |
| No authentication | Add Vercel Basic Auth or SSO (Google Workspace) |
| Aadhaar stored unencrypted | Mask to last 4 digits after save; encrypt with Web Crypto API |
| `rules.ts` requires code editor to update | Build a rule editor UI or migrate to a database-backed rules table |
| Single-user | Multi-user requires shared state + conflict resolution |
| Dark mode | Tailwind v4 dark mode requires additional config — deferred to v2 |
