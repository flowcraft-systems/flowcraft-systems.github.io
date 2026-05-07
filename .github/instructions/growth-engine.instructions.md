---
description: "Use when editing any file inside growth-engine/. Enforces hypothesis format, metric naming, and CLI conventions for experiment-engine.py."
applyTo: "growth-engine/**"
---

# Growth Engine conventions

## Hypothesis format

Every hypothesis **must** follow the falsifiable pattern:

> "Changing `<variable>` from `<control>` to `<variant>` will increase `<metric>` by at least `<expected-lift>%` within `<window>`."

The `--hypothesis` flag must be a full sentence matching this pattern. Do not
accept vague strings like "test carousel" or "try thread format".

## Metric naming

Primary metrics must match the enum used by `experiment-engine.py`:
`impressions`, `clicks`, `ctr`, `replies`, `conversions`, `revenue`,
`open_rate`, `reply_rate`. Do not invent new metric names.

## CLI conventions

- `create` requires `--hypothesis`, `--variable`, `--variants`, `--metric`.
- `log` requires `--experiment-id`, `--variant`, `--metrics` (JSON string).
- `score` requires `--experiment-id`. Never call `score` before at least
  `--min-samples` data points exist per variant (default 30).
- Add `--batch-mode` only for 3–10 variant tests; omit for 2-variant tests.

## Playbook promotion

Winners are promoted automatically by `score` when p-value < 0.05 and
bootstrap CI lower-bound lift ≥ 5%. Do not manually edit `playbook.json`.
