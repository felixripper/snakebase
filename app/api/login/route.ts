import { getIronSession } from 'iron-session'
import { NextResponse } from 'next/server'
import { sessionOptions } from '@/lib/session'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const session = await getIronSession(request.cookies, sessionOptions)
    session.isLoggedIn = true
    await session.save()
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json(
    { message: 'Geçersiz kullanıcı adı veya şifre.' },
    { status: 401 }
  )
}
