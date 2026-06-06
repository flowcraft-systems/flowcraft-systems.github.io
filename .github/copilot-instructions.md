When changing any of the npm packages, ALWAYS bump of the version number using semver semantics

---

# FlowCraft Systems — Website

This is a **pure static website** (HTML/CSS/JS) — no build step, no framework, no package.json, no npm/node dependencies. Deployed via GitHub Pages to `flowcraft.systems` (CNAME).

## HTML Pages

| Page | Purpose |
|------|---------|
| `index.html` | Main marketing site: hero, social proof, vision/mission, products, philosophy, loop diagram, assessment quiz, contact, careers, footer |
| `thank-you.html` | Post-form submission page, fires `generate_lead` GA4 conversion event |
| `404.html` | Custom 404 |
| `robots.txt`, `sitemap.xml` | SEO |

## CSS Architecture (`assets/css/`)

Load order in HTML matches dependency hierarchy:

1. **`tokens.css`** — CSS custom properties only: surfaces, brand colors, text colors, fonts (`--serif`, `--sans`, `--mono`), border radii, container width, section spacing, motion easings. No selectors targeting elements.
2. **`base.css`** — Reset, base typography, layout primitives (`.container`, `.eyebrow`, `.section-head`), buttons (`.btn`, `.btn-primary`, `.btn-ghost`), skip-link, focus-visible. Defines body background with ambient gradient and grid texture pseudo-elements.
3. **`motion.css`** — Keyframes (`blink`, `pulse`, `float`, `fade-up`, `glow`, `drift`, `march`), reveal-on-scroll system (`.reveal` + `.in-view` with `IntersectionObserver`), motion utility classes (`.dot-pulse`, `.float`, `.spin-slow`, `.glow`), `prefers-reduced-motion: reduce` guard.
4. **`sections.css`** — All section-specific styles: nav (fixed, glassmorphism), hero (full-viewport, canvas-bg), proof strip, vision/mission grid, philosophy belief grid, products (card grid with mockups), loop diagram (SVG), contact/Zoho form overrides, assessment quiz, footer.

### Design System

- Dark theme only (`--bg: #06060d`)
- Violet/cyan gradient accent palette
- 3-type system: Playfair Display (serif headings), Inter (sans-serif body/UI), JetBrains Mono (code)
- Glassmorphism nav: `backdrop-filter: blur(20px)` on `rgba(6,6,13,0.72)` background
- Violent/cyan flow-field + constellation canvas animations on hero (lazy-loaded)

## JavaScript Architecture (`assets/js/`)

### `main.js` (ES module — `type="module"`)
Entry point. Wires up:
- **Reduced-motion guard** — skips canvas modules if `prefers-reduced-motion: reduce`
- **IntersectionObserver reveals** — adds `.in-view` class to `.reveal` and `.loop` elements
- **Animated fill bars** — reads `data-fill` attribute to animate width on product mock bars
- **Nav scroll state** — changes border color when `scrollY > 12`
- **Lazy-loaded canvases** — uses `requestIdleCallback` to dynamically import `flow-field.js` and `constellation.js`

### `flow-field.js` (ES module — exported `init()`)
Perlin-noise flow-field particle system on `#flow-field-canvas`. Violet/cyan trailing particles. Handles resize, visibility change (pause when tab hidden), IntersectionObserver (pause when off-screen). No external dependencies — implements its own value-noise.

### `constellation.js` (ES module — exported `init()`)
Cursor-reactive node constellation on `#constellation-canvas`. ~28-56 drifting nodes with connecting lines that fade based on distance. Links toward cursor position on `pointermove`. Same lifecycle handling as flow-field.

### `assessment.js` (IIFE — loaded with `defer`, no module)
Self-contained Engineering Leverage Gap Diagnostic quiz (~900+ lines). No external dependencies. Key structure:
- 6 dimensions × 4 Likert (1-5) questions each
- Qualification (4 questions), Context (3 questions)
- Scoring with fragility penalties: `overall = mean(scores) - penalty`
- Radar chart drawn on `<canvas>` with dimension labels
- Archetype detection (AI Theatre Company, Power-User Archipelago, Acceleration Trap, Visibility Gap, Compounding Team)
- Zoho CRM web-to-lead form auto-populated and submitted on completion
- GA4 event firing on lead submission
- Email delivery of results via Zoho webhook

