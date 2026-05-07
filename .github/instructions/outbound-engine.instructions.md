---
description: "Use when editing any file inside outbound-engine/. Enforces ICP file format, copy rules, sequence structure, and Instantly-readiness conventions."
applyTo: "outbound-engine/**"
---

# Outbound Engine conventions

## ICP file format

All ICP definitions live in `outbound-engine/references/` as JSON files with
keys: `name`, `titles`, `company_size`, `industries`, `pain_points`,
`buying_triggers`, `anti_icp_signals`. Match the template already there.

## Sequence structure

Every cold outbound sequence must have exactly 4 steps:

| Step | Max words | Wait  |
|------|-----------|-------|
| Initial (step 1) | 75 | — |
| Follow-up 1 | 50 | 3 days |
| Follow-up 2 | 50 | 5 days |
| Breakup (step 4) | 40 | 7 days |

Subject lines: max 8 words, no emoji, no `Re:` faking.

## Copy rules

Follow the rules in `outbound-engine/references/` verbatim:

- One idea per email.
- No features, only problems and outcomes.
- Social proof via specifics (number, result, company type — never a logo).
- CTA = one soft question, not a calendar link in step 1.

## Expert panel scoring

Run `expert-panel` on every new sequence before handing to the user. Minimum
score to ship: 90 on every rubric dimension.

## Instantly CSV columns

Exported sequences must match: `email`, `first_name`, `company`, `sequence`,
`step_1_subject`, `step_1_body`, …, `step_4_body`.
