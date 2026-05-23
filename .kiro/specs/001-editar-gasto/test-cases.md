# Test Cases: Edit Existing Expense

**User Story:** US-001 — Editar Gasto Existente  
**Spec:** `.kiro/specs/001-editar-gasto/spec.md`  
**Plan:** `.kiro/specs/001-editar-gasto/plan.md`  
**Created:** 2026-05-12  
**Last Updated:** 2026-05-12  
**QA Owner:** QA Chapter

---

## Test Case Summary

| ID     | AC    | Type     | Status  | Priority |
| ------ | ----- | -------- | ------- | -------- |
| TC-001 | AC-01 | Positive | Pending | High     |
| TC-002 | AC-01 | Negative | Pending | High     |
| TC-003 | AC-01 | Boundary | Pending | High     |
| TC-004 | AC-02 | Positive | Pending | High     |
| TC-005 | AC-02 | Negative | Pending | High     |
| TC-006 | AC-02 | Negative | Pending | High     |
| TC-007 | AC-02 | Boundary | Pending | Medium   |
| TC-008 | AC-03 | Negative | Pending | High     |
| TC-009 | AC-03 | Negative | Pending | High     |
| TC-010 | AC-03 | Negative | Pending | High     |
| TC-011 | AC-03 | Negative | Pending | High     |
| TC-012 | AC-03 | Negative | Pending | Medium   |
| TC-013 | AC-04 | Positive | Pending | High     |
| TC-014 | AC-04 | Boundary | Pending | High     |
| TC-015 | AC-04 | Boundary | Pending | High     |
| TC-016 | AC-05 | Positive | Pending | High     |
| TC-017 | AC-05 | Boundary | Pending | Medium   |
| TC-018 | REG   | Positive | Pending | High     |
| TC-019 | REG   | Positive | Pending | High     |
| TC-020 | SEC   | Negative | Pending | High     |
| TC-021 | SEC   | Negative | Pending | Medium   |
| TC-022 | ACC   | Positive | Pending | Medium   |

---

## Test Cases

---

### TC-001: Editar un gasto válido — happy path completo

**AC:** AC-01  
**Type:** Positive  
**Priority:** High

```gherkin
GIVEN un gasto existe con id=1, fecha dentro de los últimos 90 días, amount=50.00
  AND el Finance Manager está en la vista de lista de gastos
WHEN el Finance Manager hace clic en el botón "Edit" de ese gasto
THEN el modal de edición se abre con los campos pre-poblados con los valores actuales
WHEN el Finance Manager cambia el amount a 45.00 y hace clic en "Save"
THEN el sistema envía PUT /api/expenses/1 con los datos actualizados
  AND el sistema muestra el mensaje "Expense updated successfully"
  AND el modal se cierra automáticamente después de 2 segundos
  AND la lista de gastos refleja el nuevo amount 45.00
  AND el total de la lista se recalcula correctamente
```

**Test data:**

- Expense id=1, date=hoy-30días, category="Travel", amount=50.00, description="Taxi"
- Nuevo amount: 45.00

**Expected API response (HTTP 200):**

```json
{
  "count": 1,
  "total": 45.0,
  "currency": "USD",
  "data": [
    {
      "id": 1,
      "date": "...",
      "category": "Travel",
      "description": "Taxi",
      "amount": 45.0,
      "currency": "USD"
    }
  ]
}
```

---

### TC-002: Intentar editar un gasto con ID inexistente vía API

**AC:** AC-01  
**Type:** Negative  
**Priority:** High

```gherkin
GIVEN el backend está corriendo en localhost:3001
WHEN se envía PUT /api/expenses/9999 con body válido
THEN el sistema retorna HTTP 404
  AND el body de respuesta es { "error": "Expense not found" }
  AND el CSV no es modificado
```

**Test data (curl/DevTools):**

```json
{
  "date": "2026-05-01",
  "category": "Travel",
  "amount": 30.0,
  "description": "Test"
}
```

---

### TC-003: Editar solo un subconjunto de campos — campos no modificados se preservan

**AC:** AC-01  
**Type:** Boundary  
**Priority:** High

