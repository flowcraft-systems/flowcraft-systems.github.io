---
name: growth-engine
description: "Autonomous growth experimentation framework based on Karpathy's autoresearch pattern applied to marketing. Use when asked to 'run an experiment', 'A/B test', 'create a growth experiment', 'score an experiment', 'check the playbook', 'weekly scorecard', or 'pacing alert'. Creates experiments with hypotheses, logs data points, runs bootstrap CI + Mann-Whitney U tests, auto-promotes winners to a playbook, suggests next experiments. Supports up to 10 variants."
argument-hint: "Subcommand: create | log | score | scorecard | pacing"
---

# Growth Engine (adapter)

Source skill: [`growth-engine/`](../../../growth-engine/) — entry points:

- [`growth-engine/experiment-engine.py`](../../../growth-engine/experiment-engine.py)
- [`growth-engine/pacing-alert.py`](../../../growth-engine/pacing-alert.py)
- [`growth-engine/autogrowth-weekly-scorecard.py`](../../../growth-engine/autogrowth-weekly-scorecard.py)

## When to use

- Designing or scoring marketing A/B / multivariate experiments
- Logging campaign data points after a send/post
- Generating the weekly cross-channel scorecard
- Checking the playbook for proven best practices before new content

## Quick example

```bash
cd growth-engine && pip install -r requirements.txt
python3 experiment-engine.py create \
  --hypothesis "Thread posts get 2x engagement vs single posts" \
  --variable format --variants '["thread", "single"]' --metric impressions
```

See [`growth-engine/SKILL.md`](../../../growth-engine/SKILL.md) for the full
command surface.
