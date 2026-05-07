---
name: content-eval
description: "Evaluate finished content (blog posts, landing pages, emails, threads) against a quality rubric and return a numeric score plus rewrite suggestions. Use when asked to 'evaluate this content', 'score this draft', 'rate this article', or as a quality gate before publishing."
argument-hint: "Path or URL of the content to evaluate"
---

# Content Eval (adapter)

Source skill: [`content-eval/`](../../../content-eval/) — see
[`content-eval/SKILL.md`](../../../content-eval/SKILL.md) and the rubrics
under [`content-eval/references/`](../../../content-eval/references/).

## When to use

- One-shot scoring of an existing piece of content
- Pre-publish quality gate (pair with `expert-panel` for recursive iteration)
- Comparing two finished drafts head-to-head

## Output

A score per rubric dimension plus targeted rewrite suggestions. For full
multi-round optimization, use [`autoresearch`](../autoresearch/SKILL.md) or
[`expert-panel`](../content-ops/SKILL.md) instead.
