// Variables d'environnement de test, chargées avant tout module de l'app (jest "setupFiles").
// Valeurs FACTICES uniquement : le .env n'est jamais lu pendant les tests (dotenv est dans server.js).
process.env.NODE_ENV = "test";
process.env.SECRET_KEY = "test-secret-key-not-a-real-secret";
process.env.CLOUD_NAME = "test-cloud";
process.env.API_KEY = "test-api-key";
process.env.API_SECRET = "test-api-secret";
process.env.STRIPE_SECRET_KEY = "sk_test_fake_key_for_tests";
process.env.ANTHROPIC_API_KEY = "test-anthropic-key";
// aucune base distante : la connexion se fait sur mongodb-memory-server (voir db.js)
delete process.env.MONGODB_URI;
delete process.env.APP_VERSION;
