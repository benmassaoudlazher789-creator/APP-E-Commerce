const Order = require("../model/Order");
const Product = require("../model/Product");
const User = require("../model/User");

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

//statistiques globales du dashboard admin : commandes, produits, utilisateurs,
//et revenu total (uniquement les commandes dont le paiement a reussi)
exports.getStats = async (req, res) => {
    try {
        const [orderStats, totalProducts, totalUsers] = await Promise.all([
            Order.aggregate([
                {
                    $facet: {
                        totalOrders: [{ $count: "count" }],
                        totalRevenue: [
                            { $match: { "payment.status": "paid" } },
                            { $group: { _id: null, sum: { $sum: "$total" } } },
                        ],
                    },
                },
            ]),
            Product.countDocuments(),
            User.countDocuments(),
        ]);

        const totalOrders = orderStats[0]?.totalOrders[0]?.count || 0;
        const totalRevenue = orderStats[0]?.totalRevenue[0]?.sum || 0;

        res.status(200).json({ totalOrders, totalProducts, totalUsers, totalRevenue });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//20 dernieres commandes, tous clients confondus, pour le tableau du dashboard admin
exports.getRecentOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(20)
            .populate("createdBy", "name email");

        const formatted = orders.map((order) => ({
            _id: order._id,
            orderNumber: order.orderNumber,
            //commande invite (createdBy absent) : on retombe sur le nom saisi a la livraison,
            //mais aucun email n'est capture pour les invites (voir shippingInfo dans Order.js)
            customerName: order.createdBy?.name || order.shippingInfo?.fullName || "Guest",
            customerEmail: order.createdBy?.email || null,
            createdAt: order.createdAt,
            status: order.status,
            total: order.total,
        }));

        res.status(200).json({ orders: formatted });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//met a jour le statut de traitement d'une commande (pending/processing/shipped/delivered/cancelled)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!ORDER_STATUSES.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { status } },
            { returnDocument: "after" }
        );
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
