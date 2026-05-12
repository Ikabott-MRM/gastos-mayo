# Product Owner Workflow Guide

**Version:** 1.0.0  
**Owner:** PO Chapter Lead  
**Last Updated:** 2026-05-11

---

## Purpose

This guide shows Product Owners how to use Kiro to write, validate, and manage User Stories following the standards in `po-constitution.md`.

---

## Quick Start: Writing a User Story

### Method 1: Natural Language Prompt (Fastest)

Just describe what you want in plain language:

```
Create a User Story for filtering expenses by date range.

Users need to select a start date and end date to see expenses within that period. The total should update to show only filtered expenses. If the date range is invalid (start after end), show an error message.
```

**Kiro will:**

1. Generate the User Story in proper format
2. Create EARS-formatted acceptance criteria
3. Add GIVEN-WHEN-THEN scenarios
4. Validate against `po-constitution.md`
5. Ask where to save it

### Method 2: Using the Template (Recommended for Complex Stories)

**Step 1:** Ask Kiro to create a story from template:

```
Create a new User Story using the template at .kiro/templates/user-story-template.md

Feature: Date range filtering for expenses
Role: Finance Manager
Benefit: Analyze expenses for specific time periods
```

**Step 2:** Kiro will fill in the template and ask for details:

- Acceptance criteria specifics
- Edge cases to consider
- Dependencies or constraints

**Step 3:** Review and refine the generated story

### Method 3: Validate an Existing Story

If you've already written a story, ask Kiro to validate it:

```
Validate the User Story in [file path] against po-constitution.md

Check:
- INVEST criteria
- EARS notation
- At least one negative scenario
- DoR completeness
```

---

## Step-by-Step: Complete User Story Creation

### Step 1: Identify the Need

**Before writing, clarify:**

- Who is the user? (specific role, not "user")
- What do they need to do? (concrete action)
- Why do they need it? (measurable benefit)
- What are the edge cases?
- What should NOT happen? (negative scenarios)

### Step 2: Write the User Story

**Prompt Kiro:**

```
I want to create a User Story for [feature name].

Context:
- User role: [specific role]
- Current problem: [what's broken or missing]
- Desired outcome: [what success looks like]
- Constraints: [any technical or business constraints]

Edge cases to consider:
- [edge case 1]
- [edge case 2]
```

**Example:**

```
I want to create a User Story for expense category filtering.

Context:
- User role: Finance Manager
- Current problem: Cannot filter expenses by category, must scroll through all expenses
- Desired outcome: See only expenses for a specific category (Food, Transport, Utilities)
- Constraints: Must work with existing CSV data structure

Edge cases to consider:
- What happens when a category has no expenses?
- What if an invalid category is selected?
- Should "All Categories" be an option?
```

### Step 3: Review Generated Story

**Kiro will generate something like:**

```markdown
# US-042: Filter Expenses by Category

## User Story

As a Finance Manager,
I want to filter expenses by category,
so that I can analyze spending patterns for specific expense types.

## Acceptance Criteria

### AC-01 — Filter by valid category

When the user selects a category from the filter dropdown,
the system shall display only expenses matching that category.

### AC-02 — Update totals for filtered view

When expenses are filtered by category,
the system shall recalculate and display the total amount for only the filtered expenses.

### AC-03 — Handle empty category (negative scenario)

When the user selects a category with no expenses,
the system shall display "No expenses found for this category" message.

### AC-04 — Reject invalid category (negative scenario)

When an invalid category value is provided,
the system shall return a 400 error with message "Invalid category".
```

**Check:**

- [ ] Role is specific (not "user")
- [ ] Action is concrete (not "manage" or "handle")
- [ ] Benefit is clear and measurable
- [ ] Each AC has exactly one "shall"
- [ ] At least one negative scenario
- [ ] EARS notation is correct

### Step 4: Add GIVEN-WHEN-THEN Scenarios

**Prompt Kiro:**

```
Add GIVEN-WHEN-THEN scenarios for each acceptance criterion in [file path]
```

**Kiro will add:**

