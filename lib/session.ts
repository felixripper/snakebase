import type { SessionOptions } from 'iron-session';
import { getIronSession, type IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  isLoggedIn?: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'snakebase-admin-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getAppRouterSession(): Promise<IronSession<SessionData>> {
  // Next 15 ortamında bazı tiplerde cookies() Promise olarak tiplenebiliyor.
  // Await ile kesin olarak CookieStore elde ediyoruz.
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
