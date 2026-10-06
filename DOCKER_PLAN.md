Je veux dockeriser mon projet Red Store (MERN : frontend React 19 + Vite dans `frontend/`, backend Express 5 dans `backend/`, MongoDB Atlas, Cloudinary, Stripe, JWT). Objectif final : déployer plus tard les 2 images sur Render (sans VPS) via GitHub Actions et Docker Hub (`lazher789/redstore-backend` et `lazher789/redstore-frontend`). Pour l'instant on fait UNIQUEMENT la partie Docker en local. Lis CLAUDE.md et README.md avant de commencer.

## Phase 1 — Analyse (ne modifie rien)
Vérifie et résume-moi :
- le port de `backend/server.js` et s'il lit `process.env.PORT`
- le fichier d'entrée du backend et les scripts de `backend/package.json` et `frontend/package.json` (y a-t-il un script `lint` ?)
- la `baseURL` dans `frontend/src/utils/api.js` (elle doit être relative `/api`) et le proxy dans `vite.config.js`
- les NOMS des variables d'environnement utilisées (backend : `process.env.*`, frontend : `import.meta.env.VITE_*`), jamais les valeurs
- si Multer écrit des fichiers en local au lieu de tout envoyer à Cloudinary
- la config CORS du backend
- les scripts de seed dans `backend/scripts/`
- si `npm run build` du frontend passe sans erreur
Propose ensuite un plan et attends ma validation.

## Phase 2 — Fichiers à créer
1. `backend/Dockerfile` : `node:20-alpine`, `WORKDIR /app`, copie de `package*.json` avant le code (cache), `npm ci --omit=dev`, `NODE_ENV=production`, `EXPOSE` du bon port, `USER node`.
2. `backend/docker-entrypoint.sh` : vérifie que les variables obligatoires existent (message clair + `exit 1` sinon), puis `exec "$@"`. Utilisé avec `ENTRYPOINT ["docker-entrypoint.sh"]` + `CMD ["node", "<fichier d'entrée>"]`. Fins de ligne LF.
3. `frontend/Dockerfile` multi-stage : stage `build` (`node:20-alpine`, `npm ci`, `npm run build`, variables `VITE_*` publiques en `ARG`/`ENV`), stage final `nginx:alpine` qui copie `dist/` et le template Nginx dans `/etc/nginx/templates/`.
4. `frontend/default.conf.template` :
   - `listen 80`, `root /usr/share/nginx/html`
   - `location /` avec `try_files $uri $uri/ /index.html` (React Router)
   - `location /api/` : `proxy_pass ${BACKEND_URL};`, `proxy_set_header Host $proxy_host;`, `proxy_ssl_server_name on;`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`, `client_max_body_size 10M`
   - gzip activé, cache long pour `/assets/`, pas de cache pour `index.html`
   - Ce fichier doit fonctionner à la fois en local (`BACKEND_URL=http://backend:<port>`) et sur Render (`BACKEND_URL=https://xxx.onrender.com`).
5. `.dockerignore` dans `backend/` et `frontend/` : node_modules, dist, .env*, .git, logs, *.md.
6. `docker-compose.yml` à la racine (mode Atlas) : `backend` (build, env_file `backend/.env`, pas de port publié, `restart: unless-stopped`) et `frontend` (build avec args `VITE_*` lus depuis un `.env` racine, port `8080:80`, `BACKEND_URL=http://backend:<port>`, `depends_on: backend`). Noms d'images : `lazher789/redstore-backend` et `lazher789/redstore-frontend`.
7. `docker-compose.local.yml` (surcharge pour dev hors ligne) : service `mongo:7` avec volume nommé `mongo-data`, healthcheck `mongosh ping`, pas de port publié ; le backend utilise `MONGO_URI=mongodb://mongo:27017/redstore` et `depends_on` avec `condition: service_healthy`.
8. `.gitattributes` : `*.sh text eol=lf`.
9. `.env.example` (racine, backend, frontend) avec uniquement les noms des variables.
10. Section "Docker" dans README.md : lancer avec Atlas (`docker compose up --build`), en local avec Mongo (`docker compose -f docker-compose.yml -f docker-compose.local.yml up --build`), lancer le seed, voir les logs, arrêter, différence entre `down` et `down -v`.

## Règles
- Ne lis jamais, n'affiche jamais et ne modifie jamais le contenu des fichiers `.env`. Vérifie seulement qu'ils sont dans `.gitignore` et `.dockerignore`.
- Aucun secret dans un Dockerfile ni dans une image. Côté frontend, seulement des clés publiques (Stripe `pk_...`).
- Si du code applicatif doit changer (port, baseURL, CORS, uploads locaux), explique pourquoi et demande avant.
- Ne supprime aucun fichier existant. Ne fais pas de commit.

## Phase 3 — Vérification
Docker Desktop est lancé. Exécute :
1. `docker compose build` et corrige les erreurs
2. `docker compose up -d`, puis `docker compose ps` (tout doit être running)
3. `docker compose logs backend` : connexion MongoDB réussie
4. Teste avec curl : `http://localhost:8080` (HTML), un endpoint `http://localhost:8080/api/...` (JSON), et une route React comme `http://localhost:8080/cart` (doit renvoyer index.html, pas 404)
5. `docker images` : donne la taille des 2 images
6. `docker compose down`
Termine par un résumé : fichiers créés, commandes à retenir, points à vérifier manuellement dans le navigateur (connexion, upload d'image admin, paiement Stripe test).