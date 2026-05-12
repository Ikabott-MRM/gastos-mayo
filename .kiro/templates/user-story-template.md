# US-[ID]: [Short Descriptive Title]

**Epic:** [Parent epic name]  
**Priority:** High | Medium | Low  
**Story Points:** [1 / 2 / 3 / 5 / 8]  
**Sprint:** [Sprint number or name]  
**Created:** [YYYY-MM-DD]  
**Last Updated:** [YYYY-MM-DD]

---

## User Story

```
As a [specific role — NOT generic "user"],
I want to [concrete, specific action],
so that [measurable benefit for user or business].
```

---

## Acceptance Criteria (EARS Notation)

> Minimum 3, maximum 8. At least 1 negative scenario is MANDATORY.
> Use exclusively these patterns: Ubiquitous | Event-driven | Conditional | Optional | Complex

### AC-01 — [Main happy path scenario]

```
When [trigger event],
the system shall [observable and verifiable action].
```

### AC-02 — [Secondary scenario / variant]

```
Where [state condition],
the system shall [observable and verifiable action].
```

### AC-03 — [Negative scenario] ⚠️ MANDATORY

```
When [error event or edge case],
the system shall [expected error response].
```

<!-- Add AC-04 to AC-08 as needed -->

---

## GIVEN-WHEN-THEN Scenarios

> Complement EARS criteria. One per relevant AC.

### Scenario 1: [Happy path scenario name]

```gherkin
GIVEN [initial context / precondition]
  AND [additional precondition if applicable]
WHEN [user action or event]
THEN [expected observable result]
  AND [additional expected result if applicable]
```

### Scenario 2: [Negative scenario name]

```gherkin
GIVEN [initial context]
WHEN [action that triggers error]
THEN [error message or expected defensive behavior]
```

---

## Definition of Ready — Checklist

Before entering sprint, verify:

- [ ] "As a / I want / so that" format with specific role
- [ ] Meets INVEST criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable)
- [ ] Minimum 3 acceptance criteria in EARS notation
- [ ] At least 1 negative scenario criterion
- [ ] Mockups / wireframes attached (if UI involved)
- [ ] Technical dependencies identified and resolved or accepted
- [ ] No blocking open questions
- [ ] Prioritized in backlog with explicit order

---

## Notes and Dependencies

**Dependencies:** [US-XX, component, external service, etc.]  
**Mockups:** [Link or reference]  
**Technical Notes:** [Constraints, relevant architecture decisions]  
**Out of Scope:** [Explicitly list what is NOT included]

---

## Validation

**Validated against:**

- `po-constitution.md` — User Story standards
- `architecture.md` — Technical constraints
- `security.md` — Security requirements (if applicable)

**Validated by:** [PO name]  
**Validation date:** [YYYY-MM-DD]
