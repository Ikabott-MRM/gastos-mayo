---
inclusion: always
---

# Spec-Driven Development Workflow Guide

This project uses **Spec-Driven Design**. Every non-trivial feature follows this pipeline before any code is written.

## The Pipeline

```
specify → clarify → plan → tasks → analyze → implement
```

| Step          | Agent               | What happens                                     | Output                                |
| ------------- | ------------------- | ------------------------------------------------ | ------------------------------------- |
| **specify**   | `speckit-specify`   | Natural language → structured spec               | `.kiro/specs/NNN-name/spec.md`        |
| **clarify**   | `speckit-clarify`   | Remove ambiguity, answer open questions          | Updated `spec.md`                     |
| **plan**      | `speckit-plan`      | Spec → technical design + constitution check     | `plan.md`, optionally `data-model.md` |
| **tasks**     | `speckit-tasks`     | Plan → ordered, executable task list             | `tasks.md`                            |
| **analyze**   | `speckit-analyze`   | Read-only consistency check across all artifacts | Analysis report (no file writes)      |
| **implement** | `speckit-implement` | Execute tasks phase by phase                     | Working code, tasks marked `[x]`      |
| **checklist** | `speckit-checklist` | Requirements quality validation                  | `checklists/<domain>.md`              |

## Quick Reference

**Starting a new feature:**

> "I want to [describe feature]" → use agent `speckit-specify`

**After spec is written:**

> "Clarify the spec" → use agent `speckit-clarify`

**After clarification:**

> "Plan the implementation" → use agent `speckit-plan`

**After plan is ready:**

> "Generate tasks" → use agent `speckit-tasks`

**Before coding:**

> "Analyze the spec for consistency" → use agent `speckit-analyze`

**Ready to build:**

> "Implement the feature" → use agent `speckit-implement`

**Requirements quality check:**

> "Create a [ux/api/security] checklist" → use agent `speckit-checklist`

## Spec Directory Structure

```
.kiro/specs/
└── 001-feature-name/
    ├── spec.md          ← WHAT and WHY (no implementation details)
    ├── plan.md          ← HOW (technical design)
    ├── tasks.md         ← ordered task list
    ├── data-model.md    ← entities and relationships (if applicable)
    ├── research.md      ← decisions and rationale (if applicable)
    └── checklists/
        ├── requirements.md   ← auto-created by speckit-specify
        ├── ux.md             ← created by speckit-checklist
        └── api.md            ← created by speckit-checklist
```

## Rules

1. **Spec first** — no implementation without a spec for non-trivial features
2. **Constitution always applies** — Kiro validates every artifact against `.kiro/steering/constitution.md`
3. **Analyze before implement** — run `speckit-analyze` to catch issues before writing code
4. **Tasks are the contract** — once `tasks.md` exists, implementation follows it exactly
5. **Mark tasks done** — after each task, mark `[x]` in `tasks.md`

## Skipping Steps

You can skip steps for small/trivial changes, but:

- Skipping `clarify` → warn that rework risk increases
- Skipping `analyze` → warn that inconsistencies may surface during implementation
- Skipping `specify` entirely → only acceptable for single-line fixes or typos

## PR Workflow (IBK)

For Jira-tracked work, the full workflow is:

```
refine ticket → start task (branch) → specify → clarify → plan → tasks → analyze → implement → end task (PR + Jira)
```

| Action                                      | Agent / Command             |
| ------------------------------------------- | --------------------------- |
| Refine a Jira ticket into a structured spec | `ibk-refine`                |
| Create branch + move Jira to In Progress    | `ibk-start-task`            |
| Create PR description from branch diff      | `ibk-create-pr-description` |
| Open draft PR + move Jira to In Review      | `ibk-end-task`              |
| Review a PR (constitution + code quality)   | `ibk-review-pr`             |
| Apply PR review feedback                    | `ibk-resolve-pr-issues`     |
| Merge PR + move Jira to Deploy              | `ibk-merge-pr`              |

## This Project's Stack

- **Backend:** `backend/server.js` — Express on port 3001, CSV data source
- **Frontend:** `frontend/index.html` — Single-file React (CDN, no build step)
- **Data:** `backend/expenses.csv`
- **API:** `GET /api/expenses`, `GET /api/expenses/summary`

Keep this in mind when writing specs — no database, no build step, no TypeScript unless explicitly specced.
