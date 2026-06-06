/* ─── Flowcraft Deal Sizing Engine ─────────────────────────────────────── */
/* Implements the Flowcraft Deal Sizing Ruleset v0.1                      */
/* Multi-step intake form → scoring → t-shirt size → offer recommendation */

(function () {
  'use strict';

  /* ─── State ──────────────────────────────────────────────────────────── */
  let currentStep = 1;
  const totalSteps = 4;

  /* ─── Utility: get form values as a flat object ──────────────────────── */
  function getFormData() {
    const form = document.getElementById('dealForm');
    const fd = new FormData(form);

    // Checkboxes (multi-select) — collect into arrays
    const checkboxGroups = ['affectedAreas', 'complianceContext', 'currentAiTools', 'evidenceAvailable'];

    const data = {};
    for (const [key, val] of fd.entries()) {
      if (checkboxGroups.includes(key)) {
        if (!data[key]) data[key] = {};
        data[key][val] = true;
      } else {
        data[key] = val;
      }
    }

    // Ensure checkbox group objects exist even if none checked
    checkboxGroups.forEach((g) => { if (!data[g]) data[g] = {}; });

    return data;
  }

  /* ─── Step Progression ───────────────────────────────────────────────── */
  function goToStep(step) {
    if (step < 1 || step > totalSteps) return;

    const panels = document.querySelectorAll('.deal-step-panel');
    const steps = document.querySelectorAll('.deal-step');

    panels.forEach((p) => p.classList.remove('active'));
    steps.forEach((s) => s.classList.remove('active'));

    const targetPanel = document.querySelector(`.deal-step-panel[data-panel="${step}"]`);
    if (targetPanel) targetPanel.classList.add('active');

    const targetStep = document.querySelector(`.deal-step[data-step="${step}"]`);
    if (targetStep) targetStep.classList.add('active');

    currentStep = step;

    // Scroll to top of form
    document.querySelector('.deal-form-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ─── Validate current step before advancing ─────────────────────────── */
  function validateStep(step) {
    const panel = document.querySelector(`.deal-step-panel[data-panel="${step}"]`);
    if (!panel) return true;

    const requiredFields = panel.querySelectorAll('[required]');
    let valid = true;
    const firstInvalid = [];

    requiredFields.forEach((field) => {
      field.classList.remove('deal-input--error', 'deal-select--error');
      const label = panel.querySelector(`[for="${field.id}"]`)?.textContent?.trim() || field.name;

      if (field.type === 'radio') {
        const name = field.name;
        const checked = panel.querySelector(`input[type="radio"][name="${name}"]:checked`);
        if (!checked) {
          valid = false;
          if (!firstInvalid.length) firstInvalid.push(label);
        }
        return;
      }

      if (!field.value || field.value.trim() === '') {
        valid = false;
        field.classList.add('deal-input--error');
        if (!firstInvalid.length) firstInvalid.push(label);
      } else if (field.minLength && field.value.trim().length < field.minLength) {
        valid = false;
        field.classList.add('deal-input--error');
        if (!firstInvalid.length) firstInvalid.push(label + ` (min ${field.minLength} chars)`);
      }
    });

    if (!valid && firstInvalid.length) {
      // Show a subtle inline message
      const existing = panel.querySelector('.deal-step-error');
      if (existing) existing.remove();

      const msg = document.createElement('p');
      msg.className = 'deal-step-error';
      msg.textContent = `Please fill in: ${firstInvalid[0]}`;
      panel.querySelector('.deal-nav-buttons').before(msg);
    }

    return valid;
  }

  /* ─── Scoring Engine ─────────────────────────────────────────────────── */
  function computeScores(data) {
    // 1. Scope Clarity
    let scopeClarity = 3;
    if (data.primaryGoal && data.primaryGoal !== 'NOT_SURE' && data.successMetricKnown === 'yes') {
      scopeClarity = 1;
    } else if (data.primaryGoal && data.primaryGoal !== 'NOT_SURE' && data.successMetricKnown === 'partially') {
      scopeClarity = 2;
    } else if (data.primaryGoal === 'NOT_SURE' || data.successMetricKnown === 'no') {
      scopeClarity = 4;
    }
    if (data.primaryTrigger === 'CEO_AI_FIRST_MANDATE' && data.primaryGoal === 'CREATE_AI_ENGINEERING_ROADMAP') {
      scopeClarity = Math.max(scopeClarity, 4);
    }

    // 2. Technical Complexity
    const techMap = {
      GREENFIELD: 1,
      EXISTING_APPLICATION: 3,
      LEGACY_MONOLITH: 5,
      DISTRIBUTED_SYSTEM: 4,
      UNKNOWN: 4
    };
    const technicalComplexity = techMap[data.systemContext] || 3;

    // 3. Data Compliance Risk
    const dataMap = {
      PUBLIC_OR_SYNTHETIC: 1,
      INTERNAL: 2,
      CONFIDENTIAL: 3,
      PII: 4,
      REGULATED: 5
    };
    let dataCompliance = dataMap[data.dataSensitivity] || 3;
    const cc = data.complianceContext || {};
    if (cc.hipaa || cc.gdpr || cc.pci || cc.soc2 || cc.iso27001) {
      dataCompliance = Math.max(dataCompliance, 4);
    }

    // 4. Adoption Change Burden
    const adoptionMap = {
      ONE_TEAM: 2,
      TWO_TO_THREE_TEAMS: 3,
      DEPARTMENT: 4,
      MULTIPLE_DEPARTMENTS: 5
    };
    let adoptionBurden = adoptionMap[data.affectedTeamCount] || 3;
    if (data.primaryTrigger === 'CEO_AI_FIRST_MANDATE') {
      adoptionBurden = Math.max(adoptionBurden, 4);
    }

    // 5. Production Criticality
    const prodMap = {
      WORKSHOP_ONLY: 1,
      PROTOTYPE_ONLY: 2,
      INTERNAL_WORKFLOW: 3,
      CUSTOMER_FACING: 4,
      PRODUCTION_CRITICAL: 5
    };
    const productionCriticality = prodMap[data.productionImpact] || 3;

    // Total
    const totalScore = scopeClarity + technicalComplexity + dataCompliance + adoptionBurden + productionCriticality;

    // T-Shirt Size
    let tShirt = 'S';
    if (totalScore >= 5 && totalScore <= 8) tShirt = 'XS';
    else if (totalScore >= 9 && totalScore <= 13) tShirt = 'S';
    else if (totalScore >= 14 && totalScore <= 18) tShirt = 'M';
    else if (totalScore >= 19 && totalScore <= 22) tShirt = 'L';
    else if (totalScore >= 23) tShirt = 'XL';

    // Override rules
    if (dataCompliance === 5 && ['XS', 'S'].includes(tShirt)) tShirt = 'M';
    if (productionCriticality === 5 && ['XS', 'S'].includes(tShirt)) tShirt = 'M';
    if ((data.affectedTeamCount === 'DEPARTMENT' || data.affectedTeamCount === 'MULTIPLE_DEPARTMENTS') && ['XS', 'S'].includes(tShirt)) tShirt = 'M';

    // Duration
    const durationMap = {
      XS: '0.5–1 week',
      S: '2–4 weeks',
      M: '4–8 weeks',
      L: '8–12 weeks',
      XL: '3–6+ months'
    };

    // Service Line Detection
    let serviceLine = 'AI_ENGINEERING_OFFICE';
    const goal = data.primaryGoal;
    if (goal === 'IMPROVE_AI_CODING_ADOPTION') serviceLine = 'AI_CODING_OPERATING_MODEL';
    else if (goal === 'REDUCE_QA_CYCLE_TIME') serviceLine = 'QA_VELOCITY_SYSTEM';
    else if (goal === 'MODERNIZE_LEGACY_SYSTEM') serviceLine = 'BROWNFIELD_MODERNIZATION_SYSTEM';
    else if (goal === 'BUILD_PROTOTYPE') serviceLine = 'PROTOTYPE_TO_PRODUCTION_SYSTEM';
    else if (goal === 'CREATE_AI_ENGINEERING_ROADMAP') serviceLine = 'AI_ENGINEERING_OFFICE';
    else if (goal === 'BUSINESS_WORKFLOW_AUTOMATION' || goal === 'RAG_OR_AGENTIC_APPLICATION') serviceLine = 'PROTOTYPE_TO_PRODUCTION_SYSTEM';

    if (data.primaryTrigger === 'CEO_AI_FIRST_MANDATE') serviceLine = 'AI_ENGINEERING_OFFICE';

    const areas = data.affectedAreas || {};
    let areaCount = 0;
    Object.keys(areas).forEach((k) => { if (areas[k]) areaCount++; });
    if (areaCount >= 3) serviceLine = 'AI_ENGINEERING_OFFICE';

    // Entry Offer
    const offerMap = {
      AI_CODING_OPERATING_MODEL: 'AI Coding Pilot',
      QA_VELOCITY_SYSTEM: 'QA Velocity Diagnostic',
      BROWNFIELD_MODERNIZATION_SYSTEM: 'Modernization Map',
      PROTOTYPE_TO_PRODUCTION_SYSTEM: 'Prototype Sprint',
      AI_ENGINEERING_OFFICE: 'AI Engineering Baseline'
    };
    let entryOffer = offerMap[serviceLine] || 'AI Engineering Baseline';
    if (scopeClarity >= 4) entryOffer = 'AI Engineering Baseline';
    if (data.accountableOwnerExists !== 'yes' || data.accountableOwnerRole === 'NO_CLEAR_OWNER' || data.accountableOwnerRole === 'NOT_SURE') {
      entryOffer = 'Paid Alignment Workshop / AI Engineering Baseline';
    }

    // Product Attach
    const productMap = {
      AI_CODING_OPERATING_MODEL: 'FlowCraft Skills + Engage',
      QA_VELOCITY_SYSTEM: 'FlowCraft Skills + Tempo',
      BROWNFIELD_MODERNIZATION_SYSTEM: 'FlowCraft Skills + Tempo',
      PROTOTYPE_TO_PRODUCTION_SYSTEM: 'StoryGen + FlowCraft Skills',
      AI_ENGINEERING_OFFICE: 'Engage + Tempo + FlowCraft Skills'
    };

    // Price Band
    const priceMap = {
      XS: 'Workshop / readiness scan: custom low-scope pricing',
      S: 'India: ₹6L–18L · US: $12k–$35k (diagnostic vs pilot)',
      M: 'India: ₹18L–40L · US: $35k–$80k (scope dependent)',
      L: 'Likely ₹40L+ / $80k+ · Route as Flowcraft advisory + delivery partner',
      XL: 'Transformation program · Requires custom scoping and partner delivery'
    };

    // 90-Day Path
    const pathMap = {
      AI_CODING_OPERATING_MODEL: 'Install FlowCraft Skills for selected team → run AI Coding Pilot → measure with Engage → define 30/60/90 rollout plan → convert to AI Engineering Office.',
      QA_VELOCITY_SYSTEM: 'Run QA Velocity Diagnostic → pilot AI-assisted test workflows → establish release confidence dashboard → conduct quarterly quality review.',
      BROWNFIELD_MODERNIZATION_SYSTEM: 'Create Modernization Map → run one bounded modernization spike → define partner delivery backlog → keep Flowcraft as advisory layer.',
      PROTOTYPE_TO_PRODUCTION_SYSTEM: 'Use StoryGen to structure requirements → build prototype → produce feasibility report → create MVP productionization backlog.',
      AI_ENGINEERING_OFFICE: 'Create AI Engineering Baseline → attach Engage and Tempo → define pilot portfolio → start monthly operating review cadence.'
    };

    // Disqualification Flags
    const flags = [];
    if (data.accountableOwnerExists === 'no' || data.accountableOwnerExists === 'not_sure' ||
        data.accountableOwnerRole === 'NO_CLEAR_OWNER' || data.accountableOwnerRole === 'NOT_SURE') {
      flags.push('⚠️ Unclear business or engineering owner');
    }
    if (data.successMetricKnown === 'no') {
      flags.push('⚠️ No success metric defined');
    }
    if (data.sanitizedArtifactsAvailable === 'no') {
      flags.push('⚠️ Limited discovery access — no sanitized artifacts');
    }
    if (data.budgetRange === 'BELOW_MINIMUM') {
      flags.push('⚠️ Below minimum deal size');
    }
    if (data.primaryGoal === 'MODERNIZE_LEGACY_SYSTEM' && (!data.evidenceAvailable || !data.evidenceAvailable.codebaseAccess)) {
      flags.push('⚠️ No codebase access for modernization scope');
    }
    if (data.primaryGoal === 'NOT_SURE' && (!data.primaryTrigger || data.primaryTrigger === 'OTHER')) {
      flags.push('💡 Vague ask — recommend AI Engineering Baseline diagnostic');
    }

    // Human Review
    let humanReview = false;
    if (['L', 'XL'].includes(tShirt)) humanReview = true;
    if (dataCompliance >= 4) humanReview = true;
    if (productionCriticality >= 4) humanReview = true;
    if (data.accountableOwnerExists !== 'yes' || data.accountableOwnerRole === 'NO_CLEAR_OWNER' || data.accountableOwnerRole === 'NOT_SURE') humanReview = true;
    if (data.successMetricKnown !== 'yes') humanReview = true;
    if (data.primaryGoal === 'MODERNIZE_LEGACY_SYSTEM') humanReview = true;
    if (!['CTO', 'VP_ENGINEERING', 'HEAD_OF_ENGINEERING'].includes(data.buyerRole)) humanReview = true;

    return {
      scopeClarity,
      technicalComplexity,
      dataCompliance,
      adoptionBurden,
      productionCriticality,
      totalScore,
      tShirt,
      duration: durationMap[tShirt] || 'TBD',
      serviceLine,
      serviceLineLabel: formatServiceLine(serviceLine),
      entryOffer,
      productAttach: productMap[serviceLine] || 'Engage + Tempo',
      priceBand: priceMap[tShirt] || 'TBD',
      ninetyDayPath: pathMap[serviceLine] || pathMap.AI_ENGINEERING_OFFICE,
      flags: flags.length ? flags : ['None detected from form inputs.'],
      humanReview
    };
  }

  function formatServiceLine(sl) {
    const map = {
      AI_CODING_OPERATING_MODEL: 'AI Coding Operating Model',
      QA_VELOCITY_SYSTEM: 'QA Velocity System',
      BROWNFIELD_MODERNIZATION_SYSTEM: 'Brownfield Modernization System',
      PROTOTYPE_TO_PRODUCTION_SYSTEM: 'Prototype-to-Production System',
      AI_ENGINEERING_OFFICE: 'AI Engineering Office'
    };
    return map[sl] || sl;
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

    // Score bars
    setBar('resultScopeClarity', 'resultScopeClarityVal', scores.scopeClarity);
    setBar('resultTechComplexity', 'resultTechComplexityVal', scores.technicalComplexity);
    setBar('resultDataCompliance', 'resultDataComplianceVal', scores.dataCompliance);
    setBar('resultAdoptionBurden', 'resultAdoptionBurdenVal', scores.adoptionBurden);
    setBar('resultProductionCriticality', 'resultProductionCriticalityVal', scores.productionCriticality);

    // Flags
    const flagsEl = document.getElementById('resultFlags');
    flagsEl.innerHTML = scores.flags.map((f) => `<span class="deal-flag">${f}</span>`).join('');

    // Human review
    const hrEl = document.getElementById('resultHumanReviewText');
    const hrCard = document.getElementById('resultHumanReview');
    if (scores.humanReview) {
      hrEl.textContent = 'Yes — a Flowcraft reviewer must approve this estimate';
      hrCard.classList.add('deal-result-card--alert');
    } else {
      hrEl.textContent = 'No — this can proceed to automated proposal generation';
      hrCard.classList.remove('deal-result-card--alert');
    }

    // Show results — hide the form panels first
    const panels = document.querySelectorAll('.deal-step-panel');
    panels.forEach((p) => p.classList.remove('active'));

    const resultsEl = document.getElementById('dealResults');
    resultsEl.hidden = false;
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Update step indicators
    const steps = document.querySelectorAll('.deal-step');
    steps.forEach((s) => s.classList.remove('active'));
    const lastStep = document.querySelector('.deal-step[data-step="5"]');
    if (lastStep) lastStep.classList.add('active');
  }

  function setBar(barId, valId, score) {
    const pct = (score / 5) * 100;
    const bar = document.getElementById(barId);
    const val = document.getElementById(valId);
    if (bar) bar.style.width = pct + '%';
    if (val) val.textContent = score;
  }

  /* ─── Zoho CRM Submission ────────────────────────────────────────────── */
  function submitToZoho(data, scores) {
    const zohoForm = document.getElementById('dealWebformZoho');
    if (!zohoForm) return;

    // Build a comprehensive JSON payload with raw intake + computed scores
    const payload = {
      version: 'v0.1',
      submitted: new Date().toISOString(),
      intake: {
        prospect: {
          companyName: data.companyName || '',
          prospectName: data.prospectName || '',
          workEmail: data.workEmail || '',
          buyerRole: data.buyerRole || '',
          accountableOwnerExists: data.accountableOwnerExists || '',
          accountableOwnerRole: data.accountableOwnerRole || ''
        },
        problem: {
          primaryTrigger: data.primaryTrigger || '',
          primaryGoal: data.primaryGoal || '',
          freeTextAsk: data.freeTextAsk || '',
          affectedAreas: data.affectedAreas || {},
          successMetricKnown: data.successMetricKnown || '',
          successMetricDescription: data.successMetricDescription || '',
          currentPainLevel: data.currentPainLevel || ''
        },
        context: {
          engineeringTeamSize: data.engineeringTeamSize || '',
          affectedTeamCount: data.affectedTeamCount || '',
          systemContext: data.systemContext || '',
          productionImpact: data.productionImpact || '',
          dataSensitivity: data.dataSensitivity || '',
          complianceContext: data.complianceContext || {},
          currentAiTools: data.currentAiTools || {},
          evidenceAvailable: data.evidenceAvailable || {},
          sanitizedArtifactsAvailable: data.sanitizedArtifactsAvailable || ''
        },
        commercial: {
          desiredTimeline: data.desiredTimeline || '',
          budgetRange: data.budgetRange || '',
          preferredEngagementModel: data.preferredEngagementModel || '',
          interestedInRecurringReviews: data.interestedInRecurringReviews || '',
          interestedInProductLicensing: data.interestedInProductLicensing || ''
        }
      },
      computed: {
        scopeClarityScore: scores.scopeClarity,
        technicalComplexityScore: scores.technicalComplexity,
        dataComplianceRiskScore: scores.dataCompliance,
        adoptionChangeBurdenScore: scores.adoptionBurden,
        productionCriticalityScore: scores.productionCriticality,
        totalSizingScore: scores.totalScore,
        tShirtSize: scores.tShirt,
        detectedServiceLine: scores.serviceLine,
        detectedServiceLineLabel: scores.serviceLineLabel,
        recommendedEntryOffer: scores.entryOffer,
        recommendedProductAttach: scores.productAttach,
        indicativePriceBand: scores.priceBand,
        recommendedNinetyDayPath: scores.ninetyDayPath,
        disqualificationFlags: scores.flags,
        humanReviewRequired: scores.humanReview
      }
    };

    // Populate the hidden Zoho form fields
    document.getElementById('deal_Last_Name').value = data.prospectName || '';
    document.getElementById('deal_Company').value = data.companyName || '';
    document.getElementById('deal_Email').value = data.workEmail || '';
    document.getElementById('deal_Description').value = JSON.stringify(payload, null, 2);

    // Submit to Zoho via the hidden iframe
    zohoForm.submit();
  }

  /* ─── Handle Form Submission ─────────────────────────────────────────── */
  function handleSubmit(e) {
    e.preventDefault();

    // Validate step 4
    if (!validateStep(4)) return;

    const data = getFormData();
    const scores = computeScores(data);

    // Fire GA4 event
    if (typeof gtag === 'function') {
      gtag('event', 'deal_sizing_complete', {
        t_shirt_size: scores.tShirt,
        service_line: scores.serviceLine,
        human_review_required: scores.humanReview
      });
    }

    renderResults(scores);

    // Submit lead to Zoho CRM after results are shown
    submitToZoho(data, scores);
  }

  /* ─── Character Counter ──────────────────────────────────────────────── */
  function initCharCounter() {
    const textarea = document.getElementById('freeTextAsk');
    const counter = document.getElementById('freeTextCharCount');
    if (!textarea || !counter) return;

    textarea.addEventListener('input', function () {
      const len = this.value.length;
      counter.textContent = `${len} / 30 min`;
      counter.style.color = len >= 30 ? 'var(--green)' : len >= 20 ? 'var(--amber)' : 'var(--text-muted)';
    });
  }

  /* ─── Conditional Field Visibility ───────────────────────────────────── */
  function initConditionalFields() {
    const radios = document.querySelectorAll('input[type="radio"][name="successMetricKnown"]');
    const target = document.getElementById('successMetricField');
    if (!target) return;

    function toggle() {
      const checked = document.querySelector('input[type="radio"][name="successMetricKnown"]:checked');
      target.style.display = checked && checked.value === 'yes' ? 'block' : 'none';
    }

    radios.forEach((r) => r.addEventListener('change', toggle));
    toggle(); // initial state
  }

  /* ─── Clear step errors on input ─────────────────────────────────────── */
  function initErrorClear() {
    document.querySelectorAll('.deal-input, .deal-select').forEach((el) => {
      el.addEventListener('input', function () {
        this.classList.remove('deal-input--error', 'deal-select--error');
        const panel = this.closest('.deal-step-panel');
        if (panel) {
          const err = panel.querySelector('.deal-step-error');
          if (err) err.remove();
        }
      });
    });
  }

  /* ─── Init ────────────────────────────────────────────────────────────── */
  function init() {
    // Step navigation
    document.querySelectorAll('.deal-next').forEach((btn) => {
      btn.addEventListener('click', function () {
        const next = parseInt(this.dataset.next);
        if (validateStep(currentStep)) {
          goToStep(next);
        }
      });
    });

    document.querySelectorAll('.deal-prev').forEach((btn) => {
      btn.addEventListener('click', function () {
        goToStep(parseInt(this.dataset.prev));
      });
    });

    // Form submission
    document.getElementById('dealForm').addEventListener('submit', handleSubmit);

    // Character counter
    initCharCounter();

    // Conditional fields
    initConditionalFields();

    // Error clearing
    initErrorClear();

    // Add Enter key support for form progression
    document.querySelectorAll('.deal-step-panel input, .deal-step-panel select').forEach((el) => {
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          const nextBtn = this.closest('.deal-step-panel').querySelector('.deal-next');
          if (nextBtn) nextBtn.click();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();