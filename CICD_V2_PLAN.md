Fais évoluer `.github/workflows/ci-cd.yml` de Red Store vers un pipeline à 7 jobs. Lis d'abord le workflow actuel, CLAUDE.md et les 2 Dockerfiles.

## Phase 1 — Analyse (ne modifie rien)
Résume le workflow actuel et propose le plan détaillé. Attends ma validation.

## Phase 2 — Les 7 jobs
1. `lint-frontend` : Node 22 + cache npm, `npm ci`, `npm run lint`, `npm run build` dans frontend/
2. `check-backend` : `npm ci` + la vérification des modules déjà en place. En parallèle du job 1
3. `sonarqube` (needs 1 et 2) : SonarQube Cloud via l'action officielle SonarSource, secret `SONAR_TOKEN`. Crée `sonar-project.properties` (sources backend/ et frontend/src, exclure node_modules, dist, scripts de seed). Je te donnerai l'organization key et le project key. Si `SONAR_TOKEN` n'existe pas, le job affiche un message et réussit
4. `docker-backend` (needs 3, push uniquement) : build + push avec le tag SHA court SEULEMENT, cache gha scope backend
5. `docker-frontend` (needs 3, push uniquement) : idem avec build-arg VITE_STRIPE_PUBLISHABLE_KEY, cache gha scope frontend. En parallèle du job 4
6. `trivy-scan` (needs 4 et 5) : scanne les 2 images (tag SHA) avec l'action officielle Aqua Security, échoue sur sévérité CRITICAL (ignore-unfixed: true), affiche aussi HIGH sans bloquer. Publie le rapport dans le résumé du job
7. `deploy` (needs 6, push uniquement) : ajoute le tag `latest` aux 2 images avec `docker buildx imagetools create` (sans rebuild), puis appelle les Render Deploy Hooks (message + succès si secrets absents)
8. `snyk` : en parallèle des jobs 1 et 2 (pas de needs). Utilise l'action officielle Snyk pour Node, secret `SNYK_TOKEN`. Scanne les dépendances de backend/ et frontend/ (`snyk test` avec `--severity-threshold=high`). Le job 3 (sonarqube) doit aussi attendre ce job. Si `SNYK_TOKEN` n'existe pas, le job affiche un message et réussit. Sur pull_request, ce job tourne aussi.

Aussi :
- `runs-on: ubuntu-24.04` (version fixe) pour tous les jobs
- versions récentes des actions pour supprimer les warnings Node 20
- sur pull_request : seulement les jobs 1, 2 et 3
- garder concurrency et `permissions: contents: read`
- mettre à jour la section CI/CD et le schéma du pipeline dans README.md

## Règles
- Aucun secret en clair, ne lis jamais les `.env`
- Ne modifie pas le code applicatif sans demander
- Ni commit ni push

## Phase 3 — Vérification
- actionlint via Docker
- lance Trivy en local via Docker sur les 2 images locales et donne-moi le nombre de vulnérabilités CRITICAL et HIGH
- résumé : fichiers modifiés et étapes manuelles restantes