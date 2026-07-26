const Cart = require("../model/Cart");
const Product = require("../model/Product");

//recupere le panier de l'utilisateur connecte (tableau vide si aucun panier encore sauvegarde)
//le stock de chaque article est rafraichi depuis le produit reel, pour ne pas afficher une
//disponibilite perimee (l'article a pu etre vendu ailleurs depuis son ajout au panier)
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        const items = cart?.items || [];

        if (items.length > 0) {
            const products = await Product.find({ _id: { $in: items.map((i) => i.productId) } });
            const productsById = new Map(products.map((p) => [p.id, p]));
            for (const item of items) {
                const product = productsById.get(String(item.productId));
                const sizeEntry = product?.sizes.find((s) => s.size === item.size);
                item.stock = sizeEntry ? sizeEntry.stock : 0;
            }
        }

        res.status(200).json({ msg: "Cart:", items });
    } catch (error) {
        res.status(500).json({ msg: "Fail to get cart", error });
    }
};

//remplace entierement le panier de l'utilisateur connecte (upsert)
exports.saveCart = async (req, res) => {
    try {
        const { items } = req.body;
        if (!Array.isArray(items)) {
            return res.status(400).json({ msg: "items must be an array" });
        }
        const invalidItem = items.find(
            (item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity < 1
        );
        if (invalidItem) {
            return res.status(400).json({ msg: "Each item needs a productId and a quantity >= 1" });
        }
        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { items },
            { returnDocument: 'after', upsert: true }
        );
        res.status(200).json({ msg: "Cart saved", items: cart.items });
    } catch (error) {
        res.status(500).json({ msg: "Fail to save cart", error });
    }
};

//vide le panier de l'utilisateur connecte
exports.clearCart = async (req, res) => {
    try {
        await Cart.findOneAndUpdate(
            { user: req.user._id },
            { items: [] },
            { upsert: true }
        );
        res.status(200).json({ msg: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ msg: "Fail to clear cart", error });
    }
};
