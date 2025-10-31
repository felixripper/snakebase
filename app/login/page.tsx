"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import Link from "next/link";
import styles from "../page.module.css";

export default function LoginPage() {
  useEffect(() => {
    void sdk.actions.ready();
  }, []);

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
          <Link href="/leaderboard" className={styles.navLink}>Liderlik</Link>
          <Link href="/admin/login" className={styles.navLink}>Admin</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className={styles.simpleMain}>
        <div className={styles.simpleContent}>
          <div className={styles.simpleHero}>
            <h1 className={styles.simpleTitle}>
              Snakebase'e Hoş Geldiniz
            </h1>
            <p className={styles.simpleDescription}>
              Base ağında blockchain destekli yılan oyununu oynayın.
              Skorlarınızı kaydedin ve liderlik tablolarında yerinizi alın.
            </p>

            <div className={styles.simpleActions}>
              <Link href="/static/eat-grow.html" className={styles.primaryButton}>
                Oyunu Başlat
              </Link>
              <Link href="/leaderboard" className={styles.secondaryButton}>
                Liderlik Tablosu
              </Link>
            </div>
          </div>

          <div className={styles.simpleFeatures}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⛓️</span>
              <span>On-chain skorlar</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🏆</span>
              <span>Global liderlik</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⚡</span>
              <span>Anlık senkronizasyon</span>
            </div>
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