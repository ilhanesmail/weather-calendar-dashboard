# Weather and Calendar Dashboard

A simple dashboard built with Next.js that displays:
- Current weather information using OpenWeather API
- Google Calendar integration showing today's and tomorrow's events
- Dynamic time-based greetings

## Features

- Real-time weather updates including temperature, conditions, and metrics
- Google Calendar integration with event filtering
- Color-coded calendar events based on calendar source
- Dark theme UI with responsive design
- Automatic time-based greetings

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- OpenWeather API
- Google Calendar API

## Setup

1. Clone the repository:
```bash
git clone https://github.com/ilhanesmail/weather-calendar-dashboard.git
cd weather-calendar-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```
NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `NEXT_PUBLIC_WEATHER_API_KEY`: OpenWeather API key
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_REDIRECT_URI`: OAuth redirect URI

## License

MIT
