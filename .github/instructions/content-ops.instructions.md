---
description: "Use when editing any file inside content-ops/. Covers expert panel selection, rubric scoring thresholds, iteration rules, and output format."
applyTo: "content-ops/**"
---

# Content Ops conventions

## Expert selection

Match the panel to the content type:

| Content type | Expert file |
|---|---|
| Landing page / ad copy | `experts/conversion-copywriter.md` |
| Email sequence | `experts/email-strategist.md` |
| Blog / thought leadership | `experts/content-strategist.md` |
| Social post / thread | `experts/social-media-expert.md` |
| SEO content | `experts/seo-specialist.md` |

When in doubt, use at least 3 experts. Never fewer than 2.

## Scoring thresholds

- **Ship**: every dimension ≥ 90/100
- **Revise**: any dimension 70–89 → rewrite that dimension and re-score
- **Reject**: any dimension < 70 → full rewrite required

Maximum 3 revision rounds. If still < 90 after round 3, surface to the user
with a summary of the blocking dimension.

## Iteration rule

Between rounds, rewrite **only** the dimensions that scored below 90.
Do not re-score dimensions that already passed — preserve their content.

## Output format

Always return:
```
Round <N> scores:
- <dimension>: <score>/100
...
Verdict: SHIP | REVISE (<dimension>) | REJECT
```

If SHIP, append the final content in full.
