---
description: "Use when editing any file inside sales-playbook/. Enforces value-based pricing tiers, call analysis format, and briefing output structure."
applyTo: "sales-playbook/**"
---

# Sales Playbook conventions

## Value briefing structure

`value_pricing_briefing.py` output must include:

1. Business context (industry, size, growth stage)
2. Pain hypothesis (≥ 2 specific pains with quantified cost)
3. Value hypothesis (ROI / outcome if pains are solved)
4. Stakeholder map (champion, economic buyer, blockers)
5. Deal risk factors
6. Recommended opening questions (exactly 3)

## Pricing tiers

`value_pricing_packager.py` always generates exactly 3 tiers:

| Tier | Multiplier vs base | Anchoring role |
|------|-------------------|----------------|
| Starter | 1× | Decoy / entry |
| Pro (target) | 2–3× | Primary close |
| Enterprise | 5–10× | Anchor / stretch |

Do not generate fewer than 3 tiers. Never use the words "Basic", "Standard",
"Advanced" — names must reflect outcomes.

## Call analysis output

`call_analyzer.py` must extract, per call:
- Objections raised (verbatim quote + category)
- Competitor mentions
- Decision criteria stated by prospect
- Next step agreed (or "none stated")
- Recommended follow-up action

## Pattern library

`pricing_pattern_library.py` keys are snake_case slugs. Do not rename existing
keys — other scripts import them by key.
