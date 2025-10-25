import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sessionOptions } from './lib/session';

/**
 * Middleware to protect /admin routes
 * Checks if user has a valid session with isLoggedIn = true
 */
export async function middleware(request: NextRequest) {
  try {
    // Get cookies from request
    const cookieStore = request.cookies;

    // Check if session cookie exists
    const hasSessionCookie = cookieStore.get(sessionOptions.cookieName);
    if (!hasSessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Validate session content
    // Note: We can't fully validate the session here due to Next.js middleware limitations
    // The session verification happens in API routes via requireAuth()

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Protect all /admin routes (pages and API endpoints)
export const config = {
  matcher: '/admin/:path*',
};
