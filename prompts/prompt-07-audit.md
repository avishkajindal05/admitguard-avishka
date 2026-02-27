Role: You are a senior frontend engineer building a production-grade internal admission tool using React + TypeScript + Tailwind CSS. The form already supports strict validation, soft exceptions, exception counter, flagging, and a configurable rules engine.
Objective:
Implement a complete Audit Trail System that logs every successful submission, persists data using localStorage, and provides a dedicated “Audit Log” view with expandable submission details.
Do NOT modify existing validation logic, rules engine, or form UI structure.
Only extend the system with logging, persistence, and audit viewing capabilities.
Core Feature: System-Level Audit Trail
Every successful form submission must be recorded as an immutable audit entry.
Audit Log Data Requirements (Mandatory Fields):
Each log entry must store:
Unique ID (UUID or timestamp-based)
Submission timestamp (ISO format)
Full form data (all 11 fields)
Active exception count
Exception details:
Field name
Rationale text
Flagged status (boolean)
Submission validity snapshot (optional but recommended)
Example Audit Entry Structure (TypeScript Interface):
interface AuditEntry {
id: string;
timestamp: string;
candidateName: string;
formData: Record<string, any>;
exceptionCount: number;
exceptionFields: {
field: string;
rationale: string;
}[];
isFlagged: boolean;
}
Task 1 — Capture Submission Log:
On successful form submission (i.e., strict valid + soft valid/overridden):
Generate a new audit entry object
Include:
All field values entered
Computed exceptionCount
List of fields where exceptions were used
Corresponding rationale text per field
Flagged status (true if exceptionCount > 2)
Append this entry to an audit log array stored in localStorage
LocalStorage Specifications:
Storage key: "admitguard_audit_log"
Use JSON serialization (JSON.stringify / JSON.parse)
Must persist across page refreshes
Must gracefully handle empty or corrupted storage
Task 2 — Create Separate “Audit Log” View/Tab:
Add a new navigation tab labeled: “Audit Log”
This should be a dedicated route or view (e.g., /audit-log or a tab switch).
Audit Log Table Requirements:
Display a responsive table with the following columns:
Candidate Name
Submission Timestamp (formatted readable date/time)
Exception Count (e.g., 2/4)
Flagged Status (Yes/No badge)
Actions (Expand Details button)
Table UI Expectations (Tailwind):
Clean professional table (striped rows optional)
Flagged badge:
Yes → bg-red-100 text-red-700
No → bg-green-100 text-green-700
Use overflow-x-auto for responsiveness
Task 3 — Expandable Details Modal/Drawer:
Each row must include a “View Details” or “Expand” button.
On click:
Open a modal or drawer showing:
Full form data (all 11 fields)
Exception fields + rationale text
Exception count
Flagged status
Exact timestamp
Modal Requirements:
Accessible (aria-modal, focus trap)
Tailwind styling with rounded card layout
Scrollable if content is long
Task 4 — Clear Log Feature (Testing Utility):
Add a “Clear Log” button at the top of the Audit Log view.
Behavior:
On click → show confirmation dialog:
"Are you sure you want to clear all audit logs? This action cannot be undone."
If confirmed:
Remove localStorage key
Reset audit state in UI
If cancelled:
Do nothing
State Management Expectations (React + TypeScript):
Create:
auditLog: AuditEntry[] (state)
loadAuditLog() → loads from localStorage on app init (useEffect)
saveAuditLog(entry: AuditEntry) → append + persist
clearAuditLog() → wipe storage + reset state
Architecture Integration:
Recommended file structure:
/utils/auditStorage.ts → localStorage helpers
/views/AuditLog.tsx → audit table UI
/components/AuditTable.tsx → reusable table component
/components/AuditDetailsModal.tsx → expandable details view
Performance & Data Integrity Constraints:
Do NOT overwrite previous logs on new submission (append only)
Use try/catch when parsing localStorage
Lazy load audit data on Audit Log tab mount (optional optimization)
Avoid re-render loops when syncing storage
Edge Case Handling:
No submissions yet → show empty state: “No audit records found”
Corrupted localStorage → reset safely with fallback
Large logs → ensure table remains scrollable and performant
Page refresh → logs must persist and reload automatically
UX & Accessibility Requirements:
Use aria-live="polite" for log updates
Confirmation dialog must be keyboard accessible
Table buttons must be focusable and screen-reader friendly
No blocking alerts (use modal dialog instead)
Testing Checkpoint (Must Pass):
Submit a clean entry (0 exceptions) → appears in log
Submit entry with 1 exception → correct exception count logged
Submit entry with >2 exceptions → flagged = true in log
Refresh the page → audit log persists
Click “View Details” → full data + rationale visible
Click “Clear Log” → confirmation dialog → logs removed after confirm
Output Expectation:
Fully functional Audit Log view/tab
Persistent localStorage logging system
Expandable submission detail modal
Clear Log with confirmation dialog
Seamless integration with existing exception counter and flagging logic
Clean, modular, production-grade TypeScript code