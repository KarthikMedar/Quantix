import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { aiService } from './src/services/ai/aiService.js';

function readJsonBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function aiBackendPlugin() {
  return {
    name: 'estimateai-backend-api',
    configureServer(server) {
      // Initialize server-side AI configuration securely from environment
      const serverApiKey = process.env.AI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
      const serverProvider = process.env.AI_PROVIDER || (serverApiKey ? 'gemini' : 'fallback');
      const serverModel = process.env.AI_MODEL || 'gemini-1.5-flash';
      const aiEnabled = process.env.AI_ENABLED !== 'false';

      aiService.updateConfig({
        enabled: aiEnabled,
        apiKey: serverApiKey,
        provider: serverProvider,
        model: serverModel,
      });

      // In-memory rate limiting map (IP -> timestamp array)
      const rateLimitMap = new Map();
      const MAX_REQUESTS_PER_MINUTE = 60;

      server.middlewares.use(async (req, res, next) => {
        // Production Security Headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');

        // Health check endpoint
        if (req.url === '/health' || req.url === '/api/health') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              status: 'healthy',
              service: 'EstimateAI Deterministic Estimation Platform',
              engineVersion: '1.0.0',
              configVersion: '1.0.0',
              rateVersion: '1.0.0',
              aiEnabled,
              aiProvider: serverProvider,
              hasServerKey: Boolean(serverApiKey),
              uptimeSeconds: Math.round(process.uptime()),
              timestamp: new Date().toISOString(),
            })
          );
          return;
        }

        // Rate limiter for AI API endpoints
        if (req.url.startsWith('/api/ai/')) {
          const clientIp = req.socket.remoteAddress || '127.0.0.1';
          const now = Date.now();
          const windowStart = now - 60000;
          const timestamps = (rateLimitMap.get(clientIp) || []).filter((t) => t > windowStart);

          if (timestamps.length >= MAX_REQUESTS_PER_MINUTE) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 429;
            res.end(
              JSON.stringify({
                error: {
                  code: 'RATE_LIMIT_EXCEEDED',
                  message: 'Too many requests. Please wait a moment before trying again.',
                },
              })
            );
            return;
          }

          timestamps.push(now);
          rateLimitMap.set(clientIp, timestamps);
        }

        // AI Status
        if (req.url === '/api/ai/status') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              enabled: aiEnabled,
              provider: serverProvider,
              model: serverModel,
              hasServerKey: Boolean(serverApiKey),
              timestamp: new Date().toISOString(),
            })
          );
          return;
        }

        // AI Feature Extraction
        if (req.url === '/api/ai/analyze-project' && req.method === 'POST') {
          try {
            const body = await readJsonBody(req);
            const result = await aiService.extractFeatures(body.projectInput || {}, body.options || {});
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ error: { code: 'ANALYSIS_FAILED', message: err.message } }));
          }
          return;
        }

        // AI Complexity Suggestion
        if (req.url === '/api/ai/suggest-complexity' && req.method === 'POST') {
          try {
            const body = await readJsonBody(req);
            const result = await aiService.suggestComplexity(body.feature || {}, body.project || {}, body.options || {});
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ error: { code: 'SUGGESTION_FAILED', message: err.message } }));
          }
          return;
        }

        // AI Missing Features
        if (req.url === '/api/ai/missing-features' && req.method === 'POST') {
          try {
            const body = await readJsonBody(req);
            const result = await aiService.suggestMissingFeatures(body.project || {}, body.existingFeatures || [], body.options || {});
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ error: { code: 'MISSING_FEATURES_FAILED', message: err.message } }));
          }
          return;
        }

        // AI Estimate Explanation
        if (req.url === '/api/ai/explain-estimate' && req.method === 'POST') {
          try {
            const body = await readJsonBody(req);
            const result = await aiService.explainEstimate(body.estimateData || {}, body.options || {});
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ error: { code: 'EXPLANATION_FAILED', message: err.message } }));
          }
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), aiBackendPlugin()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false,
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
  },
});
