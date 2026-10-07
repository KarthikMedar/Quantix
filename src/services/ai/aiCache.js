/**
 * EstimateAI — Phase 8 Deterministic AI Cache
 *
 * Prevents redundant LLM API calls by hashing:
 * hash(normalized_input + operation + model + prompt_version)
 */

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

const memoryStore = new Map();
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export const aiCache = {
  /**
   * Generates a deterministic cache key
   */
  generateKey(operation, normalizedInput, model = 'default', promptVersion = 'v1') {
    const payload = JSON.stringify({
      operation,
      input: String(normalizedInput).trim().toLowerCase(),
      model,
      promptVersion,
    });
    return `aicache_${operation}_${promptVersion}_${simpleHash(payload)}`;
  },

  /**
   * Retrieves an item from cache if not expired
   */
  get(key) {
    if (!key) return null;
    const entry = memoryStore.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > TTL_MS) {
      memoryStore.delete(key);
      return null;
    }

    return entry.data;
  },

  /**
   * Stores an item with audit metadata
   */
  set(key, data, metadata = {}) {
    if (!key || !data) return;
    memoryStore.set(key, {
      data,
      metadata: {
        ...metadata,
        cachedAt: new Date().toISOString(),
      },
      timestamp: Date.now(),
    });
  },

  /**
   * Checks if key is cached
   */
  has(key) {
    return this.get(key) !== null;
  },

  /**
   * Clears cache
   */
  clear() {
    memoryStore.clear();
  },

  /**
   * Size of active cache
   */
  size() {
    return memoryStore.size;
  },
};
