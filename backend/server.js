const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Derrière Nginx (Docker / Render), on fait confiance aux en-têtes X-Forwarded-* pour que
// req.ip soit la vraie IP du client (nécessaire au rate-limit du login).
// TRUST_PROXY = nombre de proxys devant l'app (1 par défaut : Nginx ; 2 si Render ajoute le sien).
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

// Connexion à la base de données
const connectDB = require("./config/connectDB");
connectDB();

// Importation des routes
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/prod.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const cartRoutes = require("./routes/cart.routes");
const adminRoutes = require("./routes/admin.routes");

// Application des routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT;

app.listen(PORT, (err) => {
    err
        ? console.error(err)
        : console.log(`The server is running on http://localhost:${PORT}`);
});