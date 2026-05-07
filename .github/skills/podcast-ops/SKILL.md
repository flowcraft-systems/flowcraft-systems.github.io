---
name: podcast-pipeline
description: "Podcast-to-Everything content pipeline. Takes a podcast RSS feed or raw transcript and generates a full cross-platform content calendar: short-form clips, LinkedIn posts, X threads, blog post, newsletter, YouTube description, show notes. Use when asked to 'turn this podcast into content', 'repurpose this episode', 'build a content calendar from this transcript', 'podcast to everything'."
argument-hint: "RSS feed URL, episode URL, or transcript file path"
---

# Podcast Pipeline (adapter)

Source skill: [`podcast-ops/`](../../../podcast-ops/) — entry point
[`podcast-ops/podcast_pipeline.py`](../../../podcast-ops/podcast_pipeline.py).

## When to use

- One episode → 20+ derivative content pieces
- Building a 2-week content calendar around a single episode
- Pairing with [`short-form-pipeline`](../short-form-pipeline/SKILL.md) for clips

See [`podcast-ops/SKILL.md`](../../../podcast-ops/SKILL.md) for the full output
spec.
