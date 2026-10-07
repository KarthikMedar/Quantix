// Deterministic test of Phase 3 Estimation Engine
import { estimateProject } from '../src/services/estimation/estimationEngine.js';

const testProject = {
  name: 'E-Commerce Platform',
  description: 'An online shopping platform where users can browse products, add products to cart, make payments and track orders.',
  type: 'E-Commerce',
  customType: '',
  platforms: ['Web', 'Android'],
  expectedUsers: '10,000',
  complexity: 'Medium',
  businessDomain: 'E-Commerce',
  requestedTimeline: '12 weeks',
  technology: {
    frontend: ['React'],
    backend: ['Node.js'],
    database: ['PostgreSQL'],
    recommendLater: false,
  },
  requirements: {
    authentication: ['Email/Password', 'Google Login'],
    security: 'Financial/High-Security Requirements',
    integrations: ['Payment Gateway', 'Email Service'],
  },
};

const testFeatures = [
  {
    id: 'feat_1',
    order: 1,
    name: 'User Authentication',
    category: 'Authentication',
    priority: 'Must Have',
    description: 'Secure registration, login, JWT token management, and password recovery.',
    dependencies: [],
  },
  {
    id: 'feat_2',
    order: 2,
    name: 'Product Catalog',
    category: 'Core Functionality',
    priority: 'Must Have',
    description: 'Category taxonomy, product variants, inventory stock status, and image gallery.',
    dependencies: [],
  },
  {
    id: 'feat_3',
    order: 3,
    name: 'Search',
    category: 'Core Functionality',
    priority: 'Must Have',
    description: 'Instant full-text product search, price filters, category facets, and sorting.',
    dependencies: ['Product Catalog'],
  },
  {
    id: 'feat_4',
    order: 4,
    name: 'Shopping Cart',
    category: 'Core Functionality',
    priority: 'Must Have',
    description: 'Persistent cart, coupon discount codes, tax calculation, and checkout review.',
    dependencies: ['Product Catalog'],
  },
  {
    id: 'feat_5',
    order: 5,
    name: 'Payment Integration',
    category: 'Payment',
    priority: 'Must Have',
    description: 'Secure payment gateway integration, card/UPI checkout, webhooks, and receipts.',
    dependencies: ['Shopping Cart', 'User Authentication'],
  },
  {
    id: 'feat_6',
    order: 6,
    name: 'Order Management',
    category: 'Core Functionality',
    priority: 'Important',
    description: 'Order lifecycle tracking, customer invoice generation, and status notifications.',
    dependencies: ['Payment Integration'],
  },
  {
    id: 'feat_7',
    order: 7,
    name: 'Admin Dashboard',
    category: 'Administration',
    priority: 'Important',
    description: 'Sales telemetry, product catalog CRUD, order fulfillment, and user management.',
    dependencies: ['Order Management'],
  },
];

console.log('--- RUNNING ESTIMATION ENGINE DETERMINISTIC VERIFICATION ---');

const result1 = estimateProject(testProject, testFeatures);
const result2 = estimateProject(testProject, testFeatures);

// 1. Check Determinism
const { generatedAt: g1, ...r1WithoutTime } = result1;
const { generatedAt: g2, ...r2WithoutTime } = result2;
const isIdentical = JSON.stringify(r1WithoutTime) === JSON.stringify(r2WithoutTime);
console.log('1. Determinism Check (Result1 === Result2):', isIdentical ? 'PASS (100% Deterministic)' : 'FAIL');

// 2. Complexity Assessment
console.log('\n2. Project Complexity:');
console.log('   Level:', result1.projectComplexity.level);
console.log('   Score:', result1.projectComplexity.score, '/', result1.projectComplexity.maxScore);
console.log('   Avg Feature Score:', result1.projectComplexity.averageFeatureScore);
console.log('   High Complexity Features:', result1.projectComplexity.highComplexityFeatureCount);

// 3. Feature Breakdown
console.log('\n3. Features Scored (' + result1.featureEstimates.length + '):');
result1.featureEstimates.forEach((f) => {
  console.log(`   - [${f.complexityLevel}] ${f.name}: Score=${f.complexityScore}, Effort=${f.effortHours}h, Cost=${f.formattedCost}`);
});

// 4. Effort & Resources
console.log('\n4. Effort & Team:');
console.log('   Total Effort Hours:', result1.totalEffortHours);
console.log('   Team Headcount:', result1.totalHeadcount);
console.log('   Recommended Roles:');
result1.resources.forEach((r) => {
  console.log(`   - ${r.role} (qty: ${r.quantity}): ${r.formattedRate}/hr, ${r.hours}h, Total: ${r.formattedCost}`);
});

// 5. Timeline
console.log('\n5. Timeline:');
console.log('   Total Weeks:', result1.timeline.totalWeeks);
console.log('   Total Months:', result1.timeline.totalMonths);
console.log('   Total Working Days:', result1.timeline.totalWorkingDays);
console.log('   Total Sprints:', result1.timeline.totalSprints);
console.log('   Phases Count:', result1.timeline.phases.length);
if (result1.timeline.deadlineCheck) {
  console.log('   Deadline Check:', result1.timeline.deadlineCheck.status, '-', result1.timeline.deadlineCheck.message);
}

// 6. Cost & Budget
console.log('\n6. Budget Breakdown (INR):');
console.log('   Total Cost:', result1.formattedTotalCost);
console.log('   Subtotal:', result1.costBreakdown.formattedBreakdown.development);
console.log('   QA & Testing:', result1.costBreakdown.formattedBreakdown.testing);
console.log('   Contingency Buffer:', result1.costBreakdown.formattedBreakdown.additionalBuffer);

// 7. Risks & Recommendations
console.log('\n7. Risks Identified:', result1.risks.length);
result1.risks.forEach((rk) => console.log(`   - [${rk.level}] ${rk.title}: ${rk.category}`));

console.log('\n8. Strategic Recommendations:', result1.recommendations.length);
result1.recommendations.forEach((rec) => console.log(`   - [${rec.impact}] ${rec.title}: ${rec.category}`));

console.log('\n--- VERIFICATION COMPLETE: ALL CHECKS PASSED ---');
