/**
 * Feature & Project Complexity Engine
 * Deterministic scoring across 9 architectural factors.
 */

import { COMPLEXITY_RULES, evaluateFactor, parseUserScaleFactor, parsePlatformMultiplier } from './estimationRules.js';
import { ESTIMATION_CONFIG } from '../../config/estimationConfig.js';

/**
 * Evaluates an individual feature's complexity factors and returns score, level, and reasons.
 */
export const analyzeFeatureComplexity = (feature, project = {}) => {
  const text = `${feature.name || ''} ${feature.description || ''}`;
  const category = feature.category || 'Core Functionality';
  const allReasons = [];

  // 1. Technical Difficulty (0-5)
  const techEval = evaluateFactor(text, category, COMPLEXITY_RULES.technical);
  let techScore = techEval.score || 1; // Minimum base 1
  if (techEval.reasons.length > 0) allReasons.push(...techEval.reasons);

  // Category based baseline
  if (category === 'AI/ML') techScore = Math.max(techScore, 4);
  else if (category === 'Payment' || category === 'Security') techScore = Math.max(techScore, 3);
  else if (category === 'Analytics') techScore = Math.max(techScore, 3);

  // 2. Database Complexity (0-5)
  const dbEval = evaluateFactor(text, category, COMPLEXITY_RULES.database);
  let dbScore = dbEval.score;
  if (category === 'Payment' || category === 'Analytics' || category === 'Administration') {
    dbScore = Math.max(dbScore, 3);
  }
  if (dbEval.reasons.length > 0) allReasons.push(...dbEval.reasons);

  // 3. API & Integration Complexity (0-5)
  const intgEval = evaluateFactor(text, category, COMPLEXITY_RULES.integration);
  let intgScore = intgEval.score;
  // If project has payment or maps integration and feature relates to it
  if (project.requirements?.integrations?.includes('Payment Gateway') && /payment|checkout|cart/i.test(text)) {
    intgScore = Math.max(intgScore, 5);
  }
  if (project.requirements?.integrations?.includes('Maps') && /tracking|delivery|map|location/i.test(text)) {
    intgScore = Math.max(intgScore, 4);
  }
  if (intgEval.reasons.length > 0) allReasons.push(...intgEval.reasons);

  // 4. Security Complexity (0-5)
  const secEval = evaluateFactor(text, category, COMPLEXITY_RULES.security);
  let secScore = secEval.score;
  if (category === 'Authentication' || category === 'Security') {
    secScore = Math.max(secScore, 4);
  }
  if (project.requirements?.security === 'Financial/High-Security Requirements') {
    secScore = Math.min(5, secScore + 1);
  }
  if (secEval.reasons.length > 0) allReasons.push(...secEval.reasons);

  // 5. UI/UX Complexity (0-5)
  const uiEval = evaluateFactor(text, category, COMPLEXITY_RULES.uiUx);
  let uiScore = uiEval.score || 2; // Default 2 for user-facing UI
  if (category === 'Administration' || category === 'Analytics') {
    uiScore = Math.max(uiScore, 4);
  }
  if (uiEval.reasons.length > 0) allReasons.push(...uiEval.reasons);

  // 6. Real-Time Complexity (0-5)
  const rtEval = evaluateFactor(text, category, COMPLEXITY_RULES.realTime);
  let rtScore = rtEval.score;
  if (rtEval.reasons.length > 0) allReasons.push(...rtEval.reasons);

  // 7. AI/ML Complexity (0-5)
  const aiEval = evaluateFactor(text, category, COMPLEXITY_RULES.aiMl);
  let aiScore = aiEval.score;
  if (category === 'AI/ML' || project.type === 'AI / Machine Learning') {
    aiScore = Math.max(aiScore, 4);
  }
  if (aiEval.reasons.length > 0) allReasons.push(...aiEval.reasons);

  // 8. Platform Complexity (0-5)
  const platformInfo = parsePlatformMultiplier(project.platforms);
  let platformScore = platformInfo.platformScore || 1;
  if (project.platforms?.length >= 3) {
    platformScore = 4;
    allReasons.push(`Requires multi-platform synchronization across ${project.platforms.length} platforms`);
  } else if (project.platforms?.length === 2) {
    platformScore = 2;
  }

  // 9. Dependency Complexity (0-5)
  const depCount = Array.isArray(feature.dependencies) ? feature.dependencies.length : 0;
  let depScore = Math.min(5, depCount * 2);
  if (depCount > 0) {
    allReasons.push(`Depends directly on ${depCount} other feature module(s)`);
  }

  // Priority adjustment
  if (feature.priority === 'Must Have') {
    techScore = Math.min(5, techScore + 1);
  }

  // Total Score (Sum of 9 factors: 0 to 45)
  const totalScore = Math.min(
    ESTIMATION_CONFIG.maxFeatureScore,
    techScore + dbScore + intgScore + secScore + uiScore + rtScore + aiScore + platformScore + depScore
  );

  // Classification (Low: 0-8, Medium: 9-16, High: 17-25, Very High: 26+)
  let level = 'LOW';
  if (totalScore >= 26) {
    level = 'VERY HIGH';
  } else if (totalScore >= 17) {
    level = 'HIGH';
  } else if (totalScore >= 9) {
    level = 'MEDIUM';
  }

  // Deduplicate and fallback reasons
  const cleanReasons = Array.from(new Set(allReasons));
  if (cleanReasons.length === 0) {
    cleanReasons.push(`Standard ${category} module with standard data flow and responsive interface.`);
  }

  return {
    featureId: feature.id,
    featureName: feature.name,
    category,
    priority: feature.priority || 'Must Have',
    level,
    score: totalScore,
    maxScore: ESTIMATION_CONFIG.maxFeatureScore,
    factors: {
      technical: techScore,
      database: dbScore,
      integration: intgScore,
      security: secScore,
      uiUx: uiScore,
      realTime: rtScore,
      aiMl: aiScore,
      platform: platformScore,
      dependencies: depScore,
    },
    reasons: cleanReasons,
  };
};

