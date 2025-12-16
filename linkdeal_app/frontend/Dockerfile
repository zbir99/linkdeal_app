# ======================
# Stage 1: Build
# ======================
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments for environment variables
ARG VITE_API_URL
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_CLIENT_SECRET
ARG VITE_AUTH0_AUDIENCE

# Set environment variables for the build
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_AUTH0_DOMAIN=${VITE_AUTH0_DOMAIN}
ENV VITE_AUTH0_CLIENT_ID=${VITE_AUTH0_CLIENT_ID}
ENV VITE_AUTH0_CLIENT_SECRET=${VITE_AUTH0_CLIENT_SECRET}
ENV VITE_AUTH0_AUDIENCE=${VITE_AUTH0_AUDIENCE}

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ======================
# Stage 2: Production
# ======================
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
