import { NextResponse } from 'next/server';
import { getAppRouterSession } from '@/lib/session';
import { getTopHighScores } from '@/lib/score-store';

// Admin endpoint: Sync off-chain Redis scores to on-chain leaderboard
// Bu endpoint yüksek skorları alıp zincire gönderebilir (admin action, gas gerektirir)

export async function POST() {
  try {
    const session = await getAppRouterSession();
    if (!session.isAdmin) {
      return NextResponse.json({ success: false, message: 'admin only' }, { status: 403 });
    }

    // Fetch top scores from Redis
    const top = await getTopHighScores(100);

    // TODO: Implement on-chain sync logic
    // Bu kısımda her bir top score için contract'a submitScore veya batchSubmit çağrısı yapılabilir.
    // Şu anda placeholder döndürüyoruz.

    return NextResponse.json({
      success: true,
      message: 'Sync placeholder; implement contract calls to push scores on-chain',
      topCount: top.length,
      top: top.slice(0, 10)
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 });
  }
}