```gherkin
### Scenario 1: Filter by valid category

GIVEN the expense list contains 10 expenses
  AND 3 expenses are in "Food" category
  AND 7 expenses are in "Transport" category
WHEN the user selects "Food" from the category filter
THEN the system shall display only the 3 "Food" expenses
  AND the total shall show the sum of those 3 expenses
  AND the count shall show "3"
```

### Step 5: Validate Against DoR

**Prompt Kiro:**

```
Validate [file path] against the Definition of Ready in po-constitution.md
```

**Kiro will check:**

- [ ] Specific role (not generic)
- [ ] Concrete action
- [ ] Measurable benefit
- [ ] INVEST criteria met
- [ ] Minimum 3 acceptance criteria
- [ ] At least 1 negative scenario
- [ ] Prioritized in backlog

### Step 6: Save and Track

**Prompt Kiro:**

```
Save this User Story to .kiro/user-stories/US-042-filter-by-category.md
```

Or integrate with your tracking system (Jira, etc.)

---

## Common Prompts for POs

### Creating Stories

```
Create a User Story for [feature] where [role] needs to [action] because [benefit]
```

```
Generate acceptance criteria for the following User Story: [paste story]
```

```
Add negative scenarios for [file path]
```

### Validating Stories

```
Validate [file path] against po-constitution.md
```

```
Check if this User Story meets INVEST criteria: [paste story]
```

```
Review the EARS notation in [file path] and fix any issues
```

### Refining Stories

```
This User Story is too large. Split it into smaller stories: [paste story]
```

```
Add edge cases for [file path]
```

```
Clarify the acceptance criteria in [file path] - they're too vague
```

### Managing Backlog

```
Prioritize these User Stories based on [criteria]: [list stories]
```

```
Identify dependencies between these stories: [list stories]
```

```
Which of these stories should be in the next sprint? [list stories]
```

---

## Working with Other Roles

### Handing Off to BA

**After writing a User Story:**

```
This User Story is ready for BA refinement: [file path]

Please:
1. Validate it meets DoR
2. Identify any ambiguities
3. Document stakeholders
4. Create traceability matrix
```

### Handing Off to Dev

**After BA refinement:**

```
This spec is ready for technical planning: .kiro/specs/042-filter-by-category/spec.md

Please:
1. Run speckit-plan
2. Identify technical risks
3. Estimate effort
```

### Working with QA

**During implementation:**

```
Review the test cases for [feature] and verify they cover all acceptance criteria: [file path]
```

**After implementation:**

```
Validate that [feature] meets all acceptance criteria from US-042
```

---

## Validation Checklist

Before marking a User Story as "Ready for Sprint":

### Format

- [ ] Uses "As a / I want / so that" format
- [ ] Role is specific (not "user" or "system")
- [ ] Action is concrete (not "manage", "handle", "process")
- [ ] Benefit is measurable or verifiable

### INVEST Criteria

- [ ] **Independent:** Can be implemented without other stories
- [ ] **Negotiable:** How is flexible, what and why are fixed
- [ ] **Valuable:** Delivers value by itself
- [ ] **Estimable:** Team can estimate effort
- [ ] **Small:** Fits in one sprint (max 8 story points)
- [ ] **Testable:** Has verifiable acceptance criteria

### Acceptance Criteria

- [ ] Minimum 3 criteria, maximum 8
- [ ] Each uses EARS notation (one of 5 patterns)
- [ ] Each has exactly one "shall"
- [ ] At least 1 negative scenario
- [ ] All criteria are testable

### GIVEN-WHEN-THEN Scenarios

- [ ] At least one scenario per acceptance criterion
- [ ] Scenarios are specific and concrete
- [ ] Expected results are observable

### Documentation

- [ ] Dependencies identified
- [ ] Out of scope explicitly listed
- [ ] Priority assigned
- [ ] Story points estimated (or marked for estimation)

---

## Common Mistakes and How to Fix Them

### Mistake 1: Generic Role

❌ **Bad:**

```
As a user,
I want to filter expenses,
so that I can see specific data.
```

✅ **Good:**

```
As a Finance Manager,
I want to filter expenses by category,
so that I can analyze spending patterns for budget planning.
```

