import { NextResponse } from 'next/server';
import { createUserWithWallet } from '@/lib/user-store';
import { getAppRouterSession } from '@/lib/session';

// Dev-only helper to create a user and set session for local testing.
// Not enabled in production.
export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ success: false, message: 'disabled in production' }, { status: 403 });
  }

  const { wallet } = await req.json().catch(() => ({}));
  if (!wallet) return NextResponse.json({ success: false, message: 'wallet required' }, { status: 400 });

  const user = await createUserWithWallet(wallet as string);
  const session = await getAppRouterSession();
  session.isLoggedIn = true;
  session.userId = user.id;
  session.username = user.username;
  await session.save();

  return NextResponse.json({ success: true, user: { id: user.id, username: user.username, walletAddress: user.walletAddress } });
}
