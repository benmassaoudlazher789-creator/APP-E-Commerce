// Point d'entrée : variables d'environnement, connexion MongoDB puis écoute du port.
// dotenv doit être chargé AVANT app.js (util/cloudinary.js lit la config à l'import).
require("dotenv").config();

const app = require("./app");

// Connexion à la base de données
const connectDB = require("./config/connectDB");
connectDB();

const PORT = process.env.PORT;

app.listen(PORT, (err) => {
    err
        ? console.error(err)
        : console.log(`The server is running on http://localhost:${PORT}`);
});
