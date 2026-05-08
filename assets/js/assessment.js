/* ─────────────────────────────────────────────────────────────────────────────
   FlowCraft · Engineering Leverage Gap Diagnostic
   Self-contained IIFE — no external dependencies.
   ───────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  // ─── Dimension definitions ──────────────────────────────────────────────────
  const DIMS = [
    {
      id: 'leverage', name: 'AI Leverage', full: 'AI Leverage Maturity',
      color: '#8b5cf6',
      core: 'Are engineers using AI as a systemic leverage layer, or merely as autocomplete?',
      qs: [
        'Our best engineers use AI to compress real engineering work, not just generate snippets.',
        'AI is used across multiple SDLC stages: discovery, design, implementation, review, testing, RCA, documentation, and release readiness.',
        'We have defined what "good AI-assisted engineering work" looks like in our context.',
        'We can identify which teams, repositories, or workflows are getting measurable leverage from AI.',
      ],
    },
    {
      id: 'opmodel', name: 'Operating Model', full: 'Engineering Operating Model',
      color: '#22d3ee',
      core: 'Has the SDLC changed, or did you just add AI tools to the old process?',
      qs: [
        'Our planning process accounts for AI-assisted throughput rather than assuming old delivery economics.',
        'Our code review, design review, testing, and release gates have changed because AI has changed how work is produced.',
        'We have clear decision rights for architecture, quality, delivery trade-offs, and AI-assisted changes.',
        'Our engineering rituals expose bottlenecks and learning loops, not just status updates.',
      ],
    },
    {
      id: 'predict', name: 'Predictability', full: 'Delivery Predictability',
      color: '#10b981',
      core: 'Can leadership trust delivery promises without heroic escalation?',
      qs: [
        'Leadership can distinguish committed work, discovery work, risky work, and experimental work.',
        'Delivery dates are based on evidence, dependencies, and risk — not optimism or escalation pressure.',
        'When work slips, we can usually trace the cause to a specific planning, dependency, quality, or architecture signal.',
        'AI-assisted development has improved predictability, not merely increased the volume of work in progress.',
      ],
    },
    {
      id: 'arch', name: 'Architecture\nReadiness', full: 'Architecture & Codebase Readiness',
      color: '#f59e0b',
      core: 'Will AI-assisted speed compound value, or will it accelerate entropy?',
      qs: [
        'Our codebase has enough modularity and ownership clarity for AI-assisted changes to be reviewed safely.',
        'Our critical workflows have automated tests, observability, and rollback paths that support faster iteration.',
        'Our architecture documentation and domain knowledge are accessible enough for engineers and AI agents to reason about the system.',
        'We know which parts of the system should not be accelerated until reliability, testability, or ownership improves.',
      ],
    },
    {
      id: 'visibility', name: 'Executive\nVisibility', full: 'Measurement & Executive Visibility',
      color: '#ec4899',
      core: 'Can you distinguish real engineering leverage from activity theatre?',
      qs: [
        'We can measure AI-assisted engineering impact beyond license usage or adoption percentage.',
        'Our engineering metrics connect activity, quality, risk, and business outcomes.',
        'Executives can see where engineering capacity is actually going without relying on anecdotal status reporting.',
        'We can tell whether AI is reducing cycle time, improving quality, increasing rework, or shifting bottlenecks elsewhere.',
      ],
    },
    {
      id: 'gov', name: 'Governance\n& Trust', full: 'Governance, Trust & Safety',
      color: '#f97316',
      core: 'Can your organization scale AI usage without creating data, security, and quality risks?',
      qs: [
        'We have clear policies for what data, code, credentials, logs, and customer information can be used with AI tools.',
        'AI-generated or AI-assisted work has appropriate human review, testing, and accountability.',
        'We can audit how AI is being used across teams without creating a surveillance culture.',
        'Engineering leaders trust AI-assisted work because the system has controls, not because people are optimistic.',
      ],
    },
  ];

  // ─── Qualification questions ────────────────────────────────────────────────
  const QUAL_QS = [
    {
      id: 'stage',
      q: 'Which best describes your product / business stage?',
      opts: [
        ['pre_pmf', 'Still searching for product-market fit'],
        ['early', 'Early traction but unstable repeatability'],
        ['proven', 'Proven PMF — scaling now'],
        ['mature', 'Mature, optimizing at scale'],
        ['transform', 'Major transformation or turnaround'],
      ],
    },
    {
      id: 'urgency',
      q: 'How urgent is AI-native engineering transformation for your organization?',
      opts: [
        ['exploratory', 'Exploratory'],
        ['important', 'Important, but not urgent'],
        ['12mo', 'Needed within 12 months'],
        ['2q', 'Needed within 2 quarters'],
        ['yesterday', 'It should have happened yesterday'],
      ],
    },
    {
      id: 'role',
      q: 'What is your role in changing engineering operating models?',
      opts: [
        ['observer', 'Observer / influencer'],
        ['manager', 'Engineering manager'],
        ['director', 'Director'],
        ['vp', 'VP Engineering / Head of Engineering'],
        ['cto', 'CTO / CEO / Founder'],
      ],
    },
    {
      id: 'mandate',
      q: 'Which statement is closest to your current mandate?',
      opts: [
        ['experiment', 'Experiment with AI tools'],
        ['productivity', 'Increase developer productivity'],
        ['leverage', 'Measurable engineering leverage'],
        ['redesign', 'Redesign how engineering works'],
        ['stepchange', 'Step-change in delivery, reliability, and scale'],
      ],
    },
  ];

  // ─── Context questions ──────────────────────────────────────────────────────
  const CTX_QS = [
    {
      id: 'timeline', q: 'When do you want to see visible change?',
      opts: ['12+ months', '6–12 months', '3–6 months', 'This quarter', 'Yesterday'],
    },
    {
      id: 'size', q: 'How large is your engineering organization?',
      opts: ['< 10', '10–25', '26–75', '76–200', '200+'],
    },
    {
      id: 'pain', q: 'What is the most painful symptom today?',
      opts: [
        'Delivery slippage', 'Quality issues', 'Architectural entropy',
        'Too much coordination overhead', 'Weak AI adoption', 'Uncontrolled AI adoption',
        'Lack of engineering visibility', 'Board / CEO pressure',
        'Scaling after PMF', 'Engineering cost not translating into output',
      ],
    },
  ];

  // ─── Archetypes ─────────────────────────────────────────────────────────────
  const ARCHETYPES = [
    {
      name: 'The AI Theatre Company',
      match: s => s.leverage < 40 && s.opmodel < 40,
      pattern: 'AI tools purchased · No workflow redesign · Vanity metrics · Weak executive visibility',
      msg: 'Your organization is performing AI adoption more than practicing AI-native engineering.',
    },
    {
      name: 'The Power-User Archipelago',
      match: s => s.leverage >= 50 && s.opmodel < 50,
      pattern: 'Strong individual users · Practices not codified · No leverage telemetry · Management system unchanged',
      msg: 'Your best engineers are islands of leverage. The company is not yet learning from them.',
    },
    {
      name: 'The Acceleration Trap',
      match: s => s.leverage >= 60 && s.arch < 50,
      pattern: 'High AI use · Weak tests · Complex codebase · Unclear ownership · Rising review burden',
      msg: 'You are making change cheaper before making change safer.',
    },
    {
      name: 'The Visibility Gap',
      match: s => s.visibility < 45 && s.predict < 50,
      pattern: 'Lots of reports · Low trust · Weak outcome linkage · Anecdotal productivity claims',
      msg: 'You cannot manage the leverage curve with status updates.',
    },
    {
      name: 'The Compounding Team',
      match: s => s.overall >= 70,
      pattern: 'AI used across SDLC · Feedback loops exist · Delivery and quality improving · Governance is credible',
      msg: 'You are ready to turn AI-native engineering into a durable operating advantage.',
    },
  ];

  const NEXT_MOVES = {
    opmodel: 'Map your current SDLC against AI-assisted reality. Redesign one review gate before adding more tools. Then extend the change one ritual at a time.',
    arch: 'Run an architecture readiness audit before accelerating velocity. Identify which modules can absorb faster change — and which will amplify entropy.',
    visibility: 'Build a single leadership-visible metric that connects AI usage to delivery outcomes. Eliminate vanity dashboards first. Then close the loop.',
    gov: 'Establish a lightweight AI usage policy before scaling AI access. Define what can and cannot go to external models. Enforce with controls, not optimism.',
    predict: 'Separate commitment types before measuring delivery performance. AI-assisted speed only compounds if the system absorbs it predictably.',
    leverage: 'Define what good AI-assisted engineering looks like in your context. Build a leverage map across teams before investing in more tooling.',
  };

  // ─── State ──────────────────────────────────────────────────────────────────
  const state = {
    screen: 0,
    entry: { lastName: '', company: '', email: '' },
    qual: {},
    dims: {},
    ctx: {},
    scores: null,
  };

  let root;

  // ─── Scoring ────────────────────────────────────────────────────────────────
  function calcScores() {
    const s = {};
    for (const d of DIMS) {
      const ans = state.dims[d.id] || [];
      const avg = ans.reduce((a, b) => a + b, 0) / (ans.length || 1);
      s[d.id] = Math.round(avg * 20);
    }
    let overall = DIMS.reduce((sum, d) => sum + s[d.id], 0) / DIMS.length;
    let penalty = 0;
    if (s.leverage > 70 && s.opmodel < 50) penalty += 8;
    if (s.leverage > 70 && s.arch < 50)    penalty += 10;
    if (s.gov < 45)                         penalty += 8;
    if (s.visibility < 45)                  penalty += 6;
    s.overall = Math.max(0, Math.round(overall - penalty));
    s.penalty = penalty;
    return s;
  }

  function getBand(score) {
    if (score < 40) return {
      label: 'AI Theatre Zone', color: '#ef4444',
      copy: 'You do not have an AI-native engineering system yet. You may have tools, pilots, and enthusiasm — but the system is not ready. Your first move is not another tool rollout. It is to make the engineering system observable.',
    };
    if (score < 60) return {
      label: 'Fragmented Leverage Zone', color: '#f59e0b',
      copy: 'You have leverage, but it is leaking. Some teams are probably moving faster. But the organization has not yet converted that into a repeatable operating advantage. The problem is not motivation. It is system design.',
    };
    if (score < 75) return {
      label: 'Transition Zone', color: '#22d3ee',
      copy: 'You are close. You have real ingredients but lack a complete loop. The risk is mistaking early leverage for systemic transformation.',
    };
    if (score < 90) return {
      label: 'Compounding Zone', color: '#10b981',
      copy: 'AI-native engineering is becoming an operating advantage. Your next challenge is scaling the loop across teams, products, and architectural boundaries.',
    };
    return {
      label: 'Category Leader Zone', color: '#8b5cf6',
      copy: 'You are not asking whether AI works. You are using AI-native engineering as a competitive weapon.',
    };
  }

  function getArchetype(s) { return ARCHETYPES.find(a => a.match(s)) || ARCHETYPES[4]; }

  function getConstraints(s) {
    return [...DIMS].sort((a, b) => (s[a.id] || 0) - (s[b.id] || 0)).slice(0, 2).map(d => ({ ...d, score: s[d.id] || 0 }));
  }

  function getRisks(s) {
    const r = [];
    if (s.leverage > 70 && s.opmodel < 50) r.push('AI is growing faster than the operating model can absorb it');
    if (s.leverage > 70 && s.arch < 50)    r.push('AI speed is ahead of architecture and test readiness');
    if (s.gov < 45)                         r.push('Shadow AI risk — governance is too thin to scale');
    if (s.visibility < 45)                  r.push('Leadership cannot see the engineering leverage curve');
    return r;
  }

  function buildDesc(s) {
    const band = getBand(s.overall);
    const arch = getArchetype(s);
    const constraints = getConstraints(s);
    const risks = getRisks(s);
    return [
      '=== FlowCraft · Engineering Leverage Gap Diagnostic ===',
      `Overall Score: ${s.overall}/100  |  Band: ${band.label}`,
      `Archetype: ${arch.name}`,
      '',
      'Dimension Scores:',
      ...DIMS.map(d => `  ${d.full}: ${s[d.id]}/100`),
      `  Fragility Penalty Applied: -${s.penalty}`,
      '',
      `Top Constraints: ${constraints.map(d => `${d.full} (${d.score})`).join(' · ')}`,
      risks.length ? `Risk Patterns: ${risks.join(' · ')}` : '',
      '',
      'Qualification:',
      `  Stage: ${state.qual.stage || ''}  |  Urgency: ${state.qual.urgency || ''}`,
      `  Role: ${state.qual.role || ''}  |  Mandate: ${state.qual.mandate || ''}`,
      '',
      'Context:',
      `  Timeline: ${state.ctx.timeline || '—'}  |  Team Size: ${state.ctx.size || '—'}  |  Pain: ${state.ctx.pain || '—'}`,
    ].filter(Boolean).join('\n');
  }

  // ─── Radar chart ────────────────────────────────────────────────────────────
  function drawRadar(canvas, s) {
    const dpr  = window.devicePixelRatio || 1;
    const size = canvas.offsetWidth || 340;
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width  = size + 'px';
    canvas.style.height = size + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2;
    const r  = size * 0.34;
    const N  = DIMS.length;
    const ang = i => (2 * Math.PI * i / N) - Math.PI / 2;
    const vals = DIMS.map(d => (s[d.id] || 0) / 100);

    // Grid rings
    for (let ring = 1; ring <= 5; ring++) {
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const rr = r * ring / 5;
        const x = cx + rr * Math.cos(ang(i));
        const y = cy + rr * Math.sin(ang(i));
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = ring === 3 ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Spokes
    for (let i = 0; i < N; i++) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i)));
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Fill polygon
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const x = cx + r * vals[i] * Math.cos(ang(i));
      const y = cy + r * vals[i] * Math.sin(ang(i));
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, 'rgba(139,92,246,0.28)');
    grad.addColorStop(1, 'rgba(34,211,238,0.28)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Vertex dots with glow
    for (let i = 0; i < N; i++) {
      const x = cx + r * vals[i] * Math.cos(ang(i));
      const y = cy + r * vals[i] * Math.sin(ang(i));
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle  = DIMS[i].color;
      ctx.shadowColor = DIMS[i].color;
      ctx.shadowBlur  = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Labels (support two-line names split on \n)
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 11px "Inter", sans-serif';
    const labelR = r + 34;
    for (let i = 0; i < N; i++) {
      const lx = cx + labelR * Math.cos(ang(i));
      const ly = cy + labelR * Math.sin(ang(i));
      ctx.fillStyle = DIMS[i].color;
      const lines = DIMS[i].name.split('\n');
      if (lines.length > 1) {
        ctx.fillText(lines[0], lx, ly - 7);
        ctx.fillText(lines[1], lx, ly + 7);
      } else {
        ctx.fillText(lines[0], lx, ly);
      }
    }
  }

  // ─── Utilities ──────────────────────────────────────────────────────────────
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function q(sel) { return root.querySelector(sel); }
  function scrollUp() { root.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  function progressBar(step, total, label) {
    const pct = Math.round((step / total) * 100);
    return `<div class="asm-progress">
  <span class="asm-step-label">Step ${step} of ${total}${label ? ' — ' + label : ''}</span>
  <div class="asm-progress-track"><span class="asm-progress-fill" style="width:${pct}%"></span></div>
</div>`;
  }

  // ─── Screen 0 — Entry gate ───────────────────────────────────────────────────
  function showEntry() {
    root.innerHTML = `<div class="asm-card asm-entry">
  <div class="asm-entry-badge">Engineering Leverage Gap Diagnostic</div>
  <h3 class="asm-card-title">This is not an AI adoption quiz.</h3>
  <p class="asm-card-sub">A blunt 10-minute diagnostic for CTOs, CEOs, and VP Engineering leaders with proven PMF and real scale pressure. You will receive a readiness score across six dimensions, a radar chart, your dominant risk pattern, and a recommended next move.</p>
  <div class="asm-entry-fields">
    <div class="asm-field-row">
      <div class="asm-field">
        <label class="asm-label" for="asm-ln">Last Name <span class="asm-req" aria-hidden="true">*</span></label>
        <input class="asm-input" type="text" id="asm-ln" placeholder="Chen" autocomplete="family-name" value="${esc(state.entry.lastName)}" />
      </div>
      <div class="asm-field">
        <label class="asm-label" for="asm-co">Company <span class="asm-req" aria-hidden="true">*</span></label>
        <input class="asm-input" type="text" id="asm-co" placeholder="Acme Inc." autocomplete="organization" value="${esc(state.entry.company)}" />
      </div>
    </div>
    <div class="asm-field">
      <label class="asm-label" for="asm-em">Business Email <span class="asm-req" aria-hidden="true">*</span></label>
      <input class="asm-input" type="email" id="asm-em" placeholder="you@company.com" autocomplete="email" value="${esc(state.entry.email)}" />
    </div>
    <p id="asm-entry-err" class="asm-err" role="alert"></p>
    <button class="asm-btn-primary" id="asm-entry-go">Find Your Leverage Gap →</button>
    <p class="asm-fine">No spam. No sales calls until you ask us to follow up.</p>
  </div>
</div>`;

    q('#asm-entry-go').addEventListener('click', submitEntry);
    [q('#asm-ln'), q('#asm-co'), q('#asm-em')].forEach(inp =>
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') submitEntry(); })
    );
  }

  function submitEntry() {
    const ln = q('#asm-ln').value.trim();
    const co = q('#asm-co').value.trim();
    const em = q('#asm-em').value.trim();
    const err = q('#asm-entry-err');
    if (!ln || !co || !em) { err.textContent = 'Please fill in all fields.'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { err.textContent = 'Please enter a valid email address.'; return; }
    state.entry = { lastName: ln, company: co, email: em };
    go(1);
  }

  // ─── Screen 1 — Qualification ────────────────────────────────────────────────
  function showQual() {
    root.innerHTML = `<div class="asm-card">
  ${progressBar(1, 9, 'Qualification')}
  <h3 class="asm-card-title">A few quick filters.</h3>
  <p class="asm-card-sub">These calibrate your result. There are no wrong answers.</p>
  ${QUAL_QS.map(qdef => `
  <div class="asm-q-block" data-qid="${qdef.id}">
    <p class="asm-q-text">${qdef.q}</p>
    <div class="asm-opts-list">
      ${qdef.opts.map(([v, label]) => `
      <button class="asm-opt${state.qual[qdef.id] === v ? ' asm-opt-sel' : ''}" data-val="${v}" role="radio" aria-checked="${state.qual[qdef.id] === v}">
        <span class="asm-radio-dot"></span>${label}
      </button>`).join('')}
    </div>
  </div>`).join('')}
  <p id="asm-qual-err" class="asm-err" role="alert"></p>
  <div class="asm-nav">
    <button class="asm-btn-ghost" id="asm-qual-back">← Back</button>
    <button class="asm-btn-primary" id="asm-qual-fwd">Continue →</button>
  </div>
</div>`;

    wireListOpts(QUAL_QS, state.qual);
    q('#asm-qual-back').addEventListener('click', () => go(0));
    q('#asm-qual-fwd').addEventListener('click', () => {
      if (QUAL_QS.some(qd => !state.qual[qd.id])) {
        q('#asm-qual-err').textContent = 'Please answer all 4 questions.'; return;
      }
      go(2);
    });
  }

  // ─── Screens 2-7 — Dimensions ────────────────────────────────────────────────
  function showDim(idx) {
    const dim  = DIMS[idx];
    const step = idx + 2;
    const existing = state.dims[dim.id] || [0, 0, 0, 0];

    root.innerHTML = `<div class="asm-card">
  ${progressBar(step, 9, dim.full)}
  <div class="asm-dim-eyebrow" style="color:${dim.color}">${dim.full}</div>
  <h3 class="asm-card-title asm-title-sm">${dim.core}</h3>
  <div class="asm-scale-legend">
    <span>1 — Not true</span>
    <span>2 — Partially true</span>
    <span>3 — True in pockets</span>
    <span>4 — Mostly true</span>
    <span>5 — Systemically true</span>
  </div>
  ${dim.qs.map((qText, qi) => `
  <div class="asm-q-block asm-likert-block" data-qi="${qi}">
    <p class="asm-q-text"><span class="asm-q-num" style="color:${dim.color}">${idx + 1}.${qi + 1}&nbsp;</span>${qText}</p>
    <div class="asm-likert-row" role="radiogroup" aria-label="Statement ${qi + 1}">
      ${[1, 2, 3, 4, 5].map(n => `
      <button class="asm-likert${existing[qi] === n ? ' asm-likert-sel' : ''}" data-val="${n}"
              role="radio" aria-checked="${existing[qi] === n}" aria-label="Score ${n}">
        <span class="asm-likert-inner">${n}</span>
      </button>`).join('')}
    </div>
  </div>`).join('')}
  <p id="asm-dim-err" class="asm-err" role="alert"></p>
  <div class="asm-nav">
    <button class="asm-btn-ghost" id="asm-dim-back">← Back</button>
    <button class="asm-btn-primary" id="asm-dim-fwd">Continue →</button>
  </div>
</div>`;

    wireLikerts(dim.id);
    q('#asm-dim-back').addEventListener('click', () => go(step - 1));
    q('#asm-dim-fwd').addEventListener('click', () => {
      if ((state.dims[dim.id] || []).filter(v => v > 0).length < 4) {
        q('#asm-dim-err').textContent = 'Please rate all 4 statements.'; return;
      }
      go(step + 1);
    });
  }

  // ─── Screen 8 — Context ──────────────────────────────────────────────────────
  function showCtx() {
    root.innerHTML = `<div class="asm-card">
  ${progressBar(8, 9, 'Final context')}
  <h3 class="asm-card-title asm-title-sm">Help us sharpen the result.</h3>
  <p class="asm-card-sub">Optional — these do not affect your score.</p>
  ${CTX_QS.map(cq => `
  <div class="asm-q-block" data-qid="${cq.id}">
    <p class="asm-q-text">${cq.q}</p>
    <div class="asm-opts-list asm-opts-wrap">
      ${cq.opts.map(o => `
      <button class="asm-opt${state.ctx[cq.id] === o ? ' asm-opt-sel' : ''}" data-val="${esc(o)}" role="radio" aria-checked="${state.ctx[cq.id] === o}">
        <span class="asm-radio-dot"></span>${o}
      </button>`).join('')}
    </div>
  </div>`).join('')}
  <div class="asm-nav">
    <button class="asm-btn-ghost" id="asm-ctx-back">← Back</button>
    <button class="asm-btn-primary" id="asm-ctx-fwd">See My Result →</button>
  </div>
</div>`;

    wireListOpts(CTX_QS, state.ctx);
    q('#asm-ctx-back').addEventListener('click', () => go(7));
    q('#asm-ctx-fwd').addEventListener('click', () => { state.scores = calcScores(); go(9); });
  }

  // ─── Screen 9 — Results ──────────────────────────────────────────────────────
  function showResults() {
    const s    = state.scores;
    const band = getBand(s.overall);
    const arch = getArchetype(s);
    const cons = getConstraints(s);
    const risks = getRisks(s);
    const c1 = cons[0], c2 = cons[1];

    root.innerHTML = `<div class="asm-card asm-results">
  <div class="asm-score-hero">
    <div class="asm-score-circle" style="border-color:${band.color}">
      <span class="asm-score-num" style="color:${band.color}">${s.overall}</span>
      <span class="asm-score-denom">/ 100</span>
    </div>
    <div class="asm-score-meta">
      <div class="asm-band-pill" style="background:${band.color}1a;color:${band.color};border-color:${band.color}55">${band.label}</div>
      <div class="asm-arch-tag">${arch.name}</div>
    </div>
  </div>

  <p class="asm-diagnosis-copy">${band.copy}</p>

  <canvas id="asm-radar" class="asm-radar-canvas" aria-label="Radar chart showing your six-dimension engineering readiness scores"></canvas>

  <div class="asm-dim-grid">
    ${DIMS.map(d => `
    <div class="asm-dim-row">
      <span class="asm-dim-name">${d.name.replace('\n', ' ')}</span>
      <div class="asm-dim-track"><span class="asm-dim-fill" style="width:${s[d.id]}%;background:${d.color}"></span></div>
      <span class="asm-dim-score" style="color:${d.color}">${s[d.id]}</span>
    </div>`).join('')}
    ${s.penalty > 0 ? `<p class="asm-penalty-note">Fragility penalty applied: −${s.penalty} pts</p>` : ''}
  </div>

  <div class="asm-result-block">
    <div class="asm-block-label">Top Constraints</div>
    <div class="asm-constraint-row">
      <span class="asm-c-rank">#1</span>
      <span class="asm-c-name">${c1.full}</span>
      <span class="asm-c-score" style="color:${c1.color}">${c1.score} / 100</span>
    </div>
    ${c2 ? `<div class="asm-constraint-row">
      <span class="asm-c-rank">#2</span>
      <span class="asm-c-name">${c2.full}</span>
      <span class="asm-c-score" style="color:${c2.color}">${c2.score} / 100</span>
    </div>` : ''}
  </div>

  ${risks.length ? `<div class="asm-result-block asm-risks-block">
    <div class="asm-block-label">Risk Patterns Detected</div>
    ${risks.map(r => `<div class="asm-risk-row"><span class="asm-risk-icon" aria-hidden="true">⚠</span>${r}</div>`).join('')}
  </div>` : ''}

  <div class="asm-result-block asm-archetype-block">
    <div class="asm-block-label">Your Pattern</div>
    <div class="asm-arch-name">${arch.name}</div>
    <div class="asm-arch-pattern">${arch.pattern}</div>
    <p class="asm-arch-msg">${arch.msg}</p>
  </div>

  <div class="asm-result-block">
    <div class="asm-block-label">Recommended Next Move</div>
    <p>${NEXT_MOVES[c1.id] || 'Focus on your lowest-scoring dimension as the primary constraint before scaling any other initiative.'}</p>
  </div>

  <div class="asm-cta-block">
    <p class="asm-cta-hed">If this result feels uncomfortably accurate — we should talk.</p>
    <button class="asm-btn-cta" id="asm-zoho-submit">
      I want to learn how FlowCraft can help me close this gap →
    </button>
    <p class="asm-cta-note">This shares your diagnostic with our team. We follow up within one business day. No sales pressure.</p>
  </div>
</div>`;

    requestAnimationFrame(() => {
      const canvas = document.getElementById('asm-radar');
      if (canvas) drawRadar(canvas, s);
    });

    q('#asm-zoho-submit').addEventListener('click', () => submitZoho(s));
  }

  // ─── Wiring helpers ──────────────────────────────────────────────────────────
  function wireListOpts(questions, stateObj) {
    questions.forEach(qdef => {
      const id    = qdef.id || qdef.id;
      const block = root.querySelector(`.asm-q-block[data-qid="${id}"]`);
      if (!block) return;
      block.querySelectorAll('.asm-opt').forEach(btn => {
        btn.addEventListener('click', () => {
          block.querySelectorAll('.asm-opt').forEach(b => {
            b.classList.remove('asm-opt-sel'); b.setAttribute('aria-checked', 'false');
          });
          btn.classList.add('asm-opt-sel');
          btn.setAttribute('aria-checked', 'true');
          stateObj[id] = btn.dataset.val;
        });
      });
    });
  }

  function wireLikerts(dimId) {
    root.querySelectorAll('.asm-likert-block').forEach(block => {
      const qi = parseInt(block.dataset.qi);
      block.querySelectorAll('.asm-likert').forEach(btn => {
        btn.addEventListener('click', () => {
          block.querySelectorAll('.asm-likert').forEach(b => {
            b.classList.remove('asm-likert-sel'); b.setAttribute('aria-checked', 'false');
          });
          btn.classList.add('asm-likert-sel');
          btn.setAttribute('aria-checked', 'true');
          if (!state.dims[dimId]) state.dims[dimId] = [0, 0, 0, 0];
          state.dims[dimId][qi] = parseInt(btn.dataset.val);
        });
      });
    });
  }

  // ─── Zoho submission ─────────────────────────────────────────────────────────
  function submitZoho(s) {
    const form = document.getElementById('webform1282748000000601002');
    if (!form) return;
    const set = (name, val) => {
      const el = form.querySelector(`[name="${name}"]`);
      if (el) el.value = val;
    };
    set('Last Name', state.entry.lastName);
    set('Company',   state.entry.company);
    set('Email',     state.entry.email);
    set('Description', buildDesc(s));
    const btn = q('#asm-zoho-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    // form.submit() bypasses onsubmit handler — intentional
    form.submit();
  }

  // ─── Router ──────────────────────────────────────────────────────────────────
  function go(screen) {
    state.screen = screen;
    dispatch();
    if (screen > 0) scrollUp();
  }

  function dispatch() {
    const s = state.screen;
    if      (s === 0)              showEntry();
    else if (s === 1)              showQual();
    else if (s >= 2 && s <= 7)    showDim(s - 2);
    else if (s === 8)              showCtx();
    else if (s === 9)              showResults();
  }

  // ─── Boot ────────────────────────────────────────────────────────────────────
  function init() {
    root = document.getElementById('asm-container');
    if (!root) return;
    dispatch();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
