const express = require("express");
const { addLocation, getLocations } = require("../controllers/locationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addLocation);
router.get("/", authMiddleware, getLocations);

module.exports = router;