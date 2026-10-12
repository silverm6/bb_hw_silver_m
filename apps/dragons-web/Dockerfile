# syntax=docker/dockerfile:1

FROM oven/bun:1.4.3-alpine AS build
WORKDIR /source
COPY package.json bun.lock ./
COPY packages/dragons-api/package.json packages/dragons-api/
COPY apps/dragons-web/package.json apps/dragons-web/
RUN bun install --frozen-lockfile --filter dragons-web
COPY packages/dragons-api/src packages/dragons-api/src
COPY apps/dragons-web/index.html apps/dragons-web/vite.config.ts apps/dragons-web/
COPY apps/dragons-web/src apps/dragons-web/src
RUN bun run --cwd apps/dragons-web build

FROM nginxinc/nginx-unprivileged:1.29-alpine AS runner
ENV NGINX_ENTRYPOINT_QUIET_LOGS=1
COPY --from=build /source/apps/dragons-web/dist /usr/share/nginx/html
EXPOSE 8080
