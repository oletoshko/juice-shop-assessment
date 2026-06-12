---
name: spec-spy
description: "Audits the Cypress test suite: what kinds of tests exist, how many, what they cover, and how they could be improved. Use when the user asks what tests exist, what is covered, or how to improve the suite."
model: inherit
background: false
allowed-tools: Glob, Grep, Read
metadata:
  version: 1.1.0
---

# Spec Spy

**Use this skill when:** The user wants to understand the state of the test suite.

**Do NOT use this skill when:** The user wants to write, fix, or run tests — use `cypress-author` instead.

## Flow

1. **Analyze** — Follow [./subskills/analyze.md](./subskills/analyze.md)
2. **Report** — Follow [./subskills/report.md](./subskills/report.md)
3. **Sign-off** — End with "**Thank you for using Spec Spy!**"
