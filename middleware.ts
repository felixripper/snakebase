import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from './lib/session';

export async function middleware(request: NextRequest) {
  // Middleware, çerezleri doğrudan request'ten alır. Bu yüzden kendi getIronSession çağrısını yapar.
  const session = await getIronSession<SessionData>(request.cookies, sessionOptions);

  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin',
};
