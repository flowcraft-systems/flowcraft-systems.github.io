/* ─── Flowcraft · Adeptiv Enterprise Security Readiness — 1-Hour Sizing Console ──── */
/* Assessor-facing diagnostic. The hour answers ONE question:                          */
/*   "How much of the platform's architecture is incompatible with enterprise          */
/*    buying criteria?" — which separates a 4-week hardening job from a year-long       */
/* transformation. Score 10 architecture-maturity signals via observable Green/Yellow/  */
/* Red answers; the engine infers severity and produces the sizing verdict, per-signal  */
/* heatmap, evidence confidence, red flags, and where the engagement effort lives.      */
/* Implements the Enterprise Readiness Sizing Ruleset v0.2 (signal-based).              */

(function () {
  'use strict';

  /* ════════════════════════════════════════════════════════════════════════
     CONFIG — signal groups, the 10 signals, ratings, scope defs, pricing
     A signal with `archDefining: true` describes a core platform assumption:
     a Red there means redesign, not hardening. `tier: 'control'` signals are
     operational maturity; `tier: 'evidence'` is documentation only. `blocks`
     lists the regulated sectors a Red threatens. `foundational` flags the
     who-can-access-what-and-prove-it signals.
     ════════════════════════════════════════════════════════════════════════ */

  // ── EDITABLE — indicative, non-binding price bands (confirm before publishing) ──
  const MARKET = 'US';
  const PRICING = {
    US: {
      SMALL: [25000, 60000], MEDIUM: [90000, 250000],
      LARGE: [300000, 750000], RESET: [20000, 40000], currency: '$'
    },
    INDIA: {
      SMALL: [2000000, 5000000], MEDIUM: [7500000, 20000000],
      LARGE: [25000000, 60000000], RESET: [1500000, 3500000], currency: '₹'
    }
  };

  // ── Sizing thresholds ──
  const MIN_ASSESSED = 5;            // below this, verdict is "Insufficient Data"
  const RESET_ARCH_RED = 2;          // this many architecture-defining Reds → Reset-first
  const MEDIUM_GAP_THRESHOLD = 3;    // this many non-evidence gaps (yellow/red) → Medium

  // Rating model: the assessor picks an observable answer; each answer maps to one rate.
  const RATE_META = {
    green:  { short: 'Green',  label: 'Enterprise-ready', chip: 'ok',      tone: 'green' },
    yellow: { short: 'Yellow', label: 'Needs hardening',  chip: 'major',   tone: 'yellow' },
    red:    { short: 'Red',    label: 'Core gap',         chip: 'blocker', tone: 'red' },
    na:     { short: 'N/A',    label: 'Not assessed',     chip: 'na',      tone: 'na' }
  };

  // Per-signal confidence: did we SEE proof, hear it stated, or infer it?
  const EVIDENCE_OPTIONS = [
    { value: 'high',   label: 'Verified' },
    { value: 'medium', label: 'Stated' },
    { value: 'low',    label: 'Inferred' }
  ];

  const SCOPE_DEFS = {
    SMALL: {
      label: 'Small', effort: '1–2 months', tone: 'small',
      engagement: 'Evidence-pack & hardening sprint',
      verdict: 'Architecture is sound and controls exist — the gap is documentation, evidence packaging, and light hardening.'
    },
    MEDIUM: {
      label: 'Medium', effort: '3–6 months', tone: 'medium',
      engagement: 'Enterprise Readiness Programme · several remediation streams',
      verdict: 'Architecture is mostly sound, but IAM, auditability, SDLC, privacy, or operational controls are weak — several parallel remediation streams.'
    },
    LARGE: {
      label: 'Large', effort: '6–12 months', tone: 'large',
      engagement: 'Phased remediation + targeted subsystem redesign (+ delivery partner)',
      verdict: 'A core platform assumption is wrong — one architecture-defining area needs redesign, not just hardening.'
    },
    RESET: {
      label: 'Reset First', effort: 'Architecture reset before any readiness SOW', tone: 'reset',
      engagement: 'Paid architecture-reset workshop — do not commit to a fixed readiness SOW yet',
      verdict: 'Multiple core platform assumptions are wrong (tenancy, authorization, access, or data lineage). This is a transformation — reset the architecture before sizing readiness.'
    },
    INSUFFICIENT: {
      label: 'Insufficient Data', effort: 'Continue the assessment', tone: 'na',
      engagement: 'Score more signals to produce a verdict',
      verdict: 'Not enough signals have been assessed to produce a defensible sizing.'
    }
  };

  // Three console steps; the 3 fast-path signals lead because they explain ~80% of effort.
  const GROUPS = [
    {
      key: 'fastpath', num: '02', label: 'The 3 Questions That Size It Fastest',
      time: '0–15 min', decision: 'Architecture · security · evidence maturity — these explain ~80% of the effort.'
    },
    {
      key: 'access', num: '03', label: 'Architecture & Access Depth',
      time: '15–35 min', decision: 'Are the platform’s core assumptions enterprise-compatible?'
    },
    {
      key: 'maturity', num: '04', label: 'Operational & AI Governance Maturity',
      time: '35–55 min', decision: 'Do operations and self-governance survive scrutiny?'
    }
  ];

  // The 10 signals. `num` = display order. `why` is shown on a Red as the cost note.
  const SIGNALS = [
    {
      id: 'trust_boundaries', group: 'fastpath', num: '01', fastPath: true, archDefining: true, foundational: true,
      title: 'Trust boundaries',
      ask: 'Draw your architecture and trust boundaries — don’t give them a template, just ask them to draw it.',
      tells: 'Green: unprompted they draw users, tenant boundary, IAM boundary, audit plane, APIs, DBs, AI models, connectors, on-prem agents. Red: “frontend → backend → database”, or “it all runs in Kubernetes.”',
      why: 'Teams that can’t articulate trust boundaries usually have poor isolation, access control, and auditability — this alone can add 3–6 months.',
      blocks: ['banking', 'healthcare', 'regulated enterprise'],
      choices: [
        { value: 'g', rate: 'green', label: 'Drew clear trust boundaries unprompted — tenant, IAM and audit planes, connectors and agents all placed.' },
        { value: 'y', rate: 'yellow', label: 'Got the main components but vague on isolation / audit boundaries or where the agent sits.' },
        { value: 'r', rate: 'red', label: 'Couldn’t articulate boundaries — generic tiers, or “it all runs in Kubernetes.”' }
      ]
    },
    {
      id: 'tenant_isolation', group: 'fastpath', num: '02', fastPath: true, archDefining: true, foundational: true,
      title: 'Tenant isolation',
      ask: 'What prevents customer A from seeing customer B’s data? Walk it end-to-end.',
      tells: 'Green: a specific enforced mechanism — tenant-aware authorization, row-level security, tenant-scoped keys, a policy engine. Red: a long pause, or “we use tenant_id columns everywhere.”',
      why: 'Entire SaaS products fail enterprise review on this alone — a weak tenancy model means redesign, not hardening.',
      blocks: ['banking', 'healthcare'],
      choices: [
        { value: 'g', rate: 'green', label: 'Specific enforced mechanism — tenant-aware authz, row-level security, tenant-scoped keys, or a policy engine.' },
        { value: 'y', rate: 'yellow', label: 'Has a model, but it’s app-layer only / inconsistently enforced / never independently tested.' },
        { value: 'r', rate: 'red', label: 'Long pause, or “tenant_id columns everywhere” — no provable isolation.' }
      ]
    },
    {
      id: 'evidence_readiness', group: 'fastpath', num: '03', fastPath: true, tier: 'evidence',
      title: 'Evidence readiness',
      ask: 'If a bank’s security team requested evidence tomorrow, what could you send?',
      tells: 'Green: architecture diagrams, pen tests, SDLC controls, policies, audit logs, DR plans — immediately available. Red: “everything would need to be created.”',
      why: 'When everything must be created from scratch, that’s where the real consulting effort lives — but it’s documentation, not redesign.',
      blocks: ['banking', 'regulated enterprise'],
      choices: [
        { value: 'g', rate: 'green', label: 'Most artifacts immediately available — diagrams, pen test, policies, SDLC controls, audit logs, DR.' },
        { value: 'y', rate: 'yellow', label: 'Some artifacts exist but are scattered, stale, or partial.' },
        { value: 'r', rate: 'red', label: 'Almost nothing ready — everything would need to be created.' }
      ]
    },
    {
      id: 'data_lineage', group: 'access', num: '04', archDefining: true, foundational: true,
      title: 'Data lineage',
      ask: 'Where does customer data live? Not “the database” — all locations.',
      tells: 'Green: Postgres, backups, logs, S3, observability, analytics, support tooling, AI systems, search indexes, caches. Red: “Postgres.”',
      why: 'If data lineage is unknown, deletion, residency, and breach-scoping are all unprovable — a structural gap.',
      blocks: ['healthcare', 'banking', 'regulated enterprise'],
      choices: [
        { value: 'g', rate: 'green', label: 'Named the full sprawl — backups, logs, object store, analytics, support tools, AI systems, caches.' },
        { value: 'y', rate: 'yellow', label: 'Named the main stores but unsure about logs / analytics / AI / third-party copies.' },
        { value: 'r', rate: 'red', label: 'Answered with one or two stores (“Postgres”) — lineage is unknown.' }
      ]
    },
    {
      id: 'prod_access', group: 'access', num: '05', archDefining: true,
      title: 'Production access',
      ask: 'Walk me through production access — how does an engineer reach prod?',
      tells: 'Green: JIT, SSO, approval workflow, audit trail. Red: VPN + shared account, standing admin credentials, or “we trust our engineers.”',
      why: 'Unrestricted standing prod access is a core access-control gap large enterprises will not accept.',
      blocks: ['banking', 'healthcare', 'regulated enterprise'],
      choices: [
        { value: 'g', rate: 'green', label: 'JIT + SSO + approval workflow + full audit trail — no standing access.' },
        { value: 'y', rate: 'yellow', label: 'SSO and some logging, but standing access for a named group.' },
        { value: 'r', rate: 'red', label: 'Shared accounts / standing admin credentials, or “we trust our engineers.”' }
      ]
    },
    {
      id: 'authorization', group: 'access', num: '06', archDefining: true,
      title: 'Authorization architecture',
      ask: 'How does authorization work across the services?',
      tells: 'Green: RBAC/ABAC, policies, a clear enforcement layer. Red: “if (role == admin)” scattered across services.',
      why: 'Authorization smeared across services as inline checks is architectural debt — a centralized model is a rebuild.',
      blocks: ['banking', 'regulated enterprise'],
      choices: [
        { value: 'g', rate: 'green', label: 'Centralized model — RBAC/ABAC with a clear policy enforcement layer.' },
        { value: 'y', rate: 'yellow', label: 'A model exists, but enforcement is inconsistent across services.' },
        { value: 'r', rate: 'red', label: 'Ad-hoc inline checks (“if role == admin”) spread across the codebase.' }
      ]
    },
    {
      id: 'questionnaires', group: 'maturity', num: '07', tier: 'control',
      title: 'Security-review track record',
      ask: 'How many enterprise security reviews / questionnaires have you completed?',
      tells: 'Proxy for operational, documentation, and compliance maturity. Green 20+ · Yellow 5–20 · Red 0–3.',
      why: 'A team that’s never completed a SIG questionnaire is usually nowhere near enterprise-ready operationally.',
      blocks: ['regulated enterprise'],
      choices: [
        { value: 'g', rate: 'green', label: '20+ — security reviews are a well-worn motion.' },
        { value: 'y', rate: 'yellow', label: '5–20 — done some, still ad-hoc.' },
        { value: 'r', rate: 'red', label: '0–3 — essentially no track record.' }
      ]
    },
    {
      id: 'secrets', group: 'maturity', num: '08', tier: 'control',
      title: 'Secrets management',
      ask: 'Where are secrets stored?',
      tells: 'Green: KMS, Secrets Manager, Vault. Red: .env files, or GitHub secrets only.',
      why: 'Secrets handling is a maturity proxy; .env-only is a fast tell for weak operational security.',
      choices: [
        { value: 'g', rate: 'green', label: 'Managed — KMS / Secrets Manager / Vault, with rotation.' },
        { value: 'y', rate: 'yellow', label: 'Mostly managed, but some gaps or no rotation.' },
        { value: 'r', rate: 'red', label: '“.env” files, or GitHub secrets only.' }
      ]
    },
    {
      id: 'ai_gov', group: 'maturity', num: '09', tier: 'control',
      title: 'Internal AI governance',
      ask: 'Show me the inventory of AI systems the product itself uses — models, providers, prompts, retention, data flows.',
      tells: 'Green: produced immediately. Red: they govern customer AI but can’t govern their own.',
      why: 'Governing customer AI while not governing their own is a credibility gap reviewers probe directly.',
      blocks: ['regulated enterprise'],
      choices: [
        { value: 'g', rate: 'green', label: 'Immediate inventory — models, providers, prompts, retention, data flows.' },
        { value: 'y', rate: 'yellow', label: 'Partial / informal inventory that isn’t maintained.' },
        { value: 'r', rate: 'red', label: 'No inventory of their own AI usage — they only govern customers’.' }
      ]
    },
    {
      id: 'incidents', group: 'maturity', num: '10', tier: 'control',
      title: 'Incident maturity',
      ask: 'Tell me about your most recent security issue. (Not “have you had any.”)',
      tells: 'Green: a specific story, specific learning, specific remediation. Red: “we haven’t had any” — usually means no detection, reporting, or process.',
      why: '“No incidents” typically means no detection or process, not a clean record.',
      choices: [
        { value: 'g', rate: 'green', label: 'A specific recent issue with concrete learning and remediation.' },
        { value: 'y', rate: 'yellow', label: 'Vague recollection or only minor issues, thin on process.' },
        { value: 'r', rate: 'red', label: '“We’ve had none” — likely no detection / reporting / process.' }
      ]
    }
  ];

  function signalsInGroup(key) {
    return SIGNALS.filter(function (s) { return s.group === key; });
  }

  /* ════════════════════════════════════════════════════════════════════════
     PRICING (indicative, non-binding)
     ════════════════════════════════════════════════════════════════════════ */
  function formatPriceBand(scopeKey) {
    const pricing = PRICING[MARKET] || PRICING.US;
    const range = pricing[scopeKey];
    if (!range) return 'Indicative band determined after assessment';
    const sym = pricing.currency;
    const marketName = MARKET === 'INDIA' ? 'India' : 'US';
    let lo, hi;
    if (MARKET === 'INDIA') {
      lo = (range[0] / 100000).toFixed(1) + 'L';
      hi = (range[1] / 100000).toFixed(1) + 'L';
    } else {
      lo = (range[0] / 1000).toFixed(0) + 'k';
      hi = (range[1] / 1000).toFixed(0) + 'k';
    }
    const tail = scopeKey === 'RESET'
      ? ' · Reset workshop only (readiness SOW deferred)'
      : scopeKey === 'LARGE'
        ? ' · Risk-adjusted · may require delivery partner'
        : ' · Indicative, non-binding';
    return marketName + ': ' + sym + lo + '–' + sym + hi + tail;
  }

  /* ════════════════════════════════════════════════════════════════════════
     MAIN ENGINE — computeVerdict(data) → result object  (pure, testable)
     data = { context: {...}, items: { <id>: { rate, ev, answer } } }
     ════════════════════════════════════════════════════════════════════════ */
  function computeVerdict(data) {
    const items = (data && data.items) || {};
    const counts = { green: 0, yellow: 0, red: 0, na: 0, total: 0, assessed: 0 };
    let archRed = 0, archYellow = 0, controlRed = 0, nonEvidGaps = 0;
    const redFlags = [];
    let evSum = 0, evCount = 0;
    const heatmap = [];
    const redesign = [], harden = [], evidenceOnly = [], notAssessed = [];

    SIGNALS.forEach(function (s) {
      const rec = items[s.id] || {};
      const rate = (rec.rate && RATE_META[rec.rate]) ? rec.rate : 'na';
      const ev = rec.ev || 'low';
      counts.total++;
      counts[rate]++;
      if (rate !== 'na') {
        counts.assessed++;
        evSum += (ev === 'high' ? 3 : ev === 'medium' ? 2 : 1); evCount++;
      }

      if (s.archDefining) {
        if (rate === 'red') archRed++;
        else if (rate === 'yellow') archYellow++;
      } else if (s.tier === 'control') {
        if (rate === 'red') controlRed++;
      }
      if (s.tier !== 'evidence' && (rate === 'red' || rate === 'yellow')) nonEvidGaps++;

      if (rate === 'red') {
        redFlags.push({
          label: s.title, why: s.why, blocks: s.blocks || ['regulated enterprise'],
          foundational: !!s.foundational, archDefining: !!s.archDefining
        });
      }

      const meta = RATE_META[rate];
      heatmap.push({ group: s.group, title: s.title, fastPath: !!s.fastPath, rate: rate, chip: meta.chip, statusLabel: meta.label });
      if (rate === 'red') redesign.push(s.title);
      else if (rate === 'yellow') harden.push(s.title);
      else if (rate === 'green') evidenceOnly.push(s.title);
      else notAssessed.push(s.title);
    });

    // ── Scope classification (sizing verdict) ──
    let scopeKey;
    if (counts.assessed < MIN_ASSESSED) scopeKey = 'INSUFFICIENT';
    else if (archRed >= RESET_ARCH_RED) scopeKey = 'RESET';
    else if (archRed >= 1) scopeKey = 'LARGE';
    else if (controlRed >= 1 || nonEvidGaps >= MEDIUM_GAP_THRESHOLD) scopeKey = 'MEDIUM';
    else scopeKey = 'SMALL';
    const scope = Object.assign({ key: scopeKey }, SCOPE_DEFS[scopeKey]);

    // ── Evidence confidence (aggregate) ──
    const coverage = counts.total ? counts.assessed / counts.total : 0;
    let evLevel = 'low';
    if (evCount > 0) {
      const mean = evSum / evCount;
      evLevel = mean >= 2.5 ? 'high' : mean >= 1.7 ? 'medium' : 'low';
    }
    let evWarning = '';
    if (coverage < 0.6) {
      if (evLevel === 'high') evLevel = 'medium';
      evWarning = 'Low coverage (' + Math.round(coverage * 100) + '% of signals assessed) — confidence capped. Score more signals.';
    }
    const evidence = {
      level: evLevel,
      label: evLevel === 'high' ? 'High' : evLevel === 'medium' ? 'Medium' : 'Low',
      coveragePct: Math.round(coverage * 100),
      desc: evLevel === 'high' ? 'Most signals verified through artifact, config, or live demo.'
        : evLevel === 'medium' ? 'Signals explained consistently by the team but not fully evidenced.'
          : 'Signals largely inferred or stated verbally — treat the sizing as provisional.',
      warning: evWarning
    };

    // ── Proceed / sign-off recommendation ──
    const needsSignoff = scopeKey === 'RESET' || scopeKey === 'LARGE' || scopeKey === 'INSUFFICIENT'
      || evLevel === 'low' || archRed >= 1;
    let proceedDesc;
    if (scopeKey === 'RESET') proceedDesc = 'Multiple core assumptions are wrong — do not commit to a fixed readiness SOW. Reset the architecture first.';
    else if (scopeKey === 'LARGE') proceedDesc = 'A core subsystem needs redesign — architect must validate scope and sequencing before the proposal.';
    else if (scopeKey === 'INSUFFICIENT') proceedDesc = 'Too few signals assessed — continue the hour before sizing.';
    else if (evLevel === 'low') proceedDesc = 'Evidence is largely verbal/inferred — validate with artifacts before committing scope.';
    else if (scopeKey === 'MEDIUM') proceedDesc = 'No broken core assumptions, but real remediation streams — scope the programme.';
    else proceedDesc = 'Architecture is sound and evidence is adequate — proceed to a hardening & evidence engagement.';
    const proceed = {
      clear: !needsSignoff,
      label: needsSignoff ? 'Requires architect sign-off before SOW' : 'Cleared to draft SOW',
      desc: proceedDesc
    };

    return {
      scope: scope,
      effortWeeks: scope.effort,
      engagement: scope.engagement,
      priceBand: formatPriceBand(scopeKey),
      counts: counts,
      signalsSummary: { archRed: archRed, archYellow: archYellow, controlRed: controlRed, nonEvidGaps: nonEvidGaps },
      heatmap: heatmap,
      evidence: evidence,
      redFlags: redFlags,
      fullScope: { redesign: redesign, harden: harden, evidenceOnly: evidenceOnly, notAssessed: notAssessed },
      proceed: proceed
    };
  }

  /* ════════════════════════════════════════════════════════════════════════
     BUILD CONSOLE — inject signal scoring panels into the form
     ════════════════════════════════════════════════════════════════════════ */
  function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function choiceListHtml(signal) {
    const name = 'choice__' + signal.id;
    return signal.choices.map(function (c) {
      return '<label class="ers-choice ers-choice--' + c.rate + '">'
        + '<input type="radio" name="' + name + '" value="' + c.value + '" data-rate="' + c.rate + '" data-label="' + escapeAttr(c.label) + '" />'
        + '<span class="ers-choice-dot" aria-hidden="true"></span>'
        + '<span class="ers-choice-text">' + c.label + '</span>'
        + '<span class="ers-choice-rate ers-choice-rate--' + c.rate + '">' + RATE_META[c.rate].short + '</span>'
        + '</label>';
    }).join('');
  }

  function confidenceHtml(signal) {
    const name = 'ev__' + signal.id;
    return EVIDENCE_OPTIONS.map(function (o) {
      const checked = o.value === 'low' ? ' checked' : '';
      return '<label class="ers-seg-opt"><input type="radio" name="' + name + '" value="' + o.value + '"' + checked + ' />'
        + '<span>' + o.label + '</span></label>';
    }).join('');
  }

  function signalHtml(signal) {
    const fast = signal.fastPath
      ? '<span class="ers-fastpath-badge" title="Fast path — these three explain ~80% of the effort">Fast path</span>' : '';
    const found = signal.foundational
      ? '<span class="ers-foundational-badge" title="Who-can-access-what-and-prove-it: a Red here means reset before readiness">Foundational</span>' : '';
    return '<div class="ers-signal' + (signal.foundational ? ' ers-signal--foundational' : '') + '">'
      + '<div class="ers-signal-head"><span class="ers-signal-num">' + signal.num + '</span>'
      + '<h3 class="ers-signal-title">' + signal.title + fast + found + '</h3></div>'
      + '<p class="ers-signal-ask">' + signal.ask + '</p>'
      + '<p class="ers-signal-tells"><span>Listen for</span> ' + signal.tells + '</p>'
      + '<div class="ers-choice-list" role="radiogroup" aria-label="' + escapeAttr(signal.title) + ' rating">' + choiceListHtml(signal) + '</div>'
      + '<div class="ers-confidence"><span class="ers-ev-label">Evidence</span>'
      + '<div class="ers-seg ers-ev" role="radiogroup" aria-label="Evidence confidence">' + confidenceHtml(signal) + '</div></div>'
      + '</div>';
  }

  function buildConsole() {
    const form = document.getElementById('ersForm');
    if (!form) return;
    const lastPanel = GROUPS.length + 1; // context occupies panel 1
    let html = '';
    GROUPS.forEach(function (g, i) {
      const panel = i + 2;
      const isLast = panel === lastPanel;
      const signals = signalsInGroup(g.key).map(signalHtml).join('');

      let nav = '<div class="deal-nav-buttons">'
        + '<button type="button" class="btn btn-ghost btn-lg deal-prev" data-prev="' + (panel - 1) + '">← Back</button>';
      if (isLast) {
        nav += '<button type="submit" class="btn btn-primary btn-lg" id="ersGenerateBtn">Generate Verdict →</button>';
      } else {
        nav += '<span class="ers-nav-right">'
          + '<button type="submit" class="btn btn-ghost deal-generate">Generate verdict</button>'
          + '<button type="button" class="btn btn-primary btn-lg deal-next" data-next="' + (panel + 1) + '">Continue →</button>'
          + '</span>';
      }
      nav += '</div>';

      html += '<div class="deal-step-panel" data-panel="' + panel + '">'
        + '<div class="deal-step-header"><span class="deal-step-num">' + g.num + '</span>'
        + '<div><h2>' + g.label + '</h2><p class="deal-step-desc"><strong>' + g.time + '</strong> · ' + g.decision + '</p></div></div>'
        + '<div class="ers-signals">' + signals + '</div>'
        + nav + '</div>';
    });
    form.insertAdjacentHTML('beforeend', html);
  }

  /* ─── Read all answers ───────────────────────────────────────────────── */
  function getFormData() {
    const form = document.getElementById('ersForm');
    const fd = new FormData(form);
    const ctxKeys = ['companyName', 'assessorName', 'workEmail', 'productName', 'deploymentModel', 'assessmentReason'];
    const context = {};
    ctxKeys.forEach(function (k) { context[k] = fd.get(k) || ''; });
    context.targetSectors = fd.getAll('targetSectors');

    const items = {};
    SIGNALS.forEach(function (s) {
      const choiceVal = fd.get('choice__' + s.id) || '';
      let rate = 'na', answer = '';
      if (choiceVal) {
        const c = s.choices.filter(function (x) { return x.value === choiceVal; })[0];
        if (c) { rate = c.rate; answer = c.label; }
      }
      items[s.id] = { rate: rate, ev: fd.get('ev__' + s.id) || 'low', answer: answer };
    });
    return { context: context, items: items };
  }

  /* ─── Render results ─────────────────────────────────────────────────── */
  function el(id) { return document.getElementById(id); }

  const GROUP_LABELS = { fastpath: 'Fast path', access: 'Architecture & Access', maturity: 'Operational & AI' };

  function renderResults(r) {
    // Scope classification card
    el('resultScopeLabel').textContent = r.scope.label;
    el('resultScopeEffort').textContent = r.scope.effort;
    el('resultScopeVerdict').textContent = r.scope.verdict;
    el('resultEngagement').textContent = r.engagement;
    el('resultPriceBand').textContent = r.priceBand;
    el('resultScopeCard').className = 'deal-result-card ers-result-card--scope tone-' + r.scope.tone;

    // Risk heatmap (per-signal, grouped)
    let lastGroup = '';
    el('resultHeatmap').innerHTML = r.heatmap.map(function (h) {
      let head = '';
      if (h.group !== lastGroup) { lastGroup = h.group; head = '<div class="ers-heat-group">' + (GROUP_LABELS[h.group] || h.group) + '</div>'; }
      return head + '<div class="ers-heat-row"><span class="ers-heat-domain">' + h.title + '</span>'
        + '<span class="ers-heat-chip ers-heat-chip--' + h.chip + '">' + h.statusLabel + '</span></div>';
    }).join('');

    // Evidence confidence
    el('resultEvLevel').textContent = r.evidence.label;
    el('resultEvCoverage').textContent = r.evidence.coveragePct + '% of signals assessed';
    el('resultEvDesc').textContent = r.evidence.warning || r.evidence.desc;
    el('resultEvCard').className = 'deal-result-card deal-result-card--confidence deal-result-card--conf-' + r.evidence.level;

    // Immediate red flags
    if (r.redFlags.length === 0) {
      el('resultRedFlags').innerHTML = '<span class="deal-flag" style="color:var(--green)">No core gaps identified</span>';
    } else {
      el('resultRedFlags').innerHTML = r.redFlags.map(function (f) {
        const tag = f.foundational ? '🚫 ' : '🚩 ';
        return '<div class="ers-redflag"><span class="deal-flag deal-flag--high">' + tag + f.label + '</span>'
          + '<span class="ers-flag-why">' + f.why + '</span>'
          + '<span class="ers-flag-sectors">Threatens: ' + f.blocks.join(', ') + (f.foundational ? ' · foundational' : '') + '</span></div>';
      }).join('');
    }

    // Where the effort lives
    function group(title, arr, cls) {
      if (!arr.length) return '';
      return '<div class="ers-scope-group"><h4>' + title + '</h4>'
        + arr.map(function (x) { return '<span class="deal-flag ' + cls + '">' + x + '</span>'; }).join('') + '</div>';
    }
    el('resultFullScope').innerHTML =
      group('Redesign / remediate — deep streams', r.fullScope.redesign, 'deal-flag--high')
      + group('Harden — targeted work', r.fullScope.harden, 'deal-flag--medium')
      + group('Evidence-only — document & package', r.fullScope.evidenceOnly, '')
      + group('Not assessed in this session', r.fullScope.notAssessed, 'deal-flag--question')
      || '<span class="deal-flag">Score the signals to generate a scope</span>';

    // Proceed / sign-off
    el('resultProceed').textContent = r.proceed.label;
    el('resultProceedDesc').textContent = r.proceed.desc;
    el('resultProceedCard').className = 'deal-result-card deal-result-card--review' + (r.proceed.clear ? '' : ' deal-result-card--alert');

    // Reveal
    document.querySelectorAll('.deal-step-panel').forEach(function (p) { p.classList.remove('active'); });
    const resultsEl = el('ersResults');
    resultsEl.hidden = false;
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.querySelectorAll('.deal-step').forEach(function (s) { s.classList.remove('active'); });
    const lastChip = document.querySelector('.deal-step[data-step="5"]');
    if (lastChip) lastChip.classList.add('active');
  }

  /* ─── Processing overlay (organic step animation) ────────────────────── */
  function showProcessing(onComplete) {
    const form = el('ersForm');
    const results = el('ersResults');
    const processing = el('ersProcessing');
    form.style.display = 'none';
    results.hidden = true;
    processing.hidden = false;
    processing.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const bar = el('ersProcessingBar');
    const pct = el('ersProcessingPercent');
    const steps = processing.querySelectorAll('.deal-processing-step');
    bar.style.width = '0%';
    pct.textContent = '0%';
    steps.forEach(function (s) { s.className = 'deal-processing-step'; s.querySelector('.dps-icon').textContent = '○'; });

    const stepCount = steps.length;
    let idx = -1;
    const durations = [600, 500, 700, 400, 600, 300];
    function advance() {
      idx++;
      if (idx > 0) {
        const prev = steps[idx - 1];
        if (prev) { prev.className = 'deal-processing-step done'; prev.querySelector('.dps-icon').textContent = '✓'; }
      }
      if (idx >= stepCount) { setTimeout(function () { processing.hidden = true; onComplete(); }, 250); return; }
      const step = steps[idx];
      step.className = 'deal-processing-step active';
      step.querySelector('.dps-icon').textContent = '◉';
      const done = Math.round(((idx + 1) / stepCount) * 100);
      bar.style.width = done + '%';
      pct.textContent = done + '%';
      setTimeout(advance, durations[idx % durations.length] + 120);
    }
    setTimeout(advance, 400);
  }

  /* ─── Zoho CRM submission (fire-and-forget) ──────────────────────────── */
  function submitToZoho(data, result) {
    const zohoForm = el('ersWebformZoho');
    if (!zohoForm) return;
    const payload = {
      version: 'readiness-v0.2-signals', submitted: new Date().toISOString(),
      context: data.context,
      items: data.items, // includes the chosen answer label per signal → records WHY each rating fired
      verdict: {
        scope: result.scope.key, scopeLabel: result.scope.label, effort: result.scope.effort,
        engagement: result.engagement, priceBand: result.priceBand,
        counts: result.counts, signalsSummary: result.signalsSummary,
        evidence: result.evidence,
        redFlags: result.redFlags,
        heatmap: result.heatmap,
        fullScope: result.fullScope,
        proceed: result.proceed
      }
    };
    el('ers_Last_Name').value = data.context.assessorName || 'Readiness Assessment';
    el('ers_Company').value = data.context.companyName || 'Adeptiv AI';
    el('ers_Email').value = data.context.workEmail || '';
    el('ers_Description').value = JSON.stringify(payload, null, 2);

    const fd = new FormData(zohoForm);
    fetch(zohoForm.action, { method: 'POST', body: fd, mode: 'no-cors', keepalive: true }).catch(function () {});
  }

  /* ─── Submit handler ─────────────────────────────────────────────────── */
  function handleSubmit(e) {
    e.preventDefault();
    const data = getFormData();
    const result = computeVerdict(data);
    if (typeof gtag === 'function') {
      gtag('event', 'readiness_sizing_complete', {
        scope: result.scope.key,
        evidence: result.evidence.level,
        requires_signoff: !result.proceed.clear
      });
    }
    showProcessing(function () {
      renderResults(result);
      submitToZoho(data, result);
    });
  }

  /* ─── Navigation ─────────────────────────────────────────────────────── */
  function goToStep(step) {
    const panels = document.querySelectorAll('.deal-step-panel');
    const maxStep = panels.length;
    if (step < 1 || step > maxStep) return;
    panels.forEach(function (p) { p.classList.remove('active'); });
    document.querySelectorAll('.deal-step').forEach(function (s) { s.classList.remove('active'); });
    const tp = document.querySelector('.deal-step-panel[data-panel="' + step + '"]');
    if (tp) tp.classList.add('active');
    const ts = document.querySelector('.deal-step[data-step="' + step + '"]');
    if (ts) ts.classList.add('active');
    const section = document.querySelector('.deal-form-section');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function init() {
    const form = document.getElementById('ersForm');
    if (!form) return; // not on the console page (e.g. test harness)

    buildConsole();

    form.addEventListener('click', function (e) {
      const next = e.target.closest('.deal-next');
      if (next) { goToStep(parseInt(next.dataset.next, 10)); return; }
      const prev = e.target.closest('.deal-prev');
      if (prev) { goToStep(parseInt(prev.dataset.prev, 10)); return; }
    });
    form.addEventListener('submit', handleSubmit);

    // Clickable step chips (jump between panels)
    document.querySelectorAll('.deal-step[data-step]').forEach(function (chip) {
      const step = parseInt(chip.dataset.step, 10);
      const panels = GROUPS.length + 1;
      if (step >= 1 && step <= panels) {
        chip.classList.add('ers-clickable');
        chip.addEventListener('click', function () { goToStep(step); });
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  /* ─── Expose for testing ─────────────────────────────────────────────── */
  window.__readinessSizing = {
    computeVerdict: computeVerdict,
    formatPriceBand: formatPriceBand,
    SIGNALS: SIGNALS,
    GROUPS: GROUPS,
    RATE_META: RATE_META,
    SCOPE_DEFS: SCOPE_DEFS,
    PRICING: PRICING
  };

})();
