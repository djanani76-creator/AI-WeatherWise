const https = require("https");

const requestJson = (url) =>
  new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const parsed = JSON.parse(data);

            if (response.statusCode >= 400) {
              return reject(
                new Error(parsed.message || "Weather service request failed")
              );
            }

            resolve(parsed);
          } catch (error) {
            reject(new Error("Invalid weather service response"));
          }
        });
      })
      .on("error", reject);
  });

const getOpenWeather = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) return null;

  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}` +
    `&appid=${encodeURIComponent(apiKey)}&units=metric`;

  const data = await requestJson(url);

  return {
    source: "OpenWeatherMap",
    city: data.name,
    country: data.sys?.country,
    temperatureC: data.main?.temp,
    feelsLikeC: data.main?.feels_like,
    humidity: data.main?.humidity,
    windSpeedMs: data.wind?.speed,
    condition: data.weather?.[0]?.description || "Unknown",
    observedAt: new Date().toISOString()
  };
};

const getOpenMeteo = async (city) => {
  const geoUrl =
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}` +
    `&count=1&language=en&format=json`;

  const geo = await requestJson(geoUrl);

  if (!geo.results || geo.results.length === 0) {
    throw new Error("City not found");
  }

  const place = geo.results[0];

  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}` +
    `&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code`;

  const data = await requestJson(weatherUrl);

  const code = data.current?.weather_code;

  const conditions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Rain showers",
    82: "Heavy rain showers",
    95: "Thunderstorm"
  };

  return {
    source: "Open-Meteo fallback",
    city: place.name,
    country: place.country,
    temperatureC: data.current?.temperature_2m,
    feelsLikeC: data.current?.apparent_temperature,
    humidity: data.current?.relative_humidity_2m,
    windSpeedMs: data.current?.wind_speed_10m,
    condition: conditions[code] || "Unknown",
    observedAt: data.current?.time || new Date().toISOString()
  };
};

const getWeather = async (city) => {
  try {
    const openWeather = await getOpenWeather(city);
    if (openWeather) return openWeather;
  } catch (error) {
    console.warn("OpenWeatherMap unavailable:", error.message);
  }

  return getOpenMeteo(city);
};

module.exports = { getWeather };