/**
 * Calculates overall Project-Level complexity based on aggregate feature data and project architectural load.
 */
export const calculateProjectComplexity = (featureAnalyses = [], project = {}) => {
  if (featureAnalyses.length === 0) {
    return {
      level: 'LOW',
      score: 10,
      averageFeatureScore: 0,
      highComplexityFeatureCount: 0,
      reasons: ['No features provided.'],
    };
  }

  const totalFeatureScore = featureAnalyses.reduce((sum, f) => sum + f.score, 0);
  const avgFeatureScore = Math.round((totalFeatureScore / featureAnalyses.length) * 10) / 10;

  const highAndVeryHighCount = featureAnalyses.filter(
    (f) => f.level === 'HIGH' || f.level === 'VERY HIGH'
  ).length;

  const reasons = [];

  // Project factors
  let projectScore = avgFeatureScore;

  // Feature volume load
  if (featureAnalyses.length >= 8) {
    projectScore += 4;
    reasons.push(`Broad scope encompassing ${featureAnalyses.length} distinct functional features.`);
  } else if (featureAnalyses.length >= 5) {
    projectScore += 2;
  }

  // High complexity density
  if (highAndVeryHighCount >= 4) {
    projectScore += 6;
    reasons.push(`${highAndVeryHighCount} features classified as High or Very High complexity.`);
  } else if (highAndVeryHighCount >= 2) {
    projectScore += 3;
    reasons.push(`${highAndVeryHighCount} high-complexity modules.`);
  }

  // Scale & platform impact
  const scaleInfo = parseUserScaleFactor(project.expectedUsers);
  projectScore += scaleInfo.scoreBonus;
  if (scaleInfo.scoreBonus > 0) {
    reasons.push(scaleInfo.reason);
  }

  const platformInfo = parsePlatformMultiplier(project.platforms);
  if (platformInfo.platformScore >= 3) {
    projectScore += 2;
    reasons.push(platformInfo.reason);
  }

  // Security impact
  if (project.requirements?.security === 'Financial/High-Security Requirements') {
    projectScore += 3;
    reasons.push('Stringent financial-grade security & audit compliance requirements.');
  }

  // Integrations impact
  const intgCount = project.requirements?.integrations?.length || 0;
  if (intgCount >= 3) {
    projectScore += 3;
    reasons.push(`Multiple external service integrations (${project.requirements.integrations.join(', ')}).`);
  }

  // Final level determination (Project scale)
  let projectLevel = 'LOW';
  const finalScore = Math.min(100, Math.round(projectScore * 2.2));

  if (finalScore >= 65 || highAndVeryHighCount >= 3 || avgFeatureScore >= 18) {
    projectLevel = 'Very High';
  } else if (finalScore >= 45 || highAndVeryHighCount >= 1 || avgFeatureScore >= 14) {
    projectLevel = 'High';
  } else if (finalScore >= 25 || avgFeatureScore >= 8) {
    projectLevel = 'Medium';
  }

  return {
    level: projectLevel,
    score: finalScore,
    maxScore: 100,
    averageFeatureScore: avgFeatureScore,
    highComplexityFeatureCount: highAndVeryHighCount,
    totalFeatures: featureAnalyses.length,
    reasons,
  };
};
