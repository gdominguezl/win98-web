# Build stage: install deps with Bun and produce the Vite production build.
FROM oven/bun:1 AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Runtime stage: serve dist/ under /win98-web/ with nginx.
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html/win98-web
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1
