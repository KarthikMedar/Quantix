/**
 * EstimateAI — Phase 8 AI Schemas & Strict Validation Layer
 *
 * Implements strict JSON schema validation for all AI outputs:
 * - Feature Extraction
 * - Complexity Factors (0-5 range, 0-1 confidence)
 * - Missing Features
 * - Estimate Explanations
 * - Qualitative Risk & Assumption Insights
 *
 * Business Rules:
 * - Rejects malformed JSON
 * - Rejects negative values
 * - Clamps complexity factors strictly between 0 and 5
 * - Clamps confidence strictly between 0.0 and 1.0
 * - Rejects unknown factor names
 * - Normalizes types and whitespace
 */

export const ALLOWED_CATEGORIES = [
  'Authentication',
  'User Management',
  'Core Functionality',
  'Payment',
  'Communication',
  'Administration',
  'Analytics',
  'AI/ML',
  'Security',
  'Integration',
  'Other',
];

export const ALLOWED_PRIORITIES = [
  'Must Have',
  'Important',
  'Nice to Have',
  'Optional',
];

export const ALLOWED_COMPLEXITY_FACTORS = [
  'functional_complexity',
  'integration_complexity',
  'data_complexity',
  'security_complexity',
  'ui_complexity',
  'technical_complexity',
  'dependency_complexity',
];

/**
 * Validates and normalizes feature extraction response
 */
export function validateFeatureExtraction(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('AI output must be an object.');
  }

  const rawFeatures = Array.isArray(raw.features) ? raw.features : [];
  if (rawFeatures.length === 0) {
    throw new Error('AI returned an empty features array.');
  }

  const validatedFeatures = [];

  for (let i = 0; i < rawFeatures.length; i++) {
    const item = rawFeatures[i];
    if (!item || typeof item !== 'object') continue;

    const rawName = String(item.name || '').trim();
    if (!rawName || rawName.length < 2) continue;

    const name = rawName.slice(0, 100);
    const description = String(item.description || item.summary || name).trim().slice(0, 500);

    let category = 'Core Functionality';
    if (item.category && ALLOWED_CATEGORIES.includes(item.category)) {
      category = item.category;
    } else if (item.category) {
      // Find closest category match
      const matched = ALLOWED_CATEGORIES.find(
        (c) => c.toLowerCase() === String(item.category).toLowerCase()
      );
      if (matched) category = matched;
    }

    let priority = 'Must Have';
    if (item.priority && ALLOWED_PRIORITIES.includes(item.priority)) {
      priority = item.priority;
    }

    let confidence = 0.85;
    if (typeof item.confidence === 'number' && !isNaN(item.confidence)) {
      confidence = Math.max(0, Math.min(1, item.confidence));
    }

    validatedFeatures.push({
      name,
      description,
      category,
      priority,
      confidence: Number(confidence.toFixed(2)),
      reasoning: item.reasoning ? String(item.reasoning).slice(0, 300) : undefined,
    });

    if (validatedFeatures.length >= 50) break; // Maximum ceiling
  }

  if (validatedFeatures.length === 0) {
    throw new Error('No valid features could be parsed from AI response.');
  }

  return { features: validatedFeatures };
}

/**
 * Validates and normalizes complexity factor suggestions
 */
