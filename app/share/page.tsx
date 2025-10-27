import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const score = (params.score as string) || '0';
  const username = (params.username as string) || 'Player';
  const rank = (params.rank as string) || '';
  
  const posterUrl = new URL('/api/share/poster', process.env.NEXT_PUBLIC_URL || 'https://snakebase.vercel.app');
  posterUrl.searchParams.set('score', score);
  posterUrl.searchParams.set('username', username);
  if (rank) posterUrl.searchParams.set('rank', rank);

  const title = `${username} scored ${score} on Snakebase!`;
  const description = rank ? `Ranked #${rank} on the leaderboard` : 'Play Snakebase on Base';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [posterUrl.toString()],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [posterUrl.toString()],
    },
    other: {
      // Farcaster Frame meta tags
      'fc:frame': 'vNext',
      'fc:frame:image': posterUrl.toString(),
      'fc:frame:button:1': 'Play Snakebase',
      'fc:frame:button:1:action': 'link',
      'fc:frame:button:1:target': process.env.NEXT_PUBLIC_URL || 'https://snakebase.vercel.app',
    },
  };
}

async function ShareFrameContent({ searchParams }: Props) {
  const params = await searchParams;
  const score = (params.score as string) || '0';
  const username = (params.username as string) || 'Player';
  const rank = (params.rank as string) || '';

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0b1228, #1a2847)',
      color: '#fff',
      fontFamily: 'system-ui',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>🐍 Snakebase</h1>
      <div style={{ fontSize: '96px', fontWeight: 'bold', color: '#3ee686', marginBottom: '10px' }}>
        {score}
      </div>
      <div style={{ fontSize: '32px', color: '#aaa', marginBottom: '30px' }}>
        SCORE
      </div>
      <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
        {username}
      </div>
      {rank && Number(rank) > 0 && (
        <div style={{ fontSize: '28px', color: '#ffd97d', marginBottom: '40px' }}>
          {Number(rank) === 1 && '🥇'} 
          {Number(rank) === 2 && '🥈'} 
          {Number(rank) === 3 && '🥉'} 
          {Number(rank) > 3 && '🏆'} 
          Rank #{rank}
        </div>
      )}
      <Link 
        href="/"
        style={{
          display: 'inline-block',
          padding: '14px 32px',
          background: 'linear-gradient(180deg, #94f7b7 0%, #3ee686 100%)',
          color: '#0b0f1a',
          textDecoration: 'none',
          borderRadius: '12px',
          fontWeight: '800',
          fontSize: '18px',
          marginTop: '20px'
        }}
      >
        Play Now
      </Link>
    </div>
  );
}

export default function ShareFramePage({ searchParams }: Props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShareFrameContent searchParams={searchParams} />
    </Suspense>
  );
}
