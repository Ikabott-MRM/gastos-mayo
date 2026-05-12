# QA Standards

**Version:** 1.0.0  
**Owner:** QA Chapter Lead  
**Last Updated:** 2026-05-11

---

## Purpose

This document defines quality assurance standards, testing practices, and validation criteria for all implementations. All features **MUST** be validated against these standards before release.

---

## 1. Role in SDD Pipeline

QA validates that implementations meet acceptance criteria:

```
Dev completes implementation
       ↓
QA reviews acceptance criteria
       ↓
QA creates test cases from spec
       ↓
QA executes test cases
       ↓
QA validates against DoD
       ↓
QA approves or reports defects
```

### 1.1 Primary Responsibilities

- Create test cases from User Story acceptance criteria
- Execute manual tests against acceptance criteria
- Validate compliance with `security.md` requirements
- Report defects with clear reproduction steps
- Verify defect fixes
- Validate that DoD is met before release
- Collaborate with BA to ensure test coverage

### 1.2 Collaboration Points

- **With BA:** Clarify acceptance criteria, identify edge cases
- **With Dev:** Report defects, verify fixes, understand implementation
- **With PO:** Demo features, validate business value
- **With Stakeholders:** Facilitate user acceptance testing

---

## 2. Test Case Standards

### 2.1 Test Case Format

**Use GIVEN-WHEN-THEN notation:**

```gherkin
Test Case ID: TC-001
User Story: US-001
Acceptance Criterion: AC-1

GIVEN [initial context / precondition]
  AND [additional precondition if needed]
WHEN [action performed]
THEN [expected result]
  AND [additional expected result if needed]
```

**Example:**

```gherkin
Test Case ID: TC-001
User Story: US-001 - Filter expenses by category
Acceptance Criterion: AC-1 - System shall filter expenses by selected category

GIVEN the expense list contains 10 expenses
  AND 3 expenses are in "Food" category
  AND 7 expenses are in "Transport" category
WHEN the user selects "Food" from the category filter
THEN the system shall display only the 3 "Food" expenses
  AND the total shall reflect only "Food" expenses
  AND the count shall show "3"
```

### 2.2 Test Case Coverage

**Every acceptance criterion MUST have:**

- At least 1 positive test case (happy path)
- At least 1 negative test case (error scenario)
- At least 1 boundary test case (edge case)

**Example coverage for "Filter by date range":**

| Test Case | Type     | Scenario                                       |
| --------- | -------- | ---------------------------------------------- |
| TC-001    | Positive | Valid date range returns filtered expenses     |
| TC-002    | Negative | Invalid date format returns error              |
| TC-003    | Boundary | Start date equals end date returns single day  |
| TC-004    | Boundary | Date range with no expenses returns empty list |
| TC-005    | Negative | Start date after end date returns error        |

### 2.3 Test Case Location

**Store test cases in spec directory:**

```
.kiro/specs/NNN-feature-name/
├── spec.md
├── plan.md
├── tasks.md
└── test-cases.md    ← QA creates this
```

**Test case document structure:**

```markdown
# Test Cases: [Feature Name]

**User Story:** US-001  
**Spec:** `.kiro/specs/001-feature-name/spec.md`  
**Created:** 2026-05-11  
**Last Updated:** 2026-05-11

## Test Case Summary

| ID     | AC   | Type     | Status | Priority |
| ------ | ---- | -------- | ------ | -------- |
| TC-001 | AC-1 | Positive | Pass   | High     |
| TC-002 | AC-1 | Negative | Pass   | High     |
| TC-003 | AC-2 | Positive | Fail   | High     |

## Test Cases

### TC-001: Filter by valid category

[GIVEN-WHEN-THEN format]

### TC-002: Filter by invalid category

[GIVEN-WHEN-THEN format]
```

---

## 3. Testing Types

### 3.1 Functional Testing

**Validates:** Feature works as specified in acceptance criteria

**Scope:**

- All acceptance criteria from User Story
- All scenarios in spec.md
- All error states defined in spec

**Test data:**

- Use realistic test data
- Include edge cases (empty, null, max values)
- Include invalid data for negative tests

