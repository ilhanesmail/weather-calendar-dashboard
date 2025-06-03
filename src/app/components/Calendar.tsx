"use client";

import { useState, useEffect } from 'react';
import { format, addDays, isToday, isTomorrow } from 'date-fns';

interface CalendarEvent {
  id: string;
  summary: string;
  calendarName: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
}

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/calendar');
        if (!response.ok) {
          throw new Error('Failed to fetch calendar events');
        }
        const data = await response.json();
        
        // Check if we need to authenticate
        if (data.needsAuth) {
          window.location.href = data.authUrl;
          return;
        }

        setEvents(data.events);
        setLoading(false);
      } catch (err) {
        setError('Failed to load calendar events');
        setLoading(false);
      }
    };

    fetchEvents();
    // Refresh events every 5 minutes
    const interval = setInterval(fetchEvents, 300000);
    return () => clearInterval(interval);
  }, []);

  const formatEventTime = (dateTime: string) => {
    return format(new Date(dateTime), 'h:mm a');
  };

  const filterEventsByDay = (events: CalendarEvent[], checkFn: (date: Date) => boolean) => {
    return events.filter(event => {
      const eventDate = new Date(event.start.dateTime);
      return checkFn(eventDate);
    });
  };

  const getCalendarBorderColor = (calendarName: string) => {
    switch (calendarName.toLowerCase()) {
      case 'general':
        return 'border-green-500';
      case 'calendar':
        return 'border-blue-500';
      case 'gym schedule':
        return 'border-orange-500';
      default:
        return 'border-gray-500';
    }
  };

  if (loading) return <div className="p-4 bg-[#1E1E1E] rounded-lg text-white">Loading calendar...</div>;
  if (error) return <div className="p-4 bg-[#1E1E1E] rounded-lg text-red-400">{error}</div>;

  const todayEvents = filterEventsByDay(events, isToday);
  const tomorrowEvents = filterEventsByDay(events, isTomorrow);

  return (
    <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-6 transition-all hover:shadow-xl space-y-6">
      {/* Today's Events */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">Today</h2>
        {todayEvents.length === 0 ? (
          <p className="text-gray-400">No events scheduled for today</p>
        ) : (
          <div className="space-y-4">
            {todayEvents.map((event) => (
              <div
                key={event.id}
                className={`border-l-4 ${getCalendarBorderColor(event.calendarName)} pl-4 py-2 bg-[#2D2D2D] rounded-r-lg`}
              >
                <h3 className="font-semibold text-white">{event.summary}</h3>
                <p className="text-xs text-gray-400 mt-1">{event.calendarName}</p>
                <p className="text-sm text-gray-300 mt-1">
                  {formatEventTime(event.start.dateTime)} - {formatEventTime(event.end.dateTime)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tomorrow's Events */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">Tomorrow</h2>
        {tomorrowEvents.length === 0 ? (
          <p className="text-gray-400">No events scheduled for tomorrow</p>
        ) : (
          <div className="space-y-4">
            {tomorrowEvents.map((event) => (
              <div
                key={event.id}
                className={`border-l-4 ${getCalendarBorderColor(event.calendarName)} pl-4 py-2 bg-[#2D2D2D] rounded-r-lg`}
              >
                <h3 className="font-semibold text-white">{event.summary}</h3>
                <p className="text-xs text-gray-400 mt-1">{event.calendarName}</p>
                <p className="text-sm text-gray-300 mt-1">
                  {formatEventTime(event.start.dateTime)} - {formatEventTime(event.end.dateTime)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 