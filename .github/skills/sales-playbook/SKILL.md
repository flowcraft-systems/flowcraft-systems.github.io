---
name: sales-playbook
description: "Value-based pricing framework that turns $10K deals into $100K deals. Pre-call value briefing, tiered package generation, post-call analysis, and pricing pattern library. Use when asked for 'pre-call brief', 'value pricing', 'package this deal', 'tiered proposal', 'analyze this sales call', 'pricing patterns', 'how should I price this', 'upsell this deal'."
argument-hint: "Subcommand: brief | package | analyze | patterns"
---

# Sales Playbook (adapter)

Source skill: [`sales-playbook/`](../../../sales-playbook/) — entry points:

- [`sales-playbook/value_pricing_briefing.py`](../../../sales-playbook/value_pricing_briefing.py)
- [`sales-playbook/value_pricing_packager.py`](../../../sales-playbook/value_pricing_packager.py)
- [`sales-playbook/call_analyzer.py`](../../../sales-playbook/call_analyzer.py)
- [`sales-playbook/pricing_pattern_library.py`](../../../sales-playbook/pricing_pattern_library.py)

## When to use

- Before a discovery/demo call → generate a value briefing
- After discovery → produce 3-tier value-based proposal
- After call → extract patterns + objections for the library

See [`sales-playbook/SKILL.md`](../../../sales-playbook/SKILL.md).
