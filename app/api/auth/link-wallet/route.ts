import { NextRequest, NextResponse } from 'next/server';
import { linkWalletToUser, getUserByWallet } from '@/lib/user-store';
import { getAppRouterSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const session = await getAppRouterSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { success: false, message: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, message: 'Cüzdan adresi gerekli' },
        { status: 400 }
      );
    }

    // Check if wallet already linked to another account
    const existingUser = await getUserByWallet(walletAddress);
    if (existingUser && existingUser.id !== session.userId) {
      return NextResponse.json(
        { success: false, message: 'Bu cüzdan başka bir hesaba bağlı' },
        { status: 409 }
      );
    }

    // Link wallet to user
    const success = await linkWalletToUser(session.userId, walletAddress);

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Cüzdan bağlama başarısız' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cüzdan başarıyla bağlandı',
      walletAddress,
    });

  } catch (error) {
    console.error('Link wallet error:', error);
    return NextResponse.json(
      { success: false, message: 'Cüzdan bağlama sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}
