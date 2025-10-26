import { NextResponse } from 'next/server';
import { getAppRouterSession } from '@/lib/session';
import { getPlayerAchievements } from '@/lib/achievements';

export async function GET() {
  try {
    const session = await getAppRouterSession();
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ success: false, unlocked: [], locked: [] }, { status: 401 });
    }
    const data = await getPlayerAchievements(session.userId);
    return NextResponse.json({ success: true, ...data });
  } catch {
    return NextResponse.json({ success: false, unlocked: [], locked: [] }, { status: 500 });
  }
}
