# Multi-stage build for production optimization

# Stage 1: Build React app
FROM node:18-alpine AS client-build

WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy client source code
COPY client/ ./

# Build React app
RUN npm run build

# Stage 2: Setup server
FROM node:18-alpine AS server-setup

WORKDIR /app/server

# Copy server package files
COPY server/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Stage 3: Production image
FROM node:18-alpine AS production

# Create app directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S ecommerce -u 1001

# Copy server files
COPY --from=server-setup /app/server ./server
COPY --from=server-setup /app/server/node_modules ./server/node_modules

# Copy built React app
COPY --from=client-build /app/client/build ./client/build

# Copy server source
COPY server/ ./server/

# Create logs directory
RUN mkdir -p logs && chown -R ecommerce:nodejs logs

# Change ownership of app directory
RUN chown -R ecommerce:nodejs /app

# Switch to non-root user
USER ecommerce

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/products', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the application
CMD ["node", "server/server.js"]
