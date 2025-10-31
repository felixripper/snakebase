"use client";

import Link from "next/link";
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
    <div className={styles.simpleContainer}>
      {/* Simple Header */}
      <header className={styles.simpleHeader}>
        <div className={styles.simpleLogo}>
          <span className={styles.logoIcon}>🐍</span>
          <span className={styles.logoText}>Snakebase</span>
        </div>
        <nav className={styles.simpleNav}>
          <Link href="/static/eat-grow.html" className={styles.navLink}>Oyna</Link>
          <Link href="/profile" className={styles.navLink}>Profil</Link>
          <Link href="/admin/login" className={styles.navLink}>Admin</Link>
        </nav>
      </header>

      {/* Leaderboard Content */}
      <main className={styles.simpleMain}>
        <div className={styles.simpleContent}>
          <div className={styles.leaderboardHero}>
            <h1 className={styles.simpleTitle}>
              🏆 Liderlik Tablosu
            </h1>
            <p className={styles.simpleDescription}>
              En yüksek skorları yapan oyuncuları görün. Siz de listenin başında yer almak için oynayın!
            </p>
          </div>

          <div className={styles.leaderboardCard}>
            <div className={styles.leaderboardList}>
              {leaderboard.map((player) => (
                <div key={player.rank} className={`${styles.leaderboardItem} ${player.rank <= 3 ? styles.topPlayer : ''}`}>
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
                  <div className={styles.score}>{player.score.toLocaleString('en-US')}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.leaderboardActions}>
            <Link href="/static/eat-grow.html" className={styles.primaryButton}>
              Oyunu Başlat
            </Link>
            <Link href="/profile" className={styles.secondaryButton}>
              Profilimi Görüntüle
            </Link>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className={styles.simpleFooter}>
        <div className={styles.footerLinks}>
          <Link href="/about">Hakkında</Link>
          <Link href="/privacy">Gizlilik</Link>
          <Link href="/terms">Şartlar</Link>
        </div>
        <div className={styles.footerText}>
          Built on Base ⚡
        </div>
      </footer>
    </div>
  );
}