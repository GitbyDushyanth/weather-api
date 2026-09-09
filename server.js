require("dotenv").config();

const express = require("express");
const axios = require("axios");
const { createClient } = require("redis");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

const redis = createClient({
    url: process.env.REDIS_URL
});

redis.on("error", err => console.log("Redis Error:", err));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: "Too many requests, please try again later."
    }
});

app.use(limiter)

app.get("/weather", async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: "City is required" });
    }

    try {
        const cacheKey = `weather:${city.toLowerCase()}`;

        // Check Redis
        const cached = await redis.get(cacheKey);

        if (cached) {
            console.log("Returning cached data");
            return res.json(JSON.parse(cached));
        }

        // Fetch from Visual Crossing
        const url =
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city)}` +
            `?unitGroup=metric&key=${process.env.WEATHER_API_KEY}&contentType=json`;

        const response = await axios.get(url);

        const weather = {
            city: response.data.address,
            temperature: response.data.currentConditions.temp,
            condition: response.data.currentConditions.conditions,
            humidity: response.data.currentConditions.humidity,
            windSpeed: response.data.currentConditions.windspeed
        };

        // Store in Redis for 12 hours
        await redis.set(cacheKey, JSON.stringify(weather), {
            EX: 60 * 60 * 12
        });

        console.log("Fetched from API and cached");

        res.json(weather);

    } catch (error) {
        if (error.response?.status === 400) {
            return res.status(400).json({
                error: "Invalid city"
            });
        }

        console.log(error.response?.data || error.message);

        res.status(500).json({
            error: "Weather service unavailable"
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