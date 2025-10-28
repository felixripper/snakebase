'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import styles from './Achievements.module.css';

const LEADERBOARD_ABI = [
  {
    inputs: [{ name: '_player', type: 'address' }],
    name: 'getPlayerAchievements',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '', type: 'uint256' }],
    name: 'achievements',
    outputs: [
      { name: 'id', type: 'uint256' },
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'rewardTokens', type: 'uint256' },
      { name: 'active', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const ACHIEVEMENT_DATA = [
  { id: 1, name: 'İlk Adım', description: 'İlk oyununu oynadın!', icon: '🎯', reward: 10 },
  { id: 2, name: 'Skor Avcısı', description: '100 puan üstü skor yaptın!', icon: '🏆', reward: 25 },
  { id: 3, name: 'Uzman', description: '500 puan üstü skor yaptın!', icon: '⭐', reward: 50 },
  { id: 4, name: 'Şampiyon', description: '1000 puan üstü skor yaptın!', icon: '👑', reward: 100 },
  { id: 5, name: 'Günlük Aktif', description: '7 gün üst üste oynadın!', icon: '🔥', reward: 75 },
  { id: 6, name: 'Sosyal', description: 'Skorunu 10 kez paylaştın!', icon: '📢', reward: 30 },
];

interface AchievementProps {
  id: number;
  name: string;
  description: string;
  icon: string;
  reward: number;
  unlocked: boolean;
}

function AchievementCard({ id: _id, name, description, icon, reward, unlocked }: AchievementProps) {
  return (
    <div className={`${styles.achievement} ${unlocked ? styles.unlocked : styles.locked}`}>
      <div className={styles.icon}>
        {unlocked ? icon : '🔒'}
      </div>
      <div className={styles.content}>
        <h3>{name}</h3>
        <p>{description}</p>
        <div className={styles.reward}>
          <span className={styles.tokenIcon}>🪙</span>
          {reward} Token
        </div>
      </div>
      {unlocked && <div className={styles.checkmark}>✓</div>}
    </div>
  );
}

export default function Achievements() {
  const { address } = useAccount();
  const [unlockedAchievements, setUnlockedAchievements] = useState<number[]>([]);

  const { data: playerAchievements } = useReadContract({
    address: process.env.NEXT_PUBLIC_GAME_CONTRACT as `0x${string}`,
    abi: LEADERBOARD_ABI,
    functionName: 'getPlayerAchievements',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (playerAchievements) {
      setUnlockedAchievements(playerAchievements.map((id: bigint) => Number(id)));
    }
  }, [playerAchievements]);

  const isUnlocked = (id: number) => unlockedAchievements.includes(id);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>🏆 Başarımlar</h2>
        <p>Oyun oynayarak yeni başarımlar kazan ve token ödülleri topla!</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{unlockedAchievements.length}</span>
          <span className={styles.statLabel}>Kazanılan</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{ACHIEVEMENT_DATA.length - unlockedAchievements.length}</span>
          <span className={styles.statLabel}>Kalan</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>
            {ACHIEVEMENT_DATA.reduce((sum, achievement) =>
              isUnlocked(achievement.id) ? sum + achievement.reward : sum, 0
            )}
          </span>
          <span className={styles.statLabel}>Token Kazanıldı</span>
        </div>
      </div>

      <div className={styles.achievementsGrid}>
        {ACHIEVEMENT_DATA.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            {...achievement}
            unlocked={isUnlocked(achievement.id)}
          />
        ))}
      </div>
    </div>
  );
}