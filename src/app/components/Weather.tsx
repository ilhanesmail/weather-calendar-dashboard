"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  WiDaySunny, WiRain, WiCloudy, WiSnow, 
  WiHumidity, WiStrongWind, WiThermometer,
  WiDayFog, WiThunderstorm
} from 'react-icons/wi';

interface WeatherData {
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const lat = '45.5017';
        const lon = '-73.5673';
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
        );

        setWeather({
          temperature: Math.round(response.data.main.temp),
          feelsLike: Math.round(response.data.main.feels_like),
          tempMin: Math.round(response.data.main.temp_min),
          tempMax: Math.round(response.data.main.temp_max),
          condition: response.data.weather[0].main,
          humidity: response.data.main.humidity,
          windSpeed: Math.round(response.data.wind.speed)
        });
        setLoading(false);
      } catch (err: any) {
        console.error('Weather API Error:', err.response?.data || err.message);
        setError('Failed to fetch weather data');
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (condition: string) => {
    const className = "w-16 h-16 text-white";
    switch (condition.toLowerCase()) {
      case 'clear':
        return <WiDaySunny className={className} />;
      case 'rain':
        return <WiRain className={className} />;
      case 'clouds':
        return <WiCloudy className={className} />;
      case 'snow':
        return <WiSnow className={className} />;
      case 'mist':
      case 'fog':
        return <WiDayFog className={className} />;
      case 'thunderstorm':
        return <WiThunderstorm className={className} />;
      default:
        return <WiDaySunny className={className} />;
    }
  };

  if (loading) return <div className="p-4 bg-[#D3D3D3] rounded-lg">Loading weather...</div>;
  if (error) return <div className="p-4 bg-[#D3D3D3] rounded-lg text-red-500">{error}</div>;
  if (!weather) return null;

  return (
    <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Current Weather</h2>
      <div className="flex items-start mb-6">
        {getWeatherIcon(weather.condition)}
        <div className="ml-4">
          <div className="flex items-start">
            <p className="text-4xl font-bold text-white">{weather.temperature}°C</p>
            <div className="ml-4 text-base font-medium text-white flex flex-col">
              <span>H: {weather.tempMax}°C</span>
              <span className="mt-1">L: {weather.tempMin}°C</span>
            </div>
          </div>
          <p className="text-gray-300 mt-1">{weather.condition}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center text-gray-300">
          <WiThermometer className="w-6 h-6 mr-2 text-white" />
          <span>Feels like {weather.feelsLike}°C</span>
        </div>
        <div className="flex items-center text-gray-300">
          <WiHumidity className="w-6 h-6 mr-2 text-white" />
          <span>Humidity {weather.humidity}%</span>
        </div>
        <div className="flex items-center text-gray-300">
          <WiStrongWind className="w-6 h-6 mr-2 text-white" />
          <span>Wind {weather.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
}