```gherkin
GIVEN un gasto existe con id=2, category="Meals", amount=20.00, description="Lunch", currency="USD"
  AND el Finance Manager abre el modal de edición
WHEN el Finance Manager cambia únicamente la description a "Team lunch" y hace clic en "Save"
THEN el sistema envía PUT /api/expenses/2 con todos los campos
  AND la respuesta contiene category="Meals", amount=20.00, currency="USD" sin cambios
  AND el campo id no es modificado
  AND el campo currency no es modificado
```

**Verificación adicional:** Abrir el CSV directamente y confirmar que la fila del id=2 preserva todos los campos no editados byte a byte.

---

### TC-004: Corregir un amount inválido y guardar exitosamente

**AC:** AC-02  
**Type:** Positive  
**Priority:** High

```gherkin
GIVEN el modal de edición está abierto para un gasto válido
WHEN el Finance Manager ingresa "-5" en el campo amount
THEN el sistema muestra "Amount must be a positive number" debajo del campo amount
  AND el botón Save está deshabilitado
WHEN el Finance Manager corrige el amount a "45.00"
THEN el mensaje de error desaparece
  AND el botón Save se re-habilita
WHEN el Finance Manager hace clic en Save
THEN el gasto se guarda exitosamente
```

---

### TC-005: Amount negativo — validación frontend

**AC:** AC-02  
**Type:** Negative  
**Priority:** High

```gherkin
GIVEN el modal de edición está abierto para un gasto válido
WHEN el Finance Manager ingresa "-100" en el campo amount
THEN el sistema muestra "Amount must be a positive number" debajo del campo amount
  AND el botón Save está deshabilitado
  AND no se envía ninguna petición al backend
```

---

### TC-006: Amount cero — validación frontend y backend

**AC:** AC-02  
**Type:** Negative  
**Priority:** High

```gherkin
GIVEN el modal de edición está abierto para un gasto válido
WHEN el Finance Manager ingresa "0" en el campo amount
THEN el sistema muestra "Amount must be a positive number"
  AND el botón Save está deshabilitado

GIVEN el backend está corriendo
WHEN se envía PUT /api/expenses/1 con amount=0
THEN el sistema retorna HTTP 400
  AND el body es { "error": "Amount must be a positive number" }
```

---

### TC-007: Amount con más de 2 decimales — redondeo

**AC:** AC-02  
**Type:** Boundary  
**Priority:** Medium

```gherkin
GIVEN el modal de edición está abierto para un gasto válido
WHEN el Finance Manager ingresa "25.999" en el campo amount y hace clic en Save
THEN el sistema guarda el amount como 26.00 (redondeado a 2 decimales)
  AND la lista de gastos muestra 26.00
  AND el CSV contiene 26.00 para ese registro
```

---

### TC-008: Campo date vacío — validación frontend

**AC:** AC-03  
**Type:** Negative  
**Priority:** High

```gherkin
GIVEN el modal de edición está abierto para un gasto válido
WHEN el Finance Manager borra el campo date y hace clic en Save
THEN el sistema muestra "Date is required" debajo del campo date
  AND el botón Save está deshabilitado
  AND no se envía ninguna petición al backend
```

---

### TC-009: Formato de fecha inválido — validación frontend y backend

**AC:** AC-03  
**Type:** Negative  
**Priority:** High

```gherkin
GIVEN el modal de edición está abierto para un gasto válido
WHEN el Finance Manager ingresa "12/05/2026" en el campo date (formato incorrecto)
THEN el sistema muestra "Date must be in YYYY-MM-DD format"
  AND el botón Save está deshabilitado

GIVEN el backend está corriendo
WHEN se envía PUT /api/expenses/1 con date="12/05/2026"
THEN el sistema retorna HTTP 400
  AND el body es { "error": "Date must be in YYYY-MM-DD format" }
```

---

### TC-010: Category vacía — validación frontend

**AC:** AC-03  
**Type:** Negative  
**Priority:** High

```gherkin
GIVEN el modal de edición está abierto para un gasto válido
  AND el dropdown de category no tiene ningún valor seleccionado
WHEN el Finance Manager hace clic en Save
THEN el sistema muestra "Field category is required"
  AND el botón Save está deshabilitado
  AND no se envía ninguna petición al backend
```

