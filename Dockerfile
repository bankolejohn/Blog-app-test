# Multi-stage Dockerfile for Next.js + Prisma (SQLite)

# 1) Base image
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Optional system deps for Prisma on Alpine
RUN apk add --no-cache openssl libc6-compat

# 2) Dependencies (for build cache)
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# 3) Builder
FROM base AS builder
WORKDIR /app
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma client and build Next.js app
RUN npx prisma generate && npm run build

# 4) Runner (production)
FROM base AS runner
WORKDIR /app

# Copy only required files
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next ./.next

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Ensure uploads dir exists (ephemeral inside container)
RUN mkdir -p public/uploads

# Healthcheck endpoint
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:${PORT:-3000}/api/healthz || exit 1

# Environment
ENV PORT=3000
EXPOSE 3000

# Entry point runs Prisma schema sync for SQLite then starts Next
COPY scripts/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

CMD ["/app/docker-entrypoint.sh"]


