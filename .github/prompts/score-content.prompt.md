---
description: "Score a piece of content with the expert panel and return a ship / no-ship verdict"
argument-hint: "Path or URL of the content to score"
agent: "content-quality-gate"
---

Score the content at **${input:target}** using the
[`expert-panel`](../skills/content-ops/SKILL.md) skill.

Pick the rubric and expert panel that match the content type. Return:

- per-dimension scores (0–100)
- a single `SHIP` / `NO-SHIP` verdict (ship only if every dimension ≥ 90)
- top 3 highest-leverage rewrites if `NO-SHIP`

Do not rewrite the content yourself.
