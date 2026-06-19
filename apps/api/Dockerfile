# Build context is the REPO ROOT (see docker-compose.yml) so the npm workspace
# lockfile and packages/ (@repo/shared, ts-config) are available.
# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app
# Manifests + workspace packages first, so `npm ci` layers cache on dependency changes.
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/mock-agent/package.json ./apps/mock-agent/
COPY packages ./packages

# ---- Build: full deps + compile TypeScript to dist ----
FROM base AS build
RUN npm ci
COPY apps/api ./apps/api
RUN npm -w apps/api run build

# ---- Production deps only ----
FROM base AS prod-deps
RUN npm ci --omit=dev

# ---- Runtime ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy the whole prod-deps tree (root + any non-hoisted workspace node_modules,
# manifests, packages) so module resolution works regardless of npm hoisting,
# then overlay the compiled output.
COPY --from=prod-deps /app ./
COPY --from=build /app/apps/api/dist ./apps/api/dist
EXPOSE 3001
CMD ["node", "apps/api/dist/index.js"]
