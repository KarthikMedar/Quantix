/**
 * EstimateAI — Requirement Analyzer Engine (Phase 8)
 *
 * Provides intelligent natural-language requirement analysis:
 * 1. Smart Semantic NLP Engine (deterministic, offline, zero-dependency)
 * 2. Optional Google Gemini Flash API provider (when API key is provided)
 * 3. Extracts structured features, categories, priorities, complexity tags, and dependency chains
 * 4. Identifies domain-specific missing requirements and technical risks
 * 5. Serves as the AI understanding layer without corrupting the deterministic pricing engine
 */

export const AI_ENABLED = false; // Default mode flag for Phase 7 invariant compatibility
export const ANALYZER_MODE = 'deterministic';

/**
 * Domain-specific templates for rapid prompt testing
 */
export const REQUIREMENT_TEMPLATES = [
  {
    id: 'telemedicine',
    title: 'Telemedicine & HealthTech Platform',
    domain: 'HealthTech',
    prompt: `Build a HIPAA-compliant telemedicine web and mobile application.
- Secure Patient and Doctor Authentication with 2FA and license verification
- Doctor Availability Calendar & Appointment Scheduling
- WebRTC End-to-End Encrypted Video Consultation Room with in-call chat
- Digital Prescription Generator with Pharmacy Fulfillment API integration
- Electronic Health Record (EHR) & Medical History Vault with encryption
- Stripe Payment Gateway for per-consultation fees and insurance copay
- Automated Push and SMS Appointment Reminders
- Patient Rating, Reviews, and Doctor Directory Search
- Admin Compliance and Dispute Resolution Dashboard`,
  },
  {
    id: 'fintech_wallet',
    title: 'FinTech Multi-Currency Digital Wallet',
    domain: 'FinTech',
    prompt: `Develop a high-security digital wallet and peer-to-peer payments platform.
- Biometric & Passcode Authentication with Device Binding and AML KYC verification
- Multi-Currency Account Balances (USD, EUR, GBP, INR) with live FX rate converter
- Instant P2P Money Transfer via QR Code and Mobile Number
- Bank Account ACH / Net-Banking Funding and Withdrawal
- Virtual and Physical Debit Card Management (Freeze card, set spend limits)
- Transaction Ledger with Categorized Spending Analytics and Monthly Statements
- Push Notification Alerts for instant credit/debit activity
- Fraud Detection Engine & Suspicious Transaction Flagging
- Admin Portal for Customer Support, KYC Approval, and Regulatory Compliance`,
  },
  {
    id: 'b2b_saas',
    title: 'B2B Multi-Tenant SaaS Workspace',
    domain: 'SaaS Platform',
    prompt: `Create a B2B SaaS project collaboration and workflow management platform.
- Organization & Workspace Creation with Subdomains and Multi-Tenancy
- SSO Authentication (Google Workspace, Microsoft Entra, SAML) and Granular RBAC
- Interactive Kanban Board and Gantt Timeline with Drag-and-Drop Tasks
- Team Real-Time Activity Feed with @mentions and Comments
- Stripe Customer Portal with Tiered Usage-Based Subscriptions and Invoicing
- Custom Webhook Dispatcher and Zapier Integration
- Exportable CSV/PDF Audit Logs and Team Productivity Analytics
- Dark/Light Theme Customization and Localization (EN, ES, DE, FR)
- Super Admin Metrics Dashboard for MRR, Churn, and Active Tenant Monitoring`,
  },
  {
    id: 'food_delivery',
    title: 'Hyper-Local Food & Grocery Delivery',
    domain: 'E-Commerce',
    prompt: `Build an on-demand food delivery marketplace connecting customers, restaurants, and couriers.
- Customer Signup via OTP, Social Login, and Saved Delivery Addresses
- Restaurant Catalog with Category Filtering, Custom Add-Ons, and Allergen Tags
- Interactive Cart with Promo Code Engine and Split Billing
- Multi-Platform Payment Gateway (Credit Cards, Apple Pay, Google Pay, UPI)
- Live Order Dispatching Algorithm matching available couriers
- Real-Time Mapbox GPS Tracking of Courier with ETA calculations
- Restaurant Kitchen Display System (KDS) Tablet App for accepting orders
- Dedicated Courier Mobile App with Order Acceptance, Navigation, and Earnings
- Automated Push Notifications for order status transitions
- Admin Analytics Dashboard for Commission Settlement and Restaurant Onboarding`,
  },
  {
    id: 'ai_copilot',
    title: 'Generative AI Content & Copilot Studio',
    domain: 'AI / Machine Learning',
    prompt: `Build a modern generative AI content creation and productivity studio.
- User Authentication with GitHub, Google, and Email magic link
- AI Chat Workspace with Streaming Responses and Markdown Code Syntax Highlighting
- Prompt Library with Community Templates and Custom Variable Placeholders
- Document Upload and Vector Search (RAG) for querying private PDFs and docs
- Export Artifacts to PDF, Markdown, and Google Docs
- Token-Based Usage Metering and Stripe Monthly Credit Subscriptions
- Team Shared Workspaces with Collaborative Prompt Editing
- Granular API Key Management with Rate Limiting per User
- Admin Dashboard for LLM Token Cost Analysis and User Analytics`,
  },
];

