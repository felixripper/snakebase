import { NextResponse } from 'next/server';
import { getAppRouterSession } from '@/lib/session';
import { getUserById } from '@/lib/user-store';

export async function GET() {
  try {
    const session = await getAppRouterSession();

    console.log('DEBUG session.isLoggedIn:', session.isLoggedIn);
    console.log('DEBUG session.userId:', session.userId);
    console.log('DEBUG session.username:', session.username);

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    // Get fresh user data
    const user = await getUserById(session.userId);
    
    console.log('DEBUG getUserById result:', user ? 'found' : 'null');

    if (!user) {
      // User deleted, destroy session
      session.destroy();
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        walletAddress: user.walletAddress,
        createdAt: user.createdAt,
        avatarUrl: user.avatarUrl,
      },
    });

  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 500 }
    );
  }
}
