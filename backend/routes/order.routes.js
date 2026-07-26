const express = require("express");
const { createOrder, getOrderByNumber, getMyOrders } = require("../controller/order.controller");
const optionalAuth = require("../middlewares/optionalAuth");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

//creer une commande (invite ou connecte)
router.post("/", optionalAuth, createOrder);
//commandes de l'utilisateur connecte (page profil) - doit precede /:orderNumber
router.get("/mine", isAuth, getMyOrders);
//recuperer une commande via son numero (page de confirmation) - invite autorise, mais si la
//commande appartient a un compte, seul ce compte doit pouvoir la lire (voir getOrderByNumber)
router.get("/:orderNumber", optionalAuth, getOrderByNumber);

module.exports = router;