---

### TC-011: Category con valor no permitido — validación backend

**AC:** AC-03  
**Type:** Negative  
**Priority:** High

```gherkin
GIVEN el backend está corriendo
WHEN se envía PUT /api/expenses/1 con category="Groceries" (no está en la lista permitida)
THEN el sistema retorna HTTP 400
  AND el body es { "error": "Invalid category" }
```

**Nota:** Este caso solo es testeable vía API directa (curl/DevTools) porque el frontend usa un dropdown que restringe los valores.

---

### TC-012: Múltiples campos requeridos vacíos simultáneamente

**AC:** AC-03  
**Type:** Negative  
**Priority:** Medium

```gherkin
GIVEN el modal de edición está abierto para un gasto válido
WHEN el Finance Manager borra los campos date y amount y hace clic en Save
THEN el sistema muestra "Date is required" debajo del campo date
  AND el sistema muestra "Amount must be a positive number" debajo del campo amount
  AND el botón Save está deshabilitado
  AND no se envía ninguna petición al backend
```

---

### TC-013: Bloqueo de edición para gasto mayor a 90 días

**AC:** AC-04  
**Type:** Positive (del escenario de bloqueo)  
**Priority:** High

```gherkin
GIVEN un gasto existe con fecha 91 días antes de hoy
WHEN el Finance Manager hace clic en el botón "Edit" de ese gasto
THEN el modal se abre con todos los campos deshabilitados (read-only)
  AND el botón Save no es visible
  AND se muestra el mensaje "Cannot edit expenses older than 90 days"
  AND el botón Cancel/Close es visible y funcional
  AND al hacer clic en Cancel el modal se cierra sin cambios
```

**Test data:** Expense con date = hoy - 91 días.

---

### TC-014: Gasto con exactamente 90 días — debe ser editable (borde crítico)

**AC:** AC-04  
**Type:** Boundary  
**Priority:** High

```gherkin
GIVEN un gasto existe con fecha exactamente 90 días antes de hoy
WHEN el Finance Manager hace clic en el botón "Edit" de ese gasto
THEN el modal se abre en estado editable (campos habilitados)
  AND el botón Save es visible y habilitado
  AND NO se muestra el mensaje de bloqueo
```

**Test data:** Expense con date = hoy - 90 días exactos.  
**Nota:** Este es el caso de borde más crítico de la feature. La regla es `age > 90`, no `age >= 90`.

---

### TC-015: Gasto con exactamente 91 días — debe estar bloqueado (borde crítico)

**AC:** AC-04  
**Type:** Boundary  
**Priority:** High

```gherkin
GIVEN un gasto existe con fecha exactamente 91 días antes de hoy
WHEN el Finance Manager hace clic en el botón "Edit" de ese gasto
THEN el modal se abre en estado bloqueado
  AND el botón Save no es visible
  AND se muestra "Cannot edit expenses older than 90 days"
```

**Test data:** Expense con date = hoy - 91 días exactos.

---

### TC-016: Recálculo de totales después de edición exitosa

**AC:** AC-05  
**Type:** Positive  
**Priority:** High

```gherkin
GIVEN la lista de gastos muestra un total de $500.00 con 10 gastos
  AND uno de esos gastos tiene amount=$50.00
WHEN el Finance Manager edita ese gasto y cambia el amount a $100.00
  AND hace clic en Save exitosamente
THEN el total de la lista se actualiza a $550.00
  AND el conteo de gastos permanece en 10
  AND el gasto editado muestra $100.00 en la lista
```

---

### TC-017: Editar sin cambiar el amount — total no debe cambiar

**AC:** AC-05  
**Type:** Boundary  
**Priority:** Medium

```gherkin
GIVEN la lista de gastos muestra un total de $500.00
  AND el Finance Manager abre el modal de un gasto con amount=$50.00
WHEN el Finance Manager cambia únicamente la description y hace clic en Save
THEN el total de la lista permanece en $500.00 (sin cambios)
  AND el conteo de gastos no cambia
```