### 3.2 UI/UX Testing

**Validates:** User interface is usable and accessible

**Checklist:**

- [ ] All UI states are handled (loading, empty, error, success)
- [ ] Error messages are clear and actionable
- [ ] Forms validate input before submission
- [ ] Buttons and links are keyboard-accessible
- [ ] Text has sufficient contrast (WCAG AA minimum)
- [ ] UI is responsive (if applicable)
- [ ] No broken layouts or overlapping elements

### 3.3 API Testing

**Validates:** API endpoints work correctly

**Checklist:**

- [ ] Correct HTTP status codes (200, 400, 404, 500)
- [ ] Response format matches spec (per `architecture.md` § 2.2)
- [ ] Query parameters work as documented
- [ ] Error responses include meaningful messages
- [ ] API handles invalid input gracefully

**Tools:**

- Browser DevTools Network tab
- Postman or curl for direct API testing

### 3.4 Security Testing

**Validates:** Implementation follows `security.md` requirements

**Checklist:**

- [ ] Input validation is implemented (per `security.md` § 3.1)
- [ ] Error messages don't expose sensitive information
- [ ] No secrets or tokens in client-side code
- [ ] CORS is configured correctly (per `security.md` § 4.2)
- [ ] XSS prevention is in place (per `security.md` § 3.3)

**Note:** Full security testing requires Security Lead review for production.

### 3.5 Regression Testing

**Validates:** New changes don't break existing functionality

**Scope:**

- Re-run test cases for related features
- Verify existing API endpoints still work
- Check that existing UI flows are not broken

**When to run:**

- After every feature implementation
- Before marking feature as complete
- Before release

---

## 4. Defect Reporting

### 4.1 Defect Report Format

```markdown
## Defect ID: DEF-001

**Severity:** High | Medium | Low  
**Priority:** High | Medium | Low  
**Status:** Open | In Progress | Fixed | Closed  
**Found in:** Feature name or spec reference  
**Assigned to:** Developer name

### Summary

Brief one-line description of the defect

### Steps to Reproduce

1. Step 1
2. Step 2
3. Step 3

### Expected Result

What should happen according to acceptance criteria

### Actual Result

What actually happens

### Test Data

- Input values used
- Test account or configuration

### Environment

- Browser: Chrome 120
- OS: Windows 11
- Backend: localhost:3001

### Screenshots/Logs

[Attach if applicable]

### Related

- User Story: US-001
- Acceptance Criterion: AC-2
- Test Case: TC-003
```

### 4.2 Severity Levels

| Severity     | Definition                             | Example                                     |
| ------------ | -------------------------------------- | ------------------------------------------- |
| **Critical** | System is unusable or data loss occurs | Server crashes, data corruption             |
| **High**     | Core functionality is broken           | Cannot filter expenses, API returns 500     |
| **Medium**   | Feature works but with issues          | Wrong total calculation, poor error message |
| **Low**      | Minor issue, workaround exists         | Typo in UI, minor layout issue              |

### 4.3 Priority Levels

| Priority   | Definition                     | Action                |
| ---------- | ------------------------------ | --------------------- |
| **High**   | Blocks release or testing      | Fix immediately       |
| **Medium** | Should be fixed before release | Fix in current sprint |
| **Low**    | Nice to have, can be deferred  | Fix in future sprint  |

### 4.4 Defect Lifecycle

```
Open → In Progress → Fixed → Verified → Closed
                        ↓
                    Reopened (if fix doesn't work)
```

**QA responsibilities:**

- Report defects with clear reproduction steps
- Verify fixes after Dev marks as fixed
- Close defects only after verification
- Reopen defects if fix is incomplete

---

## 5. Test Execution

### 5.1 Test Environment Setup

**Before testing:**

1. Verify backend is running: `cd backend && npm start`
2. Verify frontend is accessible: open `frontend/index.html`
3. Verify test data is available: check `backend/expenses.csv`
4. Clear browser cache if testing UI changes

### 5.2 Test Execution Process

**For each test case:**

