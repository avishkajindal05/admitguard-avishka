# Sprint Log — AdmitGuard
**Project:** AdmitGuard — Admission Data Validation & Compliance System
**Author:** Avishka Jindal
**Repo:** https://github.com/avishkajindal05/admitguard-avishka

---

## Sprint 0 
- **Goal:** Understand the problem, plan approach, set up repo, research tools
- **Done:**
  - GitHub repo created: `admitguard-avishka`
  - README.md written with problem statement, approach, and tech stack
  - Wireframe sketched by hand (`wireframes/napkin.pdf`) — mapped all 11 fields, 3-zone layout, strict/soft flow
  - Researched Google AI Studio Build Mode documentation end-to-end
  - Read 4+ articles on vibe coding and prompt engineering (see `research-notes.md`)
  - Drafted first 3 prompts on paper before running anything
  - Identified Must-Have priority order for Sprint 1
- **Research Sources:**
  - Google AI Studio Build Mode Docs
  - Google Codelab: Vibe Code with Gemini
  - Taming Vibe Coding (Google Cloud blog)
  - Dev.to: Ultimate Prompt Strategy
  - LogRocket: Inline vs After-Submission Validation
- **Blockers:** None — deliberate planning phase, no tool access yet
- **Key Decision:** Single-page form over multi-step wizard — simpler to validate, faster to demo, all fields visible at once for the operator
- **Prompts Drafted:** 3 on paper (foundation, strict rules, edge cases) — not run yet
- **AI Evaluation:** N/A — no code generated this sprint
- **Commits:** `Sprint 0: Initializing repo structure`, `Sprint 0: README and Sprintlog update`

---

