# Feature Specification: Edit Existing Expense

**Spec ID:** 001-editar-gasto
**Status:** Draft
**Source:** US-001 — Editar Gasto Existente
**Created:** 2026-05-12
**Last Updated:** 2026-05-12 (clarified: RD-01 category whitelist, RD-02 modal dialog; resolved: A1 envelope key, A2 category example, A3 error messages, A4 loading state, A6 accessibility tasks, A11/A12 EARS + GIVEN-WHEN-THEN)

---

## Summary

Finance Managers currently have no way to correct or reclassify expense records after they are created. This feature adds the ability to edit any expense that is less than 90 days old, allowing correction of data entry errors and reclassification when accounting categories change. The 90-day limit enforces the monthly accounting close policy (BR-001). The feature requires a new write endpoint on the backend and an edit form in the frontend.

---

## Actors

- **Finance Manager:** The sole user of this internal tool. Browses the expense list, selects a record to edit, modifies one or more fields, and saves the changes.

---

## User-Facing Goals

- As a Finance Manager, I want to edit the date, category, amount, or description of an existing expense so that I can correct data entry errors.
- As a Finance Manager, I want to reclassify an expense to a different category so that reports reflect the correct accounting structure.
- As a Finance Manager, I want to receive immediate feedback when I enter invalid data so that I can correct it before saving.
- As a Finance Manager, I want the expense totals to update automatically after a successful edit so that the summary always reflects current data.

---

## Out of Scope

- Change history / audit log of edits
- Bulk editing of multiple expenses at once
- Role-based permissions (only one role exists: Finance Manager)
- Notifications to other users when an expense is changed
- Undo / redo functionality
- Deleting expenses
- Creating new expenses (separate feature)
- Editing expenses older than 90 days (blocked by accounting close policy)

---

## Functional Requirements

### FR-01 — Open edit form (maps to AC-01)

When the Finance Manager selects an expense that is less than 90 days old, the system shall display an edit form pre-populated with the current values of all fields (date, category, amount, description).

### FR-02 — Save valid changes (maps to AC-01)

When the Finance Manager submits the edit form with valid data, the system shall persist the updated expense and display a success confirmation message "Expense updated successfully".

### FR-03 — Validate amount (maps to AC-02)

When the Finance Manager enters an amount that is negative, zero, or non-numeric, the system shall display a visual error indicator on the amount field with the message "Amount must be a positive number" and prevent saving until the value is corrected.

### FR-04 — Validate category against allowed list (maps to AC-03)

When the Finance Manager attempts to save with the category field empty or set to a value not in the allowed category list, the system shall display a visual error indicator on the category field with the message "Field category is required" (if empty) or "Invalid category" (if not in the allowed list) and prevent saving.

The allowed category list is: **Travel, Meals, Accommodation, Office Supplies, Software, Training**. This list is validated on both frontend (dropdown selector) and backend (whitelist check). New categories may only be added by amending this spec.

When the Finance Manager attempts to save with any other required field (date, amount) left empty, the system shall display a visual error indicator on each empty required field with a field-specific message and prevent saving.

### FR-05 — Block editing of expenses older than 90 days (maps to AC-04)

When the Finance Manager attempts to open an expense whose date is more than 90 days before today, the system shall display the message "Cannot edit expenses older than 90 days", disable all input fields, and hide the Save button.

### FR-06 — Recalculate totals after edit (maps to AC-05)

When an expense is successfully saved, the system shall recalculate and display the updated total amount and expense count in the expense list view.

### FR-07 — Server-side validation

The backend endpoint shall independently validate all incoming fields (date format, positive amount, required fields, 90-day restriction) and return a 400 response with a descriptive error message if any validation fails, regardless of frontend validation state.

### FR-08 — Preserve unchanged fields

When the Finance Manager edits only a subset of fields, the system shall preserve the values of all unmodified fields (including `id` and `currency`) exactly as they were stored.

### FR-09 — Validate date format

The system shall reject any date value that does not conform to the YYYY-MM-DD format and display an error message "Date must be in YYYY-MM-DD format".

---

## Non-Functional Requirements

