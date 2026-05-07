---
name: conversion-ops
description: "Conversion rate optimization toolkit: audit any landing page, score it across CRO dimensions, and turn raw survey data into a high-converting lead magnet. Use when asked to 'CRO audit this page', 'score this landing page', 'turn these survey results into a lead magnet', 'analyze conversion', 'review this funnel'."
argument-hint: "URL to audit, or path to survey CSV"
---

# Conversion Ops (adapter)

Source skill: [`conversion-ops/`](../../../conversion-ops/) — entry points
[`conversion-ops/cro_audit.py`](../../../conversion-ops/cro_audit.py) and
[`conversion-ops/survey_lead_magnet.py`](../../../conversion-ops/survey_lead_magnet.py).

## When to use

- **CRO audit**: score a landing page against the rubric, return prioritized fixes
- **Survey → lead magnet**: turn a survey export into a downloadable asset spec

## Procedure

```bash
cd conversion-ops && pip install -r requirements.txt
python3 cro_audit.py --url https://example.com/landing
python3 survey_lead_magnet.py --input survey.csv
```

See [`conversion-ops/SKILL.md`](../../../conversion-ops/SKILL.md) for full flags.
