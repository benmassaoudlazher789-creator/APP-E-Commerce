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

EXPOSE 1980

USER node

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
