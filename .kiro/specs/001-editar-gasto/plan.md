# Technical Plan: Edit Existing Expense

**Spec:** `.kiro/specs/001-editar-gasto/spec.md`
**Created:** 2026-05-12
**Last Updated:** 2026-05-12 (updated: atomic write C3, envelope key A1, colSpan C2, accessibility A6, modal states detail, 2s success timeout)
**Stack:** Node.js/Express backend · Single-file React frontend (CDN, no build step)

---

## 1. Overview

Add a `PUT /api/expenses/:id` endpoint to the backend and an edit modal to the frontend. No new npm packages are required. CSV writes use Node's built-in `fs` module.

---

## 2. Backend Changes — `backend/server.js`

### 2.1 Constants

Add the allowed category whitelist near the top of the file:

```js
const ALLOWED_CATEGORIES = [
  "Travel",
  "Meals",
  "Accommodation",
  "Office Supplies",
  "Software",
  "Training",
];
```

### 2.2 Helper: `writeExpenses(records)`

New helper that serialises the in-memory array back to CSV and writes it **atomically** (write to `.tmp` file, then `rename` to final path — prevents partial writes on failure, per spec edge case "CSV write failure"):

```js
async function writeExpenses(records) {
  const header = "id,date,category,description,amount,currency";
  const rows = records.map(
    (r) =>
      `${r.id},${r.date},${r.category},${r.description},${parseFloat(r.amount.toFixed(2))},${r.currency}`,
  );
  const csv = [header, ...rows].join("\n") + "\n";
  const tmpPath = CSV_PATH + ".tmp";
  await fs.promises.writeFile(tmpPath, csv, "utf8");
  await fs.promises.rename(tmpPath, CSV_PATH);
}
```

### 2.3 New Route: `PUT /api/expenses/:id`

Validation order (return first failure):

1. Parse `:id` — must be a positive integer → 400 `"Invalid expense ID"`
2. Required fields present (`date`, `category`, `amount`) → 400 `"Field [name] is required"`
3. Date format `YYYY-MM-DD` → 400 `"Date must be in YYYY-MM-DD format"`
4. Amount positive number → 400 `"Amount must be a positive number"`
5. Category in whitelist → 400 `"Invalid category"`
6. Load CSV, find record → 404 `"Expense not found"`
7. 90-day age check → 400 `"Cannot edit expenses older than 90 days"`
8. Write updated record → 500 `"Failed to update expense"`

Response on success (HTTP 200) — single-record envelope:

```json
{
  "count": 1,
  "total": <amount>,
  "currency": "USD",
  "data": [{ updated record }]
}
```

---

## 3. Frontend Changes — `frontend/index.html`

### 3.1 Styles

Add modal overlay, modal box, form field, error/success message, and button styles inside the existing `<style>` block.

**Accessibility requirements (NFR):**

- Each field must have a visible `<label>` with matching `htmlFor`/`id`
- Error messages must use `aria-describedby` linking the message to its field
- Error indicators must include a text message — never color alone
- All interactive elements (buttons, inputs, close ×) must be reachable via Tab and activatable via Enter/Space
- Modal close via Escape key must be supported
- Color contrast must meet WCAG AA minimum (4.5:1 for normal text)

### 3.2 State additions to `App`

| State variable   | Type   | Purpose                                  |
| ---------------- | ------ | ---------------------------------------- |
| `editingExpense` | object | The expense being edited (null = closed) |
| `editForm`       | object | Controlled form values                   |
| `editErrors`     | object | Per-field validation error messages      |
| `editSaving`     | bool   | True while PUT request is in-flight      |
| `editApiError`   | string | API-level error message                  |
| `editSuccess`    | bool   | True after successful save               |

### 3.3 Functions

- `openEditModal(expense)` — sets `editingExpense`, pre-populates `editForm`, checks 90-day lock
- `closeEditModal()` — resets all edit state
- `validateEditForm()` — returns errors object; validates date format, positive amount, required fields
- `handleEditSave()` — validates, calls `PUT /api/expenses/:id`, updates list on success
- `handleEditFieldChange(field, value)` — updates `editForm`, clears field error on change

### 3.4 Table changes

Add an "Edit" column header and an `<button>` in each row that calls `openEditModal(expense)`.

### 3.5 Modal component (inline JSX)

States handled: editable, locked (≥90 days), saving, success, API error.

- **Editable:** fields enabled, Save + Cancel visible
- **Locked:** all fields disabled, Save hidden, error banner shown
- **Saving:** fields disabled, Save shows loading indicator, double-submit prevented
- **Success:** "Expense updated successfully" displayed, modal closes after 2-second timeout (`setTimeout(closeEditModal, 2000)`)
- **API error:** non-blocking error message shown, form stays open with user input intact

Note: there is no async loading state for opening the modal — the expense data is already in frontend state and pre-populates the form synchronously.

Fields: Date (text input), Category (dropdown — allowed values from `ALLOWED_CATEGORIES`), Amount (number input), Description (text input, optional).

---

## 4. Data Integrity

- `id` and `currency` are never accepted from the request body.
- `id` is derived from the URL param; `currency` is preserved from the existing CSV row.
- Amount is stored as `parseFloat(amount.toFixed(2))`.
- Description may be empty string — preserved as-is.

---

## 5. Security Checklist

- All inputs validated server-side (FR-07).
- No stack traces or file paths in error responses.
- Description rendered via React (no `dangerouslySetInnerHTML`).
- Category validated against whitelist on both frontend (dropdown) and backend.

---

## 6. Manual Verification Steps

1. Start backend: `cd backend && npm start`
2. Open `frontend/index.html` in browser.
3. Click "Edit" on any expense row — modal opens pre-populated.
4. Change amount to `-5` → "Amount must be a positive number" shown, Save disabled.
5. Fix amount, clear date → "Date is required" shown.
6. Fill all valid fields, click Save → success message, list updates.
7. Try editing an expense with a date > 90 days ago → fields disabled, Save hidden.
8. Use DevTools to `PUT /api/expenses/999` → 404 response.
9. Use DevTools to `PUT /api/expenses/abc` → 400 "Invalid expense ID".
