import { NextResponse } from 'next/server';
import { getAppRouterSession } from '@/lib/session';
import { getDailyQuest } from '@/lib/achievements';

export async function GET() {
  try {
    const session = await getAppRouterSession();
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ success: false, quest: null }, { status: 401 });
    }
    const quest = await getDailyQuest(session.userId);
    return NextResponse.json({ success: true, quest });
  } catch {
    return NextResponse.json({ success: false, quest: null }, { status: 500 });
  }
}
