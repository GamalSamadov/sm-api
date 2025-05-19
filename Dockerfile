FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for better caching
COPY package*.json ./

# Install dependencies with npm install since we don't have package-lock.json
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Second stage - production image
FROM node:18-alpine

# Add metadata labels
LABEL maintainer="Gamal Samadov"
LABEL description="Student Management System API"
LABEL version="1.0.0"

# Create necessary directories and install required packages
RUN apk add --no-cache wget && \
    mkdir -p /app /etc/ssl/certs && \
    addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app /etc/ssl/certs

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies and clean cache
RUN npm install --only=production && \
    npm cache clean --force

# Copy built application from the builder stage
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production \
    PORT=8080

# Switch to non-root user for better security
USER appuser

# Expose API port
EXPOSE ${PORT}

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

# Start the application
CMD ["node", "dist/server.js"]
