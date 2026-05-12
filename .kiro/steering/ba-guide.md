# Business Analyst Guide

**Version:** 1.0.0  
**Owner:** BA Chapter Lead  
**Last Updated:** 2026-05-11

---

## Purpose

This document defines the Business Analyst role in the Spec-Driven Development workflow, including responsibilities, artifact standards, and validation criteria.

---

## 1. Role in SDD Pipeline

BAs bridge Product Owners and Development teams:

```
PO writes User Story
       ↓
BA refines with stakeholders
       ↓
BA runs speckit-specify → spec.md
       ↓
BA runs speckit-clarify → resolve ambiguity
       ↓
BA validates spec with stakeholders
       ↓
Dev runs speckit-plan → technical design
```

### 1.1 Primary Responsibilities

- Refine User Stories with stakeholders before entering SDD pipeline
- Transform User Stories into structured specs using `speckit-specify`
- Identify and resolve ambiguity using `speckit-clarify`
- Validate specs against business requirements and stakeholder intent
- Maintain requirements traceability throughout implementation
- Facilitate communication between PO and Dev teams

### 1.2 Collaboration Points

- **With PO:** Clarify acceptance criteria, validate business value
- **With Dev:** Explain business context, answer technical questions about requirements
- **With QA:** Ensure test cases cover all business scenarios
- **With Stakeholders:** Gather requirements, validate solutions

---

## 2. Artifact Standards

### 2.1 Requirements Traceability Matrix

For each feature, maintain traceability:

| User Story ID | Acceptance Criterion | Spec Section  | Plan Section  | Task ID | Test Case ID |
| ------------- | -------------------- | ------------- | ------------- | ------- | ------------ |
| US-001        | AC-1                 | spec.md § 3.1 | plan.md § 2.1 | T-001   | TC-001       |
| US-001        | AC-2                 | spec.md § 3.2 | plan.md § 2.2 | T-002   | TC-002       |

**Location:** `.kiro/specs/NNN-feature-name/traceability.md`

### 2.2 Stakeholder Map

Document stakeholders for each feature:

```markdown
## Stakeholders

| Name          | Role            | Interest | Influence | Engagement Strategy   |
| ------------- | --------------- | -------- | --------- | --------------------- |
| Jane Doe      | Finance Manager | High     | High      | Weekly demos          |
| John Smith    | End User        | High     | Low       | User testing sessions |
| Alice Johnson | IT Director     | Medium   | High      | Monthly reviews       |
```

**Location:** `.kiro/specs/NNN-feature-name/stakeholders.md`

### 2.3 Business Rules Documentation

Extract and document business rules explicitly:

```markdown
## Business Rules

### BR-001: Expense Approval Threshold

- **Rule:** Expenses over $1000 require manager approval
- **Source:** Finance Policy v2.3
- **Validation:** System must prevent submission without approval
- **Related AC:** US-001 AC-3

### BR-002: Category Classification

- **Rule:** Each expense must have exactly one category
- **Source:** Accounting Standards
- **Validation:** Category field is required and single-select
- **Related AC:** US-002 AC-1
```

**Location:** `.kiro/specs/NNN-feature-name/business-rules.md`

---

## 3. Validation Checklist

Before marking a spec as "ready for planning," verify:

### 3.1 Completeness

- [ ] All User Story acceptance criteria are addressed in spec
- [ ] All stakeholder requirements are documented
- [ ] All business rules are extracted and documented
- [ ] All edge cases are identified
- [ ] All error scenarios are defined

### 3.2 Clarity

- [ ] No ambiguous terms (e.g., "soon", "fast", "user-friendly")
- [ ] All technical terms are defined or referenced
- [ ] All acronyms are expanded on first use
- [ ] All assumptions are explicitly stated

### 3.3 Consistency

- [ ] Spec aligns with `constitution.md` principles
- [ ] Spec respects `architecture.md` constraints
- [ ] Spec addresses `security.md` requirements (if applicable)
- [ ] Spec follows `po-constitution.md` standards

