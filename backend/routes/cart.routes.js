const express = require("express");
const { getCart, saveCart, clearCart } = require("../controller/cart.controller");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

//panier serveur reserve aux utilisateurs connectes (les invites restent en localStorage)
router.get("/", isAuth, getCart);
router.put("/", isAuth, saveCart);
router.delete("/", isAuth, clearCart);

module.exports = router;
