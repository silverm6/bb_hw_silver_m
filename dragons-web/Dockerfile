# syntax=docker/dockerfile:1

FROM oven/bun:1.4.3-alpine AS build
WORKDIR /source
COPY package.json bun.lock ./
COPY dragons-api/package.json dragons-api/
COPY dragons-web/package.json dragons-web/
RUN bun install --frozen-lockfile --filter dragons-web
COPY dragons-api/src dragons-api/src
COPY dragons-web/index.html dragons-web/vite.config.ts dragons-web/
COPY dragons-web/src dragons-web/src
RUN bun run --cwd dragons-web build

FROM nginxinc/nginx-unprivileged:1.29-alpine AS runner
ENV NGINX_ENTRYPOINT_QUIET_LOGS=1
COPY --from=build /source/dragons-web/dist /usr/share/nginx/html
EXPOSE 8080
