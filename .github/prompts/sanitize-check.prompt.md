---
description: "Scan the working tree for PII or secrets before committing"
agent: "privacy-sanitizer"
---

Scan the current working tree (or staged diff if there is one) for PII,
secrets, and hardcoded credentials per
[`.github/instructions/privacy-and-secrets.instructions.md`](../instructions/privacy-and-secrets.instructions.md).

Then suggest the exact follow-up command:

```bash
python3 security/sanitizer.py --scan --dir . --recursive
```

Return `CLEAN` or `BLOCKED` plus a findings table with `file:line` and a
remediation per finding (env var, fixture replacement, or rotate).
