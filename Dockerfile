
# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Add build arguments
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add metadata labels
LABEL maintainer="WildStore Team <info@wildstore.ru>"
LABEL version="1.0.0"
LABEL description="WildStore E-Commerce Frontend"

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set permissions
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid

# Switch to non-root user
USER appuser

# Create a healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost/index.html || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
