# Developer Practices

**Version:** 1.0.0  
**Owner:** Dev Chapter Lead  
**Last Updated:** 2026-05-11

---

## Purpose

This document defines development standards, coding conventions, and engineering practices for all implementations. All code **MUST** comply with these standards.

---

## 1. Role in SDD Pipeline

Developers transform specs into working code:

```
BA validates spec
       ↓
Dev runs speckit-plan → plan.md
       ↓
Dev runs speckit-tasks → tasks.md
       ↓
Dev runs speckit-analyze → validate consistency
       ↓
Dev runs speckit-implement → working code
       ↓
QA validates against acceptance criteria
```

### 1.1 Primary Responsibilities

- Create technical design from validated specs using `speckit-plan`
- Break down design into executable tasks using `speckit-tasks`
- Implement features following the task list
- Write clean, maintainable code following project conventions
- Ensure code complies with `architecture.md` and `security.md`
- Collaborate with BA to clarify requirements
- Support QA with test environment and debugging

### 1.2 Collaboration Points

- **With BA:** Clarify requirements, explain technical constraints
- **With PO:** Demo completed features, explain technical tradeoffs
- **With QA:** Provide test data, fix defects, explain implementation
- **With Other Devs:** Code reviews, pair programming, knowledge sharing

---

## 2. Code Standards

### 2.1 JavaScript Style

**General conventions:**

- Use `const` by default, `let` when reassignment is needed, never `var`
- Use async/await for asynchronous code (no callbacks or raw promises)
- Use arrow functions for callbacks and short functions
- Use template literals for string interpolation
- Use destructuring for object and array access

**Naming conventions:**

```javascript
// Variables and functions: camelCase
const userName = "John";
function getUserData() {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = "https://api.example.com";

// Classes: PascalCase
class ExpenseCalculator {}

// Private methods: prefix with underscore
class Service {
  _privateMethod() {}
}

// Boolean variables: prefix with is/has/should
const isValid = true;
const hasPermission = false;
const shouldRetry = true;
```

**File naming:**

- Backend files: `kebab-case.js` (e.g., `expense-service.js`)
- Frontend components: `PascalCase.jsx` (if components are extracted)
- Configuration files: `lowercase.json` (e.g., `package.json`)

### 2.2 Code Organization

**Backend structure:**

```javascript
// server.js or route files
const express = require("express");
const router = express.Router();

// 1. Imports
const { readExpenses, calculateTotal } = require("./helpers");

// 2. Constants
const PORT = 3001;
const CSV_PATH = "./expenses.csv";

// 3. Helper functions (or import from separate file)
async function readExpenses() {
  // implementation
}

// 4. Route handlers
router.get("/api/expenses", async (req, res) => {
  // delegate to helpers, keep handler thin
});

// 5. Server setup
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Frontend structure (single-file React):**

```javascript
// 1. Component definition
function ExpenseApp() {
  // 2. State declarations
  const [expenses, setExpenses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // 3. Effects
  React.useEffect(() => {
    fetchExpenses();
  }, []);

  // 4. Event handlers
  const handleFilterChange = (category) => {
    // implementation
  };

  // 5. Helper functions
  const formatCurrency = (amount) => {
    // implementation
  };

  // 6. Render
  return <div>{/* JSX */}</div>;
}
```

### 2.3 Function Design

**Keep functions focused:**

```javascript
// ❌ Bad: function does too much
async function getExpensesAndCalculateTotalAndFilter(category) {
  const expenses = await readCSV();
  const filtered = expenses.filter((e) => e.category === category);
  const total = filtered.reduce((sum, e) => sum + e.amount, 0);
  return { expenses: filtered, total };
}

// ✅ Good: separate concerns
async function readExpenses() {
  return await readCSV();
}

function filterByCategory(expenses, category) {
  return expenses.filter((e) => e.category === category);
}

function calculateTotal(expenses) {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}
```

**Function length:**

- **SHOULD** keep functions under 50 lines
- **SHOULD** extract complex logic into helper functions
- **MUST** have a single, clear responsibility

### 2.4 Error Handling

**Backend error handling:**

```javascript
// ✅ Good: consistent error handling
router.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await readExpenses();
    res.json({
      count: expenses.length,
      total: calculateTotal(expenses),
      currency: "USD",
      expenses,
    });
  } catch (error) {
    console.error("Error reading expenses:", error);
    res.status(500).json({
      error: "Failed to retrieve expenses",
    });
  }
});
```

**Frontend error handling:**

```javascript
// ✅ Good: show error state to user
const [error, setError] = React.useState(null);

