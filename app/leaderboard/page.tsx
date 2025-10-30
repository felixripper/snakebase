"use client";

import Link from "next/link";
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import styles from "../page.module.css";

export default function LeaderboardPage() {
  // Mock data - gerçek veriler API'den gelecek
  const leaderboard = [
    { rank: 1, username: "SnakeMaster", score: 15420, wallet: "0x1234...abcd" },
    { rank: 2, username: "YılanAvcısı", score: 14850, wallet: "0x5678...efgh" },
    { rank: 3, username: "GameKing", score: 14200, wallet: "0x9abc...ijkl" },
    { rank: 4, username: "SnakeQueen", score: 13890, wallet: "0xdef0...mnop" },
    { rank: 5, username: "PixelHunter", score: 13560, wallet: "0x1234...qrst" },
  ];

  return (
    <div className={styles.container}>
      {/* Navigation Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Snakebase</h1>
        <div className={styles.walletSection}>
          <ConnectWallet />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabBar}>
        {[
          { id: 'game', label: 'Oyun', path: '/', icon: '🎮' },
          { id: 'leaderboard', label: 'Liderlik', path: '/leaderboard', icon: '🏆' },
          { id: 'profile', label: 'Profil', path: '/profile', icon: '👤' },
          { id: 'settings', label: 'Ayarlar', path: '/settings', icon: '⚙️' },
        ].map((tab) => (
          <Link key={tab.id} href={tab.path} className={styles.tabLink}>
            <button
              className={`${styles.tabButton} ${tab.id === 'leaderboard' ? styles.activeTab : ''}`}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          </Link>
        ))}
      </div>

      {/* Leaderboard Content */}
      <div className={styles.content}>
        <div className={styles.leaderboardContainer}>
          <h2 className={styles.leaderboardTitle}>🏆 Liderlik Tablosu</h2>

          <div className={styles.leaderboardList}>
            {leaderboard.map((player) => (
              <div key={player.rank} className={styles.leaderboardItem}>
                <div className={styles.rank}>
                  {player.rank === 1 && '🥇'}
                  {player.rank === 2 && '🥈'}
                  {player.rank === 3 && '🥉'}
                  {player.rank > 3 && `#${player.rank}`}
                </div>
                <div className={styles.playerInfo}>
                  <div className={styles.username}>{player.username}</div>
                  <div className={styles.wallet}>{player.wallet}</div>
                </div>
                <div className={styles.score}>{player.score.toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className={styles.leaderboardFooter}>
            <p>Skorlarınız otomatik olarak kaydedilir ve güncellenir.</p>
          </div>
        </div>
      </div>
    </div>
  );
}