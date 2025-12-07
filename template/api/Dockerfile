# --- Stage 1: Dependency Installation & Caching (The Build Stage) ---

ARG TARGETARCH

# Use a bun-alpine image for a fast build environment
FROM oven/bun:1.3.4-slim AS build

# Set the working directory inside the container
WORKDIR /build

# 1. Copy necessary files for the cache layer
# IMPORTANT: The path to the root lock file is relative to the Docker build context.
# If you run 'docker build -f api/Dockerfile .', the context is the root (.).
# If you run 'docker build api', the context is api (and this approach fails).
# ASSUMPTION: You are running the build command from the root level.

# Copy workspace root files (This ensures the locked install)
COPY package.json bun.lock ./

# Copy service package.json files
COPY api/package.json ./api/package.json
COPY app/package.json ./app/package.json

# 2. Perform a frozen install
RUN bun install --filter api --frozen-lockfile

# Copy API source code
COPY api/ ./api/

# 3. Build the API
RUN bun --cwd api build --target bun-linux-$TARGETARCH-modern

# --- Stage 2: Final Image (The Runtime Stage) ---

# Use a minimal image for production (less attack surface, smaller size)
FROM debian:trixie-slim

# Copy the compiled binary from builder stage
COPY --from=build /build/api/dist/api /usr/local/bin/

# Expose port
EXPOSE 4000

# Run the binary
ENTRYPOINT ["/usr/local/bin/api"]
