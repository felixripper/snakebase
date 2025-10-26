import { NextRequest, NextResponse } from 'next/server';
import { getAppRouterSession } from '@/lib/session';
import { submitScoreForSession, getTopHighScores } from '@/lib/score-store';

export async function POST(req: NextRequest) {
  try {
    const session = await getAppRouterSession();
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ success: false, message: 'auth required' }, { status: 401 });
    }

    const { score } = await req.json();
    const nScore = Number(score);
    if (!Number.isFinite(nScore) || nScore < 0) {
      return NextResponse.json({ success: false, message: 'invalid score' }, { status: 400 });
    }

    await submitScoreForSession(session.userId, nScore);
    const top = await getTopHighScores(25);
    return NextResponse.json({ success: true, top });
  } catch {
    return NextResponse.json({ success: false, message: 'submit failed' }, { status: 500 });
  }
}
