'use client';

import { useState } from 'react';
import styles from './FoodSettings.module.css';

interface FoodIconConfig {
  type: 'emoji' | 'image';
  value: string;
  size: number;
  animation: 'none' | 'pulse' | 'rotate' | 'bounce';
}

interface Props {
  config: FoodIconConfig;
  onChange: (config: FoodIconConfig) => void;
}

const EMOJI_OPTIONS = [
  '🍎', '🍕', '🍔', '🍰', '🍪', '🍩', '🍫', '🍬',
  '🍭', '🍮', '🍯', '🍓', '🍒', '🍑', '🍊', '🍋',
  '💎', '⭐', '🌟', '✨', '🎁', '🏆', '👑', '💰',
  '🔥', '⚡', '💫', '🌈', '🦄', '🐉', '🎮', '🎯'
];

const ANIMATION_OPTIONS = [
  { value: 'none', label: 'Animasyon Yok' },
  { value: 'pulse', label: 'Nabız (Pulse)' },
  { value: 'rotate', label: 'Döndür (Rotate)' },
  { value: 'bounce', label: 'Zıpla (Bounce)' }
];

export default function FoodSettings({ config, onChange }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleEmojiSelect = (emoji: string) => {
    onChange({
      ...config,
      type: 'emoji',
      value: emoji
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-food-image', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      onChange({
        ...config,
        type: 'image',
        value: data.url
      });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Resim yüklenemedi: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3>Yem İkonu Tipi</h3>
        <div className={styles.typeSelector}>
          <button
            className={config.type === 'emoji' ? styles.active : ''}
            onClick={() => onChange({ ...config, type: 'emoji', value: config.type === 'emoji' ? config.value : '🍎' })}
          >
            Emoji
          </button>
          <button
            className={config.type === 'image' ? styles.active : ''}
            onClick={() => onChange({ ...config, type: 'image' })}
          >
            Özel Resim
          </button>
        </div>
      </div>

      {config.type === 'emoji' ? (
        <div className={styles.section}>
          <h3>Emoji Seç</h3>
          <div className={styles.emojiGrid}>
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                className={`${styles.emojiBtn} ${config.value === emoji ? styles.selected : ''}`}
                onClick={() => handleEmojiSelect(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.section}>
          <h3>Resim Yükle</h3>
          <div className={styles.uploadSection}>
            {config.value && (
              <div className={styles.preview}>
                <img src={config.value} alt="Food icon" />
              </div>
            )}
            <label className={styles.uploadBtn}>
              {uploading ? 'Yükleniyor...' : 'Resim Seç'}
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
            <p className={styles.hint}>
              PNG, JPG, GIF veya WebP • Max 2MB
            </p>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h3>Yem Boyutu</h3>
        <div className={styles.sliderGroup}>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={config.size}
            onChange={(e) => onChange({ ...config, size: parseFloat(e.target.value) })}
          />
          <span className={styles.value}>{config.size.toFixed(1)}x</span>
        </div>
        <div className={styles.sizePreview}>
          <div style={{ fontSize: `${config.size * 32}px` }}>
            {config.type === 'emoji' ? config.value : (
              config.value ? <img src={config.value} alt="Preview" style={{ width: `${config.size * 32}px`, height: `${config.size * 32}px` }} /> : '🍎'
            )}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Animasyon</h3>
        <div className={styles.animationGrid}>
          {ANIMATION_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`${styles.animationBtn} ${config.animation === option.value ? styles.active : ''}`}
              onClick={() => onChange({ ...config, animation: option.value as FoodIconConfig['animation'] })}
            >
              <div className={`${styles.animPreview} ${styles[option.value]}`}>
                {config.type === 'emoji' ? config.value : '🍎'}
              </div>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
