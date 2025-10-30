"use client";

import Link from "next/link";
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import styles from "../page.module.css";

export default function ProfilePage() {
  // Mock user data - gerçek veriler context'ten gelecek
  const user = {
    username: "SnakePlayer",
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    avatar: "👤",
    stats: {
      gamesPlayed: 42,
      bestScore: 15420,
      totalScore: 285690,
      rank: 5,
    },
    achievements: [
      { id: 1, name: "İlk Oyun", icon: "🎮", unlocked: true },
      { id: 2, name: "Yüksek Skor", icon: "🏆", unlocked: true },
      { id: 3, name: "Uzman", icon: "⭐", unlocked: false },
    ],
  };

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
              className={`${styles.tabButton} ${tab.id === 'profile' ? styles.activeTab : ''}`}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          </Link>
        ))}
      </div>

      {/* Profile Content */}
      <div className={styles.content}>
        <div className={styles.profileContainer}>
          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              {user.avatar}
            </div>
            <div className={styles.profileInfo}>
              <h2 className={styles.username}>{user.username}</h2>
              <p className={styles.walletAddress}>
                {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{user.stats.gamesPlayed}</div>
              <div className={styles.statLabel}>Oyun Sayısı</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{user.stats.bestScore.toLocaleString()}</div>
              <div className={styles.statLabel}>En Yüksek Skor</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{user.stats.totalScore.toLocaleString()}</div>
              <div className={styles.statLabel}>Toplam Skor</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>#{user.stats.rank}</div>
              <div className={styles.statLabel}>Sıralama</div>
            </div>
          </div>

          {/* Achievements */}
          <div className={styles.achievementsSection}>
            <h3 className={styles.sectionTitle}>Başarılar</h3>
            <div className={styles.achievementsGrid}>
              {user.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`${styles.achievementCard} ${achievement.unlocked ? styles.unlocked : styles.locked}`}
                >
                  <div className={styles.achievementIcon}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </div>
                  <div className={styles.achievementName}>
                    {achievement.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}