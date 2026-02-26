# AdmitGuard — Prompt Sequence (Sprint 1)
**Status: DRAFTED — Do NOT run yet**  
Drafted: Sprint 0, 

---

## Prompt 1 — The Foundation Prompt

```
Role: You are a senior frontend developer building an internal business tool.
Task: Create a single-page candidate admission form for an education company's enrollment process. Build the form structure only — inputs, layout, UI states placeholders, exception UI shell, progress indicator, and component wiring. Do NOT implement full validation logic yet; reserve visible validation message areas and state hooks so validators can be added later from config.
Form fields (render each with: label, input control, reserved validation message area):
Full Name (text)
Email (text)
Phone (text, 10 digits) — show placeholder for format
Date of Birth (date picker)
Highest Qualification (dropdown: B.Tech, B.E., B.Sc, BCA, M.Tech, M.Sc, MCA, MBA)
Graduation Year (number input, allow 2015–2025 range UI)
Percentage or CGPA (number input + UI toggle labelled “% / CGPA” — when toggled, label should update)
Screening Test Score (number, 0–100)
Interview Status (dropdown: Cleared, Waitlisted, Rejected)
Aadhaar Number (text, 12 digits) — show placeholder for format
Offer Letter Sent (toggle: Yes/No)
Layout & structure requirements (must follow AdmitGuard design discipline):
Single page, card-based main content in a 3-zone layout (left sidebar nav, top header, main content card). The Admission Form is the default view.
design flow document
Use a clean, professional card aesthetic (card padding, border-radius 12px, subtle shadow). Reserve consistent spacing (8px-based scale).
design flow document
Each field row must show: label (14px medium), input area (44px height, 8px radius), and a reserved validation text area immediately below the input (13px). Avoid layout shift when validation messages appear.
design flow document
Place a visible progress indicator/step tracker at the top of the card (even if single-step now) to support future longer forms. The indicator should be subtle and consistent with the card design.
design flow document
Validation & state placeholders (structure only; DO NOT write validation code now):
Mark fields as either strict or soft in the component props (strict fields: Full Name, Email, Phone, Highest Qualification, Interview Status, Aadhaar, Offer Letter Sent; soft fields: DOB, Graduation Year, Percentage/CGPA, Screening Test Score). Add data- attributes or prop flags so the validation engine can later attach rules from /config/rules.json.
PDR-admitguard
Add visible placeholders / UI hooks for:
Inline strict error area (red style)
Inline soft warning area (amber style) plus a hidden "Request Exception" toggle that expands a rationale textarea when turned on
Exception rationale textarea (80px min height), with a small character counter placeholder and validation message area beneath it (to be wired to rationale rules later).
design flow document
Near the primary submit button, reserve a compact Exception Counter component: “Active Exceptions: X” (start with X = 0). Include an area above the submit for a manager-review banner if X > 2 (visual only for now).
design flow document
Make the Submit button disabled by default. Add a top-level submitEnabled boolean prop that will later be computed by the validation engine. Add an accessible tooltip explaining why submit is disabled (e.g., “Submit disabled: strict validation pending”).
PDR-admitguard
Interaction & dependencies (UI wiring only):
If Interview Status = “Rejected”, show a red top-level banner: “Rejected candidates cannot be enrolled.” Also visually force Offer Letter Sent to “No” (UI shows it disabled). (No validation logic required now; just wire the UI state to reflect this dependency for later logic hookup.)
PDR-admitguard
If Offer Letter = Yes, show an inline helper note that offer-letter depends on Interview Status ∈ {Cleared, Waitlisted}. (UI note only.)
PDR-admitguard
Soft-field “Request Exception” toggle: when toggled, reveal the rationale textarea. Provide a clear microcopy instructing the user that rationale must satisfy later rules (≥30 chars + required keywords) — do not implement the checks now.
PDR-admitguard
Submission UX (structure only):
Clicking Submit (when enabled) opens a centered Confirmation Modal (max-width 600px) summarizing all field values, listing any active exceptions (fields + rationale), showing the exception count and whether the submission would be flagged. The modal must have Confirm and Cancel actions and show the flagged status badge if applicable. (Persisting / gate logic is not implemented here — just provide the modal UI.)
design flow document
After Confirm, the UI should be prepared to call a persistence function (e.g., saveSubmission(submissionObj)) that the integration step will provide later; include a success screen shell that shows Candidate Name, Timestamp, Exception Count, Flagged indicator, and actions (“Add Another Candidate”, “Go to Audit Log”). (Do not implement saving now.)
PDR-admitguard
Audit log & dashboard shells:
Add top-level navigation for “Admission Form”, “Audit Log”, and “Dashboard” (left sidebar). Implement the Audit Log and Dashboard views as structural shells that will later render localStorage data:
Audit Log: full-width card with table columns (Candidate Name, Timestamp, Exception Count, Flagged, Actions) and a modal for Details.
Dashboard: four summary cards (Total Submissions, Total Exceptions, Exception Rate, Flagged Entries).
PDR-admitguard
Accessibility & micro-interactions:
Ensure keyboard navigability, focus outlines, label for attributes, and ARIA roles on toggles, modal, and error regions. Do not rely on color alone to signal errors.
design flow document
Keep micro-interactions subtle (fade-ins, smooth accordion). Avoid loud animations.
design flow document
Implementation recommendations (for the developer who will implement the form structure):
Framework: React; TypeScript preferred. Styling: Tailwind CSS recommended. Use local component state + Context for config and audit-shell state. (These are suggestions only — do not change the required structure above.)
Technical Stack & Tools Document
Keep validation rules config-driven and externalized in /config/rules.json so the validation engine can later read rules without UI changes. Add data-rule-key attributes to each field for mapping.
PDR-admitguard
Wire event hooks but do not implement validation: onChange, onBlur, onToggleException, onSubmitAttempt, onConfirmSubmission. These will be consumed by the validation/exception engine later.
Design tokens / visual guidance (apply while building the structure):
Card: white background, 12px radius, 1px #EAECEF border, subtle shadow. Spacing: 8px scale; form sections separated by 32px. Buttons 44px high, 8px radius. Primary accent: #2563EB for buttons/active nav. Strict error (red) and soft warning (amber) visual tokens should exist as CSS variables for future validation styling.
design flow document
Deliverable expected from this prompt:
A React (or plain HTML/CSS/JS if preferred) form-structure implementation that includes all fields, layouts, UI placeholders for validation/exceptions, progress indicator, confirmation modal, audit & dashboard shells, and component APIs/hooks described above. No validation algorithm should be implemented at this stage — only the structural and visual scaffolding required for later wiring.
References (documentation to align with while building):
AdmitGuard Product Requirements & flows.
PDR-admitguard
Front-End Design Guidelines (cards, spacing, color semantics, exception UI).
design flow document
Application Flow & diagrams (submission gate, strict vs soft fields, exception counter).
napkin
Technical stack & implementation notes (React + TypeScript + Tailwind recommendation, config-driven validation).
Technical Stack & Tools Document
App flow / wireframes (use for modal/table layout and audit flow shells).
---

## Prompt 2 — Add Strict Validations

```
Now add validation for these STRICT rules. Violations block submission — 
no exceptions allowed for these:

