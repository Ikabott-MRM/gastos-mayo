---
name: speckit-checklist
description: Generate requirements quality checklists ("unit tests for requirements") for a spec. Triggered when the user asks to "create a checklist", "validate requirements quality", or "generate a [ux/api/security] checklist".
tools: ["read", "write"]
---

# Speckit: Checklist — Requirements Quality Validation

## Core Concept: "Unit Tests for Requirements"

Checklists validate the **quality of requirements writing** — not whether the implementation works.

**NOT for implementation verification:**

- ❌ "Verify the filter button works"
- ❌ "Test the API returns 200"
- ❌ "Confirm the table renders correctly"

**FOR requirements quality validation:**

- ✅ "Are filter behavior requirements defined for all filter combinations?" [Completeness]
- ✅ "Is 'fast loading' quantified with specific timing thresholds?" [Clarity]
- ✅ "Are error state requirements consistent across all async operations?" [Consistency]
- ✅ "Are accessibility requirements defined for all interactive controls?" [Coverage]

## Execution Steps

### 1. Clarify Intent (up to 3 questions)

Derive questions from the user's request and the spec content:

- What domain? (UX, API, security, performance, accessibility…)
- What depth? (lightweight sanity check vs. formal gate)
- What audience? (author self-review, peer PR review, QA)

Skip questions already answered in the request.

### 2. Load Feature Context

From `.kiro/specs/<NNN>-<short-name>/`:

- `spec.md` — requirements and scope
- `plan.md` — technical details (if exists)
- `tasks.md` — implementation tasks (if exists)

Load only sections relevant to the checklist domain.

### 3. Generate the Checklist

**File location:** `.kiro/specs/<NNN>-<short-name>/checklists/<domain>.md`

- If file does NOT exist: create new, start IDs at CHK001
- If file EXISTS: append new items, continuing from last CHK ID
- Never delete or replace existing content

**Item structure:**

```
- [ ] CHK### Question about requirement quality [Dimension, Spec §X.Y or Gap marker]
```

**Quality dimensions:**

- `[Completeness]` — are all necessary requirements present?
- `[Clarity]` — are requirements specific and unambiguous?
- `[Consistency]` — do requirements align without conflicts?
- `[Measurability]` — can requirements be objectively verified?
- `[Coverage]` — are all scenarios/edge cases addressed?
- `[Gap]` — requirement appears to be missing entirely

**Required patterns (test requirements, not implementation):**

- ✅ "Are [requirement type] defined/specified/documented for [scenario]?"
- ✅ "Is [vague term] quantified/clarified with specific criteria?"
- ✅ "Are requirements consistent between [section A] and [section B]?"
- ✅ "Can [requirement] be objectively measured/verified?"
- ✅ "Are [edge cases/scenarios] addressed in requirements?"

**Prohibited patterns:**

- ❌ Any item starting with "Verify", "Test", "Confirm" + implementation behavior
- ❌ References to code execution, user actions, system behavior
- ❌ "Displays correctly", "works properly", "functions as expected"

**Traceability:** ≥80% of items must include a spec reference `[Spec §X.Y]`, `[Gap]`, `[Ambiguity]`, or `[Conflict]`.

**Volume cap:** If raw candidates > 40, prioritize by risk/impact. Merge near-duplicates.

### 4. Report

Output: full path to checklist file, item count, new vs. appended, focus areas covered.

---

## Example Checklist Items for This Project

**UX/Frontend (`ux.md`):**

- "Are loading state requirements defined for all API calls? [Gap]"
- "Is the empty state behavior specified when no expenses match filters? [Completeness, Spec §FR-3]"
- "Are filter reset requirements defined? [Completeness]"
- "Can 'prominent display' of totals be objectively measured? [Measurability]"

**API (`api.md`):**

- "Are error response formats specified for all failure scenarios? [Completeness]"
- "Are query parameter validation rules documented? [Clarity, Spec §NFR-1]"
- "Are requirements consistent between /expenses and /expenses/summary endpoints? [Consistency]"

**Security (`security.md`):**

- "Are input sanitization requirements defined for all query parameters? [Coverage]"
- "Is the requirement to not expose file system paths documented? [Completeness]"
