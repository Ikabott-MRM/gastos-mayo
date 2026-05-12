---
name: ibk-end-task
description: Commit and push the current branch, open a draft PR with a description scoped to this branch's diff, then transition the Jira issue to In Review.
tools: ["read", "shell", "@atlassian"]
includeMcpJson: true
---

You are running the IBK end-task workflow.

Optional input: a Jira issue key or browse URL if it cannot be inferred from the current branch name.

## Non-negotiable rule

Do NOT run git commit, git push, create a PR, or transition Jira until the user gives EXPLICIT approval at the checkpoint below. Preview and action steps must be in separate turns.

## Steps

### 1. Resolve the Jira issue key

- Try to derive from the current branch name pattern: feature/{id}/slug or fix/{id}/slug → uppercase the id segment (e.g. proj-2015 → PROJ-2015)
- If the branch does not match and no key was provided: ask the user for the key
- browse_url = https://jira.ibk.com/browse/{issue_key}

### 2. Read-only git state (before checkpoint)

- git rev-parse --abbrev-ref HEAD → CURRENT_BRANCH
- Warn and stop if on main/master/develop unless the user explicitly passed a key
- Resolve origin URL and owner/repo
- Determine BASE branch (origin/main or origin/master, whichever exists)
- Run git status and git log origin/CURRENT_BRANCH..HEAD to determine if commit and/or push are needed

### 3. Build PR title and body

Generate a PR title and body based on:

- The branch name and Jira issue key
- The git diff of this branch vs BASE (git diff BASE...HEAD)
- Title format: [ISSUE-KEY] Short description of changes
- Body sections: Summary of changes, What was tested, Notes
- Scope the body ONLY to this branch's changes — do not describe unrelated history

### 4. CHECKPOINT — show preview and STOP

Show the user:

- Issue key and browse URL
- Base ← Head branch names
- Change scope (file list or git status summary)
- Full PR_TITLE and PR_BODY

Then ask: "Proceed with commit (if needed), push, draft PR, and Jira → In Review? (yes/no)"

Do NOT proceed until the user replies with explicit approval (yes, confirm, proceed, adelante, or equivalent).

### 5. After approval — execute in order

**COMMIT** (if there are uncommitted changes):

- git add -A
- git commit -m "[ISSUE-KEY] <one-line summary from diff>"

**PUSH**:

- git push -u origin CURRENT_BRANCH
- If push fails: report the error, do not claim the PR was created

**DRAFT PR**:

- Check for an existing open PR for this branch first (gh pr list --head CURRENT_BRANCH)
- If one exists: report its URL, skip creation
- Otherwise: gh pr create --draft --base BASE --head CURRENT_BRANCH --title "PR_TITLE" --body "PR_BODY"

**JIRA TRANSITION to In Review**:

- jira_get_issue to read current status
- jira_get_transitions to find the transition targeting 'In Review' (or 'Code Review' or closest equivalent)
- jira_transition_issue
- If already in a review/terminal state: skip and explain

### 6. Final report

- Jira: key, link, previous → new status
- Git: branch, push result, commit id if new
- PR: draft URL, base ← head

Security: do not print tokens or secrets.
