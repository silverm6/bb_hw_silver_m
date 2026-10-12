# syntax=docker/dockerfile:1

FROM oven/bun:1.4.3-alpine
WORKDIR /service
COPY package.json bun.lock ./
COPY packages/dragons-api/package.json packages/dragons-api/
COPY apps/dragons-cli/package.json apps/dragons-cli/
RUN bun install --frozen-lockfile --production --filter dragons-cli
COPY packages/dragons-api/src packages/dragons-api/src
COPY apps/dragons-cli/index.ts apps/dragons-cli/
COPY apps/dragons-cli/src apps/dragons-cli/src
USER bun
WORKDIR /service/apps/dragons-cli
ENTRYPOINT ["bun", "index.ts"]
