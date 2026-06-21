# Build context is the REPO ROOT (see docker-compose.yml).
# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

# Prune the monorepo down to this workspace (+ its internal deps).
FROM base AS pruner
COPY . .
RUN npx --yes turbo@^2 prune mock-agent --docker

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
RUN npm run build -w mock-agent

# Runtime — small now because prod-deps holds only this app's deps.
# Copy the whole prod-deps /app so non-hoisted deps (e.g. p-limit in apps/api/node_modules) resolve.
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /app ./
COPY --from=build /app/apps/mock-agent/dist ./apps/mock-agent/dist
EXPOSE 4000
CMD ["node", "apps/mock-agent/dist/index.js"]
