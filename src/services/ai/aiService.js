/**
 * EstimateAI — Phase 8 AI Orchestration Service
 *
 * Implements the core AI service layer:
 * - Environment configuration & secret protection
 * - Input size limits & prompt injection protection
 * - Deterministic caching with hash keys
 * - Provider abstraction (Gemini with Fallback NLP)
 * - Strict JSON schema validation
 * - Duplicate feature prevention
 * - Full audit metadata tracking
 * - 100% resilient fallback: never crashes the estimation application
 */

import { GeminiProvider, FallbackNLPProvider } from './aiProvider.js';
import { aiCache } from './aiCache.js';
import {
  PROMPT_VERSIONS,
  buildFeatureExtractionPrompt,
  buildComplexitySuggestionPrompt,
  buildMissingFeaturesPrompt,
  buildEstimateExplanationPrompt,
} from './aiPrompts.js';
import {
  validateFeatureExtraction,
  validateComplexitySuggestion,
  validateMissingFeatures,
  validateEstimateExplanation,
} from './aiSchemas.js';

// Configuration defaults
const DEFAULT_TIMEOUT_SECONDS = 30;
const MAX_DESCRIPTION_LENGTH = 4000;
const MAX_FEATURES_LIMIT = 100;

export class AIService {
  constructor(config = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      provider: config.provider || 'gemini',
      model: config.model || 'gemini-1.5-flash',
      apiKey: config.apiKey || '',
      timeoutSeconds: config.timeoutSeconds || DEFAULT_TIMEOUT_SECONDS,
    };

