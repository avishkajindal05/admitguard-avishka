Role: You are a senior QA-focused frontend engineer reviewing a React + TypeScript + Tailwind admission form with strict validation already implemented.
Task: Test the Candidate Admission Form against the following edge-case scenarios. Fix any logical bugs, validation gaps, UI inconsistencies, or incorrect submit gating behavior. Ensure strict rules always block submission and errors display inline in real-time.
Edge Case Test Scenarios:
Full Name Field:
Enter "A" (too short — should fail)
Enter "John123" (contains numbers — should fail)
Enter "" (empty — should fail)
Expected:
Inline red error appears below the field
Submit button remains disabled
Phone Number:
Enter "1234567890" (does not start with 6–9 — should fail)
Enter "98765" (too short — should fail)
Enter "9876543210" (valid — should pass)
Expected:
Real-time validation on change and blur
Only 10 digits starting with 6/7/8/9 allowed
Aadhaar Number:
Enter "12345678901" (11 digits — should fail)
Enter "12345678901a" (contains letter — should fail)
Enter "123456789012" (12 digits numeric — should pass)
Expected:
Numeric-only enforcement
Exact 12-digit validation
Inline red error text using Tailwind text-red-500 text-sm
Interview Status = "Rejected":
Select "Rejected"
Attempt to submit the form
Expected:
Show a top red banner: "Rejected candidates cannot be enrolled."
Submit button becomes disabled immediately
Form submission is completely blocked (hard stop)
Interview Status = "Waitlisted" + Offer Letter = "Yes":
Set Interview Status to "Waitlisted"
Toggle Offer Letter Sent to "Yes"
Expected:
No validation error
This combination should be allowed
Submit eligibility depends on other strict fields only
Interview Status = "Rejected" + Offer Letter = "Yes":
Set Interview Status to "Rejected"
Then toggle Offer Letter Sent to "Yes"
Expected:
Inline dependency error below Offer Letter toggle
Submission remains blocked
Rejection banner still visible
Offer Letter logic should not override rejection rule
Validation & UX Requirements During Testing:
All errors must be shown INLINE below each field (no alerts or modals)
Errors must update in real-time (onChange + onBlur)
No layout shift when errors appear (reserved error space)
Submit button must remain disabled until ALL strict validations pass
Use a computed isFormValid boolean derived from the errors object and rejection state
Ensure accessibility: error regions use aria-live="polite"
Bug Fix Expectations:
Fix any missing regex validation (name, email, phone, aadhaar)
Fix incorrect dependency logic between Interview Status and Offer Letter
Ensure rejection rule has highest priority in submission gating
Prevent false positives where form becomes submittable with invalid strict fields
Output Requirement:
Provide a short validation test summary table in console logs or comments:
Scenario 1: Pass/Fail
Scenario 2: Pass/Fail
Scenario 3: Pass/Fail
Scenario 4: Pass/Fail
Scenario 5: Pass/Fail
Scenario 6: Pass/Fail
🔍 Checkpoint: All 6 edge-case scenarios handled correctly with strict validation, inline errors, and proper submit blocking.

Prompt 2:
Test the form against these scenarios and fix any issues:
Name field: Enter "A" (too short), "John123" (has numbers), "" (empty)
Phone: Enter "1234567890" (doesn't start with 6-9), "98765" (too short)
Aadhaar: Enter "12345678901" (11 digits), "12345678901a" (has letter)
Set Interview Status to "Rejected" then try to submit
Set Interview Status to "Waitlisted" then set Offer Letter to "Yes" — should work
Set Interview Status to "Rejected" then set Offer Letter to "Yes" — should block
Make sure all edge cases are handled. Show me which ones pass and which fail.

Final prompt:
Test the form against these edge cases and fix any issues. Walk through each
scenario and confirm whether it passes or fails correctly:
Strict field edge cases:
Full Name: "" (empty) → should show "Name is required"
Full Name: "A" (1 char) → should show "Minimum 2 characters"
Full Name: "John123" (has numbers) → should show "Name cannot contain numbers"
Phone: "1234567890" (starts with 1) → should block
Phone: "98765" (only 5 digits) → should block
Phone: "9876543210" (valid) → should pass
Aadhaar: "12345678901" (11 digits) → should block
Aadhaar: "12345678901a" (has a letter) → should block
Aadhaar: "123456789012" (12 digits) → should pass
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