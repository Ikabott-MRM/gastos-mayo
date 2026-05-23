# Task List: Edit Existing Expense (001-editar-gasto)

**Plan:** `.kiro/specs/001-editar-gasto/plan.md`
**Spec:** `.kiro/specs/001-editar-gasto/spec.md`

---

## Phase 1 — Backend: PUT /api/expenses/:id

- [x] 1.1 Add `ALLOWED_CATEGORIES` constant to `backend/server.js`
- [x] 1.2 Add `writeExpenses(records)` helper to `backend/server.js` — must use atomic write: write to `CSV_PATH + ".tmp"` then `fs.promises.rename` to `CSV_PATH` to prevent partial writes on failure
- [x] 1.3 Add `PUT /api/expenses/:id` route with full validation and CSV write
- [x] 1.4 Verify: start server, test endpoint with curl/DevTools for happy path and all error cases

---

## Phase 2 — Frontend: Edit Modal

- [x] 2.1 Add modal and form CSS styles to `frontend/index.html`
- [x] 2.2 Add edit state variables to `App` component
- [x] 2.3 Add `openEditModal`, `closeEditModal`, `validateEditForm`, `handleEditSave`, `handleEditFieldChange` functions
- [x] 2.4 Add "Edit" column and button to the expense table rows — update `<thead>` to include `<th>Actions</th>` (already added) and add `<button>` per row calling `openEditModal(expense)`; verify `colSpan` on empty-state row is 5 (already updated)
- [x] 2.5 Add modal JSX (all states: editable, locked, saving, success, API error); on success state close modal after 2-second timeout (per spec § Edit Form States)
- [x] 2.6 Verify: open modal, test all form states, confirm list updates after save
- [x] 2.7 Accessibility: ensure all form fields have visible `<label>` elements, error messages use `aria-describedby` to associate with their field, error indicators use text (not color alone), all interactive elements are keyboard-navigable (Tab, Enter, Space, Escape to close), and contrast meets WCAG AA minimum

---

## Phase 3 — Integration & Edge Cases

- [x] 3.1 Verify 90-day lock: expense with old date shows locked state in modal
- [x] 3.2 Verify totals recalculate after successful edit (FR-06)
- [x] 3.3 Verify `id` and `currency` are never modified
- [x] 3.4 Verify empty description is preserved correctly
- [x] 3.5 Verify amount rounding to 2 decimal places (e.g., 25.999 → 26.00)
