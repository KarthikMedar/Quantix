/**
 * Effort Estimation Engine (Phase 4 Specification)
 * Deterministic calculation of engineering hours using:
 * - Three-Point PERT Estimation (Optimistic, Most Likely, Pessimistic)
 * - Standard deviation and uncertainty ranges
 * - Client-side only platform multiplier rule (Backend unified)
 * - Base effort allocated across all project roles (Dev, UI/UX, QA, PM, DevOps)
 * - Project-level variance with 1.10 correlation widening factor
 * - Large feature threshold detection (> 250h)
 *
 * NO RANDOM NUMBERS (Math.random) ARE USED.
 */

import { parsePlatformMultiplier, parseUserScaleFactor } from './estimationRules.js';
import { ESTIMATION_CONFIG } from '../../config/estimationConfig.js';

/**
 * Calculates deterministic PERT three-point effort hours for an individual feature.
 */
export const calculateFeatureEffort = (feature, complexityAnalysis, project = {}) => {
  const { factors, level, score } = complexityAnalysis;

  // 1. Base hours anchored to complexity tier
  let baseHours = 30; // LOW base
  if (level === 'VERY HIGH') {
    baseHours = 220;
  } else if (level === 'HIGH') {
    baseHours = 110;
  } else if (level === 'MEDIUM') {
    baseHours = 50;
  }

  // 2. 9-Factor Adders (Deterministic contributions from 0-5 scores)
  const technicalHours = factors.technical * 6;
  const dbHours = factors.database * 6;
  const integrationHours = factors.integration * 8;
  const securityHours = factors.security * 5;
  const uiHours = factors.uiUx * 5;
  const realTimeHours = factors.realTime * 7;
  const aiHours = factors.aiMl * 9;
  const dependencyHours = factors.dependencies * 4;

  const rawHours =
    baseHours +
    technicalHours +
    dbHours +
    integrationHours +
    securityHours +
    uiHours +
    realTimeHours +
    aiHours +
    dependencyHours;

  // 3. Platform Multiplier Rule: Applied ONLY to client-side portion
  // Backend work has NO platform multiplier applied. Client-side work is adjusted.
  const platformInfo = parsePlatformMultiplier(project.platforms);
  const scaleInfo = parseUserScaleFactor(project.expectedUsers);

  // Split: ~45% client-side (Frontend / Mobile UI) vs ~55% server-side core (Backend, DB, API)
  const clientRatio = 0.45;
  const serverRatio = 0.55;

  const clientWorkHours = rawHours * clientRatio * platformInfo.multiplier * scaleInfo.multiplier;
  const serverWorkHours = rawHours * serverRatio * 1.0 * scaleInfo.multiplier;

  // Most Likely (M) Effort Hours
  const mostLikelyHours = Math.round(clientWorkHours + serverWorkHours);

  // 4. Three-Point PERT Estimation (Optimistic O, Most Likely M, Pessimistic P)
  // Optimistic assumes reusable libraries, straightforward third-party APIs, clean specifications
  const optimisticRatio = level === 'LOW' ? 0.75 : 0.70;
  const optimisticHours = Math.max(8, Math.round(mostLikelyHours * optimisticRatio));

  // Pessimistic accounts for integration hiccups, edge case data models, and scope churn
  const pessimisticFactor = 1.50 + (factors.technical + factors.integration) * 0.02;
  const pessimisticHours = Math.round(mostLikelyHours * pessimisticFactor);

  // PERT Expected = (O + 4M + P) / 6
  const pertExpectedHours = Math.round((optimisticHours + 4 * mostLikelyHours + pessimisticHours) / 6);

  // PERT Standard Deviation = (P - O) / 6
  const standardDeviation = parseFloat(((pessimisticHours - optimisticHours) / 6).toFixed(1));
  const variance = parseFloat(Math.pow(standardDeviation, 2).toFixed(2));

  // Feature-level effort range [low, high]
  const lowEffortHours = Math.max(1, Math.round(pertExpectedHours - 1.5 * standardDeviation));
  const highEffortHours = Math.round(pertExpectedHours + 1.5 * standardDeviation);

  // 5. Large Feature Advisory Threshold
  const isLargeFeature = pertExpectedHours >= ESTIMATION_CONFIG.multipliers.largeFeatureThresholdHours;
  const largeFeatureWarning = isLargeFeature
    ? `This feature (${pertExpectedHours}h) exceeds the recommended size threshold (250h). Consider decomposing into smaller sub-features for lower estimation uncertainty.`
    : null;

  // 6. Base Effort Distribution across ALL project roles (NOT developer only!)
  // Development (Frontend + Backend: 60%), UI/UX: 14%, QA: 15%, PM: 6%, DevOps: 5%
  const frontendHours = Math.round(pertExpectedHours * 0.32);
  const backendHours = Math.round(pertExpectedHours * 0.28);
  const uiUxHours = Math.round(pertExpectedHours * 0.14);
  const qaHours = Math.round(pertExpectedHours * 0.15);
  const pmHours = Math.round(pertExpectedHours * 0.06);
  const devopsHours = Math.round(pertExpectedHours * 0.05);

  return {
    featureId: feature.id,
    featureName: feature.name,
    level,
    score,
    source: feature.source || 'AI Suggested', // 'AI Suggested' vs 'User Edited'
    threePoint: {
      optimistic: optimisticHours,
      mostLikely: mostLikelyHours,
      pessimistic: pessimisticHours,
      expected: pertExpectedHours,
      standardDeviation,
      variance,
      range: `${lowEffortHours}h – ${highEffortHours}h`,
    },
    estimatedEffortHours: pertExpectedHours,
    lowEffortHours,
    highEffortHours,
    isLargeFeature,
    largeFeatureWarning,
    breakdown: {
      frontendHours,
      backendHours,
      uiUxHours,
      qaHours,
      pmHours,
      devopsHours,
    },
    factorsContribution: {
      baseHours,
      technicalHours,
      dbHours,
      integrationHours,
      securityHours,
      uiHours,
      realTimeHours,
      aiHours,
      dependencyHours,
      clientSideMultipliedHours: Math.round(clientWorkHours),
      serverSideUnifiedHours: Math.round(serverWorkHours),
    },
  };
};

