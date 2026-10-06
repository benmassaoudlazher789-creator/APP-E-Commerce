# ---------- Stage 1 : build Vite ----------
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Variables PUBLIQUES uniquement : elles sont intégrées en clair dans le bundle JS.
# VITE_API_URL vide = appels relatifs /api/..., proxifiés par Nginx vers le backend.
ARG VITE_API_URL=""
ARG VITE_STRIPE_PUBLISHABLE_KEY=""
ENV VITE_API_URL=$VITE_API_URL \
    VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

# Garde-fou : refuse une clé Stripe secrète (sk_/rk_) dans le bundle public
RUN case "$VITE_STRIPE_PUBLISHABLE_KEY" in \
      ""|pk_*) ;; \
      *) echo "VITE_STRIPE_PUBLISHABLE_KEY doit être une clé publique pk_..." >&2; exit 1 ;; \
    esac

RUN npm run build

# ---------- Stage 2 : Nginx ----------
FROM nginx:alpine

# Fait exposer par l'entrypoint Nginx les DNS du conteneur dans NGINX_LOCAL_RESOLVERS
# (utilisé par la directive resolver du template)
ENV NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1

# Le template est rendu au démarrage (envsubst) dans /etc/nginx/conf.d/default.conf
COPY default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
