---
name: seo-ops
description: "SEO intelligence: build content attack briefs, query Google Search Console for keyword opportunities, scout trending topics. Use when asked to 'build a content brief', 'find keyword opportunities', 'GSC analysis', 'trend scout', 'what should we write about', 'SEO opportunities', 'rank-tracking'."
argument-hint: "Subcommand: brief | gsc | trends"
---

# SEO Ops (adapter)

Source skill: [`seo-ops/`](../../../seo-ops/) — entry points:

- [`seo-ops/content_attack_brief.py`](../../../seo-ops/content_attack_brief.py)
- [`seo-ops/gsc_client.py`](../../../seo-ops/gsc_client.py) (auth via
  [`seo-ops/gsc_auth.py`](../../../seo-ops/gsc_auth.py))
- [`seo-ops/trend_scout.py`](../../../seo-ops/trend_scout.py)

## When to use

- Producing a fully-resourced content brief targeting a specific SERP
- Mining GSC for "almost ranking" keywords (positions 8–20)
- Surfacing rising topics relevant to the ICP

See [`seo-ops/SKILL.md`](../../../seo-ops/SKILL.md).