/**
 * Intelligent Heuristic NLP Requirement Parser
 */
function analyzeWithHeuristics(input = {}) {
  const { title = '', description = '', requirementsText = '', domain = 'General' } = input;
  const rawText = `${description}\n${requirementsText}`.trim();

  // Split text into candidate requirement sentences and user stories
  const rawLines = rawText
    .split(/\n|•|\*|-{2,}|;\s|\.\s+(?=[A-Z])/)
    .map((l) => l.trim().replace(/^[-•*#\d.]+\s*/, ''))
    .filter((l) => l.length >= 6);

  const features = [];
  const existingNames = new Set();
  let order = 1;

  // Keyword-based classification patterns
  const patterns = [
    {
      regex: /auth|login|sign\s?up|sign\s?in|sso|oauth|mfa|2fa|biometric|password|session/i,
      category: 'Authentication',
      priority: 'Must Have',
      complexity: 'Medium',
      prefix: 'Auth',
    },
    {
      regex: /pay|stripe|billing|checkout|wallet|invoice|subscription|refund|currency|card/i,
      category: 'Payment',
      priority: 'Must Have',
      complexity: 'High',
      prefix: 'Payment',
    },
    {
      regex: /video|webrtc|stream|call|camera|voice|audio/i,
      category: 'Core Functionality',
      priority: 'Must Have',
      complexity: 'Very High',
      prefix: 'Media',
    },
    {
      regex: /track|gps|map|geolocation|location|route|eta/i,
      category: 'Core Functionality',
      priority: 'Important',
      complexity: 'High',
      prefix: 'Geo',
    },
    {
      regex: /notify|sms|email|push|alert|ping|webhook/i,
      category: 'Communication',
      priority: 'Important',
      complexity: 'Medium',
      prefix: 'Notification',
    },
    {
      regex: /admin|dashboard|portal|moderation|backoffice|crm|kpi|management/i,
      category: 'Administration',
      priority: 'Important',
      complexity: 'Medium',
      prefix: 'Admin',
    },
    {
      regex: /analytic|metric|report|telemetry|chart|audit\s?log/i,
      category: 'Analytics',
      priority: 'Important',
      complexity: 'Medium',
      prefix: 'Analytics',
    },
    {
      regex: /ai|rag|llm|copilot|model|vector|embedding|generate/i,
      category: 'AI/ML',
      priority: 'Must Have',
      complexity: 'High',
      prefix: 'AI',
    },
    {
      regex: /security|compliance|hipaa|gdpr|pci|encrypt|fraud/i,
      category: 'Security',
      priority: 'Must Have',
      complexity: 'High',
      prefix: 'Security',
    },
    {
      regex: /integration|api|sync|zapier|export|import|connector/i,
      category: 'Integration',
      priority: 'Nice to Have',
      complexity: 'Medium',
      prefix: 'Integration',
    },
  ];

  for (const line of rawLines) {
    if (line.length < 8 || line.length > 250) continue;

    // Check for user story structure: "As a [user], I want to [action]"
    let featureName = line;
    let descriptionText = line;

    const userStoryMatch = line.match(/as an?\s+([^,]+),\s*i want(?: to)?\s+([^,]+?)(?:\s*so that|$)/i);
    if (userStoryMatch) {
      featureName = userStoryMatch[2].trim();
      featureName = featureName.charAt(0).toUpperCase() + featureName.slice(1);
      descriptionText = line;
    } else {
      // Clean up common bullet prefixes
      featureName = featureName
        .replace(/^(build|implement|create|develop|add|provide|support for)\s+/i, '')
        .trim();
      featureName = featureName.charAt(0).toUpperCase() + featureName.slice(1);
    }

    // Keep name concise (under 60 chars)
    if (featureName.length > 60) {
      const parts = featureName.split(/with|for|including|and/i);
      if (parts[0] && parts[0].length >= 10 && parts[0].length <= 60) {
        featureName = parts[0].trim();
      } else {
        featureName = featureName.slice(0, 57).trim() + '...';
      }
    }

    // De-duplicate
    const cleanKey = featureName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (existingNames.has(cleanKey)) continue;
    existingNames.add(cleanKey);

    // Identify category & complexity
    let category = 'Core Functionality';
    let priority = 'Must Have';
    let complexityLevel = 'Medium';

    for (const p of patterns) {
      if (p.regex.test(line)) {
        category = p.category;
        priority = p.priority;
        complexityLevel = p.complexity;
        break;
      }
    }

    // Priority adjustment based on terms
    if (/must|critical|essential|core|mvp/i.test(line)) priority = 'Must Have';
    else if (/nice|optional|future|phase 2|v2/i.test(line)) priority = 'Nice to Have';

    features.push({
      id: `feat_ai_${Date.now()}_${order}`,
      name: featureName,
      description: descriptionText,
      category,
      priority,
      complexityLevel,
      dependencies: [],
      source: 'AI Requirement Extraction (NLP)',
      order,
    });

    order++;
    if (features.length >= 25) break;
  }

  // Fallback if no specific lines could be parsed
  if (features.length === 0) {
    features.push(
      {
        id: `feat_ai_${Date.now()}_1`,
        name: 'User Authentication & Account Management',
        description: 'Secure registration, login, session tokens, and user profile management.',
        category: 'Authentication',
        priority: 'Must Have',
        complexityLevel: 'Medium',
        dependencies: [],
        source: 'AI Requirement Extraction (NLP)',
        order: 1,
      },
      {
        id: `feat_ai_${Date.now()}_2`,
        name: `${title || 'Core Platform'} Main Workflow`,
        description: description || 'Primary business logic, data models, and customer workflow modules.',
        category: 'Core Functionality',
        priority: 'Must Have',
        complexityLevel: 'High',
        dependencies: ['feat_ai_1'],
        source: 'AI Requirement Extraction (NLP)',
        order: 2,
      },
      {
        id: `feat_ai_${Date.now()}_3`,
        name: 'Administrative Control Portal',
        description: 'Operations management, user dispute handling, and system status configuration.',
        category: 'Administration',
        priority: 'Important',
        complexityLevel: 'Medium',
        dependencies: ['feat_ai_1'],
        source: 'AI Requirement Extraction (NLP)',
        order: 3,
      }
    );
  }

  // Deduce inter-feature dependencies automatically
  const authFeat = features.find((f) => f.category === 'Authentication');
  const paymentFeat = features.find((f) => f.category === 'Payment');
  const coreFeats = features.filter((f) => f.category === 'Core Functionality');

  features.forEach((feat) => {
    if (feat.category !== 'Authentication' && authFeat && feat.id !== authFeat.id) {
      if (/order|profile|consult|account|cart|billing|wallet/i.test(feat.name)) {
        feat.dependencies = [authFeat.id];
      }
    }
    if (feat.category === 'Payment' && coreFeats.length > 0) {
      const candidate = coreFeats.find((c) => /cart|order|checkout|booking|consult/i.test(c.name));
      if (candidate && candidate.id !== feat.id) {
        feat.dependencies = Array.from(new Set([...feat.dependencies, candidate.id]));
      }
    }
  });

  // Detect Missing Requirements based on domain best practices
  const missingRequirements = [];
  const allText = (features.map((f) => f.name + ' ' + f.description).join(' ') + ' ' + rawText).toLowerCase();

  if (!allText.includes('auth') && !allText.includes('login')) {
    missingRequirements.push({
      id: 'missing_auth',
      name: 'User Authentication & RBAC',
      reason: 'No identity or access management module identified in requirements.',
      suggestedCategory: 'Authentication',
      suggestedPriority: 'Must Have',
      severity: 'Critical',
    });
  }

  if (allText.includes('pay') && !allText.includes('refund') && !allText.includes('dispute')) {
    missingRequirements.push({
      id: 'missing_refunds',
      name: 'Dispute & Refund Processing',
      reason: 'Payment module specified without chargeback or dispute resolution workflows.',
      suggestedCategory: 'Payment',
      suggestedPriority: 'Important',
      severity: 'High',
    });
  }

  if (!allText.includes('audit') && (domain === 'FinTech' || domain === 'HealthTech' || allText.includes('hipaa') || allText.includes('bank'))) {
    missingRequirements.push({
      id: 'missing_audit',
      name: 'Regulatory Audit Logging & Compliance',
      reason: 'Regulated domain requires tamper-proof audit trails for compliance validation.',
      suggestedCategory: 'Security',
      suggestedPriority: 'Must Have',
      severity: 'Critical',
    });
  }

  if (!allText.includes('notify') && !allText.includes('push') && !allText.includes('email')) {
    missingRequirements.push({
      id: 'missing_notifications',
      name: 'Automated Notifications & Alerts',
      reason: 'No customer transactional alert channel (Email/SMS/Push) identified.',
      suggestedCategory: 'Communication',
      suggestedPriority: 'Important',
      severity: 'Medium',
    });
  }

  if (!allText.includes('admin') && !allText.includes('dashboard')) {
    missingRequirements.push({
      id: 'missing_admin',
      name: 'System Admin & Operations Console',
      reason: 'Platform lacks back-office administrative tooling for customer support.',
      suggestedCategory: 'Administration',
      suggestedPriority: 'Important',
      severity: 'Medium',
    });
  }

  // Detect Technical Architectural Risks
  const detectedRisks = [];
  if (allText.includes('webrtc') || allText.includes('video') || allText.includes('stream')) {
    detectedRisks.push({
      type: 'Media / Bandwidth Infrastructure',
      risk: 'Real-time video/audio streaming requires TURN/STUN relays and high-concurrency SFU servers.',
      impact: 'High',
    });
  }
  if (allText.includes('gps') || allText.includes('track') || allText.includes('location')) {
    detectedRisks.push({
      type: 'Geolocation & Battery Drain',
      risk: 'High-frequency background GPS telemetry increases mobile battery usage and geospatial indexing overhead.',
      impact: 'Medium',
    });
  }
  if (allText.includes('hipaa') || allText.includes('health') || allText.includes('medical')) {
    detectedRisks.push({
      type: 'Statutory Healthcare Compliance',
      risk: 'Requires Business Associate Agreements (BAA), end-to-end PHI data encryption, and periodic penetration audits.',
      impact: 'High',
    });
  }

  return {
    features,
    missingRequirements,
    detectedRisks,
    metadata: {
      mode: 'heuristic_nlp',
      aiEnabled: false,
      aiEngine: 'EstimateAI Smart Semantic NLP (Offline)',
      featureCount: features.length,
      analyzedAt: new Date().toISOString(),
      confidence: 86,
    },
  };
}

/**
 * Optional Google Gemini Flash API caller
 */
async function analyzeWithGemini(input = {}, apiKey = '') {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const promptText = `
You are an expert software solutions architect analyzing project requirements for cost and timeline estimation.
Analyze the following project description and generate a structured list of features.

Project Title: ${input.title || 'Software Application'}
Domain: ${input.domain || 'General'}
Requirements Text:
${input.description || ''}
${input.requirementsText || ''}

Return a STRICT JSON object with this exact structure:
{
  "features": [
    {
      "name": "Feature Name (concise, max 6 words)",
      "description": "Clear 1-2 sentence specification of what this feature accomplishes.",
      "category": "Authentication" | "Core Functionality" | "Payment" | "Communication" | "Administration" | "Analytics" | "AI/ML" | "Security" | "Integration",
      "priority": "Must Have" | "Important" | "Nice to Have",
      "complexityLevel": "Simple" | "Medium" | "High" | "Very High",
      "dependencies": []
    }
  ],
  "missingRequirements": [
    {
      "name": "Missing module name",
      "reason": "Why this is essential for production launch",
      "suggestedCategory": "Category",
      "suggestedPriority": "Must Have" | "Important"
    }
  ],
  "detectedRisks": [
    {
      "type": "Risk Name",
      "risk": "Description of technical risk",
      "impact": "High" | "Medium" | "Low"
    }
  ]
}
Do NOT include markdown backticks around the json. Only return raw JSON.
`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const rawJsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawJsonText) throw new Error('No candidate content returned by Gemini API');

  const parsed = JSON.parse(rawJsonText);
  const orderBase = Date.now();

  const formattedFeatures = (parsed.features || []).map((f, idx) => ({
    id: `feat_gemini_${orderBase}_${idx + 1}`,
    name: f.name || `Feature ${idx + 1}`,
    description: f.description || '',
    category: f.category || 'Core Functionality',
    priority: f.priority || 'Must Have',
    complexityLevel: f.complexityLevel || 'Medium',
    dependencies: Array.isArray(f.dependencies) ? f.dependencies : [],
    source: 'Google Gemini 1.5 Flash',
    order: idx + 1,
  }));

  return {
    features: formattedFeatures,
    missingRequirements: parsed.missingRequirements || [],
    detectedRisks: parsed.detectedRisks || [],
    metadata: {
      mode: 'gemini_flash',
      aiEngine: 'Google Gemini 1.5 Flash (Live)',
      featureCount: formattedFeatures.length,
      analyzedAt: new Date().toISOString(),
      confidence: 94,
    },
  };
}

/**
 * Public Requirement Analyzer Service
 */
export const requirementAnalyzer = {
  /**
   * Main entry point for analyzing natural language requirements
   */
  async analyzeRequirements(input = {}, options = {}) {
    const geminiKey =
      options.apiKey ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('estimateai_gemini_api_key') : '') ||
      (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY ? process.env.VITE_GEMINI_API_KEY : '');

    const requestedMode = options.mode || (geminiKey ? 'gemini' : 'heuristic');

    if (requestedMode === 'gemini' && geminiKey) {
      try {
        return await analyzeWithGemini(input, geminiKey);
      } catch (geminiError) {
        console.warn('Gemini API call failed, gracefully falling back to Smart NLP heuristics:', geminiError);
        const fallback = analyzeWithHeuristics(input);
        fallback.metadata.geminiError = geminiError.message;
        fallback.metadata.fallbackTriggered = true;
        return fallback;
      }
    }

    // Default: Smart Heuristic NLP
    return analyzeWithHeuristics(input);
  },

  /**
   * Helper to retrieve pre-built prompt templates
   */
  getTemplates() {
    return REQUIREMENT_TEMPLATES;
  },
};
