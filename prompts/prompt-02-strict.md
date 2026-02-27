The base form UI structure already exists. Now you must implement STRICT validation rules that block submission completely if violated.
Task
Enhance the existing Candidate Admission Form by adding real-time inline validation for all STRICT fields.
Do NOT redesign the UI.
Do NOT convert to a multi-step form.
Only add validation logic, state management, inline error handling, and submission gating.
Tech Requirements
React (Functional Components)
TypeScript (strict typing)
Tailwind CSS for styling
Controlled form inputs (useState or useReducer)
No external form libraries (NO Formik, NO React Hook Form)
Clean, modular, maintainable code
Strict Validation Rules (BLOCK submission, NO exceptions allowed)
Implement the following rules exactly:
Full Name
Cannot be empty
Minimum 2 characters
Must NOT contain numbers
Error message:
"Full Name must be at least 2 characters and contain only letters."
Email
Must be valid email format
Must include "@" and a domain (e.g., example@domain.com
)
Error message:
"Enter a valid email address."
Phone Number
Must be exactly 10 digits
Must start with 6, 7, 8, or 9
Only numeric characters allowed
Error message:
"Phone number must be 10 digits and start with 6, 7, 8, or 9."
Highest Qualification
Must be selected from dropdown
Cannot remain empty or default placeholder
Error message:
"Please select a qualification."
Interview Status (Critical Rule)
If "Rejected" is selected:
Show a top red banner
Banner text:
"Rejected candidates cannot be enrolled."
Disable submit button immediately
Prevent form submission entirely
Aadhaar Number
Must be exactly 12 digits
Only numeric characters allowed
No spaces, alphabets, or special characters
Error message:
"Aadhaar must be exactly 12 digits."
Offer Letter Sent (Dependency Rule)
Cannot be "Yes" unless Interview Status is:
"Cleared" OR "Waitlisted"
If violated:
Show inline error below toggle
Error message:
"Offer letter can only be sent if interview is Cleared or Waitlisted."
Validation Behavior Requirements
Show validation errors INLINE below each field
Error text must be:
Red color (text-red-500)
Small size (text-sm)
Visible in real-time (onChange and onBlur)
Do NOT use alert popups
Do NOT show errors only on submit — must validate live
Submit Button Logic
Submit button must remain disabled until ALL strict validations pass
Use a computed boolean: isFormValid
Conditions for enabling submit:
No field errors
No rejected interview status
All required strict fields valid
Button states:
Disabled: greyed out + cursor-not-allowed
Enabled: primary blue CTA
UI Enhancements to Add (Without Changing Layout)
Inline error message area below every strict field
Red rejection banner (top of form card)
Disabled submit tooltip (optional):
"Fix validation errors to submit"
Live validation feedback as user types
State Management Expectations
Create:
formData state (typed interface)
errors state (per-field error object)
isRejected boolean
isFormValid computed selector
Example interface:
interface FormData {
fullName: string;
email: string;
phone: string;
dob: string;
qualification: string;
graduationYear: number | "";
score: number | "";
interviewStatus: string;
aadhaar: string;
offerLetterSent: boolean;
}
Accessibility & UX Constraints
Inputs must have labels and aria attributes
Error regions must use aria-live="polite"
Focus should not jump on validation
No layout shift when errors appear (reserve space)
Testing Checklist (Must Pass)
Before finalizing implementation:
Try empty Full Name → error appears
Enter invalid email → error shows instantly
Enter 9-digit phone → error persists
Select Interview Status = Rejected → red banner + submit disabled
Enter non-numeric Aadhaar → error shows
Toggle Offer Letter = Yes while status ≠ Cleared/Waitlisted → blocked
Commit Instruction
After implementation, assume commit message:
sprint-1: strict validation rules added
Output Expectation
Generate:
Updated React + TypeScript component
Tailwind-styled inline validation UI
Real-time validation logic
Disabled submit gating based on strict rules only
Clean, production-quality code structure (not a prototype)