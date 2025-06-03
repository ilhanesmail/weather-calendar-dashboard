import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    date?: string;
  };
  end: {
    dateTime: string;
    date?: string;
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

  if (loading) return <div className="p-4">Loading calendar...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Today's Schedule</h2>
      {events.length === 0 ? (
        <p className="text-gray-500">No events scheduled for today</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border-l-4 border-blue-500 pl-4 py-2"
            >
              <h3 className="font-semibold">{event.summary}</h3>
              <p className="text-sm text-gray-600">
                {event.start.dateTime
                  ? `${formatEventTime(event.start.dateTime)} - ${formatEventTime(
                      event.end.dateTime
                    )}`
                  : 'All day'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 