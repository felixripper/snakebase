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

  const handleNFTMinting = useCallback(async (score: number, imageBlob: Blob) => {
    try {
      // Send status update to iframe
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage({
          type: 'ONCHAIN_STATUS',
          message: 'NFT mintleniyor...'
        }, '*');
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', imageBlob, 'game-screenshot.png');
      formData.append('score', score.toString());

      // Upload image and mint NFT
      const response = await fetch('/api/upload-food-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        // Send success message to iframe
        if (iframeRef.current) {
          iframeRef.current.contentWindow?.postMessage({
            type: 'ONCHAIN_CONFIRMED',
            message: 'NFT başarıyla mintlendi!'
          }, '*');
        }
      } else {
        throw new Error('NFT minting failed');
      }
    } catch (error) {
      console.error('NFT minting error:', error);
      // Send error message to iframe
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage({
          type: 'ONCHAIN_ERROR',
          message: 'NFT mint edilemedi'
        }, '*');
      }
    }
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

      const { type, score, imageBlob } = event.data;

      if (type === 'SUBMIT_ONCHAIN_SCORE' && score) {
        // Handle on-chain score submission - temporarily disabled
        // handleScoreSubmission(score);
      }

      if (type === 'MINT_NFT' && score && imageBlob) {
        // Handle NFT minting
        handleNFTMinting(score, imageBlob);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleNFTMinting]);

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
    { id: 'game' as TabType, label: 'Oyun', path: '/game', icon: '🎮' },
    { id: 'leaderboard' as TabType, label: 'Liderlik', path: '/leaderboard', icon: '🏆' },
    { id: 'profile' as TabType, label: 'Profil', path: '/profile', icon: '👤' },
    { id: 'settings' as TabType, label: 'Ayarlar', path: '/settings', icon: '⚙️' },
  ];

  const currentTab = pathname === '/game' ? 'game' : pathname.slice(1) as TabType;

  return (
    <div className={styles.container}>
      {/* Navigation Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Ana Sayfa
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
        {/* Admin Link - sadece geliştirme ortamında göster */}
        {process.env.NODE_ENV === 'development' && (
          <Link href="/admin" className={styles.tabLink}>
            <button className={styles.tabButton}>
              <span className={styles.tabIcon}>🔧</span>
              <span className={styles.tabLabel}>Admin</span>
            </button>
          </Link>
        )}
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