/**
 * Calculates aggregate project engineering effort across all features.
 * Computes project-level PERT expected hours, standard deviation, and uncertainty range.
 */
export const calculateTotalProjectEffort = (featureEfforts = [], project = {}) => {
  // Sum of expected feature hours across all roles
  const sumExpectedHours = featureEfforts.reduce((acc, f) => acc + f.estimatedEffortHours, 0);

  // Role aggregation directly from feature breakdowns
  const totalFrontendHours = featureEfforts.reduce((acc, f) => acc + f.breakdown.frontendHours, 0);
  const totalBackendHours = featureEfforts.reduce((acc, f) => acc + f.breakdown.backendHours, 0);
  const totalUiUxHours = featureEfforts.reduce((acc, f) => acc + f.breakdown.uiUxHours, 0);
  const totalQaHours = featureEfforts.reduce((acc, f) => acc + f.breakdown.qaHours, 0);
  const totalPmHours = featureEfforts.reduce((acc, f) => acc + f.breakdown.pmHours, 0);
  const totalDevopsHours = featureEfforts.reduce((acc, f) => acc + f.breakdown.devopsHours, 0);

  // Project Uncertainty & Range (with 1.10 correlation widening factor)
  const sumVariances = featureEfforts.reduce((acc, f) => acc + f.threePoint.variance, 0);
  const correlationFactor = ESTIMATION_CONFIG.multipliers.correlationWideningFactor || 1.10;
  
  // Total Project Standard Deviation = correlationFactor × sqrt(Σ variances)
  const projectStdDev = parseFloat((correlationFactor * Math.sqrt(sumVariances)).toFixed(1));

  // 90% Confidence Interval: Expected ± 1.64 σ
  const lowEffortHours = Math.max(0, Math.round(sumExpectedHours - 1.64 * projectStdDev));
  const highEffortHours = Math.round(sumExpectedHours + 1.64 * projectStdDev);

  return {
    totalEffortHours: sumExpectedHours,
    expectedHours: sumExpectedHours,
    lowEffortHours,
    highEffortHours,
    effortRange: `${lowEffortHours}h – ${highEffortHours}h`,
    standardDeviation: projectStdDev,
    correlationFactor,
    largeFeatureCount: featureEfforts.filter((f) => f.isLargeFeature).length,
    disciplineHours: {
      frontend: totalFrontendHours,
      backend: totalBackendHours,
      uiUx: totalUiUxHours,
      qa: totalQaHours,
      devops: totalDevopsHours,
      projectManagement: totalPmHours,
    },
  };
};
