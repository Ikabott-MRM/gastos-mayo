# Kiro Configuration Guide

**Project:** Gastos Mayo (Expenses App)  
**Last Updated:** 2026-05-11

---

## Overview

This project uses **Spec-Driven Development (SDD)** with role-specific governance through steering files. Every role (PO, BA, Dev, QA) has clear standards and workflows.

---

## Quick Start by Role

### 📋 Product Owner

**Your workflow guide:** `.kiro/steering/po-workflow-guide.md`

**Quick command to write a User Story:**

```
Create a User Story for [feature name].

Context:
- User role: [specific role]
- Current problem: [what's broken or missing]
- Desired outcome: [what success looks like]

Edge cases to consider:
- [edge case 1]
- [edge case 2]
```

**Your standards:** `po-constitution.md`  
**Your template:** `.kiro/templates/user-story-template.md`

---

### 🔍 Business Analyst

**Your workflow guide:** `.kiro/steering/ba-guide.md`

**Quick command to create a spec:**

```
Run speckit-specify on the User Story at [file path]

Additional context:
- Stakeholders: [list]
- Business rules: [list]
- Constraints: [list]
```

**Your standards:** `ba-guide.md`  
**Your artifacts:** Requirements traceability, stakeholder maps, business rules

---

### 💻 Developer

**Your workflow guide:** `.kiro/steering/dev-practices.md`

**Quick command to start implementation:**

```
1. Run speckit-plan on .kiro/specs/NNN-feature-name/spec.md
2. Run speckit-tasks on the plan
3. Run speckit-analyze to validate
4. Run speckit-implement to execute tasks
```

**Your standards:** `dev-practices.md`, `architecture.md`, `security.md`  
**Your tools:** Git workflow, code standards, debugging practices

---

### ✅ QA / Tester

**Your workflow guide:** `.kiro/steering/qa-standards.md`

**Quick command to create test cases:**

```
Create test cases for .kiro/specs/NNN-feature-name/spec.md

Include:
- Positive tests (happy path)
- Negative tests (error scenarios)
- Boundary tests (edge cases)

Use GIVEN-WHEN-THEN format
```

**Your standards:** `qa-standards.md`  
**Your artifacts:** Test cases, defect reports, test execution logs

---

## Steering Files Structure

```
.kiro/steering/
├── constitution.md           ← Project orchestrator (references all others)
├── architecture.md           ← Tech stack, API design, deployment
├── security.md               ← Security policies, compliance
├── po-constitution.md        ← User Story standards (INVEST, EARS)
├── po-workflow-guide.md      ← How POs use Kiro
├── ba-guide.md               ← BA role, artifacts, validation
├── dev-practices.md          ← Code standards, git workflow
├── qa-standards.md           ← Test cases, defect reporting
└── workflow-guide.md         ← SDD pipeline (all roles)
```

**All files are always-included** — Kiro sees them automatically.

---

## SDD Pipeline

```
PO writes User Story (po-constitution.md)
       ↓
BA refines with stakeholders (ba-guide.md)
       ↓
BA runs speckit-specify → spec.md
       ↓
BA runs speckit-clarify → resolve ambiguity
       ↓
Dev runs speckit-plan → plan.md
       ↓
Dev runs speckit-tasks → tasks.md
       ↓
Dev runs speckit-analyze → validate consistency
       ↓
Dev runs speckit-implement → working code
       ↓
QA creates test cases (qa-standards.md)
       ↓
QA validates against acceptance criteria
       ↓
PO validates DoD and approves
```

---

## Key Principles

### 1. Constitution Graph

All steering files reference each other:

```
constitution.md (orchestrator)
    ↓ references
    ├── architecture.md      — Tech constraints
    ├── security.md          — Security policies
    ├── po-constitution.md   — Product standards
    ├── ba-guide.md          — Requirements practices
    ├── dev-practices.md     — Code standards
    └── qa-standards.md      — Quality gates
```

### 2. Cross-References

Files reference each other using section notation:

- `architecture.md` § 2.2 — API response format
- `security.md` § 3.1 — Input validation
- `po-constitution.md` — DoR/DoD definitions

### 3. Validation Hierarchy

| Artifact   | Validated Against                                                         |
| ---------- | ------------------------------------------------------------------------- |
| User Story | `po-constitution.md`                                                      |
| Spec       | `constitution.md`, `architecture.md`, `security.md`, `po-constitution.md` |
| Plan       | `constitution.md`, `architecture.md`, `security.md`, `dev-practices.md`   |
| Code       | All steering files                                                        |
| Test Cases | `qa-standards.md`, `po-constitution.md`, `security.md`                    |

---

## Common Commands

### For Everyone

**Validate any artifact:**

