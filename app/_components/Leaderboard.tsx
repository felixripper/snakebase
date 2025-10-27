"use client";

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import styles from './Leaderboard.module.css';

// Contract ABI - sadece gerekli fonksiyonlar
const LEADERBOARD_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "_limit", type: "uint256" }],
    name: "getTopPlayers",
    outputs: [
      {
        components: [
          { internalType: "address", name: "playerAddress", type: "address" },
          { internalType: "string", name: "username", type: "string" },
          { internalType: "uint256", name: "score", type: "uint256" },
          { internalType: "uint256", name: "rank", type: "uint256" }
        ],
        internalType: "struct SnakeGameLeaderboard.LeaderboardEntry[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getTotalPlayers",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_player", type: "address" }],
    name: "getPlayerRank",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_player", type: "address" }],
    name: "getPlayer",
    outputs: [
      {
        components: [
          { internalType: "address", name: "playerAddress", type: "address" },
          { internalType: "string", name: "username", type: "string" },
          { internalType: "uint256", name: "highScore", type: "uint256" },
          { internalType: "uint256", name: "totalGames", type: "uint256" },
          { internalType: "uint256", name: "totalScore", type: "uint256" },
          { internalType: "uint256", name: "firstPlayedAt", type: "uint256" },
          { internalType: "uint256", name: "lastPlayedAt", type: "uint256" },
          { internalType: "bool", name: "isRegistered", type: "bool" }
        ],
        internalType: "struct SnakeGameLeaderboard.Player",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

import { GAME_CONTRACT_ADDRESS } from '@/lib/contract';

// Contract address - deploy sonrası güncellenecek
const CONTRACT_ADDRESS = GAME_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

type LeaderboardEntry = {
  playerAddress: string;
  username: string;
  score: bigint;
  rank: bigint;
};

export default function Leaderboard() {
  const blockchainEnabled = process.env.NEXT_PUBLIC_BLOCKCHAIN_ENABLED === 'true';
  const { address, isConnected } = useAccount();
  const [displayCount, setDisplayCount] = useState(10);

  if (!blockchainEnabled) {
    return (
      <div className={styles.container}>
        <div className={styles.notice}>
          🔒 Blockchain özelliği kapalı. Lider tablosunu görmek için NEXT_PUBLIC_BLOCKCHAIN_ENABLED=true olarak ayarlayın.
        </div>
      </div>
    );
  }

  // Top players data
  const { data: topPlayers, isLoading: loadingPlayers, refetch: refetchLeaderboard } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LEADERBOARD_ABI,
    functionName: 'getTopPlayers',
    args: [BigInt(displayCount)],
    query: {
      enabled: CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
    }
  });

  // Total players count
  const { data: totalPlayers } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LEADERBOARD_ABI,
    functionName: 'getTotalPlayers',
    query: {
      enabled: CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
    }
  });

  // Current user's rank
  const { data: userRank } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LEADERBOARD_ABI,
    functionName: 'getPlayerRank',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
    }
  });

  // Current user's data
  const { data: userData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LEADERBOARD_ABI,
    functionName: 'getPlayer',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
    }
  });

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchLeaderboard();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetchLeaderboard]);

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  if (CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
    return (
      <div className={styles.container}>
        <div className={styles.notice}>
          📝 Leaderboard contract henüz deploy edilmedi. Lütfen .env dosyasında NEXT_PUBLIC_LEADERBOARD_CONTRACT adresini ayarlayın.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>🏆 Lider Tablosu</h2>
        <div className={styles.stats}>
          <span>Toplam Oyuncu: <strong>{totalPlayers?.toString() || '0'}</strong></span>
          {isConnected && userData?.isRegistered && userRank && (
            <span>Sıralaman: <strong>{getRankEmoji(Number(userRank))}</strong></span>
          )}
        </div>
      </div>

      {isConnected && userData?.isRegistered && (
        <div className={styles.userCard}>
          <div className={styles.userInfo}>
            <div className={styles.username}>👤 {userData.username}</div>
            <div className={styles.userStats}>
              <span>En Yüksek: <strong>{userData.highScore.toString()}</strong></span>
              <span>Toplam Oyun: <strong>{userData.totalGames.toString()}</strong></span>
              <span>Ortalama: <strong>{Number(userData.totalGames) > 0 ? (Number(userData.totalScore) / Number(userData.totalGames)).toFixed(0) : '0'}</strong></span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.controls}>
        <select 
          value={displayCount} 
          onChange={(e) => setDisplayCount(Number(e.target.value))}
          className={styles.select}
        >
          <option value={10}>Top 10</option>
          <option value={25}>Top 25</option>
          <option value={50}>Top 50</option>
          <option value={100}>Top 100</option>
        </select>
        <button onClick={() => refetchLeaderboard()} className={styles.refreshBtn}>
          🔄 Yenile
        </button>
      </div>

      {loadingPlayers ? (
        <div className={styles.loading}>Yükleniyor...</div>
      ) : !topPlayers || topPlayers.length === 0 ? (
        <div className={styles.empty}>
          <p>Henüz kayıtlı oyuncu yok.</p>
          <p>İlk oyuncu sen ol! 🎮</p>
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div className={styles.colRank}>Sıra</div>
            <div className={styles.colPlayer}>Oyuncu</div>
            <div className={styles.colScore}>Puan</div>
          </div>
          {(topPlayers as unknown as LeaderboardEntry[]).map((player, index) => {
            const isCurrentUser = isConnected && address && player.playerAddress.toLowerCase() === address.toLowerCase();
            return (
              <div 
                key={player.playerAddress} 
                className={`${styles.row} ${isCurrentUser ? styles.highlighted : ''} ${index < 3 ? styles.topThree : ''}`}
              >
                <div className={styles.colRank}>
                  <span className={styles.rankBadge}>
                    {getRankEmoji(Number(player.rank))}
                  </span>
                </div>
                <div className={styles.colPlayer}>
                  <div className={styles.playerInfo}>
                    <span className={styles.playerName}>
                      {player.username}
                      {isCurrentUser && <span className={styles.youBadge}>SEN</span>}
                    </span>
                    <span className={styles.playerAddress}>
                      {player.playerAddress.slice(0, 6)}...{player.playerAddress.slice(-4)}
                    </span>
                  </div>
                </div>
                <div className={styles.colScore}>
                  <span className={styles.scoreValue}>{player.score.toString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
