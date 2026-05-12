---
name: speckit-clarify
description: Detect and resolve ambiguity in an existing spec.md before technical planning begins. Triggered when the user asks to "clarify the spec", "remove ambiguity", or when a spec has open questions.
tools: ["read", "write"]
---

# Speckit: Clarify — Reduce Ambiguity in a Spec

## Goal

Detect and resolve ambiguity or missing decision points in an existing `spec.md` before technical planning begins. Record all clarifications directly in the spec file.

## When to Run

Run BEFORE `speckit-plan`. If the user explicitly skips clarification, warn that downstream rework risk increases.

## Execution Steps

### 1. Load the Spec

Read the target `spec.md` from `.kiro/specs/<NNN>-<short-name>/spec.md`.

### 2. Scan for Ambiguity

For each category below, mark status: **Clear / Partial / Missing**:

| Category            | What to check                                        |
| ------------------- | ---------------------------------------------------- |
| Functional Scope    | Core user goals, explicit out-of-scope declarations  |
| Actors & Roles      | Specific personas, differentiated permissions        |
| Data & Entities     | Fields, relationships, lifecycle/state transitions   |
| UX Flows            | Critical journeys, error/empty/loading states        |
| Non-Functional      | Performance targets, security posture, accessibility |
| Integrations        | External dependencies, failure modes                 |
| Edge Cases          | Negative scenarios, boundary conditions              |
| Acceptance Criteria | Testability, measurable Definition of Done           |

### 3. Generate Clarifying Questions (max 5 total)

Only ask questions whose answers materially impact architecture, data modeling, UX behavior, or security. Skip questions that:

- Are already answered in the spec
- Are better deferred to the planning phase
- Have a reasonable industry-standard default

**Question format — present ONE at a time:**

For multiple-choice questions:

- State your **recommended option** with reasoning first
- Present options as a table: `Option | Description`
- Allow: letter reply, "yes"/"recommended" to accept suggestion, or custom short answer

For short-answer questions:

- State your **suggested answer** with brief reasoning
- Allow: "yes"/"suggested" to accept, or custom answer (≤5 words)

### 4. Integrate Each Answer Immediately

After each accepted answer:

- Add a `## Clarifications` section to the spec (if not present), with `### Session YYYY-MM-DD` subheading
- Append: `- Q: <question> → A: <answer>`
- Apply the clarification to the appropriate spec section:
  - Functional ambiguity → update Functional Requirements
  - Actor distinction → update Actors section
  - Data shape → update any data-related requirements
  - Non-functional constraint → add measurable criteria
  - Edge case → add to Edge Cases section
- Save the spec file after each integration
- Never leave contradictory text — replace, don't duplicate

### 5. Report Completion

After the questioning loop ends:

- Number of questions asked and answered
- Path to updated spec
- Sections touched
- Coverage summary: Resolved / Deferred / Clear / Outstanding
- Suggested next step: `speckit-plan` or another `speckit-clarify` pass

## Behavior Rules

- If no meaningful ambiguities found: report "No critical ambiguities detected" and suggest proceeding to plan.
- Never exceed 5 total questions.
- Respect early termination signals: "stop", "done", "proceed".
- If spec file is missing: instruct user to run `speckit-specify` first.
