const Order = require("../model/Order");
const Product = require("../model/Product");
const User = require("../model/User");
const { destroyProductImages } = require("../util/productImages");

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

const PRODUCT_GENDERS = ["men", "women", "kids", "unisex"];
const PRODUCTS_PAGE_SIZE = 10;

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

//forme renvoyee au tableau admin : stock total = somme des stocks par pointure
const toAdminProduct = (product) => ({
    _id: product._id,
    title: product.title,
    brand: product.brand,
    gender: product.gender,
    price: product.price,
    sizes: product.sizes.map(({ size, stock }) => ({ size, stock })),
    totalStock: product.sizes.reduce((sum, s) => sum + (s.stock || 0), 0),
    imageProd: product.imageProd,
});

//liste paginee de tous les produits (tous createurs confondus), filtrable par nom ou marque (?q=)
exports.getAdminProducts = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || PRODUCTS_PAGE_SIZE));
        const q = (req.query.q || "").trim();

        const filter = {};
        if (q) {
            const regex = new RegExp(escapeRegex(q), "i");
            filter.$or = [{ title: regex }, { brand: regex }];
        }

        const [products, total] = await Promise.all([
            Product.find(filter)
                .sort({ createdAt: -1, _id: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Product.countDocuments(filter),
        ]);

        res.status(200).json({
            products: products.map(toAdminProduct),
            total,
            page,
            pages: Math.max(1, Math.ceil(total / limit)),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//mise a jour partielle d'un produit par l'admin : nom, marque, categorie, prix, pointures/stock
exports.updateAdminProduct = async (req, res) => {
    try {
        const { title, brand, gender, price, sizes } = req.body;
        const update = {};

        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({ message: "Title cannot be empty" });
            }
            update.title = title.trim();
        }
        if (brand !== undefined) {
            if (typeof brand !== "string") return res.status(400).json({ message: "Invalid brand" });
            update.brand = brand.trim();
        }
        if (gender !== undefined) {
            if (!PRODUCT_GENDERS.includes(gender)) return res.status(400).json({ message: "Invalid category" });
            update.gender = gender;
        }
        if (price !== undefined) {
            const value = Number(price);
            if (price === "" || !Number.isFinite(value) || value < 0) {
                return res.status(400).json({ message: "Price must be a positive number" });
            }
            update.price = value;
        }
        if (sizes !== undefined) {
            if (!Array.isArray(sizes)) return res.status(400).json({ message: "Sizes must be an array" });
            const cleaned = [];
            for (const entry of sizes) {
                const size = Number(entry?.size);
                const stock = Number(entry?.stock);
                if (!Number.isFinite(size) || size <= 0) {
                    return res.status(400).json({ message: "Each size must be a positive number" });
                }
                if (!Number.isInteger(stock) || stock < 0) {
                    return res.status(400).json({ message: "Stock must be a positive integer" });
                }
                if (cleaned.some((s) => s.size === size)) {
                    return res.status(400).json({ message: `Duplicate size ${size}` });
                }
                cleaned.push({ size, stock });
            }
            update.sizes = cleaned.sort((a, b) => a.size - b.size);
        }

        if (Object.keys(update).length === 0) {
            return res.status(400).json({ message: "Nothing to update" });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: update },
            { returnDocument: "after", runValidators: true }
        );
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ product: toAdminProduct(product) });
    } catch (error) {
        if (error.name === "CastError") return res.status(404).json({ message: "Product not found" });
        res.status(500).json({ message: "Server error" });
    }
};

//suppression d'un produit par l'admin (peu importe son createur), images Cloudinary comprises
exports.deleteAdminProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        await destroyProductImages(product);
        res.status(200).json({ message: "Product deleted", _id: product._id });
    } catch (error) {
        if (error.name === "CastError") return res.status(404).json({ message: "Product not found" });
        res.status(500).json({ message: "Server error" });
    }
};
