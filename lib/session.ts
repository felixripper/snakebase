import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

// Bu, session objesinin tipini belirtir.
// 'iron-session' modülünü genişleterek kendi verimizi ekliyoruz.
declare module 'iron-session' {
  interface IronSessionData {
    isLoggedIn?: boolean;
  }
}

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'snakebase-admin-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

// Bu, oturumu almak için kullanacağımız merkezi fonksiyondur.
// Tip belirtimini kaldırarak, TypeScript'in doğru tipi kendisinin bulmasını sağlıyoruz.
// Bu, önceki tüm tip hatalarını ortadan kaldırır.
export async function getSession() {
  const session = await getIronSession(cookies(), sessionOptions);
  return session;
}
