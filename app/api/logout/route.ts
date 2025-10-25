import { getIronSession } from 'iron-session'
import { NextResponse } from 'next/server'
import { sessionOptions } from '@/lib/session'
import { cookies } from 'next/headers'

export async function GET() {
  const session = await getIronSession(cookies(), sessionOptions)
  session.destroy()
  return NextResponse.json({ ok: true })
}
