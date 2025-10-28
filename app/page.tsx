"use client";

import { useState } from "react";
import { useEffect, useRef } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import styles from "./page.module.css";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from "wagmi";
import Leaderboard from "./_components/Leaderboard";
import Achievements from "./_components/Achievements";
import Tournaments from "./_components/Tournaments";
import DailyQuests from "./_components/DailyQuests";

const LEADERBOARD_ABI = [
  {
    inputs: [{ name: "_score", type: "uint256" }],
    name: "submitScore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_username", type: "string" }],
    name: "registerPlayer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_player", type: "address" }],
    name: "isPlayerRegistered",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_GAME_CONTRACT as `0x${string}`) || "0x0000000000000000000000000000000000000000";

const blockchainEnabled = process.env.NEXT_PUBLIC_BLOCKCHAIN_ENABLED === 'true';

type TabType = 'game' | 'leaderboard' | 'achievements' | 'tournaments' | 'quests';

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('game');

  // Wagmi write + receipt tracking - always call hooks, conditionally use results
  const wagmiWriteContract = useWriteContract();
  const wagmiWaitForReceipt = useWaitForTransactionReceipt({ hash: wagmiWriteContract.data });
  const { address } = useAccount();

  const { data: hash, writeContract, isPending, error } = blockchainEnabled ? wagmiWriteContract : {};
  const { isLoading: isConfirming, isSuccess: isConfirmed } = blockchainEnabled ? wagmiWaitForReceipt : {};

  // Check if current user is registered
  const { data: isRegistered } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LEADERBOARD_ABI,
    functionName: "isPlayerRegistered",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
    },
  });

  // Notify Mini App readiness ASAP
  useEffect(() => {
    void sdk.actions.ready();
  }, []);

  // Bridge on-chain requests from the game (iframe) to the app wallet (wagmi)
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      console.log('Received message from iframe:', event.data);

      if (event.origin !== window.location.origin) {
        console.log('Ignoring message from different origin:', event.origin);
        return;
      }
      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "REGISTER_PLAYER") {
        const username = String(data.username || "");
        const child = iframeRef.current?.contentWindow;
        if (!child) return;

        if (!blockchainEnabled || !writeContract) {
          child.postMessage({ type: "ONCHAIN_ERROR", message: "Blockchain features disabled" }, window.location.origin);
          return;
        }

        if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
          child.postMessage({ type: "ONCHAIN_ERROR", message: "Contract not configured" }, window.location.origin);
          return;
        }

        if (!username.trim()) {
          child.postMessage({ type: "ONCHAIN_ERROR", message: "Username is required" }, window.location.origin);
          return;
        }

        try {
          child.postMessage({ type: "ONCHAIN_STATUS", message: "Registering player…" }, window.location.origin);
          writeContract({
            address: CONTRACT_ADDRESS,
            abi: LEADERBOARD_ABI,
            functionName: "registerPlayer",
            args: [username.trim()],
          });
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : "Unknown error";
          child.postMessage({ type: "ONCHAIN_ERROR", message }, window.location.origin);
        }
      }

      if (data.type === "NAVIGATE") {
        const path = String(data.path || "");
        console.log('Navigation request from iframe:', path);
        if (path && typeof window !== 'undefined') {
          window.location.href = path;
        }
      }

      if (data.type === "SUBMIT_ONCHAIN_SCORE") {
        const score = Number(data.score);
        const child = iframeRef.current?.contentWindow;
        if (!child) return;

        if (!blockchainEnabled || !writeContract) {
          child.postMessage({ type: "ONCHAIN_ERROR", message: "Blockchain features disabled" }, window.location.origin);
          return;
        }

        if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
          child.postMessage({ type: "ONCHAIN_ERROR", message: "Contract not configured" }, window.location.origin);
          return;
        }

        // Check if player is registered
        if (isRegistered === false) {
          child.postMessage({ type: "ONCHAIN_ERROR", message: "Please register first to submit scores on-chain" }, window.location.origin);
          // Redirect to profile page for registration
          window.location.href = "/profile";
          return;
        }

        try {
          child.postMessage({ type: "ONCHAIN_STATUS", message: "Requesting wallet confirmation…" }, window.location.origin);
          writeContract({
            address: CONTRACT_ADDRESS,
            abi: LEADERBOARD_ABI,
            functionName: "submitScore",
            args: [BigInt(score)],
          });
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : "Unknown error";
          child.postMessage({ type: "ONCHAIN_ERROR", message }, window.location.origin);
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [writeContract]);

  // Stream tx status back to the iframe
  useEffect(() => {
    const child = iframeRef.current?.contentWindow;
    if (!child) return;
    if (isPending) {
      child.postMessage({ type: "ONCHAIN_STATUS", message: "Waiting for wallet confirmation…" }, window.location.origin);
    }
    if (hash) {
      child.postMessage({ type: "ONCHAIN_HASH", hash }, window.location.origin);
    }
    if (isConfirming) {
      child.postMessage({ type: "ONCHAIN_STATUS", message: "Submitting score to blockchain…" }, window.location.origin);
    }
    if (isConfirmed) {
      child.postMessage({ type: "ONCHAIN_CONFIRMED" }, window.location.origin);
    }
    if (error) {
      const message = (error as unknown) && (error as Error).message ? (error as Error).message : "Transaction error";
      child.postMessage({ type: "ONCHAIN_ERROR", message }, window.location.origin);
    }
  }, [isPending, hash, isConfirming, isConfirmed, error]);

  const tabs = [
    { id: 'game' as TabType, label: '🎮 Oyun', icon: '🎮' },
    { id: 'leaderboard' as TabType, label: '🏆 Liderlik', icon: '🏆' },
    { id: 'achievements' as TabType, label: '🏅 Başarılar', icon: '🏅' },
    { id: 'tournaments' as TabType, label: '⚔️ Turnuvalar', icon: '⚔️' },
    { id: 'quests' as TabType, label: '📅 Görevler', icon: '📅' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'game':
        return (
          <div className={styles.gameContainer}>
            {!iframeLoaded && !iframeError && (
              <div className={styles.loading}>
                Oyun yükleniyor...
              </div>
            )}
            {iframeError && (
              <div className={styles.error}>
                Oyun yüklenirken hata oluştu. Lütfen sayfayı yenileyin.
              </div>
            )}
            <iframe
              ref={iframeRef}
              src="/eat-grow.html"
              title="Eat & Grow"
              className={styles.frame}
              allow="accelerometer; fullscreen; camera; microphone; geolocation; autoplay; encrypted-media; gyroscope; magnetometer"
              onLoad={() => {
                console.log('Iframe loaded successfully');
                setIframeLoaded(true);
              }}
              onError={() => {
                console.log('Iframe failed to load');
                setIframeError(true);
              }}
            />
          </div>
        );
      case 'leaderboard':
        return <Leaderboard />;
      case 'achievements':
        return <Achievements />;
      case 'tournaments':
        return <Tournaments />;
      case 'quests':
        return <DailyQuests />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabBar}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {renderTabContent()}
      </div>
    </div>
  );
}