import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { startOfDay, endOfDay, addDays } from 'date-fns';
import { cookies } from 'next/headers';
import { calendar_v3 } from 'googleapis';

interface CalendarEvent extends Partial<calendar_v3.Schema$Event> {
  calendarName: string;
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET() {
  try {
    // Get tokens from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('calendar_access_token')?.value;
    const refreshToken = cookieStore.get('calendar_refresh_token')?.value;

    // If we don't have tokens, redirect to auth
    if (!accessToken) {
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar.readonly'],
      });

      return NextResponse.json({ 
        needsAuth: true,
        authUrl 
      });
    }

    // Set the credentials
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const now = new Date();
    const timeMin = startOfDay(now).toISOString();
    const timeMax = endOfDay(addDays(now, 1)).toISOString();

    // First, get the list of calendars
    const calendarList = await calendar.calendarList.list();
    const calendars = (calendarList.data.items || []).filter(cal => 
      cal.summary?.toLowerCase() !== 'weather calendar'
    );

    // Create a map of calendar IDs to names
    const calendarNames = new Map(
      calendars.map(cal => [cal.id, cal.summary])
    );

    // Get events from all calendars except Weather Calendar
    const allEvents: CalendarEvent[] = [];
    
    for (const cal of calendars) {
      if (cal.id) {
        const response = await calendar.events.list({
          calendarId: cal.id,
          timeMin,
          timeMax,
          maxResults: 10,
          singleEvents: true,
          orderBy: 'startTime',
        });

        const events = (response.data.items || []).filter(event => 
          // Only include events with specific start times (not all-day events)
          event.start?.dateTime && event.end?.dateTime
        );
        
        allEvents.push(...events.map(event => ({
          ...event,
          calendarName: calendarNames.get(cal.id!) || 'Unknown Calendar'
        })));
      }
    }

    // Sort all events by start time
    allEvents.sort((a, b) => {
      const aStart = a.start?.dateTime || '';
      const bStart = b.start?.dateTime || '';
      return new Date(aStart).getTime() - new Date(bStart).getTime();
    });

    return NextResponse.json({ events: allEvents });
  } catch (error: any) {
    console.error('Calendar API Error:', error);

    // If the error is related to invalid credentials, redirect to auth
    if (error.message?.includes('invalid_grant') || error.message?.includes('Invalid Credentials')) {
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar.readonly'],
      });

      return NextResponse.json({ 
        needsAuth: true,
        authUrl 
      });
    }

    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    );
  }
} 