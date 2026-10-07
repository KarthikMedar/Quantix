# ==============================================================================
# EstimateAI — Multi-Stage Production Container Image
# ==============================================================================

# --- Stage 1: Build Application Bundle ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies with lockfile caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build production assets
COPY . .
RUN npm run build

# --- Stage 2: Minimal Runtime Environment ---
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy build artifacts and configuration
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/vite.config.js ./vite.config.js
COPY --from=builder /app/index.html ./index.html

# Expose HTTP port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

# Start production server
CMD ["npx", "vite", "preview", "--port", "3000", "--host", "0.0.0.0"]
