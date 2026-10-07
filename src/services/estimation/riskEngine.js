/**
 * Risk Engine (Phase 4 Specification)
 * Deterministically evaluates:
 * - Overall Risk Score (0 - 100) and Level (Low, Medium, High, Critical)
 * - 5 Specific Risk Drivers (Deadline Pressure, Integrations, Dependencies, Real-Time, Security)
 * - Concrete project-derived root cause bullets
 * - Detailed architectural risk item cards
 *
 * NO RANDOM NUMBERS (Math.random) ARE USED.
 */

export const analyzeProjectRisks = (project, features, complexityData, timelineData, dependenciesData = {}) => {
  const risks = [];
  const specificReasons = [];
  let riskScore = 20; // Base baseline software risk

  // 1. Payment Gateway & Financial Security
  const hasPayment =
    project.requirements?.integrations?.includes('Payment Gateway') ||
    features.some((f) => /payment|billing|checkout|stripe|razorpay|pci/i.test(`${f.name} ${f.description || ''}`));

  let integrationRiskLevel = 'Low';
  if (hasPayment) {
    riskScore += 18;
    integrationRiskLevel = 'High';
    specificReasons.push('Payment gateway integration requires PCI-DSS compliance, webhook idempotency, and automated transaction reconciliation.');
    risks.push({
      id: 'risk_payment',
      title: 'Payment Gateway Integration & Financial Security',
      level: 'HIGH',
      category: 'Financial & Compliance',
      reason: 'Handling payment flows involves PCI-DSS compliance, webhooks idempotency, and financial transaction failure states.',
      recommendation: 'Use pre-built hosted payment components (e.g. Stripe Elements / Razorpay Checkout) and implement robust webhook idempotency keys.',
    });
  } else if (project.requirements?.integrations?.length > 0) {
    riskScore += 8;
    integrationRiskLevel = 'Medium';
    specificReasons.push(`External service integrations (${project.requirements.integrations.join(', ')}) create third-party SLA dependencies.`);
  }

  // 2. Deadline Pressure & Timeline Feasibility
  let deadlineRiskLevel = 'Low';
  if (timelineData.deadlineCheck && !timelineData.deadlineCheck.isAchievable) {
    riskScore += 24;
    deadlineRiskLevel = 'High';
    specificReasons.push(`Requested timeline (${project.requestedTimeline || 'target'}) is shorter than the minimum feasible engineering critical path (${timelineData.totalWeeks} weeks).`);
    risks.push({
      id: 'risk_deadline',
      title: 'Schedule Infeasibility & Compressed Delivery Window',
      level: 'CRITICAL',
      category: 'Delivery',
      reason: timelineData.deadlineCheck.message,
      recommendation: 'Immediately prioritize MVP features and augment team with a senior Full-Stack engineer.',
    });
  } else if (timelineData.deadlineCheck?.status === 'Tight') {
    riskScore += 12;
    deadlineRiskLevel = 'Medium';
    specificReasons.push('Schedule is tight with minimal buffer margin for requirement adjustments or scope churn.');
  }

  // 3. Dependency Depth & Circular Dependencies
  let dependencyRiskLevel = 'Low';
  if (dependenciesData.hasCircularDependency) {
    riskScore += 30;
    dependencyRiskLevel = 'High';
    specificReasons.push(`Circular dependency error: ${dependenciesData.circularDependencyError}`);
  } else if (dependenciesData.criticalPath?.featureCount >= 4) {
    riskScore += 12;
    dependencyRiskLevel = 'High';
    specificReasons.push(`Deep critical dependency path: ${dependenciesData.criticalPath.chain} dictates consecutive engineering stages.`);
  } else if (dependenciesData.hasDependencies) {
    riskScore += 6;
    dependencyRiskLevel = 'Medium';
  }

  // 4. Multi-Platform Maintenance
  const platformCount = project.platforms?.length || 1;
  if (platformCount >= 3) {
    riskScore += 15;
    specificReasons.push(`Simultaneous deployment to ${platformCount} target platforms (${project.platforms.join(', ')}) multiplies cross-browser and mobile OS validation.`);
    risks.push({
      id: 'risk_platform',
      title: 'Multi-Platform Consistency Overhead',
      level: 'HIGH',
      category: 'Architecture',
      reason: `Supporting ${platformCount} simultaneous target platforms (${project.platforms.join(', ')}) increases client verification overhead.`,
      recommendation: 'Consider cross-platform UI frameworks (e.g., React Native/Flutter or responsive PWA) to maximize code reuse.',
    });
  } else if (platformCount === 2) {
    riskScore += 8;
    specificReasons.push('Dual-platform delivery (Web + Mobile) requires coordinated API release cycles and responsive Figma coverage.');
    risks.push({
      id: 'risk_platform_dual',
      title: 'Dual-Platform Maintenance',
      level: 'MEDIUM',
      category: 'Architecture',
      reason: 'Building for both Web and Mobile necessitates shared API contracts and cross-device testing.',
      recommendation: 'Design a shared TypeScript API client and unified Figma design system.',
    });
  }

  // 5. High Architectural Complexity & High-Load Scale
  if (complexityData.level === 'Very High' || complexityData.score >= 50) {
    riskScore += 14;
    specificReasons.push(`${complexityData.highComplexityFeatureCount || 2} features carry significant technical density or concurrency demands.`);
    risks.push({
      id: 'risk_complexity',
      title: 'High System Architecture Complexity',
      level: 'HIGH',
      category: 'Engineering',
      reason: `${complexityData.highComplexityFeatureCount || 2} features carry significant algorithmic or technical load.`,
      recommendation: 'Conduct upfront technical spikes and architecture design reviews (ADRs) before starting sprint implementation.',
    });
  }

  // 6. Real-Time State Synchronization
  let realtimeRiskLevel = 'Low';
  const hasRealtime = features.some((f) =>
    /real-time|realtime|socket|websocket|live tracking|live chat|gps/i.test(`${f.name} ${f.description || ''}`)
  );
  if (hasRealtime) {
    riskScore += 10;
    realtimeRiskLevel = 'High';
    specificReasons.push('Real-time tracking and state synchronization demand persistent WebSocket connections and connection drop recovery logic.');
    risks.push({
      id: 'risk_realtime',
      title: 'Real-Time State Synchronization',
      level: 'MEDIUM',
      category: 'Engineering',
      reason: 'Persistent WebSocket connections demand connection recovery logic and horizontally scalable pub/sub brokers.',
      recommendation: 'Leverage managed pub/sub infrastructure (e.g. AWS API Gateway WebSockets, Ably, or Redis Streams).',
    });
  }

  // 7. Security Standards
  let securityRiskLevel = 'Low';
  if (project.requirements?.security === 'Financial/High-Security Requirements') {
    riskScore += 12;
    securityRiskLevel = 'High';
    specificReasons.push('Stringent financial-grade security standards mandate end-to-end encryption, secret rotations, and audit trail preservation.');
    risks.push({
      id: 'risk_security',
      title: 'Elevated Security Compliance Standards',
      level: 'HIGH',
      category: 'Security',
      reason: 'Requires comprehensive penetration testing, encryption-at-rest key rotations, and strict role audit logs.',
      recommendation: 'Schedule a third-party security audit prior to public launch and mandate automated dependency vulnerability scanning.',
    });
  } else if (project.requirements?.security === 'Advanced Security') {
    riskScore += 6;
    securityRiskLevel = 'Medium';
  }

  // Fallback reason if minimal risks
  if (specificReasons.length === 0) {
    specificReasons.push('Standard application architecture with predictable CRUD workflows and low third-party variance.');
  }

  // Bound overall risk score
  const finalRiskScore = Math.min(95, Math.max(15, riskScore));

  let overallRiskLevel = 'LOW';
  if (finalRiskScore >= 75) overallRiskLevel = 'CRITICAL';
  else if (finalRiskScore >= 55) overallRiskLevel = 'HIGH';
  else if (finalRiskScore >= 35) overallRiskLevel = 'MEDIUM';

  return {
    score: finalRiskScore,
    level: overallRiskLevel,
    specificReasons,
    drivers: {
      deadlinePressure: {
        level: deadlineRiskLevel,
        label: 'Deadline Pressure',
      },
      externalIntegrations: {
        level: integrationRiskLevel,
        label: 'External Integrations',
      },
      dependencyDepth: {
        level: dependencyRiskLevel,
        label: 'Dependency Depth',
      },
      realTimeFeatures: {
        level: realtimeRiskLevel,
        label: 'Real-Time Features',
      },
      securityStandards: {
        level: securityRiskLevel,
        label: 'Security & Compliance',
      },
    },
    items: risks,
  };
};
