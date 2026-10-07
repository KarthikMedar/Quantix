/**
 * EstimateAI — Phase 7 Master Test & Validation Suite
 *
 * Validates:
 * 1. Eight Core Estimation Invariants (Section 87)
 * 2. Pure Engine Determinism (A === B === C)
 * 3. Input Validation & Bounds Checking (Features, Names, Timelines)
 * 4. Extreme Input & Numeric Sanity (100 Features, No NaN / Infinity)
 * 5. Exact Rupee Cost Reconciliation (Role Cost === Build Cost === Feature Costs)
 * 6. Strict Cost Isolation (Build Cost vs Monthly Infra vs Annual Maintenance)
 * 7. Validated Custom Rate Overrides
 * 8. Real-Engine What-If Scenario Simulations
 * 9. Side-by-Side Read-Only Version Comparison
 * 10. Golden Food Delivery Benchmark
 * 11. Phase 8 Interface Preparation & AI Quarantine (AI_ENABLED === false)
 */

// In Node environment, polyfill localStorage for test execution
const memoryStorage = {};
globalThis.localStorage = {
  getItem: (key) => memoryStorage[key] || null,
  setItem: (key, val) => {
    memoryStorage[key] = String(val);
  },
  removeItem: (key) => {
    delete memoryStorage[key];
  },
  clear: () => {
    for (const k in memoryStorage) delete memoryStorage[k];
  },
};

