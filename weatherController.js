const { getWeather } = require("../services/weatherService");

const currentWeather = async (req, res) => {
  const city = (req.query.city || "").trim();

  if (!city) {
    return res.status(400).json({ message: "city query parameter is required" });
  }

  const weather = await getWeather(city);

  res.json({
    message: "Current weather fetched successfully",
    weather
  });
};

module.exports = { currentWeather };
