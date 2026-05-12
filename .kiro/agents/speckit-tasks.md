---
name: speckit-tasks
description: Transform a validated plan.md into an ordered, dependency-aware tasks.md that is immediately executable. Triggered when the user asks to "generate tasks", "break down the plan", or "create a task list".
tools: ["read", "write"]
---

# Speckit: Tasks — Generate Implementation Task List

## Goal

Transform a validated `plan.md` into an ordered, dependency-aware `tasks.md` that is immediately executable — each task specific enough to complete without additional context.

## Prerequisites

- `spec.md` and `plan.md` must exist in the spec directory.
- Constitution check in `plan.md` must show no unresolved MUST violations.

## Execution Steps

### 1. Load Design Documents

From `.kiro/specs/<NNN>-<short-name>/`:

- **Required:** `plan.md` (tech stack, files, architecture)
- **Required:** `spec.md` (user stories with priorities)
- **Optional:** `data-model.md`, `research.md`

### 2. Extract and Map

- Extract user stories from `spec.md` with their priorities (P1, P2, P3…)
- Extract tech stack, file paths, and architecture decisions from `plan.md`
- Map each task to the user story it serves

### 3. Generate tasks.md

Create `.kiro/specs/<NNN>-<short-name>/tasks.md` using the structure below.

### 4. Task Format Rules (CRITICAL)

Every task MUST follow this exact format:

```
- [ ] [TaskID] [P?] [Story?] Description with exact file path
```

**Components:**

1. **Checkbox:** always `- [ ]`
2. **Task ID:** sequential `T001, T002, T003…` in execution order
3. **[P] marker:** include ONLY if task is parallelizable (different files, no incomplete dependencies)
4. **[Story] label:** `[US1]`, `[US2]`… for user story phase tasks; omit for setup/polish phases
5. **Description:** clear action with exact file path

**Examples:**

- ✅ `- [ ] T001 Create backend route handler in backend/server.js`
- ✅ `- [ ] T005 [P] [US1] Add category filter UI in frontend/index.html`
- ❌ `- [ ] Add filter` (missing ID, story label, file path)
- ❌ `T001 [US1] Update server` (missing checkbox)

### 5. Phase Structure

```
Phase 1: Setup (project initialization, ignore files, config)
Phase 2: Foundational (blocking prerequisites for all stories)
Phase 3+: One phase per user story in priority order (P1 first)
  - Within each story: Backend → Frontend → Integration
Final Phase: Polish & Cross-Cutting (error handling, edge cases, docs)
```

Each user story phase should be independently testable when complete.

### 6. Report

Output: path to `tasks.md`, total task count, tasks per story, parallel opportunities, suggested MVP scope (typically just US1).

---

## Tasks Template

```markdown
# Task List: [FEATURE_NAME]

**Spec ID:** [NNN-short-name]
**Total tasks:** [N]

## Dependencies

[US1] → [US2] → [US3] (or note if independent)

## Phase 1: Setup

- [ ] T001 [description] in [file path]

## Phase 2: Foundational

- [ ] T002 [description] in [file path]

## Phase 3: [User Story 1 Name] [US1]

**Story goal:** [one line]
**Independent test:** [how to verify this story works in isolation]

- [ ] T003 [P] [US1] [description] in [file path]
- [ ] T004 [US1] [description] in [file path]

## Phase 4: [User Story 2 Name] [US2]

**Story goal:** [one line]
**Independent test:** [how to verify]

- [ ] T005 [P] [US2] [description] in [file path]

## Final Phase: Polish

- [ ] T00N Update manual verification steps in plan.md
- [ ] T00N+1 Verify all edge cases from spec.md are handled
```
