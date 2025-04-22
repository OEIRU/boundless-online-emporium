
FROM node:18-alpine

# Add build arguments
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set ownership and permissions
RUN chown -R appuser:appgroup /app
USER appuser

# Set environment variables
ENV PORT=3000
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:3000/api/health || exit 1

CMD ["npm", "start"]
