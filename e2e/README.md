# FlowCraft Deal Sizing — E2E Smoke Tests

These are [Playwright](https://playwright.dev/) end-to-end tests for the deal sizing form on `deal-sizing.html`.

## Prerequisites

```bash
# From the repo root
cd /Users/personal/Documents/projects/flowcraft-systems.github.io
npm init -y
npm install -D @playwright/test
npx playwright install chromium
```

## Running the Tests

```bash
# Run all 5 smoke tests (headless)
npx playwright test e2e/deal-sizing.spec.js

# Run with visible browser (watch it fill the form)
npx playwright test e2e/deal-sizing.spec.js --headed

# Run a single scenario
npx playwright test e2e/deal-sizing.spec.js --grep "S1"

# Generate HTML report
npx playwright test e2e/deal-sizing.spec.js --reporter=html
npx playwright show-report
```

## What's Covered

| Scenario | Title | Validates |
|----------|-------|-----------|
| S1 | Clean AI Coding Pilot | XS t-shirt, qualified status, no human review |
| S2 | Enterprise AI Mandate | L size, AI Engineering Office, human review required |
| S3 | Deal Breaker (No Owner) | Fatal confidence, workshop offer, disqualification flags |
| S4 | Weak Fit (No Tools/Evidence) | Weak fit detection, readiness workshop offer |
| S5 | Legacy Modernization | Brownfield classification, codebase access flag |

All tests assert the results panel becomes visible and every key result element (`#resultTShirt`, `#resultTotalScore`, `#resultServiceLine`, `#resultEntryOffer`, `#resultPriceBand`, score bars, risk factors, flags, next questions, human review, disclaimer) is rendered.
