# AI WeatherWise

A Node.js + Express + MongoDB backend that provides:

- JWT authentication
- bcrypt password hashing
- Favorite location CRUD
- Current weather API
- Gemini AI weather insights
- Fallback weather provider
- Centralized error handling
- Basic request sanitization

## Setup

1. Copy `.env.example` to `.env`.
2. Add your MongoDB connection string and JWT secret.
3. Add Gemini API key if available.
4. Open a terminal in this folder and run:

```bash
npm install
npm start
```

Server:
`http://localhost:5000`

## Main APIs

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Locations (JWT required)
- `POST /api/locations`
- `GET /api/locations`
- `PUT /api/locations/:id`
- `DELETE /api/locations/:id`

### Weather
- `GET /api/weather?city=Chennai`

### AI Insights (JWT required)
- `POST /api/insights`

Example body:

```json
{
  "city": "Chennai"
}
```

Use this header for protected endpoints:

`Authorization: Bearer YOUR_LOGIN_TOKEN`
