Here are the prompts, ordered by priority and scoped precisely so AI Studio doesn't break existing code.

---

## Prompt A — Fix FR-2a + FR-4a + "All fields required before submit"
*(One prompt — these are all submission gate logic, same layer)*

```
Role: You are a senior frontend engineer maintaining a production-grade React + TypeScript + Tailwind admission form. The app already has strict validation, soft exceptions, exception counter, audit log, and localStorage persistence. Do NOT redesign the UI. Do NOT change any existing validation rules. Only apply the three targeted fixes below.

---

FIX 1 — Email Uniqueness (FR-2a)
The email field currently only validates format. It must also check for duplicates against previously submitted entries in localStorage.

Rules:
- On onChange and onBlur for the email field, load the audit log from localStorage key "admitguard_audit_log"
- Parse the JSON array and check if any entry's candidateData.email matches the current email value (case-insensitive)
- If a duplicate is found, show a strict inline red error below the email field:
  "This email has already been submitted. Duplicate entries are not allowed."
- This error must block submission (treat it as a strict validation failure — add it to the errors state)
- If no duplicate is found, clear this error

Do NOT modify any other field's validation logic.

---

FIX 2 — Exception Toggle Must Be Manual (FR-4a)
Currently, a useEffect in AdmissionForm.tsx automatically sets enabled: true for every soft warning as soon as it appears. This is wrong — the operator must manually toggle the exception checkbox.

Fix:
- In AdmissionForm.tsx, find the useEffect that synchronizes softWarnings with exceptionStates
- Remove the line that auto-sets enabled: true for new warnings
- When a new soft warning appears, initialize its exceptionState as: { enabled: false, rationale: '', rationaleError: '' }
- The "Request Exception" checkbox in FormField.tsx already exists — it just needs to start unchecked
- When a soft warning resolves (field becomes valid), still clean up the exceptionState entry as before
- Submission must remain blocked for any soft violation where the operator has NOT manually toggled the exception checkbox AND provided valid rationale

Do NOT change the rationale validation logic. Do NOT change the counter or flagging logic.

---

FIX 3 — All Fields Must Be Filled Before Submission
Currently, soft fields (DOB, Graduation Year, Percentage/CGPA, Screening Score) are not required — a user can leave them blank and submit if no warning fires.

Fix:
- Add these four soft fields to the required fields check inside the isFormValid computed selector in AdmissionForm.tsx
- Required fields list should now include: fullName, email, phone, highestQualification, aadhaarNumber, interviewStatus, dob, graduationYear, percentageOrCgpa, screeningScore
- offerLetterSent is a boolean toggle (defaults to false/"No") — it is already considered filled
- If any of the above fields is empty/blank, the submit button must remain disabled
- Do NOT show a red strict error for blank soft fields — just keep submit disabled until they are filled

Do NOT change validation rule logic, warning behavior, or exception flows.

---

Testing checklist (verify all three fixes work before committing):
1. Submit a candidate → note the email → reset form → enter the same email → confirm duplicate error appears inline and submit is blocked
2. Enter a DOB that fails the age rule → confirm the "Request Exception" checkbox starts UNCHECKED → confirm submit is blocked → manually check it → enter valid rationale → confirm submit is now allowed
3. Leave Graduation Year blank → confirm submit stays disabled → enter a value → confirm submit gate re-evaluates correctly
4. All 11 fields filled validly → submit should be enabled

Commit message after fix: sprint-3: email uniqueness, manual exception toggle, all fields required
```

---

## Prompt B — Fix FR-10a + FR-10b (Real Dashboard Data + Chart)
*(One prompt — both are Dashboard.tsx only)*

