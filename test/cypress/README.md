# Checkout E2E Tests

End-to-end tests for the purchase checkout flow in OWASP Juice Shop, covering basket management, order placement, and order summary review.

## Prerequisites

- **Node.js** 22–25
- **Cypress** 15.17.0 (installed automatically via `npm install`)
- **Chrome** browser installed locally
- **Python** (required by Cypress native dependencies during `npm install`)
- The Juice Shop application running on `http://localhost:3000`

## Setup

Install all dependencies from the project root (this also builds the frontend):

```bash
npm install
```

## Running the tests

### Interactive mode (Cypress UI)

Starts the Juice Shop server first, then opens the Cypress Test Runner so you can watch tests run:

```bash
npm start            # start the app in the background
npm run cypress:open # open Cypress UI, then select checkout.cy.ts
```

### Headless mode (command line)

Start the app first, then run Cypress without a UI:

```bash
npx cypress run
```

## Test structure

```
test/cypress/
├── e2e/
│   └── checkout.cy.ts          # Main spec — all checkout scenarios
├── fixtures/
│   ├── addresses.ts             # Romanian delivery address
│   ├── payments.ts              # Test payment card
│   ├── products.ts              # Product IDs (seeded by Juice Shop)
│   └── users.ts                 # Customer credentials
├── support/
│   ├── api/
│   │   ├── auth.api.ts          # Login helper
│   │   ├── basket.api.ts        # Basket CRUD helpers
│   │   └── checkout.api.ts      # Address, card, delivery, order helpers
│   ├── models/
│   │   ├── basket.ts            # Basket types
│   │   └── checkout.ts          # Checkout types
│   ├── pages/
│   │   └── OrderSummaryPage.ts  # Page Object for /#/order-summary
│   ├── commands.ts              # cy.loginViaApi, cy.clearBasket
│   └── e2e.ts                   # Support file entry point
└── README.md
```

### Spec scenarios

| Context | What is tested |
|---|---|
| `basket preparation` | Add 5 products, remove 1, update quantity and verify recalculated total |
| `order placement` | Create address + delivery + card via API, verify basket, place order, validate order ID format |
| `order summary review` | Independent UI test — visits `/#/order-summary` with injected auth state, verifies address and basket rows |


## Scaling to a larger automation framework, improving tests

The current suite covers the end-to-end purchase flow in a single spec. As coverage grows, the suite should be split into focused specs, each owning one functional area. The planned structure:

```
test/cypress/e2e/
├── basket.cy.ts           # Add products, remove products, update quantities, validate totals
├── checkout.cy.ts         # Address selection, delivery method, payment options
├── order-summary.cy.ts    # Order summary page — address display, basket rows, pricing
└── order-submission.cy.ts # Place order, validate confirmation ID format, post-order state
```

**Why split by functional area:**
- Each spec can be run and retried independently in CI — a failure in `basket.cy.ts` does not block `order-submission.cy.ts`
- Shorter feedback loops: developers touching the basket route only rerun `basket.cy.ts`
- Easier to maintain: adding a new delivery method variant goes into `checkout.cy.ts` without touching order submission logic

## Auditing the test suite with Spec Spy skill

Use the `spec-spy` skill to get an instant audit of the suite at any time. It answers four questions: what kinds of tests exist, how many there are, what they cover, and how they could be improved.

Invoke it in Claude Code by typing:

```
@.agents/skills/spec-spy/ audit the test suite
```

The skill uses `Glob` and `Grep` rather than reading full files, so it runs fast and uses minimal tokens. It will output a summary table, the full test inventory, a coverage map, and a prioritized list of improvement suggestions — all grounded in what the spec files actually contain.



## Latest audit results

Last run against `test/cypress/e2e/checkout.cy.ts`.

### Summary

| Spec | Type | Tests | Coverage area |
|------|------|-------|---------------|
| `checkout.cy.ts` | E2E | 6 | Purchase checkout flow |
| **Total** | | **6** | |

Infrastructure: config ✅ · support file ✅ · custom commands (`cy.loginViaApi`, `cy.clearBasket`) ✅ · fixtures ✅ · page objects (`OrderSummaryPage`) ✅

### Test inventory

```
checkout.cy.ts
└── Purchase checkout flow
    ├── basket preparation
    │   ├── adds 5 products to the basket
    │   ├── removes the first product from the basket
    │   └── quantity update → recalculates the basket total correctly
    ├── order placement
    │   ├── review summary → basket contains items ready for checkout
    │   └── places the order and receives a confirmation
    └── order summary review
        └── order summary → displays Romanian delivery address and 2 basket products
```

Covers: basket CRUD and total recalculation, API-driven address/delivery/payment setup, order placement with ID format validation, and UI verification of the order summary page using `data-testid` selectors.

### Improvement signals

| # | File | Lines | Issue | Fix |
|---|------|-------|-------|-----|
| 1 | `checkout.cy.ts` | 71–117 | `order placement` has `before()` that creates address and card but no `after()` — they are never deleted | Add `after()` with `CheckoutApi.deleteAddress` and `CheckoutApi.deleteCard` |
| 2 | `checkout.cy.ts` | 12 | `addedItems` array is never reset between retries — partial entries from a failed run cause index mismatches in tests 2 and 3 | Reset `addedItems.length = 0` in the outer `before()` before adding items |

No arbitrary waits · no focused tests · no CSS class selectors · all contexts have `before()` hooks ✅

---

### Proposal for improvement:
Grep server.ts and routes/ for app.get/post/put/delete registrations, then cross-reference against the API calls in the spec files (/rest/, /api/). Output a table of routes with no test coverage. This turns spec-spy from a test-quality tool into a coverage-gap detector.



