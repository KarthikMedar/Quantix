/**
 * Recommendation Engine
 * Generates actionable architectural, staffing, timeline, and scope recommendations
 * derived deterministically from calculated estimation results.
 */

export const generateProjectRecommendations = ({
  project,
  features,
  complexityData,
  effortData,
  resourceData,
  timelineData,
  costData,
  risks,
}) => {
  const recommendations = [];

  // 1. Team & Staffing Optimization
  if (effortData.disciplineHours.backend > effortData.disciplineHours.frontend * 1.4) {
    recommendations.push({
      category: 'Team Staffing',
      type: 'Team Allocation',
      title: 'Strengthen Backend Engineering Capacity',
      description: `Backend workload (${effortData.disciplineHours.backend} hrs) significantly exceeds frontend requirements. Prioritize experienced backend engineers to prevent API bottlenecks.`,
      impact: 'High',
    });
  }

  if (effortData.disciplineHours.frontend > effortData.disciplineHours.backend * 1.4) {
    recommendations.push({
      category: 'Team Staffing',
      type: 'Team Allocation',
      title: 'Frontend-Heavy Workload Focus',
      description: `Client UI engineering (${effortData.disciplineHours.frontend} hrs) forms the core effort. Ensure design-to-code component systems are established early.`,
      impact: 'Medium',
    });
  }

  // 2. Scope & Phase Milestones
  const optionalFeatures = features.filter(
    (f) => f.priority === 'Nice to Have' || f.priority === 'Optional'
  );
  if (optionalFeatures.length >= 2) {
    const optionalHours = optionalFeatures.length * 60; // Approximate savings
    recommendations.push({
      category: 'Scope Optimization',
      type: 'Phased Delivery',
      title: `Defer ${optionalFeatures.length} Non-Essential Features to Phase 2`,
      description: `Features like ${optionalFeatures.map((f) => `"${f.name}"`).join(', ')} can be shifted to a secondary milestone, reducing initial development time by approximately 3–4 weeks.`,
      impact: 'High',
    });
  }

  // 3. Platform Architecture
  if ((project.platforms?.length || 1) >= 2) {
    recommendations.push({
      category: 'Architecture',
      type: 'Technology Stack',
      title: 'Adopt Cross-Platform Component Strategy',
      description: `Targeting ${project.platforms.join(' & ')} demands shared design tokens and unified API contracts to prevent divergent user experiences.`,
      impact: 'Medium',
    });
  }

  // 4. Payment & Security Hardening
  const hasPayment = features.some((f) =>
    /payment|checkout|stripe|razorpay/i.test(`${f.name} ${f.description || ''}`)
  );
  if (hasPayment) {
    recommendations.push({
      category: 'Security & Compliance',
      type: 'Integration Best Practice',
      title: 'Implement Webhook Idempotency for Payments',
      description: 'Ensure double-charge prevention by storing processed payment transaction IDs in an atomic cache or transaction log.',
      impact: 'High',
    });
  }

  // 5. Timeline & Deadline Feasibility
  if (timelineData.deadlineCheck && !timelineData.deadlineCheck.isAchievable) {
    recommendations.push({
      category: 'Delivery Schedule',
      type: 'Timeline Alignment',
      title: 'Re-align Scope with Requested Launch Window',
      description: `Your requested timeline of ${timelineData.deadlineCheck.requestedWeeks} weeks is shorter than the estimated ${timelineData.totalWeeks} weeks. Consider releasing an MVP with only "Must Have" features first.`,
      impact: 'Critical',
    });
  } else {
    recommendations.push({
      category: 'Delivery Schedule',
      type: 'Execution Rhythm',
      title: 'Establish 2-Week Sprint Cadence with Regular Demos',
      description: `With an estimated ${timelineData.totalSprints} sprints, conducting bi-weekly stakeholder reviews will ensure continuous feedback and prevent late rework.`,
      impact: 'Medium',
    });
  }

  // 6. Quality Assurance Strategy
  if (features.length >= 6) {
    recommendations.push({
      category: 'Quality Assurance',
      type: 'Automated Testing',
      title: 'Automate Critical User Journey Tests',
      description: 'Implement end-to-end integration tests (e.g., Playwright) for the primary conversion path early in Sprint 3.',
      impact: 'Medium',
    });
  }

  // 7. Large Feature Split Recommendations (Section 28 & 29)
  const largeFeatures = features.filter((f) => {
    const hours = f.estimatedEffortHours || f.threePoint?.expected || 0;
    return hours >= 250;
  });

  largeFeatures.forEach((lf) => {
    recommendations.push({
      category: 'Scope Optimization',
      type: 'Feature Decomposition',
      title: `Consider Splitting "${lf.name}"`,
      description: `This feature is estimated at ${lf.estimatedEffortHours || lf.threePoint?.expected} hours, exceeding the 250-hour atomic sizing threshold.`,
      why: 'Large monolithic features have higher requirement ambiguity and higher sprint delivery variance.',
      benefit: 'Decomposing into discrete sub-features enables parallel sprint assignments and more predictable burndown.',
      impact: 'High',
    });
  });

  return recommendations;
};
