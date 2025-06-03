"use client";

import { useState, useEffect } from 'react';
import Weather from './components/Weather';
import Calendar from './components/Calendar';

export default function Home() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('Good Morning');
      } else if (hour >= 12 && hour < 18) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#121212] px-8 pt-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-left text-white/90">Hi, Ilhan</h1>
          <h2 className="text-4xl font-bold text-left text-white">{greeting}</h2>
        </div>
        <Weather />
        <Calendar />
      </div>
    </main>
  );
}
