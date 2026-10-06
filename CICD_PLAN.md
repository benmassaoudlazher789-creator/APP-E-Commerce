Étape suivante de la dockerisation de Red Store : créer le pipeline CI/CD GitHub Actions. Le setup Docker local fonctionne déjà (lis CLAUDE.md, README.md, docker-compose.yml et les 2 Dockerfiles).

## Phase 1 — Analyse (ne modifie rien)
Vérifie et résume :
- le nom de la branche principale et l'URL du remote GitHub
- les scripts disponibles (lint, build, test) dans backend/ et frontend/
- si `npm run lint` du frontend passe sans erreur
- si le backend a des tests ; sinon propose une vérification minimale (ex : `node --check` sur les fichiers, ou démarrage du serveur)
Puis propose un plan et attends ma validation.

## Phase 2 — Créer `.github/workflows/ci-cd.yml`
Déclencheurs : push et pull_request sur la branche principale.

Job `ci` (ubuntu-latest, Node 22 avec cache npm) :
- backend : `npm ci` + vérification proposée en phase 1
- frontend : `npm ci`, `npm run lint`, `npm run build`

Job `docker` (needs: ci, uniquement sur push, pas sur pull_request) :
- docker/setup-buildx-action, docker/login-action avec secrets DOCKERHUB_USERNAME et DOCKERHUB_TOKEN
- docker/build-push-action pour backend et frontend
- images : `lazher789/redstore-backend` et `lazher789/redstore-frontend`
- tags : `latest` et le SHA court du commit
- frontend : build-arg VITE_STRIPE_PUBLISHABLE_KEY depuis les secrets, VITE_API_URL vide
- cache Buildx GitHub Actions (`type=gha`) avec un scope différent par image

Job `deploy` (needs: docker, uniquement sur push) :
- appelle les Render Deploy Hooks avec curl depuis les secrets RENDER_DEPLOY_HOOK_BACKEND et RENDER_DEPLOY_HOOK_FRONTEND
- si ces secrets n'existent pas encore, le job affiche un message et se termine en succès (pas en échec)

Ajoute aussi :
- `concurrency` pour annuler un run en cours si un nouveau push arrive
- `permissions: contents: read`
- un badge CI/CD en haut du README.md et une section "CI/CD" qui explique les 3 jobs et liste les secrets GitHub nécessaires (noms seulement)

## Règles
- Aucun secret en clair dans le workflow, uniquement `${{ secrets.* }}`
- Ne lis jamais les fichiers `.env`
- Ne modifie pas le code applicatif sans me demander
- Ne fais ni commit ni push

## Phase 3 — Vérification
- Valide la syntaxe du workflow avec actionlint via Docker : `docker run --rm -v "${PWD}:/repo" -w /repo rhysd/actionlint:latest`
- Lance localement les mêmes commandes que le job `ci` pour confirmer qu'elles passent
- Termine par un résumé : fichiers créés/modifiés, et la liste exacte des étapes manuelles qui me restent (commit, push, où regarder dans l'onglet Actions)