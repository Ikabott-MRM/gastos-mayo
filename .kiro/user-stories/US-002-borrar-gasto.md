# US-002: Borrar Gasto Existente

**Epic:** Gestión de Gastos  
**Priority:** High  
**Story Points:** [Pendiente estimación]  
**Sprint:** [Pendiente asignación]  
**Created:** 2026-05-13  
**Last Updated:** 2026-05-13

---

## User Story

```
As a Finance Manager,
I want to delete an expense record from the list,
so that I can remove duplicate entries or incorrectly registered expenses and keep the expense data accurate.
```

---

## Acceptance Criteria (EARS Notation)

> 6 criterios — al menos 2 escenarios negativos.

### AC-01 — Confirmar antes de borrar

```
When the Finance Manager selects the delete action on an expense,
the system shall display a confirmation dialog before permanently deleting the record.
```

### AC-02 — Borrar gasto confirmado

```
When the Finance Manager confirms the deletion in the confirmation dialog,
the system shall permanently remove the expense from the data source and display a success message.
```

### AC-03 — Actualizar totales tras borrado

```
When an expense is successfully deleted,
the system shall recalculate and display the updated total amount and expense count.
```

### AC-04 — Cancelar borrado (negativo)

```
When the Finance Manager dismisses the confirmation dialog without confirming,
the system shall cancel the deletion and leave the expense record unchanged.
```

### AC-05 — Restricción de antigüedad (negativo)

```
When the Finance Manager attempts to delete an expense older than 90 days,
the system shall display an error message "Cannot delete expenses older than 90 days" and prevent deletion.
```

### AC-06 — Manejar error de borrado (negativo)

```
When the deletion operation fails due to a server or file system error,
the system shall display an error message "Failed to delete expense. Please try again." and leave the expense record unchanged.
```

---

## GIVEN-WHEN-THEN Scenarios

### Scenario 1: Borrar gasto reciente con confirmación

```gherkin
GIVEN the expense list contains an expense dated 2026-05-01 with amount $25.50
  AND the expense is less than 90 days old
WHEN the Finance Manager clicks the delete button on that expense
THEN the system shall display a confirmation dialog with the message "Are you sure you want to delete this expense?"
  AND show the expense details (date, category, amount) in the dialog
```

### Scenario 2: Confirmar borrado exitoso

```gherkin
GIVEN the confirmation dialog is displayed for an expense with amount $25.50
  AND the current total is $500.00
WHEN the Finance Manager clicks "Confirm" in the dialog
THEN the system shall remove the expense from the list
  AND display "Expense deleted successfully"
  AND update the total to $474.50
  AND update the expense count by -1
```

### Scenario 3: Cancelar borrado

```gherkin
GIVEN the confirmation dialog is displayed for an expense
WHEN the Finance Manager clicks "Cancel" in the dialog
THEN the system shall close the dialog
  AND leave the expense record unchanged in the list
  AND keep the total and count unchanged
```

### Scenario 4: Bloquear borrado de gasto antiguo

```gherkin
GIVEN the expense list contains an expense dated 2026-02-01 (more than 90 days old)
WHEN the Finance Manager attempts to delete that expense
THEN the system shall display error message "Cannot delete expenses older than 90 days"
  AND not show the confirmation dialog
  AND leave the expense record unchanged
```

### Scenario 5: Manejar error del servidor

```gherkin
GIVEN the Finance Manager has confirmed the deletion of an expense
  AND the server returns a 500 error
WHEN the deletion request fails
THEN the system shall display "Failed to delete expense. Please try again."
  AND keep the expense visible in the list
  AND keep the total and count unchanged
```

---

## Definition of Ready — Checklist

- [x] "As a / I want / so that" format with specific role (Finance Manager)
- [x] Meets INVEST criteria
  - Independent: Can be implemented without other stories (no dependency on US-001)
  - Negotiable: El cómo (botón, ícono, menú contextual) es flexible
  - Valuable: Permite mantener datos precisos eliminando registros incorrectos
  - Estimable: El equipo puede estimar sin información adicional
  - Small: Completable en un sprint
  - Testable: Tiene criterios de aceptación verificables
- [x] Minimum 3 acceptance criteria in EARS notation (6 provided)
- [x] At least 1 negative scenario (AC-04, AC-05, AC-06)
- [ ] Mockups / wireframes attached (pendiente)
- [x] Technical dependencies identified (requiere endpoint DELETE en backend y CSV write)
- [x] No blocking open questions
- [x] Prioritized in backlog with explicit order (High priority)

---

## Notes and Dependencies

**Dependencies:**

- Existing expense list display functionality
- CSV read/write operations in backend
- Date calculation logic for 90-day restriction (compartida con US-001)

**Mockups:** Pendiente — se recomienda mockup del diálogo de confirmación con detalle del gasto

**Technical Notes:**

- Requiere nuevo endpoint `DELETE /api/expenses/:id` en `backend/server.js`
- El CSV no tiene campo `id` actualmente — se debe definir estrategia de identificación (índice de fila, o agregar campo `id`)
- La restricción de 90 días se calcula desde la fecha del gasto, no desde la fecha de creación del registro
- La operación de borrado en CSV implica reescribir el archivo completo

**Out of Scope:**

- Borrado masivo de múltiples gastos
- Papelera de reciclaje o posibilidad de deshacer el borrado
- Historial de auditoría de registros eliminados
- Permisos diferenciados por rol
- Archivado de gastos (soft delete)

---

## Business Rules

### BR-001: Restricción de Antigüedad de Borrado

- **Rule:** Solo se pueden borrar gastos con fecha menor a 90 días desde hoy
- **Source:** Política de cierre contable mensual
- **Validation:** Sistema debe calcular diferencia entre fecha del gasto y fecha actual
- **Related AC:** AC-05

### BR-002: Confirmación Obligatoria

- **Rule:** Toda eliminación requiere confirmación explícita del usuario
- **Source:** Buenas prácticas de UX para operaciones destructivas irreversibles
- **Validation:** El sistema nunca debe borrar sin mostrar el diálogo de confirmación
- **Related AC:** AC-01, AC-04

### BR-003: Atomicidad del Borrado

- **Rule:** Si el borrado falla, el registro debe permanecer intacto
- **Source:** Integridad de datos
- **Validation:** En caso de error del servidor, el gasto debe seguir visible en la lista
- **Related AC:** AC-06

---

## Validation

**Validated against:**

- `po-constitution.md` — ✅ Cumple formato As a/I want/so that, rol específico, INVEST, EARS, 6 AC (mín. 3), 3 escenarios negativos (AC-04, AC-05, AC-06)
- `architecture.md` — ✅ Respeta stack actual (Express backend, React frontend, CSV data); requiere nuevo endpoint DELETE
- `security.md` — ✅ Requiere validación de input (restricción de antigüedad), manejo de errores sin exponer detalles internos

**Validated by:** [PO name — pendiente]  
**Validation date:** 2026-05-13
