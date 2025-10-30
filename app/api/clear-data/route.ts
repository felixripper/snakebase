import { NextResponse } from "next/server";
import { kvGet, kvSet } from "@/lib/redis";
import { getAppRouterSession } from "@/lib/session";

export async function POST() {
  // Authentication required for data clearing
  try {
    const session = await getAppRouterSession();
    if (!session.isLoggedIn) {
      return NextResponse.json(
        { error: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }

  try {
    console.log('Clearing test data...');

    // Clear leaderboard data
    const walletsKey = 'scores:wallets';
    const walletsRaw = await kvGet(walletsKey);
    if (walletsRaw) {
      const wallets = JSON.parse(walletsRaw);
      console.log('Clearing scores for wallets:', wallets);

      for (const wallet of wallets) {
        await kvSet('scores:high:' + wallet, '0');
        await kvSet('scores:display:' + wallet, '');
        await kvSet('scores:history:' + wallet, '[]');
      }

      await kvSet(walletsKey, '[]');
    }

    return NextResponse.json({
      success: true,
      message: 'Test data cleared successfully'
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error clearing data:', error);
    return NextResponse.json(
      { error: 'Failed to clear test data' },
      { status: 500 }
    );
  }
}