- **Performance:** The edit operation (submit to confirmation) shall complete within 2 seconds under normal conditions. The CSV file shall be read only once per request.
- **Accessibility:** The edit form must be fully keyboard-navigable. All form fields must have visible labels. Error messages must be associated with their respective fields (ARIA or equivalent). Color alone must not be the sole error indicator — a text message is always required. Contrast must meet WCAG AA minimum.
- **Security:** All input fields must be validated server-side (per `security.md` § 3.1). The API response must never expose file system paths, stack traces, or internal error details (per `security.md` § 4.3). Description field content must be rendered safely to prevent XSS (per `security.md` § 3.3).
- **Compatibility:** Must work in current-generation evergreen browsers (Chrome, Firefox, Edge, Safari). No build step may be introduced. No new npm dependencies may be added unless justified in this spec.
- **Data integrity:** The CSV write operation must replace only the target row. All other rows must remain byte-for-byte identical. The `id` and `currency` fields must never be modified by this operation.

---

## API Design

### New Endpoint: PUT /api/expenses/:id

**Purpose:** Update a single expense record identified by its numeric `id`.

**Request body (JSON):**

```json
{
  "date": "YYYY-MM-DD",
  "category": "string",
  "amount": 0.0,
  "description": "string"
}
```

**Success response — HTTP 200:**

```json
{
  "count": 1,
  "total": 30.0,
  "currency": "USD",
  "data": [
    {
      "id": 1,
      "date": "2026-05-01",
      "category": "Travel",
      "description": "Lunch",
      "amount": 30.0,
      "currency": "USD"
    }
  ]
}
```

The `data` array contains the single updated record. `count` and `total` reflect only that record (consistent with the envelope pattern in `architecture.md` § 2.2).

**Error responses:**

| HTTP Status | Condition                     | Error message                             |
| ----------- | ----------------------------- | ----------------------------------------- |
| 400         | Missing required field        | "Field [name] is required"                |
| 400         | Amount ≤ 0 or non-numeric     | "Amount must be a positive number"        |
| 400         | Invalid date format           | "Date must be in YYYY-MM-DD format"       |
| 400         | Category not in allowed list  | "Invalid category"                        |
| 400         | Expense older than 90 days    | "Cannot edit expenses older than 90 days" |
| 400         | Invalid ID type (non-integer) | "Invalid expense ID"                      |
| 404         | ID not found in CSV           | "Expense not found"                       |
| 500         | CSV read/write failure        | "Failed to update expense"                |

All error responses follow the shape: `{ "error": "message" }`. No stack traces or file paths are ever included.

**Constraint:** The `id` and `currency` fields are not accepted in the request body and must be ignored if present. The backend derives `id` from the URL parameter and preserves `currency` from the existing record.

---

## UI/UX Requirements

### Edit Form Placement

The edit form shall be presented as a **modal dialog**. When the Finance Manager clicks the "Edit" button on an expense row, a modal overlay opens centered on the screen, with the expense list visible but non-interactive in the background. The modal closes when the user clicks "Save" (on success), "Cancel", or the close affordance (×). No routing or layout changes are required.

### Edit Entry Point

Each expense row in the expense list shall include an "Edit" button or affordance. The affordance must be keyboard-accessible (focusable, activatable with Enter/Space).

### Edit Form States

**Editable state (expense < 90 days old):**

- Form displays pre-populated values for: date, category, amount, description.
- "Save" button is visible and enabled (when no validation errors are present).
- "Cancel" button is visible and returns the user to the list without saving.

**Locked state (expense ≥ 90 days old):**

- All input fields are disabled (read-only).
- "Save" button is hidden.
- Error banner displays: "Cannot edit expenses older than 90 days".
- "Cancel" / "Close" button is visible.

**Validation error state:**

- Each invalid field shows a visual error indicator (e.g., red border) and an inline error message.
- The "Save" button is disabled while any validation error is present.
- Error indicators clear as soon as the field value becomes valid.

**Saving state (in-flight):**

- "Save" button shows a loading indicator and is disabled to prevent double-submission.
- Form fields are disabled during the save operation.

**Success state:**

- A success message "Expense updated successfully" is displayed.
- The expense list reflects the updated values and recalculated totals.
- The edit form closes after a 2-second confirmation period.

**API error state:**

- A non-blocking error message is displayed (e.g., "Failed to save. Please try again.").
- The form remains open with the user's input intact so they can retry.

### Field Validation Rules (UI)

| Field       | Required | Input type                                                                   | Validation rule                           | Error message                                            |
| ----------- | -------- | ---------------------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------- |
| Date        | Yes      | Text input                                                                   | YYYY-MM-DD format, not empty              | "Date is required" / "Date must be in YYYY-MM-DD format" |
| Category    | Yes      | Dropdown (Travel, Meals, Accommodation, Office Supplies, Software, Training) | Must select a value from the allowed list | "Field category is required" / "Invalid category"        |
| Amount      | Yes      | Numeric input                                                                | Positive number > 0                       | "Amount must be a positive number"                       |
| Description | No       | Text input                                                                   | No constraint                             | —                                                        |

