---
name: speckit-plan
description: Transform a validated spec.md into a technical implementation plan (plan.md) covering architecture, data model, and design decisions — without writing any code. Triggered when the user asks to "plan", "create a technical plan", or "design the implementation".
tools: ["read", "write"]
---

# Speckit: Plan — Technical Design from Spec

## Goal

Transform a validated `spec.md` into a technical implementation plan (`plan.md`) that covers architecture, data model, and design decisions — without writing any code.

## Prerequisites

- `spec.md` must exist and have no unresolved open questions.
- Clarification (`speckit-clarify`) should have run first. If skipped, warn the user.

## Execution Steps

### 1. Load Context

Read from the spec directory:

- `spec.md` — functional requirements and success criteria
- `.kiro/steering/constitution.md` — principles to validate against

Also read the current project files to understand the existing stack:

- `backend/server.js`, `backend/package.json`
- `frontend/index.html`

### 2. Constitution Check

For each principle, mark **Satisfied / Exception (justify) / N/A**:

| Principle                                               | Check |
| ------------------------------------------------------- | ----- |
| 1. Spec exists and is source of truth                   |       |
| 2. Loading, empty, error states addressed               |       |
| 3. YAGNI — no unnecessary additions                     |       |
| 4. API contract impact assessed                         |       |
| 5. Domain boundaries respected (backend/frontend split) |       |
| 6. Consistent code style and structure                  |       |
| 7. No secrets, pinned dependencies                      |       |
| 8. Documentation updated                                |       |
| 9. Security — untrusted input handled                   |       |
| 10. Performance — no redundant CSV reads                |       |
| 11. Focused functions, reviewable PRs                   |       |
| 12. Matches existing conventions                        |       |
| 13. Manual verification steps documented                |       |

**Block planning if any MUST principle is violated without justification.**

### 3. Research Phase (if needed)

For any "NEEDS CLARIFICATION" items in the technical context:

- Document the decision, rationale, and alternatives considered.
- Record in a `research.md` file in the spec directory.

### 4. Generate plan.md

Create `.kiro/specs/<NNN>-<short-name>/plan.md` using the Plan Template below.

### 5. Generate data-model.md (if data entities are involved)

If the feature introduces or modifies data entities, create `data-model.md`:

- Entity name, fields, types, validation rules
- Relationships between entities
- State transitions if applicable

### 6. Report

Output: plan file path, any generated artifacts, constitution check results, and suggested next step (`speckit-tasks`).

---

## Plan Template

```markdown
# Implementation Plan: [FEATURE_NAME]

**Spec ID:** [NNN-short-name]
**Status:** Draft

## Technical Context

- **Stack:** Node.js/Express backend + single-file React frontend (CDN)
- **Relevant files:** [list files that will be touched]
- **New dependencies:** [none, or name + justification]
- **Breaking changes:** [none, or describe impact on existing API]

## Constitution Check

| Principle            | Status    | Notes |
| -------------------- | --------- | ----- |
| 1. Spec-first        | Satisfied |       |
| 2. UI states         |           |       |
| 3. YAGNI             |           |       |
| 4. API contracts     |           |       |
| 5. Domain boundaries |           |       |
| 6. Code consistency  |           |       |
| 7. Hygiene           |           |       |
| 8. Docs              |           |       |
| 9. Security          |           |       |
| 10. Performance      |           |       |
| 11. Code shape       |           |       |
| 12. Conventions      |           |       |
| 13. Testing          |           |       |

## Architecture Notes

### Backend Changes

- [What changes in server.js or new backend files]
- [New endpoints or modifications to existing ones]
- [Data flow: CSV → parsing → response]

### Frontend Changes

- [What changes in index.html]
- [New UI components or state]
- [API calls added or modified]

### Data Model (if applicable)

- See `data-model.md`

## API Contract (if new/changed endpoints)

GET /api/[endpoint]
Query params: [name: type — description]
Response: { [shape] }
Error: { error: string }

## Risks

- [Risk 1 and mitigation]

## Manual Verification Steps

1. [How to verify this feature works without automated tests]
2. [Edge case to manually test]
```
