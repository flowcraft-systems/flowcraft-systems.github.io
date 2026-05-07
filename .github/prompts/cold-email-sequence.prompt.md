---
description: "Generate a complete cold outbound sequence (subject lines + bodies) for an ICP, then run it through expert panel scoring until 90+"
argument-hint: "Path to ICP file, or short ICP description"
agent: "agent"
---

Build a cold outbound sequence for the ICP at **${input:icp}** using the
[`cold-outbound-optimizer`](../skills/outbound-engine/SKILL.md) skill.

Procedure:

1. If the input is a description, draft an ICP file in
   `outbound-engine/references/` first using the template there.
2. Generate a 4-step sequence (initial + 3 follow-ups) per the copy rules
   in [`outbound-engine/references/`](../../outbound-engine/references/).
3. Score with `expert-panel`; iterate to 90+ (max 3 rounds).
4. Output the final sequence as Instantly-ready CSV plus an
   infrastructure/capacity note (mailboxes, warmup, daily volume).

Do not push to Instantly.
