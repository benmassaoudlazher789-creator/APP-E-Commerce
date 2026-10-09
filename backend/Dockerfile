FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production \
    PORT=1980

# Dépendances d'abord : cette couche reste en cache tant que package*.json ne change pas
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Code de l'application (.env exclu par .dockerignore : aucun secret dans l'image)
COPY . .

# Remplace l'entrypoint de l'image node : vérifie les variables obligatoires puis lance CMD
COPY --chmod=755 docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Version exposée par GET /api/health (SHA court du commit, injecté par le CI)
ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION

EXPOSE 1980

USER node

# Santé du conteneur via node (curl absent d'Alpine) ; le port est lu dans $PORT au runtime
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:' + process.env.PORT + '/api/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
