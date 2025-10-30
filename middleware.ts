import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Admin sayfaları için oturum kontrolü
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Login sayfasını hariç tut
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Basit oturum kontrolü - çerez var mı?
    const sessionCookie = request.cookies.get('snakebase-session');
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// /admin altındaki TÜM sayfaları koru
export const config = {
  matcher: '/admin/:path*',
};