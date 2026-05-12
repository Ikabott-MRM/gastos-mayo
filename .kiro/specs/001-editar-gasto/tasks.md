# Task List: Edit Existing Expense (001-editar-gasto)

**Plan:** `.kiro/specs/001-editar-gasto/plan.md`
**Spec:** `.kiro/specs/001-editar-gasto/spec.md`

---

## Phase 1 — Backend: PUT /api/expenses/:id

- [ ] 1.1 Add `ALLOWED_CATEGORIES` constant to `backend/server.js`
- [ ] 1.2 Add `writeExpenses(records)` helper to `backend/server.js`
- [ ] 1.3 Add `PUT /api/expenses/:id` route with full validation and CSV write
- [ ] 1.4 Verify: start server, test endpoint with curl/DevTools for happy path and all error cases

---

## Phase 2 — Frontend: Edit Modal

- [ ] 2.1 Add modal and form CSS styles to `frontend/index.html`
- [ ] 2.2 Add edit state variables to `App` component
- [ ] 2.3 Add `openEditModal`, `closeEditModal`, `validateEditForm`, `handleEditSave`, `handleEditFieldChange` functions
- [ ] 2.4 Add "Edit" column and button to the expense table rows
- [ ] 2.5 Add modal JSX (all states: editable, locked, saving, success, API error)
- [ ] 2.6 Verify: open modal, test all form states, confirm list updates after save

---

## Phase 3 — Integration & Edge Cases

- [ ] 3.1 Verify 90-day lock: expense with old date shows locked state in modal
- [ ] 3.2 Verify totals recalculate after successful edit (FR-06)
- [ ] 3.3 Verify `id` and `currency` are never modified
- [ ] 3.4 Verify empty description is preserved correctly
- [ ] 3.5 Verify amount rounding to 2 decimal places (e.g., 25.999 → 26.00)
