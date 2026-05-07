---
description: "Build a one-page pre-call dossier on a prospect or account before a sales call"
argument-hint: "Company domain or LinkedIn URL"
agent: "agent"
---

Build a pre-call dossier on **${input:target}** using
[`lead-dossier`](../skills/lead-dossier/SKILL.md) and (optionally)
[`sales-playbook`](../skills/sales-playbook/SKILL.md) for the value briefing.

Return one page:

- Company snapshot (size, stage, recent news)
- Buying triggers detected (hires, funding, jobs, product launches)
- Stakeholder map (champion, economic buyer, blockers)
- Top 3 hypotheses for "why now"
- Suggested opening 3 questions
- Pricing tier hypothesis (from `sales-playbook`, if relevant)
