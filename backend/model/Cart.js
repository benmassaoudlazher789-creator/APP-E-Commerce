const mongoose = require("mongoose");

//panier persiste cote serveur, pour synchroniser entre appareils une fois connecte
//(les invites gardent un panier local uniquement, voir localStorage cote frontend)
const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            unique: true,
        },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
                title: String,
                price: { type: Number, min: 0 },
                image: String,
                brand: String,
                size: Number,
                quantity: { type: Number, required: true, min: 1 },
                stock: Number,
            },
        ],
    },
    { timestamps: true }
);

const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;
