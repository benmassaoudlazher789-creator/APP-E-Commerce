// Point d'entrée : variables d'environnement, connexion MongoDB puis écoute du port.
// dotenv doit être chargé AVANT app.js (util/cloudinary.js lit la config à l'import).
require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

// Connexion à la base de données
const connectDB = require("./config/connectDB");
connectDB();

// --- Middleware anti cold-start -----------------------------------------
// Sur le plan gratuit Render, l'instance s'endort après ~15 min d'inactivité.
// Si le frontend envoie plusieurs requêtes en parallèle au réveil, la première
// déclenche la connexion Mongo mais les suivantes arrivent avant qu'elle soit
// prête -> erreurs 500 en cascade. Ce middleware renvoie un 503 propre tant
// que Mongo n'est pas connecté, ce qui permet au frontend de retenter.
app.use((req, res, next) => {
    // mongoose.connection.readyState : 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            msg: "Backend warming up, please retry in a few seconds",
            dbState: mongoose.connection.readyState,
        });
    }
    next();
});

// --- Écoute du port ------------------------------------------------------
// Fallback sur 10000 (port par défaut de Render) si PORT n'est pas défini en local
const PORT = process.env.PORT || 10000;

const server = app.listen(PORT, (err) => {
    err
        ? console.error("❌ Erreur au démarrage:", err)
        : console.log(`✅ The server is running on http://localhost:${PORT}`);
});

// --- Arrêt propre (Render envoie SIGTERM lors des déploiements/redémarrages)
process.on("SIGTERM", () => {
    console.log("⚠️ SIGTERM reçu, fermeture du serveur...");
    server.close(() => {
        mongoose.connection.close(false, () => {
            console.log("✅ Serveur et connexion Mongo fermés proprement");
            process.exit(0);
        });
    });
});

// --- Capture des erreurs non gérées (évite les crashs silencieux) --------
process.on("unhandledRejection", (reason) => {
    console.error("❌ Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught Exception:", error.message, error.stack);
    // On ne quitte pas : Render redémarrerait l'instance et on perdrait le contexte
});