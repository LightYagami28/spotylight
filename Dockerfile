# --- Builder stage
FROM node:23-alpine@sha256:a34e14ef1df25b58258956049ab5a71ea7f0d498e41d0b514f4b8de09af09456 AS builder
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
FROM nginxinc/nginx-unprivileged:alpine-slim@sha256:a8cb0f33d51fa107c96fd2bd3a71aaf564ec131e9d2bdf8700944f0ed8b170d7

COPY --chown=nginx:nginx --from=builder /app/out/web /usr/share/nginx/html
COPY --chown=nginx:nginx ./settings.js.template /etc/nginx/settings.js.template
COPY --chown=nginx:nginx ./scripts/render-settings.sh /docker-entrypoint.d/20-render-settings.sh
COPY --chown=nginx:nginx ng.conf.template /etc/nginx/templates/default.conf.template

RUN chmod +x /docker-entrypoint.d/20-render-settings.sh && chmod 775 /etc/nginx/conf.d

ENV SERVER_LOCK=false SERVER_NAME="" SERVER_TYPE="" SERVER_URL="" REMOTE_URL=""
ENV LEGACY_AUTHENTICATION="" ANALYTICS_DISABLED="" PUBLIC_PATH="/"

EXPOSE 9180
CMD ["nginx", "-g", "daemon off;"]
