import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sessionOptions } from './lib/session';

export function middleware(request: NextRequest) {
  // Sadece oturum çerezinin varlığını kontrol ediyoruz
  const hasSession = request.cookies.get(sessionOptions.cookieName);

  if (!hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Sadece /admin yolunda çalışsın
export const config = {
  matcher: '/admin',
};
