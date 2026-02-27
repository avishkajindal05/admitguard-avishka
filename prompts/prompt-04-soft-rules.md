Role: You are a senior frontend engineer building a production-grade internal admission tool using React + TypeScript + Tailwind CSS. The form already has strict validation implemented. Your task is to now implement SOFT rule validations with an override exception system without breaking existing strict rules.
Objective:
Enhance the Candidate Admission Form by adding configurable SOFT validations that block submission by default but can be overridden via a justified exception flow. Maintain clean UX, real-time feedback, and clear visual differentiation between strict errors and soft warnings.
Important Constraint:
STRICT rules (red errors) still have highest priority and CANNOT be overridden.
SOFT rule violations show warnings (amber) and can be overridden only with valid rationale.
Do NOT use external form libraries (no Formik, no React Hook Form).
Use controlled components with React state (TypeScript typed).
Soft Validation Rules to Implement:
Date of Birth (Age Rule)
Candidate must be between 18 and 35 years old
Calculate age dynamically from today’s date
If age < 18 or > 35 → trigger soft warning
Graduation Year
Must be between 2015 and 2025 (inclusive)
Outside range → soft warning
Percentage / CGPA (Mode-Based Rule)
If Percentage mode → value must be ≥ 60%
If CGPA mode (10-point scale) → value must be ≥ 6.0
Detect mode from the existing toggle
Below threshold → soft warning
Screening Test Score
Must be ≥ 40 out of 100
Score < 40 → soft warning
Soft Violation UI Behavior (MANDATORY):
When any soft rule is violated:
Show an inline AMBER/YELLOW warning below the field (text-amber-600 text-sm)
Do NOT show red error styling
Display a checkbox or toggle labeled: "Request Exception"
When the toggle is OFF → submission remains blocked
When the toggle is ON → reveal an "Exception Rationale" textarea below the warning
Exception Rationale Requirements:
Minimum 30 characters
Must contain at least ONE of the following phrases (case-insensitive):
"approved by"
"special case"
"documentation pending"
"waiver granted"
If rationale is too short or missing required phrases:
Show a helpful inline error in red:
"Rationale must be at least 30 characters and include an approval phrase (e.g., ‘approved by’, ‘special case’)."
If rationale is valid:
Mark the soft violation as overridden
Allow submission (only if all strict rules also pass)
Submission Logic (Critical):
Submit button must remain disabled if:
Any strict validation fails (always blocking)
Any soft rule is violated AND no valid exception rationale is provided
Submit button can be enabled only when:
All strict rules pass
All soft violations are either valid OR overridden with valid rationale
State Management Expectations:
Create and maintain:
softWarnings object (per field)
exceptionsRequested object (boolean per soft field)
exceptionRationales object (string per field)
isSoftOverrideValid(field) helper function
Final computed selector: canSubmit = strictValid && softValidOrOverridden
Visual Design System (Tailwind):
Strict errors: text-red-500
Soft warnings: text-amber-600
Valid fields (optional helper state): border-green-500
Exception textarea:
Min height: 100px
Rounded-md
Placeholder: "Provide justification for exception (min 30 chars with approval phrase)"
UX & Accessibility Requirements:
Real-time validation onChange and onBlur
No layout shift when warnings appear (reserve message space)
Use aria-live="polite" for warnings and rationale errors
Clear separation between strict (red) and soft (amber) messaging
Do not use alerts, popups, or toast notifications for validation
Edge Case Handling:
Switching Percentage ↔ CGPA should revalidate instantly
Turning OFF "Request Exception" should immediately block submission again
Clearing rationale should re-trigger soft blocking state
Multiple soft violations should support independent exception rationales per field
Testing Checklist (must pass):
DOB age < 18 → amber warning + exception option
Graduation year = 2010 → warning + rationale required
Percentage = 55% → warning in percentage mode
CGPA = 5.5 → warning in CGPA mode
Screening score = 30 → warning + override flow
Valid rationale (≥30 chars + required phrase) → submission allowed
Output Expectation:
Updated React + TypeScript logic for soft validation layer
Exception toggle + rationale UI components integrated per soft field
Clean modular helper functions for soft rule evaluation
No regression to existing strict validation system
Maintain production-quality, scalable code structure