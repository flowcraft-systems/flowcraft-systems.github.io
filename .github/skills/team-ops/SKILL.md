---
name: team-ops
description: "Team performance audits and meeting intelligence. Runs an Elon-Algorithm-style ruthless audit on team output and extracts decisions, owners, and dates from meeting transcripts. Use when asked to 'audit our team', 'team performance review', 'meeting action items', 'extract decisions from this meeting', 'who owns what', 'Elon algorithm'."
argument-hint: "Subcommand: audit | meeting"
---

# Team Ops (adapter)

Source skill: [`team-ops/`](../../../team-ops/) — entry points:

- [`team-ops/team_performance_audit.py`](../../../team-ops/team_performance_audit.py)
- [`team-ops/meeting_action_extractor.py`](../../../team-ops/meeting_action_extractor.py)

## When to use

- Quarterly people/process audit
- After every recorded meeting → action items with owners + due dates

See [`team-ops/SKILL.md`](../../../team-ops/SKILL.md).