**Prompt to fix:**

```
The role in [file path] is too generic. Make it specific based on who actually uses this feature.
```

### Mistake 2: Vague Action

❌ **Bad:**

```
As a Finance Manager,
I want to manage expenses,
so that I can work with the data.
```

✅ **Good:**

```
As a Finance Manager,
I want to filter expenses by date range,
so that I can generate monthly expense reports.
```

**Prompt to fix:**

```
The action in [file path] is too vague. Make it concrete and specific.
```

### Mistake 3: Technical Benefit

❌ **Bad:**

```
As a Finance Manager,
I want to filter expenses,
so that the system can query the database efficiently.
```

✅ **Good:**

```
As a Finance Manager,
I want to filter expenses by date range,
so that I can analyze spending trends over specific time periods.
```

**Prompt to fix:**

```
The benefit in [file path] is technical, not user-focused. Rewrite it from the user's perspective.
```

### Mistake 4: Multiple "shall" in One Criterion

❌ **Bad:**

```
When the user selects a category,
the system shall filter the expenses and shall update the total and shall show a count.
```

✅ **Good:**

```
AC-01: When the user selects a category, the system shall filter the expenses.
AC-02: When expenses are filtered, the system shall update the total to reflect filtered expenses.
AC-03: When expenses are filtered, the system shall display the count of filtered expenses.
```

**Prompt to fix:**

```
Split the acceptance criteria in [file path] - each should have only one "shall"
```

### Mistake 5: No Negative Scenarios

❌ **Bad:** Only happy path criteria

✅ **Good:** At least one error/edge case

**Prompt to fix:**

```
Add negative scenarios to [file path] for:
- Invalid input
- Empty results
- Error conditions
```

---

## Integration with SDD Pipeline

### Your Story → BA's Spec

**After you write a User Story:**

1. Validate it meets DoR
2. Hand off to BA with context
3. BA runs `speckit-specify` using your story as input
4. BA runs `speckit-clarify` to resolve ambiguities
5. You review and approve the spec

**Prompt for handoff:**

```
This User Story is ready for specification: [file path]

Context for BA:
- Stakeholders: [list]
- Business rules: [list]
- Known constraints: [list]
```

### Validating the Spec

**After BA creates spec:**

```
Review .kiro/specs/042-filter-by-category/spec.md

Verify:
- All acceptance criteria from US-042 are covered
- Business value is preserved
- Scope matches the User Story
```

### Validating Implementation

**After Dev implements:**

```
Demo the implementation of US-042 against the acceptance criteria

For each AC, verify:
- AC-01: [test it]
- AC-02: [test it]
- AC-03: [test it]
```

---

## Tips for Effective User Stories

### 1. Start with the Problem, Not the Solution

❌ Don't say: "Add a dropdown filter"  
✅ Do say: "Need to view expenses for specific categories"

Let Dev/BA figure out if a dropdown is the right solution.

### 2. Focus on Value

Every story should answer: "Why does this matter to the user or business?"

### 3. Keep Stories Small

If a story takes more than one sprint, split it:

- By user role
- By workflow step
- By priority (MVP vs. nice-to-have)

### 4. Write Testable Criteria

QA should be able to create test cases directly from your acceptance criteria.

### 5. Include the Unhappy Path

Always think: "What could go wrong?" and write criteria for those cases.

---

## Compliance

All User Stories **MUST**:

- Follow `po-constitution.md` standards
- Meet INVEST criteria
- Use EARS notation for acceptance criteria
- Include at least one negative scenario
- Be validated against DoR before sprint entry

When Kiro assists with User Story creation, it **MUST**:

- Validate against `po-constitution.md`
- Flag violations with specific rule references
- Suggest fixes for common mistakes
- Ensure DoR is met before marking story as ready

---

## References

- `po-constitution.md` — User Story standards, INVEST, EARS, DoR/DoD
- `workflow-guide.md` — SDD pipeline and handoffs
- `ba-guide.md` — How BA uses your stories
- `qa-standards.md` — How QA tests your acceptance criteria
- `.kiro/templates/user-story-template.md` — Template for new stories
