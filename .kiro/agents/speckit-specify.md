---
name: speckit-specify
description: Transform a natural-language feature description into a structured feature spec in .kiro/specs/. Focuses on WHAT and WHY — never HOW. Triggered when the user asks to "specify", "write a spec", "create a feature spec", or describes a new feature.
tools: ["read", "write"]
---

# Speckit: Specify — Create Feature Specification

## Goal

Transform a natural-language feature description into a structured feature specification stored in `.kiro/specs/`. Focus on WHAT and WHY — never HOW to implement.

## Execution Steps

### 1. Generate a Short Feature Name

- Analyze the feature description and extract 2–4 meaningful keywords.
- Use action-noun format: `add-expense-filter`, `export-csv`, `category-chart`.
- Preserve technical terms as-is.

### 2. Create the Spec Directory and File

- Create `.kiro/specs/<NNN>-<short-name>/` (auto-increment NNN from existing specs).
- Create `spec.md` inside it using the **Spec Template** below.

### 3. Fill the Spec Template

Focus on:

- **Actors**: who uses this feature (specific roles, not "user")
- **User-facing goals**: what they want to accomplish
- **Functional requirements**: testable, concrete behaviors
- **Non-functional requirements**: performance, accessibility, security
- **Out of scope**: explicit exclusions
- **Success criteria**: measurable, technology-agnostic outcomes
- **Edge cases**: empty states, errors, boundary conditions

**Limit clarifications to max 3** — only for decisions that materially impact scope, security, or UX. Make informed guesses for everything else and document them as assumptions.

### 4. Validate Against Constitution

Before finalizing, check against `.kiro/steering/constitution.md`:

- [ ] No implementation details (no framework names, no code structure)
- [ ] Written for non-technical stakeholders
- [ ] All functional requirements are testable
- [ ] Success criteria are measurable and technology-agnostic
- [ ] Loading, empty, and error states are addressed (Principle 2)
- [ ] YAGNI respected — no scope creep (Principle 3)
- [ ] Security considerations noted if user input is involved (Principle 9)

### 5. Create Requirements Checklist

Create `.kiro/specs/<NNN>-<short-name>/checklists/requirements.md` with quality validation items (see Checklist Template below).

### 6. Report

Output: spec file path, checklist path, and suggested next step (`clarify` or `plan`).

---

## Spec Template

```markdown
# Feature Specification: [FEATURE_NAME]

**Spec ID:** [NNN-short-name]
**Status:** Draft

## Summary

[One paragraph: what problem this solves and for whom]

## Actors

- **[Specific Role]:** [what they do in this context]

## User-Facing Goals

- As a [specific role], I want [concrete action] so that [measurable benefit].

## Out of Scope

- [Explicit exclusion 1]
- [Explicit exclusion 2]

## Functional Requirements

1. [Testable requirement — present tense, concrete]
2. …

## Non-Functional Requirements

- **Performance:** [specific target or "standard web app expectations"]
- **Accessibility:** [keyboard navigation, contrast, ARIA if UI]
- **Security:** [input validation, data exposure concerns]
- **Compatibility:** [browsers, Node version if relevant]

## Success Criteria

- [Measurable outcome 1 — no tech stack references]
- [Measurable outcome 2]

## Edge Cases & Error Handling

- [Empty state behavior]
- [Error state behavior]
- [Boundary condition]

## Assumptions

- [Reasonable default assumed — document here instead of asking]

## Open Questions

- [ ] [Only truly blocking decisions — max 3]
```

---

## Requirements Checklist Template

```markdown
# Requirements Quality Checklist: [FEATURE_NAME]

**Purpose:** Validate spec completeness before planning
**Created:** [DATE]

## Content Quality

- [ ] No implementation details (languages, frameworks, APIs)
- [ ] Focused on user value and business needs
- [ ] All mandatory sections completed

## Requirement Completeness

- [ ] No open questions remain unresolved
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [ ] Success criteria are technology-agnostic
- [ ] Edge cases are identified (empty, error, boundary)
- [ ] Scope is clearly bounded

## Constitution Alignment

- [ ] Loading/empty/error states addressed (Principle 2)
- [ ] No scope creep beyond stated need (Principle 3)
- [ ] API contract impact assessed (Principle 4)
- [ ] Security considerations noted (Principle 9)
```
