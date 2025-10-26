import { NextResponse } from 'next/server';
import { getAppRouterSession } from '@/lib/session';
import { getHistoryByWallet } from '@/lib/score-store';
import { getUserById } from '@/lib/user-store';

export async function GET() {
  try {
    const session = await getAppRouterSession();
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ success: false, message: 'auth required', history: [] }, { status: 401 });
    }
    const user = await getUserById(session.userId);
    if (!user?.walletAddress) {
      return NextResponse.json({ success: true, history: [] });
    }
    const history = await getHistoryByWallet(user.walletAddress, 50);
    return NextResponse.json({ success: true, history });
  } catch {
    return NextResponse.json({ success: false, history: [] }, { status: 500 });
  }
}
