const express = require("express");
const {
  addLocation,
  getLocations,
  updateLocation,
  deleteLocation
} = require("../controllers/locationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", addLocation);
router.get("/", getLocations);
router.put("/:id", updateLocation);
router.delete("/:id", deleteLocation);

module.exports = router;
