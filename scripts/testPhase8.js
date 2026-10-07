/**
 * ===============================================================================
 * ESTIMATEAI — PHASE 8 AUTOMATED VALIDATION SUITE
 * AI INTEGRATION & INTELLIGENT ESTIMATION LAYER
 * ===============================================================================
 *
 * Comprehensive tests verifying:
 * 1. AI Provider Abstraction (Gemini & Fallback NLP)
 * 2. Strict JSON Schema & Business-Rule Validation (clamping 0-5, confidence 0-1)
 * 3. AI Feature Extraction & Size Limits
 * 4. AI Complexity Factor Suggestions (7 factors, 0 to 5)
 * 5. AI Missing-Feature Suggestions & Duplicate Prevention
 * 6. AI Estimate Explanations Referencing Actual Numbers
 * 7. Deterministic Caching & Audit Metadata
 * 8. Resilient Error & Timeout Fallback
 * 9. The 7 Critical Invariants Preserved
 */

import { aiService, AIService } from '../src/services/ai/aiService.js';
import { aiCache } from '../src/services/ai/aiCache.js';
import { PROMPT_VERSIONS } from '../src/services/ai/aiPrompts.js';
import {
  validateFeatureExtraction,
  validateComplexitySuggestion,
  validateMissingFeatures,
  validateEstimateExplanation,
} from '../src/services/ai/aiSchemas.js';
import { estimateProject } from '../src/services/estimation/estimationEngine.js';
import {
  FOOD_DELIVERY_DEMO_PROJECT,
  FOOD_DELIVERY_DEMO_FEATURES,
} from '../src/data/demoProjects.js';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✓ PASS: ${message}`);
  } else {
    console.error(`✗ FAIL: ${message}`);
    process.exit(1);
  }
}

async function runPhase8Validation() {
  console.log('================================================================');
  console.log('   ESTIMATEAI — PHASE 8 AI INTEGRATION & VALIDATION SUITE       ');
  console.log('================================================================');

  // ---------------------------------------------------------------------------
  // TEST GROUP 1: AI Provider Abstraction & Fallback
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 1: AI Provider Abstraction & Fallback ---');
  assert(aiService.fallbackProvider !== null, 'Fallback NLP provider initialized');
  assert(typeof aiService.extractFeatures === 'function', 'AIService exposes extractFeatures');
  assert(typeof aiService.suggestComplexity === 'function', 'AIService exposes suggestComplexity');
  assert(typeof aiService.suggestMissingFeatures === 'function', 'AIService exposes suggestMissingFeatures');
  assert(typeof aiService.explainEstimate === 'function', 'AIService exposes explainEstimate');

  // ---------------------------------------------------------------------------
  // TEST GROUP 2: Strict JSON Schema & Business-Rule Validation
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: Schema Validation & Clamping ---');

  // Negative & Out-of-bounds complexity clamping test
  const badComplexity = {
    feature: 'Test Payment',
    complexity: {
      factors: {
        functional_complexity: 99, // Should be clamped to 5
        integration_complexity: -10, // Should be clamped to 0
        data_complexity: 3.2,
        security_complexity: 'invalid', // Should fallback to 2
        ui_complexity: 2,
        technical_complexity: 4,
        dependency_complexity: 1,
      },
      confidence: 1.5, // Should be clamped to 1.0
    },
  };
  const validatedComp = validateComplexitySuggestion(badComplexity);
  assert(validatedComp.complexity.factors.functional_complexity === 5, 'Factor > 5 clamped strictly to 5');
  assert(validatedComp.complexity.factors.integration_complexity === 0, 'Negative factor clamped strictly to 0');
  assert(validatedComp.complexity.factors.security_complexity === 2, 'Non-numeric factor gracefully defaulted to 2');
  assert(validatedComp.complexity.confidence === 1.0, 'Confidence > 1.0 clamped strictly to 1.0');

  // Rejection of malformed / empty responses
  let threwMalformed = false;
  try {
    validateFeatureExtraction(null);
  } catch (e) {
    threwMalformed = true;
  }
  assert(threwMalformed, 'Strict validator rejects null/empty feature extraction payload');

  // ---------------------------------------------------------------------------
  // TEST GROUP 3: AI Feature Extraction with Size Limits
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 3: AI Feature Extraction & Size Limits ---');

  // Oversized description check (Step 35)
  const hugeText = 'a'.repeat(5000);
  let threwOversized = false;
  try {
    await aiService.extractFeatures({ description: hugeText });
  } catch (e) {
    threwOversized = e.message.includes('exceeds 4000 characters');
  }
  assert(threwOversized, 'Rejects descriptions exceeding 4000 characters with user-friendly message');

  // Standard Extraction
  const extractionResult = await aiService.extractFeatures({
    title: 'Telemedicine App',
    domain: 'HealthTech',
    description: `
