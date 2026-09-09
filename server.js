require("dotenv").config();

const express = require("express");
const axios = require("axios");
const { createClient } = require("redis");

const app = express();
const PORT = process.env.PORT || 3000;

const redis = createClient({
    url: process.env.REDIS_URL
});

redis.on("error", err => console.log("Redis Error:", err));

app.get("/weather", async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({
            error: "City is required"
        });
    }

    try {
        const url =
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city)}` +
            `?unitGroup=metric&key=${process.env.WEATHER_API_KEY}&contentType=json`;

        const response = await axios.get(url);

        res.json({
            city: response.data.address,
            temperature: response.data.currentConditions.temp,
            condition: response.data.currentConditions.conditions,
            humidity: response.data.currentConditions.humidity,
            windSpeed: response.data.currentConditions.windspeed
        });

    } catch (error) {
        console.log(error.response?.data || error.message);

        res.status(500).json({
            error: "Unable to fetch weather data"
        });
    }
});

async function startServer() {
    await redis.connect();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();