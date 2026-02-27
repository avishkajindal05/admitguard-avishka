Role: You are a senior frontend engineer building a production-grade internal admission tool using React + TypeScript + Tailwind CSS. The form already has strict validation and soft exception override logic implemented.
Objective:
Implement a system-level Exception Counter and Flagging mechanism that tracks active overridden soft rule exceptions on the current form and visually flags high-risk entries without blocking submission.
Do NOT modify existing strict or soft validation logic.
Only extend the system with exception aggregation, counter UI, and flagging behavior.
Core Functional Requirement:
Add a dynamic exception tracking system that:
Counts ONLY active soft rule exceptions that have:
A violated soft rule
"Request Exception" enabled
A VALID rationale (≥30 chars + required phrase)
Displays the count near the submit button as:
"Active Exceptions: X/4"
Exception Counting Rules:
Count per field basis (DOB, Graduation Year, Percentage/CGPA, Screening Score)
A field is counted as an active exception ONLY if:
softWarnings[field] === true
AND
exceptionsRequested[field] === true
AND
isRationaleValid(field) === true
If a soft value becomes valid again:
Automatically remove it from the exception count
Recalculate counter in real-time
Flagging System Logic:
If Active Exceptions > 2:
Show a top warning banner (amber/red hybrid)
Banner text:
"⚠️ This candidate has more than 2 exceptions. Entry will be flagged for manager review."
Submission must STILL be allowed (do NOT disable submit)
Instead, mark the form submission as flagged = true
UI Placement Requirements:
Display the exception counter prominently near the Submit button
Format:
Tailwind styling: text-sm font-semibold text-amber-600
Example: "Active Exceptions: 2/4"
Show flag banner above the submit section when threshold exceeded
Use Tailwind classes:
Banner: bg-amber-100 border border-amber-400 text-amber-800 rounded-md p-3
State Management Expectations (React + TypeScript):
Create derived selectors:
activeExceptionCount: number
isFlagged: boolean → true when count > 2
exceptionFields: string[] (optional for future audit log)
Suggested Computation Logic:
Recompute counter on every formData, softWarnings, exceptionsRequested, or rationale change
Use a memoized selector (useMemo) for performance
Single source of truth:
activeExceptionCount = Object.keys(softWarnings).filter(field => softWarnings[field] && exceptionsRequested[field] && isRationaleValid(field)).length
Submission Behavior Update:
Submit button logic:
Still blocked by STRICT validation failures
Still blocked by un-overridden soft violations
NOT blocked by flagged state
On submit payload, include:
exceptionCount
isFlagged
exceptionDetails (optional structure for each overridden field)
Visual Marking in Data Display (Future-Proofing):
Prepare UI state so that any table, audit log, or dashboard can display:
A "Flagged" badge if isFlagged === true
Suggested badge style:
bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded
Real-Time UX Requirements:
Counter must update instantly when:
Exception toggle is enabled/disabled
Rationale becomes valid/invalid
Soft field value becomes valid again
No page refresh required
No lag or stale counts allowed
Edge Case Handling:
3 valid exceptions → Counter = 3/4 + Flag banner visible
Disable one exception → Counter drops to 2/4 + Flag banner disappears
Invalid rationale → Do NOT count as active exception
Soft rule fixed → Exception auto-removed from count
Strict errors present → Counter still visible but submit remains disabled (strict priority)
Accessibility & UX Constraints:
Counter should have aria-live="polite" for dynamic updates
Banner must be dismissible (optional but recommended)
No layout shift when banner appears (reserve top space)
Maintain color semantics:
Red = strict error
Amber = soft warning & exceptions
Neutral/Green = valid states
Testing Checklist (must pass):
Trigger 1 soft exception with valid rationale → Counter = 1/4
Trigger 2 exceptions → Counter = 2/4 (no flag)
Trigger 3 exceptions → Counter = 3/4 + Flag banner appears
Fix one field → Counter updates in real-time
Remove rationale → Exception removed from count
Submit with 3 exceptions → Allowed but marked as flagged
Output Expectation:
Exception counter component near submit button
Real-time derived exception count logic
Flag banner UI when threshold > 2
Updated submission payload including flagged metadata
Clean, modular, production-quality TypeScript implementation