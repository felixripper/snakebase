import { getIronSession } from 'iron-session'
import { NextResponse } from 'next/server'
import { sessionOptions } from '@/lib/session'

export async function GET(request: Request) {
  const session = await getIronSession(request.cookies, sessionOptions)
  session.destroy()
  return NextResponse.json({ ok: true })
}
