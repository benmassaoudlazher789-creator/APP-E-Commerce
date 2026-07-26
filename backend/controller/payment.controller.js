const crypto = require("crypto");
const PaymentIntent = require("../model/PaymentIntent");

// Aucune cle Stripe n'est configuree (STRIPE_SECRET_KEY absente de .env) : ce controller simule
// une passerelle de paiement cote serveur (au lieu du client, pour que le resultat ne puisse pas
// etre falsifie par le navigateur). Il garde la meme carte de test "toujours refusee" que
// l'ancien mock cote frontend, pour pouvoir tester le flux d'echec.
// Un PaymentIntent est enregistre a l'approbation : createOrder le verifie plus tard pour
// s'assurer qu'une commande "paid" correspond bien a un paiement reellement traite ici,
// et qu'il n'est pas rejoue pour plusieurs commandes.
const DECLINED_TEST_CARD = "4000000000000002";

exports.processPayment = async (req, res) => {
    try {
        const { method, amount, cardNumber, expiry, cvv } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ msg: "Invalid payment amount" });
        }

        if (!["card", "paypal"].includes(method)) {
            return res.status(400).json({ msg: "Invalid payment method" });
        }

        if (method === "card") {
            const digitsOnly = (cardNumber || "").replace(/\s/g, "");
            if (!/^\d{13,19}$/.test(digitsOnly) || !expiry || !cvv) {
                return res.status(400).json({ msg: "Invalid card details" });
            }
            if (digitsOnly === DECLINED_TEST_CARD) {
                return res.status(402).json({
                    msg: "Payment declined. Please check your card details or try another card.",
                });
            }
        }

        // simule la latence d'une vraie passerelle de paiement
        await new Promise((resolve) => setTimeout(resolve, 600));

        const transactionId = `MOCK-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
        await PaymentIntent.create({ transactionId, amount, method, status: "approved" });

        res.status(200).json({ msg: "Payment approved", transactionId });
    } catch (error) {
        res.status(500).json({ msg: "Fail to process payment", error });
    }
};