const fetchExpenses = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/expenses");
    if (!response.ok) throw new Error("Failed to fetch");
    const data = await response.json();
    setExpenses(data.expenses);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

// In render:
if (error) return <div className="error">{error}</div>;
```

### 2.5 Comments and Documentation

**When to comment:**

- **DO** comment complex business logic
- **DO** comment non-obvious technical decisions
- **DO** comment workarounds and TODOs
- **DON'T** comment obvious code
- **DON'T** leave commented-out code (use git history)

**Comment style:**

```javascript
// ✅ Good: explains WHY
// Filter out expenses from previous fiscal year
// because accounting requires separate reporting
const currentYearExpenses = expenses.filter(
  (e) => new Date(e.date).getFullYear() === currentYear,
);

// ❌ Bad: explains WHAT (code already shows this)
// Filter expenses by year
const currentYearExpenses = expenses.filter(
  (e) => new Date(e.date).getFullYear() === currentYear,
);

// ✅ Good: documents workaround
// TODO: Remove this workaround once csv-parser v3.0 is released
// Current version has a bug with empty fields
const sanitizedData = data.map((row) => ({
  ...row,
  description: row.description || "",
}));
```

---

## 3. Git Workflow

### 3.1 Branch Naming

**Pattern:** `<type>/<ticket-id>/<short-description>`

**Types:**

- `feature/` — new functionality
- `fix/` — bug fixes
- `refactor/` — code improvements without behavior change
- `docs/` — documentation only
- `chore/` — maintenance tasks

**Examples:**

```
feature/PROJ-123/expense-filtering
fix/PROJ-456/csv-parsing-error
refactor/PROJ-789/extract-helpers
```

### 3.2 Commit Messages

**Format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** feat, fix, refactor, docs, test, chore

**Examples:**

```
feat(api): add category filter to expenses endpoint

Implements filtering by category query parameter.
Returns filtered expenses with updated count and total.

Closes PROJ-123
```

```
fix(frontend): handle empty expense list

Show "No expenses found" message instead of blank screen
when API returns empty array.

Fixes PROJ-456
```

### 3.3 Commit Practices

- **MUST** write clear, descriptive commit messages
- **SHOULD** make atomic commits (one logical change per commit)
- **MUST NOT** commit secrets, tokens, or `.env` files
- **MUST NOT** commit `node_modules/` or build artifacts
- **SHOULD** commit working code (passes basic validation)

### 3.4 Pull Request Standards

**PR title:** Same format as commit message

**PR description template:**

```markdown
## Summary

Brief description of what this PR does

## Changes

- List of key changes
- Another change

## Testing

How this was tested

## Checklist

- [ ] Code follows project conventions
- [ ] Complies with architecture.md
- [ ] Complies with security.md
- [ ] All acceptance criteria met
- [ ] Error handling implemented
- [ ] No console.log statements left in code
```

**PR size:**

- **SHOULD** keep PRs under 400 lines of changes
- **SHOULD** break large features into multiple PRs
- **MUST** ensure each PR is reviewable in < 30 minutes

---

## 4. Agent Usage

### 4.1 `speckit-plan`

**When to use:** Create technical design from validated spec

**Before running:**

1. Read and understand the spec thoroughly
2. Review `architecture.md` for constraints
3. Review `security.md` for requirements
4. Identify technical risks or unknowns

**Prompt template:**

```
Plan the implementation for .kiro/specs/NNN-feature-name/spec.md