### 3.4 Traceability

- [ ] Each acceptance criterion maps to spec section
- [ ] Each business rule is linked to source
- [ ] Stakeholders are documented
- [ ] Success criteria are measurable

### 3.5 Stakeholder Validation

- [ ] Spec reviewed with primary stakeholders
- [ ] Feedback incorporated or documented as out-of-scope
- [ ] Sign-off obtained (or documented as pending)

---

## 4. Agent Usage

### 4.1 `speckit-specify`

**When to use:** Transform a User Story into a structured spec

**Input preparation:**

1. Ensure User Story meets DoR (per `po-constitution.md`)
2. Gather supporting materials (mockups, business rules, stakeholder notes)
3. Identify known constraints from `architecture.md` and `security.md`

**Prompt template:**

```
I want to specify the following User Story:

[paste User Story with acceptance criteria]

Additional context:
- Stakeholders: [list key stakeholders]
- Business rules: [list relevant business rules]
- Constraints: [list technical or security constraints]
```

**Output validation:**

- Verify all acceptance criteria are covered
- Check that scope boundaries are clear
- Ensure success criteria are measurable

### 4.2 `speckit-clarify`

**When to use:** Resolve ambiguity or open questions in a spec

**Before running:**

1. Read the spec and identify ambiguous sections
2. Gather stakeholder input on unclear points
3. Document assumptions that need validation

**Prompt template:**

```
Clarify the spec at .kiro/specs/NNN-feature-name/spec.md

Open questions:
1. [specific question about requirement]
2. [specific question about edge case]

Stakeholder feedback:
- [stakeholder name]: [their input on question 1]
```

**Output validation:**

- All open questions are resolved
- Assumptions are documented
- Spec is ready for technical planning

### 4.3 `speckit-analyze`

**When to use:** Validate spec consistency before planning

**What it checks:**

- Compliance with `constitution.md`, `architecture.md`, `security.md`
- Cross-artifact consistency (spec ↔ User Story)
- Completeness of requirements

**Action on findings:**

- **Blockers:** Must be resolved before proceeding to `speckit-plan`
- **Warnings:** Document as known issues or resolve if feasible

---

## 5. Common Patterns

### 5.1 Handling Ambiguous Requirements

**Problem:** Stakeholder says "the system should be fast"

**BA Action:**

1. Ask clarifying questions: "Fast in what context? Page load? Search results?"
2. Define measurable criteria: "Search results must return in < 2 seconds"
3. Document in spec with specific acceptance criterion
4. Validate with stakeholder

### 5.2 Conflicting Stakeholder Requirements

**Problem:** Finance wants detailed expense categories, Users want simple interface

**BA Action:**

1. Document both requirements in stakeholder map
2. Facilitate discussion to find compromise
3. Propose solution (e.g., "default to simple, advanced mode for power users")
4. Document decision and rationale in spec
5. Get sign-off from both stakeholders

### 5.3 Scope Creep During Refinement

**Problem:** Stakeholder adds new requirements during spec review

**BA Action:**

1. Document new requirements separately
2. Assess impact on current spec (in-scope vs. out-of-scope)
3. If in-scope: update spec and re-validate with PO
4. If out-of-scope: create new User Story for backlog
5. Communicate decision to stakeholder

---

## 6. Quality Standards

### 6.1 Spec Quality Criteria

A high-quality spec:

- **Is complete:** Covers all acceptance criteria, edge cases, and error scenarios
- **Is clear:** No ambiguous terms, all assumptions documented
- **Is consistent:** Aligns with all steering files and User Story
- **Is traceable:** Each requirement links to source and downstream artifacts
- **Is validated:** Reviewed and approved by stakeholders

### 6.2 Common Spec Defects

