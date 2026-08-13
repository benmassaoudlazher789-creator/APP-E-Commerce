const express = require("express");
const { getCart, saveCart, clearCart, addToCart, removeFromCart } = require("../controller/cart.controller");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.get("/", isAuth, getCart);
router.post("/add", isAuth, addToCart);
router.delete("/remove/:productId", isAuth, removeFromCart);
router.put("/", isAuth, saveCart);
router.delete("/", isAuth, clearCart);

module.exports = router;
