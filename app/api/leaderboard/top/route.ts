import { NextRequest, NextResponse } from 'next/server';
import { getTopHighScores } from '@/lib/score-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get('limit') || '25');
    const top = await getTopHighScores(Math.min(Math.max(limit, 1), 100));
    return NextResponse.json({ success: true, top });
  } catch {
    return NextResponse.json({ success: false, top: [] }, { status: 500 });
  }
}
