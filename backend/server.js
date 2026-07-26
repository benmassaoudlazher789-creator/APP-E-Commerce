
const express = require("express");
require("dotenv").config();
//instance d'express
const app = express();
//middleware pour parser le corps des requêtes en JSON
app.use(express.json());
const path = require("path");

 //connexion BD
const connectDB = require("./config/connectDB");
connectDB();
//routes
app.use("/api/auth", require("./routes/auth.routes"));
//route des products
app.use("/api/product", require("./routes/prod.routes"));
//route des commandes
app.use("/api/order", require("./routes/order.routes"));
//route du paiement
app.use("/api/payment", require("./routes/payment.routes"));
//route du panier serveur
app.use("/api/cart", require("./routes/cart.routes"));



//PORT
const PORT = process.env.PORT;
//serveur
app.listen(PORT , (err) => {
    err
    ? console.error(err)
    : console.log(` the server is running on http://localhost:${PORT}`);
});

