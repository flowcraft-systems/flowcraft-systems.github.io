**Agent:** design-sherpa
**Complexity:** MEDIUM
**Date:** 2025-11-20
**Ticket:** N/A

# Design Report: FlowCraft Systems homepage — flowcraft.systems

## Summary

Designed and shipped the production homepage for FlowCraft Systems
(`https://flowcraft.systems`) as a static site deployable directly via GitHub
Pages from `flowcraft-systems.github.io`. The site positions FlowCraft as the
"operating system for AI-native engineering" and links to the two live
products: `engage.flowcraft.systems` and `tempo.flowcraft.systems`.

## Architecture decisions

- **Stack:** plain HTML + 4 CSS files + 3 JS modules. No bundler, no
  framework, no runtime dependency. Deploys as static assets.
- **Tokens:** dark base (`#06060d`), violet primary (`#8b5cf6`), cyan accent
  (`#22d3ee`), Playfair Display serif (italic) for hero/section headings,
  Inter for UI, JetBrains Mono for labels — matches the design language
  already used in Tempo and Engage.
- **Motion:** Canvas2D Perlin-noise flow-field (~600 particles) layered with
  a cursor-reactive node constellation in the hero; CSS-driven SVG loop
  diagram with marching-ants edges; IntersectionObserver reveal-on-scroll;
  product mock bars animate to their target widths via `data-fill`.
- **Accessibility:** semantic landmarks, skip-link, ARIA labels on nav
  regions and interactive cards, visible focus rings, and a full
  `prefers-reduced-motion` fallback that disables all animations and hides
  the canvases (the static gradient backdrop remains).
- **SEO:** OpenGraph + Twitter card meta, JSON-LD `Organization` schema with
  the two products as `subOrganization`, canonical URL, sitemap, robots.txt.
- **Lazy loading:** the two heavy canvas modules are loaded via
  `requestIdleCallback`-gated dynamic `import()`, gated again by
  `prefers-reduced-motion`.

## Sections shipped

Nav, Hero (with dual canvas), Vision + Mission (split column with central
animated rule), Philosophy (5 belief cards with custom inline-SVG glyphs),
Products (Engage + Tempo as browser-chrome cards with animated mocks),
The Loop (5-node SVG diagram drawn on scroll), Contact, Careers placeholder,
Footer with secondary tagline.

## Files added (root + assets/)

- `index.html`, `404.html`, `CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml`,
  `favicon.svg`
- `assets/css/{tokens,base,motion,sections}.css`
- `assets/js/{main,flow-field,constellation}.js`

No files in `.github/` (the pre-existing marketing/sales skill library) were
touched.

## Open follow-ups

- Real contact email (currently uses `hello@flowcraft.systems` /
  `careers@flowcraft.systems` — confirm these mailboxes exist).
- Designed 1200×630 social card PNG (currently OG meta points at
  `favicon.svg`).
- Consider adding privacy policy link before launch if any analytics is
  added later (none in v1).

## ROI Estimate

| Metric | Manual | Agent |
|--------|--------|-------|
| Total  | ~5 h | ~35 min |
