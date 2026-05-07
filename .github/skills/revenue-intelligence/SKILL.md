---
name: revenue-intelligence
description: "Sales call insights, revenue attribution, and client reporting. Pulls Gong call transcripts into themed insights, attributes revenue to content/campaigns, generates client-ready reports. Use when asked to 'analyze Gong calls', 'attribute revenue', 'build a client report', 'what are deals telling us', 'revenue attribution', 'monthly client report'."
argument-hint: "Subcommand: gong | attribute | report"
---

# Revenue Intelligence (adapter)

Source skill: [`revenue-intelligence/`](../../../revenue-intelligence/) — entry points:

- [`revenue-intelligence/gong_insight_pipeline.py`](../../../revenue-intelligence/gong_insight_pipeline.py)
- [`revenue-intelligence/revenue_attribution.py`](../../../revenue-intelligence/revenue_attribution.py)
- [`revenue-intelligence/client_report_generator.py`](../../../revenue-intelligence/client_report_generator.py)

## When to use

- Quarterly review of sales call themes (objections, competitors, gaps)
- Multi-touch attribution from CRM + analytics export
- Monthly client deliverable report

See [`revenue-intelligence/SKILL.md`](../../../revenue-intelligence/SKILL.md).
