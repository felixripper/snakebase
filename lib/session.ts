import { IronSession, getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

// Session verimizin yapısını burada net bir şekilde tanımlıyoruz.
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

// Oturumu almak için merkezi ve doğru tiplendirilmiş fonksiyon.
// 'async' anahtar kelimesi, fonksiyonun içindeki await'in doğru çalışmasını sağlar.
// Bu, önceki tüm hataların kök nedeniydi.
export async function getAppRouterSession(): Promise<IronSession<SessionData>> {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}
