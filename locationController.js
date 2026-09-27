const Location = require("../models/Location");

const addLocation = async (req, res) => {
  const { city, country } = req.body;

  if (!city || !country) {
    return res.status(400).json({
      message: "City and country are required"
    });
  }

  const location = await Location.create({
    user: req.user.id,
    city: city.trim(),
    country: country.trim()
  });

  res.status(201).json({
    message: "Location added successfully",
    location
  });
};

const getLocations = async (req, res) => {
  const locations = await Location.find({ user: req.user.id }).sort({
    createdAt: -1
  });

  res.json(locations);
};

const updateLocation = async (req, res) => {
  const { city, country } = req.body;

  const location = await Location.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    {
      ...(city ? { city: city.trim() } : {}),
      ...(country ? { country: country.trim() } : {})
    },
    { new: true, runValidators: true }
  );

  if (!location) {
    return res.status(404).json({ message: "Location not found" });
  }

  res.json({
    message: "Location updated successfully",
    location
  });
};

const deleteLocation = async (req, res) => {
  const location = await Location.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });

  if (!location) {
    return res.status(404).json({ message: "Location not found" });
  }

  res.json({ message: "Location deleted successfully" });
};

module.exports = {
  addLocation,
  getLocations,
  updateLocation,
  deleteLocation
};
