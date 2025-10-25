import { NextResponse } from 'next/server';
import { getConfig, setConfig } from '@/lib/config';
import { sessionOptions } from '@/lib/session';
import { cookies } from 'next/headers';

export async function GET() {
  const cfg = await getConfig();
  return NextResponse.json(cfg);
}

export async function POST(request: Request) {
  // Basit admin kontrolü: admin session çerezi var mı?
  const cookieStore = await cookies();
  const hasSession = cookieStore.get(sessionOptions.cookieName);
  if (!hasSession) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const updated = await setConfig(body);
  return NextResponse.json(updated);
}
