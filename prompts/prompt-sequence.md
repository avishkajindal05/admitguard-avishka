# AdmitGuard — Prompt Sequence (Sprint 1)
**Status: DRAFTED — Do NOT run yet**  
Drafted: Sprint 0, 

---

## Prompt 1 — The Foundation Prompt

```
Role: You are a senior frontend developer building an internal business tool.

Task: Create a candidate admission form for an education company's 
enrollment process. The form collects the following fields:
- Full Name (text)
- Email (text)
- Phone (text, 10 digits)
- Date of Birth (date picker)
- Highest Qualification (dropdown: B.Tech, B.E., B.Sc, BCA, M.Tech, M.Sc, MCA, MBA)
- Graduation Year (number, range 2015-2025)
- Percentage or CGPA (number with a toggle to switch between percentage and CGPA mode)
- Screening Test Score (number, 0-100)
- Interview Status (dropdown: Cleared, Waitlisted, Rejected)
- Aadhaar Number (text, 12 digits only)
- Offer Letter Sent (toggle: Yes/No)

Constraints:
- Use a clean, professional design. Not a generic template.
- Each field should show a label, input, and validation message area.
- The submit button should be disabled until all strict validations pass.
- Use a single-page layout with a card-based form design.
- Show a progress indicator or step tracker if the form is long.
- Use Tailwind CSS for styling. Do NOT use Bootstrap or any UI component library.
- Layout: Left sidebar (240px) with three nav items (Admission Form, Audit Log, Dashboard). 
  Top header bar (64px) with app name "AdmitGuard". Main content area with card-based layout.
- Color scheme: white cards, #F8F9FB sidebar, #EAECEF borders, red for errors, green for valid, amber for warnings.

Do NOT write any validation logic yet. Just build the form structure and layout.
Do NOT add placeholder submit logic. Just render the form.
```

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
