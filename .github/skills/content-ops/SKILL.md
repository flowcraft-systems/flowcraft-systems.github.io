---
name: expert-panel
description: "Score, evaluate, and iteratively improve any content or strategy using an auto-assembled panel of domain experts. Recursively iterates until all scores hit 90+ (max 3 rounds). Use when asked to: 'expert panel this', 'score this', 'rate these variants', 'quality check this', 'panel review', 'which version is better', 'expert score', 'evaluate this copy/strategy/page'. Also triggers on: 'score this landing page', 'expert panel these email variants', 'rate this headline', 'panel these charts'."
argument-hint: "Content, file path, or URL to panel"
---

# Expert Panel — Content Ops (adapter)

Source skill: [`content-ops/`](../../../content-ops/) — see
[`content-ops/SKILL.md`](../../../content-ops/SKILL.md), expert personas in
[`content-ops/experts/`](../../../content-ops/experts/), rubrics in
[`content-ops/scoring-rubrics/`](../../../content-ops/scoring-rubrics/), and
scripts in [`content-ops/scripts/`](../../../content-ops/scripts/).

## When to use

- Any content or strategy artifact that needs a quality gate
- When a parent skill needs scored output before promoting a winner
- Comparing variants from `autoresearch` or hand-written drafts

## Procedure

1. Pick the relevant expert panel from `content-ops/experts/`
2. Pick the matching rubric from `content-ops/scoring-rubrics/`
3. Run the scorer; if any dimension < 90, iterate (max 3 rounds)
4. Return final scores + rewritten artifact
