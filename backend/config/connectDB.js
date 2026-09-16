// backend/config/connectDB.js
const dns = require("dns");
const mongoose = require("mongoose");

// Sur certaines machines Windows, le service "Internet Connection Sharing" (ICS)
// installe un proxy DNS local sur 127.0.0.1 que Node utilise par défaut, mais qui
// ne répond pas correctement aux requêtes SRV (nécessaires pour mongodb+srv://).
// On force donc des résolveurs publics fiables pour éviter ce proxy cassé.
if (dns.getServers().every((server) => server === "127.0.0.1" || server === "::1")) {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const RETRY_DELAYS_MS = [5000, 10000, 20000];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Distingue les erreurs DNS/réseau des erreurs d'authentification pour faciliter le diagnostic
const describeError = (error) => {
    const dnsErrorCodes = ["ENOTFOUND", "ECONNREFUSED", "EAI_AGAIN"];
    const isDnsError =
        dnsErrorCodes.includes(error.code) ||
        /querySrv|ENOTFOUND|ECONNREFUSED|EAI_AGAIN/i.test(error.message);
    const isAuthError =
        error.name === "MongoServerError" &&
        (error.code === 18 || /auth|authentication|bad auth/i.test(error.message));

    if (isDnsError) {
        return "Erreur DNS/réseau : impossible de résoudre ou de joindre le cluster MongoDB Atlas (vérifier la connexion réseau/DNS, ou envisager le format mongodb:// sans SRV, voir backend/.env.example)";
    }
    if (isAuthError) {
        return "Erreur d'authentification : identifiants MongoDB invalides (vérifier le nom d'utilisateur/mot de passe dans MONGODB_URI)";
    }
    return "Erreur de connexion MongoDB non catégorisée";
};

const connectDB = async () => {
    for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
        try {
            const conn = await mongoose.connect(process.env.MONGODB_URI, {});
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
            return;
        } catch (error) {
            console.error(`❌ MongoDB Connection Error: ${error.message}`);
            console.error(`   → ${describeError(error)}`);

            const isLastAttempt = attempt === RETRY_DELAYS_MS.length;
            if (isLastAttempt) {
                console.error(
                    `❌ Échec de connexion à MongoDB après ${RETRY_DELAYS_MS.length + 1} tentatives. Abandon.`
                );
                process.exit(1);
            }

            const delay = RETRY_DELAYS_MS[attempt];
            console.warn(`⏳ Nouvelle tentative dans ${delay / 1000}s...`);
            await wait(delay);
        }
    }
};

module.exports = connectDB;