---

### TC-018: Regresión — GET /api/expenses sigue funcionando después de un PUT

**AC:** Regresión  
**Type:** Positive  
**Priority:** High

```gherkin
GIVEN el backend está corriendo y el CSV tiene N gastos
WHEN se realiza un PUT /api/expenses/:id exitoso
  AND luego se realiza GET /api/expenses
THEN GET /api/expenses retorna HTTP 200
  AND retorna todos los N gastos (el count no cambia)
  AND el gasto editado refleja los nuevos valores
  AND todos los demás gastos permanecen sin cambios
```

---

### TC-019: Regresión — GET /api/expenses/summary sigue funcionando después de un PUT

**AC:** Regresión  
**Type:** Positive  
**Priority:** High

```gherkin
GIVEN el backend está corriendo
WHEN se realiza un PUT /api/expenses/:id exitoso cambiando category de "Meals" a "Travel"
  AND luego se realiza GET /api/expenses/summary
THEN GET /api/expenses/summary retorna HTTP 200
  AND el total de "Travel" incluye el gasto editado
  AND el total de "Meals" ya no incluye ese gasto
  AND la suma de todos los totales por categoría es igual al total general
```

---

### TC-020: Seguridad — ID no numérico en la URL

**AC:** Seguridad (FR-07)  
**Type:** Negative  
**Priority:** High

```gherkin
GIVEN el backend está corriendo
WHEN se envía PUT /api/expenses/abc con body válido
THEN el sistema retorna HTTP 400
  AND el body es { "error": "Invalid expense ID" }
  AND la respuesta no contiene stack traces ni rutas de archivo
```

---

### TC-021: Seguridad — respuesta de error no expone información interna

**AC:** Seguridad (security.md § 4.3)  
**Type:** Negative  
**Priority:** Medium

```gherkin
GIVEN el backend está corriendo
WHEN se envía PUT /api/expenses/1 con datos inválidos que provocan un error 400
THEN el body de respuesta contiene únicamente { "error": "mensaje descriptivo" }
  AND el body NO contiene rutas de archivo (ej: "/home/user/backend/expenses.csv")
  AND el body NO contiene stack traces
  AND el body NO contiene nombres de variables internas
```

---

### TC-022: Accesibilidad — navegación por teclado en el modal

**AC:** Accesibilidad (NFR)  
**Type:** Positive  
**Priority:** Medium

```gherkin
GIVEN el modal de edición está abierto para un gasto válido
WHEN el usuario navega usando únicamente el teclado (Tab / Shift+Tab)
THEN todos los campos del formulario son alcanzables en orden lógico (Date → Category → Amount → Description → Save → Cancel)
  AND el botón Save es activable con Enter o Space
  AND el botón Cancel es activable con Enter o Space
  AND presionar Escape cierra el modal sin guardar cambios
  AND cada campo tiene una etiqueta visible asociada (label)
  AND los mensajes de error están asociados a su campo mediante aria-describedby
```

---

## Checklist de Cobertura

| Acceptance Criterion             | Positivo       | Negativo                               | Borde          | Total  |
| -------------------------------- | -------------- | -------------------------------------- | -------------- | ------ |
| AC-01 — Edit valid expense       | TC-001         | TC-002                                 | TC-003         | 3      |
| AC-02 — Validate positive amount | TC-004         | TC-005, TC-006                         | TC-007         | 4      |
| AC-03 — Validate required fields | —              | TC-008, TC-009, TC-010, TC-011, TC-012 | —              | 5      |
| AC-04 — Block edits > 90 days    | TC-013         | —                                      | TC-014, TC-015 | 3      |
| AC-05 — Recalculate totals       | TC-016         | —                                      | TC-017         | 2      |
| Regresión GET endpoints          | TC-018, TC-019 | —                                      | —              | 2      |
| Seguridad                        | —              | TC-020, TC-021                         | —              | 2      |
| Accesibilidad                    | TC-022         | —                                      | —              | 1      |
| **Total**                        | **7**          | **10**                                 | **5**          | **22** |

---

## Notas de Ejecución

