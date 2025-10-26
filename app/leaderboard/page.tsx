'use client';

import Leaderboard from '../_components/Leaderboard';

export default function LeaderboardPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '48px', fontWeight: '900' }}>
        🏆 Leaderboard
      </h1>
      <Leaderboard />
    </div>
  );
}