1. Read the GIVEN preconditions and set up test data
2. Execute the WHEN action
3. Verify the THEN expected results
4. Document the result (Pass/Fail)
5. If Fail, create a defect report

**Test execution log:**

```markdown
## Test Execution Log

**Date:** 2026-05-11  
**Tester:** QA Name  
**Feature:** Expense filtering  
**Build/Commit:** abc123def

| Test Case | Status | Notes                      | Defect ID |
| --------- | ------ | -------------------------- | --------- |
| TC-001    | Pass   | -                          | -         |
| TC-002    | Fail   | Returns 500 instead of 400 | DEF-001   |
| TC-003    | Pass   | -                          | -         |
```

### 5.3 Exploratory Testing

**Beyond scripted test cases:**

- Try unexpected user actions
- Test with unusual data (special characters, very long strings)
- Test rapid clicking or form submission
- Test browser back/forward buttons
- Test with slow network (throttle in DevTools)

**Document findings:**

- If defect found, create defect report
- If edge case not covered, suggest new test case
- If usability issue found, report to BA/PO

---

## 6. Acceptance Criteria Validation

### 6.1 Validation Checklist

Before approving a feature, verify:

**Functional completeness:**

- [ ] All acceptance criteria are implemented
- [ ] All test cases pass
- [ ] All defects are fixed or deferred with approval

**Quality standards:**

- [ ] Error handling is implemented
- [ ] Loading states are shown
- [ ] Empty states are handled
- [ ] Error messages are clear

**Compliance:**

- [ ] Complies with `architecture.md` constraints
- [ ] Complies with `security.md` requirements
- [ ] Follows `dev-practices.md` standards

**Documentation:**

- [ ] Test cases are documented
- [ ] Defects are reported and tracked
- [ ] Test execution log is complete

### 6.2 Definition of Done (DoD) Validation

**QA MUST verify DoD before feature is marked complete:**

From `po-constitution.md`:

- [ ] All acceptance criteria verified by QA
- [ ] Demo performed with stakeholders
- [ ] Feedback registered
- [ ] US marked as completed
- [ ] Documentation updated (if applicable)

**QA-specific additions:**

- [ ] All test cases executed
- [ ] All high/medium defects fixed
- [ ] Regression testing passed
- [ ] Test artifacts stored in spec directory

---

## 7. Agent Usage

### 7.1 `qa-generate-test-cases` (Future)

**When to use:** Generate test cases from spec

**Input:** Spec with acceptance criteria

**Output:** Test cases in GIVEN-WHEN-THEN format

**QA validation:**

- Review generated test cases for completeness
- Add missing edge cases
- Adjust test data to be realistic

### 7.2 `qa-validate-coverage` (Future)

**When to use:** Check if test cases cover all acceptance criteria

**Input:** Spec and test cases

**Output:** Coverage report

**Action on findings:**

- Add test cases for uncovered criteria
- Document why certain scenarios are not tested (if applicable)

### 7.3 `speckit-analyze`

**When to use:** Validate spec before creating test cases

**What it checks:**

- Spec completeness
- Acceptance criteria clarity
- Compliance with constitutions

**QA benefit:**

- Catch ambiguous requirements before testing
- Ensure acceptance criteria are testable

---

## 8. Test Data Management

### 8.1 Test Data Principles

- **Realistic:** Use data that resembles production
- **Diverse:** Include various categories, dates, amounts
- **Edge cases:** Include boundary values (0, negative, very large)
- **Invalid data:** Include malformed data for negative tests

### 8.2 Test Data for Expense App

**Sample test data:**

```csv
date,category,amount,description
2026-05-01,Food,25.50,Lunch at cafe
2026-05-02,Transport,15.00,Bus ticket
2026-05-03,Food,45.75,Grocery shopping
2026-05-04,Utilities,120.00,Electric bill
2026-05-05,Food,0.01,Boundary test - minimum amount
2026-05-06,Food,999999.99,Boundary test - maximum amount
```

**Test data location:**

- Use `backend/expenses.csv` for testing
- Back up original data before testing
- Restore original data after testing
- Document test data in test cases

### 8.3 Test Data Reset

