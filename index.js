const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const locationRoutes = require("./routes/locationRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const insightRoutes = require("./routes/insightRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const sanitize = require("./middleware/sanitizeMiddleware");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(sanitize);

app.get("/", (req, res) => {
  res.json({
    message: "AI WeatherWise Backend is Running!",
    status: "ok"
  });
});

app.get("/test", (req, res) => {
  res.json({ message: "API working successfully" });
});

app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/insights", insightRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
