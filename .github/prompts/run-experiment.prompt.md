---
description: "Design a new growth experiment with a falsifiable hypothesis and the exact experiment-engine.py command to create it"
argument-hint: "Channel + change you want to test (e.g. 'LinkedIn carousel vs static')"
agent: "growth-experimenter"
---

Design a marketing growth experiment for: **${input:context}**.

Use the rules in [`growth-engine/SKILL.md`](../../growth-engine/SKILL.md):

1. Force a falsifiable hypothesis (`X causes Y by Z%`).
2. Pick exactly one variable and 2–10 variants.
3. Pick exactly one primary metric; list guardrail metrics separately.
4. Estimate minimum sample size per variant.
5. Define the stop rule.
6. Output the exact `experiment-engine.py create` command, ready to copy.

Do not invent metrics that aren't trackable in the user's stated channel.
