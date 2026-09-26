const Location = require("../models/Location");

const addLocation = async (req, res) => {
    try {
        const { city, country } = req.body;

        const location = await Location.create({
            user: req.user.id,
            city,
            country
        });

        res.status(201).json({
            message: "Location added successfully",
            location
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLocations = async (req, res) => {
    try {
        const locations = await Location.find({ user: req.user.id });
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addLocation, getLocations };