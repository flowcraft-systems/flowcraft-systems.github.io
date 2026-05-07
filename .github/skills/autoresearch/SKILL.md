---
name: autoresearch
description: "Karpathy-style autoresearch optimization for conversion content. Use when asked to optimize a landing page, email sequence, ad copy, headlines, form pages, or CTA text. Generates 50+ variants, scores them with a 5-expert panel, evolves winners over multiple rounds. Triggers on: 'optimize this page', 'run autoresearch', 'score these variants', 'A/B test this copy', 'evolve this headline'."
argument-hint: "Path to content file or URL to optimize"
---

# Autoresearch (adapter)

Source skill: [`autoresearch/`](../../../autoresearch/) — entry point
[`autoresearch/autoresearch.py`](../../../autoresearch/autoresearch.py).

## When to use

Conversion-focused content where you need many variants, expert scoring, and
evolved winners — not a single draft.

## Procedure

1. `cd autoresearch && pip install -r requirements.txt`
2. Run `python3 autoresearch.py --input <file-or-url> --rounds 3`
3. Review the experiment log written to `autoresearch/runs/<timestamp>/`
4. Promote the top variant to production copy

See the source [`SKILL.md`](../../../autoresearch/SKILL.md) for full CLI flags.
