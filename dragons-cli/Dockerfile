# syntax=docker/dockerfile:1

FROM oven/bun:1.4.3-alpine
WORKDIR /service
COPY package.json bun.lock ./
COPY dragons-api/package.json dragons-api/
COPY dragons-cli/package.json dragons-cli/
RUN bun install --frozen-lockfile --production --filter dragons-cli
COPY dragons-api/src dragons-api/src
COPY dragons-cli/index.ts dragons-cli/
COPY dragons-cli/src dragons-cli/src
USER bun
WORKDIR /service/dragons-cli
ENTRYPOINT ["bun", "index.ts"]
