import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sessionOptions } from './lib/session';

export function middleware(request: NextRequest) {
  // Basit kontrol: admin çerezi var mı?
  const hasSession = request.cookies.get(sessionOptions.cookieName);
  if (!hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

// /admin altındaki TÜM sayfaları koru
export const config = {
  matcher: '/admin/:path*',
};