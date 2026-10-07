/**
 * EstimateAI — Phase 8 AI Provider Abstraction
 *
 * Provides a decoupled provider interface supporting:
 * 1. Google Gemini Flash Provider (Live LLM)
 * 2. Fallback NLP Provider (Deterministic, offline, zero-dependency)
 *
 * Implements clean timeout handling via AbortController.
 */

export class AIProvider {
  constructor(name) {
    this.name = name;
  }

  async generateStructured(prompt, schemaName) {
    throw new Error('generateStructured() must be implemented by subclass.');
  }
}

/**
 * Live Google Gemini Flash Provider
 */
export class GeminiProvider extends AIProvider {
  constructor(options = {}) {
    super('Google Gemini');
    this.apiKey = options.apiKey || '';
    this.model = options.model || 'gemini-1.5-flash';
    this.timeoutMs = (options.timeoutSeconds || 30) * 1000;
  }

  async generateStructured(promptText) {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured.');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2, // Low temperature for high structural fidelity
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API HTTP ${response.status}: ${errText.slice(0, 300)}`);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error('No candidate content received from Gemini model.');
      }

      // Parse JSON safely
      const cleanJson = content.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error(`AI request timed out after ${this.timeoutMs / 1000} seconds.`);
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Deterministic Heuristic NLP Provider (Offline Fallback)
 * Works out-of-the-box without network, API keys, or cloud costs.
 */
export class FallbackNLPProvider extends AIProvider {
  constructor() {
    super('EstimateAI Semantic NLP (Offline Fallback)');
  }

  async generateStructured(promptText, operation = 'feature_extraction') {
    // Quick parse based on operation requested
    if (promptText.includes('TASK: Extract a structured list')) {
      return this._extractFeatures(promptText);
    }
    if (promptText.includes('TASK: Analyze the provided software feature')) {
      return this._suggestComplexity(promptText);
    }
    if (promptText.includes('TASK: Review the current feature list for this project and identify 3-7 critical MISSING')) {
      return this._detectMissing(promptText);
    }
    if (promptText.includes('TASK: Provide a clear, executive-grade explanation')) {
      return this._explainEstimate(promptText);
    }

    return { result: 'Default semantic fallback' };
  }

  _extractFeatures(promptText) {
    const lines = promptText
      .split('\n')
      .map((l) => l.trim().replace(/^[-•*#\d.]+\s*/, ''))
      .filter((l) => l.length >= 8 && !l.includes('SYSTEM') && !l.includes('USER PROJECT DATA') && !l.includes('TASK:'));

    const features = [];
    const seen = new Set();

    for (const line of lines) {
      if (line.length > 200 || line.includes('Project Title:') || line.includes('Domain:') || line.includes('Platforms:')) continue;

      let name = line.replace(/^(build|create|implement|provide|add|support for)\s+/i, '').trim();
      if (name.length > 55) name = name.slice(0, 52) + '...';

      const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seen.has(key)) continue;
      seen.add(key);

      let category = 'Core Functionality';
      if (/auth|login|signup|password|sso/i.test(line)) category = 'Authentication';
      else if (/pay|checkout|billing|stripe|wallet/i.test(line)) category = 'Payment';
      else if (/notify|sms|email|push/i.test(line)) category = 'Communication';
      else if (/admin|dashboard|portal|report/i.test(line)) category = 'Administration';
      else if (/analytic|metric|chart/i.test(line)) category = 'Analytics';
      else if (/security|hipaa|encrypt/i.test(line)) category = 'Security';

      features.push({
        name,
        description: line,
        category,
        priority: /must|mvp|core/i.test(line) ? 'Must Have' : 'Important',
        confidence: 0.88,
      });

      if (features.length >= 15) break;
    }

    if (features.length === 0) {
      features.push(
        {
          name: 'Core Application Workflow',
          description: 'Primary customer business processes and data pipelines.',
          category: 'Core Functionality',
          priority: 'Must Have',
          confidence: 0.85,
        },
        {
          name: 'User Identity & Access Management',
          description: 'Registration, authentication, and permission enforcement.',
          category: 'Authentication',
          priority: 'Must Have',
          confidence: 0.9,
        }
      );
    }

    return { features };
  }

  _suggestComplexity(promptText) {
    const textLower = promptText.toLowerCase();

    // 7 factors: 0 to 5
    let functional = 3;
    let integration = 2;
    let data = 2;
    let security = 2;
    let ui = 2;
    let technical = 2;
    let dependency = 2;

    const reasons = {};

    if (textLower.includes('payment') || textLower.includes('checkout') || textLower.includes('stripe')) {
      security = 4;
      integration = 4;
      functional = 4;
      reasons.security_complexity = 'Financial transactions require PCI-DSS and webhook idempotency.';
      reasons.integration_complexity = 'Requires external payment gateway SDK and reconciliation.';
    }

    if (textLower.includes('auth') || textLower.includes('login') || textLower.includes('sso')) {
      security = 4;
      functional = 3;
      reasons.security_complexity = 'User credentials, JWT tokens, and session management.';
    }

    if (textLower.includes('video') || textLower.includes('webrtc') || textLower.includes('stream')) {
      technical = 5;
      integration = 4;
      reasons.technical_complexity = 'Real-time media streaming, SFU orchestration, and socket signaling.';
    }

    if (textLower.includes('track') || textLower.includes('gps') || textLower.includes('map')) {
      technical = 4;
      integration = 3;
      ui = 3;
      reasons.technical_complexity = 'High-frequency location indexing and geospatial calculations.';
    }

    return {
      complexity: {
        overall_score: 3,
        confidence: 0.86,
        factors: {
          functional_complexity: functional,
          integration_complexity: integration,
          data_complexity: data,
          security_complexity: security,
          ui_complexity: ui,
          technical_complexity: technical,
          dependency_complexity: dependency,
        },
        reasoning: reasons,
      },
      risks: [
        'Integration failure handling and third-party API latency',
        'Security verification and data integrity audits',
      ],
      assumptions: ['Standard modern cloud infrastructure and secure network environment'],
    };
  }

  _detectMissing(promptText) {
    const textLower = promptText.toLowerCase();
    const missing = [];

    if (!textLower.includes('auth') && !textLower.includes('login')) {
      missing.push({
        name: 'User Authentication & RBAC',
        description: 'Secure registration, login, JWT token refresh, and role-based permissions.',
        reason: 'Essential for user data isolation and security perimeter.',
        suggestedCategory: 'Authentication',
        suggestedPriority: 'Must Have',
        confidence: 0.95,
      });
    }

    if (textLower.includes('payment') && !textLower.includes('refund')) {
      missing.push({
        name: 'Refund & Dispute Resolution Workflow',
        description: 'Customer refund initiation, chargeback handling, and settlement receipts.',
        reason: 'Payment integrations require clear dispute handling to prevent operational blocks.',
        suggestedCategory: 'Payment',
        suggestedPriority: 'Important',
        confidence: 0.9,
      });
    }

    if (!textLower.includes('audit')) {
      missing.push({
        name: 'Security Audit Logging & Activity Trail',
        description: 'Tamper-proof event logs for authentication, financial actions, and admin operations.',
        reason: 'Standard enterprise compliance requirement for production validation.',
        suggestedCategory: 'Security',
        suggestedPriority: 'Important',
        confidence: 0.86,
      });
    }

    if (!textLower.includes('notification')) {
      missing.push({
        name: 'Automated Notifications & Delivery Alerts',
        description: 'Transactional email, SMS, and push notification triggers.',
        reason: 'Keeps customers informed during core transaction milestones.',
        suggestedCategory: 'Communication',
        suggestedPriority: 'Important',
        confidence: 0.88,
      });
    }

    return { missing_features: missing };
  }

  _explainEstimate(promptText) {
    // Extract actual numbers from prompt text
    const costMatch = promptText.match(/Total Build Cost:\s*₹?([\d,]+)/);
    const effortMatch = promptText.match(/Total Effort:\s*([\d,]+)/);
    const weeksMatch = promptText.match(/Delivery Duration:\s*([\d.]+)/);
    const teamMatch = promptText.match(/Team Velocity:\s*([\d.]+)/);

    const costStr = costMatch ? `₹${costMatch[1]}` : 'calculated budget';
    const effortStr = effortMatch ? `${effortMatch[1]} hours` : 'estimated hours';
    const weeksStr = weeksMatch ? `${weeksMatch[1]} calendar weeks` : 'the delivery window';
    const teamStr = teamMatch ? `${teamMatch[1]} full-time engineers` : 'the cross-functional team';

    return {
      summary: {
        headline: 'Deterministic Engineering & Cost Rationale',
        timeline_explanation: `The estimated duration of ${weeksStr} is based on a team velocity of ${teamStr} working in 2-week agile sprints. It incorporates critical path feature dependencies and a 2-week sequential buffer for requirements stabilization and production deployment.`,
        team_explanation: `A team size of ${teamStr} balances parallel development efficiency against communication overhead. Specialized frontend, backend, and QA engineers ensure steady milestone velocity.`,
        major_cost_drivers: [
          `Total project engineering effort of ${effortStr} commanding ${costStr}`,
          'Security, authentication, and payment integration requirements',
          'QA testing, multi-platform verification, and deployment orchestration',
        ],
        confidence_assessment: 'Rated high based on well-defined feature scopes, clear technical priorities, and standard industry rate baselines.',
      },
      feature_explanations: [
        {
          feature_name: 'Core Architecture & Workflows',
          explanation: 'Commands substantial effort due to domain business logic, data models, and API integrations.',
          primary_drivers: ['Business logic complexity', 'Data pipeline stability'],
        },
      ],
      ai_risks: [
        {
          type: 'Schedule Compression',
          description: 'Compressing the delivery calendar may require adding parallel specialists with diminishing marginal returns.',
          severity: 'Medium',
        },
      ],
      assumptions: [
        'Team engineers have relevant mid-level domain experience',
        'Requirements and UI wireframes remain stable after kickoff',
      ],
    };
  }
}
