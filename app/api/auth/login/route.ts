import { NextResponse } from 'next/server';
import { getAppRouterSession } from '@/lib/session';
import { createUserWithWallet } from '@/lib/user-store';

export async function POST(request: Request) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress || typeof walletAddress !== 'string') {
      return NextResponse.json(
        { error: 'Geçersiz cüzdan adresi' },
        { status: 400 }
      );
    }

    // Create or get user
    const user = await createUserWithWallet(walletAddress.toLowerCase());

    // Create session
    const session = await getAppRouterSession();
    session.isLoggedIn = true;
    session.userId = user.id;
    session.username = user.username;
    await session.save();

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
    console.error('Login hatası:', error);
    return NextResponse.json(
      { error: 'Giriş yapılamadı' },
      { status: 500 }
    );
  }
}