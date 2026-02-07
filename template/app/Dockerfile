FROM --platform=$BUILDPLATFORM imbios/bun-node:1.3.8-24.13.0-alpine AS build

ARG TARGETARCH

WORKDIR /build

COPY package.json bun.lock ./
COPY api/package.json ./api/package.json
COPY app/package.json ./app/package.json

RUN bun install --filter app --frozen-lockfile

COPY app/ ./app/

RUN bun -F ./app build

FROM nginx:1.29.5-alpine AS serve

COPY --from=build --chown=nonroot:nonroot /build/app/dist/ /usr/share/nginx/html

EXPOSE 80
