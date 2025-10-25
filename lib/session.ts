import { getIronSession, IronSession, IronSessionData } from 'iron-session';
import { cookies } from 'next/headers';

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'snakebase-admin-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

// Bu, session objemizin tipini belirtir
export interface SessionData extends IronSessionData {
  isLoggedIn?: boolean;
}

// Bu, oturumu almak için kullanacağımız merkezi fonksiyondur
export function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(cookies(), sessionOptions);
}