## Third-Party Integrations

| Service | Details |
|---------|---------|
| **Google Analytics 4** | `G-W8BTM9N3JX` — page views + `generate_lead` conversion event |
| **Zoho CRM** | Hidden Web-to-Lead form submitted by assessment.js after quiz completion |
| **Google Fonts** | Playfair Display, Inter, JetBrains Mono (preconnected) |

## Deployment

- **Host**: GitHub Pages (`flowcraft-systems.github.io`)
- **Custom domain**: `flowcraft.systems` (CNAME file in repo root)
- **No CI/CD config found** — deploys from default branch
- **Subdomains**: `engage.flowcraft.systems`, `tempo.flowcraft.systems` (external products)

## Coding Conventions (this repo)

- **Vanilla HTML/CSS/JS** — no frameworks, no build step
- **CSS**: custom properties in tokens.css, BEM-like naming (`.asm-card-title`, `.hero-meta-dot`), no preprocessors
- **JS**: ES modules for canvas effects, IIFE for self-contained assessment, `defer` and `type="module"` scripts
- **No testing framework** present — manual QA via browser
- **Semantic HTML** with ARIA labels and landmarks throughout
- **Accessibility**: skip-link, `:focus-visible` outlines, `prefers-reduced-motion`, color contrast maintained
- **SVG inline** for icons and loop diagram
- **Responsive**: mobile breakpoints at 760px, 640px, 600px via `@media`

---

# nWave — AI Workflow Framework for GitHub Copilot

nWave is a wave-based software development methodology that routes every task through specialized agents in a disciplined sequence, enforcing TDD, BDD, and structured quality gates.

## Wave Sequence

```
DISCOVER → DISCUSS → DESIGN → DEVOPS → DISTILL → DELIVER
```

| Wave | Command | Agent | Output |
|------|---------|-------|--------|
| DISCOVER | `/nw-discover` | `nw-product-discoverer` | Evidence, opportunity validation |
| DISCUSS | `/nw-discuss` | `nw-product-owner` | User stories, acceptance criteria |
| DESIGN | `/nw-design` | `nw-solution-architect` | Architecture, ADRs, C4 diagrams |
| DEVOPS | `/nw-devops` | `nw-platform-architect` | CI/CD, infrastructure, observability |
| DISTILL | `/nw-distill` | `nw-acceptance-designer` | BDD acceptance tests (Given-When-Then) |
| DELIVER | `/nw-deliver` | `nw-software-crafter` | Working code via Outside-In TDD |

## Agents in This Workspace

**Primary wave agents**: `nw-product-discoverer`, `nw-product-owner`, `nw-solution-architect`, `nw-platform-architect`, `nw-acceptance-designer`, `nw-software-crafter`, `nw-functional-software-crafter`

**Cross-wave agents**: `nw-researcher`, `nw-troubleshooter`, `nw-documentarist`, `nw-data-engineer`, `nw-agent-builder`

**Reviewer agents** (invoked as subagents, not directly by users): `nw-software-crafter-reviewer`, `nw-acceptance-designer-reviewer`, `nw-solution-architect-reviewer`, `nw-platform-architect-reviewer`, `nw-product-owner-reviewer`, `nw-product-discoverer-reviewer`, `nw-documentarist-reviewer`, `nw-researcher-reviewer`, `nw-troubleshooter-reviewer`, `nw-data-engineer-reviewer`, `nw-agent-builder-reviewer`

## Slash Commands

Use these prompts to trigger wave execution (type `/` to see available prompts):

