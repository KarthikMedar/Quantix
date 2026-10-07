/**
 * Deterministic Rules & Keyword Heuristics for EstimateAI
 * Analyzes feature names, descriptions, categories, and project parameters.
 */

// Heuristic keyword patterns for 9 complexity factors
export const COMPLEXITY_RULES = {
  // 1. Technical Difficulty
  technical: [
    { regex: /\b(algorithm|distributed|microservice|cluster|sync|consensus|concurrency|queue|streaming|pipeline)\b/i, weight: 3, reason: 'Complex distributed architecture or high-concurrency processing' },
    { regex: /\b(automation|engine|parsing|compilation|scheduler|worker|batch|workflow)\b/i, weight: 2, reason: 'Advanced asynchronous processing or workflow orchestration' },
    { regex: /\b(crud|profile|settings|about|contact|static|faq|terms)\b/i, weight: 0, reason: 'Standard procedural logic' },
  ],

  // 2. Database Complexity
  database: [
    { regex: /\b(schema|relational|multi-tenant|partition|sharding|migration|etl|aggregation|olap|replica)\b/i, weight: 4, reason: 'Complex data architecture with multi-tenancy or sharded queries' },
    { regex: /\b(order|catalog|inventory|booking|cart|history|ledger|transaction)\b/i, weight: 3, reason: 'Stateful relational transactions requiring ACID guarantees' },
    { regex: /\b(cache|redis|session|storage|file|upload|s3|blob)\b/i, weight: 2, reason: 'Blob asset storage or high-speed caching tier' },
    { regex: /\b(database|sql|nosql|entity|table|model)\b/i, weight: 2, reason: 'Structured database persistence' },
  ],

  // 3. API & Third-Party Integration Complexity
  integration: [
    { regex: /\b(payment|gateway|stripe|razorpay|paypal|checkout|bank|billing|invoice|subscription)\b/i, weight: 5, reason: 'External payment gateway with webhook verification & ledger sync' },
    { regex: /\b(map|gps|geolocation|google maps|routing|tracking|delivery)\b/i, weight: 4, reason: 'Live mapping, geolocation API, and route calculation integrations' },
    { regex: /\b(webhook|oauth|sso|saml|jwt|third-party|external api|crm|salesforce|erp)\b/i, weight: 3, reason: 'Third-party REST/GraphQL integration with rate-limiting & token rotation' },
    { regex: /\b(email|sms|notification|push|twilio|sendgrid|smtp)\b/i, weight: 2, reason: 'External transactional messaging service' },
  ],

  // 4. Security & Compliance Complexity
  security: [
    { regex: /\b(pci|hipaa|gdpr|compliance|audit|regulatory|encryption|vault|kms)\b/i, weight: 5, reason: 'High regulatory security standard with encrypted data-at-rest & audit logging' },
    { regex: /\b(payment|auth|password|mfa|otp|biometric|token|permission|rbac|role)\b/i, weight: 4, reason: 'Security-critical credential validation, session handling, or RBAC controls' },
    { regex: /\b(access|login|logout|register|signup|verify)\b/i, weight: 3, reason: 'User identity authentication flow' },
  ],

  // 5. UI/UX Complexity
  uiUx: [
    { regex: /\b(dashboard|chart|graph|analytics|visual|interactive|drag|drop|canvas|editor|builder)\b/i, weight: 4, reason: 'Rich data visualization, interactive telemetry graphs, or custom drag-and-drop UI' },
    { regex: /\b(cart|catalog|search|filter|feed|checkout|table|list|grid|modal)\b/i, weight: 3, reason: 'Dynamic multi-state client UI with client-side caching & instant filtering' },
    { regex: /\b(responsive|mobile|theme|dark mode|portal|screen)\b/i, weight: 2, reason: 'Multi-screen responsive interface adaptation' },
  ],

  // 6. Real-Time Complexity
  realTime: [
    { regex: /\b(real-time|realtime|socket|websocket|live|stream|tracking|chat|message|presence)\b/i, weight: 5, reason: 'Bidirectional WebSocket connections and live event streaming' },
    { regex: /\b(notification|alert|ping|order status|delivery status|telemetry)\b/i, weight: 3, reason: 'Real-time state push updates and event listener management' },
  ],

  // 7. AI/ML Complexity
  aiMl: [
    { regex: /\b(rag|vector|embedding|llm|gpt|ai|machine learning|nlp|vision|ocr|deep learning|agent|recommendation)\b/i, weight: 5, reason: 'Generative AI pipeline, vector database embeddings, or machine learning model inference' },
    { regex: /\b(search|smart|intelligent|prediction|scoring|classifier)\b/i, weight: 2, reason: 'Intelligent algorithmic ranking or heuristics' },
  ],
};

// Helper: Evaluates a text against rules and returns highest weight & reasons
export const evaluateFactor = (text, categoryText, rulesList) => {
  const combined = `${text} ${categoryText}`.toLowerCase();
  let maxWeight = 0;
  const reasons = [];

  for (const rule of rulesList) {
    if (rule.regex.test(combined)) {
      if (rule.weight > maxWeight) {
        maxWeight = rule.weight;
      }
      if (rule.weight > 0 && !reasons.includes(rule.reason)) {
        reasons.push(rule.reason);
      }
    }
  }

  return {
    score: Math.min(5, maxWeight),
    reasons,
  };
};

// Parse User Scale
export const parseUserScaleFactor = (expectedUsers) => {
  if (!expectedUsers) return { multiplier: 1.0, scoreBonus: 0, reason: 'Standard initial user baseline' };
  const str = String(expectedUsers).toLowerCase().replace(/,/g, '');
  const num = parseInt(str, 10);

  if (str.includes('1000000') || (num && num >= 1000000)) {
    return { multiplier: 1.5, scoreBonus: 2, reason: 'High scale architecture for 1,000,000+ users' };
  }
  if (str.includes('100000') || (num && num >= 100000)) {
    return { multiplier: 1.3, scoreBonus: 1, reason: 'Enterprise scaling requirements for 100,000+ users' };
  }
  if (str.includes('10000') || (num && num >= 10000)) {
    return { multiplier: 1.15, scoreBonus: 1, reason: 'Production infrastructure for 10,000+ users' };
  }
  return { multiplier: 1.0, scoreBonus: 0, reason: 'Standard initial scale (< 10,000 users)' };
};

// Parse Platform Multiplier
export const parsePlatformMultiplier = (platforms = []) => {
  const count = platforms.length;
  if (count >= 3) {
    return { multiplier: 1.45, platformScore: 4, reason: `Multi-platform deployment across ${count} target platforms` };
  }
  if (count === 2) {
    return { multiplier: 1.25, platformScore: 3, reason: `Dual-platform client support (${platforms.join(' & ')})` };
  }
  return { multiplier: 1.0, platformScore: 1, reason: `Single target platform (${platforms[0] || 'Web'})` };
};
