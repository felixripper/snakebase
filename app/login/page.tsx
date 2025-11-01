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
          <Link href="/static/eat-grow.html" className={styles.navLink}>Play</Link>
          <Link href="/leaderboard" className={styles.navLink}>Leaderboard</Link>
          {/* <Link href="/admin/login" className={styles.navLink}>Admin</Link> */}
        </nav>
      </header>

      {/* Main Content */}
      <main className={styles.simpleMain}>
        <div className={styles.simpleContent}>
          <div className={styles.simpleHero}>
            <h1 className={styles.simpleTitle}>
              Welcome to Snakebase
            </h1>
            <p className={styles.simpleDescription}>
              Play the blockchain-powered Snake game on Base network.
              Save your scores and claim your place on the leaderboards.
            </p>

            <div className={styles.simpleActions}>
              <Link href="/static/eat-grow.html" className={styles.primaryButton}>
                Start Game
              </Link>
              <Link href="/leaderboard" className={styles.secondaryButton}>
                Leaderboard
              </Link>
            </div>
          </div>

          <div className={styles.simpleFeatures}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⛓️</span>
              <span>On-chain scores</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🏆</span>
              <span>Global leaderboard</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⚡</span>
              <span>Real-time sync</span>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className={styles.simpleFooter}>
        <div className={styles.footerLinks}>
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <div className={styles.footerText}>
          Built on Base ⚡
        </div>
      </footer>
    </div>
  );
}