Technical considerations:
- [any known technical challenges]
- [integration points with existing code]
- [performance or security concerns]
```

**Output validation:**

- Plan respects `architecture.md` constraints
- Plan addresses `security.md` requirements
- Plan is implementable within current stack
- Plan includes error handling strategy

### 4.2 `speckit-tasks`

**When to use:** Break down plan into executable tasks

**Before running:**

1. Ensure plan is complete and validated
2. Identify task dependencies
3. Consider testing strategy

**Output validation:**

- Tasks are ordered by dependencies
- Each task is completable in < 4 hours
- Tasks cover all plan sections
- Tasks include verification steps

### 4.3 `speckit-analyze`

**When to use:** Validate consistency before implementation

**What it checks:**

- Compliance with `constitution.md`, `architecture.md`, `security.md`
- Cross-artifact consistency (spec ↔ plan ↔ tasks)
- Completeness of design

**Action on findings:**

- **Blockers:** Must be resolved before implementation
- **Warnings:** Document as known issues or resolve

### 4.4 `speckit-implement`

**When to use:** Execute tasks phase by phase

**During implementation:**

- Follow tasks in order
- Mark tasks complete as you go
- Commit after each logical unit of work
- Run code and verify it works

**After implementation:**

- Verify all acceptance criteria are met
- Run any available tests
- Check for console.log or debug code
- Update documentation if needed

---

## 5. Testing Practices

### 5.1 Current State

**No formal test runner** — quality relies on:

- Manual verification against acceptance criteria
- Code review
- QA testing

### 5.2 Manual Verification

Before marking a task complete:

1. Start the backend: `cd backend && npm start`
2. Open the frontend: `open frontend/index.html`
3. Test the happy path
4. Test error scenarios
5. Test edge cases (empty data, invalid input, etc.)

### 5.3 Future Testing Strategy

When test runner is added (per spec):

- **Unit tests:** Test helper functions in isolation
- **Integration tests:** Test API endpoints
- **E2E tests:** Test critical user flows
- **Target coverage:** > 80% for business logic

---

## 6. Performance Practices

### 6.1 Backend Performance

**CSV reading optimization:**

```javascript
// ✅ Good: read once, filter in memory
async function getExpenses(filters) {
  const allExpenses = await readExpenses();
  return applyFilters(allExpenses, filters);
}

// ❌ Bad: read multiple times
async function getExpenses(filters) {
  const expenses = await readExpenses();
  const filtered = await readExpenses(); // unnecessary re-read
  return filtered;
}
```

**Caching strategy (if needed):**

- Cache CSV data in memory
- Invalidate cache on file modification
- Document cache strategy in code

### 6.2 Frontend Performance

**Avoid unnecessary re-renders:**

```javascript
// ✅ Good: memoize expensive calculations
const totalExpenses = React.useMemo(() => {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}, [expenses]);

// ✅ Good: debounce user input
const debouncedSearch = React.useMemo(() => debounce(handleSearch, 300), []);
```

**Loading states:**

```javascript
// ✅ Good: show loading indicator
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
if (expenses.length === 0) return <div>No expenses found</div>;
return <ExpenseList expenses={expenses} />;
```

---

## 7. Security Practices

### 7.1 Input Validation

**Backend validation:**

```javascript
// ✅ Good: validate query parameters
router.get("/api/expenses", async (req, res) => {
  const { category, dateFrom, dateTo } = req.query;

  // Validate category
  const validCategories = ["food", "transport", "utilities"];
  if (category && !validCategories.includes(category)) {
    return res.status(400).json({ error: "Invalid category" });
  }

  // Validate dates
  if (dateFrom && !isValidDate(dateFrom)) {
    return res.status(400).json({ error: "Invalid dateFrom format" });
  }

  // ... rest of handler
});
```

**Frontend validation:**

```javascript
// ✅ Good: validate before sending
const handleSubmit = (e) => {
  e.preventDefault();

  if (!category) {
    setError("Category is required");
    return;
  }

  if (amount <= 0) {
    setError("Amount must be positive");
    return;
  }

  submitExpense({ category, amount });
};
```

### 7.2 Secrets Management

**Environment variables:**

```javascript
// ✅ Good: use environment variables
const PORT = process.env.PORT || 3001;
const CSV_PATH = process.env.CSV_PATH || "./expenses.csv";

// ❌ Bad: hardcode sensitive values
const API_KEY = "sk_live_abc123"; // NEVER do this
```

**`.gitignore` must include:**

```
node_modules/
.env
.env.local
*.log
```

### 7.3 Dependency Security

**Before adding a dependency:**

1. Check npm audit score
2. Check last update date (avoid abandoned packages)
3. Check download count (prefer popular packages)
4. Review license compatibility

**Regular maintenance:**

```bash
# Check for vulnerabilities
npm audit

