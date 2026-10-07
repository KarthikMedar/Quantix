/**
 * Deterministic Confidence Engine (Phase 4 Specification)
 * Computes an objective engineering confidence rating (percentage) based on requirement clarity:
 * - Explicit dependencies specified
 * - Technology stack defined
 * - Feature descriptions detailed
 * - Third-party API unknowns
 * - Multi-platform testing variances
 * - Timeline feasibility pressure
 *
 * NEVER RETURNS 100% (Clamped between 52% and 88%).
 * NO RANDOM NUMBERS (Math.random) ARE USED.
 */

export const calculateProjectConfidence = ({
  project = {},
  features = [],
  complexityData = {},
  timelineData = {},
  dependenciesData = {},
}) => {
  let score = 76; // Baseline confidence
  const positiveDrivers = [];
  const riskDrivers = [];

  // 1. Dependencies Definition
  if (dependenciesData.hasDependencies && !dependenciesData.hasCircularDependency) {
    score += 5;
    positiveDrivers.push({
      factor: 'Explicit Dependency Topology',
      detail: `${dependenciesData.totalDependenciesCount || 'Multiple'} dependency links explicitly configured, enabling reliable critical-path sequencing.`,
      impact: '+5%',
    });
  } else if (!dependenciesData.hasDependencies && features.length > 3) {
    score -= 4;
    riskDrivers.push({
      factor: 'Unlinked Feature Dependencies',
      detail: 'Features have no explicit predecessor links; assuming parallel execution increases scheduling uncertainty.',
      impact: '-4%',
    });
  }

  // 2. Technology Stack Definition
  const tech = project.technology || {};
  const hasTechSpecified =
    (tech.frontend?.length > 0 && tech.frontend[0] !== 'Other') ||
    (tech.backend?.length > 0 && tech.backend[0] !== 'Other');

  if (hasTechSpecified && !tech.recommendLater) {
    score += 4;
    positiveDrivers.push({
      factor: 'Concrete Technology Stack',
      detail: `Technology choices specified (${[...(tech.frontend || []), ...(tech.backend || [])].slice(0, 3).join(', ')}), reducing framework ramp-up uncertainty.`,
      impact: '+4%',
    });
  } else {
    score -= 3;
    riskDrivers.push({
      factor: 'Uncommitted Architectural Stack',
      detail: 'Framework and database technologies remain open for later evaluation.',
      impact: '-3%',
    });
  }

  // 3. Domain & Requirements Scoping
  if (project.businessDomain && project.businessDomain !== 'Other') {
    score += 3;
    positiveDrivers.push({
      factor: 'Established Domain Model',
      detail: `Standard industry patterns for ${project.businessDomain} benchmarked against historical software baselines.`,
      impact: '+3%',
    });
  }

  // 4. Feature Priority & Description Granularity
  const allPrioritized = features.every((f) => f.priority && f.priority !== '');
  if (allPrioritized && features.length > 0) {
    score += 3;
    positiveDrivers.push({
      factor: 'Prioritized Scope Roster',
      detail: 'All scoped features classified into Must Have / Important / Nice to Have milestones.',
      impact: '+3%',
    });
  }

  // 5. External Integrations Risk
  const hasExternalIntegrations =
    project.requirements?.integrations?.length > 0 ||
    features.some((f) => /payment|stripe|razorpay|twilio|maps|shipping|webhook/i.test(`${f.name} ${f.description || ''}`));

  if (hasExternalIntegrations) {
    score -= 4;
    riskDrivers.push({
      factor: 'Third-Party Integration Contracts',
      detail: 'Third-party API rate limits, sandbox credential delays, and webhook SLAs introduce external variance.',
      impact: '-4%',
    });
  }

  // 6. Platform Proliferation
  const platformCount = project.platforms?.length || 1;
  if (platformCount >= 3) {
    score -= 5;
    riskDrivers.push({
      factor: 'Multi-Client Divergence',
      detail: `Simultaneous delivery across ${platformCount} platforms requires distinct viewport and OS verification cycles.`,
      impact: '-5%',
    });
  } else if (platformCount === 2) {
    score -= 2;
    riskDrivers.push({
      factor: 'Dual-Platform Cross-Verification',
      detail: 'Building for Web and Mobile requires parallel QA device matrices.',
      impact: '-2%',
    });
  }

  // 7. High Complexity Load
  if (complexityData.level === 'Very High' || complexityData.score >= 55) {
    score -= 4;
    riskDrivers.push({
      factor: 'Architectural Density',
      detail: `${complexityData.highComplexityFeatureCount || 2} features require non-trivial algorithmic processing or streaming state.`,
      impact: '-4%',
    });
  }

  // 8. Timeline Feasibility Pressure
  if (timelineData.deadlineCheck && !timelineData.deadlineCheck.isAchievable) {
    score -= 5;
    riskDrivers.push({
      factor: 'Compressed Delivery Schedule',
      detail: 'Requested timeline compresses standard testing buffers, leaving narrow margin for rework.',
      impact: '-5%',
    });
  }

  // Clamped between 52% and 88% (Never 100% as real software estimates have inherent variance)
  const finalScore = Math.min(88, Math.max(52, score));

  let confidenceLevel = 'Moderate';
  if (finalScore >= 80) confidenceLevel = 'High';
  else if (finalScore < 65) confidenceLevel = 'Cautious';

  return {
    score: finalScore,
    level: confidenceLevel,
    formattedScore: `${finalScore}%`,
    positiveDrivers,
    riskDrivers,
    summaryExplanation: `Estimate confidence is computed deterministically at ${finalScore}% based on concrete architecture inputs, explicit dependency graphs, and identified integration variables.`,
  };
};
