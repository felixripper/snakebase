"use client";

import Link from "next/link";
import { useState } from "react";
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
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
          <ConnectWallet />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabBar}>
        {[
          { id: 'game', label: 'Oyun', path: '/', icon: '🎮' },
          { id: 'leaderboard', label: 'Liderlik', path: '/leaderboard', icon: '🏆' },
          { id: 'profile', label: 'Profil', path: '/profile', icon: '👤' },
          { id: 'settings', label: 'Ayarlar', path: '/settings', icon: '⚙️' },
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
          <h2 className={styles.settingsTitle}>⚙️ Ayarlar</h2>

          <div className={styles.settingsGroup}>
            <h3 className={styles.groupTitle}>Ses & Müzik</h3>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label className={styles.settingLabel}>Oyun Sesleri</label>
                <p className={styles.settingDescription}>Yılan hareketleri ve puan sesleri</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label className={styles.settingLabel}>Arka Plan Müziği</label>
                <p className={styles.settingDescription}>Oyun sırasında çalan müzik</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.musicEnabled}
                  onChange={(e) => handleSettingChange('musicEnabled', e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          </div>

          <div className={styles.settingsGroup}>
            <h3 className={styles.groupTitle}>Bildirimler</h3>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label className={styles.settingLabel}>Bildirimler</label>
                <p className={settings.notificationsEnabled ? styles.settingDescription : styles.settingDescriptionDisabled}>
                  {settings.notificationsEnabled ? 'Yeni başarılar ve güncellemeler için bildirim alın' : 'Bildirimler devre dışı'}
                </p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          </div>

          <div className={styles.settingsGroup}>
            <h3 className={styles.groupTitle}>Görünüm</h3>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label className={styles.settingLabel}>Tema</label>
                <p className={styles.settingDescription}>Uygulama görünümü</p>
              </div>
              <select
                className={styles.select}
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
              >
                <option value="dark">Koyu</option>
                <option value="light">Açık</option>
                <option value="auto">Otomatik</option>
              </select>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label className={styles.settingLabel}>Dil</label>
                <p className={styles.settingDescription}>Uygulama dili</p>
              </div>
              <select
                className={styles.select}
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div className={styles.settingsActions}>
            <button className={styles.saveButton}>Kaydet</button>
            <button className={styles.resetButton}>Varsayılanlara Dön</button>
          </div>
        </div>
      </div>
    </div>
  );
}