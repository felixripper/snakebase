import { NextResponse } from 'next/server';
import { getAppRouterSession } from '@/lib/session';

export async function GET() {
  const session = await getAppRouterSession();
  session.destroy();
  return NextResponse.json({ ok: true });
}
