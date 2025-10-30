"use client";

import { useState, useEffect } from "react";
// Temporarily disabled OnchainKit wallet
// import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { SimpleConfig } from "@/lib/config-store";
import styles from "./page.module.css";

type AdminTab = 'basic' | 'presets';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('basic');
  const [config, setConfig] = useState<SimpleConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Config yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (response.ok) {
        alert('Ayarlar başarıyla kaydedildi!');
      } else {
        alert('Ayarlar kaydedilirken hata oluştu.');
      }
    } catch (error) {
      console.error('Config kaydedilirken hata:', error);
      alert('Ayarlar kaydedilirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (updates: Partial<SimpleConfig>) => {
    if (!config) return;
    setConfig({ ...config, ...updates });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Admin paneli yükleniyor...</div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Konfigürasyon yüklenemedi.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Navigation Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Snakebase Admin</h1>
        <div className={styles.walletSection}>
          {/* Temporarily disabled wallet connection */}
          {/* <ConnectWallet /> */}
        </div>
      </div>

      {/* Admin Navigation */}
      <div className={styles.adminNav}>
        {[
          { id: 'basic' as AdminTab, label: 'Temel Ayarlar', icon: '🎮' },
          { id: 'presets' as AdminTab, label: 'Hazır Ayarlar', icon: '⚙️' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`${styles.adminTab} ${activeTab === tab.id ? styles.activeAdminTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.adminTabIcon}>{tab.icon}</span>
            <span className={styles.adminTabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.adminContent}>
          {activeTab === 'basic' && (
            <BasicSettingsTab config={config} updateConfig={updateConfig} />
          )}
          {activeTab === 'presets' && (
            <PresetsTab config={config} updateConfig={updateConfig} />
          )}
        </div>

        {/* Save Button */}
        <div className={styles.saveSection}>
          <button
            className={styles.saveButton}
            onClick={saveConfig}
            disabled={saving}
          >
            {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Basic Settings Tab Component
function BasicSettingsTab({ config, updateConfig }: {
  config: SimpleConfig;
  updateConfig: (updates: Partial<SimpleConfig>) => void;
}) {
  return (
    <div className={styles.settingsSection}>
      <h2>🎮 Temel Oyun Ayarları</h2>

      <div className={styles.settingGroup}>
        <h3>Renkler</h3>
        <div className={styles.settingRow}>
          <label>Arka Plan Rengi:</label>
          <input
            type="color"
            value={config.backgroundColor}
            onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
          />
        </div>
        <div className={styles.settingRow}>
          <label>Yılan Rengi:</label>
          <input
            type="color"
            value={config.snakeColor}
            onChange={(e) => updateConfig({ snakeColor: e.target.value })}
          />
        </div>
        <div className={styles.settingRow}>
          <label>Yem Rengi:</label>
          <input
            type="color"
            value={config.foodColor}
            onChange={(e) => updateConfig({ foodColor: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>Oyun Mekaniği</h3>
        <div className={styles.settingRow}>
          <label>Yılan Hızı:</label>
          <input
            type="number"
            step="0.1"
            value={config.snakeSpeed}
            onChange={(e) => updateConfig({ snakeSpeed: parseFloat(e.target.value) })}
            min="0.5"
            max="10"
          />
        </div>
        <div className={styles.settingRow}>
          <label>Yem Başına Puan:</label>
          <input
            type="number"
            value={config.pointsPerFood}
            onChange={(e) => updateConfig({ pointsPerFood: parseInt(e.target.value) })}
            min="1"
            max="100"
          />
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>Arayüz</h3>
        <div className={styles.settingRow}>
          <label>Arayüz Başlığı:</label>
          <input
            type="text"
            value={config.interfaceTitle}
            onChange={(e) => updateConfig({ interfaceTitle: e.target.value })}
            placeholder="Oyun başlığı"
          />
        </div>
      </div>
    </div>
  );
}

// Presets Tab Component
function PresetsTab({ config: _config, updateConfig }: {
  config: SimpleConfig;
  updateConfig: (updates: Partial<SimpleConfig>) => void;
}) {
  const applyPreset = (preset: 'classic' | 'dark' | 'bright') => {
    const presets = {
      classic: {
        backgroundColor: '#000000',
        snakeColor: '#00ff00',
        foodColor: '#ff0000',
        snakeSpeed: 5,
        pointsPerFood: 10,
        interfaceTitle: 'Snake Game',
      },
      dark: {
        backgroundColor: '#1a1a1a',
        snakeColor: '#ffffff',
        foodColor: '#ff4444',
        snakeSpeed: 7,
        pointsPerFood: 15,
        interfaceTitle: 'Dark Snake',
      },
      bright: {
        backgroundColor: '#ffffff',
        snakeColor: '#000000',
        foodColor: '#ff8800',
        snakeSpeed: 3,
        pointsPerFood: 5,
        interfaceTitle: 'Bright Snake',
      },
    };

    updateConfig(presets[preset]);
  };

  return (
    <div className={styles.settingsSection}>
      <h2>⚙️ Hazır Ayarlar</h2>

      <div className={styles.presetsGrid}>
        <div className={styles.presetCard}>
          <h3>🎯 Klasik</h3>
          <p>Geleneksel Snake deneyimi</p>
          <button onClick={() => applyPreset('classic')} className={styles.presetButton}>
            Uygula
          </button>
        </div>

        <div className={styles.presetCard}>
          <h3>🌙 Koyu Tema</h3>
          <p>Modern koyu tema</p>
          <button onClick={() => applyPreset('dark')} className={styles.presetButton}>
            Uygula
          </button>
        </div>

        <div className={styles.presetCard}>
          <h3>☀️ Açık Tema</h3>
          <p>Temiz açık tema</p>
          <button onClick={() => applyPreset('bright')} className={styles.presetButton}>
            Uygula
          </button>
        </div>
      </div>
    </div>
  );
}