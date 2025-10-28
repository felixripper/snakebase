import { NextRequest, NextResponse } from 'next/server';
// import sharp from 'sharp'; // Removed sharp dependency

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const score = searchParams.get('score') || '0';
    const username = searchParams.get('username') || 'Player';
    const rank = searchParams.get('rank') || '';
    const wallet = searchParams.get('wallet') || '';

    const displayName = username || (wallet ? wallet.slice(0, 6) + '…' + wallet.slice(-4) : 'Player');

    let rankText = '';
    if (rank && Number(rank) > 0) {
      const r = Number(rank);
      let icon = '🏆';
      if (r === 1) icon = '🥇';
      if (r === 2) icon = '🥈';
      if (r === 3) icon = '🥉';
      rankText = `<text x="400" y="560" text-anchor="middle" font-size="28" fill="#ffd97d" font-family="system-ui">${icon} Rank #${rank}</text>`;
    }

    // SVG template
    const svg = `
<svg width="800" height="1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0b1228;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1a2847;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0b1228;stop-opacity:1" />
    </linearGradient>
  </defs>

  <rect width="800" height="1000" fill="url(#bg)"/>

  <text x="400" y="100" text-anchor="middle" font-size="48" font-weight="bold" fill="#ffffff" font-family="system-ui">🐍 Snakebase</text>

  <text x="400" y="350" text-anchor="middle" font-size="96" font-weight="bold" fill="#3ee686" font-family="system-ui">${score}</text>
  <text x="400" y="400" text-anchor="middle" font-size="32" fill="#aaaaaa" font-family="system-ui">SCORE</text>

  <text x="400" y="500" text-anchor="middle" font-size="36" font-weight="bold" fill="#ffffff" font-family="system-ui">${displayName}</text>

  ${rankText}

  <text x="400" y="920" text-anchor="middle" font-size="24" fill="#888888" font-family="system-ui">Play on Base • snakebase.vercel.app</text>
</svg>
    `.trim();

    // Return SVG directly instead of converting to PNG
    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Poster generation error:', error);
    return NextResponse.json({ error: 'Failed to generate poster' }, { status: 500 });
  }
}