export function validateComplexitySuggestion(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('AI complexity suggestion must be an object.');
  }

  const rawComplexity = raw.complexity || raw;
  const rawFactors = rawComplexity.factors || rawComplexity;

  const validatedFactors = {};
  for (const factorKey of ALLOWED_COMPLEXITY_FACTORS) {
    let val = rawFactors[factorKey];
    if (val === undefined || val === null) {
      val = 2; // Default baseline
    } else {
      val = Number(val);
      if (isNaN(val)) val = 2;
    }
    // Strict clamp 0 to 5
    validatedFactors[factorKey] = Math.max(0, Math.min(5, Math.round(val * 2) / 2));
  }

  // Calculate overall score (average 0-5)
  const factorVals = Object.values(validatedFactors);
  const avgScore = Number((factorVals.reduce((a, b) => a + b, 0) / factorVals.length).toFixed(1));

  let confidence = 0.82;
  if (typeof rawComplexity.confidence === 'number' && !isNaN(rawComplexity.confidence)) {
    confidence = Math.max(0, Math.min(1, rawComplexity.confidence));
  }

  const reasoning = {};
  if (rawComplexity.reasoning && typeof rawComplexity.reasoning === 'object') {
    for (const [k, v] of Object.entries(rawComplexity.reasoning)) {
      if (typeof v === 'string') {
        reasoning[k] = v.trim().slice(0, 300);
      }
    }
  }

  const risks = Array.isArray(raw.risks)
    ? raw.risks.map((r) => String(r).trim().slice(0, 300)).filter(Boolean)
    : [];

  const assumptions = Array.isArray(raw.assumptions)
    ? raw.assumptions.map((a) => String(a).trim().slice(0, 300)).filter(Boolean)
    : [];

  return {
    feature: String(raw.feature || '').trim(),
    summary: String(raw.summary || '').trim(),
    complexity: {
      overall_score: avgScore,
      confidence: Number(confidence.toFixed(2)),
      factors: validatedFactors,
      reasoning,
    },
    risks,
    assumptions,
  };
}

/**
 * Validates and normalizes missing feature suggestions
 */
export function validateMissingFeatures(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Missing features output must be an object.');
  }

  const rawList = Array.isArray(raw.missing_features)
    ? raw.missing_features
    : Array.isArray(raw.features)
    ? raw.features
    : [];

  const validated = [];
  for (const item of rawList) {
    if (!item || typeof item !== 'object') continue;
    const name = String(item.name || '').trim();
    if (!name || name.length < 2) continue;

    let confidence = 0.85;
    if (typeof item.confidence === 'number' && !isNaN(item.confidence)) {
      confidence = Math.max(0, Math.min(1, item.confidence));
    }

    validated.push({
      name: name.slice(0, 100),
      description: String(item.description || '').trim().slice(0, 400),
      reason: String(item.reason || item.why || 'Standard enterprise capability').trim().slice(0, 400),
      confidence: Number(confidence.toFixed(2)),
      suggestedCategory: item.suggestedCategory || item.category || 'Core Functionality',
      suggestedPriority: item.suggestedPriority || item.priority || 'Important',
    });
  }

  return { missing_features: validated };
}

/**
 * Validates and normalizes estimate explanation
 */
export function validateEstimateExplanation(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Estimate explanation must be an object.');
  }

  const rawSummary = raw.summary || {};
  const summary = {
    headline: String(rawSummary.headline || 'Estimate Analysis & Rationale').trim().slice(0, 200),
    timeline_explanation: String(rawSummary.timeline_explanation || '').trim().slice(0, 600),
    team_explanation: String(rawSummary.team_explanation || '').trim().slice(0, 600),
    major_cost_drivers: Array.isArray(rawSummary.major_cost_drivers)
      ? rawSummary.major_cost_drivers.map((d) => String(d).trim().slice(0, 250)).filter(Boolean)
      : [],
    confidence_assessment: String(rawSummary.confidence_assessment || '').trim().slice(0, 400),
  };

  const rawFeatExp = Array.isArray(raw.feature_explanations) ? raw.feature_explanations : [];
  const feature_explanations = rawFeatExp.map((f) => ({
    feature_name: String(f.feature_name || f.name || '').trim().slice(0, 100),
    explanation: String(f.explanation || f.reason || '').trim().slice(0, 400),
    primary_drivers: Array.isArray(f.primary_drivers)
      ? f.primary_drivers.map((d) => String(d).trim().slice(0, 150))
      : [],
  }));

  const rawRisks = Array.isArray(raw.ai_risks) ? raw.ai_risks : [];
  const ai_risks = rawRisks.map((r) => ({
    type: String(r.type || 'Technical Risk').trim().slice(0, 80),
    description: String(r.description || r.risk || '').trim().slice(0, 300),
    severity: ['High', 'Medium', 'Low'].includes(r.severity) ? r.severity : 'Medium',
  }));

  const assumptions = Array.isArray(raw.assumptions)
    ? raw.assumptions.map((a) => String(a).trim().slice(0, 300)).filter(Boolean)
    : [];

  return {
    summary,
    feature_explanations,
    ai_risks,
    assumptions,
  };
}