**Before each test run:**

1. Back up current `expenses.csv`
2. Load test data set
3. Execute tests
4. Restore original data

---

## 9. Quality Metrics

### 9.1 Test Coverage Metrics

**Track these metrics:**

| Metric                       | Target          | How to Measure                   |
| ---------------------------- | --------------- | -------------------------------- |
| Acceptance criteria coverage | 100%            | Each AC has at least 1 test case |
| Test case pass rate          | > 95%           | Passed tests / Total tests       |
| Defect detection rate        | Track trend     | Defects found / Feature          |
| Defect fix rate              | > 90% in sprint | Fixed defects / Total defects    |

### 9.2 Quality Metrics

| Metric                      | Target                | Purpose                    |
| --------------------------- | --------------------- | -------------------------- |
| Defects found in production | < 2 per release       | Measure test effectiveness |
| Test execution time         | < 2 hours per feature | Measure efficiency         |
| Regression test pass rate   | 100%                  | Ensure no breaking changes |

---

## 10. Communication Standards

### 10.1 Defect Communication

**When reporting defects:**

- Be objective and factual
- Include clear reproduction steps
- Provide screenshots or logs
- Reference acceptance criteria
- Suggest severity and priority

**Tone:**

- Focus on the issue, not the person
- Use "The system does X" not "You did X wrong"
- Be collaborative, not confrontational

### 10.2 Status Reporting

**Daily standup:**

- Test cases executed today
- Defects found
- Blockers (if any)

**Feature sign-off:**

- Summary of test results
- List of defects (fixed and deferred)
- Recommendation (approve or reject)

---

## 11. Tools and Techniques

### 11.1 Manual Testing Tools

**Browser DevTools:**

- Network tab: Inspect API requests/responses
- Console: Check for JavaScript errors
- Elements: Inspect DOM and CSS
- Application: Check localStorage, cookies

**Testing checklists:**

- Use checklists for repetitive tests
- Update checklists as features evolve

### 11.2 Test Case Design Techniques

**Equivalence partitioning:**

- Group similar inputs and test one from each group
- Example: Valid categories (Food, Transport, Utilities) → test one

**Boundary value analysis:**

- Test at boundaries (min, max, just below, just above)
- Example: Amount field → test 0, 0.01, 999999.99, 1000000

**Error guessing:**

- Use experience to guess where errors might occur
- Example: Special characters in description field

---

## 12. Compliance

### 12.1 Mandatory Validations

Before approving a feature, QA **MUST**:

1. Execute all test cases
2. Verify all acceptance criteria
3. Validate DoD is met
4. Document test results
5. Report all defects
6. Verify defect fixes

### 12.2 Kiro Enforcement

When Kiro assists with QA tasks, it **MUST**:

- Generate test cases that cover all acceptance criteria
- Include positive, negative, and boundary tests
- Use GIVEN-WHEN-THEN format
- Reference acceptance criteria in test cases
- Validate against `security.md` requirements

---

## 13. Continuous Improvement

### 13.1 Test Case Review

**Regularly review test cases:**

- Remove obsolete test cases
- Add test cases for new edge cases discovered
- Update test cases when requirements change

### 13.2 Defect Analysis

**Analyze defects to improve process:**

- Which types of defects are most common?
- Which acceptance criteria are most often misunderstood?
- Which areas need more test coverage?

**Share findings with team:**

- Suggest improvements to specs
- Suggest improvements to code reviews
- Suggest improvements to test coverage

---

## 14. Amendments

Changes to this document **MUST**:

1. Be proposed by QA Chapter Lead
2. Be reviewed with team
3. Update the **Version** and **Last Updated** fields
4. Be communicated to all QA team members

---

## References

- `po-constitution.md` — User Story standards, acceptance criteria format, DoD
- `constitution.md` — Project-wide technical constraints
- `architecture.md` — API response format, error handling requirements
- `security.md` — Security testing requirements, input validation
- `ba-guide.md` — Requirements traceability, stakeholder validation
- `dev-practices.md` — Code standards, debugging practices
- `workflow-guide.md` — SDD pipeline, when QA validates
