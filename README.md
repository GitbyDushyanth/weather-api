# Weather API

A simple REST API built with Node.js and Express that fetches weather data from the Visual Crossing Weather API.

## Features

- Fetches current weather by city
- Redis caching
- 12-hour cache expiration
- Rate limiting
- Environment variables for API keys
- Error handling for invalid cities and API failures

## Tech Stack

- Node.js
- Express.js
- Axios
- Redis
- Visual Crossing Weather API

## Project Structure

```text
weather-api/
├── server.js
├── package.json
├── package-lock.json
├── .env
├── .env.example
├── .gitignore
└── README.md

## How It Works

- **Express** handles incoming requests and API routes.
- **Visual Crossing API** provides the actual weather data.
- **Axios** sends requests from our server to the weather API.
- **Redis** caches weather responses for 12 hours, reducing repeated API calls.
- **Rate Limiter** limits clients to 100 requests every 15 minutes.
- **Environment Variables** keep API keys and Redis credentials out of the source code.
- **Error Handling** returns appropriate responses when the city is missing, invalid, or the weather service fails.
