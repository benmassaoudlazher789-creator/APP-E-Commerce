const crypto = require("crypto");
const Order = require("../model/Order");
const Product = require("../model/Product");
const PaymentIntent = require("../model/PaymentIntent");

// meme regles de calcul que frontend/src/JS/selectors/cart.selectors.js : dupliquees ici
// volontairement car backend/ et frontend/ sont deux projets npm independants (voir CLAUDE.md)
const TAX_RATE = 0.07;
const SHIPPING_COST = 12;
const FREE_SHIPPING_THRESHOLD = 150;

// genere un numero de commande lisible et impossible a deviner (RS- + 64 bits aleatoires) :
// evite a la fois les collisions entre requetes concurrentes et l'enumeration de commandes
// d'autres clients via getOrderByNumber
const generateOrderNumber = () => `RS-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;

//create order
exports.createOrder = async (req, res) => {
    try {
        const { items, shippingInfo, payment } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ msg: "Cart is empty" });
        }

        //recalcule le prix cote serveur a partir des produits reels : le client ne peut pas
        //falsifier subtotal/tax/shipping/total ni le prix d'un article
        const products = await Product.find({ _id: { $in: items.map((i) => i.productId) } });
        const productsById = new Map(products.map((p) => [p.id, p]));

        const orderItems = [];
        for (const item of items) {
            const product = productsById.get(item.productId);
            if (!product) {
                return res.status(400).json({ msg: `Product ${item.productId} not found` });
            }
            const sizeEntry = product.sizes.find((s) => s.size === item.size);
            if (!sizeEntry) {
                return res.status(400).json({ msg: `Size ${item.size} not available for ${product.title}` });
            }
            orderItems.push({
                productId: product._id,
                title: product.title,
                price: product.price,
                size: item.size,
                quantity: item.quantity,
                image: product.imageProd,
            });
        }

        const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const tax = subtotal * TAX_RATE;
        const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
        const total = subtotal + tax + shipping;

        //verifie que le paiement fourni correspond a un PaymentIntent reellement approuve par
        ///api/payment/process, non deja consomme, et pour le bon montant - le statut envoye par
        //le client (req.body.payment.status) n'est jamais fait confiance
        const transactionId = payment?.transactionId;
        if (!transactionId) {
            return res.status(400).json({ msg: "Missing payment confirmation" });
        }
        const intent = await PaymentIntent.findOne({ transactionId });
        if (!intent || intent.status !== "approved") {
            return res.status(400).json({ msg: "Payment could not be verified" });
        }
        if (Math.abs(intent.amount - total) > 0.01) {
            return res.status(400).json({ msg: "Payment amount does not match order total" });
        }

        //decremente le stock de chaque pointure commandee, en parallele, avec verification
        //atomique du stock disponible (evite la survente en cas de commandes concurrentes)
        const decrementResults = await Promise.all(
            orderItems.map((item) =>
                Product.updateOne(
                    { _id: item.productId, sizes: { $elemMatch: { size: item.size, stock: { $gte: item.quantity } } } },
                    { $inc: { "sizes.$[elem].stock": -item.quantity } },
                    { arrayFilters: [{ "elem.size": item.size }] }
                )
            )
        );

        const failedIndex = decrementResults.findIndex((r) => r.matchedCount === 0);
        if (failedIndex !== -1) {
            //rollback des decrements deja effectues avant l'echec
            await Promise.all(
                decrementResults.map((r, i) =>
                    r.matchedCount === 1
                        ? Product.updateOne(
                              { _id: orderItems[i].productId, "sizes.size": orderItems[i].size },
                              { $inc: { "sizes.$.stock": orderItems[i].quantity } }
                          )
                        : Promise.resolve()
                )
            );
            return res.status(409).json({
                msg: `Insufficient stock for ${orderItems[failedIndex].title} (size ${orderItems[failedIndex].size})`,
            });
        }

        intent.status = "consumed";
        await intent.save();

        const newOrder = new Order({
            orderNumber: generateOrderNumber(),
            items: orderItems,
            shippingInfo,
            payment: { method: payment.method, status: "paid", transactionId },
            subtotal,
            tax,
            shipping,
            total,
            createdBy: req.user?._id,
        });
        await newOrder.save();

        res.status(201).json({ msg: "Order placed successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ msg: "Fail to create order", error });
    }
};

//recupere toutes les commandes de l'utilisateur connecte (page profil)
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ createdBy: req.user._id })
            .sort({ createdAt: -1 })
            .limit(100);
        res.status(200).json({ msg: "Orders fetched", orders });
    } catch (error) {
        res.status(500).json({ msg: "Fail to get orders", error });
    }
};

//get order by order number (confirmation page) : accessible sans compte (checkout invite),
//mais si la commande appartient a un compte, seul ce compte peut la consulter - le numero
//aleatoire (voir generateOrderNumber) sert de "capability URL" pour les invites
exports.getOrderByNumber = async (req, res) => {
    try {
        const { orderNumber } = req.params;
        const order = await Order.findOne({ orderNumber });
        if (!order) return res.status(404).json({ msg: "Order not found" });
        if (order.createdBy && String(order.createdBy) !== String(req.user?._id)) {
            return res.status(403).json({ msg: "You are not allowed to view this order" });
        }
        res.status(200).json({ msg: "The order is:", order });
    } catch (error) {
        res.status(500).json({ msg: "Fail to get this order", error });
    }
};
