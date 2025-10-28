'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import styles from './DailyQuests.module.css';

const LEADERBOARD_ABI = [
  {
    inputs: [{ name: '_player', type: 'address' }],
    name: 'getPlayerDailyQuests',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '', type: 'uint256' }],
    name: 'dailyQuests',
    outputs: [
      { name: 'id', type: 'uint256' },
      { name: 'description', type: 'string' },
      { name: 'targetScore', type: 'uint256' },
      { name: 'rewardTokens', type: 'uint256' },
      { name: 'active', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_player', type: 'address' }],
    name: 'getPlayerStreak',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_questId', type: 'uint256' }],
    name: 'completeDailyQuest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

interface DailyQuest {
  id: bigint;
  description: string;
  targetScore: bigint;
  rewardTokens: bigint;
  active: boolean;
}

const QUEST_DATA = [
  { id: 1, description: '50 puan üstü skor yap', targetScore: 50, reward: 5, icon: '🎯' },
  { id: 2, description: '100 puan üstü skor yap', targetScore: 100, reward: 10, icon: '🏆' },
  { id: 3, description: '200 puan üstü skor yap', targetScore: 200, reward: 20, icon: '⭐' },
  { id: 4, description: 'Skorunu paylaş', targetScore: 0, reward: 5, icon: '📢' },
  { id: 5, description: 'Arkadaşını davet et', targetScore: 0, reward: 15, icon: '👥' },
];

function QuestCard({ quest, completed, onComplete }: {
  quest: DailyQuest;
  completed: boolean;
  onComplete: (id: bigint) => void;
}) {
  const { writeContract, isPending } = useWriteContract();

  const handleComplete = () => {
    if (completed) return;

    writeContract({
      address: process.env.NEXT_PUBLIC_GAME_CONTRACT as `0x${string}`,
      abi: LEADERBOARD_ABI,
      functionName: 'completeDailyQuest',
      args: [quest.id],
    });
  };

  return (
    <div className={`${styles.questCard} ${completed ? styles.completed : styles.pending}`}>
      <div className={styles.icon}>
        {completed ? '✅' : QUEST_DATA.find(q => q.id === Number(quest.id))?.icon || '🎯'}
      </div>
      <div className={styles.content}>
        <h4>{quest.description}</h4>
        <div className={styles.reward}>
          <span className={styles.tokenIcon}>🪙</span>
          {Number(quest.rewardTokens)} Token
        </div>
      </div>
      {!completed && (
        <button
          className={styles.completeButton}
          onClick={handleComplete}
          disabled={isPending}
        >
          {isPending ? 'Tamamlanıyor...' : 'Tamamla'}
        </button>
      )}
    </div>
  );
}

export default function DailyQuests() {
  const { address } = useAccount();
  const [completedQuests, setCompletedQuests] = useState<bigint[]>([]);
  const [streak, setStreak] = useState<bigint>(0n);

  const { data: playerQuests } = useReadContract({
    address: process.env.NEXT_PUBLIC_GAME_CONTRACT as `0x${string}`,
    abi: LEADERBOARD_ABI,
    functionName: 'getPlayerDailyQuests',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: playerStreak } = useReadContract({
    address: process.env.NEXT_PUBLIC_GAME_CONTRACT as `0x${string}`,
    abi: LEADERBOARD_ABI,
    functionName: 'getPlayerStreak',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (playerQuests) {
      setCompletedQuests(playerQuests as bigint[]);
    }
  }, [playerQuests]);

  useEffect(() => {
    if (playerStreak) {
      setStreak(playerStreak as bigint);
    }
  }, [playerStreak]);

  const isCompleted = (id: bigint) => completedQuests.includes(id);

  const completedCount = QUEST_DATA.filter(quest => isCompleted(BigInt(quest.id))).length;
  const totalReward = QUEST_DATA.reduce((sum, quest) =>
    isCompleted(BigInt(quest.id)) ? sum + quest.reward : sum, 0
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>📅 Günlük Görevler</h2>
        <p>Günlük görevleri tamamlayarak token kazan ve seri oluştur!</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{completedCount}</span>
          <span className={styles.statLabel}>Tamamlanan</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{QUEST_DATA.length - completedCount}</span>
          <span className={styles.statLabel}>Kalan</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{Number(streak)}</span>
          <span className={styles.statLabel}>Gün Serisi</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{totalReward}</span>
          <span className={styles.statLabel}>Token Kazanıldı</span>
        </div>
      </div>

      <div className={styles.questsList}>
        {QUEST_DATA.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={{
              id: BigInt(quest.id),
              description: quest.description,
              targetScore: BigInt(quest.targetScore),
              rewardTokens: BigInt(quest.reward),
              active: true,
            }}
            completed={isCompleted(BigInt(quest.id))}
            onComplete={() => {}}
          />
        ))}
      </div>

      {completedCount === QUEST_DATA.length && (
        <div className={styles.congratulations}>
          <h3>🎉 Tebrikler!</h3>
          <p>Bütün günlük görevleri tamamladın! Yarın yeni görevler seni bekliyor olacak.</p>
        </div>
      )}
    </div>
  );
}