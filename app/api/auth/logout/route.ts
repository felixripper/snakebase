import { NextResponse } from 'next/server';
import { getAppRouterSession } from '@/lib/session';

export async function POST() {
  try {
    const session = await getAppRouterSession();
    session.destroy();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Logout hatası:', error);
    return NextResponse.json(
      { error: 'Çıkış yapılamadı' },
      { status: 500 }
    );
  }
}