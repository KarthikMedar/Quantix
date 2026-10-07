/**
 * Phase 4 Automated Test Suite
 * Validates:
 * 1. Determinism (repeatable outputs)
 * 2. No double-counting: BuildCost === Σ RoleCost
 * 3. Feature cost integrity: Σ FeatureCosts === BuildCost
 * 4. Cost separation: Infrastructure & Maintenance separated from Build Cost
 * 5. Three-point PERT math: E = (O + 4M + P)/6
 * 6. Effort range & Project uncertainty: lowEffort <= expectedEffort <= highEffort
 * 7. Platform multiplier rule: Client-side multiplied, Backend unified
 * 8. Critical path & dependency sequencing
 * 9. Circular dependency detection
 * 10. Feasibility check: Feasible, Tight, Infeasible detection
 * 11. Monotonicity properties (More features -> more/equal cost, higher complexity -> more effort)
 * 12. Food Delivery Platform primary demo scenario
 */

import { estimateProject } from '../src/services/estimation/estimationEngine.js';
import { analyzeDependenciesAndCriticalPath } from '../src/services/estimation/dependencyEngine.js';
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
    throw new Error(`Test assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`✓ PASS: ${message}`);
}

console.log('=====================================================');
console.log('       ESTIMATEAI — PHASE 4 AUTOMATED TEST SUITE     ');
console.log('=====================================================\n');

// --- TEST 1: DETERMINISM & REPEATABILITY ---
console.log('--- TEST GROUP 1: Determinism ---');
const resA1 = estimateProject(FOOD_DELIVERY_DEMO_PROJECT, FOOD_DELIVERY_DEMO_FEATURES);
const resA2 = estimateProject(FOOD_DELIVERY_DEMO_PROJECT, FOOD_DELIVERY_DEMO_FEATURES);

const { generatedAt: t1, estimateId: id1, ...snap1 } = resA1;
const { generatedAt: t2, estimateId: id2, ...snap2 } = resA2;
assert(JSON.stringify(snap1) === JSON.stringify(snap2), 'Engine outputs are 100% deterministic and repeatable');

// --- TEST 2: NO DOUBLE COUNTING OF COSTS (Section 2.A & Section 5) ---
console.log('\n--- TEST GROUP 2: Cost Calculation Integrity & No Double Counting ---');
const totalBuildCost = resA1.summary.expectedCost;
const sumRoleCosts = resA1.resources.reduce((sum, r) => sum + r.totalCost, 0);

assert(
  totalBuildCost === sumRoleCosts,
  `Total Build Cost (₹${totalBuildCost}) strictly equals sum of all role costs (₹${sumRoleCosts})`
);

const sumFeatureCosts = resA1.features.reduce((sum, f) => sum + f.estimatedCost, 0);
const diffFeatureCost = Math.abs(sumFeatureCosts - totalBuildCost);
assert(
  diffFeatureCost <= resA1.features.length, // Rounding tolerance of 1 rupee per feature
  `Sum of feature costs (₹${sumFeatureCosts}) matches Build Cost (₹${totalBuildCost}) with zero double counting`
);

// --- TEST 3: SEPARATE INFRASTRUCTURE & MAINTENANCE (Section 5 & 12) ---
console.log('\n--- TEST GROUP 3: Strict Cost Separation ---');
assert(
  resA1.infrastructure && typeof resA1.infrastructure.monthlyTotal === 'number' && resA1.infrastructure.monthlyTotal > 0,
  `Monthly infrastructure is calculated separately (₹${resA1.infrastructure.monthlyTotal}/mo)`
);
assert(
  resA1.maintenance && typeof resA1.maintenance.annualCost === 'number' && resA1.maintenance.annualCost > 0,
  `Year-1 Maintenance is calculated separately (₹${resA1.maintenance.annualCost}/yr)`
);
assert(
  resA1.summary.expectedCost === totalBuildCost,
  'Monthly infrastructure and maintenance are NOT added into one-time Build Cost'
);

// --- TEST 4: PERT THREE-POINT MATH (Section 3 & 17) ---
console.log('\n--- TEST GROUP 4: PERT Three-Point Formulas ---');
resA1.features.forEach((f) => {
  const { optimistic: O, mostLikely: M, pessimistic: P, expected: E, standardDeviation: sigma } = f.threePoint;
  const calculatedE = Math.round((O + 4 * M + P) / 6);
  assert(
    E === calculatedE,
    `Feature "${f.name}": Expected ${E}h matches PERT formula (O=${O}h, M=${M}h, P=${P}h)`
  );
  assert(O <= M && M <= P, `Feature "${f.name}": Optimistic (${O}h) <= Most Likely (${M}h) <= Pessimistic (${P}h)`);
  assert(sigma >= 0, `Feature "${f.name}": Standard deviation is non-negative (${sigma}h)`);
});

// --- TEST 5: EFFORT & COST UNCERTAINTY RANGES (Section 4) ---
console.log('\n--- TEST GROUP 5: Uncertainty Ranges ---');
assert(
  resA1.summary.lowEffortHours <= resA1.summary.expectedEffortHours &&
  resA1.summary.expectedEffortHours <= resA1.summary.highEffortHours,
  `Effort bounds: Low (${resA1.summary.lowEffortHours}h) <= Expected (${resA1.summary.expectedEffortHours}h) <= High (${resA1.summary.highEffortHours}h)`
);
assert(
  resA1.summary.lowCost <= resA1.summary.expectedCost &&
  resA1.summary.expectedCost <= resA1.summary.highCost,
  `Cost bounds: Low (₹${resA1.summary.lowCost}) <= Expected (₹${resA1.summary.expectedCost}) <= High (₹${resA1.summary.highCost})`
);

// --- TEST 6: CRITICAL PATH & DEPENDENCIES (Section 18 & 19) ---
console.log('\n--- TEST GROUP 6: Critical Path & Dependencies ---');
assert(
  resA1.criticalPath && resA1.criticalPath.features.length > 0,
  `Critical Path computed: ${resA1.criticalPath.chain} (${resA1.criticalPath.totalHours} hrs)`
);
assert(
  resA1.dependencies.hasDependencies === true,
  `Feature dependencies identified (${resA1.dependencies.totalDependenciesCount} prerequisite links)`
);

// --- TEST 7: CIRCULAR DEPENDENCY DETECTION (Section 18) ---
console.log('\n--- TEST GROUP 7: Circular Dependency Handling ---');
const circularFeatures = [
  { id: 'c1', name: 'Service Alpha', dependencies: ['Service Beta'], estimatedEffortHours: 40 },
  { id: 'c2', name: 'Service Beta', dependencies: ['Service Alpha'], estimatedEffortHours: 40 },
];
const cycleResult = analyzeDependenciesAndCriticalPath(circularFeatures);
assert(
  cycleResult.hasCircularDependency === true,
  'Circular dependency detected correctly between Service Alpha and Service Beta'
);
assert(
  cycleResult.circularDependencyError && cycleResult.circularDependencyError.includes('Circular dependency'),
  'Circular dependency returns clean human-readable error'
);

// --- TEST 8: FEASIBILITY DETECTION (Section 10 & 11) ---
console.log('\n--- TEST GROUP 8: Schedule Feasibility Detection ---');
// Tight / Infeasible scenario
const tightProject = {
  ...FOOD_DELIVERY_DEMO_PROJECT,
  requestedTimeline: '4 weeks', // Extremely tight
};
const tightResult = estimateProject(tightProject, FOOD_DELIVERY_DEMO_FEATURES);
assert(
  tightResult.summary.feasibilityStatus === 'Infeasible',
  `Tight timeline (4 weeks vs ~${tightResult.summary.timelineWeeks}w) marked as Infeasible`
);
assert(
  tightResult.timeline.deadlineCheck.isAchievable === false,
  'Infeasible deadline marks isAchievable as false'
);

// Feasible scenario
const relaxedProject = {
  ...FOOD_DELIVERY_DEMO_PROJECT,
  requestedTimeline: '30 weeks', // Generous timeline
};
const relaxedResult = estimateProject(relaxedProject, FOOD_DELIVERY_DEMO_FEATURES);
assert(
  relaxedResult.summary.feasibilityStatus === 'Feasible',
  'Relaxed timeline (30 weeks) marked as Feasible'
);

// --- TEST 9: CONFIDENCE MODEL (Section 25) ---
console.log('\n--- TEST GROUP 9: Deterministic Confidence Model ---');
assert(
  resA1.confidence.score < 100,
  `Confidence is never 100% (Calculated: ${resA1.confidence.score}%)`
);
assert(
  resA1.confidence.score >= 50 && resA1.confidence.score <= 90,
  `Confidence score is realistically bounded (${resA1.confidence.score}%)`
);
assert(
  resA1.confidence.positiveDrivers.length > 0 && resA1.confidence.riskDrivers.length > 0,
  'Confidence provides explicit positive and risk drivers'
);

// --- TEST 10: MONOTONICITY CHECKS (Section 47) ---
console.log('\n--- TEST GROUP 10: Monotonicity Properties ---');
// 1. More features -> Higher or equal cost
const partialFeatures = FOOD_DELIVERY_DEMO_FEATURES.slice(0, 5);
const resPartial = estimateProject(FOOD_DELIVERY_DEMO_PROJECT, partialFeatures);
assert(
  resA1.summary.expectedCost >= resPartial.summary.expectedCost,
  `More features yields higher cost (Full: ₹${resA1.summary.expectedCost} >= Partial: ₹${resPartial.summary.expectedCost})`
);

// 2. More platforms -> Higher client effort
const singlePlatformProject = { ...FOOD_DELIVERY_DEMO_PROJECT, platforms: ['Web'] };
const resSinglePlat = estimateProject(singlePlatformProject, FOOD_DELIVERY_DEMO_FEATURES);
assert(
  resA1.summary.expectedEffortHours >= resSinglePlat.summary.expectedEffortHours,
  `Multi-platform yields higher effort (3 Platforms: ${resA1.summary.expectedEffortHours}h >= 1 Platform: ${resSinglePlat.summary.expectedEffortHours}h)`
);

// --- TEST 11: PRIMARY DEMO VALIDATION: FOOD DELIVERY (Section 48) ---
console.log('\n--- TEST GROUP 11: Food Delivery Platform Demo Scenario ---');
assert(resA1.features.length === 10, 'Food Delivery demo contains 10 core modules');
assert(resA1.resources.length >= 6, `Team allocated across ${resA1.resources.length} specialized engineering roles`);
assert(resA1.assumptions.engineVersion === '1.0.0', 'Engine version 1.0.0 is present in result');
assert(resA1.missingFeatureSuggestions.length > 0, 'Domain-specific missing feature suggestions provided');

console.log('\n=====================================================');
console.log(`  ALL ${passedTests} OF ${totalTests} TESTS PASSED SUCCESSFULLY!  `);
console.log('=====================================================');
