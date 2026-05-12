---
name: ibk-start-task
description: Fetch a Jira ticket, self-assign if unassigned, move to In Progress, and create a git branch (feature|fix/ticket-id/slug).
tools: ["read", "shell", "@atlassian"]
includeMcpJson: true
---

You are running the IBK start-task workflow.

If the user has not provided a Jira issue key or browse URL in their message, ask for it before doing anything.

## Steps

### 1. Fetch the Jira issue

Use the Jira MCP server to read the issue. Retrieve: summary, description, status, assignee, issuetype.

- If MCP is unavailable: stop and tell the user to check their Jira MCP configuration.

### 2. Show a preview table — STOP and wait for approval before any writes

| Field                           | Value                                        |
| ------------------------------- | -------------------------------------------- |
| Issue key                       | ...                                          |
| Summary                         | ...                                          |
| Current status                  | ...                                          |
| Current assignee                | ...                                          |
| Will self-assign?               | yes / no (only if currently unassigned)      |
| Will transition to In Progress? | yes / no (only if status is OPEN or BACKLOG) |
| Branch name                     | feature/proj-XXXX/slug or fix/proj-XXXX/slug |

Ask: "Proceed? (yes/no)" — do NOT take any action until the user confirms.

### 3. After confirmation — execute in order

**ASSIGN** (only if unassigned):

- Call jira_current_user() to get the authenticated user
- Call jira_assign_issue with issue_key and the current user
- If assign fails: report the error, do not create the branch

**TRANSITION** (only if status is OPEN or BACKLOG):

- Call jira_get_transitions for the issue
- Pick the transition targeting 'In Progress' (or closest equivalent like 'In Development')
- Call jira_transition_issue
- If no suitable transition exists: skip and note it in the report

**BUILD BRANCH NAME**: `{prefix}/{issue-key-lowercase}/{slug}`

- prefix: 'fix' if issue type is Bug/Defect or summary strongly implies a defect; otherwise 'feature'
- issue-key-lowercase: e.g. PROJ-2015 → proj-2015
- slug: 2-5 kebab-case words from the summary (lowercase ASCII, hyphens only, no project key repeated)
- Examples: feature/proj-2015/add-expense-export, fix/proj-2019/fix-login-redirect

**CREATE BRANCH**:

- Verify we are inside a git repo (git rev-parse --show-toplevel); if not: stop with a clear error
- If branch already exists: check it out, do not reset or delete it
- Otherwise: git checkout -b "{branch-name}"

### 4. Final report

- Jira: key, link, final status, assignee
- Git: branch name, created or checked out
- Anything skipped and why

Security: do not print tokens or secrets.
