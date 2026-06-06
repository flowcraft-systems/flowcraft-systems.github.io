// @ts-check
/**
 * FlowCraft Deal Sizing — Playwright E2E Smoke Tests
 * ====================================================
 *
 * Tests the window.__dealSizing engine API directly (no form interaction)
 * and one minimal form-fill submission test.
 *
 * Run:   npx playwright test e2e/deal-sizing.spec.js
 *        npm run test:e2e
 *
 * Setup: npm i -D @playwright/test && npx playwright install chromium
 */

const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:8080/deal-sizing.html';

/**
 * Evaluate a computeScores call on the page.
 */
async function computeScores(page, data) {
  return page.evaluate((d) => window.__dealSizing.computeScores(d), data);
}

// ═══════════════════════════════════════════════════════════════════════════
// S1: Engine API — Clean AI Coding Pilot → XS, qualified, no human review
// ═══════════════════════════════════════════════════════════════════════════
test('S1: Clean AI Coding Pilot — XS, qualified, no human review', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForFunction(() => !!window.__dealSizing);

  const r = await computeScores(page, {
    buyerRole: 'CTO', accountableOwnerExists: 'yes', accountableOwnerRole: 'SELF',
    primaryTrigger: 'ENGINEERING_PRODUCTIVITY_PRESSURE', primaryGoal: 'IMPROVE_AI_CODING_ADOPTION',
    freeTextAsk: 'We need to improve AI coding adoption across our engineering team with proper governance and measurement.',
    successMetricKnown: 'yes', currentPainLevel: 'SEVERE',
    affectedAreas: { development: true },
    engineeringTeamSize: '11_25', affectedTeamCount: 'ONE_TEAM',
    systemContext: 'GREENFIELD', productionImpact: 'WORKSHOP_ONLY',
    dataSensitivity: 'PUBLIC_OR_SYNTHETIC', complianceContext: {},
    currentAiTools: { cursor: true }, evidenceAvailable: { jiraData: true, githubData: true },
    sanitizedArtifactsAvailable: 'yes', desiredTimeline: 'TWO_TO_FOUR_WEEKS',
    budgetRange: 'SMALL', preferredEngagementModel: 'PILOT',
    interestedInRecurringReviews: 'yes'
  });

  expect(r.tShirt).toBe('XS');
  expect(r.totalScore).toBe(6);
  expect(r.serviceLine).toBe('AI_CODING_OPERATING_MODEL');
  expect(r.entryOffer).toBe('AI Coding Pilot');
  expect(r.dealStatus).toBe('qualified');
  expect(r.humanReview).toBe(false);
  expect(r.dealBreakerDetected).toBe(false);
  expect(r.weakFitDetected).toBe(false);
  expect(r.confidence.level).toBe('high');
  expect(r.priceBand).toContain('$');
  expect(r.productAttach).toContain('FlowCraft Skills');
  expect(r.ninetyDayPath).toBeTruthy();
  expect(r.riskFactors.length).toBe(0);
  expect(r.flags.some(f => f === 'No flags detected')).toBe(true);
});

