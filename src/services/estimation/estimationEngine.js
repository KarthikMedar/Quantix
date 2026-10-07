/**
 * Central Estimation Engine Coordinator (Phase 4 Specification)
 * Deterministically executes the complete software estimation pipeline:
 * analyzeFeatures -> calculateEffort (PERT) -> calculateResources -> calculateTimeline ->
 * analyzeDependencies & Critical Path -> calculateCosts (No double counting) ->
 * analyzeRisks -> calculateConfidence -> generateRecommendations -> complete structured result.
 *
 * NO RANDOM NUMBERS (Math.random) ARE USED.
 */

import { ESTIMATION_CONFIG } from '../../config/estimationConfig.js';
import { analyzeFeatureComplexity, calculateProjectComplexity } from './complexityEngine.js';
import { calculateFeatureEffort, calculateTotalProjectEffort } from './effortEngine.js';
import { recommendProjectResources } from './resourceEngine.js';
import { calculateProjectTimeline } from './timelineEngine.js';
import { calculateProjectCosts } from './costEngine.js';
import { analyzeProjectRisks } from './riskEngine.js';
import { generateProjectRecommendations } from './recommendationEngine.js';
import { analyzeDependenciesAndCriticalPath } from './dependencyEngine.js';
import { calculateProjectConfidence } from './confidenceEngine.js';

/**
 * Domain-specific potentially missing feature suggestions
 */
const DOMAIN_MISSING_FEATURE_SUGGESTIONS = {
  'food delivery': [
    { name: 'Restaurant Partner Portal & Menu Manager', category: 'Administration', priority: 'Important', description: 'Restaurant vendor dashboard for updating real-time inventory, item availability, and meal specials.' },
    { name: 'Delivery Partner Driver App & Live Geolocation', category: 'Core Functionality', priority: 'Must Have', description: 'Native driver interface for accepting order dispatches, live turn-by-turn routing, and earnings telemetry.' },
    { name: 'Push Notifications & SMS Alerts', category: 'Integration', priority: 'Must Have', description: 'Automated order stage notifications (order accepted, preparing, out for delivery) via Firebase & Twilio.' },
    { name: 'Refund & Dispute Resolution Workflow', category: 'Operations', priority: 'Important', description: 'Customer support ticketing, automated transaction refund authorizations, and complaint logging.' },
    { name: 'Customer Ratings & Photo Reviews', category: 'Engagement', priority: 'Nice to Have', description: 'Star ratings, dishes feedback, delivery agent tips, and photo uploads with moderation.' },
  ],
  'e-commerce': [
    { name: 'Inventory Stock Alerts & Multi-Warehouse Sync', category: 'Core Functionality', priority: 'Important', description: 'Automated low-stock threshold triggers, multi-location stock routing, and backorder holds.' },
    { name: 'Coupons, Promo Codes & Referral Engine', category: 'Monetization', priority: 'Important', description: 'Configurable cart percentage discounts, promotional banner rules, and viral referral credits.' },
    { name: 'Returns & RMA Reverse Logistics Pipeline', category: 'Operations', priority: 'Important', description: 'Self-service customer return requests, courier pickup scheduling, and return parcel inspection tracking.' },
    { name: 'Transactional Email & SMS Delivery Notifications', category: 'Integration', priority: 'Must Have', description: 'Order confirmation receipts, dispatch tracking links, and delivery confirmation webhooks.' },
    { name: 'Product Q&A and Verified Buyer Reviews', category: 'Engagement', priority: 'Nice to Have', description: 'Community questions, verified purchase badges, review upvoting, and image attachments.' },
  ],
  default: [
    { name: 'Role-Based Access Control (RBAC) & Team Workspaces', category: 'Security', priority: 'Must Have', description: 'Granular administrative permissions, team member invites, and workspace audit logs.' },
    { name: 'Audit Trail & Activity Compliance Export', category: 'Compliance', priority: 'Important', description: 'Immutable log of administrative operations, data changes, and CSV compliance report downloads.' },
    { name: 'Transactional Email & Webhook Delivery Engine', category: 'Integration', priority: 'Important', description: 'Reliable transactional messaging with retry queues and deliverability bounce telemetry.' },
  ],
};

