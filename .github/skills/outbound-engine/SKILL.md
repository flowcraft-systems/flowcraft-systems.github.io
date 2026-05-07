---
name: cold-outbound-optimizer
description: "Design, analyze, and optimize cold outbound email campaigns for Instantly. Handles end-to-end ICP definition, expert panel scoring (recursive to 90+), sequence copywriting, infrastructure audit, capacity planning, and implementation docs. Use when asked to 'build cold outbound sequences', 'optimize cold email', 'analyze outbound campaigns', 'build sales sequences', 'build Instantly sequences', 'create cold outbound strategies', or 'design email campaigns'. Supports both 'start from scratch' and 'optimize existing' modes."
argument-hint: "Mode: scratch | optimize, plus ICP file or campaign export"
---

# Cold Outbound Optimizer (adapter)

Source skill: [`outbound-engine/`](../../../outbound-engine/) — scripts in
[`outbound-engine/scripts/`](../../../outbound-engine/scripts/), references
(ICP template, copy rules) in
[`outbound-engine/references/`](../../../outbound-engine/references/).

## When to use

- New ICP → fully drafted sequence + infra plan
- Existing campaign with poor reply rate → diagnostic + rewrite
- Pre-launch capacity planning (mailboxes, warmup, daily volume)

See [`outbound-engine/SKILL.md`](../../../outbound-engine/SKILL.md) for the
detailed two-mode flow.