### Prerequisitos

1. Backend corriendo: `cd backend && npm start`
2. Frontend accesible: abrir `frontend/index.html` en el browser
3. Hacer backup del CSV antes de ejecutar: copiar `backend/expenses.csv` a `backend/expenses.csv.bak`
4. Restaurar el CSV después de cada test que modifique datos

### Datos de prueba recomendados

Agregar temporalmente al CSV los siguientes registros para cubrir los casos de borde:

```csv
99,<hoy-30días>,Travel,Test expense recent,50.00,USD
98,<hoy-90días>,Meals,Test expense 90 days,20.00,USD
97,<hoy-91días>,Software,Test expense 91 days,30.00,USD
```

### Casos que requieren API directa (curl/DevTools)

Los siguientes test cases no son ejecutables desde la UI y requieren llamadas directas al backend:

- TC-002 (ID inexistente)
- TC-006 (amount=0 vía backend)
- TC-009 (fecha con formato incorrecto vía backend)
- TC-011 (category inválida vía backend)
- TC-020 (ID no numérico)
- TC-021 (verificación de respuesta de error)

**Ejemplo curl:**

```bash
curl -X PUT http://localhost:3001/api/expenses/1 \
  -H "Content-Type: application/json" \
  -d '{"date":"2026-05-01","category":"Travel","amount":30.00,"description":"Test"}'
```

---

## Test Execution Log

**Feature:** Edit Existing Expense (001-editar-gasto)  
**Tester:** ******\_\_\_******  
**Date:** ******\_\_\_******  
**Build/Commit:** ******\_\_\_******  
**Environment:** Backend localhost:3001 · Frontend index.html · Browser: ******\_\_\_******

| Test Case | AC    | Type     | Status | Notes | Defect ID |
| --------- | ----- | -------- | ------ | ----- | --------- |
| TC-001    | AC-01 | Positive | —      |       |           |
| TC-002    | AC-01 | Negative | —      |       |           |
| TC-003    | AC-01 | Boundary | —      |       |           |
| TC-004    | AC-02 | Positive | —      |       |           |
| TC-005    | AC-02 | Negative | —      |       |           |
| TC-006    | AC-02 | Negative | —      |       |           |
| TC-007    | AC-02 | Boundary | —      |       |           |
| TC-008    | AC-03 | Negative | —      |       |           |
| TC-009    | AC-03 | Negative | —      |       |           |
| TC-010    | AC-03 | Negative | —      |       |           |
| TC-011    | AC-03 | Negative | —      |       |           |
| TC-012    | AC-03 | Negative | —      |       |           |
| TC-013    | AC-04 | Positive | —      |       |           |
| TC-014    | AC-04 | Boundary | —      |       |           |
| TC-015    | AC-04 | Boundary | —      |       |           |
| TC-016    | AC-05 | Positive | —      |       |           |
| TC-017    | AC-05 | Boundary | —      |       |           |
| TC-018    | REG   | Positive | —      |       |           |
| TC-019    | REG   | Positive | —      |       |           |
| TC-020    | SEC   | Negative | —      |       |           |
| TC-021    | SEC   | Negative | —      |       |           |
| TC-022    | ACC   | Positive | —      |       |           |

**Resultado final:** **\_** / 22 Pass &nbsp;&nbsp; Defectos encontrados: **\_**

---

## Defect Report Template

Si encuentras un defecto durante la ejecución, usa esta plantilla:

```markdown
## Defect ID: DEF-001

**Severity:** High | Medium | Low
**Priority:** High | Medium | Low
**Status:** Open
**Found in:** 001-editar-gasto
**Test Case:** TC-XXX
**Assigned to:** ******\_\_\_******

### Summary

[Descripción breve en una línea]

### Steps to Reproduce

1.
2.
3.

### Expected Result

[Según el criterio de aceptación]

### Actual Result

[Lo que realmente ocurrió]

### Test Data

[Valores usados durante el test]

### Environment

- Browser:
- OS:
- Backend: localhost:3001
- Commit:

### Related

- User Story: US-001
- Acceptance Criterion: AC-XX
- Test Case: TC-XXX
```