// ═══════════════════════════════════════════════════════════════════════════
// S2: Enterprise AI Mandate → L, AI Engineering Office, human review
// ═══════════════════════════════════════════════════════════════════════════
test('S2: Enterprise AI Mandate — L, AI Eng Office, human review', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForFunction(() => !!window.__dealSizing);

  const r = await computeScores(page, {
    buyerRole: 'CTO', accountableOwnerExists: 'yes', accountableOwnerRole: 'ENGINEERING_LEADER',
    primaryTrigger: 'CEO_AI_FIRST_MANDATE', primaryGoal: 'CREATE_AI_ENGINEERING_ROADMAP',
    freeTextAsk: 'CEO wants us to become AI-first. 200+ engineers, 3 departments, need governance.',
    successMetricKnown: 'partially', currentPainLevel: 'EXISTENTIAL',
    affectedAreas: { development: true, qa: true, devOps: true, management: true },
    engineeringTeamSize: '100_PLUS', affectedTeamCount: 'MULTIPLE_DEPARTMENTS',
    systemContext: 'DISTRIBUTED_SYSTEM', productionImpact: 'PRODUCTION_CRITICAL',
    dataSensitivity: 'CONFIDENTIAL', complianceContext: { soc2: true },
    currentAiTools: { githubCopilot: true, cursor: true, claudeCode: true, chatgpt: true },
    evidenceAvailable: { jiraData: true, githubData: true, cicdData: true, architectureDiagrams: true, releaseMetrics: true },
    sanitizedArtifactsAvailable: 'yes', desiredTimeline: 'MORE_THAN_TWELVE_WEEKS',
    budgetRange: 'LARGE', preferredEngagementModel: 'EMBEDDED_ADVISOR',
    interestedInRecurringReviews: 'yes'
  });

  expect(r.serviceLine).toBe('AI_ENGINEERING_OFFICE');
  expect(r.tShirt).toBe('L');
  expect(r.humanReview).toBe(true);
  expect(r.dealBreakerDetected).toBe(false);
  expect(r.entryOffer).toBe('AI Engineering Baseline');
  expect(r.productAttach).toContain('Engage');
  expect(r.productAttach).toContain('Tempo');
  expect(r.confidence.level).toBe('medium');
  expect(r.riskFactors.length).toBeGreaterThan(0);
  expect(r.combinedRiskMultiplier).toBeGreaterThan(1);
  expect(r.priceBand).toContain('delivery partner');
  expect(r.totalScore).toBeGreaterThanOrEqual(19);
});

// ═══════════════════════════════════════════════════════════════════════════
// S3: Deal Breaker — No Owner → fatal confidence, Workshop offer
// ═══════════════════════════════════════════════════════════════════════════
test('S3: Deal Breaker — No Owner, fatal confidence, workshop', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForFunction(() => !!window.__dealSizing);

  const r = await computeScores(page, {
    buyerRole: 'OTHER', accountableOwnerExists: 'no', accountableOwnerRole: 'NO_CLEAR_OWNER',
    primaryTrigger: 'OTHER', primaryGoal: 'NOT_SURE',
    freeTextAsk: 'Exploring AI options but not sure what we need.',
    successMetricKnown: 'no', currentPainLevel: 'MILD',
    affectedAreas: {}, engineeringTeamSize: '1_10', affectedTeamCount: 'ONE_TEAM',
    systemContext: 'UNKNOWN', productionImpact: 'WORKSHOP_ONLY',
    dataSensitivity: 'PUBLIC_OR_SYNTHETIC', complianceContext: {},
    currentAiTools: { none: true }, evidenceAvailable: { none: true },
    sanitizedArtifactsAvailable: 'no', desiredTimeline: 'ONE_WEEK',
    budgetRange: 'BELOW_MINIMUM', preferredEngagementModel: 'DIAGNOSTIC',
    interestedInRecurringReviews: 'no'
  });

  expect(r.dealBreakerDetected).toBe(true);
  expect(r.confidence.level).toBe('fatal');
  expect(r.dealStatus).toBe('deal_breaker');
  expect(r.entryOffer).toContain('Workshop');
  expect(r.humanReview).toBe(true);
  expect(r.disqualificationIssues.length).toBeGreaterThanOrEqual(1);
});

// ═══════════════════════════════════════════════════════════════════════════
// S4: Weak Fit — Readiness Workshop offer
// ═══════════════════════════════════════════════════════════════════════════
test('S4: Weak Fit — Readiness Workshop recommended', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForFunction(() => !!window.__dealSizing);

  const r = await computeScores(page, {
    buyerRole: 'PRODUCT_LEADER', accountableOwnerExists: 'yes', accountableOwnerRole: 'PRODUCT_LEADER',
    primaryTrigger: 'ENGINEERING_PRODUCTIVITY_PRESSURE', primaryGoal: 'IMPROVE_AI_CODING_ADOPTION',
    freeTextAsk: 'We want our dev team to use Cursor more effectively.',
    successMetricKnown: 'partially', currentPainLevel: 'MODERATE',
    affectedAreas: { development: true },
    engineeringTeamSize: '26_50', affectedTeamCount: 'TWO_TO_THREE_TEAMS',
    systemContext: 'EXISTING_APPLICATION', productionImpact: 'INTERNAL_WORKFLOW',
    dataSensitivity: 'CONFIDENTIAL', complianceContext: {},
    currentAiTools: {}, evidenceAvailable: {},
    sanitizedArtifactsAvailable: 'not_sure', desiredTimeline: 'FOUR_TO_EIGHT_WEEKS',
    budgetRange: 'MEDIUM', preferredEngagementModel: 'PILOT',
    interestedInRecurringReviews: 'yes'
  });

  expect(r.weakFitDetected).toBe(true);
  expect(r.entryOffer).toContain('Readiness');
  expect(r.dealBreakerDetected).toBe(false);
  expect(r.dealStatus).toBe('weak_fit');
});

