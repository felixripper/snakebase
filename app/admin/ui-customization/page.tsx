'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import FoodSettings from '../_components/FoodSettings';
import LeaderboardUISettings from '../_components/LeaderboardUISettings';
import Preview from '../_components/Preview';
import styles from './UICustomization.module.css';

type Tab = 'food' | 'leaderboard' | 'profile' | 'registration' | 'preview';

export default function UICustomizationPage() {
  const [activeTab, setActiveTab] = useState<Tab>('food');
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/draft-config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Config load error:', error);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/draft-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        alert('✅ Değişiklikler taslağa kaydedildi!');
      } else {
        alert('❌ Kaydetme başarısız oldu.');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (!config) {
    return <div className={styles.loading}>Yükleniyor...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>UI Özelleştirme</h1>
        <button 
          onClick={saveConfig} 
          disabled={saving}
          className={styles.saveBtn}
        >
          {saving ? 'Kaydediliyor...' : '💾 Taslağa Kaydet'}
        </button>
      </div>

      <div className={styles.tabs}>
        <button
          className={activeTab === 'food' ? styles.active : ''}
          onClick={() => setActiveTab('food')}
        >
          🍎 Yem Ayarları
        </button>
        <button
          className={activeTab === 'leaderboard' ? styles.active : ''}
          onClick={() => setActiveTab('leaderboard')}
        >
          🏆 Lider Tablosu
        </button>
        <button
          className={activeTab === 'profile' ? styles.active : ''}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profil Sayfası
        </button>
        <button
          className={activeTab === 'registration' ? styles.active : ''}
          onClick={() => setActiveTab('registration')}
        >
          📝 Kayıt Formu
        </button>
        <button
          className={activeTab === 'preview' ? styles.active : ''}
          onClick={() => setActiveTab('preview')}
        >
          👁️ Önizleme
        </button>
      </div>

      <div className={styles.content}>
        {(() => {
          if (activeTab === 'food' && config.foodIcon) {
            return (
              <FoodSettings
                config={config.foodIcon as any}
                onChange={(foodIcon) => setConfig({ ...config, foodIcon })}
              />
            );
          }
          if (activeTab === 'leaderboard' && config.leaderboardUI) {
            return (
              <LeaderboardUISettings
                config={config.leaderboardUI as any}
                onChange={(leaderboardUI) => setConfig({ ...config, leaderboardUI })}
              />
            );
          }
          if (activeTab === 'profile') {
            return (
              <div className={styles.comingSoon}>
                🚧 Profil sayfası özelleştirme yakında...
              </div>
            );
          }
          if (activeTab === 'registration') {
            return (
              <div className={styles.comingSoon}>
                🚧 Kayıt formu özelleştirme yakında...
              </div>
            );
          }
          if (activeTab === 'preview') {
            return <Preview />;
          }
          return null;
        })()}
      </div>
    </div>
  );
}
