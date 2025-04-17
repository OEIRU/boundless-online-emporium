
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Build the React app with production flag
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

# Set ENV variable that can be overridden
ENV API_URL=/api

# Create a healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD [ "wget", "-q", "--spider", "http://localhost/index.html" ]

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
