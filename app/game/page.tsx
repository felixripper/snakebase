"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Temporarily disabled OnchainKit wallet
// import { ConnectWallet } from '@coinbase/onchainkit/wallet';
// Temporarily disabled UserContext
// import { useUser } from '../_contexts/UserContext';
import styles from "../page.module.css";

type TabType = 'game' | 'leaderboard' | 'profile' | 'settings';

export default function GamePage() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const pathname = usePathname();
  // Temporarily disabled user context
  // const { user, authenticated } = useUser();

  useEffect(() => {
    void sdk.actions.ready();
  }, []);

  // Send user info to iframe when loaded and authenticated
  // Temporarily disabled user registration
  // useEffect(() => {
  //   if (loaded && authenticated && user && iframeRef.current) {
  //     const message = {
  //       type: 'REGISTER_PLAYER',
  //       user: {
  //         id: user.id,
  //         username: user.username,
  //         walletAddress: user.walletAddress,
  //       }
  //     };
  //     iframeRef.current.contentWindow?.postMessage(message, '*');
  //   }
  // }, [loaded, authenticated, user]);

  const handleScoreSubmission = useCallback(async (score: number) => {
    // Temporarily disabled score submission
    // if (!user) return;

    // try {
    //   // Send status update to iframe
    //   if (iframeRef.current) {
    //     iframeRef.current.contentWindow?.postMessage({
    //       type: 'ONCHAIN_STATUS',
    //       message: 'Skor gönderiliyor...'
    //     }, '*');
    //   }

    //   // Submit score to API
    //   const response = await fetch('/api/score/submit', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       score,
    //       userId: user.id,
    //       walletAddress: user.walletAddress,
    //     }),
    //   });

    //   if (response.ok) {
    //     const result = await response.json();
    //     // Send success message to iframe
    //     if (iframeRef.current) {
    //       iframeRef.current.contentWindow?.postMessage({
    //         type: 'ONCHAIN_CONFIRMED',
    //         hash: result.transactionHash
    //       }, '*');
    //     }
    //   } else {
    //     throw new Error('Score submission failed');
    //   }
    // } catch (error) {
    //   console.error('Score submission error:', error);
    //   // Send error message to iframe
    //   if (iframeRef.current) {
    //     iframeRef.current.contentWindow?.postMessage({
    //       type: 'ONCHAIN_ERROR',
    //       message: 'Skor gönderilemedi'
    //     }, '*');
    //   }
    // }
    // }, [user]);
  }, []);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Accept messages from our iframe (same origin) or Farcaster domains
      const allowedOrigins = [
        window.location.origin,
        'https://farcaster.xyz',
        'https://client.farcaster.xyz',
        'https://warpcast.com',
        'https://client.warpcast.com'
      ];

      if (!allowedOrigins.includes(event.origin)) return;

      const { type, score } = event.data;

      if (type === 'SUBMIT_ONCHAIN_SCORE' && score) {
        // Handle on-chain score submission
        handleScoreSubmission(score);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleScoreSubmission]);

  // Poll iframe document.readyState as a fallback in case onLoad doesn't fire
  useEffect(() => {
    if (loaded) return;
    let id: number | null = null;
    const tryCheck = () => {
      const el = iframeRef.current;
      if (!el) return false;
      try {
        const doc = el.contentDocument || el.contentWindow?.document;
        if (doc && doc.readyState === 'complete') {
          setLoaded(true);
          return true;
        }
      } catch {
        // cross-origin or not ready yet
      }
      return false;
    };

    id = window.setInterval(() => {
      if (tryCheck() && id != null) {
        clearInterval(id);
      }
    }, 500);

    // cleanup
    return () => {
      if (id != null) clearInterval(id);
    };
  }, [loaded]);

  const tabs = [
    { id: 'game' as TabType, label: 'Game', path: '/game', icon: '🎮' },
    { id: 'leaderboard' as TabType, label: 'Leaderboard', path: '/leaderboard', icon: '🏆' },
    { id: 'profile' as TabType, label: 'Profile', path: '/profile', icon: '👤' },
    { id: 'settings' as TabType, label: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  const currentTab = pathname === '/game' ? 'game' : pathname.slice(1) as TabType;

  return (
    <div className={styles.container}>
      {/* Navigation Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Home
        </Link>
        <h1 className={styles.title}>Snakebase</h1>
        <div className={styles.walletSection}>
          {/* Temporarily disabled wallet connection */}
          {/* <ConnectWallet /> */}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabBar}>
        {tabs.map((tab) => (
          <Link key={tab.id} href={tab.path} className={styles.tabLink}>
            <button
              className={`${styles.tabButton} ${currentTab === tab.id ? styles.activeTab : ''}`}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          </Link>
        ))}
      </div>

      {/* Game Content */}
      <div className={styles.content}>
        <div className={styles.gameContainer}>
          {!loaded && !error && <div className={styles.loading}>Loading game...</div>}
          {error && <div className={styles.error}>Error loading game. Please refresh the page.</div>}
          <iframe
            ref={iframeRef}
            src="/static/eat-grow.html?autoStart=true"
            title="Eat & Grow"
            className={styles.frame}
            allow="accelerometer; fullscreen; camera; microphone; geolocation; autoplay; encrypted-media; gyroscope; magnetometer"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        </div>
      </div>
    </div>
  );
}