# Update dependencies with security patches
npm audit fix
```

---

## 8. Code Review Standards

### 8.1 As a Reviewer

**What to check:**

- [ ] Code follows project conventions (this document)
- [ ] Complies with `architecture.md` constraints
- [ ] Addresses `security.md` requirements
- [ ] All acceptance criteria are met
- [ ] Error handling is implemented
- [ ] No obvious bugs or edge cases missed
- [ ] Code is readable and maintainable
- [ ] No debug code left in (console.log, commented code)

**Review tone:**

- Be constructive and specific
- Explain the "why" behind suggestions
- Distinguish between blockers and suggestions
- Acknowledge good work

**Review turnaround:**

- **SHOULD** review within 24 hours
- **MUST** review within 48 hours

### 8.2 As an Author

**Before requesting review:**

- [ ] Self-review your own code
- [ ] Test all acceptance criteria
- [ ] Remove debug code
- [ ] Write clear PR description
- [ ] Link to related spec/ticket

**Responding to feedback:**

- Address all comments (fix or explain why not)
- Ask clarifying questions if feedback is unclear
- Don't take feedback personally
- Thank reviewers for their time

---

## 9. Debugging Practices

### 9.1 Debugging Strategy

**Systematic approach:**

1. **Reproduce:** Ensure you can consistently reproduce the issue
2. **Isolate:** Narrow down where the problem occurs
3. **Hypothesize:** Form a theory about the cause
4. **Test:** Verify your hypothesis
5. **Fix:** Implement the solution
6. **Verify:** Confirm the fix works and doesn't break anything else

### 9.2 Debugging Tools

**Backend:**

```javascript
// Use console.error for errors (not console.log)
console.error("Error reading CSV:", error);

// Use descriptive variable names in logs
console.log("Filtered expenses:", { count, category, dateRange });

// Use debugger statement for complex issues
if (suspiciousCondition) {
  debugger; // Will pause execution in Node inspector
}
```

**Frontend:**

```javascript
// Use React DevTools browser extension
// Use console.table for arrays
console.table(expenses);

// Use console.group for related logs
console.group("Expense Calculation");
console.log("Input:", expenses);
console.log("Total:", total);
console.groupEnd();
```

### 9.3 Common Issues

| Issue               | Likely Cause                              | Solution                               |
| ------------------- | ----------------------------------------- | -------------------------------------- |
| CORS error          | Frontend and backend on different origins | Check CORS configuration in server.js  |
| CSV parsing error   | Malformed CSV data                        | Add error handling and data validation |
| Empty response      | Wrong API endpoint or query params        | Check network tab, verify endpoint URL |
| React not updating  | State mutation instead of setState        | Use setState/useState correctly        |
| Port already in use | Previous server still running             | Kill process on port 3001              |

---

## 10. Documentation Standards

### 10.1 Code Documentation

**README files:**

- Every directory with code should have a README if it's not obvious
- Document setup instructions
- Document environment variables
- Document API endpoints

**Inline documentation:**

- Document complex algorithms
- Document business rules
- Document workarounds and TODOs
- Don't document obvious code

### 10.2 API Documentation

**Document all endpoints:**

````markdown
## GET /api/expenses

Returns list of expenses with optional filtering.

**Query Parameters:**

- `category` (optional): Filter by category (food, transport, utilities)
- `dateFrom` (optional): Filter by start date (YYYY-MM-DD)
- `dateTo` (optional): Filter by end date (YYYY-MM-DD)

**Response:**

```json
{
  "count": 10,
  "total": 1234.56,
  "currency": "USD",
  "expenses": [...]
}
```
````

**Error Responses:**

- `400 Bad Request`: Invalid query parameters
- `500 Internal Server Error`: Server error

```

---

## 11. Compliance

### 11.1 Mandatory Validations

Before marking implementation complete, Dev **MUST**:
1. Verify all acceptance criteria are met
2. Verify compliance with `architecture.md`
3. Verify compliance with `security.md`
4. Complete code self-review
5. Remove all debug code
6. Update documentation if needed

### 11.2 Kiro Enforcement

When Kiro assists with development tasks, it **MUST**:
- Follow code standards in this document
- Validate against `architecture.md` constraints
- Validate against `security.md` requirements
- Implement error handling
- Write clean, maintainable code

---

## 12. Amendments

Changes to this document **MUST**:
1. Be proposed by Dev Chapter Lead
2. Be reviewed with team
3. Update the **Version** and **Last Updated** fields
4. Be communicated to all developers

---

## References

- `constitution.md` — Project-wide technical constraints
- `architecture.md` — Technology stack and deployment model
- `security.md` — Security and compliance requirements
- `workflow-guide.md` — SDD pipeline and agent usage
- `qa-standards.md` — Testing expectations and quality gates
```