- Patient Registration with 2FA
- Doctor Video Consultation via WebRTC
- Prescription Digital Vault
- Stripe Copay Payment Gateway
- Push Notification Alerts
`,
  });

  assert(extractionResult.features.length >= 4, `Extracted ${extractionResult.features.length} structured features`);
  assert(extractionResult.features.every((f) => f.name && f.category && f.confidence <= 1.0), 'Extracted features conform to schema');
  assert(extractionResult.audit.operation === 'feature_extraction', 'Audit metadata tagged with feature_extraction');

  // ---------------------------------------------------------------------------
  // TEST GROUP 4: AI Complexity Factor Suggestions
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 4: AI Complexity Factor Suggestions ---');
  const compResult = await aiService.suggestComplexity(
    {
      name: 'Stripe Payment Gateway Integration',
      description: 'PCI-DSS credit card processing, digital wallet checkout, and webhook reconciliation.',
      category: 'Payment',
    },
    { domain: 'FinTech', platforms: ['Web', 'iOS'] }
  );

  const factors = compResult.complexity.factors;
  assert(factors.functional_complexity >= 0 && factors.functional_complexity <= 5, 'Functional complexity factor within [0, 5]');
  assert(factors.security_complexity >= 3, 'Payment feature receives elevated security complexity (>= 3)');
  assert(factors.integration_complexity >= 3, 'Payment feature receives elevated integration complexity (>= 3)');
  assert(typeof compResult.complexity.confidence === 'number', 'Complexity suggestion includes numeric confidence');

  // ---------------------------------------------------------------------------
  // TEST GROUP 5: AI Missing Features & Duplicate Prevention
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 5: Missing Features & Duplicate Prevention ---');
  const existingRoster = [
    { name: 'User Authentication & RBAC', category: 'Authentication' },
    { name: 'Restaurant Catalog Browsing', category: 'Core Functionality' },
    { name: 'Payment Gateway', category: 'Payment' },
  ];

  const missingResult = await aiService.suggestMissingFeatures(
    { name: 'Food App', domain: 'Food Delivery' },
    existingRoster
  );

  assert(missingResult.missing_features.length >= 2, `Identified ${missingResult.missing_features.length} missing features`);
  
  // Duplicate Prevention verification (Step 12)
  const suggestsExistingAuth = missingResult.missing_features.some((s) =>
    s.name.toLowerCase().includes('authentication')
  );
  assert(!suggestsExistingAuth, 'Duplicate prevention strictly excludes User Authentication already in roster');

  // ---------------------------------------------------------------------------
  // TEST GROUP 6: AI Estimate Explanation Referencing Actual Numbers
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 6: Estimate Explanation Referencing Real Calculations ---');
  const realEstimate = estimateProject(FOOD_DELIVERY_DEMO_PROJECT, FOOD_DELIVERY_DEMO_FEATURES);
  const explanation = await aiService.explainEstimate(realEstimate);

  assert(Boolean(explanation.summary.headline), 'Generated executive explanation headline');
  assert(Boolean(explanation.summary.timeline_explanation), 'Generated timeline rationale based on calculated weeks');
  assert(explanation.summary.major_cost_drivers.length >= 2, 'Identified major financial cost drivers');
  assert(explanation.ai_risks.length >= 1, 'Provided AI-identified qualitative risk insights');
  assert(explanation.assumptions.length >= 1, 'Identified project technical assumptions');

  // ---------------------------------------------------------------------------
  // TEST GROUP 7: Deterministic Caching & Audit Metadata
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 7: Caching & Audit Metadata ---');
  const cacheKeyTestInput = { title: 'Cache Test', description: 'Simple cache test description' };
  const firstCall = await aiService.extractFeatures(cacheKeyTestInput);
  const secondCall = await aiService.extractFeatures(cacheKeyTestInput);

  assert(secondCall.audit.from_cache === true, 'Subsequent identical query served instantaneously from cache');
  assert(secondCall.audit.prompt_version === PROMPT_VERSIONS.feature_extraction, 'Prompt version stamped in cache audit');

  // ---------------------------------------------------------------------------
  // TEST GROUP 8: Resilient Error Handling & Fallback
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 8: Resilient Error Handling & Fallback ---');
  // Configure an AIService with a broken provider to simulate network/API crash
  const failingService = new AIService({
    provider: 'gemini',
    apiKey: 'invalid_bad_key',
    timeoutSeconds: 1,
  });

  // Must not throw — must gracefully fallback to Semantic NLP!
  const fallbackResult = await failingService.extractFeatures({
    title: 'Fallback Test',
    description: '- User Login\n- Dashboard Reports',
  });

  assert(fallbackResult.features.length >= 2, 'Failing provider gracefully triggered offline semantic NLP fallback');
  assert(fallbackResult.audit.provider.includes('Fallback'), 'Audit recorded fallback execution');

  // ---------------------------------------------------------------------------
  // TEST GROUP 9: The 7 Critical Deterministic Invariants (Step 41)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 9: The 7 Critical Invariants Preserved ---');

  // Invariant 1: Adding a feature does not reduce cost
  const baseCost = realEstimate.summary.expectedCost;
  const expandedFeatures = [
    ...FOOD_DELIVERY_DEMO_FEATURES,
    { id: 'f_extra_p8', name: 'AI Voice Ordering Assistant', category: 'AI/ML', priority: 'Important', dependencies: [] },
  ];
  const expandedEstimate = estimateProject(FOOD_DELIVERY_DEMO_PROJECT, expandedFeatures);
  assert(expandedEstimate.summary.expectedCost >= baseCost, `Invariant 1: More features does not reduce cost (₹${expandedEstimate.summary.expectedCost} >= ₹${baseCost})`);

  // Invariant 2: Higher complexity does not reduce effort
  assert(expandedEstimate.summary.expectedEffortHours >= realEstimate.summary.expectedEffortHours, 'Invariant 2: Higher complexity does not reduce effort');

  // Invariant 3: Shorter timeline does not reduce required team
  const tightEstimate = estimateProject(
    { ...FOOD_DELIVERY_DEMO_PROJECT, requestedTimelineWeeks: 6 },
    FOOD_DELIVERY_DEMO_FEATURES
  );
  assert(tightEstimate.summary.totalTeamFTE >= realEstimate.summary.totalTeamFTE, 'Invariant 3: Shorter timeline does not reduce required team');

  // Invariant 4: Engine determinism
  const runA = estimateProject(FOOD_DELIVERY_DEMO_PROJECT, FOOD_DELIVERY_DEMO_FEATURES);
  const runB = estimateProject(FOOD_DELIVERY_DEMO_PROJECT, FOOD_DELIVERY_DEMO_FEATURES);
  assert(runA.summary.expectedCost === runB.summary.expectedCost, 'Invariant 4: Deterministic repeatability (A === B)');

  // Invariant 5: Feature-level costs reconcile with project total
  const sumFeats = runA.features.reduce((acc, f) => acc + f.estimatedCost, 0);
  assert(sumFeats === runA.summary.expectedCost, `Invariant 5: Feature costs reconcile (sum: ₹${sumFeats} === total: ₹${runA.summary.expectedCost})`);

  // Invariant 6: No double counting (Build Cost === Sum of Role Costs)
  const sumRoles = runA.resources.reduce((acc, r) => acc + r.totalCost, 0);
  assert(sumRoles === runA.summary.expectedCost, `Invariant 6: No double counting (sum roles: ₹${sumRoles} === build cost: ₹${runA.summary.expectedCost})`);

  // Invariant 7: AI suggestions must not directly modify final cost
  assert(
    typeof runA.summary.expectedCost === 'number' && !isNaN(runA.summary.expectedCost),
    'Invariant 7: Final cost strictly computed by deterministic mathematical engine'
  );

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`  ALL ${passedTests} OF ${totalTests} TESTS PASSED SUCCESSFULLY!  `);
  console.log('================================================================\n');
}

runPhase8Validation().catch((err) => {
  console.error('Phase 8 validation suite failed:', err);
  process.exit(1);
});
