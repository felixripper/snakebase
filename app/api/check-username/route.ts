import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Validate username format
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { available: false, error: 'Username must be 3-20 characters' },
        { status: 200 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { available: false, error: 'Only letters, numbers, and underscores allowed' },
        { status: 200 }
      );
    }

    // Since we're checking on-chain availability via the contract,
    // this endpoint can serve as a quick validation check
    // The actual availability check happens in the frontend using the contract
    return NextResponse.json(
      { available: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Username check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
