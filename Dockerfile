FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for better caching
COPY package*.json ./

# Install dependencies with specific cache settings
RUN npm ci --no-audit --no-fund

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

# Create app directory and use non-root user for security
RUN mkdir -p /app && \
    addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only with clean cache for smaller image
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Copy built application from the builder stage
COPY --from=builder /app/dist ./dist

# Switch to non-root user for better security
USER appuser

# Expose API port
EXPOSE 4200

# Set environment variables
ENV NODE_ENV=production
ENV DB_HOST=postgres
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV DB_NAME=student_management

# Add health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --quiet --spider http://localhost:4200/health || exit 1

# Start the application with proper signal handling
CMD ["node", "dist/server.js"]
