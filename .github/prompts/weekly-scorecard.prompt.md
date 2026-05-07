---
description: "Generate the cross-channel weekly growth scorecard"
agent: "agent"
---

Produce this week's growth scorecard using the
[`growth-engine`](../skills/growth-engine/SKILL.md) skill.

```bash
cd growth-engine && python3 autogrowth-weekly-scorecard.py
```

Then summarise in plain English:

- top movers (positive and negative) by channel
- experiments that crossed significance this week
- pacing risks flagged by `pacing-alert.py`
- recommended next experiment (1, not a list)
