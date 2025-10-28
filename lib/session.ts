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
  // Next.js 15'te API routes'ta cookies() hala Promise olabilir.
  const cookieStore = await cookies();
  // DEBUG: log cookie keys present for troubleshooting
  try {
    const all = cookieStore.getAll ? (cookieStore.getAll() as Array<{ name: string; value?: string }>) : [];
    // We'll log names only to avoid leaking values in logs.
    console.log('DEBUG cookie names:', all.map((c) => c.name));
    // Log value lengths (masked)
    console.log('DEBUG cookie values (name:length):', all.map((c) => `${c.name}:${String(c.value || '').length}`));
  } catch {
    // ignore logging errors
  }
  // Also log the raw snakebase-session cookie for deeper debugging (masked partially)
  try {
    const raw = cookieStore.get ? cookieStore.get('snakebase-session') : undefined;
    if (raw) {
      // eslint-disable-next-line no-console
      console.log('DEBUG raw snakebase-session cookie:', String(raw.value).slice(0, 40) + '...');
    } else {
      // eslint-disable-next-line no-console
      console.log('DEBUG raw snakebase-session cookie: <not present>');
    }
  } catch {
    // ignore
  }
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
