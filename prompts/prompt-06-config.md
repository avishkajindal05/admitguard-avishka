Role: You are a senior frontend engineer building a scalable internal admission tool using React + TypeScript + Tailwind CSS. The form already supports strict validation, soft validation with exceptions, exception counter, and flagging.
Objective:
Refactor the entire validation system so that NO validation logic is hardcoded inside form components.
All validation rules must be dynamically read from a centralized JSON configuration object (rules engine pattern).
Critical Requirement:
The form must become config-driven so the operations team can update rules by editing a JSON file instead of modifying frontend code.
Do NOT remove existing functionality.
Do NOT change UI design.
Only refactor validation architecture to be rule-configurable.
Config Architecture Requirement:
Create a dedicated file:
/config/rules.json (or rules.ts exporting a JSON object)
The validation engine must read from this config at runtime and apply:
Strict validations
Soft validations
Exception rules
Dependency rules
Error messages
Rationale keyword requirements
Sample Config Structure (Use and Expand This): {
"rules": [
{
"field": "full_name",
"type": "strict",
"validation": ["required", "minLength:2", "noNumbers"],
"errorMessage": "Name must be at least 2 characters with no numbers"
},
{
"field": "dob",
"type": "soft",
"validation": ["ageRange:18-35"],
"errorMessage": "Candidate age must be between 18-35",
"exceptionAllowed": true,
"rationaleKeywords": ["approved by", "special case", "documentation pending", "waiver granted"]
}
]
} Task 1 — Create Complete Config for ALL 11 Fields:
Generate a full rules config covering:
full_name (strict)
email (strict)
phone (strict)
dob (soft)
highest_qualification (strict)
graduation_year (soft)
percentage_cgpa (soft, mode-aware)
screening_score (soft)
interview_status (strict + rejection rule)
aadhaar_number (strict)
offer_letter_sent (strict + dependency rule)
Each rule object must include:
field (string key matching formData)
type ("strict" | "soft")
validation (array of rule tokens, NOT raw code)
errorMessage (string)
warningMessage (for soft rules)
exceptionAllowed (boolean for soft rules)
rationaleMinLength (number, default 30 for soft)
rationaleKeywords (array for soft override)
dependencies (optional object for cross-field logic)
Validation Token Standard (Must Implement Parser Support):
Support tokens like:
"required"
"minLength:2"
"email"
"phone:india"
"aadhaar:12digits"
"ageRange:18-35"
"range:2015-2025"
"minValue:60"
"cgpaMin:6.0"
"scoreMin:40"
"restrictedIf:interview_status=Rejected"
"allowedIfYes:interview_status=Cleared|Waitlisted"
Task 2 — Build a Generic Validation Engine:
Refactor form logic to use:
validateField(fieldName, value, formData, rulesConfig)
Engine Responsibilities:
Read rules dynamically from config
Determine if rule is strict or soft
Return:
error (strict)
warning (soft)
isValid
canOverride (for soft)
Handle cross-field dependencies (e.g., Offer Letter vs Interview Status)
Task 3 — Refactor Form Implementation:
Remove all hardcoded validation conditions from components
Replace with:
rulesConfig import
centralized validation helper
Maintain existing states:
errors (strict)
softWarnings
exceptionsRequested
exceptionRationales
activeExceptionCount
isFlagged
The form should now:
Loop through rules config
Validate fields dynamically onChange and onBlur
Render messages rationale UI ONLY if exceptionAllowed: true and soft violation exists
Dependency Rule Handling (Config-Driven):
Example:
Offer Letter rule must be defined in config:
"Yes" allowed ONLY if Interview Status = Cleared or Waitlisted
"No" always allowed
If status = Rejected → auto strict error if Yes selected
Dynamic UI Behavior Requirements:
Error text (strict): text-red-500
Warning text (soft): text-amber-600
Exception UI only for fields where exceptionAllowed = true
No layout shift when messages appear
Code Structure Expectations:
Create modular architecture:
/config/rules.ts → rules JSON
/utils/validationEngine.ts → parser + validator
/hooks/useValidation.ts → reusable validation hook
Form component should NOT contain raw validation regex logic
Testing Checkpoint (Critical):
After refactor:
Change age range in config from 18–35 → 18–40
Do NOT modify form code
Verify form behavior updates automatically
Soft warnings and overrides still function
Exception counter and flagging still work correctly
Output Requirements:
Complete rules config object for all 11 fields
Refactored validation engine (TypeScript)
Updated form integration using config-driven validation
Zero hardcoded rule logic inside UI components
Clean, scalable, production-grade architecture
Performance & Quality Constraints:
Use memoization for rule evaluation (useMemo)
Avoid re-validating entire form unnecessarily
Maintain strict > soft > exception priority hierarchy
Ensure type-safe rule parsing with TypeScript interfaces