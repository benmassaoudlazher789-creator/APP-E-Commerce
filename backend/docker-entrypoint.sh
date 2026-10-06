#!/bin/sh
# Vérifie que les variables d'environnement obligatoires sont définies avant de lancer l'API.
set -e

REQUIRED_VARS="PORT MONGODB_URI SECRET_KEY CLOUD_NAME API_KEY API_SECRET STRIPE_SECRET_KEY"
OPTIONAL_VARS="ANTHROPIC_API_KEY"

missing=""
for var in $REQUIRED_VARS; do
    eval "value=\${$var:-}"
    if [ -z "$value" ]; then
        missing="$missing $var"
    fi
done

if [ -n "$missing" ]; then
    echo "❌ Variables d'environnement obligatoires manquantes :$missing" >&2
    echo "   → Renseigne-les dans backend/.env (Docker Compose) ou dans le dashboard Render." >&2
    exit 1
fi

for var in $OPTIONAL_VARS; do
    eval "value=\${$var:-}"
    if [ -z "$value" ]; then
        echo "⚠️  $var non définie : la fonctionnalité associée sera indisponible." >&2
    fi
done

exec "$@"
