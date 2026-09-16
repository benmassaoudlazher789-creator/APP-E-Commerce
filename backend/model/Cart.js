const mongoose = require("mongoose");

// Panier persistant côté serveur pour synchroniser entre appareils une fois connecté
// (Les invités gardent un panier local uniquement, voir localStorage côté frontend)
const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            unique: true, // Un utilisateur n'a qu'un seul panier
        },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
                title: String,
                price: { type: Number, min: 0 },
                image: String,
                brand: String,
                size: Number, // Taille choisie par le client (ex: 42)
                quantity: { type: Number, required: true, min: 1 },
                // 🚨 CORRECTION ICI : On retire le champ "stock" du panier.
                // Le stock doit être géré dans le modèle "Product", pas ici.
                // Si vous voulez vérifier le stock, vous le vérifiez dans la route API "add" avant d'ajouter au panier.
            },
        ],
        totalPrice: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart; 