| Defect                         | Example                     | Fix                                         |
| ------------------------------ | --------------------------- | ------------------------------------------- |
| Ambiguous term                 | "User-friendly interface"   | Define specific usability criteria          |
| Missing edge case              | Only happy path documented  | Add error scenarios and boundary conditions |
| Untraceable requirement        | Requirement with no source  | Link to User Story AC or business rule      |
| Inconsistent terminology       | "User" vs "Customer"        | Use consistent terms throughout             |
| Unmeasurable success criterion | "System should be reliable" | Define specific uptime or error rate        |

---

## 7. Communication Standards

### 7.1 Stakeholder Communication

**Frequency:**

- Weekly updates during active development
- Ad-hoc for clarifications
- Demo after implementation

**Format:**

- Use business language (avoid technical jargon)
- Focus on value and outcomes
- Show progress against acceptance criteria

### 7.2 Developer Communication

**Frequency:**

- Available for questions during planning and implementation
- Attend sprint planning and refinement sessions

**Format:**

- Provide business context for technical decisions
- Explain "why" behind requirements
- Clarify acceptance criteria interpretation

### 7.3 Documentation

**All BA artifacts must:**

- Be stored in `.kiro/specs/NNN-feature-name/`
- Use markdown format
- Include version and last updated date
- Reference related User Stories and specs

---

## 8. Tools and Techniques

### 8.1 Requirements Elicitation

**Techniques:**

- Stakeholder interviews
- Workshops and brainstorming sessions
- Document analysis (existing policies, reports)
- User observation and shadowing
- Prototyping and mockups

### 8.2 Requirements Analysis

**Techniques:**

- EARS notation for acceptance criteria (per `po-constitution.md`)
- GIVEN-WHEN-THEN scenarios for test cases
- Business rules extraction
- Data flow diagrams (when needed)
- Decision tables for complex logic

### 8.3 Requirements Validation

**Techniques:**

- Spec reviews with stakeholders
- Walkthrough sessions with Dev team
- Prototype validation with end users
- Traceability matrix verification

---

## 9. Metrics and KPIs

### 9.1 BA Effectiveness Metrics

Track these metrics to measure BA effectiveness:

| Metric                   | Target                               | How to Measure                              |
| ------------------------ | ------------------------------------ | ------------------------------------------- |
| Spec clarity             | < 5 clarification requests per spec  | Count questions from Dev during planning    |
| Requirements stability   | < 10% change after spec approval     | Track spec amendments during implementation |
| Stakeholder satisfaction | > 4/5 rating                         | Survey after feature delivery               |
| Defect prevention        | < 2 requirements defects per feature | Track bugs caused by unclear requirements   |

### 9.2 Process Metrics

| Metric                  | Target                  | Purpose                 |
| ----------------------- | ----------------------- | ----------------------- |
| Time to specify         | < 2 days per User Story | Measure efficiency      |
| Clarification cycles    | < 2 per spec            | Measure initial quality |
| Stakeholder review time | < 3 days                | Measure engagement      |

---

## 10. Compliance

### 10.1 Mandatory Validations

Before marking a spec as complete, BA **MUST**:

1. Verify all User Story acceptance criteria are addressed
2. Run `speckit-analyze` and resolve all blockers
3. Document stakeholders and obtain sign-off
4. Create traceability matrix
5. Extract and document business rules

### 10.2 Kiro Enforcement

When Kiro assists with BA tasks, it **MUST**:

- Validate specs against `po-constitution.md` standards
- Check compliance with `architecture.md` and `security.md`
- Flag missing traceability or stakeholder documentation
- Reject specs with ambiguous terms or unmeasurable criteria

---

## 11. Amendments

Changes to this document **MUST**:

1. Be proposed by BA Chapter Lead
2. Be reviewed with PO and Dev leads
3. Update the **Version** and **Last Updated** fields
4. Be communicated to all BAs

---

## References

- `po-constitution.md` — User Story standards, INVEST, EARS notation
- `constitution.md` — Project-wide technical constraints
- `architecture.md` — Technology stack and deployment model
- `security.md` — Security and compliance requirements
- `workflow-guide.md` — SDD pipeline and agent usage
- `qa-standards.md` — Test case format and coverage expectations
