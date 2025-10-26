'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './Preview.module.css';

type PreviewMode = 'game' | 'leaderboard' | 'profile' | 'registration';

export default function Preview() {
  const [mode, setMode] = useState<PreviewMode>('game');
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [isLive, setIsLive] = useState(false);

  const loadConfig = useCallback(async () => {
    try {
      const endpoint = isLive ? '/api/full-config' : '/api/draft-config';
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Config load error:', error);
    }
  }, [isLive]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const publishToLive = async () => {
    if (!confirm('Taslak değişiklikleri canlıya almak istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch('/api/publish-config', {
        method: 'POST'
      });

      if (response.ok) {
        alert('✅ Değişiklikler başarıyla canlıya alındı!');
        setIsLive(true);
        loadConfig();
      } else {
        alert('❌ Canlıya alma başarısız oldu.');
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert('❌ Bir hata oluştu.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.modeSelector}>
          <button
            className={mode === 'game' ? styles.active : ''}
            onClick={() => setMode('game')}
          >
            🎮 Oyun
          </button>
          <button
            className={mode === 'leaderboard' ? styles.active : ''}
            onClick={() => setMode('leaderboard')}
          >
            🏆 Lider Tablosu
          </button>
          <button
            className={mode === 'profile' ? styles.active : ''}
            onClick={() => setMode('profile')}
          >
            👤 Profil
          </button>
          <button
            className={mode === 'registration' ? styles.active : ''}
            onClick={() => setMode('registration')}
          >
            📝 Kayıt
          </button>
        </div>

        <div className={styles.viewToggle}>
          <button
            className={!isLive ? styles.active : ''}
            onClick={() => setIsLive(false)}
          >
            📝 Taslak
          </button>
          <button
            className={isLive ? styles.active : ''}
            onClick={() => setIsLive(true)}
          >
            🌐 Canlı
          </button>
        </div>

        {!isLive && (
          <button className={styles.publishBtn} onClick={publishToLive}>
            🚀 Canlıya Al
          </button>
        )}
      </div>

      <div className={styles.preview}>
        {!config ? (
          <div className={styles.loading}>Yükleniyor...</div>
        ) : (
          <iframe
            src={
              mode === 'game'
                ? `/eat-grow.html${!isLive ? '?draft=1' : ''}`
                : mode === 'leaderboard'
                ? '/leaderboard'
                : mode === 'profile'
                ? '/profile'
                : '/register'
            }
            className={styles.iframe}
            title="Preview"
          />
        )}
      </div>

      <div className={styles.info}>
        <p>
          {isLive 
            ? '📍 Şu anda CANLI versiyonu görüntülüyorsunuz (kullanıcıların gördüğü)'
            : '📍 Şu anda TASLAK versiyonu görüntülüyorsunuz (sadece önizleme)'}
        </p>
      </div>
    </div>
  );
}