/**
 * Runs the deterministic estimation pipeline on project and feature data.
 * @param {Object} project - The project metadata collected in Phase 2
 * @param {Array} features - The array of feature objects collected in Phase 2
 * @returns {Object} Complete structured estimation result object adhering to Phase 4 contract
 */
export const estimateProject = (project = {}, features = []) => {
  // Validate inputs
  if (!project || typeof project !== 'object') {
    throw new Error('Project definition is required for estimation.');
  }
  if (!Array.isArray(features) || features.length === 0) {
    throw new Error('At least one software feature is required to generate an estimate.');
  }
  if (features.length > 100) {
    throw new Error('Maximum 100 features allowed per project estimation.');
  }

  // Feature item validation
  for (let i = 0; i < features.length; i++) {
    const f = features[i];
    if (!f || typeof f !== 'object') {
      throw new Error(`Feature at index ${i + 1} must be a valid object.`);
    }
    if (!f.name || typeof f.name !== 'string' || !f.name.trim()) {
      throw new Error(`Feature at index ${i + 1} must have a non-empty name.`);
    }
    if (f.name.length > 250) {
      throw new Error(`Feature name at index ${i + 1} exceeds maximum length of 250 characters.`);
    }
  }

  // Timeline validation if requested
  if (project.requestedTimelineWeeks !== undefined && project.requestedTimelineWeeks !== null) {
    const reqWeeks = Number(project.requestedTimelineWeeks);
    if (!isFinite(reqWeeks) || reqWeeks <= 0) {
      throw new Error('Requested timeline must be a positive number of weeks.');
    }
    if (reqWeeks > 208) {
      throw new Error('Requested timeline cannot exceed 208 weeks (4 years).');
    }
  }

  // 1. Analyze Feature Complexities (9 Factors)
  const featureComplexities = features.map((feature) =>
    analyzeFeatureComplexity(feature, project)
  );

  // 2. Calculate Project-Level Complexity
  const projectComplexity = calculateProjectComplexity(featureComplexities, project);

  // 3. Calculate Effort Hours per Feature (PERT Three-Point, Client-Side Multipliers)
  const featureEfforts = features.map((feature, idx) =>
    calculateFeatureEffort(feature, featureComplexities[idx], project)
  );

  // 4. Calculate Aggregate Discipline & Total Project Effort (with PERT variance)
  const totalEffortData = calculateTotalProjectEffort(featureEfforts, project);

  // 5. Recommend Team Roles, Headcount & Hours
  const resourceData = recommendProjectResources(
    totalEffortData,
    projectComplexity,
    project,
    features
  );

  // 6. Calculate Timeline, Sprints & Gantt Phases
  const timelineData = calculateProjectTimeline(
    totalEffortData.totalEffortHours,
    resourceData,
    project
  );

  // 7. Analyze Dependencies, Circular Dependencies & Critical Path
  const dependenciesData = analyzeDependenciesAndCriticalPath(
    features.map((f, idx) => ({
      ...f,
      estimatedEffortHours: featureEfforts[idx].estimatedEffortHours,
      threePoint: featureEfforts[idx].threePoint,
    })),
    timelineData.effectiveTeamHoursPerWeek
  );

  // 8. Calculate Financial Costs & Budget Breakdown (Build Cost = Σ RoleCost, No Double Counting)
  const costData = calculateProjectCosts(resourceData, featureEfforts, project, totalEffortData);

  // 9. Identify Architectural & Delivery Risks
  const risksData = analyzeProjectRisks(
    project,
    features,
    projectComplexity,
    timelineData,
    dependenciesData
  );

  // 10. Compute Deterministic Confidence Model
  const confidenceData = calculateProjectConfidence({
    project,
    features,
    complexityData: projectComplexity,
    timelineData,
    dependenciesData,
  });

  // 11. Generate Strategic & Engineering Recommendations
  const recommendations = generateProjectRecommendations({
    project,
    features: featureEfforts.map((eff, i) => ({
      ...features[i],
      estimatedEffortHours: eff.estimatedEffortHours,
      threePoint: eff.threePoint,
    })),
    complexityData: projectComplexity,
    effortData: totalEffortData,
    resourceData,
    timelineData,
    costData,
    risks: risksData.items,
  });

  // 12. Determine Domain-specific Missing Feature Suggestions
  const domainKey = (project.type || project.businessDomain || '').toLowerCase();
  let suggestionPool = DOMAIN_MISSING_FEATURE_SUGGESTIONS['default'];
  if (domainKey.includes('food') || domainKey.includes('restaurant') || domainKey.includes('delivery')) {
    suggestionPool = DOMAIN_MISSING_FEATURE_SUGGESTIONS['food delivery'];
  } else if (domainKey.includes('e-commerce') || domainKey.includes('commerce') || domainKey.includes('retail') || domainKey.includes('shop')) {
    suggestionPool = DOMAIN_MISSING_FEATURE_SUGGESTIONS['e-commerce'];
  }

  // Filter out suggestions that are already in the feature roster
  const existingNames = new Set(features.map((f) => f.name.toLowerCase().trim()));
  const missingFeatureSuggestions = suggestionPool.filter(
    (sug) => !existingNames.has(sug.name.toLowerCase().trim())
  );

  // 13. Combine Feature Estimates into a consolidated list for UI presentation
  const consolidatedFeatures = features.map((feature, idx) => {
    const comp = featureComplexities[idx];
    const eff = featureEfforts[idx];
    const cst = costData.featureCosts[idx];

    return {
      id: feature.id,
      order: idx + 1,
      name: feature.name,
      description: feature.description,
      category: feature.category || 'Core Functionality',
      priority: feature.priority || 'Must Have',
      dependencies: feature.dependencies || [],
      source: eff.source || 'AI Suggested', // 'AI Suggested' vs 'User Edited'
      complexityLevel: comp.level,
      complexityScore: comp.score,
      maxScore: comp.maxScore,
      factors: comp.factors,
      reasons: comp.reasons,
      threePoint: eff.threePoint, // O, M, P, E, σ
      effortHours: eff.estimatedEffortHours,
      lowEffortHours: eff.lowEffortHours,
      highEffortHours: eff.highEffortHours,
      effortRange: eff.threePoint.range,
      isLargeFeature: eff.isLargeFeature,
      largeFeatureWarning: eff.largeFeatureWarning,
      breakdown: eff.breakdown,
      estimatedCost: cst ? cst.estimatedCost : 0,
      formattedCost: cst ? cst.formattedCost : '₹0',
      costShareRatio: cst ? cst.costShareRatio : 0,
    };
  });

  // 14. Feasibility status extraction
  const feasibilityStatus = timelineData.deadlineCheck?.status || 'Feasible';
  const feasibilityMessage = timelineData.deadlineCheck?.message || 'Timeline is within standard delivery parameters.';

  // 15. Assemble Complete Phase 4 Result Data Contract
  return {
    estimateId: `est_${Date.now()}`,
    engineVersion: ESTIMATION_CONFIG.version.engineVersion,
    configVersion: ESTIMATION_CONFIG.version.configVersion,
    rateVersion: ESTIMATION_CONFIG.version.rateVersion,

    summary: {
      expectedCost: costData.totalBuildCost,
      lowCost: costData.lowCost,
      highCost: costData.highCost,
      formattedExpectedCost: costData.formattedBuildCost,
      formattedCostRange: costData.formattedCostRange,
      expectedEffortHours: totalEffortData.expectedHours,
      lowEffortHours: totalEffortData.lowEffortHours,
      highEffortHours: totalEffortData.highEffortHours,
      formattedEffortRange: totalEffortData.effortRange,
      timelineWeeks: timelineData.totalWeeks,
      requestedTimelineWeeks: timelineData.deadlineCheck?.requestedWeeks || null,
      timelineMonths: timelineData.totalMonths,
      feasibilityStatus, // 'Feasible' | 'Tight' | 'Infeasible'
      feasibilityMessage,
      riskScore: risksData.score,
      riskLevel: risksData.level,
      confidence: confidenceData.score,
      confidenceLevel: confidenceData.level,
      totalTeamFTE: resourceData.totalHeadcount,
      roleCount: resourceData.roleCount,
      featureCount: features.length,
    },

    projectSummary: {
      name: project.name || 'Untitled Project',
      description: project.description || '',
      type: project.type === 'Other' ? project.customType : project.type,
      domain: project.businessDomain || 'Technology',
      platforms: project.platforms || ['Web'],
      expectedUsers: project.expectedUsers || '10,000',
      initialUserComplexity: project.complexity || 'Medium',
      technology: project.technology || {},
      requirements: project.requirements || {},
      requestedTimeline: project.requestedTimeline || project.targetDeadline || null,
    },

    projectComplexity,
    features: consolidatedFeatures,
    featureEstimates: consolidatedFeatures, // Backward-compatible alias
    totalEffort: totalEffortData,
    totalEffortHours: totalEffortData.totalEffortHours,
    resources: resourceData.resources,
    totalHeadcount: resourceData.totalHeadcount,
    timeline: timelineData,
    criticalPath: dependenciesData.criticalPath,
    dependencies: dependenciesData,
    costBreakdown: costData,
    totalCost: costData.totalBuildCost,
    formattedTotalCost: costData.formattedBuildCost,
    infrastructure: costData.infrastructure,
    maintenance: costData.maintenance,
    risks: risksData.items,
    riskAnalysis: risksData,
    confidence: confidenceData,
    recommendations,
    missingFeatureSuggestions,

    // Assumptions Panel Metadata
    assumptions: {
      workingHoursPerDay: ESTIMATION_CONFIG.workingHours.hoursPerDay,
      productiveHoursPerDay: ESTIMATION_CONFIG.workingHours.productiveHoursPerDay,
      workingDaysPerWeek: ESTIMATION_CONFIG.workingHours.daysPerWeek,
      teamEfficiency: `${Math.round(ESTIMATION_CONFIG.workingHours.teamEfficiencyFactor * 100)}% parallel efficiency`,
      contingency: `${Math.round(ESTIMATION_CONFIG.multipliers.contingencyBufferPercentage * 100)}% risk contingency reserve`,
      correlationWideningFactor: ESTIMATION_CONFIG.multipliers.correlationWideningFactor,
      rateTable: ESTIMATION_CONFIG.version.rateTableName,
      platformAdjustment: 'Platform multiplier applies exclusively to client-side UI engineering. Backend core services remain unified with no platform multiplier.',
      engineVersion: ESTIMATION_CONFIG.version.engineVersion,
      configVersion: ESTIMATION_CONFIG.version.configVersion,
      rateVersion: ESTIMATION_CONFIG.version.rateVersion,
    },

    // Explanations for "Why?" interactions
    explanations: {
      cost: [
        'Total expected engineering effort was calculated using Three-Point PERT estimates across all features.',
        'Feature effort was allocated across specialized project disciplines (Dev, UI/UX, QA, PM, DevOps).',
        'Role costs were computed as: Allocated Hours × Standard Hourly Role Rates.',
        'Build Cost equals the exact sum of all role allocations with zero feature-cost double counting.',
        'Monthly infrastructure and optional annual maintenance are strictly separated from the one-time build cost.',
      ],
      timeline: [
        `Active team development capacity is calculated at ${timelineData.effectiveTeamHoursPerWeek} productive hours per week.`,
        'Accounting for 75% parallel efficiency, team synchronization, and code review overhead.',
        `The critical path (${dependenciesData.criticalPath.chain}) dictates the minimum sequential dependency window.`,
        'Includes sequential architectural setup and final UAT stabilization buffers.',
      ],
      team: [
        `Workload is distributed across ${resourceData.totalHeadcount} specialists to ensure balanced sprint allocation.`,
        'Headcount quantities are determined by discipline-specific hour thresholds rather than naive hour division.',
        'Prevents over-allocation and maintains productive team communication boundaries.',
      ],
      confidence: [
        `Calculated deterministically at ${confidenceData.score}% based on architectural inputs and dependency graphs.`,
        `Positive factors: ${confidenceData.positiveDrivers.map((p) => p.factor).join(', ')}.`,
        `Variance factors: ${confidenceData.riskDrivers.map((r) => r.factor).join(', ')}.`,
        'Never inflated to 100% to reflect authentic software engineering delivery reality.',
      ],
    },

    generatedAt: new Date().toISOString(),
  };
};
