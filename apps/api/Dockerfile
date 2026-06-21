# Build context is the REPO ROOT (see docker-compose.yml) so the npm workspace
# lockfile and packages/ (@repo/shared, ts-config) are available.
# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

# Prune the monorepo down to this workspace (+ its internal deps).
FROM base AS pruner
COPY . .
RUN npx --yes turbo@^2 prune test-agent-api --docker

# Production deps only — installs JUST this workspace's deps from the pruned lockfile.
FROM base AS prod-deps
COPY --from=pruner /app/out/json/ ./
RUN npm ci --omit=dev

# Build — full deps + compile TypeScript to dist.
FROM base AS build
COPY --from=pruner /app/out/json/ ./
RUN npm ci
COPY --from=pruner /app/out/full/ ./
# tsconfig extends this; it isn't a workspace package so it's not in the prune output.
COPY --from=pruner /app/packages/ts-config ./packages/ts-config
RUN npm run build -w test-agent-api

# Runtime — small now because prod-deps holds only this app's deps.
# Copy the whole prod-deps /app so non-hoisted deps (e.g. p-limit in apps/api/node_modules) resolve.
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /app ./
COPY --from=build /app/apps/api/dist ./apps/api/dist
EXPOSE 3001
CMD ["node", "apps/api/dist/index.js"]
