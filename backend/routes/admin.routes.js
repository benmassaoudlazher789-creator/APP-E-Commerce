const express = require("express");
const { getStats, getRecentOrders, updateOrderStatus } = require("../controller/admin.controller");
const isAuth = require("../middlewares/isAuth");
const isRole = require("../middlewares/isRole");

const router = express.Router();

//stats globales du dashboard admin (commandes, produits, users, revenu) - admin only
router.get("/stats", isAuth, isRole("admin"), getStats);
//20 dernieres commandes, tous clients - admin only
router.get("/orders", isAuth, isRole("admin"), getRecentOrders);
//changer le statut de traitement d'une commande - admin only
router.patch("/orders/:id/status", isAuth, isRole("admin"), updateOrderStatus);

module.exports = router;
