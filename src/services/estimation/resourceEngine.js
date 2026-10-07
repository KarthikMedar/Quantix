/**
 * Resource Recommendation Engine
 * Logically sizes specialized team roles, quantities, and hours based on discipline workloads.
 */

import { RESOURCE_RATES } from '../../config/resourceRates.js';
import { formatCurrencyINR } from '../../utils/formatters.js';

export const recommendProjectResources = (effortData, projectComplexity, project = {}, features = [], customRates = null) => {
  const { disciplineHours, totalEffortHours } = effortData;
  const resources = [];

  // Centralized Custom Rate Override with Strict Validation
  const customRatesConfig = project.customRates || customRates || {};
  const getRoleRate = (roleId, fallbackRate) => {
    const override = customRatesConfig[roleId];
    if (typeof override === 'number' && isFinite(override) && override > 0) {
      return Math.round(override);
    }
    return fallbackRate;
  };

  // Check special triggers
  const hasPaymentOrHighSec =
    project.requirements?.security === 'Financial/High-Security Requirements' ||
    features.some((f) => /payment|billing|pci|vault/i.test(`${f.name} ${f.description || ''}`));

  const hasAiFeature =
    project.type === 'AI / Machine Learning' ||
    features.some((f) => /rag|ai|llm|vector|embedding|machine learning/i.test(`${f.name} ${f.description || ''}`));

  const isMultiPlatform = (project.platforms?.length || 0) >= 2;
  const isLargeProject = totalEffortHours >= 700;

  // 1. Frontend Developer(s)
  let frontendCount = 1;
  if (disciplineHours.frontend > 400 || (isMultiPlatform && disciplineHours.frontend > 250)) {
    frontendCount = 3;
  } else if (disciplineHours.frontend > 180 || isMultiPlatform) {
    frontendCount = 2;
  }
  const feRate = getRoleRate(RESOURCE_RATES.frontendDeveloper.id, RESOURCE_RATES.frontendDeveloper.hourlyRate);
  resources.push({
    roleId: RESOURCE_RATES.frontendDeveloper.id,
    role: RESOURCE_RATES.frontendDeveloper.title,
    quantity: frontendCount,
    hourlyRate: feRate,
    allocatedHours: disciplineHours.frontend,
    totalCost: disciplineHours.frontend * feRate,
    reason: `Responsible for client web/mobile interfaces across ${project.platforms?.length || 1} platform(s) (${Math.round(disciplineHours.frontend / frontendCount)} hrs/person).`,
  });

  // 2. Backend Developer(s)
  let backendCount = 1;
  if (disciplineHours.backend > 450 || (hasPaymentOrHighSec && disciplineHours.backend > 280)) {
    backendCount = 3;
  } else if (disciplineHours.backend > 190) {
    backendCount = 2;
  }
  const beRate = getRoleRate(RESOURCE_RATES.backendDeveloper.id, RESOURCE_RATES.backendDeveloper.hourlyRate);
  resources.push({
    roleId: RESOURCE_RATES.backendDeveloper.id,
    role: RESOURCE_RATES.backendDeveloper.title,
    quantity: backendCount,
    hourlyRate: beRate,
    allocatedHours: disciplineHours.backend,
    totalCost: disciplineHours.backend * beRate,
    reason: `Builds core business services, API endpoints, and database models (${Math.round(disciplineHours.backend / backendCount)} hrs/person).`,
  });

  // 3. UI/UX Designer(s)
  let designerCount = 1;
  if (disciplineHours.uiUx > 140 || (isMultiPlatform && features.length >= 8)) {
    designerCount = 2;
  }
  const uiRate = getRoleRate(RESOURCE_RATES.uiUxDesigner.id, RESOURCE_RATES.uiUxDesigner.hourlyRate);
  resources.push({
    roleId: RESOURCE_RATES.uiUxDesigner.id,
    role: RESOURCE_RATES.uiUxDesigner.title,
    quantity: designerCount,
    hourlyRate: uiRate,
    allocatedHours: disciplineHours.uiUx,
    totalCost: disciplineHours.uiUx * uiRate,
    reason: `Creates design systems, wireframes, and responsive component UI for ${features.length} features.`,
  });

  // 4. QA Engineer(s)
  let qaCount = 1;
  if (disciplineHours.qa > 220 || totalEffortHours > 900) {
    qaCount = 2;
  }
  const qaRate = getRoleRate(RESOURCE_RATES.qaEngineer.id, RESOURCE_RATES.qaEngineer.hourlyRate);
  resources.push({
    roleId: RESOURCE_RATES.qaEngineer.id,
    role: RESOURCE_RATES.qaEngineer.title,
    quantity: qaCount,
    hourlyRate: qaRate,
    allocatedHours: disciplineHours.qa,
    totalCost: disciplineHours.qa * qaRate,
    reason: `Ensures test coverage, API payload validations, and cross-browser regression testing.`,
  });

  // 5. Project Manager
  const pmRate = getRoleRate(RESOURCE_RATES.projectManager.id, RESOURCE_RATES.projectManager.hourlyRate);
  resources.push({
    roleId: RESOURCE_RATES.projectManager.id,
    role: RESOURCE_RATES.projectManager.title,
    quantity: 1,
    hourlyRate: pmRate,
    allocatedHours: disciplineHours.projectManagement,
    totalCost: disciplineHours.projectManagement * pmRate,
    reason: `Sprint planning, backlog prioritization, timeline governance, and blocker mitigation.`,
  });

  // 6. DevOps Engineer (included if medium/large project or multi-platform or integrations >= 2)
  if (isLargeProject || (project.requirements?.integrations?.length || 0) >= 2 || isMultiPlatform) {
    const devopsRate = getRoleRate(RESOURCE_RATES.devopsEngineer.id, RESOURCE_RATES.devopsEngineer.hourlyRate);
    resources.push({
      roleId: RESOURCE_RATES.devopsEngineer.id,
      role: RESOURCE_RATES.devopsEngineer.title,
      quantity: 1,
      hourlyRate: devopsRate,
      allocatedHours: disciplineHours.devops,
      totalCost: disciplineHours.devops * devopsRate,
      reason: `Automated CI/CD pipelines, containerization, and production cloud infrastructure provisioning.`,
    });
  }

  // 7. Security Engineer (Only if High-Security / Financial Compliance is requested)
  if (hasPaymentOrHighSec) {
    const secHours = Math.round(30 + totalEffortHours * 0.03);
    const secRate = getRoleRate(RESOURCE_RATES.securityEngineer.id, RESOURCE_RATES.securityEngineer.hourlyRate);
    resources.push({
      roleId: RESOURCE_RATES.securityEngineer.id,
      role: RESOURCE_RATES.securityEngineer.title,
      quantity: 1,
      hourlyRate: secRate,
      allocatedHours: secHours,
      totalCost: secHours * secRate,
      reason: `Audits transactional integrity, token verification, and data encryption compliance.`,
    });
  }

  // 8. AI/ML Engineer (Only if AI features are detected)
  if (hasAiFeature) {
    const aiHours = Math.round(50 + totalEffortHours * 0.05);
    const aiRate = getRoleRate(RESOURCE_RATES.aiMlEngineer.id, RESOURCE_RATES.aiMlEngineer.hourlyRate);
    resources.push({
      roleId: RESOURCE_RATES.aiMlEngineer.id,
      role: RESOURCE_RATES.aiMlEngineer.title,
      quantity: 1,
      hourlyRate: aiRate,
      allocatedHours: aiHours,
      totalCost: aiHours * aiRate,
      reason: `Implements vector database integrations, prompt pipeline testing, and model latency caching.`,
    });
  }

  // Total Team Headcount
  const totalHeadcount = resources.reduce((sum, r) => sum + r.quantity, 0);

  const formattedResources = resources.map((r) => ({
    ...r,
    hours: r.allocatedHours,
    estimatedCost: r.totalCost,
    formattedRate: `₹${r.hourlyRate}/hr`,
    formattedCost: formatCurrencyINR(r.totalCost),
  }));

  return {
    resources: formattedResources,
    totalHeadcount,
    roleCount: formattedResources.length,
  };
};
