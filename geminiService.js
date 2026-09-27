const { GoogleGenAI } = require("@google/genai");

const generateInsight = async (weather) => {
  const apiKey = process.env.GEMINI_API_KEY;

  const fallback =
    `Weather in ${weather.city}: ${weather.condition}, ` +
    `${weather.temperatureC}°C, humidity ${weather.humidity}%. ` +
    `Carry suitable clothing for the current conditions and check the forecast before outdoor activities.`;

  if (!apiKey) {
    return {
      source: "Fallback",
      summary: fallback,
      recommendations: [
        "Check the latest forecast before going outdoors.",
        "Choose clothing suitable for the current temperature.",
        "Carry an umbrella if rain is expected."
      ]
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are AI WeatherWise, a helpful weather assistant.
Based on the following live weather data, provide:
1. A short natural-language weather summary.
2. Three practical recommendations for clothing or outdoor activity.
Do not invent measurements.

Weather:
City: ${weather.city}
Country: ${weather.country || "Unknown"}
Temperature: ${weather.temperatureC} C
Feels like: ${weather.feelsLikeC} C
Humidity: ${weather.humidity}%
Wind speed: ${weather.windSpeedMs} m/s
Condition: ${weather.condition}
`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
      contents: prompt
    });

    return {
      source: "Google Gemini",
      text: response.text || fallback
    };
  } catch (error) {
    console.warn("Gemini unavailable:", error.message);

    return {
      source: "Fallback",
      text: fallback
    };
  }
};

module.exports = { generateInsight };