1. Full Name: Cannot be blank. Minimum 2 characters. No numbers allowed.
2. Email: Must be valid email format (contains @ and a valid domain).
3. Phone: Exactly 10 digits. Must start with 6, 7, 8, or 9.
4. Highest Qualification: Must select one from the dropdown (cannot be empty).
5. Interview Status: If "Rejected" is selected, block submission entirely 
   and show a full-width red banner at the top: "Rejected candidates cannot be enrolled."
   Also auto-force Offer Letter Sent to "No" and disable that toggle.
6. Aadhaar Number: Exactly 12 digits. No alphabets or special characters.
7. Offer Letter Sent: Cannot be set to "Yes" unless Interview Status is 
   "Cleared" or "Waitlisted". Show a red inline error if violated.

Implementation requirements:
- Validate on every keystroke (onChange), not just on blur or submit.
- Show errors INLINE below each field in red text (#EF4444).
- Show green indicator (#22C55E) when a strict field becomes valid.
- The submit button stays DISABLED until ALL 7 strict rules pass simultaneously.
- Track a global form validity state that re-evaluates on every field change.

Do NOT add soft field validation yet. Do NOT add exception toggles yet.
Do NOT use any external validation library. Write all validation logic from scratch.
```

---

## Prompt 3 — Verify with Edge Cases

```
Test the form against these edge cases and fix any issues. Walk through each 
scenario and confirm whether it passes or fails correctly:

Strict field edge cases:
1. Full Name: "" (empty) → should show "Name is required"
2. Full Name: "A" (1 char) → should show "Minimum 2 characters"
3. Full Name: "John123" (has numbers) → should show "Name cannot contain numbers"
4. Phone: "1234567890" (starts with 1) → should block
5. Phone: "98765" (only 5 digits) → should block
6. Phone: "9876543210" (valid) → should pass
7. Aadhaar: "12345678901" (11 digits) → should block
8. Aadhaar: "12345678901a" (has a letter) → should block
9. Aadhaar: "123456789012" (12 digits) → should pass

Cross-field dependency edge cases:
10. Set Interview Status = "Rejected" → submit button must be permanently disabled, 
    red banner appears, Offer Letter toggle forced to "No"
11. Set Interview Status = "Waitlisted" → set Offer Letter = "Yes" → should be ALLOWED
12. Set Interview Status = "Rejected" → set Offer Letter = "Yes" → should be BLOCKED 
    with inline red error on Offer Letter field

Submit button gate:
13. Fill all fields validly except one → submit stays disabled
14. Fix the last field → submit becomes enabled

For each edge case you find is broken, fix it immediately.
Show me a summary table of which cases passed and which failed before your fix.
```

---

## Prompt 4 (Future — Soft Fields + Exception Engine)

*Planned but not drafted in detail yet. Will cover:*
- Soft field validation (Date of Birth, Graduation Year, Percentage/CGPA, Screening Score)
- 3-state model: VALID / INVALID_WARNING / EXCEPTION_APPROVED
- Exception toggle UI (toggle appears when soft field is invalid)
- Exception counter tracking
- Rationale text area (required when exception is toggled)
- Exception approved = amber state, not red

---

## Prompt 5 (Future — Audit Log + Dashboard)

*Planned but not drafted yet. Will cover:*
- localStorage persistence of submission records
- Audit log view with timestamp, all field values, exception count
- Dashboard: total submissions, exception rate, rejection rate
- Export as JSON
