"use client";

import Link from "next/link";
import { useState } from "react";
// Temporarily disabled OnchainKit wallet
// import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import styles from "../page.module.css";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    musicEnabled: false,
    notificationsEnabled: true,
    theme: 'dark',
    language: 'tr',
  });

  const handleSettingChange = (key: string, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
              className={`${styles.tabButton} ${tab.id === 'settings' ? styles.activeTab : ''}`}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          </Link>
        ))}
      </div>

      {/* Settings Content */}
      <div className={styles.content}>
        <div className={styles.settingsContainer}>
          <div className={styles.settingsHeader}>
            <h2 className={styles.settingsTitle}>
              <span className={styles.titleIcon}>⚙️</span>
              Settings
            </h2>
            <p className={styles.settingsSubtitle}>Customize your gaming experience</p>
          </div>

          {/* Audio Settings Card */}
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.groupTitle}>
                <span className={styles.groupIcon}>🔊</span>
                Sound & Music
              </h3>
              <p className={styles.groupDescription}>Sound effects and music settings</p>
            </div>

            <div className={styles.settingsList}>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <label className={styles.settingLabel}>Game Sounds</label>
                  <p className={styles.settingDescription}>Snake movements and scoring sounds</p>
                </div>
                <label className={styles.modernToggle}>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                  />
                  <span className={styles.toggleSlider}></span>
                  <span className={styles.toggleLabel}>
                    {settings.soundEnabled ? 'On' : 'Off'}
                  </span>
                </label>
              </div>

              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <label className={styles.settingLabel}>Background Music</label>
                  <p className={styles.settingDescription}>Music played during gameplay</p>
                </div>
                <label className={styles.modernToggle}>
                  <input
                    type="checkbox"
                    checked={settings.musicEnabled}
                    onChange={(e) => handleSettingChange('musicEnabled', e.target.checked)}
                  />
                  <span className={styles.toggleSlider}></span>
                  <span className={styles.toggleLabel}>
                    {settings.musicEnabled ? 'On' : 'Off'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.groupTitle}>
                <span className={styles.groupIcon}>🔔</span>
                Notifications
              </h3>
              <p className={styles.groupDescription}>Notification preferences</p>
            </div>

            <div className={styles.settingsList}>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <label className={styles.settingLabel}>Push Notifications</label>
                  <p className={settings.notificationsEnabled ? styles.settingDescription : styles.settingDescriptionDisabled}>
                    {settings.notificationsEnabled ? 'Receive notifications for new achievements and updates' : 'Notifications are disabled'}
                  </p>
                </div>
                <label className={styles.modernToggle}>
                  <input
                    type="checkbox"
                    checked={settings.notificationsEnabled}
                    onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                  />
                  <span className={styles.toggleSlider}></span>
                  <span className={styles.toggleLabel}>
                    {settings.notificationsEnabled ? 'On' : 'Off'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Appearance Card */}
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.groupTitle}>
                <span className={styles.groupIcon}>🎨</span>
                Appearance
              </h3>
              <p className={styles.groupDescription}>Theme and language settings</p>
            </div>

            <div className={styles.settingsList}>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <label className={styles.settingLabel}>Theme</label>
                  <p className={styles.settingDescription}>Application appearance</p>
                </div>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.modernSelect}
                    value={settings.theme}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                  >
                    <option value="dark">🌙 Dark</option>
                    <option value="light">☀️ Light</option>
                    <option value="auto">🔄 Auto</option>
                  </select>
                </div>
              </div>

              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <label className={styles.settingLabel}>Language</label>
                  <p className={styles.settingDescription}>Application language</p>
                </div>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.modernSelect}
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                  >
                    <option value="tr">🇹🇷 Turkish</option>
                    <option value="en">🇺🇸 English</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className={styles.actionsCard}>
            <div className={styles.actionsGrid}>
              <button className={styles.primaryButton}>
                <span className={styles.buttonIcon}>💾</span>
                Save
              </button>
              <button className={styles.secondaryButton}>
                <span className={styles.buttonIcon}>🔄</span>
                Reset to Defaults
              </button>
              <button className={styles.dangerButton}>
                <span className={styles.buttonIcon}>🗑️</span>
                Reset Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}