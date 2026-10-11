// Création de l'application Express, sans connexion MongoDB ni listen :
// importable telle quelle par les tests (supertest). Le démarrage est dans server.js.
const express = require("express");
const cors = require("cors");

const app = express();
app.disable("x-powered-by");

// Derrière Nginx (Docker / Render), on fait confiance aux en-têtes X-Forwarded-* pour que
// req.ip soit la vraie IP du client (nécessaire au rate-limit du login).
app.set("trust proxy", Number(process.env.TRUST_PROXY ?? 1));

// Configuration CORS
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "https://stupendous-medovik-046a30.netlify.app",
    ],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// ---- Protection anti NoSQL Injection (compatible Express 5) ----
// Supprime récursivement les clés commençant par "$" ou contenant un "." dans req.body
// et req.params. En Express 5, req.query est en lecture seule, donc on n'y touche pas.
const sanitizeObject = (obj) => {
    if (obj && typeof obj === "object") {
        for (const key of Object.keys(obj)) {
            if (key.startsWith("$") || key.includes(".")) {
                delete obj[key];
            } else {
                sanitizeObject(obj[key]);
            }
        }
    }
};

app.use((req, res, next) => {
    if (req.body) sanitizeObject(req.body);
    if (req.params) sanitizeObject(req.params);
    next();
});
// ---------------------------------------------------------------

// Importation des routes
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/prod.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const cartRoutes = require("./routes/cart.routes");
const adminRoutes = require("./routes/admin.routes");

// Application des routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;