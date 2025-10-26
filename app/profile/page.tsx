'use client';

import { useAccount, useReadContract } from 'wagmi';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import styles from './Profile.module.css';

const LEADERBOARD_CONTRACT = process.env.NEXT_PUBLIC_LEADERBOARD_CONTRACT as `0x${string}`;

const LEADERBOARD_ABI = [
  {
    inputs: [{ name: 'playerAddress', type: 'address' }],
    name: 'getPlayer',
    outputs: [
      { name: 'playerAddress', type: 'address' },
      { name: 'username', type: 'string' },
      { name: 'highScore', type: 'uint256' },
      { name: 'totalGames', type: 'uint256' },
      { name: 'totalScore', type: 'uint256' },
      { name: 'registeredAt', type: 'uint256' },
      { name: 'lastPlayedAt', type: 'uint256' },
      { name: 'isRegistered', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'playerAddress', type: 'address' }],
    name: 'getPlayerRank',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

function ProfileContent() {
  const { address: connectedAddress } = useAccount();
  const searchParams = useSearchParams();
  const profileAddress = searchParams.get('address') as `0x${string}` | null;
  
  const targetAddress = profileAddress || connectedAddress;
  const isOwnProfile = targetAddress === connectedAddress;

  const { data: playerData, isLoading: isLoadingPlayer } = useReadContract({
    address: LEADERBOARD_CONTRACT,
    abi: LEADERBOARD_ABI,
    functionName: 'getPlayer',
    args: targetAddress ? [targetAddress] : undefined,
  });

  const { data: rankData, isLoading: isLoadingRank } = useReadContract({
    address: LEADERBOARD_CONTRACT,
    abi: LEADERBOARD_ABI,
    functionName: 'getPlayerRank',
    args: targetAddress ? [targetAddress] : undefined,
  });

  // Off-chain history for the connected session user (only when viewing own profile)
  const [history, setHistory] = useState<Array<{ ts: number; score: number }>>([]);
  useEffect(() => {
    const load = async () => {
      if (!isOwnProfile) return;
      try {
        const res = await fetch('/api/scores/history');
        if (!res.ok) return;
        const data = await res.json();
        if (data?.success && Array.isArray(data.history)) setHistory(data.history);
      } catch {}
    };
    void load();
  }, [isOwnProfile]);

  if (!targetAddress) {
    return (
      <div className={styles.container}>
        <div className={styles.notice}>
          <h3>No Profile Selected</h3>
          <p>Please connect your wallet or specify a player address</p>
        </div>
      </div>
    );
  }

  if (isLoadingPlayer || isLoadingRank) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading player data...</p>
        </div>
      </div>
    );
  }

  if (!playerData || !playerData[7]) { // isRegistered is at index 7
    return (
      <div className={styles.container}>
        <div className={styles.notice}>
          <h3>Player Not Registered</h3>
          <p>This address has not registered for the leaderboard yet.</p>
          {isOwnProfile && (
            <Link href="/" className={styles.registerLink}>Register Now</Link>
          )}
        </div>
      </div>
    );
  }

  const [
    playerAddress,
    username,
    highScore,
    totalGames,
    totalScore,
    registeredAt,
    lastPlayedAt,
    _isRegistered
  ] = playerData;

  const rank = rankData ? Number(rankData) : 0;
  const averageScore = totalGames > 0 ? Number(totalScore) / Number(totalGames) : 0;

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏆';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.username}>
          {getRankEmoji(rank)} {username}
        </h1>
        {isOwnProfile && <span className={styles.badge}>Your Profile</span>}
        <p className={styles.address}>
          {playerAddress.slice(0, 6)}...{playerAddress.slice(-4)}
        </p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{rank > 0 ? `#${rank}` : 'Unranked'}</div>
          <div className={styles.statLabel}>Global Rank</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{Number(highScore).toLocaleString()}</div>
          <div className={styles.statLabel}>High Score</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{Number(totalGames).toLocaleString()}</div>
          <div className={styles.statLabel}>Total Games</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{Number(totalScore).toLocaleString()}</div>
          <div className={styles.statLabel}>Total Score</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{averageScore.toFixed(0)}</div>
          <div className={styles.statLabel}>Average Score</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {new Date(Number(registeredAt) * 1000).toLocaleDateString()}
          </div>
          <div className={styles.statLabel}>Member Since</div>
        </div>
      </div>

      {lastPlayedAt > 0 && (
        <div className={styles.activity}>
          <h3>Last Activity</h3>
          <p>
            Last played: {new Date(Number(lastPlayedAt) * 1000).toLocaleString()}
          </p>
        </div>
      )}

      {isOwnProfile && (
        <div className={styles.activity}>
          <h3>Game History</h3>
          {history.length === 0 ? (
            <p>No games recorded yet.</p>
          ) : (
            <>
              {/* Simple SVG graph */}
              <div style={{ marginBottom: 16 }}>
                <svg viewBox="0 0 400 100" style={{ width: '100%', height: 100, background: '#f8f9fa', borderRadius: 8 }}>
                  {history.slice(-20).map((h, i, arr) => {
                    const maxScore = Math.max(...arr.map(a => a.score), 1);
                    const x = (i / (arr.length - 1 || 1)) * 380 + 10;
                    const y = 90 - (h.score / maxScore) * 70;
                    return (
                      <circle key={i} cx={x} cy={y} r={3} fill="#667eea" />
                    );
                  })}
                  <polyline
                    points={history.slice(-20).map((h, i, arr) => {
                      const maxScore = Math.max(...arr.map(a => a.score), 1);
                      const x = (i / (arr.length - 1 || 1)) * 380 + 10;
                      const y = 90 - (h.score / maxScore) * 70;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#667eea"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 8 }}>
                <div style={{ opacity: 0.7, fontWeight: 700 }}>Date</div>
                <div style={{ opacity: 0.7, fontWeight: 700, textAlign: 'right' }}>Score</div>
                {history.slice(0, 20).map((h, i) => (
                  <>
                    <div key={`d-${i}`}>{new Date(h.ts).toLocaleString()}</div>
                    <div key={`s-${i}`} style={{ textAlign: 'right', fontWeight: 700 }}>{h.score}</div>
                  </>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className={styles.actions}>
        {isOwnProfile ? (
          <Link href="/" className={styles.playBtn}>Play Again</Link>
        ) : (
          <Link href="/" className={styles.playBtn}>Back to Game</Link>
        )}
        <Link href="/leaderboard" className={styles.leaderboardBtn}>View Leaderboard</Link>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
