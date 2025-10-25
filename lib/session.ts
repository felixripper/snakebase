import type { IronSessionOptions } from 'iron-session'

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'snakebase-admin-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

// Bu, session objesinin tipini belirtir
declare module 'iron-session' {
  interface IronSessionData {
    isLoggedIn?: boolean
  }
}