- `/nw-discover` — Start evidence-based product discovery
- `/nw-discuss` — JTBD analysis and requirements gathering
- `/nw-design` — Architecture design with C4 diagrams
- `/nw-devops` — CI/CD pipeline and infrastructure design
- `/nw-distill` — Create BDD acceptance tests
- `/nw-deliver` — Implement via Outside-In TDD
- `/nw-research` — Evidence-driven research with source verification
- `/nw-refactor` — Structured refactoring via RPP L1-L6 hierarchy
- `/nw-review` — Expert peer review of any artifact
- `/nw-new` — Start a new feature (guided wizard)
- `/nw-continue` — Resume a feature in progress
- `/nw-bugfix` — Bug fix workflow with root cause analysis

## Skill Library

Domain knowledge is stored in `nWave/skills/<name>/SKILL.md`. Agents load these files using the read tool at the appropriate phase. Do not move these files.

## Conventions

- **Feature artifacts**: `docs/feature/{feature-id}/{wave}/`
- **Execution log**: `docs/feature/{feature-id}/deliver/execution-log.json`
- **Roadmap**: `docs/feature/{feature-id}/deliver/roadmap.json`
- **Architecture**: `docs/architecture/architecture.md`, `docs/adrs/`
- **Research**: `docs/research/`
- **Commits**: conventional commits required — `feat|fix|docs|test|chore(scope): subject`
- **Code style**: Python ≥ 3.10, type hints, Ruff v0.15.0, line length 88, double quotes
- **Testing**: 5-layer framework — unit, integration, acceptance, e2e, mutation
- **Architecture**: hexagonal (ports & adapters), dependency inversion

# flowcraft observe
@.github/skills/roi-calculator/SKILL.md
@.github/skills/flowcraft-case-file/SKILL.md
<!-- flowcraft:roi-skill:v2 -->

---

# Marketing & Sales Skills

This repo also includes a full marketing and sales skill library ported from the ai-marketing-skills toolkit.

## Available Marketing Agents

- `marketing-strategist` — multi-channel marketing planning across growth, content, SEO, and outbound
- `content-quality-gate` — quality gate before publishing any content asset
- `growth-experimenter` — hypothesis framing, A/B experiment design, bootstrap CI + Mann-Whitney tests
- `sales-pipeline-analyst` — intent scoring, lead triage, dedup, CRM routing
- `content-repurposer` — repurpose a single source asset (podcast, video, blog) into cross-platform content
- `privacy-sanitizer` — PII and secrets scan on any diff before commit

## Available Marketing Prompts (type `/` to see them)

- `/run-experiment` — design or log a growth experiment
- `/score-content` — expert panel score for any content asset
- `/cold-email-sequence` — build an outbound cold email sequence
- `/cro-audit` — CRO audit a landing page
- `/weekly-scorecard` — pull experiment pacing and weekly growth scorecard
- `/pre-call-brief` — value-based pre-call brief for a prospect
- `/sanitize-check` — PII/secrets scan before staging changes

## Marketing Skill Library

Skills live in `.github/skills/<name>/SKILL.md`. Key skills:

| Skill | Triggers |
|-------|---------|
| `autoresearch` | Optimize landing page, email, ad copy, headlines |
| `conversion-ops` | CRO audit, survey → lead magnet |
| `content-ops` | Expert panel scoring, iterate to 90+ |
| `growth-engine` | Run experiments, pacing alerts, weekly scorecard |
| `outbound-engine` | Cold email sequences, ICP definition |
| `sales-pipeline` | RB2B routing, dead-deal resurrection, ICP tuning |
| `sales-playbook` | Value pricing, pre-call brief, call analysis |
| `seo-ops` | Content briefs, GSC keyword opportunities |
| `podcast-ops` | Podcast-to-everything content calendar |
| `revenue-intelligence` | Gong call insights, revenue attribution |

## Guardrails

Instruction files in `.github/instructions/` apply automatically:
- `privacy-and-secrets.instructions.md` — PII policy on all data files
- `python-scripts.instructions.md` — CLI conventions for all `.py` files
- Per-skill guardrails apply to their respective folders (growth-engine/, outbound-engine/, etc.)