---

## Data Model Considerations

The existing CSV structure is preserved exactly:

```
id, date, category, description, amount, currency
```

**Write strategy:** The backend reads the entire CSV into memory, finds the row matching the given `id`, replaces only the editable fields (date, category, description, amount), then writes the full updated array back to the CSV file. The `id` and `currency` columns are never modified.

**Concurrency note:** The CSV file is not suitable for concurrent writes (`architecture.md` § 8.1). This is an accepted limitation for the current phase. The write operation is synchronous within a single request; no locking mechanism is required at this scale.

**Numeric precision:** Amounts are stored as floats with up to 2 decimal places (e.g., `30.00`). The backend must use `parseFloat(amount.toFixed(2))` before writing to maintain consistency with existing records.

---

## Edge Cases & Error Handling

- **Expense not found:** If the `id` in the URL does not match any record in the CSV, the endpoint returns HTTP 404 with `{ "error": "Expense not found" }`.
- **Exactly 90 days old:** An expense whose date is exactly 90 days before today is considered within the editable window (the restriction applies to expenses _older than_ 90 days, i.e., `age > 90`).
- **Empty description:** Description is optional. An empty string is a valid value and must be preserved as an empty field in the CSV (not omitted).
- **Amount with many decimals:** Amounts with more than 2 decimal places (e.g., `25.999`) must be rounded to 2 decimal places before saving.
- **CSV write failure:** If the file write fails (e.g., permissions error), the endpoint returns HTTP 500 with a generic message. The original CSV must not be left in a partially written state — the write should target a complete replacement of the file content.
- **Concurrent edits:** Two simultaneous edits to the same expense may result in one overwriting the other. This is an accepted limitation documented in `architecture.md` § 8.1.
- **Invalid ID type:** If `:id` in the URL is not a positive integer, the endpoint returns HTTP 400 with `{ "error": "Invalid expense ID" }`.
- **Loading state:** The modal opens immediately pre-populated with data already available in the frontend state — no additional fetch is required. There is no async loading state for the edit form itself.
- **Empty expense list:** Not directly affected by this feature, but the list view must continue to handle the empty state correctly after an edit.

---

## Assumptions

- The `currency` field is always `"USD"` for all existing records and will remain `"USD"` for edited records. Currency editing is out of scope.
- The 90-day age calculation is based on the expense's `date` field compared to the server's current date (UTC). Timezone handling is server-side only.
- No new npm packages are required. The existing `csv-parser` package handles reads; writes will use Node's built-in `fs` module.
- The `id` field is a unique positive integer. Duplicate IDs in the CSV are treated as a data integrity issue outside the scope of this feature.

---

## Resolved Decisions

### RD-01 — Category validation: fixed allowed list

**Decision:** The category field is validated against a fixed allowed list on both frontend and backend.

**Allowed values:** Travel, Meals, Accommodation, Office Supplies, Software, Training

**Rationale:**

- `security.md` § 3.1 explicitly requires validating category values against an allowed list — this is a mandatory security control, not optional.
- The `GET /api/expenses/summary` endpoint groups by category string; free-text input would cause data fragmentation (e.g., "travel" vs "Travel" appearing as separate categories in reports).
- The 6 categories already present in `expenses.csv` form a natural, stable baseline. The list is small enough to maintain.
- YAGNI is satisfied: the list is derived from existing data, not invented. No new infrastructure is needed — a dropdown on the frontend and a whitelist check on the backend are minimal additions.
- New categories can be added by amending this spec (per `security.md` § 11 amendment process).

**Impact on spec:** FR-04 updated to require whitelist validation; API error table updated with 400 for invalid category; UI field validation table updated to show dropdown input type.

---

### RD-02 — Edit form placement: modal dialog

**Decision:** The edit form is presented as a modal dialog overlay.

**Rationale:**

- The frontend is a single HTML file with no build step and no component library. A modal is straightforward to implement in vanilla React without routing or layout changes.
- A modal keeps the expense list visible in the background, which is better UX than hiding it (inline expansion can be visually cramped for 4 fields; a side panel is over-engineered for this stack).
- Modal is the standard pattern for edit forms in single-page apps and is well understood by users.
- YAGNI: modal requires the least structural change to the existing single-file layout.

**Impact on spec:** UI/UX Requirements section updated with explicit modal placement description.

---

## Acceptance Criteria

### AC-01 — Edit valid expense

**EARS:** When the Finance Manager submits the edit form with valid data for an expense less than 90 days old, the system shall persist the updated values and display the message "Expense updated successfully".

