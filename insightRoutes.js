const express = require("express");
const { weatherInsight } = require("../controllers/insightController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, weatherInsight);

module.exports = router;
