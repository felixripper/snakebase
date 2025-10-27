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
    // Use 'lax' to improve cookie delivery in embedded/iframe flows while
    // still providing reasonable CSRF protections. 'strict' can block
    // cookies in some in-app iframe navigations and third-party contexts.
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  },
};

export async function getAppRouterSession(): Promise<IronSession<SessionData>> {
  // Next 15 ortamında bazı tiplerde cookies() Promise olarak tiplenebiliyor.
  // Await ile kesin olarak CookieStore elde ediyoruz.
  const cookieStore = await cookies();
  // DEBUG: log cookie keys present for troubleshooting
  // eslint-disable-next-line no-console
  try {
    const all = cookieStore.getAll ? cookieStore.getAll() : [];
    // Note: cookieStore.getAll() may return Cookie objects depending on runtime
    // We'll log names only to avoid leaking values in logs.
    // eslint-disable-next-line no-console
    console.log('DEBUG cookie names:', all.map((c: any) => c.name));
  } catch (e) {
    // ignore
  }
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
