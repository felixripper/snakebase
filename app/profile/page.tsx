"use client";

import Link from "next/link";
// Temporarily disabled OnchainKit wallet
// import { ConnectWallet } from '@coinbase/onchainkit/wallet';
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
      { id: 1, name: "First Game", icon: "🎮", unlocked: true },
      { id: 2, name: "High Score", icon: "🏆", unlocked: true },
      { id: 3, name: "Expert", icon: "⭐", unlocked: false },
    ],
  };

  return (
    <div className={styles.container}>
      {/* Navigation Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Snakebase</h1>
        <div className={styles.walletSection}>
          {/* Temporarily disabled wallet connection */}
          {/* <ConnectWallet /> */}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabBar}>
        {[
          { id: 'game', label: 'Play', path: '/', icon: '🎮' },
          { id: 'leaderboard', label: 'Leaderboard', path: '/leaderboard', icon: '🏆' },
          { id: 'profile', label: 'Profile', path: '/profile', icon: '👤' },
          { id: 'settings', label: 'Settings', path: '/settings', icon: '⚙️' },
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
          {/* Profile Header Card */}
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.avatarContainer}>
                <div className={styles.avatar}>
                  {user.avatar}
                </div>
                <div className={styles.avatarGlow}></div>
              </div>
              <div className={styles.profileInfo}>
                <h2 className={styles.username}>{user.username}</h2>
                <div className={styles.walletBadge}>
                  <span className={styles.walletIcon}>🔗</span>
                  <span className={styles.walletAddress}>
                    {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                  </span>
                </div>
                <div className={styles.rankBadge}>
                  <span className={styles.rankIcon}>#{user.stats.rank}</span>
                  <span className={styles.rankLabel}>Rank</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🎮</div>
              <div className={styles.statValue}>{user.stats.gamesPlayed}</div>
              <div className={styles.statLabel}>Games Played</div>
              <div className={styles.statProgress}>
                <div className={styles.progressBar} style={{width: '75%'}}></div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏆</div>
              <div className={styles.statValue}>{user.stats.bestScore.toLocaleString('en-US')}</div>
              <div className={styles.statLabel}>Best Score</div>
              <div className={styles.statProgress}>
                <div className={styles.progressBar} style={{width: '90%'}}></div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📊</div>
              <div className={styles.statValue}>{user.stats.totalScore.toLocaleString('en-US')}</div>
              <div className={styles.statLabel}>Total Score</div>
              <div className={styles.statProgress}>
                <div className={styles.progressBar} style={{width: '85%'}}></div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⭐</div>
              <div className={styles.statValue}>#{user.stats.rank}</div>
              <div className={styles.statLabel}>Global Rank</div>
              <div className={styles.statProgress}>
                <div className={styles.progressBar} style={{width: '60%'}}></div>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className={styles.achievementsCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🏅</span>
                Achievements
              </h3>
              <div className={styles.achievementStats}>
                {user.achievements.filter(a => a.unlocked).length}/{user.achievements.length} Unlocked
              </div>
            </div>
            <div className={styles.achievementsGrid}>
              {user.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`${styles.achievementCard} ${achievement.unlocked ? styles.unlocked : styles.locked}`}
                >
                  <div className={styles.achievementGlow}></div>
                  <div className={styles.achievementIcon}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </div>
                  <div className={styles.achievementName}>
                    {achievement.name}
                  </div>
                  {achievement.unlocked && (
                    <div className={styles.achievementBadge}>✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.actionsCard}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>⚡</span>
              Quick Actions
            </h3>
            <div className={styles.actionsGrid}>
              <button className={styles.actionButton}>
                <span className={styles.actionIcon}>🎮</span>
                <span>Play</span>
              </button>
              <button className={styles.actionButton}>
                <span className={styles.actionIcon}>🏆</span>
                <span>Leaderboard</span>
              </button>
              <button className={styles.actionButton}>
                <span className={styles.actionIcon}>⚙️</span>
                <span>Settings</span>
              </button>
              <button className={styles.actionButton}>
                <span className={styles.actionIcon}>📊</span>
                <span>Statistics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}