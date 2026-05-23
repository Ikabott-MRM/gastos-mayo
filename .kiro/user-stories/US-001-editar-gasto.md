# US-001: Editar Gasto Existente

**Epic:** Gestión de Gastos  
**Priority:** High  
**Story Points:** [Pendiente estimación]  
**Sprint:** [Pendiente asignación]  
**Created:** 2026-05-12  
**Last Updated:** 2026-05-12 (H2: corrected invalid categories in Scenario 1 — "Food"→"Meals", "Transport"→"Travel")

---

## User Story

```
As a Finance Manager,
I want to edit existing expense records,
so that I can correct errors and reclassify expenses when categories change.
```

---

## Acceptance Criteria (EARS Notation)

### AC-01 — Editar campos de gasto válido

```
When the Finance Manager selects an expense less than 90 days old and modifies any field (date, category, amount, description),
the system shall save the updated expense and display a success confirmation.
```

### AC-02 — Validar monto positivo

```
When the Finance Manager enters an invalid amount (negative, zero, or non-numeric),
the system shall display a visual error indicator and prevent saving until corrected.
```

### AC-03 — Validar campos obligatorios

```
When the Finance Manager attempts to save an expense with empty required fields (date, category, amount),
the system shall display a visual error indicator for each missing field and prevent saving.
```

### AC-04 — Restricción de antigüedad (negativo)

```
When the Finance Manager attempts to edit an expense older than 90 days,
the system shall display an error message "Cannot edit expenses older than 90 days" and prevent editing.
```

### AC-05 — Actualizar totales después de edición

```
When an expense is successfully edited,
the system shall recalculate and display the updated total amount and expense count.
```

---

## GIVEN-WHEN-THEN Scenarios

### Scenario 1: Editar gasto reciente exitosamente

```gherkin
GIVEN the expense list contains an expense dated 2026-05-01 (11 days old)
  AND the expense has category "Meals", amount 25.50, description "Lunch"
WHEN the Finance Manager changes the category to "Travel" and amount to 30.00
  AND clicks "Save"
THEN the system shall save the updated expense
  AND display "Expense updated successfully"
  AND update the total to reflect the new amount
```

### Scenario 2: Rechazar monto inválido

```gherkin
GIVEN the Finance Manager is editing an expense
WHEN the Finance Manager enters "-50" in the amount field
THEN the system shall display a red border around the amount field
  AND show error message "Amount must be a positive number"
  AND disable the "Save" button
```

### Scenario 3: Rechazar campos vacíos

```gherkin
GIVEN the Finance Manager is editing an expense
WHEN the Finance Manager clears the category field
  AND attempts to save
THEN the system shall display a red border around the category field
  AND show error message "Field category is required"
  AND prevent saving
```

### Scenario 4: Bloquear edición de gasto antiguo

```gherkin
GIVEN the expense list contains an expense dated 2026-02-01 (100 days old)
WHEN the Finance Manager attempts to edit that expense
THEN the system shall display error message "Cannot edit expenses older than 90 days"
  AND disable all input fields
  AND hide the "Save" button
```

### Scenario 5: Actualizar totales tras edición

```gherkin
GIVEN the expense list has a total of $500.00
  AND contains an expense with amount $50.00
WHEN the Finance Manager edits that expense to $75.00
  AND saves successfully
THEN the system shall update the total to $525.00
  AND update the expense count if applicable
```

---

## Definition of Ready — Checklist

- [x] "As a / I want / so that" format with specific role (Finance Manager)
- [x] Meets INVEST criteria
  - Independent: Can be implemented without other stories
  - Negotiable: How to implement is flexible
  - Valuable: Enables error correction and reclassification
  - Estimable: Team can estimate effort
  - Small: Fits in one sprint
  - Testable: Has verifiable acceptance criteria
- [x] Minimum 3 acceptance criteria in EARS notation (5 provided)
- [x] At least 1 negative scenario (AC-02, AC-03, AC-04)
- [ ] Mockups / wireframes attached (pendiente)
- [x] Technical dependencies identified (requires existing expense list functionality)
- [x] No blocking open questions
- [x] Prioritized in backlog with explicit order (High priority)

---

## Notes and Dependencies

**Dependencies:**

- Existing expense list display functionality
- CSV read/write operations in backend
- Date calculation logic for 90-day restriction

**Mockups:** Pendiente — se recomienda mockup de formulario de edición con estados de error

**Technical Notes:**

- Debe respetar estructura CSV existente (`backend/expenses.csv`)
- Validación de fecha debe considerar zona horaria del servidor
- Restricción de 90 días se calcula desde la fecha del gasto, no desde fecha de creación del registro

**Out of Scope:**

- Historial de cambios (auditoría de ediciones)
- Edición masiva de múltiples gastos
- Permisos diferenciados por rol (solo Finance Manager existe actualmente)
- Notificaciones de cambios a otros usuarios
- Deshacer/rehacer cambios

---

## Business Rules

### BR-001: Restricción de Antigüedad de Edición

- **Rule:** Solo se pueden editar gastos con fecha menor a 90 días desde hoy
- **Source:** Política de cierre contable mensual
- **Validation:** Sistema debe calcular diferencia entre fecha del gasto y fecha actual
- **Related AC:** AC-04

### BR-002: Validación de Monto

- **Rule:** El monto debe ser un número positivo mayor que cero
- **Source:** Estándar contable
- **Validation:** Validación en frontend y backend
- **Related AC:** AC-02

### BR-003: Campos Obligatorios

- **Rule:** Fecha, categoría y monto son campos obligatorios
- **Source:** Estructura de datos requerida para reportes
- **Validation:** Validación en frontend antes de enviar
- **Related AC:** AC-03

---

## Validation

**Validated against:**

- `po-constitution.md` — ✅ Cumple formato, INVEST, EARS, mínimo 3 AC, 1 negativo
- `architecture.md` — ✅ Respeta stack actual (Express backend, React frontend, CSV data)
- `security.md` — ✅ Requiere validación de input (AC-02, AC-03)

**Validated by:** [PO name — pendiente]  
**Validation date:** 2026-05-12
