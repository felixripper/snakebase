"use client";

import { useState } from "react";
import { useEffect, useRef } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import styles from "./page.module.css";
import Leaderboard from "./_components/Leaderboard";
import Achievements from "./_components/Achievements";
import Tournaments from "./_components/Tournaments";
import DailyQuests from "./_components/DailyQuests";

// blockchain disabled for game-only mode (removed)

type TabType = 'game' | 'leaderboard' | 'achievements' | 'tournaments' | 'quests';

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('game');

  const { /* no blockchain */ } = { };

  // Notify Mini App readiness ASAP
  useEffect(() => {
    void sdk.actions.ready();
  }, []);

  // No on-chain bridging — the iframe will run in standalone mode and use server APIs only.

  // No transaction streaming.

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