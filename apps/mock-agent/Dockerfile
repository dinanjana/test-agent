# Build context is the REPO ROOT (see docker-compose.yml).
# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/mock-agent/package.json ./apps/mock-agent/
COPY packages ./packages

# ---- Build ----
FROM base AS build
RUN npm ci
COPY apps/mock-agent ./apps/mock-agent
RUN npm -w apps/mock-agent run build

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
COPY --from=build /app/apps/mock-agent/dist ./apps/mock-agent/dist
EXPOSE 4000
CMD ["node", "apps/mock-agent/dist/index.js"]
