# Analyze

Collect the data needed to answer the four report questions. Use `Glob` and `Grep` — avoid reading full files unless a specific line needs context.

## Step 1 — Find specs

Use `Grep` on `cypress.config.ts` to get the `specPattern`, then `Glob` with that pattern to list all spec files.
If no config is found, glob for `**/*.cy.ts` and `**/*.cy.js`.

## Step 2 — Per spec: count and map tests

For each spec file, run two greps (do not read the whole file):

**Count:**
```
pattern: "^\s+it[.(]"
output_mode: count
```

**Hierarchy** (what the tests are named and how they nest):
```
pattern: "(describe|context|it)\s*[.(]"
output_mode: content
```

Parse the matched lines into a `describe → context → it` tree.

## Step 3 — Spot improvement signals

Grep each spec for these patterns and note the line number of any match:

| Pattern | Issue |
|---------|-------|
| `cy\.wait\(\d` | Arbitrary wait — flakiness risk |
| `it\.only\|describe\.only` | Focused test left in — blocks CI |
| `cy\.get\(['"]\.` | CSS class selector — fragile |
| `let \w.*:\|^\s+\w+ =` without a `before\(` in the file | Inter-test state — isolation risk |

Keep results to file + line number. No full-file reads needed here.
