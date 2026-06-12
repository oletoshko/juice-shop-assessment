# Report

Answer the four questions directly, in order. Be concise and evidence-based — cite file paths and line numbers, never guess.

---

## 1. What kinds of tests exist?

List spec files grouped by type (E2E / Component) and the top-level `describe` name.
One line per spec: path, type, describe title.

## 2. How many tests are there?

Show a simple table:

| Spec | Tests |
|------|-------|
| `path/to/spec.cy.ts` | N |
| **Total** | **N** |

## 3. What do they cover?

For each spec print the full `describe → context → it` tree using indented bullets.
Below it, write one sentence summarizing what functional area is covered.

## 4. How could they be improved?

List findings from the improvement signals in Analyze. For each:
- File and line number
- What the issue is
- One-line fix

Prioritize: isolation issues → flakiness → fragile selectors → style.
Only report what grep actually found — no invented suggestions.
