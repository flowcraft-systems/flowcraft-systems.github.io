---
description: "Use when editing any file inside seo-ops/. Covers GSC authentication patterns, brief structure, and keyword data handling."
applyTo: "seo-ops/**"
---

# SEO Ops conventions

## GSC authentication

Auth is handled by `gsc_auth.py` using a service-account JSON at
`seo-ops/service-account.json` (gitignored). Never inline credentials.
Call `gsc_auth.py --setup` to initialise; `gsc_client.py` imports the
resulting credentials object.

## Content brief structure

Every brief from `content_attack_brief.py` must include, in order:

1. Target keyword (head term)
2. Supporting keywords (≥ 5)
3. Search intent classification (`informational` | `commercial` | `transactional`)
4. Competitor URLs currently ranking (top 5)
5. Content angle (unique differentiation from current SERPs)
6. Suggested word count range
7. Internal linking targets (existing posts in this repo's scope)

## Keyword opportunity thresholds

From GSC data, flag keywords as "quick wins" when:
- Position 8–20 (almost ranking)
- Impressions > 100/month
- CTR < 3%

Do not surface keywords below 50 monthly impressions as primary targets.

## Trend scout output

`trend_scout.py` returns JSON with `topic`, `trend_score`, `rising` (bool),
`related_queries`. Downstream tasks must consume this JSON — do not reformat
into plain text in the script itself.