## Sprint 1 
- **Goal:** Working form with all 11 fields and strict validation by end of Thursday
- **Done:**
  - Prompt 1 (Foundation): Full form structure generated — all 11 fields, 3-zone layout (sidebar + header + main card), progress indicator, reserved validation message areas, confirmation modal shell, success screen shell, audit log and dashboard navigation shells
  - Prompt 2 (Strict Validation): All 7 strict rules implemented inline — name (noNumbers, minLength), email (format), phone (10 digits, starts 6-9), qualification (required), interview status (rejected = hard block + red banner), Aadhaar (12 digits), offer letter (dependency on interview status)
  - Prompt 3 (Edge Cases): Tested all 14 edge case scenarios from the brief — fixed phone validation (was accepting letters), fixed offer letter dependency logic (wasn't resetting when status changed), fixed Aadhaar regex (was accepting spaces)
- **Blockers:**
  - AI Studio generated phone validation that accepted non-numeric characters — fixed via Prompt 3 with explicit regex constraint
  - Offer letter dependency was one-directional (only checked on toggle, not when interview status changed) — fixed with cross-field re-validation trigger
- **Key Decision:** Used `onChange` + `onBlur` for validation triggers instead of submit-only — brief specifically required real-time inline errors
- **Prompts Used:** Prompt 1, 2, 3
- **AI Evaluation:**
  - Prompt 1: ~80% correct structure. Had to refine: progress indicator was too prominent, modal layout needed width constraint
  - Prompt 2: Strict rules implemented correctly. Edge: offer letter dependency logic was stateful but not cross-validated
  - Prompt 3: AI correctly identified 11/14 scenarios as passing. Fixed remaining 3 via targeted follow-up
- **Commits:** `sprint-1: base form structure`, `sprint-1: Strict validation with correction added`, `sprint-1: edge case handling complete`, `sprint-1: fix offer letter dependency validation logic`

---

## Sprint 2 
- **Goal:** Soft rule validation + exception override system
- **Done:**
  - Prompt 4 (Soft Rules): Implemented all 4 soft rules — DOB age range (18-35), graduation year (2015-2025), percentage/CGPA mode-aware threshold (≥60% or ≥6.0 CGPA), screening score (≥40)
  - Amber warning UI — distinct from red strict errors, inline below each soft field
  - "Request Exception" toggle appears when soft rule is violated
  - Exception rationale textarea revealed when toggle is ON
  - Rationale validation: ≥30 characters + required keyword check (`approved by`, `special case`, `documentation pending`, `waiver granted`)
  - Prompt 5 (Exception Counter + Flagging): Exception counter component showing "Active Exceptions: X/4" near submit button, manager-review warning banner when count > 2, flagged status propagated to submission payload
- **Blockers:**
  - CGPA mode-aware validation initially used wrong threshold (5.0 instead of 6.0 from brief) — identified in code review, flagged for fix
  - Exception state was being auto-enabled by useEffect rather than requiring manual toggle — identified as logic bug
  - Floating search bar appeared briefly and was removed (commit: `sprint-2: soft rules and exception restored before floating search`)
- **Key Decision:** Exception counter uses `useMemo` for derived state — avoids stale counts when rationale changes or soft field value becomes valid again
- **Prompts Used:** Prompt 4, 5
- **AI Evaluation:**
  - Prompt 4: Soft warning UI correct. Rationale keyword check correct. Mode-aware CGPA threshold had an off-by-one error (5.0 vs 6.0) — required manual correction
  - Prompt 5: Counter logic mostly correct. Flagging threshold (>2) correct. Auto-enable bug in exception state introduced by AI — needs fix
- **Commits:** `sprint-2: soft rules and exception system`, `sprint-2: soft rules and exception restored before floating search`, `fix soft validation exception state reset bug`, `sprint-2: exception counter and flagging system implemented`

---

## Sprint 3 
- **Goal:** Config-driven rules engine + audit log + persistence
- **Done:**
  - Prompt 6 (Config Engine): Refactored all validation logic out of form components into `/config/rules.ts` — form now reads rules dynamically from config. Zero hardcoded validation regex in UI components. Validation engine (`validationEngine.ts`) parses rule tokens (e.g., `minLength:2`, `ageRange:18-35`, `modeAware:...`) generically. Fixed CGPA threshold to 6.0 and graduation year max to 2025 in this commit.
  - Prompt 7 (Audit Log): Full audit trail system — every submission persisted to `localStorage` under key `admitguard_audit_log`, audit log view with table (candidate name, timestamp, exception count, flagged status, view button), expandable details modal showing all 11 fields + exception rationales, clear log with confirmation dialog
  - Dashboard: 4 real KPI cards wired to audit log state (total submissions, total exceptions, exception rate, flagged entries)
- **Blockers:**
  - `localStorage` parsing needed try/catch for corrupted state — added graceful fallback
  - Dashboard exception distribution bar chart still uses placeholder random data — not fixed in this sprint (deferred to polish)
- **Key Decision:** `rules.ts` over `rules.json` — TypeScript config gives type safety for the rule engine parser, prevents silent mismatches between rule field names and form data keys. Acknowledged as a tradeoff vs ops-team editability in limitations slide.
- **Prompts Used:** Prompt 6, 7
- **AI Evaluation:**
  - Prompt 6: Config architecture correct. Token parser covered all validation types including complex `modeAware` and `allowedIfYes:interviewStatus=Cleared|Waitlisted`. Minor: CGPA threshold still had 5.0 — corrected manually.
  - Prompt 7: Audit log complete and functional. Persistence, clear log, and detail modal all work. Empty state handled correctly.
- **Commits:** `sprint-3: configurable rules engine`, `sprint-3: percentage and cgpa error fix`, `sprint-3: audit log and data persistence`

---

## Sprint 4 
- **Goal:** Presentation deck, final commits, rehearsal
- **Done:**
  - Fixed CGPA threshold: rules.ts minValue 5.0 → 6.0
  - Fixed graduation year max: rules.ts range 2015-2026 → 2015-2025
  - Prompt A: Email uniqueness check against localStorage audit log
  - Prompt A: Exception toggle changed from auto-enable to manual 
    operator action (removed useEffect auto-set)
  - Prompt A: All 11 fields required before submission unlocks
  - Prompt B: Dashboard exception distribution wired to real audit 
    data (removed Math.random())
  - Prompt B: Enrollment trends chart built with Recharts — last 7 
    days, real submission data
  - Prompt C: CSV and JSON export added to Audit Log view
  - Prompt D: Light/dark mode toggle added (icon present, theme 
    application incomplete — Tailwind v4 dark: config behaves 
    differently from v3 documentation, deferred to v2)
  - Prompt E: Header changed from floating (fixed, rounded) to 
    stationary sticky — cleaner layout
  - Prompt E: Global search bar wired — searches candidate name and 
    email across submissions, dropdown results with navigate-to-audit 
    on click
  - Input-level restrictions added: phone (10 digits max, numeric 
    only), Aadhaar (12 digits max, numeric only), graduation year 
    (4 digits max), screening score (3 chars max), percentage/CGPA 
    (decimal-aware, mode-aware max length), full name (alpha + spaces 
    + hyphens only)
  - README.md merged and updated (project doc + AI Studio setup 
    separated)
  - research-notes.md merged from two versions into single 
    chronological document
  - sprint-log.md completed for all 4 sprints
  - docs/architecture.md written: data flow diagram, component tree, 
    validation token reference, design decisions, known limitations
  - Presentation deck built: 10 slides, product pitch format, 
    investor lens (-ibilities, roadmap, recommendation)
  - Repository final commit pushed
- **Blockers:** Dark mode: Tailwind v4 processes dark: variants differently — 
    the darkMode: 'class' config that works in v3 does not apply 
    correctly in the v4 + Vite pipeline used by AI Studio. Attempted 
    fix via AppContext useEffect (document.documentElement.classList), 
    confirmed the class is added to HTML element, but components do 
    not re-render with dark: variant styles. Root cause: v4 uses 
    CSS-native cascade layers, not the same JIT compiler as v3. 
    Acknowledged as known limitation.
- **Key Decision:** - Shelved Google Sheets sync — adds complexity without changing 
    the demo story. Kept as v2 roadmap item.
  - Presentation format changed from project report to product pitch 
    — live app as demo, slides as business case only
  - Dark mode left as partial rather than forcing a broken 
    implementation — honesty in limitations slide scores better than 
    a half-working feature
- **Prompts Used:** Prompt 8 (UI polish, annotation mode)
- **AI Evaluation:** TBDPrompt A: Correct on email uniqueness and all-fields-required. 
    Exception auto-enable fix required one follow-up to fully remove 
    the useEffect dependency
  - Prompt B: Real dashboard data correct. Recharts chart rendered 
    but required date-fns format adjustment for day labels
  - Prompt C: Export worked first attempt. Filename date formatting 
    correct
  - Prompt D: Toggle button rendered, AppContext wiring correct, 
    dark: class applied to HTML element — but Tailwind v4 component 
    re-render did not follow. AI could not resolve the v4-specific 
    issue across multiple attempts
  - Prompt E: Stationary header correct first attempt. Search 
    dropdown required one follow-up for blur/click timing (150ms 
    delay on onBlur to allow dropdown clicks to register)
  - Input restrictions: All fields correct first attempt. Key 
    insight: type="number" inputs ignore maxLength and onKeyDown — 
    AI correctly switched to type="text" with inputMode="numeric"
- **Commits:** 
`sprint-4: commit data entry limit`
`sprint-4: stationary header, global search`
`sprint-4: presentation and final documentation` 
