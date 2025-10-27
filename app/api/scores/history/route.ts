import { NextResponse, type NextRequest } from 'next/server';
import { getAppRouterSession } from '@/lib/session';
import { getHistoryByWallet } from '@/lib/score-store';
import { getUserById } from '@/lib/user-store';

export async function GET(req: NextRequest) {
  try {
    // Log incoming Cookie header to ensure the browser/client is sending the session cookie
    // eslint-disable-next-line no-console
    console.log('DEBUG Request Cookie header:', String(req.headers.get('cookie'))?.slice(0, 200));
    const session = await getAppRouterSession();
  // DEBUG: log session for troubleshooting auth issues
  // eslint-disable-next-line no-console
  console.log('DEBUG session.isLoggedIn:', Boolean((session as any).isLoggedIn));
  // eslint-disable-next-line no-console
  console.log('DEBUG session.userId:', (session as any).userId);
  // eslint-disable-next-line no-console
  console.log('DEBUG session.username:', (session as any).username);
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
