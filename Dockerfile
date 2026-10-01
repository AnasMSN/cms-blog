# syntax=docker/dockerfile:1
# Multi-stage build: deps -> builder -> runner (small) ; "tools" is for one-off tasks (seed, migrations).
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build never touches the database (all pages render on request), so a dummy secret is enough.
ENV PAYLOAD_SECRET=build-only-not-used-at-runtime
RUN npm run build

# One-off tasks: `docker compose run --rm tools npm run seed`
FROM builder AS tools
ENV NODE_ENV=production
CMD ["npx", "payload", "migrate:status"]

FROM base AS runner
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 \
    DATABASE_URI=file:/app/data/site.db MEDIA_DIR=/app/media
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs \
 && mkdir -p /app/data /app/media /app/.next && chown -R nextjs:nodejs /app
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1
# Database migrations run automatically on boot (prodMigrations in payload.config.ts).
CMD ["node", "server.js"]