import { estimateProject } from '../src/services/estimation/estimationEngine.js';
import { projectService } from '../src/services/projectService.js';
import { requirementAnalyzer, AI_ENABLED } from '../src/services/requirementAnalyzer.js';
import {
  FOOD_DELIVERY_DEMO_PROJECT,
  FOOD_DELIVERY_DEMO_FEATURES,
  ECOMMERCE_DEMO_PROJECT,
  ECOMMERCE_DEMO_FEATURES,
} from '../src/data/demoProjects.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`✓ PASS: ${message}`);
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('       ESTIMATEAI — PHASE 7 MASTER VALIDATION & STABILITY SUITE ');
  console.log('================================================================\n');

  // ---------------------------------------------------------------------------
  // TEST GROUP 1: The 8 Core Estimation Invariants (Section 87)
  // ---------------------------------------------------------------------------
  console.log('--- TEST GROUP 1: The 8 Core Estimation Invariants ---');

  const baseProj = { ...FOOD_DELIVERY_DEMO_PROJECT, requestedTimelineWeeks: 16 };
  const featList3 = FOOD_DELIVERY_DEMO_FEATURES.slice(0, 3);
  const featList4 = FOOD_DELIVERY_DEMO_FEATURES.slice(0, 4);

  const res3 = estimateProject(baseProj, featList3);
  const res4 = estimateProject(baseProj, featList4);

  // Invariant 1: Adding a feature must not reduce total cost
  assert(
    res4.summary.expectedCost >= res3.summary.expectedCost,
    `Invariant 1: Adding a feature does not reduce cost (4 feats: ₹${res4.summary.expectedCost} >= 3 feats: ₹${res3.summary.expectedCost})`
  );

  // Invariant 2: Adding a feature must not reduce total effort
  assert(
    res4.summary.expectedEffortHours >= res3.summary.expectedEffortHours,
    `Invariant 2: Adding a feature does not reduce effort (4 feats: ${res4.summary.expectedEffortHours}h >= 3 feats: ${res3.summary.expectedEffortHours}h)`
  );

  // Invariant 3: Increasing complexity must not reduce effort
  const simpleFeature = [{ id: 'f_test', name: 'Simple static contact page', category: 'Core', priority: 'Must Have' }];
  const complexFeature = [{ id: 'f_test', name: 'Distributed real-time streaming consensus algorithm with payment gateway', category: 'Core', priority: 'Must Have' }];
  const resSimple = estimateProject(baseProj, simpleFeature);
  const resComplex = estimateProject(baseProj, complexFeature);

  assert(
    resComplex.summary.expectedEffortHours >= resSimple.summary.expectedEffortHours,
    `Invariant 3: Higher complexity yields higher effort (${resComplex.summary.expectedEffortHours}h >= ${resSimple.summary.expectedEffortHours}h)`
  );

  // Invariant 4: Increasing complexity must not reduce cost
  assert(
    resComplex.summary.expectedCost >= resSimple.summary.expectedCost,
    `Invariant 4: Higher complexity yields higher cost (₹${resComplex.summary.expectedCost} >= ₹${resSimple.summary.expectedCost})`
  );

  // Invariant 5: Shortening timeline must not reduce required team
  const relaxedTimelineProj = { ...baseProj, requestedTimelineWeeks: 24 };
  const compressedTimelineProj = { ...baseProj, requestedTimelineWeeks: 6 };
  const resRelaxed = estimateProject(relaxedTimelineProj, featList4);
  const resCompressed = estimateProject(compressedTimelineProj, featList4);

  assert(
    resCompressed.summary.totalTeamFTE >= resRelaxed.summary.totalTeamFTE,
    `Invariant 5: Shortening timeline does not reduce required team (Compressed 6w: ${resCompressed.summary.totalTeamFTE} FTE >= Relaxed 24w: ${resRelaxed.summary.totalTeamFTE} FTE)`
  );

  // Invariant 6: Adding supported platforms must not reduce client-side cost
  const singlePlatformProj = { ...baseProj, platforms: ['Web'] };
  const triplePlatformProj = { ...baseProj, platforms: ['Web', 'Android', 'iOS'] };
  const resSinglePlat = estimateProject(singlePlatformProj, featList4);
  const resTriplePlat = estimateProject(triplePlatformProj, featList4);

  assert(
    resTriplePlat.summary.expectedCost >= resSinglePlat.summary.expectedCost,
    `Invariant 6: Multi-platform deployment does not reduce cost (Triple: ₹${resTriplePlat.summary.expectedCost} >= Single: ₹${resSinglePlat.summary.expectedCost})`
  );

  // Invariant 7: Saving v2 must not modify v1
  globalThis.localStorage.clear();
  const projPersist = await projectService.createProject({ id: 'prj_inv_test', name: 'Invariant Test Project' });
  const ver1 = await projectService.saveEstimateVersion(projPersist.id, {
    inputSnapshot: { project: baseProj, features: featList3 },
    outputSnapshot: res3,
    notes: 'Baseline v1',
  });
  const v1Before = JSON.stringify(ver1);

  const ver2 = await projectService.saveEstimateVersion(projPersist.id, {
    inputSnapshot: { project: baseProj, features: featList4 },
    outputSnapshot: res4,
    notes: 'Expanded v2',
  });

  const v1AfterRecord = await projectService.getVersionById(projPersist.id, ver1.id);
  const v1After = JSON.stringify(v1AfterRecord);
  assert(v1Before === v1After, 'Invariant 7: Saving v2 leaves historical v1 100% identical and immutable');

  // Invariant 8: Changing rates must not modify old snapshots
  const customRateProj = { ...baseProj, customRates: { frontend_dev: 1500, backend_dev: 1800 } };
  const resCustomRate = estimateProject(customRateProj, featList4);

  const ver3 = await projectService.saveEstimateVersion(projPersist.id, {
    inputSnapshot: { project: customRateProj, features: featList4 },
    outputSnapshot: resCustomRate,
    notes: 'Higher Rate v3',
  });

  const v1Recheck = await projectService.getVersionById(projPersist.id, ver1.id);
  assert(
    v1Recheck.summary.expectedCost === res3.summary.expectedCost,
    'Invariant 8: Future rate updates do not alter historical v1 cost calculation'
  );

  // ---------------------------------------------------------------------------
  // TEST GROUP 2: Pure Engine Determinism (Sections 8 & 9)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: Pure Engine Determinism (A === B === C) ---');
  const runA = estimateProject(FOOD_DELIVERY_DEMO_PROJECT, FOOD_DELIVERY_DEMO_FEATURES);
  const runB = estimateProject(FOOD_DELIVERY_DEMO_PROJECT, FOOD_DELIVERY_DEMO_FEATURES);
  const runC = estimateProject(FOOD_DELIVERY_DEMO_PROJECT, FOOD_DELIVERY_DEMO_FEATURES);

  assert(runA.summary.expectedCost === runB.summary.expectedCost && runB.summary.expectedCost === runC.summary.expectedCost, 'Expected cost is 100% deterministic across multiple runs');
  assert(runA.summary.expectedEffortHours === runB.summary.expectedEffortHours, 'Expected effort hours are 100% deterministic');
  assert(runA.summary.timelineWeeks === runB.summary.timelineWeeks, 'Timeline weeks are 100% deterministic');
  assert(runA.summary.riskScore === runB.summary.riskScore, 'Risk score is 100% deterministic');
  assert(runA.summary.confidence === runB.summary.confidence, 'Confidence rating is 100% deterministic');

  // ---------------------------------------------------------------------------
  // TEST GROUP 3: Input Validation & Boundary Checks (Sections 47, 48, 81-86)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 3: Input Validation & Boundary Checks ---');
  let threwEmpty = false;
  try {
    estimateProject(baseProj, []);
  } catch (e) {
    threwEmpty = true;
  }
  assert(threwEmpty, 'Rejects empty features list with clean validation error');

  let threwMaxFeatures = false;
  try {
    const hugeFeatures = Array.from({ length: 101 }, (_, i) => ({ id: `f_${i}`, name: `Feature ${i}` }));
    estimateProject(baseProj, hugeFeatures);
  } catch (e) {
    threwMaxFeatures = true;
  }
  assert(threwMaxFeatures, 'Rejects feature lists exceeding 100 modules limit');

  let threwEmptyName = false;
  try {
    estimateProject(baseProj, [{ id: 'f_blank', name: '   ' }]);
  } catch (e) {
    threwEmptyName = true;
  }
  assert(threwEmptyName, 'Rejects features with whitespace or empty names');

  let threwInvalidTimeline = false;
  try {
    estimateProject({ ...baseProj, requestedTimelineWeeks: -5 }, featList3);
  } catch (e) {
    threwInvalidTimeline = true;
  }
  assert(threwInvalidTimeline, 'Rejects negative requested timeline');

  let threwZeroTimeline = false;
  try {
    estimateProject({ ...baseProj, requestedTimelineWeeks: 0 }, featList3);
  } catch (e) {
    threwZeroTimeline = true;
  }
  assert(threwZeroTimeline, 'Rejects 0 weeks requested timeline');

  // ---------------------------------------------------------------------------
  // TEST GROUP 4: Extreme Upper Bounds & Numeric Sanity (Section 89 & 90)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 4: Extreme Upper Bounds & Numeric Sanity ---');
  // 100 feature enterprise project
  const hundredFeatures = Array.from({ length: 100 }, (_, i) => ({
    id: `feat_${i}`,
    name: `Enterprise Module ${i} with High-Concurrency Database Processing`,
    category: 'Core',
    priority: i % 2 === 0 ? 'Must Have' : 'Important',
  }));
  const res100 = estimateProject(baseProj, hundredFeatures);

  assert(isFinite(res100.summary.expectedCost) && res100.summary.expectedCost > 0, '100 features produces valid finite cost');
  assert(isFinite(res100.summary.expectedEffortHours) && res100.summary.expectedEffortHours > 0, '100 features produces valid finite effort');
  assert(!isNaN(res100.summary.confidence) && res100.summary.confidence <= 88, '100 features produces realistic bounded confidence');
  assert(!isNaN(res100.summary.riskScore) && res100.summary.riskScore <= 100, 'Risk score is clamped <= 100');

  // ---------------------------------------------------------------------------
  // TEST GROUP 5: Exact Rupee Reconciliation (Sections 24, 25, 91, 93)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 5: Exact Rupee Cost Reconciliation ---');
  const fdRes = estimateProject(FOOD_DELIVERY_DEMO_PROJECT, FOOD_DELIVERY_DEMO_FEATURES);
  const totalBuildCost = fdRes.costBreakdown.totalBuildCost;

  // Check 1: Sum of role costs === Total Build Cost
  const sumRoleCosts = fdRes.resources.reduce((acc, r) => acc + r.totalCost, 0);
  assert(
    sumRoleCosts === totalBuildCost,
    `Role cost reconciliation: sum of role costs (₹${sumRoleCosts}) === TotalBuildCost (₹${totalBuildCost})`
  );

  // Check 2: Sum of feature costs === Total Build Cost
  const sumFeatureCosts = fdRes.features.reduce((acc, f) => acc + f.estimatedCost, 0);
  assert(
    sumFeatureCosts === totalBuildCost,
    `Feature cost reconciliation: sum of feature costs (₹${sumFeatureCosts}) === TotalBuildCost (₹${totalBuildCost}) with zero rupee drift`
  );

  // ---------------------------------------------------------------------------
  // TEST GROUP 6: Strict Cost Separation (Section 10 & 25)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 6: Strict Cost Isolation ---');
  assert(fdRes.infrastructure.monthlyTotal > 0, 'Monthly infrastructure calculated separately');
  assert(fdRes.maintenance.annualCost > 0, 'Year-1 maintenance calculated separately');
  assert(
    fdRes.summary.expectedCost === totalBuildCost,
    'Build cost excludes recurring monthly cloud infrastructure and maintenance'
  );

  // ---------------------------------------------------------------------------
  // TEST GROUP 7: Validated Custom Rate Overrides (Section 133 & 85)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 7: Custom Rate Overriding ---');
  const standardRes = estimateProject(baseProj, featList3);
  const customRes = estimateProject(
    { ...baseProj, customRates: { frontend_dev: 1200, backend_dev: 1400 } },
    featList3
  );

  assert(
    customRes.summary.expectedCost > standardRes.summary.expectedCost,
    `Higher role hourly rates increase build cost appropriately (Custom: ₹${customRes.summary.expectedCost} > Std: ₹${standardRes.summary.expectedCost})`
  );

  // ---------------------------------------------------------------------------
  // TEST GROUP 8: Real-Engine What-If Scenarios (Sections 63, 171, 172)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 8: Real-Engine What-If Scenarios ---');
  const baselineScenario = estimateProject(FOOD_DELIVERY_DEMO_PROJECT, FOOD_DELIVERY_DEMO_FEATURES);
  const compressedScenario = estimateProject(
    {
      ...FOOD_DELIVERY_DEMO_PROJECT,
      requestedTimeline: '6 weeks',
      targetDeadline: '6 weeks',
      requestedTimelineWeeks: 6,
    },
    FOOD_DELIVERY_DEMO_FEATURES
  );

  assert(
    compressedScenario.timeline.deadlineCheck.status === 'Infeasible' || compressedScenario.timeline.deadlineCheck.status === 'Tight',
    'Compressing timeline to 6w correctly triggers tight/infeasible schedule warning'
  );
  assert(
    compressedScenario.summary.totalTeamFTE >= baselineScenario.summary.totalTeamFTE,
    'Timeline compression requires higher or equal team FTE velocity'
  );
  assert(
    baselineScenario.summary.timelineWeeks === 11,
    'Running scenario simulation did NOT mutate baseline calculation parameters'
  );

  // ---------------------------------------------------------------------------
  // TEST GROUP 9: Side-by-Side Read-Only Version Comparison (Section 64 & 173)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 9: Side-by-Side Read-Only Version Comparison ---');
  const compResult = projectService.compareVersions(ver1, ver2);

  assert(compResult.deltas.cost.diff > 0, 'Cost delta reflects increase from v1 to v2');
  assert(compResult.deltas.effort.diff > 0, 'Effort delta reflects increase from v1 to v2');
  assert(compResult.featureDiff.added.length === 1, 'Correctly detected 1 added feature in v2');
  assert(compResult.featureDiff.retainedCount === 3, 'Correctly detected 3 retained baseline features');

  // Verify read-only: versions remained unchanged
  const v1PostComp = await projectService.getVersionById(projPersist.id, ver1.id);
  assert(v1PostComp.summary.expectedCost === ver1.summary.expectedCost, 'Comparison did NOT mutate v1 snapshot');

  // ---------------------------------------------------------------------------
  // TEST GROUP 10: Golden Food Delivery Platform Benchmark (Section 107 & 108)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 10: Golden Food Delivery Benchmark ---');
  assert(fdRes.features.length === 10, 'Food Delivery demo contains all 10 core modules');
  assert(fdRes.resources.length === 8, 'Allocated across 8 specialized engineering roles');
  assert(fdRes.criticalPath.chain.length > 0, 'Critical path dependency chain identified');
  assert(fdRes.engineVersion === '1.0.0', 'Engine version 1.0.0 tagged');
  assert(fdRes.rateVersion === '1.0.0', 'Rate version 1.0.0 tagged');

  // ---------------------------------------------------------------------------
  // TEST GROUP 11: Phase 8 Interface Preparation & AI Quarantine (Sections 5, 182, 184)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 11: Phase 8 Interface Preparation & AI Quarantine ---');
  assert(AI_ENABLED === false, 'AI_ENABLED is explicitly false (Phase 7 rule)');
  const parsedReqs = await requirementAnalyzer.analyzeRequirements({
    title: 'Health Portal',
    description: 'Patient appointments\n• Video consultation\n• Prescription downloads',
  });
  assert(parsedReqs.metadata.aiEnabled === false, 'RequirementAnalyzer operating deterministically');
  assert(parsedReqs.features.length >= 2, 'RequirementAnalyzer successfully parsed feature bullet points');

  console.log('\n================================================================');
  console.log(`  ALL ${passedTests} OF ${totalTests} TESTS PASSED SUCCESSFULLY!  `);
  console.log('================================================================\n');
}

runTestSuite().catch((err) => {
  console.error('\n❌ Phase 7 test suite failed:', err);
  process.exit(1);
});
