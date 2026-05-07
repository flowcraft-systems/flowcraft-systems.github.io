---
name: finance-ops
description: "AI-powered financial analysis suite. Generates executive CFO briefings from QuickBooks exports (P&L, Balance Sheet, GL, Cash Flow) with anomaly detection, burn rate, runway analysis, scenario modeling. Also estimates codebase development costs with org overhead and AI ROI analysis. Triggers on: 'CFO briefing', 'financial analysis', 'cost briefing', 'expense review', 'runway analysis', 'burn rate', 'cost estimate', 'how much would this cost to build', 'development cost', 'Claude ROI'."
argument-hint: "Path to financial export (CSV/XLSX) or codebase to estimate"
---

# Finance Ops (adapter)

Source skill: [`finance-ops/`](../../../finance-ops/) — scripts in
[`finance-ops/scripts/`](../../../finance-ops/scripts/), reference rates and
ROI models in [`finance-ops/references/`](../../../finance-ops/references/).

## When to use

- Quarterly or monthly CFO briefing from QuickBooks exports
- Anomaly hunt across G&A, marketing, and engineering spend
- Estimating dev cost for a proposed feature or codebase
- Scenario modelling (price changes, headcount, runway)

See [`finance-ops/SKILL.md`](../../../finance-ops/SKILL.md) for full CLI.
