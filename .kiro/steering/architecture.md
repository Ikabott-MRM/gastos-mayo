# Architecture Standards

**Version:** 1.0.0  
**Owner:** Tech Lead  
**Last Updated:** 2026-05-11

---

## Purpose

This document defines the technology stack, deployment model, and architectural boundaries for all implementations. All technical decisions **MUST** align with these standards unless explicitly amended.

---

## 1. Technology Stack

### 1.1 Backend Runtime

- **MUST** use Node.js with Express framework
- **MUST** use async/await for asynchronous operations
- **MUST NOT** introduce alternative backend frameworks without approval

### 1.2 Frontend

- **MUST** use React (CDN-based, no build step for this project)
- **MUST** use Babel standalone for JSX transformation
- **MUST NOT** introduce build tools (webpack, vite, etc.) without spec approval

### 1.3 Data Storage

- **Current:** CSV file (`backend/expenses.csv`)
- **MUST NOT** introduce databases (MySQL, PostgreSQL, MongoDB) without architectural review and spec
- **Future:** If database is needed, MySQL is the approved choice

### 1.4 Authentication

- **Current:** No authentication (internal tool)
- **Future:** If auth is needed, Firebase Authentication is the approved choice
- **MUST NOT** implement custom authentication without security review

---

## 2. API Design

### 2.1 REST Conventions

- **MUST** follow REST principles for all endpoints
- **MUST** use HTTP verbs correctly (GET for reads, POST for writes, etc.)
- **MUST** return JSON responses with consistent envelope structure

### 2.2 Response Format

All API responses **MUST** follow this pattern:

```json
{
  "count": 0,
  "total": 0,
  "currency": "USD",
  "data": []
}
```

### 2.3 Error Handling

- **MUST** return appropriate HTTP status codes (400, 404, 500)
- **MUST** include error messages in JSON format
- **MUST NOT** expose internal file paths or stack traces to clients

### 2.4 Versioning

- **Current:** No versioning (v1 implicit)
- **Future:** When breaking changes are needed, use `/api/v2/` prefix

---

## 3. Deployment Model

### 3.1 Current Setup

- **Backend:** Express server on port 3001
- **Frontend:** Static HTML served from `frontend/` directory
- **Data:** File-based (CSV)

### 3.2 Production Deployment (Future)

- **SHOULD** use serverless deployment (AWS Lambda, Vercel Functions, etc.)
- **SHOULD** use CDN for frontend static assets
- **MUST** use environment variables for configuration (never hardcode)

---

## 4. Code Organization

### 4.1 Directory Structure

```
backend/
  ├── server.js          ← Express app and routes
  ├── expenses.csv       ← Data source
  └── package.json       ← Dependencies

frontend/
  └── index.html         ← Single-file React app
```

### 4.2 Separation of Concerns

- **MUST** keep backend logic in `backend/` directory
- **MUST** keep frontend logic in `frontend/` directory
- **MUST NOT** mix server-side and client-side code

### 4.3 Helper Functions

- **SHOULD** extract reusable logic into helper functions
- **SHOULD** keep route handlers focused and delegating

---

## 5. Dependencies

### 5.1 Backend Dependencies

- **MUST** use exact versions in `package.json` (no `^` or `~`)
- **MUST** justify all new dependencies in the spec
- **Current approved:** express, cors, csv-parser

### 5.2 Frontend Dependencies

- **MUST** use CDN links for React, ReactDOM, Babel
- **MUST NOT** add npm dependencies for frontend without architectural review

---

## 6. Performance

### 6.1 Backend

- **SHOULD** avoid reading CSV file multiple times per request
- **SHOULD** implement caching if performance becomes an issue
- **MUST** handle large CSV files gracefully (streaming if needed)

### 6.2 Frontend

- **SHOULD** keep bundle-free to maintain fast load times
- **SHOULD** implement loading states for async operations
- **SHOULD** debounce user input for filters

---

## 7. Integration Points

### 7.1 External Services

- **Current:** None
- **Future:** All external service integrations **MUST** be documented in this section

### 7.2 APIs

- **Current:** Internal REST API only
- **Future:** Third-party API integrations **MUST** be approved and documented

---

## 8. Constraints and Limitations

### 8.1 Known Limitations

- CSV file is not suitable for concurrent writes
- No authentication/authorization layer
- No database transactions

### 8.2 Scalability Considerations

- CSV approach works for < 10,000 records
- For larger datasets, migration to database is required

---

## 9. Amendments

Changes to this document **MUST**:

1. Be proposed in a spec (`.kiro/specs/`)
2. Be reviewed by Tech Lead
3. Update the **Version** and **Last Updated** fields
4. Be communicated to all team members

---

## 10. Compliance

All specs, plans, and implementations **MUST** be validated against this document by:

- `speckit-analyze` agent (automated check)
- Tech Lead review (manual approval for amendments)
