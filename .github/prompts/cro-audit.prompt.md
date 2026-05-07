---
description: "Run a CRO audit on a landing page and return prioritized fixes"
argument-hint: "URL of the landing page"
agent: "agent"
---

Run a CRO audit on **${input:url}** using the
[`conversion-ops`](../skills/conversion-ops/SKILL.md) skill.

```bash
cd conversion-ops && python3 cro_audit.py --url "${input:url}"
```

Then summarise:

- score per CRO dimension
- top 5 fixes ranked by expected lift × ease
- one experiment to run first (hand off to `/run-experiment` if helpful)
