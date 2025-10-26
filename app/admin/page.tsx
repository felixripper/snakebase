"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import styles from "./Admin.module.css";
// Alt bölümleri tek çatı altında gösterebilmek için doğrudan sayfa bileşenlerini içe aktarıyoruz
import SettingsPage from "./settings/page";
import AdvancedSettings from "./settings-advanced/page";
import UICustomizationPage from "./ui-customization/page";

type GameConfig = {
  snakeSpeed: number;
  snakeColor: string;
  foodColor: string;
  backgroundColor: string;
  pointsPerFood: number;
  interfaceTitle: string;
};

type AdminTab = 'genel' | 'ayarlar' | 'gelismis' | 'ui';

function AdminInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Aktif sekme: URL ?tab=... ile kontrol edilebilir
  const initialTab = (searchParams.get('tab') as AdminTab) || 'genel';
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);

  const [config, setConfig] = useState<Partial<GameConfig>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Ayarlar yüklenemedi.");
        setIsLoading(false);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("Kaydediliyor...");
    try {
      const response = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage("Ayarlar başarıyla kaydedildi!");
      } else {
        throw new Error(result.message || "Bir hata oluştu.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Hata: ${error.message}`);
      } else {
        setMessage("Bilinmeyen bir hata oluştu.");
      }
    }
    setTimeout(() => setMessage(""), 3000);
  };

  // Sekme değiştir ve URL'i güncelle
  const goTab = (tab: AdminTab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    router.replace(url.pathname + '?' + url.searchParams.toString());
  };

  const handleLogout = async () => {
    await fetch('/api/logout');
    router.push('/login');
  };

  if (isLoading) {
    return <div className={styles.container}><h1>Yükleniyor...</h1></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Yönetim Paneli</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>Çıkış Yap</button>
      </div>

      {/* Sekmeler */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button
          onClick={() => goTab('genel')}
          style={tabStyle(activeTab === 'genel')}
        >
          ⚙️ Genel Ayarlar
        </button>
        <button
          onClick={() => goTab('ayarlar')}
          style={tabStyle(activeTab === 'ayarlar')}
        >
          🧩 Oyun Ayarları
        </button>
        <button
          onClick={() => goTab('gelismis')}
          style={tabStyle(activeTab === 'gelismis')}
        >
          🛠️ Gelişmiş
        </button>
        <button
          onClick={() => goTab('ui')}
          style={tabStyle(activeTab === 'ui')}
        >
          🎨 UI Özelleştirme
        </button>
      </div>

      {/* İçerik */}
      {activeTab === 'genel' && (
        <>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="interfaceTitle">Oyun Başlığı</label>
              <input type="text" id="interfaceTitle" name="interfaceTitle" value={config.interfaceTitle || ""} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="snakeSpeed">Yılan Hızı</label>
              <input type="number" id="snakeSpeed" name="snakeSpeed" value={config.snakeSpeed || 10} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="pointsPerFood">Yem Başına Puan</label>
              <input type="number" id="pointsPerFood" name="pointsPerFood" value={config.pointsPerFood || 10} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="snakeColor">Yılan Rengi</label>
              <input type="color" id="snakeColor" name="snakeColor" value={config.snakeColor || "#34C759"} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="foodColor">Yem Rengi</label>
              <input type="color" id="foodColor" name="foodColor" value={config.foodColor || "#FF3B30"} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="backgroundColor">Arkaplan Rengi</label>
              <input type="color" id="backgroundColor" name="backgroundColor" value={config.backgroundColor || "#000000"} onChange={handleInputChange} />
            </div>
            <button type="submit" className={styles.button}>Ayarları Kaydet</button>
          </form>
          {message && <p className={styles.message}>{message}</p>}
        </>
      )}

      {activeTab === 'ayarlar' && (
        <div style={{ background: 'transparent' }}>
          <SettingsPage />
        </div>
      )}

      {activeTab === 'gelismis' && (
        <div style={{ background: 'transparent' }}>
          <AdvancedSettings />
        </div>
      )}

      {activeTab === 'ui' && (
        <div style={{ background: 'transparent' }}>
          <UICustomizationPage />
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Yükleniyor...</div>}>
      <AdminInner />
    </Suspense>
  );
}

function tabStyle(active: boolean): React.CSSProperties {
  return {
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #334155',
    background: active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
    color: active ? '#fff' : '#e2e8f0',
    cursor: 'pointer',
    fontWeight: 600,
  };
}
