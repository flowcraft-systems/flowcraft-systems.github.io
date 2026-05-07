---
description: "Scan .flowcraft/ case files and session JSON to produce a TUI-style ROI summary for a given time window"
argument-hint: 'Time window — e.g. "last week", "last 30 days", "this month"'
---

Use the [`fc-calculate-roi`](../skills/fc-calculate-roi/SKILL.md) skill to
summarise AI productivity for: **${input:window}**

Follow the skill exactly:
1. Resolve the time window to a concrete date range
2. Scan `.flowcraft/case-files/**/*.md` — filter by `**Date:**`, parse agent/complexity/ROI table
3. Scan `.flowcraft/telemetry/sessions/*.json` — filter by `timestamp_utc`, normalise dashes→colons
4. Deduplicate overlapping entries (prefer case file)
5. Aggregate: total hours saved, agent time, ROI ratio, per-agent breakdown, top session
6. Render the TUI ASCII summary box

If `.flowcraft/` does not exist, show the install prompt from the skill.
