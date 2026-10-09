const express = require("express");
const { getHealth } = require("../controller/health.controller");

const router = express.Router();

// publique, sans authentification ni rate-limit
router.get("/", getHealth);

module.exports = router;