```
Validate [file path] against the relevant steering files
```

**Understand the pipeline:**

```
Explain the SDD pipeline for [role]
```

**Check compliance:**

```
Does [file path] comply with all steering files?
```

---

### For POs

**Create a User Story:**

```
Create a User Story for [feature] where [role] needs to [action] because [benefit]
```

**Validate a User Story:**

```
Validate [file path] against po-constitution.md
```

**Split a large story:**

```
This User Story is too large. Split it into smaller stories: [paste story]
```

---

### For BAs

**Create a spec:**

```
Run speckit-specify on [User Story file path]
```

**Clarify a spec:**

```
Run speckit-clarify on .kiro/specs/NNN-feature-name/spec.md
```

**Create traceability matrix:**

```
Create a requirements traceability matrix for .kiro/specs/NNN-feature-name/
```

---

### For Devs

**Plan implementation:**

```
Run speckit-plan on .kiro/specs/NNN-feature-name/spec.md
```

**Generate tasks:**

```
Run speckit-tasks on .kiro/specs/NNN-feature-name/plan.md
```

**Validate before coding:**

```
Run speckit-analyze on .kiro/specs/NNN-feature-name/
```

**Implement:**

```
Run speckit-implement on .kiro/specs/NNN-feature-name/tasks.md
```

---

### For QA

**Generate test cases:**

```
Create test cases for .kiro/specs/NNN-feature-name/spec.md
```

**Validate coverage:**

```
Check if test cases in [file path] cover all acceptance criteria
```

**Report a defect:**

```
Create a defect report for [issue description]
```

---

## Templates

### User Story Template

**Location:** `.kiro/templates/user-story-template.md`

**Usage:**

```
Create a new User Story using the template at .kiro/templates/user-story-template.md
```

### Spec Template

**Location:** Managed by `speckit-specify` agent

**Usage:**

```
Run speckit-specify on [User Story]
```

---

## Project-Specific Context

### Technology Stack

- **Backend:** Node.js + Express (port 3001)
- **Frontend:** React via CDN (no build step)
- **Data:** CSV file (`backend/expenses.csv`)
- **API:** REST (`/api/expenses`, `/api/expenses/summary`)

### Current Limitations

- No authentication (internal tool)
- No database (CSV only)
- No test runner (manual testing)
- No build step (intentional simplicity)

### Before Production

See `security.md` § 10.3 for production blockers:

- ❌ Implement authentication
- ❌ Enable HTTPS
- ❌ Implement input validation
- ❌ Restrict CORS

---

## Getting Help

### By Role

**PO:** Read `po-workflow-guide.md` for detailed examples  
**BA:** Read `ba-guide.md` § 4 for agent usage  
**Dev:** Read `dev-practices.md` § 4 for agent usage  
**QA:** Read `qa-standards.md` § 7 for agent usage

### By Task

**Writing requirements:** See `po-constitution.md` and `ba-guide.md`  
**Technical design:** See `architecture.md` and `dev-practices.md`  
**Security:** See `security.md`  
**Testing:** See `qa-standards.md`  
**Process:** See `workflow-guide.md`

### Ask Kiro

```
How do I [task] as a [role]?
```

```
What are the standards for [artifact type]?
```

```
Show me an example of [User Story / spec / test case / etc.]
```

---

## Amendments

To change any steering file:

1. Create a spec in `.kiro/specs/`
2. Get approval from file owner (see **Owner** field in each file)
3. Update the file
4. Bump **Version** and **Last Updated**
5. Communicate changes to team

---

## Quick Reference Card

| I want to...          | Command                                      |
| --------------------- | -------------------------------------------- |
| Write a User Story    | `Create a User Story for [feature]...`       |
| Validate a User Story | `Validate [file] against po-constitution.md` |
| Create a spec         | `Run speckit-specify on [User Story]`        |
| Clarify a spec        | `Run speckit-clarify on [spec]`              |
| Plan implementation   | `Run speckit-plan on [spec]`                 |
| Generate tasks        | `Run speckit-tasks on [plan]`                |
| Validate consistency  | `Run speckit-analyze on [spec directory]`    |
| Implement             | `Run speckit-implement on [tasks]`           |
| Create test cases     | `Create test cases for [spec]`               |
| Report a defect       | `Create a defect report for [issue]`         |
| Check compliance      | `Validate [file] against all steering files` |

---

## Support

For questions about:

- **Process:** Ask your Scrum Master or Process Owner
- **Standards:** Check the relevant steering file
- **Kiro usage:** Ask Kiro directly with your question
- **Technical issues:** Check `dev-practices.md` § 9 (Debugging)

---

**Remember:** All steering files are always active. Kiro sees them automatically and will validate your work against them. Trust the process! 🚀
