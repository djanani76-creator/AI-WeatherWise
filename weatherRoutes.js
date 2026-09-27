const express = require("express");
const { currentWeather } = require("../controllers/weatherController");

const router = express.Router();

router.get("/", currentWeather);

module.exports = router;
