import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    // Get tokens from Google
    const { tokens } = await oauth2Client.getToken(code);
    
    // Create response with redirect
    const response = NextResponse.redirect(new URL('/', request.url));

    // Set access token cookie
    if (tokens.access_token) {
      response.cookies.set('calendar_access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600 // 1 hour
      });
    }

    // Set refresh token cookie if provided
    if (tokens.refresh_token) {
      response.cookies.set('calendar_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 3600 // 7 days
      });
    }

    // Set the credentials in oauth2Client
    oauth2Client.setCredentials(tokens);

    return response;
  } catch (error) {
    console.error('Auth Callback Error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 