import { NextResponse } from 'next/server';
import { getAppRouterSession } from '@/lib/session';
import { getUserById } from '@/lib/user-store';

export async function GET() {
  try {
    const session = await getAppRouterSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Get user data from store
    const user = await getUserById(session.userId);
    if (!user) {
      // Clear invalid session
      session.destroy();
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        walletAddress: user.walletAddress,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Session kontrol hatası:', error);
    return NextResponse.json(
      { error: 'Session kontrol edilemedi' },
      { status: 500 }
    );
  }
}