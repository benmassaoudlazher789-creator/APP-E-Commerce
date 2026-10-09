const mongoose = require("mongoose");

// etat de sante de l'API, utilise par le HEALTHCHECK Docker et le smoke test du CI/CD.
// Ne renvoie que des informations non sensibles : aucun host, URI, ni variable d'env autre que la version.
exports.getHealth = (req, res) => {
    const dbUp = mongoose.connection.readyState === 1;

    // jamais mis en cache : chaque appel doit refleter l'etat reel
    res.set("Cache-Control", "no-store");
    res.status(dbUp ? 200 : 503).json({
        status: dbUp ? "ok" : "error",
        db: dbUp ? "up" : "down",
        version: process.env.APP_VERSION || "dev",
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
    });
};
