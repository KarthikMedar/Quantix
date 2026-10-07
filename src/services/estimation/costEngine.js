/**
 * Transparent Cost Engine (Phase 4 Specification)
 * Strictly enforces:
 * 1. BuildCost = Σ RoleCost (AllocatedRoleHours × HourlyRate)
 * 2. NO double counting of feature costs vs role costs
 * 3. Feature costs are represented as proportional shares of BuildCost
 * 4. Monthly Infrastructure and Year-1 Maintenance are kept COMPLETELY SEPARATE from Build Cost
 * 5. Cost uncertainty range [lowCost, highCost] matching PERT effort bounds
 *
 * NO RANDOM NUMBERS (Math.random) ARE USED.
 */

import { formatCurrencyINR } from '../../utils/formatters.js';

export const calculateProjectCosts = (resourceData, featureEfforts = [], project = {}, effortData = {}) => {
  const { resources } = resourceData;

  // 1. Role-Wise Build Cost: RoleCost = AllocatedRoleHours × HourlyRate
  let developmentCost = 0;
  let designCost = 0;
  let testingCost = 0;
  let managementCost = 0;
  let infrastructureCost = 0;
  let specializedCost = 0;

  resources.forEach((r) => {
    const id = r.roleId.toLowerCase();
    if (id.includes('devops') || id.includes('cloud')) {
      infrastructureCost += r.totalCost;
    } else if (id.includes('frontend') || id.includes('backend') || id.includes('fullstack') || id.includes('developer') || id.includes('_dev')) {
      developmentCost += r.totalCost;
    } else if (id.includes('designer') || id.includes('ui_ux')) {
      designCost += r.totalCost;
    } else if (id.includes('qa') || id.includes('test')) {
      testingCost += r.totalCost;
    } else if (id.includes('project_manager') || id.includes('business_analyst') || id.includes('pm')) {
      managementCost += r.totalCost;
    } else {
      specializedCost += r.totalCost;
    }
  });

  // Base build cost = exact sum of all role costs
  const totalBuildCost =
    developmentCost +
    designCost +
    testingCost +
    managementCost +
    infrastructureCost +
    specializedCost;

  // 2. Blended Hourly Rate for Range Calculations
  const totalHours = resources.reduce((sum, r) => sum + r.allocatedHours, 0) || 1;
  const blendedHourlyRate = Math.round(totalBuildCost / totalHours);

  // 3. Cost Range from PERT Effort Bounds
  // Uses proportional ratio of low/high PERT hours to expected PERT hours applied to totalBuildCost
  const expectedHours = effortData.expectedHours || totalHours;
  const lowHours = effortData.lowEffortHours || Math.round(expectedHours * 0.85);
  const highHours = effortData.highEffortHours || Math.round(expectedHours * 1.20);

  const lowCost = Math.round(totalBuildCost * (lowHours / expectedHours));
  const highCost = Math.round(totalBuildCost * (highHours / expectedHours));

  // 4. Feature-Level Costs as Direct Proportional Shares of Total Build Cost
  // Prevents double counting: Sum of all feature costs === totalBuildCost
  const sumFeatureHours = featureEfforts.reduce((acc, f) => acc + f.estimatedEffortHours, 0) || 1;

  let allocatedFeatureCostSum = 0;
  const featureCosts = featureEfforts.map((feat, idx) => {
    const isLast = idx === featureEfforts.length - 1;
    const featureShareRatio = feat.estimatedEffortHours / sumFeatureHours;
    let cost = Math.round(totalBuildCost * featureShareRatio);

    if (isLast) {
      cost = totalBuildCost - allocatedFeatureCostSum;
    } else {
      allocatedFeatureCostSum += cost;
    }

    return {
      featureId: feat.featureId,
      featureName: feat.featureName,
      estimatedHours: feat.estimatedEffortHours,
      threePoint: feat.threePoint,
      costShareRatio: parseFloat((featureShareRatio * 100).toFixed(1)),
      estimatedCost: cost,
      formattedCost: formatCurrencyINR(cost),
    };
  });

  // 5. Additional Costs (Kept STRICTLY SEPARATE from Build Cost!)
  // A. Monthly Infrastructure
  const userCount = parseInt(String(project.expectedUsers || '10000').replace(/,/g, ''), 10) || 10000;
  let monthlyHosting = 7500;
  let monthlyDatabase = 5500;
  let monthlyStorage = 2500;
  let monthlyThirdParty = 3500;

  if (userCount >= 100000) {
    monthlyHosting = 18000;
    monthlyDatabase = 14000;
    monthlyStorage = 6000;
    monthlyThirdParty = 7000;
  } else if (userCount >= 20000) {
    monthlyHosting = 12000;
    monthlyDatabase = 9000;
    monthlyStorage = 4000;
    monthlyThirdParty = 5000;
  }

  const totalMonthlyInfra = monthlyHosting + monthlyDatabase + monthlyStorage + monthlyThirdParty;

  // B. Optional Year-1 Maintenance (18% of Build Cost annually)
  const annualMaintenanceCost = Math.round(totalBuildCost * 0.18);

  return {
    // Primary Build Cost
    totalBuildCost,
    totalProjectCost: totalBuildCost, // Alias for backward compatibility
    formattedTotalCost: formatCurrencyINR(totalBuildCost),
    formattedBuildCost: formatCurrencyINR(totalBuildCost),

    // Cost Uncertainty Range
    expectedCost: totalBuildCost,
    lowCost,
    highCost,
    formattedLowCost: formatCurrencyINR(lowCost),
    formattedHighCost: formatCurrencyINR(highCost),
    formattedCostRange: `${formatCurrencyINR(lowCost)} – ${formatCurrencyINR(highCost)}`,
    blendedHourlyRate,

    // Role-Wise Breakdown of Build Cost
    buildBreakdown: {
      development: developmentCost,
      design: designCost,
      testing: testingCost,
      management: managementCost,
      devops: infrastructureCost,
      specialized: specializedCost,
    },
    formattedBuildBreakdown: {
      development: formatCurrencyINR(developmentCost),
      design: formatCurrencyINR(designCost),
      testing: formatCurrencyINR(testingCost),
      management: formatCurrencyINR(managementCost),
      devops: formatCurrencyINR(infrastructureCost),
      specialized: formatCurrencyINR(specializedCost),
    },

    // Legacy breakdown object for backward compatibility
    breakdown: {
      development: developmentCost,
      design: designCost,
      testing: testingCost,
      management: managementCost,
      infrastructure: infrastructureCost,
      specialized: specializedCost,
      additionalBuffer: 0,
    },
    formattedBreakdown: {
      development: formatCurrencyINR(developmentCost),
      design: formatCurrencyINR(designCost),
      testing: formatCurrencyINR(testingCost),
      management: formatCurrencyINR(managementCost),
      infrastructure: formatCurrencyINR(infrastructureCost),
      specialized: formatCurrencyINR(specializedCost),
      additionalBuffer: '₹0',
    },

    // Feature-Level Cost Allocations
    featureCosts,

    // Additional Recurring Costs (Explicitly Separated)
    infrastructure: {
      monthlyTotal: totalMonthlyInfra,
      formattedMonthlyTotal: formatCurrencyINR(totalMonthlyInfra),
      annualTotal: totalMonthlyInfra * 12,
      formattedAnnualTotal: formatCurrencyINR(totalMonthlyInfra * 12),
      items: [
        { label: 'Cloud Compute & Container Hosting', monthlyINR: monthlyHosting, formatted: formatCurrencyINR(monthlyHosting) },
        { label: 'Managed Cloud Database & Read Replicas', monthlyINR: monthlyDatabase, formatted: formatCurrencyINR(monthlyDatabase) },
        { label: 'Object Storage & Global CDN', monthlyINR: monthlyStorage, formatted: formatCurrencyINR(monthlyStorage) },
        { label: 'Third-Party Webhooks & API Gateways', monthlyINR: monthlyThirdParty, formatted: formatCurrencyINR(monthlyThirdParty) },
      ],
    },

    maintenance: {
      annualCost: annualMaintenanceCost,
      formattedAnnualCost: formatCurrencyINR(annualMaintenanceCost),
      percentageOfBuild: 18,
      includedServices: [
        'Quarterly OS, runtime & dependency security patching',
        'Bug triage and regression resolution SLA',
        'Database index optimization & schema growth monitoring',
        'API deprecation updates and third-party webhook maintenance',
      ],
    },
  };
};
