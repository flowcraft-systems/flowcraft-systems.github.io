/* ─── Flowcraft Deal Sizing Engine v0.1 ────────────────────────────────── */
/* Implements the Flowcraft Deal Sizing Ruleset v0.1                      */
/* Multi-step intake form → scoring → t-shirt size → offer recommendation */

(function () {
  'use strict';

  let currentStep = 1;
  const totalSteps = 4;

  /* ─── Constants ────────────────────────────────────────────────────────── */
  const SERVICE_LINE_LABELS = {
    AI_CODING_OPERATING_MODEL: 'AI Coding Operating Model',
    QA_VELOCITY_SYSTEM: 'QA Velocity System',
    BROWNFIELD_MODERNIZATION_SYSTEM: 'Brownfield Modernization System',
    PROTOTYPE_TO_PRODUCTION_SYSTEM: 'Prototype-to-Production System',
    AI_ENGINEERING_OFFICE: 'AI Engineering Office'
  };

  const OFFER_MAP = {
    AI_CODING_OPERATING_MODEL: 'AI Coding Pilot',
    QA_VELOCITY_SYSTEM: 'QA Velocity Diagnostic',
    BROWNFIELD_MODERNIZATION_SYSTEM: 'Modernization Map',
    PROTOTYPE_TO_PRODUCTION_SYSTEM: 'Prototype Sprint',
    AI_ENGINEERING_OFFICE: 'AI Engineering Baseline'
  };

  const PRODUCT_MAP = {
    AI_CODING_OPERATING_MODEL: 'FlowCraft Skills + Engage',
    QA_VELOCITY_SYSTEM: 'FlowCraft Skills + Tempo',
    BROWNFIELD_MODERNIZATION_SYSTEM: 'FlowCraft Skills + Tempo',
    PROTOTYPE_TO_PRODUCTION_SYSTEM: 'StoryGen + FlowCraft Skills',
    AI_ENGINEERING_OFFICE: 'Engage + Tempo + FlowCraft Skills'
  };

  const DURATION_MAP = {
    XS: '0.5–1 week', S: '2–4 weeks', M: '4–8 weeks',
    L: '8–12 weeks', XL: '3–6+ months'
  };

  const PATH_MAP = {
    AI_CODING_OPERATING_MODEL: 'Install FlowCraft Skills for selected team → run AI Coding Pilot → measure with Engage → define 30/60/90 rollout plan → convert to AI Engineering Office.',
    QA_VELOCITY_SYSTEM: 'Run QA Velocity Diagnostic → pilot AI-assisted test workflows → establish release confidence dashboard → conduct quarterly quality review.',
    BROWNFIELD_MODERNIZATION_SYSTEM: 'Create Modernization Map → run one bounded modernization spike → define partner delivery backlog → keep Flowcraft as advisory layer.',
    PROTOTYPE_TO_PRODUCTION_SYSTEM: 'Use StoryGen to structure requirements → build prototype → produce feasibility report → create MVP productionization backlog.',
    AI_ENGINEERING_OFFICE: 'Create AI Engineering Baseline → attach Engage and Tempo → define pilot portfolio → start monthly operating review cadence.'
  };

  const PRICING = {
    INDIA: {
      diagnostic: { S: [600000, 1000000], M: [1000000, 1800000] },
      pilot:     { S: [1000000, 1800000], M: [1800000, 4000000] },
      retainer:  { advisor: [200000, 400000], operator: [500000, 1000000], fde: [1200000, 2000000] },
      min:       { diagnostic: 600000, pilot: 1000000 },
      currency: '₹'
    },
    US: {
      diagnostic: { S: [12000, 18000], M: [18000, 30000] },
      pilot:     { S: [20000, 35000], M: [35000, 80000] },
      retainer:  { advisor: [4000, 8000], operator: [10000, 20000], fde: [25000, 40000] },
      min:       { diagnostic: 12000, pilot: 20000 },
      currency: '$'
    }
  };

  const DIAGNOSTIC_SIZES = ['XS', 'S'];
  const PILOT_SIZES = ['S', 'M'];
  const LARGE_SIZES = ['L', 'XL'];

  /* ─── Utility ────────────────────────────────────────────────────────── */
  function hasAnyCheckbox(group) {
    if (!group || typeof group !== 'object') return false;
    return Object.values(group).some(v => v === true);
  }

  function countChecked(group) {
    if (!group || typeof group !== 'object') return 0;
    return Object.values(group).filter(v => v === true).length;
  }

  /**
   * Classify service line from primaryGoal dropdown.
   * @param {string} goal
   * @returns {string} service line key
   */
  function classifyFromGoal(goal) {
    if (goal === 'IMPROVE_AI_CODING_ADOPTION') return 'AI_CODING_OPERATING_MODEL';
    if (goal === 'REDUCE_QA_CYCLE_TIME') return 'QA_VELOCITY_SYSTEM';
    if (goal === 'MODERNIZE_LEGACY_SYSTEM') return 'BROWNFIELD_MODERNIZATION_SYSTEM';
    if (goal === 'BUILD_PROTOTYPE') return 'PROTOTYPE_TO_PRODUCTION_SYSTEM';
    if (goal === 'CREATE_AI_ENGINEERING_ROADMAP') return 'AI_ENGINEERING_OFFICE';
    if (goal === 'BUSINESS_WORKFLOW_AUTOMATION' || goal === 'RAG_OR_AGENTIC_APPLICATION') return 'PROTOTYPE_TO_PRODUCTION_SYSTEM';
    return null;
  }

  /* ════════════════════════════════════════════════════════════════════════
     SECTION 3 — DEAL QUALIFICATION (deterministic rules)
     ════════════════════════════════════════════════════════════════════════ */
  function checkDisqualification(data) {
    const issues = [];
    const noOwner = data.accountableOwnerExists === 'no' || data.accountableOwnerExists === 'not_sure'
      || data.accountableOwnerRole === 'NO_CLEAR_OWNER' || data.accountableOwnerRole === 'NOT_SURE';
    if (noOwner) issues.push('no_accountable_business_or_engineering_owner');
    if (data.successMetricKnown === 'no') issues.push('refuses_to_define_success_criteria');
    if (data.budgetRange === 'BELOW_MINIMUM') issues.push('buyer_only_wants_free_advice');
    if (data.sanitizedArtifactsAvailable === 'no') issues.push('no_access_to_required_workflow_or_codebase_or_metrics');
    const dealBreaker = noOwner;

    let weakFitCount = 0;
    const aiTools = data.currentAiTools || {};
    if (aiTools.none || !hasAnyCheckbox(aiTools)) weakFitCount++;
    const evidence = data.evidenceAvailable || {};
    if (evidence.none || !hasAnyCheckbox(evidence)) weakFitCount++;
    if (data.primaryGoal === 'NOT_SURE' || !data.primaryGoal) weakFitCount++;
    if (data.buyerRole && !['CTO', 'VP_ENGINEERING', 'HEAD_OF_ENGINEERING', 'CEO'].includes(data.buyerRole)) weakFitCount++;
    if (!data.currentPainLevel || data.currentPainLevel === 'MILD') weakFitCount++;
    const weakFit = weakFitCount >= 2;
    return { issues, dealBreaker, weakFit, weakFitCount };
  }

  /* ════════════════════════════════════════════════════════════════════════
     SECTION 7 — RISK MULTIPLIER MODEL (deterministic)
     ════════════════════════════════════════════════════════════════════════ */
  function calculateRiskFactors(data) {
    const factors = [];
    const multipliers = [];

    if (data.accountableOwnerExists === 'no' || data.accountableOwnerExists === 'not_sure' ||
        data.accountableOwnerRole === 'NO_CLEAR_OWNER' || data.accountableOwnerRole === 'NOT_SURE') {
      factors.push({ key: 'unclear_business_owner', label: 'Unclear business owner', severity: 'fatal', multiplier: null });
    }
    if (data.successMetricKnown === 'no' || data.successMetricKnown === 'partially') {
      factors.push({ key: 'unclear_success_metric', label: 'Unclear success metric', severity: 'high', multiplier: 1.20 });
      multipliers.push(1.20);
    }
    if (countChecked(data.affectedAreas || {}) >= 3) {
      factors.push({ key: 'fragmented_systems', label: 'Fragmented systems / multiple areas', severity: 'high', multiplier: 1.25 });
      multipliers.push(1.25);
    }
    const cc = data.complianceContext || {};
    if (cc.hipaa || cc.soc2 || cc.gdpr || cc.pci || cc.iso27001) {
      factors.push({ key: 'compliance_burden', label: 'Compliance burden', severity: 'high', multiplier: 1.30 });
      multipliers.push(1.30);
    }
    if (data.productionImpact === 'PRODUCTION_CRITICAL' || data.productionImpact === 'CUSTOMER_FACING') {
      factors.push({ key: 'production_integration_required', label: 'Production integration', severity: 'high', multiplier: 1.30 });
      multipliers.push(1.30);
    }
    if (data.dataSensitivity === 'PII' || data.dataSensitivity === 'REGULATED') {
      factors.push({ key: 'sensitive_data', label: 'Sensitive data involved', severity: 'high', multiplier: 1.25 });
      multipliers.push(1.25);
    }
    if (data.primaryGoal === 'MODERNIZE_LEGACY_SYSTEM') {
      factors.push({ key: 'legacy_codebase_access_required', label: 'Legacy codebase access', severity: 'medium', multiplier: 1.15 });
      multipliers.push(1.15);
    }
    if (data.affectedTeamCount === 'MULTIPLE_DEPARTMENTS') {
      factors.push({ key: 'multiple_departments_involved', label: 'Multiple departments involved', severity: 'medium', multiplier: 1.20 });
      multipliers.push(1.20);
    }
    const ev = data.evidenceAvailable || {};
    if (ev.none || !hasAnyCheckbox(ev)) {
      factors.push({ key: 'no_existing_metrics', label: 'No existing baseline metrics', severity: 'medium', multiplier: 1.10 });
      multipliers.push(1.10);
    }
    return { factors, multipliers };
  }

  function computeCombinedMultiplier(multipliers) {
    if (!multipliers || multipliers.length === 0) return { raw: 1.0, capped: 1.0, triggerUpsize: false };
    const raw = multipliers.reduce((acc, m) => acc * m, 1.0);
    return { raw, capped: Math.min(raw, 1.75), triggerUpsize: raw > 1.75 };
  }

  /* ════════════════════════════════════════════════════════════════════════
     SECTION 8 — DYNAMIC PRICING (deterministic)
     ════════════════════════════════════════════════════════════════════════ */
  function computePriceBand(tShirt, riskMultiplier, market, isDiagnosticMode) {
    const pricing = PRICING[market] || PRICING.US;
    let sizeTier = 'S';
    if (tShirt === 'M' || tShirt === 'L' || tShirt === 'XL') sizeTier = 'M';
    const range = (isDiagnosticMode || tShirt === 'XS')
      ? (pricing.diagnostic[sizeTier] || pricing.diagnostic.S)
      : (pricing.pilot[sizeTier] || pricing.pilot.S);
    const low = Math.round(range[0] * riskMultiplier);
    const high = Math.round(range[1] * riskMultiplier);
    const minDeal = (isDiagnosticMode || tShirt === 'XS') ? pricing.min.diagnostic : pricing.min.pilot;
    const finalLow = Math.max(low, minDeal);
    const finalHigh = Math.max(high, finalLow + 1000);
    const sym = pricing.currency;
    if (market === 'INDIA') {
      if (finalHigh >= 100000) return `${sym}${(finalLow / 100000).toFixed(1)}L–${(finalHigh / 100000).toFixed(1)}L`;
      return `${sym}${finalLow.toLocaleString('en-IN')}–${finalHigh.toLocaleString('en-IN')}`;
    }
    return `${sym}${finalLow.toLocaleString('en-US')}–${finalHigh.toLocaleString('en-US')}`;
  }

  function formatPriceBand(market, tShirt, riskMultiplier, dealBreaker, weakFit) {
    const marketName = market === 'INDIA' ? 'India' : 'US';
    const price = computePriceBand(tShirt, riskMultiplier, market, dealBreaker || weakFit);
    if (dealBreaker) return `${marketName}: ${price} · Paid workshop/diagnostic (pilot not recommended)`;
    if (weakFit) return `${marketName}: ${price} · Recommend readiness workshop (weak fit)`;
    if (LARGE_SIZES.includes(tShirt)) return `${marketName}: ${price} · Risk-adjusted · May require delivery partner`;
    return `${marketName}: ${price} · Risk-adjusted indicative range`;
  }

  /* ════════════════════════════════════════════════════════════════════════
     SECTION 14.3 — CONFIDENCE SCORING (deterministic)
     ════════════════════════════════════════════════════════════════════════ */
  function computeConfidence(data, serviceLine, dealBreaker) {
    if (dealBreaker) return { level: 'fatal', label: 'Fatal', desc: 'Missing owner — do not propose pilot' };
    const hasServiceLine = serviceLine && serviceLine !== 'AI_ENGINEERING_OFFICE';
    const hasOwner = data.accountableOwnerExists === 'yes'
      && !['NO_CLEAR_OWNER', 'NOT_SURE', ''].includes(data.accountableOwnerRole || '');
    const hasMetric = data.successMetricKnown === 'yes';
    const hasClearPain = data.primaryGoal && data.primaryGoal !== 'NOT_SURE';
    if (hasServiceLine && hasOwner && hasMetric) return { level: 'high', label: 'High', desc: 'Clear scope, ownership, and success metric — firm estimate possible' };
    if (hasClearPain && (hasOwner || data.primaryGoal !== 'NOT_SURE')) return { level: 'medium', label: 'Medium', desc: 'Clear pain but missing metrics or scope detail — indicative range' };
    if (!data.primaryGoal || data.primaryGoal === 'NOT_SURE' || (!hasOwner && !hasMetric)) return { level: 'low', label: 'Low', desc: 'Vague ask — recommend AI Engineering Baseline diagnostic' };
    return { level: 'medium', label: 'Medium', desc: 'Partial information — indicative range only' };
  }

  /* ════════════════════════════════════════════════════════════════════════
     MAIN SCORING ENGINE — computeScores(data) -> result object
     ════════════════════════════════════════════════════════════════════════ */
  function computeScores(data) {
    // Section 4: Classification
    let serviceLine = classifyFromGoal(data.primaryGoal) || 'AI_ENGINEERING_OFFICE';
    if (data.primaryTrigger === 'CEO_AI_FIRST_MANDATE') serviceLine = 'AI_ENGINEERING_OFFICE';
    if (countChecked(data.affectedAreas || {}) >= 3) serviceLine = 'AI_ENGINEERING_OFFICE';

    // Section 6.1: Scoring Dimensions
    let scopeClarity = 3;
    if (data.primaryGoal && data.primaryGoal !== 'NOT_SURE' && data.successMetricKnown === 'yes') scopeClarity = 1;
    else if (data.primaryGoal && data.primaryGoal !== 'NOT_SURE' && data.successMetricKnown === 'partially') scopeClarity = 2;
    else if (data.primaryGoal === 'NOT_SURE' || data.successMetricKnown === 'no') scopeClarity = 4;
    if (data.primaryTrigger === 'CEO_AI_FIRST_MANDATE' && data.primaryGoal === 'CREATE_AI_ENGINEERING_ROADMAP') scopeClarity = Math.max(scopeClarity, 4);

    const tMap = { GREENFIELD: 1, EXISTING_APPLICATION: 3, LEGACY_MONOLITH: 5, DISTRIBUTED_SYSTEM: 4, UNKNOWN: 4 };
    const technicalComplexity = tMap[data.systemContext] || 3;

    const dMap = { PUBLIC_OR_SYNTHETIC: 1, INTERNAL: 2, CONFIDENTIAL: 3, PII: 4, REGULATED: 5 };
    let dataCompliance = dMap[data.dataSensitivity] || 3;
    const cc = data.complianceContext || {};
    if (cc.hipaa || cc.gdpr || cc.pci || cc.soc2 || cc.iso27001) dataCompliance = Math.max(dataCompliance, 4);

    const aMap = { ONE_TEAM: 2, TWO_TO_THREE_TEAMS: 3, DEPARTMENT: 4, MULTIPLE_DEPARTMENTS: 5 };
    let adoptionBurden = aMap[data.affectedTeamCount] || 3;
    if (data.primaryTrigger === 'CEO_AI_FIRST_MANDATE') adoptionBurden = Math.max(adoptionBurden, 4);

    const pMap = { WORKSHOP_ONLY: 1, PROTOTYPE_ONLY: 2, INTERNAL_WORKFLOW: 3, CUSTOMER_FACING: 4, PRODUCTION_CRITICAL: 5 };
    const productionCriticality = pMap[data.productionImpact] || 3;

    const totalScore = scopeClarity + technicalComplexity + dataCompliance + adoptionBurden + productionCriticality;

    // Section 6.3: T-Shirt Size
    let tShirt = 'S';
    if (totalScore >= 5 && totalScore <= 8) tShirt = 'XS';
    else if (totalScore >= 9 && totalScore <= 13) tShirt = 'S';
    else if (totalScore >= 14 && totalScore <= 18) tShirt = 'M';
    else if (totalScore >= 19 && totalScore <= 22) tShirt = 'L';
    else if (totalScore >= 23) tShirt = 'XL';

    // Section 6.4: Override Rules
    if (dataCompliance === 5 && DIAGNOSTIC_SIZES.includes(tShirt)) tShirt = 'M';
    if (productionCriticality === 5 && DIAGNOSTIC_SIZES.includes(tShirt)) tShirt = 'M';
    if ((data.affectedTeamCount === 'DEPARTMENT' || data.affectedTeamCount === 'MULTIPLE_DEPARTMENTS') && DIAGNOSTIC_SIZES.includes(tShirt)) tShirt = 'M';
    if (serviceLine === 'BROWNFIELD_MODERNIZATION_SYSTEM' && tShirt === 'XS') tShirt = 'S';

    // Section 3: Qualification
    const qual = checkDisqualification(data);

    // Section 7: Risk Factors
    const { factors: riskFactors, multipliers } = calculateRiskFactors(data);
    const riskMultiplier = computeCombinedMultiplier(multipliers);
    if (riskMultiplier.triggerUpsize) {
      if (tShirt === 'S') tShirt = 'M';
      else if (tShirt === 'M') tShirt = 'L';
    }

    // Entry Offer & Product Attach
    let entryOffer = OFFER_MAP[serviceLine] || 'AI Engineering Baseline';
    if (qual.dealBreaker) entryOffer = 'Paid Alignment Workshop / AI Engineering Baseline';
    else if (qual.weakFit) entryOffer = 'AI Engineering Readiness Workshop';
    else if (scopeClarity >= 4) entryOffer = 'AI Engineering Baseline';
    let productAttach = qual.dealBreaker ? 'Trial license recommended after workshop' : (PRODUCT_MAP[serviceLine] || 'Engage + Tempo');

    // Section 8: Dynamic Pricing — always computes a range
    const market = 'US';
    const appliedMultiplier = qual.dealBreaker ? 1.0 : riskMultiplier.capped;
    const priceBand = formatPriceBand(market, tShirt, appliedMultiplier, qual.dealBreaker, qual.weakFit);

    // Section 14.3: Confidence
    const confidence = computeConfidence(data, serviceLine, qual.dealBreaker);

    // Flags
    const flags = [];
    const flagMap = {
      no_accountable_business_or_engineering_owner: '⚠️ Unclear business or engineering owner',
      refuses_to_define_success_criteria: '⚠️ No success metric defined',
      buyer_only_wants_free_advice: '⚠️ Budget below minimum deal size',
      no_access_to_required_workflow_or_codebase_or_metrics: '⚠️ Limited discovery access — no sanitized artifacts'
    };
    qual.issues.forEach(function (issue) { if (flagMap[issue]) flags.push(flagMap[issue]); });
    if (qual.weakFit) flags.push('💡 Weak-fit signals detected — recommend readiness workshop before pilot');
    if (qual.dealBreaker) flags.push('🚫 Deal breaker — unclear owner; pilot not recommended without sponsorship');
    if (data.primaryGoal === 'MODERNIZE_LEGACY_SYSTEM' && (!data.evidenceAvailable || !data.evidenceAvailable.codebaseAccess)) {
      flags.push('⚠️ No codebase access for modernization scope');
    }
    if (flags.length === 0) flags.push('No flags detected');

    // Section 18: Human Review
    let humanReview = false;
    if (LARGE_SIZES.includes(tShirt)) humanReview = true;
    if (dataCompliance >= 4) humanReview = true;
    if (productionCriticality >= 4) humanReview = true;
    if (qual.dealBreaker) humanReview = true;
    if (data.successMetricKnown !== 'yes') humanReview = true;
    if (data.primaryGoal === 'MODERNIZE_LEGACY_SYSTEM') humanReview = true;
    if (!['CTO', 'VP_ENGINEERING', 'HEAD_OF_ENGINEERING'].includes(data.buyerRole)) humanReview = true;
    if (riskMultiplier.capped > 1.5) humanReview = true;

    // Deal Status
    let dealStatus, dealStatusLabel, dealStatusDesc;
    if (qual.dealBreaker) {
      dealStatus = 'deal_breaker'; dealStatusLabel = 'Deal Breaker';
      dealStatusDesc = 'No clear owner — do not propose pilot. Offer paid workshop or diagnostic.';
    } else if (qual.weakFit) {
      dealStatus = 'weak_fit'; dealStatusLabel = 'Weak Fit';
      dealStatusDesc = 'Weak-fit signals detected. Recommend readiness workshop. Require sponsor and success metric before expansion.';
    } else if (qual.issues.length >= 1) {
      dealStatus = 'restricted'; dealStatusLabel = 'Restricted';
      dealStatusDesc = 'Qualification flags present — proceed with caution; diagnostic recommended.';
    } else {
      dealStatus = 'qualified'; dealStatusLabel = 'Qualified';
      dealStatusDesc = 'Prospect meets qualification criteria — can proceed to proposal.';
    }

    // Duration (risk-adjusted)
    let duration = DURATION_MAP[tShirt] || 'TBD';
    if (riskMultiplier.capped > 1.3 && !qual.dealBreaker) {
      if (tShirt === 'XS' || tShirt === 'S') duration = '3–5 weeks (risk-adjusted)';
      else if (tShirt === 'M') duration = '6–10 weeks (risk-adjusted)';
      else if (tShirt === 'L') duration = '10–14 weeks (risk-adjusted)';
    }

    // Recommended next questions
    const nextQuestions = [];
    if (!data.primaryGoal || data.primaryGoal === 'NOT_SURE') nextQuestions.push('What specific engineering pain are you trying to reduce?');
    if (data.successMetricKnown !== 'yes') nextQuestions.push('What would count as success in 30/60/90 days?');
    if (data.accountableOwnerExists !== 'yes' || data.accountableOwnerRole === 'NO_CLEAR_OWNER') nextQuestions.push('Who is the accountable owner for this initiative?');
    if (data.sanitizedArtifactsAvailable !== 'yes') nextQuestions.push('Can you share sanitized workflow samples, architecture diagrams, or delivery metrics?');
    if (!data.evidenceAvailable || !hasAnyCheckbox(data.evidenceAvailable)) nextQuestions.push('What evidence exists? (Jira, GitHub, test inventory, etc.)');

    return {
      scopeClarity, technicalComplexity, dataCompliance, adoptionBurden, productionCriticality,
      totalScore, tShirt, duration,
      serviceLine, serviceLineLabel: SERVICE_LINE_LABELS[serviceLine] || serviceLine,
      entryOffer, productAttach, priceBand,
      ninetyDayPath: PATH_MAP[serviceLine] || PATH_MAP.AI_ENGINEERING_OFFICE,
      riskFactors, combinedRiskMultiplier: riskMultiplier.capped,
      flags, humanReview,
      dealStatus, dealStatusLabel, dealStatusDesc,
      confidence,
      disqualificationIssues: qual.issues, weakFitDetected: qual.weakFit, dealBreakerDetected: qual.dealBreaker,
      nextQuestions
    };
  }

  /* ─── Render Results ─────────────────────────────────────────────────── */
  function renderResults(scores) {
    document.getElementById('resultTotalScore').textContent = scores.totalScore;
    document.getElementById('resultTShirt').textContent = scores.tShirt;
    document.getElementById('resultDuration').textContent = scores.duration;
    document.getElementById('resultServiceLine').textContent = scores.serviceLineLabel;
    document.getElementById('resultEntryOffer').textContent = scores.entryOffer;
    document.getElementById('resultProductAttach').textContent = 'Attach: ' + scores.productAttach;
    document.getElementById('resultPriceBand').textContent = scores.priceBand;
    document.getElementById('resultNinetyDayPath').textContent = scores.ninetyDayPath;

    // Deal status
    var statusCard = document.getElementById('resultDealStatusCard');
    document.getElementById('resultDealStatus').textContent = scores.dealStatusLabel;
    document.getElementById('resultDealStatusDesc').textContent = scores.dealStatusDesc;
    statusCard.className = 'deal-result-card deal-result-card--status';
    if (scores.dealBreakerDetected) statusCard.classList.add('deal-result-card--dealbreaker');
    else if (scores.weakFitDetected) statusCard.classList.add('deal-result-card--weakfit');
    else if (scores.dealStatus === 'restricted') statusCard.classList.add('deal-result-card--weakfit');
    else statusCard.classList.add('deal-result-card--qualified');

    // Confidence
    var confCard = document.getElementById('resultConfidenceCard');
    document.getElementById('resultConfidence').textContent = scores.confidence.label;
    document.getElementById('resultConfidenceDesc').textContent = scores.confidence.desc;
    confCard.className = 'deal-result-card deal-result-card--confidence';
    confCard.classList.add('deal-result-card--conf-' + scores.confidence.level);

    // Score bars
    setBar('resultScopeClarity', 'resultScopeClarityVal', scores.scopeClarity);
    setBar('resultTechComplexity', 'resultTechComplexityVal', scores.technicalComplexity);
    setBar('resultDataCompliance', 'resultDataComplianceVal', scores.dataCompliance);
    setBar('resultAdoptionBurden', 'resultAdoptionBurdenVal', scores.adoptionBurden);
    setBar('resultProductionCriticality', 'resultProductionCriticalityVal', scores.productionCriticality);

    // Risk factors
    var riskEl = document.getElementById('resultRiskFactors');
    var active = scores.riskFactors.filter(function (f) { return f.multiplier !== null; });
    if (active.length === 0) {
      riskEl.innerHTML = '<span class="deal-flag">No significant risk factors detected</span>';
      document.getElementById('resultRiskMultiplier').textContent = '1.00× (none)';
    } else {
      riskEl.innerHTML = active.map(function (f) {
        var cls = f.severity === 'high' ? 'deal-flag--high' : 'deal-flag--medium';
        return '<span class="deal-flag ' + cls + '">' + f.label + ' · ' + f.multiplier.toFixed(2) + '×</span>';
      }).join('');
      document.getElementById('resultRiskMultiplier').textContent = scores.combinedRiskMultiplier.toFixed(2) + '× combined';
    }

    // Flags
    document.getElementById('resultFlags').innerHTML = scores.flags.map(function (f) {
      return '<span class="deal-flag">' + f + '</span>';
    }).join('');

    // Next questions
    var nqEl = document.getElementById('resultNextQuestions');
    if (scores.nextQuestions.length === 0) {
      nqEl.innerHTML = '<span class="deal-flag">Sufficient information for initial assessment</span>';
    } else {
      nqEl.innerHTML = scores.nextQuestions.map(function (q) {
        return '<span class="deal-flag deal-flag--question">→ ' + q + '</span>';
      }).join('');
    }

    // Human review
    var hrEl = document.getElementById('resultHumanReviewText');
    var hrCard = document.getElementById('resultHumanReview');
    if (scores.humanReview) {
      hrEl.textContent = 'Yes — a Flowcraft reviewer must approve this estimate';
      hrCard.classList.add('deal-result-card--alert');
    } else {
      hrEl.textContent = 'No — can proceed to automated proposal generation';
      hrCard.classList.remove('deal-result-card--alert');
    }

    // Show results
    document.querySelectorAll('.deal-step-panel').forEach(function (p) { p.classList.remove('active'); });
    var resultsEl = document.getElementById('dealResults');
    resultsEl.hidden = false;
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.querySelectorAll('.deal-step').forEach(function (s) { s.classList.remove('active'); });
    var lastStep = document.querySelector('.deal-step[data-step="5"]');
    if (lastStep) lastStep.classList.add('active');
  }

  function setBar(barId, valId, score) {
    var bar = document.getElementById(barId);
    var val = document.getElementById(valId);
    if (bar) bar.style.width = (score / 5 * 100) + '%';
    if (val) val.textContent = score;
  }

  /* ─── Zoho CRM Submission ────────────────────────────────────────────── */
  function submitToZoho(data, scores) {
    var zohoForm = document.getElementById('dealWebformZoho');
    if (!zohoForm) return;
    var payload = {
      version: 'v0.1', submitted: new Date().toISOString(),
      intake: {
        prospect: { companyName: data.companyName || '', prospectName: data.prospectName || '', workEmail: data.workEmail || '', buyerRole: data.buyerRole || '', accountableOwnerExists: data.accountableOwnerExists || '', accountableOwnerRole: data.accountableOwnerRole || '' },
        problem: { primaryTrigger: data.primaryTrigger || '', primaryGoal: data.primaryGoal || '', freeTextAsk: data.freeTextAsk || '', affectedAreas: data.affectedAreas || {}, successMetricKnown: data.successMetricKnown || '', successMetricDescription: data.successMetricDescription || '', currentPainLevel: data.currentPainLevel || '' },
        context: { engineeringTeamSize: data.engineeringTeamSize || '', affectedTeamCount: data.affectedTeamCount || '', systemContext: data.systemContext || '', productionImpact: data.productionImpact || '', dataSensitivity: data.dataSensitivity || '', complianceContext: data.complianceContext || {}, currentAiTools: data.currentAiTools || {}, evidenceAvailable: data.evidenceAvailable || {}, sanitizedArtifactsAvailable: data.sanitizedArtifactsAvailable || '' },
        commercial: { desiredTimeline: data.desiredTimeline || '', budgetRange: data.budgetRange || '', preferredEngagementModel: data.preferredEngagementModel || '', interestedInRecurringReviews: data.interestedInRecurringReviews || '', interestedInProductLicensing: data.interestedInProductLicensing || '' }
      },
      computed: {
        scores: { scopeClarity: scores.scopeClarity, technicalComplexity: scores.technicalComplexity, dataCompliance: scores.dataCompliance, adoptionBurden: scores.adoptionBurden, productionCriticality: scores.productionCriticality, totalScore: scores.totalScore },
        classification: { tShirtSize: scores.tShirt, duration: scores.duration, serviceLine: scores.serviceLine, serviceLineLabel: scores.serviceLineLabel, dealStatus: scores.dealStatus },
        risk: { combinedMultiplier: scores.combinedRiskMultiplier, factors: scores.riskFactors.map(function (f) { return { key: f.key, severity: f.severity, multiplier: f.multiplier }; }) },
        recommendations: { entryOffer: scores.entryOffer, productAttach: scores.productAttach, priceBand: scores.priceBand, ninetyDayPath: scores.ninetyDayPath },
        confidence: scores.confidence, humanReviewRequired: scores.humanReview,
        disqualificationIssues: scores.disqualificationIssues, weakFitDetected: scores.weakFitDetected, dealBreakerDetected: scores.dealBreakerDetected
      }
    };
    document.getElementById('deal_Last_Name').value = data.prospectName || '';
    document.getElementById('deal_Company').value = data.companyName || '';
    document.getElementById('deal_Email').value = data.workEmail || '';
    document.getElementById('deal_Description').value = JSON.stringify(payload, null, 2);
    zohoForm.submit();
  }

  /* ─── Handle Form Submission ─────────────────────────────────────────── */
  function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep(4)) return;
    var data = getFormData();
    var scores = computeScores(data);
    if (typeof gtag === 'function') {
      gtag('event', 'deal_sizing_complete', {
        t_shirt_size: scores.tShirt, service_line: scores.serviceLine,
        deal_status: scores.dealStatus, confidence: scores.confidence.level,
        human_review_required: scores.humanReview
      });
    }
    renderResults(scores);
    submitToZoho(data, scores);
  }

  /* ─── INIT helpers ───────────────────────────────────────────────────── */
  function getFormData() {
    var form = document.getElementById('dealForm');
    var fd = new FormData(form);
    var checkboxGroups = ['affectedAreas', 'complianceContext', 'currentAiTools', 'evidenceAvailable'];
    var data = {};
    for (var entry of fd.entries()) {
      var key = entry[0], val = entry[1];
      if (checkboxGroups.indexOf(key) !== -1) {
        if (!data[key]) data[key] = {};
        data[key][val] = true;
      } else {
        data[key] = val;
      }
    }
    checkboxGroups.forEach(function (g) { if (!data[g]) data[g] = {}; });
    return data;
  }

  function goToStep(step) {
    if (step < 1 || step > totalSteps) return;
    document.querySelectorAll('.deal-step-panel').forEach(function (p) { p.classList.remove('active'); });
    document.querySelectorAll('.deal-step').forEach(function (s) { s.classList.remove('active'); });
    var tp = document.querySelector('.deal-step-panel[data-panel="' + step + '"]');
    if (tp) tp.classList.add('active');
    var ts = document.querySelector('.deal-step[data-step="' + step + '"]');
    if (ts) ts.classList.add('active');
    currentStep = step;
    document.querySelector('.deal-form-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validateStep(step) {
    var panel = document.querySelector('.deal-step-panel[data-panel="' + step + '"]');
    if (!panel) return true;
    var required = panel.querySelectorAll('[required]');
    var valid = true;
    var firstInvalid = [];
    required.forEach(function (field) {
      field.classList.remove('deal-input--error', 'deal-select--error');
      var label = (panel.querySelector('[for="' + field.id + '"]')) ? panel.querySelector('[for="' + field.id + '"]').textContent.trim() : field.name;
      if (field.type === 'radio') {
        var checked = panel.querySelector('input[type="radio"][name="' + field.name + '"]:checked');
        if (!checked) { valid = false; if (!firstInvalid.length) firstInvalid.push(label); }
        return;
      }
      if (!field.value || field.value.trim() === '') {
        valid = false; field.classList.add('deal-input--error');
        if (!firstInvalid.length) firstInvalid.push(label);
      } else if (field.minLength && field.value.trim().length < field.minLength) {
        valid = false; field.classList.add('deal-input--error');
        if (!firstInvalid.length) firstInvalid.push(label + ' (min ' + field.minLength + ' chars)');
      }
    });
    if (!valid && firstInvalid.length) {
      var existing = panel.querySelector('.deal-step-error');
      if (existing) existing.remove();
      var msg = document.createElement('p');
      msg.className = 'deal-step-error';
      msg.textContent = 'Please fill in: ' + firstInvalid[0];
      panel.querySelector('.deal-nav-buttons').before(msg);
    }
    return valid;
  }

  function initCharCounter() {
    var textarea = document.getElementById('freeTextAsk');
    var counter = document.getElementById('freeTextCharCount');
    if (!textarea || !counter) return;
    textarea.addEventListener('input', function () {
      var len = this.value.length;
      counter.textContent = len + ' / 30 min';
      counter.style.color = len >= 30 ? 'var(--green)' : len >= 20 ? 'var(--amber)' : 'var(--text-muted)';
    });
  }

  function initConditionalFields() {
    var radios = document.querySelectorAll('input[type="radio"][name="successMetricKnown"]');
    var target = document.getElementById('successMetricField');
    if (!target) return;
    function toggle() {
      var checked = document.querySelector('input[type="radio"][name="successMetricKnown"]:checked');
      target.style.display = (checked && checked.value === 'yes') ? 'block' : 'none';
    }
    radios.forEach(function (r) { r.addEventListener('change', toggle); });
    toggle();
  }

  function initErrorClear() {
    document.querySelectorAll('.deal-input, .deal-select').forEach(function (el) {
      el.addEventListener('input', function () {
        this.classList.remove('deal-input--error', 'deal-select--error');
        var panel = this.closest('.deal-step-panel');
        if (panel) { var err = panel.querySelector('.deal-step-error'); if (err) err.remove(); }
      });
    });
  }

  function init() {
    var form = document.getElementById('dealForm');
    if (!form) return; // Not on the deal-sizing page (e.g. test page)

    document.querySelectorAll('.deal-next').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = parseInt(this.dataset.next);
        if (validateStep(currentStep)) goToStep(next);
      });
    });
    document.querySelectorAll('.deal-prev').forEach(function (btn) {
      btn.addEventListener('click', function () { goToStep(parseInt(this.dataset.prev)); });
    });
    form.addEventListener('submit', handleSubmit);
    initCharCounter();
    initConditionalFields();
    initErrorClear();
    document.querySelectorAll('.deal-step-panel input, .deal-step-panel select').forEach(function (el) {
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var nextBtn = this.closest('.deal-step-panel').querySelector('.deal-next');
          if (nextBtn) nextBtn.click();
        }
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  /* ─── Expose for testing ────────────────────────────────────────────── */
  window.__dealSizing = {
    computeScores: computeScores,
    checkDisqualification: checkDisqualification,
    calculateRiskFactors: calculateRiskFactors,
    computeCombinedMultiplier: computeCombinedMultiplier,
    computePriceBand: computePriceBand,
    formatPriceBand: formatPriceBand,
    computeConfidence: computeConfidence,
    hasAnyCheckbox: hasAnyCheckbox,
    countChecked: countChecked,
    classifyFromGoal: classifyFromGoal,
    PRICING: PRICING
  };

})();