    this.fallbackProvider = new FallbackNLPProvider();
    this._initProvider();
  }

  _initProvider() {
    if (this.config.provider === 'gemini' && this.config.apiKey) {
      this.activeProvider = new GeminiProvider({
        apiKey: this.config.apiKey,
        model: this.config.model,
        timeoutSeconds: this.config.timeoutSeconds,
      });
    } else {
      this.activeProvider = this.fallbackProvider;
    }
  }

  /**
   * Updates configuration dynamically (e.g. from server middleware or settings)
   */
  updateConfig(updates = {}) {
    this.config = { ...this.config, ...updates };
    this._initProvider();
  }

  /**
   * 1. AI Feature Extraction from natural language project description
   */
  async extractFeatures(projectInput = {}, options = {}) {
    const rawText = `${projectInput.description || ''} ${projectInput.requirementsText || ''}`.trim();

    // Input size limit validation
    if (rawText.length > MAX_DESCRIPTION_LENGTH) {
      throw new Error(`Project description exceeds ${MAX_DESCRIPTION_LENGTH} characters. Please shorten the description.`);
    }

    const promptVersion = PROMPT_VERSIONS.feature_extraction;
    const cacheKey = aiCache.generateKey('feature_extraction', rawText, this.config.model, promptVersion);

    // Check cache
    if (!options.bypassCache && aiCache.has(cacheKey)) {
      const cached = aiCache.get(cacheKey);
      return { ...cached, audit: { ...cached.audit, from_cache: true } };
    }

    const prompt = buildFeatureExtractionPrompt(projectInput);
    let rawOutput;
    let usedProvider = this.activeProvider.name;

    try {
      if (this.config.enabled && this.activeProvider !== this.fallbackProvider) {
        rawOutput = await this.activeProvider.generateStructured(prompt);
      } else {
        rawOutput = await this.fallbackProvider.generateStructured(prompt, 'feature_extraction');
        usedProvider = this.fallbackProvider.name;
      }
    } catch (providerErr) {
      console.warn('AI Provider failed, falling back to Semantic NLP:', providerErr.message);
      rawOutput = await this.fallbackProvider.generateStructured(prompt, 'feature_extraction');
      usedProvider = `${this.fallbackProvider.name} (Fallback after error: ${providerErr.message})`;
    }

    // Strict Schema Validation
    const validated = validateFeatureExtraction(rawOutput);

    const audit = {
      ai_used: true,
      provider: usedProvider,
      model: this.config.model,
      prompt_version: promptVersion,
      operation: 'feature_extraction',
      created_at: new Date().toISOString(),
    };

    const result = {
      ...validated,
      audit,
    };

    aiCache.set(cacheKey, result, audit);
    return result;
  }

  /**
   * 2. AI Complexity Factor Suggestions (0 to 5 for the 7 factors)
   */
  async suggestComplexity(feature = {}, project = {}, options = {}) {
    if (!feature || !feature.name) {
      throw new Error('Feature name is required for complexity suggestion.');
    }

    const promptVersion = PROMPT_VERSIONS.complexity_suggestion;
    const cacheInput = `${feature.name}_${feature.description || ''}_${feature.category || ''}`;
    const cacheKey = aiCache.generateKey('complexity_suggestion', cacheInput, this.config.model, promptVersion);

    if (!options.bypassCache && aiCache.has(cacheKey)) {
      const cached = aiCache.get(cacheKey);
      return { ...cached, audit: { ...cached.audit, from_cache: true } };
    }

    const prompt = buildComplexitySuggestionPrompt(feature, project);
    let rawOutput;
    let usedProvider = this.activeProvider.name;

    try {
      if (this.config.enabled && this.activeProvider !== this.fallbackProvider) {
        rawOutput = await this.activeProvider.generateStructured(prompt);
      } else {
        rawOutput = await this.fallbackProvider.generateStructured(prompt, 'complexity_suggestion');
        usedProvider = this.fallbackProvider.name;
      }
    } catch (err) {
      console.warn('AI complexity provider failed, using fallback:', err.message);
      rawOutput = await this.fallbackProvider.generateStructured(prompt, 'complexity_suggestion');
      usedProvider = `${this.fallbackProvider.name} (Fallback)`;
    }

    const validated = validateComplexitySuggestion(rawOutput);

    const audit = {
      ai_used: true,
      provider: usedProvider,
      model: this.config.model,
      prompt_version: promptVersion,
      operation: 'complexity_suggestion',
      created_at: new Date().toISOString(),
    };

    const result = {
      ...validated,
      audit,
    };

    aiCache.set(cacheKey, result, audit);
    return result;
  }

  /**
   * 3. AI Missing Feature Suggestions with Duplicate Prevention
   */
  async suggestMissingFeatures(project = {}, existingFeatures = [], options = {}) {
    if (existingFeatures.length > MAX_FEATURES_LIMIT) {
      throw new Error(`Project exceeds ${MAX_FEATURES_LIMIT} features limit.`);
    }

    const promptVersion = PROMPT_VERSIONS.missing_features;
    const existingNames = existingFeatures.map((f) => f.name).sort().join('|');
    const cacheKey = aiCache.generateKey('missing_features', `${project.name}_${existingNames}`, this.config.model, promptVersion);

    if (!options.bypassCache && aiCache.has(cacheKey)) {
      const cached = aiCache.get(cacheKey);
      return { ...cached, audit: { ...cached.audit, from_cache: true } };
    }

    const prompt = buildMissingFeaturesPrompt(project, existingFeatures);
    let rawOutput;
    let usedProvider = this.activeProvider.name;

    try {
      if (this.config.enabled && this.activeProvider !== this.fallbackProvider) {
        rawOutput = await this.activeProvider.generateStructured(prompt);
      } else {
        rawOutput = await this.fallbackProvider.generateStructured(prompt, 'missing_features');
        usedProvider = this.fallbackProvider.name;
      }
    } catch (err) {
      console.warn('AI missing features provider failed, using fallback:', err.message);
      rawOutput = await this.fallbackProvider.generateStructured(prompt, 'missing_features');
      usedProvider = `${this.fallbackProvider.name} (Fallback)`;
    }

    const validated = validateMissingFeatures(rawOutput);

    // Duplicate Prevention (Step 12): Filter out suggestions that already exist in feature roster
    const normalizedExisting = new Set(
      existingFeatures.map((f) =>
        f.name.toLowerCase().replace(/[^a-z0-9]/g, '')
      )
    );

    const filteredSuggestions = validated.missing_features.filter((sug) => {
      const cleanSug = sug.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return !normalizedExisting.has(cleanSug);
    });

    const audit = {
      ai_used: true,
      provider: usedProvider,
      model: this.config.model,
      prompt_version: promptVersion,
      operation: 'missing_features',
      created_at: new Date().toISOString(),
    };

    const result = {
      missing_features: filteredSuggestions,
      audit,
    };

    aiCache.set(cacheKey, result, audit);
    return result;
  }

  /**
   * 4. AI Estimate Explanation referencing actual calculated numbers
   */
  async explainEstimate(estimateData = {}, options = {}) {
    if (!estimateData || !estimateData.summary) {
      throw new Error('Valid estimate summary is required to generate explanation.');
    }

    const promptVersion = PROMPT_VERSIONS.estimate_explanation;
    const cacheInput = `${estimateData.estimateId || ''}_${estimateData.summary.expectedCost}_${estimateData.summary.expectedEffortHours}`;
    const cacheKey = aiCache.generateKey('estimate_explanation', cacheInput, this.config.model, promptVersion);

    if (!options.bypassCache && aiCache.has(cacheKey)) {
      const cached = aiCache.get(cacheKey);
      return { ...cached, audit: { ...cached.audit, from_cache: true } };
    }

    const prompt = buildEstimateExplanationPrompt(estimateData);
    let rawOutput;
    let usedProvider = this.activeProvider.name;

    try {
      if (this.config.enabled && this.activeProvider !== this.fallbackProvider) {
        rawOutput = await this.activeProvider.generateStructured(prompt);
      } else {
        rawOutput = await this.fallbackProvider.generateStructured(prompt, 'estimate_explanation');
        usedProvider = this.fallbackProvider.name;
      }
    } catch (err) {
      console.warn('AI explanation provider failed, using fallback:', err.message);
      rawOutput = await this.fallbackProvider.generateStructured(prompt, 'estimate_explanation');
      usedProvider = `${this.fallbackProvider.name} (Fallback)`;
    }

    const validated = validateEstimateExplanation(rawOutput);

    const audit = {
      ai_used: true,
      provider: usedProvider,
      model: this.config.model,
      prompt_version: promptVersion,
      operation: 'estimate_explanation',
      created_at: new Date().toISOString(),
    };

    const result = {
      ...validated,
      audit,
    };

    aiCache.set(cacheKey, result, audit);
    return result;
  }
}

// Global default singleton instance
export const aiService = new AIService();