// ═══════════════════════════════════════════════════════════════════════════
// S5: Legacy Modernization — Brownfield, codebase access flag
// ═══════════════════════════════════════════════════════════════════════════
test('S5: Legacy Modernization — Brownfield, codebase access flag', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForFunction(() => !!window.__dealSizing);

  const r = await computeScores(page, {
    buyerRole: 'CTO', accountableOwnerExists: 'yes', accountableOwnerRole: 'ENGINEERING_LEADER',
    primaryTrigger: 'LEGACY_MODERNIZATION_PRESSURE', primaryGoal: 'MODERNIZE_LEGACY_SYSTEM',
    freeTextAsk: 'Legacy .NET monolith needs modernization with AI-assisted codebase understanding.',
    successMetricKnown: 'yes', currentPainLevel: 'SEVERE',
    affectedAreas: { development: true, architecture: true },
    engineeringTeamSize: '26_50', affectedTeamCount: 'TWO_TO_THREE_TEAMS',
    systemContext: 'LEGACY_MONOLITH', productionImpact: 'INTERNAL_WORKFLOW',
    dataSensitivity: 'CONFIDENTIAL', complianceContext: {},
    currentAiTools: { githubCopilot: true, cursor: true },
    evidenceAvailable: { jiraData: true, architectureDiagrams: true },
    sanitizedArtifactsAvailable: 'yes', desiredTimeline: 'EIGHT_TO_TWELVE_WEEKS',
    budgetRange: 'MEDIUM', preferredEngagementModel: 'PILOT',
    interestedInRecurringReviews: 'yes'
  });

  expect(r.serviceLine).toBe('BROWNFIELD_MODERNIZATION_SYSTEM');
  expect(r.entryOffer).toBe('Modernization Map');
  expect(r.productAttach).toContain('FlowCraft Skills');
  expect(r.productAttach).toContain('Tempo');
  expect(r.dealBreakerDetected).toBe(false);
  // codebaseAccess is NOT in evidenceAvailable → flag should include codebase access warning
  const hasCodeAccessFlag = r.flags.some(f => f.toLowerCase().includes('codebase'));
  expect(hasCodeAccessFlag).toBe(true);
  // tshirt min S due to legacy override
  expect(['S', 'M', 'L']).toContain(r.tShirt);
  expect(r.tShirt).not.toBe('XS');
  expect(r.humanReview).toBe(true);
});

