import { NextRequest, NextResponse } from 'next/server';
import { getAppRouterSession } from '@/lib/session';
import { submitScoreForSession, getTopHighScores } from '@/lib/score-store';
import { verifyScoreSignature, isScoreSubmissionValid } from '@/lib/score-validation';
import { getUserById } from '@/lib/user-store';

export async function POST(req: NextRequest) {
  try {
    const session = await getAppRouterSession();
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ success: false, message: 'auth required' }, { status: 401 });
    }

    const body = await req.json();
    const { score, signature, nonce, timestamp } = body;
    const nScore = Number(score);
    if (!Number.isFinite(nScore) || nScore < 0) {
      return NextResponse.json({ success: false, message: 'invalid score' }, { status: 400 });
    }

    // Optional: anti-cheat signature validation
    if (signature && nonce && timestamp) {
      const user = await getUserById(session.userId);
      if (!user?.walletAddress) {
        return NextResponse.json({ success: false, message: 'wallet address required for signature' }, { status: 400 });
      }
      if (!isScoreSubmissionValid(Number(timestamp))) {
        return NextResponse.json({ success: false, message: 'submission expired' }, { status: 400 });
      }
      const valid = await verifyScoreSignature(
        user.walletAddress,
        nScore,
        nonce,
        Number(timestamp),
        signature
      );
      if (!valid) {
        return NextResponse.json({ success: false, message: 'invalid signature' }, { status: 403 });
      }
    }

    const stats = await submitScoreForSession(session.userId, nScore);
    const top = await getTopHighScores(25);

    return NextResponse.json({ success: true, top, stats });
  } catch {
    return NextResponse.json({ success: false, message: 'submit failed' }, { status: 500 });
  }
}
