# ======================
# Stage 1: Build
# ======================
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package.json package-lock.json ./

# Installation des dépendances
RUN npm ci

# Copie du code source
COPY . .

# Build de l'application
RUN npm run build

# ======================
# Stage 2: Production
# ======================
FROM nginx:alpine AS production

# Copie de la config Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers buildés depuis le stage précédent
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose le port 80
EXPOSE 80

# Pas de healthcheck - le reverse proxy externe gère la disponibilité

# Lancement de Nginx
CMD ["nginx", "-g", "daemon off;"]

