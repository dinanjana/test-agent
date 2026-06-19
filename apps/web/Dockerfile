# Build context is the REPO ROOT (see docker-compose.yml).
# Next.js "standalone" output keeps the runtime image small.
# NOTE: NEXT_PUBLIC_API_URL is baked into the client bundle at BUILD time and is
# resolved in the user's browser, so it must point at the HOST-mapped API
# (default http://localhost:3001). Serving the UI from another host => rebuild
# with --build-arg NEXT_PUBLIC_API_URL=...
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
COPY apps/web ./apps/web
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm -w apps/web run build

# ---- Runtime (standalone) ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# .next/standalone already contains a minimal node_modules + server.js
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