```gherkin
GIVEN an expense exists with id=1, date within the last 90 days
  AND the Finance Manager opens the edit modal for that expense
  AND the form is pre-populated with the current values
WHEN the Finance Manager changes the amount to 45.00 and clicks Save
THEN the system shall send PUT /api/expenses/1 with the updated data
  AND the system shall display "Expense updated successfully"
  AND the expense list shall reflect the new amount
  AND the total shall be recalculated
```

---

### AC-02 — Validate positive amount

**EARS:** When the Finance Manager enters an amount that is zero, negative, or non-numeric, the system shall display "Amount must be a positive number" on the amount field and shall disable the Save button until the value is corrected.

```gherkin
GIVEN the edit modal is open for a valid expense
WHEN the Finance Manager clears the amount field and enters "-5"
THEN the system shall display "Amount must be a positive number" below the amount field
  AND the Save button shall be disabled
WHEN the Finance Manager corrects the amount to "45.00"
THEN the error message shall disappear
  AND the Save button shall be re-enabled
```

---

### AC-03 — Validate required fields

**EARS:** When the Finance Manager attempts to save with the category field empty, the system shall display "Field category is required" and shall prevent saving. Where the category value is not in the allowed list, the system shall display "Invalid category" and shall prevent saving.

```gherkin
GIVEN the edit modal is open for a valid expense
WHEN the Finance Manager clears the date field and clicks Save
THEN the system shall display "Date is required" below the date field
  AND the save request shall not be sent

GIVEN the edit modal is open for a valid expense
WHEN the Finance Manager submits with a category not in the allowed list via the API directly
THEN the backend shall return HTTP 400 with { "error": "Invalid category" }
```

---

### AC-04 — Block edits older than 90 days

**EARS:** When the Finance Manager opens the edit modal for an expense whose date is more than 90 days before today, the system shall display "Cannot edit expenses older than 90 days", shall disable all input fields, and shall hide the Save button.

```gherkin
GIVEN an expense exists with a date 91 days ago
WHEN the Finance Manager clicks the Edit button for that expense
THEN the modal shall open with all fields disabled
  AND the Save button shall not be visible
  AND the message "Cannot edit expenses older than 90 days" shall be displayed
  AND the Cancel/Close button shall be visible and functional

GIVEN an expense exists with a date exactly 90 days ago
WHEN the Finance Manager clicks the Edit button for that expense
THEN the modal shall open in editable state (not locked)
```

---

### AC-05 — Recalculate totals after edit

**EARS:** When an expense is successfully saved, the system shall recalculate and display the updated total amount and expense count in the expense list view.

```gherkin
GIVEN the expense list shows a total of $500.00 across 10 expenses
  AND one expense has amount $50.00
WHEN the Finance Manager edits that expense and changes the amount to $100.00
  AND clicks Save successfully
THEN the expense list total shall update to $550.00
  AND the expense count shall remain 10
```

---

## Traceability

| Acceptance Criterion             | Functional Requirement | Scenario   |
| -------------------------------- | ---------------------- | ---------- |
| AC-01 — Edit valid expense       | FR-01, FR-02, FR-08    | Scenario 1 |
| AC-02 — Validate positive amount | FR-03, FR-07           | Scenario 2 |
| AC-03 — Validate required fields | FR-04, FR-07, FR-09    | Scenario 3 |
| AC-04 — Block edits > 90 days    | FR-05, FR-07           | Scenario 4 |
| AC-05 — Recalculate totals       | FR-06                  | Scenario 5 |

---

## Constitution Compliance

| Principle                                | Status | Notes                                                                |
| ---------------------------------------- | ------ | -------------------------------------------------------------------- |
| No implementation details in spec        | ✅     | No framework names, no code structure                                |
| Loading / empty / error states addressed | ✅     | All five UI states defined                                           |
| YAGNI — no scope creep                   | ✅     | Out of scope list is explicit                                        |
| API contract follows envelope pattern    | ✅     | PUT /api/expenses/:id response defined                               |
| Server-side input validation             | ✅     | FR-07 and security section; category whitelist per security.md § 3.1 |
| No file paths / stack traces in errors   | ✅     | Error table specifies generic messages                               |
| No database introduced                   | ✅     | CSV write strategy documented                                        |
| No build step introduced                 | ✅     | Assumption documented                                                |
| Accessibility addressed                  | ✅     | Non-functional requirements section                                  |
| No open questions remain                 | ✅     | RD-01 and RD-02 resolved; decisions documented in Resolved Decisions |