// ═══════════════════════════════════════════════════════════════════════════
// S6: Form submission smoke test — fills the live form and submits
// ═══════════════════════════════════════════════════════════════════════════
test('S6: Form submission renders results panel', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForFunction(() => !!window.__dealSizing);

  // Step 1: Context
  await page.fill('#companyName', 'SmokeTestCo');
  await page.fill('#prospectName', 'Test User');
  await page.fill('#workEmail', 'test@smoke.co');
  await page.selectOption('#buyerRole', 'CTO');
  await page.evaluate(() => {
    const r = document.querySelector('input[name="accountableOwnerExists"][value="yes"]');
    if (r) r.checked = true;
  });
  await page.selectOption('#accountableOwnerRole', 'SELF');
  await page.selectOption('#primaryTrigger', 'PROTOTYPE_URGENCY');

  await page.evaluate(() => {
    const btn = document.querySelector('.deal-next[data-next="2"]');
    if (btn) btn.click();
  });
  await page.waitForSelector('.deal-step-panel[data-panel="2"]', { state: 'attached', timeout: 3000 });

  // Step 2: Problem
  await page.selectOption('#primaryGoal', 'BUILD_PROTOTYPE');
  await page.fill('#freeTextAsk', 'We need to build a prototype to validate our AI product concept quickly.');
  await page.evaluate(() => {
    const r = document.querySelector('input[name="successMetricKnown"][value="yes"]');
    if (r) r.checked = true;
  });
  await page.selectOption('#currentPainLevel', 'SEVERE');
  await page.evaluate(() => {
    const cb = document.querySelector('input[name="affectedAreas"][value="development"]');
    if (cb) cb.checked = true;
  });

  await page.evaluate(() => {
    const btn = document.querySelector('.deal-next[data-next="3"]');
    if (btn) btn.click();
  });
  await page.waitForSelector('.deal-step-panel[data-panel="3"]', { state: 'attached', timeout: 3000 });

  // Step 3: Systems
  await page.selectOption('#engineeringTeamSize', '11_25');
  await page.selectOption('#affectedTeamCount', 'ONE_TEAM');
  await page.selectOption('#systemContext', 'GREENFIELD');
  await page.selectOption('#productionImpact', 'PROTOTYPE_ONLY');
  await page.selectOption('#dataSensitivity', 'PUBLIC_OR_SYNTHETIC');

  await page.evaluate(() => {
    const btn = document.querySelector('.deal-next[data-next="4"]');
    if (btn) btn.click();
  });
  await page.waitForSelector('.deal-step-panel[data-panel="4"]', { state: 'attached', timeout: 3000 });

  // Step 4: Evidence & submit
  await page.selectOption('#desiredTimeline', 'TWO_TO_FOUR_WEEKS');
  await page.selectOption('#budgetRange', 'SMALL');
  await page.evaluate(() => {
    const tools = ['cursor'];
    tools.forEach(t => {
      const cb = document.querySelector(`input[name="currentAiTools"][value="${t}"]`);
      if (cb) cb.checked = true;
    });
    const evidence = ['jiraData', 'githubData'];
    evidence.forEach(ev => {
      const cb = document.querySelector(`input[name="evidenceAvailable"][value="${ev}"]`);
      if (cb) cb.checked = true;
    });
    const sa = document.querySelector('input[name="sanitizedArtifactsAvailable"][value="yes"]');
    if (sa) sa.checked = true;
  });

  await page.evaluate(() => {
    const btn = document.querySelector('#dealCalculateBtn');
    if (btn) btn.click();
  });

  // Wait for results panel
  await page.waitForSelector('#dealResults', { state: 'attached', timeout: 5000 });

  // Verify result elements render
  const tShirt = await page.textContent('#resultTShirt');
  expect(tShirt).not.toBe('—');

  const score = await page.textContent('#resultTotalScore');
  expect(score).not.toBe('—');

  const serviceLine = await page.textContent('#resultServiceLine');
  expect(serviceLine).not.toBe('—');
  expect(serviceLine.length).toBeGreaterThan(0);

  const entryOffer = await page.textContent('#resultEntryOffer');
  expect(entryOffer.length).toBeGreaterThan(0);

  const priceBand = await page.textContent('#resultPriceBand');
  expect(priceBand.length).toBeGreaterThan(0);

  const dealStatus = await page.textContent('#resultDealStatus');
  expect(dealStatus.length).toBeGreaterThan(0);

  const confidence = await page.textContent('#resultConfidence');
  expect(confidence.length).toBeGreaterThan(0);

  // Score bars visible
  await expect(page.locator('#resultScopeClarity')).toBeVisible();
  await expect(page.locator('#resultTechComplexity')).toBeVisible();
  await expect(page.locator('#resultDataCompliance')).toBeVisible();
  await expect(page.locator('#resultAdoptionBurden')).toBeVisible();
  await expect(page.locator('#resultProductionCriticality')).toBeVisible();

  // Risk + flags
  await expect(page.locator('#resultRiskFactors')).toBeVisible();
  await expect(page.locator('#resultFlags')).toBeVisible();
  await expect(page.locator('#resultNextQuestions')).toBeVisible();

  // Human review section
  await expect(page.locator('#resultHumanReviewText')).toBeVisible();

  // Disclaimer + action buttons
  await expect(page.locator('.deal-disclaimer')).toBeVisible();
});
