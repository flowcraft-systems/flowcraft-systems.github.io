---
name: deck-generator
description: "Generate professional presentations with AI-generated images. Use when asked to create a deck, presentation, pitch deck, or slides. Supports style presets (whiteboard, corporate, minimalist, etc). Uses Imagen 4.0 for image generation and Google Slides API for assembly."
argument-hint: "Path to markdown content spec, plus optional --style preset"
---

# Deck Generator (adapter)

Source skill: [`deck-generator/`](../../../deck-generator/) — scripts in
[`deck-generator/scripts/`](../../../deck-generator/scripts/).

## When to use

- Turning a markdown outline into a finished Google Slides deck
- Generating consistent visual style across many slides
- Producing pitch decks, sales decks, internal review decks

## Setup

1. Google Cloud project with Slides API + Imagen 4.0 enabled
2. OAuth credentials in `deck-generator/credentials.json` (gitignored)
3. `cd deck-generator && pip install -r requirements.txt`

See [`deck-generator/SKILL.md`](../../../deck-generator/SKILL.md) for the full
flow including style presets and image regeneration.
