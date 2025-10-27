import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvDel } from '@/lib/redis';
import { buildSignMessage, isNonceExpired } from '@/lib/wallet-auth';
import { verifyMessage } from 'viem';
import { createUserWithWallet, getUserByWallet } from '@/lib/user-store';
import { getAppRouterSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const { address, signature } = await req.json();
    if (!address || !signature) {
      return NextResponse.json({ success: false, message: 'address and signature required' }, { status: 400 });
    }
    const addr = (address as string).toLowerCase();

    const stored = await kvGet(`auth:nonce:${addr}`);
    if (!stored) {
      return NextResponse.json({ success: false, message: 'nonce not found' }, { status: 400 });
    }
    const { nonce, issuedAt } = JSON.parse(stored) as { nonce: string; issuedAt: number };
    if (isNonceExpired(issuedAt)) {
      await kvDel(`auth:nonce:${addr}`);
      return NextResponse.json({ success: false, message: 'nonce expired' }, { status: 400 });
    }

    const message = buildSignMessage(addr, nonce, issuedAt);

    const ok = await verifyMessage({ address: addr as `0x${string}`, message, signature });
    if (!ok) {
      return NextResponse.json({ success: false, message: 'signature verification failed' }, { status: 401 });
    }

    // Create or fetch user by wallet
    let user = await getUserByWallet(addr);
    if (!user) {
      user = await createUserWithWallet(addr);
    }

    // Create session
    const session = await getAppRouterSession();
    session.isLoggedIn = true;
    session.userId = user.id;
    session.username = user.username;
    session.isAdmin = false;
    await session.save();
  // eslint-disable-next-line no-console
  console.log('DEBUG wallet verify session saved:', { isLoggedIn: session.isLoggedIn, userId: session.userId, username: session.username });

    // Delete nonce (one-time)
    await kvDel(`auth:nonce:${addr}`);

    return NextResponse.json({ success: true, user: { id: user.id, username: user.username, walletAddress: user.walletAddress, avatarUrl: user.avatarUrl } });
  } catch {
    return NextResponse.json({ success: false, message: 'wallet verify failed' }, { status: 500 });
  }
}
