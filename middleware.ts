import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions } from './lib/session'

export async function middleware(request: NextRequest) {
  const session = await getIronSession(request.cookies, sessionOptions)

  if (!session.isLoggedIn) {
    // Kullanıcı giriş yapmamışsa ve /admin yoluna gitmeye çalışıyorsa,
    // onu /login sayfasına yönlendir.
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Bu middleware'in sadece /admin yolunda çalışmasını sağla
export const config = {
  matcher: '/admin',
}
