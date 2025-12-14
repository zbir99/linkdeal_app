# ======================
# Stage 1: Build
# ======================
FROM node:20-alpine AS builder

WORKDIR /app

<<<<<<< HEAD
# Build arguments for environment variables
ARG VITE_API_URL
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID

# Set environment variables for the build
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_AUTH0_DOMAIN=${VITE_AUTH0_DOMAIN}
ENV VITE_AUTH0_CLIENT_ID=${VITE_AUTH0_CLIENT_ID}

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
=======
# Copie des fichiers de dépendances
COPY package.json package-lock.json ./

# Installation des dépendances
RUN npm ci

# Copie du code source
COPY . .

# Build de l'application
>>>>>>> de4e691e5d0f1d98f54b2aa5297cb850826e7810
RUN npm run build

# ======================
# Stage 2: Production
# ======================
FROM nginx:alpine AS production

<<<<<<< HEAD
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
=======
# Copie de la config Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers buildés depuis le stage précédent
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose le port 80
EXPOSE 80

# Pas de healthcheck - le reverse proxy externe gère la disponibilité

# Lancement de Nginx
CMD ["nginx", "-g", "daemon off;"]

>>>>>>> de4e691e5d0f1d98f54b2aa5297cb850826e7810
