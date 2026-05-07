---
description: "Use when handling sales/marketing data, lead lists, CRM exports, transcripts, or anything that could contain PII. Enforces the repo's sanitizer and pre-commit policy."
applyTo: "**/*.{py,md,json,csv,jsonl,yaml,yml}"
---

# Privacy, secrets, and PII rules

This repo processes marketing, sales, and CRM data. Treat every file under
`data/`, `**/exports/`, `**/transcripts/`, and any `*.csv`/`*.jsonl` as
**potentially sensitive** until proven otherwise.

## Hard rules

- **Never** commit real lead names, emails, phone numbers, company names from
  customer accounts, Gong/Fathom transcripts, or RB2B exports.
- **Never** hardcode API keys, OAuth tokens, webhook URLs with secrets, or
  HubSpot/Instantly/Apollo credentials. Read them from environment variables
  via `os.environ` or `python-dotenv`.
- **Never** disable or bypass the sanitizer (`security/sanitizer.py`) or the
  pre-commit hook (`security/pre-commit-hook.sh`).
- **Never** add telemetry, analytics beacons, usage tracking, opt-in prompts,
  local analytics logs, or automatic version checks.

## Before staging changes

```bash
python3 security/sanitizer.py --scan --dir . --recursive
```

If the scan finds matches, redact or move the file out of the repo. Do not add
the file to `.gitignore` as a workaround if the underlying content was already
committed — rotate any exposed credentials and rewrite history.

## Acceptable test fixtures

- Synthetic data only: `acme-corp.com`, `jane.doe@example.com`, `+1-555-0100`
- Use the placeholders defined in `security/sanitizer-config.json`