```
Role: You are a senior frontend engineer. The Dashboard view in this React + TypeScript app currently has two placeholder issues. Fix both without touching any other file.

Context:
- The app has a submissions array in AppContext (loaded from localStorage)
- Each submission has: id, timestamp, candidateData, exceptionCount, exceptions (array of {field, rationale}), flagged (boolean)
- The Dashboard already correctly shows 4 KPI cards using this data

---

FIX 1 — Exception Distribution (real data, not Math.random())
The "Exception Distribution" card currently uses Math.random() for both the percentage labels and bar widths. Replace with real computed data.

Requirements:
- The 4 soft fields that can have exceptions are: dob, graduationYear, percentageOrCgpa, screeningScore
- Display labels: "Date of Birth", "Graduation Year", "Score / CGPA", "Screening Score"
- For each field, count how many submissions have an exception on that field (i.e., check submission.exceptions array for entries where ex.field === fieldName)
- Calculate each field's percentage as: (count / totalSubmissions) * 100, rounded to 1 decimal
- If totalSubmissions === 0, show 0% for all
- Render the bar width as a percentage of the max value among the four fields (so the highest always reaches ~100% of bar width)
- Display the actual count and percentage next to each bar label
- No Math.random() anywhere in this component

---

FIX 2 — Enrollment Trends Chart
Replace the empty dashed placeholder with a real bar chart using recharts (already in package.json dependencies).

Requirements:
- Show submission count per day for the last 7 days (including days with 0 submissions)
- X-axis: day labels formatted as "Mon", "Tue", etc. (use date-fns format, already a dependency)
- Y-axis: submission count (integer, min 0)
- Use a BarChart from recharts with Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
- Bar color: #2563EB (matches primary accent)
- If no submissions exist, show all 7 days with 0 height bars (do not show empty state — the chart itself is the empty state)
- Keep the card title "Enrollment Trends" and subtitle "Submission volume over the last 7 days"

Do NOT modify AppContext, submission logic, audit log, or any other component.

Commit message after fix: sprint-3: dashboard real data and recharts enrollment trend
```

---

## Prompt C — FR-11 Export to CSV/JSON
*(Audit Log view only)*

```
Role: You are a senior frontend engineer. Add a data export feature to the Audit Log view in this React + TypeScript + Tailwind app. Do NOT modify any other view or component.

Requirements:
Add two export buttons next to the existing "Clear Log" and "Filter" buttons in the AuditLog.tsx header row:
- "Export CSV" button
- "Export JSON" button

Export JSON behavior:
- Download the full submissions array as a .json file
- Filename: admitguard-audit-{YYYY-MM-DD}.json (use today's date)
- Pretty-printed JSON (JSON.stringify with 2-space indent)
- Include all fields: id, timestamp, candidateData (all 11 fields), exceptionCount, exceptions, flagged

Export CSV behavior:
- Download as a .csv file
- Filename: admitguard-audit-{YYYY-MM-DD}.csv
- Headers row: ID, Timestamp, Full Name, Email, Phone, DOB, Qualification, Grad Year, Score, Screening Score, Interview Status, Aadhaar, Offer Letter Sent, Exception Count, Flagged, Exception Fields, Exception Rationales
- Exception Fields: pipe-separated list of field names that had exceptions (e.g., "dob|graduationYear")
- Exception Rationales: pipe-separated list of corresponding rationale texts
- Wrap all values in double quotes to handle commas in text

Implementation:
- Use a plain browser download via: URL.createObjectURL(new Blob([content], {type: 'text/csv'})) and a temporary <a> tag — no external libraries
- If submissions array is empty, show a brief inline message "No data to export" instead of downloading an empty file — use a non-blocking inline text near the buttons, not an alert

Button styling: match the existing "Clear Log" button style (border, bg, text, hover) but use neutral gray, not red

Do NOT add export to the Dashboard. Do NOT modify localStorage logic.

Commit message after fix: sprint-4: CSV and JSON export from audit log
```

---

## Prompt D — FR-12 Light/Dark Mode
*(Last — purely cosmetic, do this only if time allows)*

```
Role: You are a senior frontend engineer. Add a light/dark mode toggle to this React + TypeScript + Tailwind CSS v4 app. This is a cosmetic feature — do NOT touch any validation, form, audit, or dashboard logic.

Requirements:
- Add a sun/moon icon toggle button to the right side of the Header component, before the notification bell
- Use a darkMode boolean in AppContext (add it alongside currentView — do NOT create a separate context)
- Persist the preference to localStorage key "admitguard_dark_mode" and load it on app init
- When darkMode is true, add the class "dark" to the <html> element (document.documentElement)
- Use Tailwind's dark: variant classes for theme switching

Dark mode color mappings:
- Page background: #F8F9FB → #0F172A
- Card background: white → #1E293B
- Card border: #EAECEF → #334155
- Primary text: #1F2937 → #F1F5F9
- Secondary text: #4B5563 → #94A3B8
- Sidebar background: #F8F9FB → #1E293B
- Sidebar border: #EAECEF → #334155
- Header background: white/80 → #1E293B/80
- Input background: white → #0F172A
- Input border: #D1D5DB → #334155

Use the lucide-react Sun and Moon icons (already in dependencies).
The toggle icon should show Moon when in light mode (click to go dark) and Sun when in dark mode (click to go light).

Do NOT break any existing Tailwind utility classes. Do NOT modify index.css theme variables — add dark: prefixed classes directly on elements.

Commit message: sprint-4: light/dark mode toggle
```

---

**Run order:** A → B → C → D (stop at C if time is tight — D is purely cosmetic and won't affect your rubric score meaningfully). A is the only one that touches Must Have requirements.