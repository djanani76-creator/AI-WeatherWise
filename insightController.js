const { getWeather } = require("../services/weatherService");
const { generateInsight } = require("../services/geminiService");

const weatherInsight = async (req, res) => {
  const city = (req.body.city || "").trim();

  if (!city) {
    return res.status(400).json({ message: "city is required" });
  }

  const weather = await getWeather(city);
  const insight = await generateInsight(weather);

  res.json({
    city,
    weather,
    insight
  });
};

module.exports = { weatherInsight };
