---
description: "Use when editing any file inside sales-pipeline/. Covers intent scoring rules, suppression logic, dedup policy, and Instantly routing conventions."
applyTo: "sales-pipeline/**"
---

# Sales Pipeline conventions

## Intent scoring

Intent score = sum of weighted signals defined in `rb2b_instantly_router.py`.
Do not hard-code score thresholds in new code — read them from the config dict
at the top of the script. Threshold to route = ≥ 60.

## Suppression order

Run suppression **before** routing. Order matters:

1. Existing customer (CRM lookup)
2. Opted-out (suppression list)
3. Free email domain (`@gmail`, `@yahoo`, `@outlook`, etc.)
4. Agency / reseller classification

A lead that passes all four checks is eligible for routing.

## Company dedup

Keep the **highest-seniority** contact per company domain. Seniority tiers
(descending): C-suite → VP → Director → Manager → IC. If a domain already has
an active lead at a higher tier, suppress the lower-tier one.

## Instantly sequence names

Use the canonical sequence slugs: `enterprise`, `mid-market`,
`agency-partner`, `nurture`. Do not create ad-hoc sequence names in scripts —
they must match exactly what exists in the Instantly account.

## Data handling

All lead CSVs go in `sales-pipeline/data/` (gitignored). Never commit raw
lead exports. Run the sanitizer before staging.
