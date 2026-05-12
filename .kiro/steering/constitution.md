---
inclusion: always
---

# Project Constitution — Gastos Mayo (Expenses App)

**Version:** 1.0.0  
**Ratified:** 2026-05-08  
**Last Amended:** 2026-05-08

## Technical Context

- **Repository type:** Full-stack web application (monorepo)
- **Runtime / toolchain:** Node.js (Express backend) + Vanilla React (CDN, no build step)
- **Backend:** `backend/server.js` — Express API on port 3001, reads from `backend/expenses.csv`
- **Frontend:** `frontend/index.html` — Single-file React app via Babel standalone + CDN
- **Public surfaces:** REST API (`GET /api/expenses`, `GET /api/expenses/summary`)
- **Quality bar:** No formal test runner yet; quality relies on review and manual verification

## Core Principles

### 1. Specification and Planning Before Large Changes

- **MUST** capture functional intent (problem, success criteria, out of scope) in `.kiro/specs/` when using Spec-Driven Design for non-trivial work.
- **MUST** treat an active spec as the default source of truth when one exists.
- **MUST** complete requirements → design → tasks in that order before implementation.
- **MUST** follow the SDD pipeline defined in `workflow-guide.md`.

### 2. Clarity, Accessibility, and UI States

- **MUST** favor clear labels, keyboard-operable controls, and sufficient contrast in the UI.
- **MUST** account for **loading, empty, and error** states when exposing async data to the user.
- **MUST NOT** leave the UI in a blank or broken state during data fetching.

### 3. Simplicity (YAGNI)

- **MUST** implement the smallest change that satisfies the spec.
- **MUST NOT** add frameworks, storage layers, or auth not required by the feature.
- The frontend is intentionally a single HTML file — do not introduce a build step unless explicitly specced.

### 4. Contracts and API Stability

- **MUST** respect the existing REST API shape (`/api/expenses`, `/api/expenses/summary`).
- **MUST NOT** break existing query params (`category`, `dateFrom`, `dateTo`) without a spec change.
- New endpoints **MUST** follow the same response envelope pattern defined in `architecture.md` § 2.2.

### 5. Domain Boundaries

- Backend logic stays in `backend/server.js` (or new files under `backend/`).
- Frontend logic stays in `frontend/` — no server-side rendering.
- Data source is `backend/expenses.csv` — do not introduce a database without a spec.

### 6. Types, Structure, and Consistency

- **MUST** follow code standards defined in `dev-practices.md`.
- **MUST** follow the technology stack defined in `architecture.md` § 1.
- JavaScript only (no TypeScript) unless explicitly specced.
- Keep CSV parsing logic in the backend helper `readExpenses()`.

### 7. Build, Artifacts, and Hygiene

- **MUST NOT** commit secrets, tokens, or `.env` files.
- Keep `backend/package.json` dependencies pinned to exact versions.
- Do not add `devDependencies` without justification.

### 8. Documentation

- Keep this constitution and any spec files updated when behavior changes.
- API changes **MUST** be reflected in spec files.

### 9. Security

- **MUST** comply with all requirements in `security.md`.
- **MUST** treat all query parameters as untrusted input — validate and sanitize (per `security.md` § 3.1).
- **MUST NOT** expose file system paths or internal errors to API consumers (per `security.md` § 4.3).
- CSV path **MUST** remain server-side only.

### 10. Performance

- **SHOULD** avoid reading the CSV file more than once per request.
- **SHOULD** keep the frontend bundle-free (CDN only) to maintain fast load times.

### 11. Code Shape

- **SHOULD** keep functions focused and PRs reviewable.
- Express route handlers **SHOULD** delegate to helper functions, not inline all logic.

### 12. Engineering Practices

- **MUST** match existing imports, style, and conventions in touched code.
- Use `async/await` consistently in the backend (already established pattern).

### 13. Testing

- No test runner is currently set up.
- Quality relies on manual testing per `qa-standards.md`.
- All features **MUST** be validated against acceptance criteria by QA.
- When adding a test runner, document it here and in the spec.

## Governance

### Steering File Hierarchy

This constitution orchestrates the following role-specific and domain-specific steering files:

```
constitution.md (this file - orchestrator)
    ↓ references
    ├── architecture.md      — Technology stack, API design, deployment model
    ├── security.md          — Security policies, data protection, compliance
    ├── po-constitution.md   — User Story standards, INVEST, EARS, DoR/DoD
    ├── ba-guide.md          — Requirements analysis, traceability, stakeholder management
    ├── dev-practices.md     — Code standards, git workflow, development practices
    ├── qa-standards.md      — Test case format, quality gates, defect reporting
    └── workflow-guide.md    — SDD pipeline, agent usage, cross-role handoffs
```

### Compliance Validation

All specs, plans, tasks, and implementations **MUST** be validated against:

1. **This constitution** — Core principles and project constraints
2. **`architecture.md`** — Technology and API standards
3. **`security.md`** — Security and compliance requirements
4. **Role-specific guides** — Standards for PO, BA, Dev, QA roles
5. **`workflow-guide.md`** — SDD pipeline and process

### Validation Responsibility

| Artifact       | Validated By  | Against                                                                   |
| -------------- | ------------- | ------------------------------------------------------------------------- |
| User Story     | PO, Kiro      | `po-constitution.md`                                                      |
| Spec           | BA, Kiro      | `constitution.md`, `architecture.md`, `security.md`, `po-constitution.md` |
| Plan           | Dev, Kiro     | `constitution.md`, `architecture.md`, `security.md`, `dev-practices.md`   |
| Tasks          | Dev, Kiro     | `constitution.md`, `architecture.md`, `dev-practices.md`                  |
| Implementation | Dev, QA, Kiro | All steering files                                                        |
| Test Cases     | QA, Kiro      | `qa-standards.md`, `po-constitution.md`, `security.md`                    |

### Amendments

- **Amendments:** update this file via a spec change; bump **Version** and **Last Amended**.
- **Compliance:** Kiro **MUST** validate any spec, plan, or task list against this constitution and all referenced steering files before considering it complete.
- **Conflicts:** if ad hoc instructions conflict with this document or referenced steering files, the steering files win.
- **Precedence:** This constitution takes precedence over role-specific guides when conflicts exist.
