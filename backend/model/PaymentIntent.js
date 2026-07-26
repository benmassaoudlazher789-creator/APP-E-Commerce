const mongoose = require("mongoose");

//trace serveur d'un paiement approuve : empeche un client de forger un transactionId
//ou de rejouer le meme paiement pour plusieurs commandes (voir createOrder)
const paymentIntentSchema = new mongoose.Schema(
    {
        transactionId: {
            type: String,
            required: true,
            unique: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        method: {
            type: String,
            enum: ["card", "paypal"],
            required: true,
        },
        status: {
            type: String,
            enum: ["approved", "consumed"],
            default: "approved",
        },
    },
    { timestamps: true }
);

//nettoyage automatique des intents non utilises apres 30 minutes
paymentIntentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1800 });

const PaymentIntent = mongoose.model("paymentIntent", paymentIntentSchema);
module.exports = PaymentIntent;
