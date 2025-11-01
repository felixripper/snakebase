"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWriteContract } from 'wagmi';
import { getConfig } from "../../lib/config";
import { GAME_CONTRACT_ADDRESS, GAME_CONTRACT_ABI } from "../../lib/contract";
import { useUser } from "../_contexts/UserContext";
import styles from "../page.module.css";

type TabType = 'game' | 'leaderboard' | 'profile' | 'settings';

export default function GamePage() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const pathname = usePathname();
  const { user, authenticated } = useUser();
  useEffect(() => {
    void sdk.actions.ready();
  }, []);

  // Send user info to iframe when loaded and authenticated
  useEffect(() => {
    if (loaded && authenticated && user && iframeRef.current) {
      const message = {
        type: 'REGISTER_PLAYER',
        user: {
          id: user.id,
          username: user.username,
          walletAddress: user.walletAddress,
        }
      };
      iframeRef.current.contentWindow?.postMessage(message, '*');
    }
  }, [loaded, authenticated, user]);

  const { writeContract, isPending, isSuccess, error: contractError } = useWriteContract();

  const handleNFTMinting = useCallback(async (score: number, imageBlob?: Blob) => {
    if (!user?.walletAddress) {
      console.error('No wallet address available for NFT minting');
      return;
    }

    try {
      // Check if contract is configured
      if (!GAME_CONTRACT_ADDRESS || GAME_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
        console.error('Contract not configured for NFT minting');
        return;
      }

      // For now, use submitScore instead of mintNFT since mintNFT doesn't exist in contract
      // TODO: Add mintNFT function to contract and update ABI
      writeContract({
        address: GAME_CONTRACT_ADDRESS as `0x${string}`,
        abi: GAME_CONTRACT_ABI,
        functionName: 'submitScore',
        args: [BigInt(score)],
      });

      console.log('Score submission initiated for NFT minting, score:', score);
    } catch (error) {
      console.error('NFT minting failed:', error);
    }
  }, [writeContract, user?.walletAddress]);

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
        // Handle on-chain score submission
        handleNFTMinting(score);
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
    { id: 'leaderboard' as TabType, label: 'Leaderboard', path: '/leaderboard', icon: '🏆' },
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
        {/* Admin Link - hidden */}
        {/* {process.env.NODE_ENV === 'development' && (
          <Link href="/admin" className={styles.tabLink}>
            <button className={styles.tabButton}>
              <span className={styles.tabIcon}>🔧</span>
              <span className={styles.tabLabel}>Admin</span>
            </button>
          </Link>
        )} */}
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