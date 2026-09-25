const express = require("express");
const {
    getStats,
    getRecentOrders,
    updateOrderStatus,
    getAdminProducts,
    updateAdminProduct,
    deleteAdminProduct,
} = require("../controller/admin.controller");
const isAuth = require("../middlewares/isAuth");
const isRole = require("../middlewares/isRole");

const router = express.Router();

//stats globales du dashboard admin (commandes, produits, users, revenu) - admin only
router.get("/stats", isAuth, isRole("admin"), getStats);
//20 dernieres commandes, tous clients - admin only
router.get("/orders", isAuth, isRole("admin"), getRecentOrders);
//changer le statut de traitement d'une commande - admin only
router.patch("/orders/:id/status", isAuth, isRole("admin"), updateOrderStatus);
//liste paginee de tous les produits (?page=&limit=&q=) - admin only
router.get("/products", isAuth, isRole("admin"), getAdminProducts);
//modifier prix / stock / pointures d'un produit - admin only
router.patch("/products/:id", isAuth, isRole("admin"), updateAdminProduct);
//supprimer un produit - admin only
router.delete("/products/:id", isAuth, isRole("admin"), deleteAdminProduct);

module.exports = router;
