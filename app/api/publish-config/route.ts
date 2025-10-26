import { NextResponse } from 'next/server';
import { publishDraftToLive } from '@/lib/config-store';
import { getAppRouterSession } from '@/lib/session';

export async function POST() {
  try {
    // Auth check
    const session = await getAppRouterSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await publishDraftToLive();
    
    return NextResponse.json({ 
      success: true,
      message: 'Draft successfully published to live'
    });
  } catch (error) {
    console.error('Error publishing config:', error);
    return NextResponse.json(
      { error: 'Failed to publish config' },
      { status: 500 }
    );
  }
}
