const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
                title: String,
                price: { type: Number, required: true, min: 0 },
                size: Number,
                quantity: { type: Number, required: true, min: 1 },
                image: String,
            },
        ],
        shippingInfo: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            phone: { type: String, required: true },
        },
        payment: {
            method: { type: String, enum: ["card", "paypal", "stripe"], default: "card" },
            status: { type: String, enum: ["paid", "failed"], default: "paid" },
            transactionId: String,
        },
        subtotal: { type: Number, required: true },
        tax: { type: Number, required: true },
        shipping: { type: Number, required: true },
        total: { type: Number, required: true },
        //rattache la commande a l'utilisateur connecte, si present (checkout invite sinon)
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    },
    { timestamps: true }
);

//index utilise par getMyOrders (page profil) qui filtre et trie sur ce champ
orderSchema.index({ createdBy: 1, createdAt: -1 });

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
