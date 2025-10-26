import { NextRequest, NextResponse } from 'next/server';
import { getDraftConfig, saveDraftConfig } from '@/lib/config-store';
import { getAppRouterSession } from '@/lib/session';

export async function GET() {
  try {
    const config = await getDraftConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching draft config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch draft config' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getAppRouterSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await saveDraftConfig(body);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving draft config:', error);
    return NextResponse.json(
      { error: 'Failed to save draft config' },
      { status: 500 }
    );
  }
}
