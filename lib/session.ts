import type { SessionOptions } from 'iron-session';
import { getIronSession, type IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  isLoggedIn?: boolean;
  userId?: string; // User ID for regular users
  username?: string; // Username
  isAdmin?: boolean; // Admin flag
}

// Validate SECRET_COOKIE_PASSWORD
if (!process.env.SECRET_COOKIE_PASSWORD || process.env.SECRET_COOKIE_PASSWORD.length < 32) {
  throw new Error('SECRET_COOKIE_PASSWORD must be at least 32 characters long');
}

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'snakebase-session',
  ttl: 60 * 60 * 24 * 7, // 7 days session timeout for users
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true, // Prevents XSS attacks
    sameSite: 'strict', // CSRF protection
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  },
};

export async function getAppRouterSession(): Promise<IronSession<SessionData>> {
  // Next 15 ortamında bazı tiplerde cookies() Promise olarak tiplenebiliyor.
  // Await ile kesin olarak CookieStore elde ediyoruz.
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
