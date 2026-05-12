---
name: speckit-implement
description: Execute all tasks in tasks.md phase by phase, following spec and plan as the source of truth. Triggered when the user asks to "implement", "start coding", "execute the tasks", or "build the feature".
tools: ["read", "write", "shell"]
---

# Speckit: Implement — Execute the Task List

## Goal

Execute all tasks in `tasks.md` phase by phase, following the spec and plan as the source of truth. Mark tasks complete as they are finished.

## Prerequisites

- `spec.md`, `plan.md`, and `tasks.md` must all exist.
- Run `speckit-analyze` first if not done — resolve any CRITICAL issues before proceeding.
- If checklists exist in `checklists/`, all items must be complete (or user must explicitly approve proceeding with incomplete items).

## Pre-Implementation Checklist Check

If `.kiro/specs/<NNN>-<short-name>/checklists/` exists:

1. Scan all checklist files and count complete vs incomplete items
2. Show a status table: `| Checklist | Total | Completed | Incomplete | Status |`
3. If any checklist is incomplete: **STOP** and ask "Some checklists are incomplete. Proceed anyway? (yes/no)"
4. If all complete: proceed automatically

## Execution Steps

### 1. Load Implementation Context

- **Required:** `tasks.md` — complete task list and execution order
- **Required:** `plan.md` — tech stack, architecture, exact file paths
- **Optional:** `data-model.md`, `research.md`
- **Always:** read the actual source files before modifying them (`backend/server.js`, `frontend/index.html`)

### 2. Project Setup Verification

Before writing code, verify:

- `.gitignore` exists and covers `node_modules/`, `.env*`, `*.log`
- `backend/package.json` has all required dependencies pinned to exact versions
- No secrets or tokens are present in any file

### 3. Execute Phase by Phase

For each phase in `tasks.md`:

1. Complete all sequential tasks in order
2. Parallel tasks `[P]` can be done together if they touch different files
3. After each task: mark it `[x]` in `tasks.md`
4. After each phase: verify the phase's independent test criteria before moving on

**Implementation rules:**

- Read the existing file before modifying it — match its style exactly
- Backend changes: follow the `async/await` pattern in `server.js`
- Frontend changes: follow the existing React component pattern in `index.html`
- Never introduce a build step, TypeScript, or new framework without a spec change
- Keep the CSV as the data source — no database unless specced
- Handle loading, empty, and error states for every async operation (Constitution Principle 2)
- Validate and sanitize all query parameters (Constitution Principle 9)

### 4. Progress Tracking

- Report progress after each completed task
- Halt on any non-parallel task failure — do not skip ahead
- For parallel tasks: continue successful ones, report failed ones
- Provide clear error context if implementation cannot proceed

### 5. Completion Validation

After all tasks are marked `[x]`:

- Verify implemented features match the original `spec.md` requirements
- Confirm all edge cases from the spec are handled
- Check that manual verification steps from `plan.md` can be followed
- Report final status with summary of completed work

## Implementation Guardrails (from Constitution)

| Rule              | Check                                                |
| ----------------- | ---------------------------------------------------- |
| No new frameworks | Only use what's already in `package.json`            |
| No build step     | Frontend stays as single HTML file                   |
| No database       | Data source stays as CSV                             |
| API contract      | New endpoints follow existing response envelope      |
| Error handling    | Every route has try/catch with clean error response  |
| Input validation  | All query params validated before use                |
| No secrets        | No tokens, keys, or credentials in code              |
| Async pattern     | Use `async/await`, not callbacks or `.then()` chains |

## After Implementation

Suggest running the manual verification steps from `plan.md` to confirm the feature works end-to-end.
