FROM --platform=$BUILDPLATFORM oven/bun:1.3.9-slim AS build

ARG TARGETARCH

WORKDIR /build

COPY package.json bun.lock ./
COPY api/package.json ./api/package.json
COPY app/package.json ./app/package.json

RUN bun install --filter api --frozen-lockfile

COPY api/ ./api/

RUN bun -F ./api build --target bun-linux-$TARGETARCH-modern

FROM gcr.io/distroless/base-debian13:nonroot AS runner

COPY --from=build --chown=nonroot:nonroot /build/api/dist/api /usr/local/bin/api

EXPOSE 4000

USER nonroot

ENTRYPOINT ["/usr/local/bin/api"]
