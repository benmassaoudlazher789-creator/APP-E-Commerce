const express = require("express");
const { processPayment } = require("../controller/payment.controller");

const router = express.Router();

//traite un paiement (invite ou connecte, comme la commande)
router.post("/process", processPayment);

module.exports = router;
