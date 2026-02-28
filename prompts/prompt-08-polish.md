Role: You are a senior frontend engineer making targeted input restriction
changes to an existing React + TypeScript + Tailwind admission form.
These are INPUT-LEVEL restrictions only — they control what the user can
physically type. Do NOT modify any validation rules, error messages,
rules.ts, validationEngine.ts, or submission logic. Only modify
FormField.tsx and the field rendering in AdmissionForm.tsx.
CONCEPT
Input restrictions prevent bad characters and enforce length limits
at the keyboard level — before validation even runs. The user simply
cannot type an invalid character or exceed the max length. This is
different from validation (which shows an error after the fact).
Implementation approach for each restricted field:
Use onKeyDown to block invalid keypresses before they register
Use maxLength HTML attribute to cap character count
Use onChange filtering as a second layer (strip invalid chars
from pasted input)
FIELD-BY-FIELD RESTRICTIONS
FIELD 1 — Phone Number
Accept: digits only (0-9)
Max length: 10 characters
Block: any letter, space, special character, symbol
Paste handling: strip all non-numeric characters, truncate to 10
FIELD 2 — Aadhaar Number
Accept: digits only (0-9)
Max length: 12 characters
Block: any letter, space, special character, symbol
Paste handling: strip all non-numeric characters, truncate to 12
FIELD 3 — Graduation Year
Accept: digits only (0-9)
Max length: 4 characters (it's a 4-digit year)
Block: any letter, space, decimal point, negative sign
Paste handling: strip non-numeric, truncate to 4
FIELD 4 — Screening Test Score
Accept: digits only (0-9)
Max length: 3 characters (max value is 100)
Block: any letter, space, special character
Block: decimal point (scores are whole numbers only)
Paste handling: strip non-numeric, truncate to 3
FIELD 5 — Percentage / CGPA
Percentage mode: accept digits and ONE decimal point only
Max: 5 characters (e.g., "100.0" or "99.99" truncated to 5)
CGPA mode: accept digits and ONE decimal point only
Max: 4 characters (e.g., "10.0" or "9.99" truncated to 4)
Block: letters, spaces, negative signs, second decimal point
Paste handling: strip invalid chars, truncate to mode-appropriate length
Note: the mode (percentage vs cgpa) is already tracked in
formData.scoreType — use this to determine max length
FIELD 6 — Full Name
Accept: letters (a-z, A-Z), spaces, hyphens, apostrophes only
Block: numbers (0-9), special characters (@, #, $, etc.)
No max length restriction (names can be long)
Paste handling: strip numeric and special characters
FIELD 7 — Email
No character blocking (emails have complex valid character sets)
No max length restriction
Leave as-is — validation handles this
FIELD 8 — Date of Birth
This is a date input type — browser handles restrictions natively
No changes needed
FIELD 9 — Highest Qualification, Interview Status
These are select dropdowns — no changes needed
FIELD 10 — Offer Letter Sent
This is a toggle — no changes needed
IMPLEMENTATION
In FormField.tsx, add an onKeyDown handler prop and modify the
input rendering. Add these helpers inside FormField.tsx:
const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape',
'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
'Home', 'End'];
const blockNonNumeric = (e: React.KeyboardEvent<HTMLInputElement>) => {
if (allowedKeys.includes(e.key)) return;
if (e.ctrlKey || e.metaKey) return; // allow Ctrl+A, Ctrl+C, Ctrl+V
if (!/^\d$/.test(e.key)) e.preventDefault();
};
const blockNonNumericAllowDecimal = (
e: React.KeyboardEvent<HTMLInputElement>,
currentValue: string
) => {
if (allowedKeys.includes(e.key)) return;
if (e.ctrlKey || e.metaKey) return;
if (e.key === '.' && !currentValue.includes('.')) return; // one dot only
if (!/^\d$/.test(e.key)) e.preventDefault();
};
const blockNonAlpha = (e: React.KeyboardEvent<HTMLInputElement>) => {
if (allowedKeys.includes(e.key)) return;
if (e.ctrlKey || e.metaKey) return;
if (/^[a-zA-Z\s-']$/.test(e.key)) return;
e.preventDefault();
};
const stripNonNumeric = (val: string, max: number) =>
val.replace(/\D/g, '').slice(0, max);
const stripToAlpha = (val: string) =>
val.replace(/[^a-zA-Z\s\-']/g, '');
const stripToDecimal = (val: string, max: number) => {
// Remove everything except digits and first decimal point
let cleaned = val.replace(/[^\d.]/g, '');
const parts = cleaned.split('.');
if (parts.length > 2) cleaned = parts[0] + '.' + parts.slice(1).join('');
return cleaned.slice(0, max);
};
In AdmissionForm.tsx, apply these restrictions when rendering
each FormField — pass through to the underlying input element.
For the input element in FormField.tsx, add:
maxLength prop (where applicable)
onKeyDown handler (field-specific)
Modified onChange: run the strip function on the value BEFORE
calling the parent onChange, so pasted invalid content is
cleaned immediately
Specific wiring per field (in AdmissionForm.tsx field rendering):
phone:
onKeyDown: blockNonNumeric
onChange: (val) => handleFieldChange('phone', stripNonNumeric(val, 10))
maxLength: 10
aadhaarNumber:
onKeyDown: blockNonNumeric
onChange: (val) => handleFieldChange('aadhaarNumber', stripNonNumeric(val, 12))
maxLength: 12
graduationYear:
onKeyDown: blockNonNumeric
onChange: (val) => handleFieldChange('graduationYear', stripNonNumeric(val, 4))
maxLength: 4
screeningScore:
onKeyDown: blockNonNumeric
onChange: (val) => handleFieldChange('screeningScore', stripNonNumeric(val, 3))
maxLength: 3
percentageOrCgpa:
onKeyDown: (e) => blockNonNumericAllowDecimal(e, formData.percentageOrCgpa)
onChange: (val) => {
const max = formData.scoreType === 'percentage' ? 5 : 4;
handleFieldChange('percentageOrCgpa', stripToDecimal(val, max));
}
maxLength: formData.scoreType === 'percentage' ? 5 : 4
fullName:
onKeyDown: blockNonAlpha
onChange: (val) => handleFieldChange('fullName', stripToAlpha(val))
No maxLength
FormField.tsx changes:
Add optional props: onKeyDown, maxLength
Pass both through to the underlying <input> element
For the 'number' type fields currently using type="number":
CHANGE these to type="text" with inputMode="numeric"
(this gives the numeric keyboard on mobile while allowing
maxLength and onKeyDown to work — type="number" ignores both)
Apply this to: phone, aadhaarNumber, graduationYear,
screeningScore, percentageOrCgpa