---
name: feedback-scope-cypress-only
description: Only make changes inside the test/cypress folder — do not touch frontend or other project folders
metadata:
  type: feedback
---

Only modify files inside `test/cypress/`. Do not touch `frontend/`, `routes/`, or any other project folder, even when a task asks for HTML data-testid changes.

**Why:** User explicitly said "do not make changes in other folders, only cypress."

**How to apply:** When adding data-testids or any other change, scope all edits to `test/cypress/` only. If a task requires frontend changes, ask the user first rather than making them silently.