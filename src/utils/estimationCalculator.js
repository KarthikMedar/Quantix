/**
 * Software Project Estimation Engine & Formula Calculator
 * Calculates complexity, team distribution, timelines, and costs.
 */

export const calculateProjectEstimate = ({
  features = [],
  hourlyRates = {
    developerHourly: 1500,
    designerHourly: 1200,
    qaHourly: 1000,
    devopsHourly: 1800,
  },
  architecture = 'Modular Monolith',
  currency = 'INR',
}) => {
  if (!features || features.length === 0) {
    return {
      complexityScore: 'LOW',
      totalHours: 0,
      totalCost: 0,
      timelineMonths: 0,
      sprints: 0,
      confidenceScore: 95,
      team: { developers: 1, designers: 1, testers: 1 },
      breakdown: { devCost: 0, designCost: 0, qaCost: 0, bufferCost: 0 },
    };
  }

  // 1. Calculate raw feature hours
  let rawDevHours = 0;
  let highComplexityCount = 0;
  let mediumComplexityCount = 0;

  features.forEach((feat) => {
    const hours = Number(feat.estimatedHours) || 40;
    rawDevHours += hours;

    if (feat.complexity === 'High') highComplexityCount += 2;
    else if (feat.complexity === 'Extreme') highComplexityCount += 3;
    else if (feat.complexity === 'Medium') mediumComplexityCount += 1;
  });

  // Architecture multiplier
  let archMultiplier = 1.0;
  if (architecture.includes('Microservices')) archMultiplier = 1.25;
  else if (architecture.includes('Serverless')) archMultiplier = 1.15;

  const totalEngineeringHours = Math.round(rawDevHours * archMultiplier);

  // Design hours (~25% of dev)
  const designHours = Math.round(totalEngineeringHours * 0.25);

  // QA & Testing hours (~30% of dev)
  const qaHours = Math.round(totalEngineeringHours * 0.3);

  // 15% Project management & contingency buffer
  const contingencyBufferHours = Math.round(totalEngineeringHours * 0.15);

  const grandTotalHours = totalEngineeringHours + designHours + qaHours + contingencyBufferHours;

  // 2. Determine Complexity Score
  let complexityScore = 'LOW';
  if (totalEngineeringHours > 450 || highComplexityCount >= 4) {
    complexityScore = 'HIGH';
  } else if (totalEngineeringHours > 200 || highComplexityCount >= 2 || mediumComplexityCount >= 4) {
    complexityScore = 'MEDIUM';
  }

  // 3. Recommended Team Composition
  let developers = 2;
  let designers = 1;
  let testers = 1;

  if (complexityScore === 'HIGH') {
    developers = Math.min(Math.max(3, Math.ceil(totalEngineeringHours / 120)), 6);
    designers = 2;
    testers = 2;
  } else if (complexityScore === 'MEDIUM') {
    developers = Math.min(Math.max(2, Math.ceil(totalEngineeringHours / 140)), 4);
    designers = 1;
    testers = 1;
  }

  // 4. Calculate Timeline (Months & Sprints)
  // Assuming 120 productive dev hours per month per developer
  const productiveCapacityPerMonth = developers * 110;
  const rawMonths = totalEngineeringHours / productiveCapacityPerMonth;
  // Floor of 1 month, round to nearest 0.5 or integer
  const timelineMonths = Math.max(1, Math.round(rawMonths * 2) / 2 || 2);
  const sprints = Math.round(timelineMonths * 2); // 2-week sprints

  // 5. Cost Breakdown
  const devCost = totalEngineeringHours * (Number(hourlyRates.developerHourly) || 1500);
  const designCost = designHours * (Number(hourlyRates.designerHourly) || 1200);
  const qaCost = qaHours * (Number(hourlyRates.qaHourly) || 1000);
  const bufferCost = contingencyBufferHours * (Number(hourlyRates.developerHourly) || 1500);

  const totalCost = devCost + designCost + qaCost + bufferCost;

  // 6. Confidence Score
  const featureCount = features.length;
  const confidenceScore = Math.min(97, Math.max(85, Math.round(92 + (featureCount > 4 ? 3 : 0))));

  return {
    complexityScore,
    totalHours: grandTotalHours,
    engineeringHours: totalEngineeringHours,
    designHours,
    qaHours,
    bufferHours: contingencyBufferHours,
    totalCost,
    timelineMonths,
    sprints,
    confidenceScore,
    team: {
      developers,
      designers,
      testers,
    },
    breakdown: {
      devCost,
      designCost,
      qaCost,
      bufferCost,
    },
  };
};
