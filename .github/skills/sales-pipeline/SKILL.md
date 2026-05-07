---
name: sales-pipeline
description: "Complete AI-powered sales pipeline automation: website visitor identification (RB2B) → intent scoring → suppression → campaign routing → dead-deal resurrection → trigger prospecting → self-learning ICP optimization. Use when asked to 'route RB2B leads', 'resurrect dead deals', 'find buying signals', 'prospect on triggers', 'tune my ICP from win/loss', 'analyze approve/reject patterns'."
argument-hint: "Subcommand: route | resurrect | trigger | icp | suppress"
---

# Sales Pipeline (adapter)

Source skill: [`sales-pipeline/`](../../../sales-pipeline/) — entry points:

- [`sales-pipeline/rb2b_instantly_router.py`](../../../sales-pipeline/rb2b_instantly_router.py)
- [`sales-pipeline/rb2b_webhook_ingest.py`](../../../sales-pipeline/rb2b_webhook_ingest.py)
- [`sales-pipeline/rb2b_suppression_pipeline.py`](../../../sales-pipeline/rb2b_suppression_pipeline.py)
- [`sales-pipeline/deal_resurrector.py`](../../../sales-pipeline/deal_resurrector.py)
- [`sales-pipeline/trigger_prospector.py`](../../../sales-pipeline/trigger_prospector.py)
- [`sales-pipeline/icp_learning_analyzer.py`](../../../sales-pipeline/icp_learning_analyzer.py)

## When to use

- Standing up the RB2B → Instantly pipe (intent score, dedup, agency filter)
- Reviving closed-lost HubSpot deals via "follow the champion"
- Finding companies showing buying signals (hires, funding, jobs)
- Tightening ICP from approve/reject + win/loss data

See [`sales-pipeline/SKILL.md`](../../../sales-pipeline/SKILL.md).
