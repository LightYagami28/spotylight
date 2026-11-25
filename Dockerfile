# --- Builder stage
FROM node:24.22.3-alpine3.24 AS builder
WORKDIR /app

# Copy package.json first to cache node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .

# Match packageManager in package.json (pnpm is not bundled in the Node image)
RUN corepack enable && corepack prepare pnpm@11.5.2 --activate

RUN pnpm install --frozen-lockfile

# Copy code and build with cached modules
COPY . .
RUN pnpm run build:web

# --- Production stage
FROM nginxinc/nginx-unprivileged:1.30.6-alpine3.24-slim

LABEL org.opencontainers.image.title="SpotyLight" \
      org.opencontainers.image.description="Client musicale web self-hosted" \
      org.opencontainers.image.source="https://github.com/LightYagami28/spotylight" \
      org.opencontainers.image.url="https://github.com/LightYagami28/spotylight" \
      org.opencontainers.image.licenses="GPL-3.0-only"

COPY --chown=nginx:nginx --from=builder /app/out/web /usr/share/nginx/html
COPY --chown=nginx:nginx ./settings.js.template /etc/spotylight/settings.js.template
COPY --chown=nginx:nginx --chmod=755 ./docker/40-spotylight-settings.sh /docker-entrypoint.d/40-spotylight-settings.sh
COPY --chown=nginx:nginx ./docker/security-headers.inc.template /etc/nginx/templates/security-headers.inc.template
COPY --chown=nginx:nginx ng.conf.template /etc/nginx/templates/default.conf.template

ENV SERVER_LOCK=false SERVER_NAME="" SERVER_TYPE="" SERVER_URL="" REMOTE_URL=""
ENV LEGACY_AUTHENTICATION="" ANALYTICS_DISABLED="" PUBLIC_PATH="/" CSP_EXTRA_SRC=""

EXPOSE 9180
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:9180/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
