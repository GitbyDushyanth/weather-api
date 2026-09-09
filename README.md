# Weather API

A simple weather API built with Node.js and Express.

## Features

- Fetches weather using Visual Crossing API
- Redis caching
- 12-hour cache expiration
- Rate limiting
- Environment variables
- Error handling

## Tech Stack

- Node.js
- Express.js
- Axios
- Redis
- Visual Crossing Weather API

## Setup

```bash
npm install

```text
weather-api/
├── server.js
├── package.json
├── .env
├── .env.example
├── .gitignore
└── README.md

Installation

Clone the repository and install dependencies:

npm install
Environment Variables

Create a .env file in the project root:

WEATHER_API_KEY=your_visual_crossing_api_key
REDIS_URL=your_redis_url
PORT=3000

Never commit your .env file to GitHub.

Run the Server
node server.js

The server will run on:

http://localhost:3000
API Endpoint
Get Weather
GET /weather?city=Hyderabad

Example:

http://localhost:3000/weather?city=Hyderabad

Example response:

{
  "city": "Hyderabad",
  "temperature": 28,
  "condition": "Partially cloudy",
  "humidity": 70,
  "windSpeed": 12
}
Caching

Weather responses are cached in Redis for 12 hours.

This reduces unnecessary requests to the third-party weather API.

Rate Limiting

The API allows a maximum of 100 requests per 15 minutes per client.

Error Responses
Missing City
{
  "error": "City is required"
}
Invalid City
{
  "error": "Invalid city"
}
Weather Service Failure
{
  "error": "Weather service unavailable"
}
Author

Dushyanth


Then save it and run:

```bash
git add README.md
git commit -m "docs: add README"
git push