/**
 * EstimateAI — Phase 8 AI API Client
 *
 * Communicates with backend AI endpoints (/api/ai/*):
 * - POST /api/ai/analyze-project
 * - POST /api/ai/suggest-complexity
 * - POST /api/ai/missing-features
 * - POST /api/ai/explain-estimate
 * - GET  /api/ai/status
 *
 * Implements seamless fallback to aiService if backend route is unavailable.
 * Never exposes secrets in frontend code.
 */

import { aiService } from './ai/aiService.js';

export const aiApi = {
  /**
   * Retrieves AI provider status and configuration info
   */
  async getStatus() {
    try {
      const res = await fetch('/api/ai/status');
      if (res.ok) return await res.json();
    } catch (err) {
      // Backend route unreachable, use local service config
    }
    return {
      enabled: aiService.config.enabled,
      provider: aiService.config.provider,
      model: aiService.config.model,
      fallbackMode: true,
    };
  },

  /**
   * 1. Extracts features from natural language description
   */
  async extractFeatures(projectInput, options = {}) {
    try {
      const res = await fetch('/api/ai/analyze-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectInput, options }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      // Fallback
    }
    return aiService.extractFeatures(projectInput, options);
  },

  /**
   * 2. Suggests complexity factors (0-5) for a feature
   */
  async suggestComplexity(feature, project, options = {}) {
    try {
      const res = await fetch('/api/ai/suggest-complexity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature, project, options }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      // Fallback
    }
    return aiService.suggestComplexity(feature, project, options);
  },

  /**
   * 3. Suggests missing features for a project
   */
  async suggestMissingFeatures(project, existingFeatures, options = {}) {
    try {
      const res = await fetch('/api/ai/missing-features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project, existingFeatures, options }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      // Fallback
    }
    return aiService.suggestMissingFeatures(project, existingFeatures, options);
  },

  /**
   * 4. Generates an executive explanation for an estimate result
   */
  async explainEstimate(estimateData, options = {}) {
    try {
      const res = await fetch('/api/ai/explain-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estimateData, options }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      // Fallback
    }
    return aiService.explainEstimate(estimateData, options);
  },
};
