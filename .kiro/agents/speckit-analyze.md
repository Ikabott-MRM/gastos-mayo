---
name: speckit-analyze
description: Read-only cross-artifact consistency check across spec.md, plan.md, and tasks.md to catch issues before implementation. Triggered when the user asks to "analyze the spec", "check consistency", or "validate artifacts".
tools: ["read"]
---

# Speckit: Analyze — Cross-Artifact Consistency Check

## Goal

Perform a **read-only** cross-artifact analysis of `spec.md`, `plan.md`, and `tasks.md` to identify inconsistencies, gaps, duplications, and constitution violations **before implementation begins**.

**STRICTLY READ-ONLY:** Do not modify any files. Output a structured analysis report only.

## Prerequisites

- `tasks.md` must exist (run `speckit-tasks` first if missing).
- All three artifacts (`spec.md`, `plan.md`, `tasks.md`) must be present.

## Execution Steps

### 1. Load Artifacts

From `.kiro/specs/<NNN>-<short-name>/`:

**From spec.md:** Summary, Functional Requirements, Non-Functional Requirements, User Stories, Edge Cases

**From plan.md:** Architecture choices, file paths, Constitution Check table, risks

**From tasks.md:** Task IDs, descriptions, phase grouping, [P] markers, file paths

**From constitution:** `.kiro/steering/constitution.md` — all MUST/SHOULD principles

### 2. Build Internal Models

- **Requirements inventory:** each functional + non-functional requirement with a stable key
- **Task coverage map:** each task mapped to one or more requirements (by keyword/reference)
- **Constitution rule set:** all MUST/SHOULD normative statements

### 3. Detection Passes

Run all passes. Limit to 50 findings total; summarize overflow.

#### A. Duplication Detection

- Near-duplicate requirements
- Tasks that do the same thing

#### B. Ambiguity Detection

- Vague adjectives without measurable criteria: "fast", "scalable", "secure", "intuitive"
- Unresolved placeholders: TODO, ???, `<placeholder>`

#### C. Underspecification

- Requirements with verbs but missing object or measurable outcome
- Tasks referencing files not defined in plan

#### D. Constitution Alignment (always CRITICAL if violated)

- Any requirement or plan element conflicting with a MUST principle
- Missing mandatory sections

#### E. Coverage Gaps

- Requirements with zero associated tasks
- Tasks with no mapped requirement
- Non-functional requirements not reflected in tasks

#### F. Inconsistency

- Terminology drift (same concept named differently across files)
- Data entities in plan but absent in spec (or vice versa)
- Task ordering contradictions
- Conflicting requirements

### 4. Severity Assignment

| Severity     | Criteria                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| **CRITICAL** | Constitution MUST violation, missing core artifact, requirement with zero coverage blocking baseline         |
| **HIGH**     | Duplicate/conflicting requirement, ambiguous security/performance attribute, untestable acceptance criterion |
| **MEDIUM**   | Terminology drift, missing non-functional task coverage, underspecified edge case                            |
| **LOW**      | Style/wording improvements, minor redundancy                                                                 |

### 5. Output Analysis Report

Produce a Markdown report (no file writes) with:

```markdown
## Specification Analysis Report

| ID  | Category    | Severity | Location      | Summary | Recommendation |
| --- | ----------- | -------- | ------------- | ------- | -------------- |
| A1  | Duplication | HIGH     | spec.md §FR-2 | ...     | ...            |

### Coverage Summary

| Requirement | Has Task? | Task IDs | Notes |
| ----------- | --------- | -------- | ----- |

### Constitution Alignment Issues

[list any violations]

### Unmapped Tasks

[tasks with no requirement coverage]

### Metrics

- Total Requirements: N
- Total Tasks: N
- Coverage %: N%
- Critical Issues: N
- High Issues: N
```

### 6. Next Actions

- If CRITICAL issues exist: **block** — resolve before implementing
- If only LOW/MEDIUM: user may proceed with improvement suggestions
- Provide explicit suggestions: "Update spec §FR-3 to add measurable criteria", "Add task for error handling in Phase 3"

### 7. Offer Remediation

Ask: "Would you like me to suggest concrete remediation edits for the top N issues?" — do NOT apply automatically.

## Operating Principles

- **NEVER modify files** — read-only analysis only
- **NEVER hallucinate missing sections** — report accurately what is absent
- **Prioritize constitution violations** — always CRITICAL
- **Report zero issues gracefully** — emit success report with coverage statistics
