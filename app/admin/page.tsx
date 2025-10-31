"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type AdminTab = 'gameplay' | 'appearance' | 'typography' | 'theme' | 'buttons' | 'presets' | 'data' | 'content';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('gameplay');
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clearingData, setClearingData] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/check');
      if (!response.ok) {
        router.push('/admin/login');
        return;
      }
      setAuthChecked(true);
      loadConfig();
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    }
  };

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/full-config');
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
      const response = await fetch('/api/full-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Error saving settings.');
      }
    } catch (error) {
      console.error('Config kaydedilirken hata:', error);
      alert('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  const clearTestData = async () => {
    if (!confirm('This will delete all test data. Are you sure?')) return;

    setClearingData(true);
    try {
      const response = await fetch('/api/clear-data', {
        method: 'POST',
      });
      if (response.ok) {
        alert('Test data cleared successfully!');
      } else {
        alert('Error clearing data.');
      }
    } catch (error) {
      console.error('Veri temizlenirken hata:', error);
      alert('Error clearing data.');
    } finally {
      setClearingData(false);
    }
  };

  const updateConfig = (updates: any) => {
    if (!config) return;
    setConfig({ ...config, ...updates });
  };

  const updateNestedConfig = (path: string[], value: any) => {
    if (!config) return;
    const newConfig = { ...config };
    let current = newConfig;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setConfig(newConfig);
  };

  if (!authChecked || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading admin panel...</div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Configuration could not be loaded.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Navigation Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Snakebase Admin Paneli</h1>
        <div className={styles.headerActions}>
          <button
            className={styles.clearDataButton}
            onClick={clearTestData}
            disabled={clearingData}
          >
            {clearingData ? 'Temizleniyor...' : 'Test Verilerini Temizle'}
          </button>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className={styles.adminNav}>
        {[
          { id: 'gameplay' as AdminTab, label: 'Game Mechanics', icon: '🎮' },
          { id: 'appearance' as AdminTab, label: 'Appearance', icon: '🎨' },
          { id: 'typography' as AdminTab, label: 'Typography', icon: '📝' },
          { id: 'theme' as AdminTab, label: 'Theme', icon: '🎭' },
          { id: 'buttons' as AdminTab, label: 'Buttons', icon: '🔘' },
          { id: 'content' as AdminTab, label: 'Page Content', icon: '📄' },
          { id: 'presets' as AdminTab, label: 'Preset Themes', icon: '⚙️' },
          { id: 'data' as AdminTab, label: 'Data Management', icon: '🗃️' },
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
          {activeTab === 'gameplay' && (
            <GameplayTab config={config} updateNestedConfig={updateNestedConfig} />
          )}
          {activeTab === 'appearance' && (
            <AppearanceTab config={config} updateNestedConfig={updateNestedConfig} />
          )}
          {activeTab === 'typography' && (
            <TypographyTab config={config} updateNestedConfig={updateNestedConfig} />
          )}
          {activeTab === 'theme' && (
            <ThemeTab config={config} updateNestedConfig={updateNestedConfig} />
          )}
          {activeTab === 'buttons' && (
            <ButtonsTab config={config} updateNestedConfig={updateNestedConfig} />
          )}
          {activeTab === 'content' && (
            <ContentTab config={config} updateNestedConfig={updateNestedConfig} />
          )}
          {activeTab === 'presets' && (
            <PresetsTab config={config} updateConfig={updateConfig} />
          )}
          {activeTab === 'data' && (
            <DataTab clearTestData={clearTestData} clearingData={clearingData} />
          )}
        </div>

        {/* Save Button */}
        <div className={styles.saveSection}>
          <button
            className={styles.saveButton}
            onClick={saveConfig}
            disabled={saving}
          >
            {saving ? 'Kaydediliyor...' : 'Tüm Ayarları Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Gameplay Tab Component
function GameplayTab({ config, updateNestedConfig }: {
  config: any;
  updateNestedConfig: (path: string[], value: any) => void;
}) {
  return (
    <div className={styles.settingsSection}>
      <h2>🎮 Oyun Mekaniği Ayarları</h2>

      <div className={styles.settingGroup}>
        <h3>Oyun Alanı</h3>
        <div className={styles.settingRow}>
          <label>Grid Boyutu:</label>
          <input
            type="number"
            value={config.gameplay?.gridSize || 30}
            onChange={(e) => updateNestedConfig(['gameplay', 'gridSize'], parseInt(e.target.value))}
            min="20"
            max="50"
          />
        </div>
        <div className={styles.settingRow}>
          <label>Sütun Sayısı:</label>
          <input
            type="number"
            value={config.gameplay?.columns || 20}
            onChange={(e) => updateNestedConfig(['gameplay', 'columns'], parseInt(e.target.value))}
            min="10"
            max="30"
          />
        </div>
        <div className={styles.settingRow}>
          <label>Satır Sayısı:</label>
          <input
            type="number"
            value={config.gameplay?.rows || 28}
            onChange={(e) => updateNestedConfig(['gameplay', 'rows'], parseInt(e.target.value))}
            min="15"
            max="35"
          />
        </div>
        <div className={styles.settingRow}>
          <label>Duvarlar Sarıyor:</label>
          <input
            type="checkbox"
            checked={config.gameplay?.wrapWalls || false}
            onChange={(e) => updateNestedConfig(['gameplay', 'wrapWalls'], e.target.checked)}
          />
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>Oyuncu Özellikleri</h3>
        <div className={styles.settingRow}>
          <label>Başlangıç Hızı:</label>
          <input
            type="number"
            step="0.1"
            value={config.player?.baseSpeed || 6}
            onChange={(e) => updateNestedConfig(['player', 'baseSpeed'], parseFloat(e.target.value))}
            min="1"
            max="15"
          />
        </div>
        <div className={styles.settingRow}>
          <label>Yem Başına Hız Artışı:</label>
          <input
            type="number"
            step="0.1"
            value={config.player?.speedIncreasePerFood || 0.6}
            onChange={(e) => updateNestedConfig(['player', 'speedIncreasePerFood'], parseFloat(e.target.value))}
            min="0"
            max="2"
          />
        </div>
        <div className={styles.settingRow}>
          <label>Başlangıç Uzunluğu:</label>
          <input
            type="number"
            value={config.gameplay?.startLength || 7}
            onChange={(e) => updateNestedConfig(['gameplay', 'startLength'], parseInt(e.target.value))}
            min="3"
            max="15"
          />
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>Yem Sistemi</h3>
        <div className={styles.settingRow}>
          <label>Yem Puanı:</label>
          <input
            type="number"
            value={config.gameplay?.foodScore || 30}
            onChange={(e) => updateNestedConfig(['gameplay', 'foodScore'], parseInt(e.target.value))}
            min="10"
            max="100"
          />
        </div>
        <div className={styles.settingRow}>
          <label>Yem Şekli:</label>
          <select
            value={config.gameplay?.foodShape || "circle"}
            onChange={(e) => updateNestedConfig(['gameplay', 'foodShape'], e.target.value)}
          >
            <option value="circle">Daire</option>
            <option value="heart">Kalp</option>
            <option value="square">Kare</option>
          </select>
        </div>
        <div className={styles.settingRow}>
          <label>Yem Türü:</label>
          <select
            value={config.gameplay?.foodKind || "burger"}
            onChange={(e) => updateNestedConfig(['gameplay', 'foodKind'], e.target.value)}
          >
            <option value="burger">Burger</option>
            <option value="heart">Kalp</option>
            <option value="star">Yıldız</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Appearance Tab Component
function AppearanceTab({ config, updateNestedConfig }: {
  config: any;
  updateNestedConfig: (path: string[], value: any) => void;
}) {
  return (
    <div className={styles.settingsSection}>
      <h2>🎨 Görünüm Ayarları</h2>

      <div className={styles.settingGroup}>
        <h3>Renk Paleti</h3>
        <div className={styles.settingRow}>
          <label>Arka Plan:</label>
          <input
            type="color"
            value={config.colors?.background || "#0052FF"}
            onChange={(e) => updateNestedConfig(['colors', 'background'], e.target.value)}
          />
        </div>
        <div className={styles.settingRow}>
          <label>Grid:</label>
          <input
            type="color"
            value={config.colors?.grid || "#1c60f2"}
            onChange={(e) => updateNestedConfig(['colors', 'grid'], e.target.value)}
          />
        </div>
        <div className={styles.settingRow}>
          <label>Yılan Baş:</label>
          <input
            type="color"
            value={config.colors?.snakeHead || "#dfb4b4"}
            onChange={(e) => updateNestedConfig(['colors', 'snakeHead'], e.target.value)}
          />
        </div>
        <div className={styles.settingRow}>
          <label>Yılan Gövde:</label>
          <input
            type="color"
            value={config.colors?.snakeBody || "#ffffff"}
            onChange={(e) => updateNestedConfig(['colors', 'snakeBody'], e.target.value)}
          />
        </div>
        <div className={styles.settingRow}>
          <label>Yem Birincil:</label>
          <input
            type="color"
            value={config.colors?.foodPrimary || "#e1ff00"}
            onChange={(e) => updateNestedConfig(['colors', 'foodPrimary'], e.target.value)}
          />
        </div>
        <div className={styles.settingRow}>
          <label>Yem İkincil:</label>
          <input
            type="color"
            value={config.colors?.foodSecondary || "#fff700"}
            onChange={(e) => updateNestedConfig(['colors', 'foodSecondary'], e.target.value)}
          />
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>UI Seçenekleri</h3>
        <div className={styles.settingRow}>
          <label>Grid Göster:</label>
          <input
            type="checkbox"
            checked={config.ui?.showGrid || false}
            onChange={(e) => updateNestedConfig(['ui', 'showGrid'], e.target.checked)}
          />
        </div>
        <div className={styles.settingRow}>
          <label>Swipe İpucu Göster:</label>
          <input
            type="checkbox"
            checked={config.ui?.showSwipeHint || false}
            onChange={(e) => updateNestedConfig(['ui', 'showSwipeHint'], e.target.checked)}
          />
        </div>
        <div className={styles.settingRow}>
          <label>Parçacık Efektleri:</label>
          <input
            type="checkbox"
            checked={config.gameplay?.particles || false}
            onChange={(e) => updateNestedConfig(['gameplay', 'particles'], e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
}

// Typography Tab Component
function TypographyTab({ config, updateNestedConfig }: {
  config: any;
  updateNestedConfig: (path: string[], value: any) => void;
}) {
  return (
    <div className={styles.settingsSection}>
      <h2>📝 Yazı Tipi Ayarları</h2>

      <div className={styles.settingGroup}>
        <h3>Yazı Tipi</h3>
        <div className={styles.settingRow}>
          <label>Yazı Tipi Ailesi:</label>
          <select
            value={config.typography?.fontFamily || "system-ui"}
            onChange={(e) => updateNestedConfig(['typography', 'fontFamily'], e.target.value)}
          >
            <option value="system-ui">Sistem Yazı Tipi</option>
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>Boyutlar</h3>
        <div className={styles.settingRow}>
          <label>Başlık Boyutu:</label>
          <input
            type="number"
            value={config.typography?.titleSize || 28}
            onChange={(e) => updateNestedConfig(['typography', 'titleSize'], parseInt(e.target.value))}
            min="16"
            max="48"
          />px
        </div>
        <div className={styles.settingRow}>
          <label>Alt Başlık Boyutu:</label>
          <input
            type="number"
            value={config.typography?.subtitleSize || 14}
            onChange={(e) => updateNestedConfig(['typography', 'subtitleSize'], parseInt(e.target.value))}
            min="10"
            max="24"
          />px
        </div>
        <div className={styles.settingRow}>
          <label>Buton Yazısı Boyutu:</label>
          <input
            type="number"
            value={config.typography?.buttonSize || 16}
            onChange={(e) => updateNestedConfig(['typography', 'buttonSize'], parseInt(e.target.value))}
            min="12"
            max="24"
          />px
        </div>
        <div className={styles.settingRow}>
          <label>HUD Yazısı Boyutu:</label>
          <input
            type="number"
            value={config.typography?.hudSize || 14}
            onChange={(e) => updateNestedConfig(['typography', 'hudSize'], parseInt(e.target.value))}
            min="10"
            max="20"
          />px
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>Kalınlık</h3>
        <div className={styles.settingRow}>
          <label>Başlık Kalınlığı:</label>
          <input
            type="number"
            value={config.typography?.titleWeight || 900}
            onChange={(e) => updateNestedConfig(['typography', 'titleWeight'], parseInt(e.target.value))}
            min="100"
            max="900"
            step="100"
          />
        </div>
        <div className={styles.settingRow}>
          <label>Buton Yazısı Kalınlığı:</label>
          <input
            type="number"
            value={config.typography?.buttonWeight || 800}
            onChange={(e) => updateNestedConfig(['typography', 'buttonWeight'], parseInt(e.target.value))}
            min="100"
            max="900"
            step="100"
          />
        </div>
      </div>
    </div>
  );
}

// Theme Tab Component
function ThemeTab({ config, updateNestedConfig }: {
  config: any;
  updateNestedConfig: (path: string[], value: any) => void;
}) {
  return (
    <div className={styles.settingsSection}>
      <h2>🎭 Tema Ayarları</h2>
      <p className={styles.sectionDescription}>
        Sayfaların genel görünümünü, renklerini ve yazı tiplerini buradan yönetebilirsiniz.
      </p>

      <div className={styles.settingGroup}>
        <h3>📄 Sayfa Arka Planları</h3>
        <div className={styles.settingRow}>
          <label>Açık Tema Sayfa Arka Planı:</label>
          <input
            type="text"
            value={config.theme?.pageBackground || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}
            onChange={(e) => updateNestedConfig(['theme', 'pageBackground'], e.target.value)}
            placeholder="CSS background değeri (ör: linear-gradient(...))"
          />
          <small className={styles.settingDescription}>Ana sayfaların arka plan rengi/gradyanı</small>
        </div>
        <div className={styles.settingRow}>
          <label>Koyu Tema Sayfa Arka Planı:</label>
          <input
            type="text"
            value={config.theme?.pageBackgroundDark || "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"}
            onChange={(e) => updateNestedConfig(['theme', 'pageBackgroundDark'], e.target.value)}
            placeholder="CSS background değeri"
          />
          <small className={styles.settingDescription}>Koyu mod için sayfa arka planı</small>
        </div>
        <div className={styles.settingRow}>
          <label>Kart Arka Planı (Açık):</label>
          <input
            type="color"
            value={config.theme?.cardBackground || "#ffffff"}
            onChange={(e) => updateNestedConfig(['theme', 'cardBackground'], e.target.value)}
          />
          <small className={styles.settingDescription}>Kart ve panel arka plan rengi</small>
        </div>
        <div className={styles.settingRow}>
          <label>Kart Arka Planı (Koyu):</label>
          <input
            type="color"
            value={config.theme?.cardBackgroundDark || "#1f2937"}
            onChange={(e) => updateNestedConfig(['theme', 'cardBackgroundDark'], e.target.value)}
          />
          <small className={styles.settingDescription}>Koyu mod için kart arka plan rengi</small>
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>✍️ Yazı Tipleri ve Renkleri</h3>
        <div className={styles.settingRow}>
          <label>Yazı Tipi Ailesi:</label>
          <select
            value={config.theme?.fontFamily || "system-ui, -apple-system, sans-serif"}
            onChange={(e) => updateNestedConfig(['theme', 'fontFamily'], e.target.value)}
          >
            <option value="system-ui, -apple-system, sans-serif">Sistem Yazı Tipi</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="Helvetica, sans-serif">Helvetica</option>
            <option value="Times New Roman, serif">Times New Roman</option>
            <option value="Courier New, monospace">Courier New</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="Verdana, sans-serif">Verdana</option>
            <option value="Inter, sans-serif">Inter</option>
            <option value="Roboto, sans-serif">Roboto</option>
            <option value="Open Sans, sans-serif">Open Sans</option>
          </select>
          <small className={styles.settingDescription}>Tüm sayfalar için genel yazı tipi</small>
        </div>
        <div className={styles.settingRow}>
          <label>Başlık Rengi (Açık):</label>
          <input
            type="color"
            value={config.theme?.headingColor || "#1f2937"}
            onChange={(e) => updateNestedConfig(['theme', 'headingColor'], e.target.value)}
          />
          <small className={styles.settingDescription}>H1, H2, H3 gibi başlıkların rengi</small>
        </div>
        <div className={styles.settingRow}>
          <label>Başlık Rengi (Koyu):</label>
          <input
            type="color"
            value={config.theme?.headingColorDark || "#f9fafb"}
            onChange={(e) => updateNestedConfig(['theme', 'headingColorDark'], e.target.value)}
          />
          <small className={styles.settingDescription}>Koyu mod için başlık rengi</small>
        </div>
        <div className={styles.settingRow}>
          <label>Normal Yazı Rengi (Açık):</label>
          <input
            type="color"
            value={config.theme?.textColor || "#374151"}
            onChange={(e) => updateNestedConfig(['theme', 'textColor'], e.target.value)}
          />
          <small className={styles.settingDescription}>Paragraf ve normal metin rengi</small>
        </div>
        <div className={styles.settingRow}>
          <label>Normal Yazı Rengi (Koyu):</label>
          <input
            type="color"
            value={config.theme?.textColorDark || "#d1d5db"}
            onChange={(e) => updateNestedConfig(['theme', 'textColorDark'], e.target.value)}
          />
          <small className={styles.settingDescription}>Koyu mod için normal metin rengi</small>
        </div>
        <div className={styles.settingRow}>
          <label>Soluk Yazı Rengi (Açık):</label>
          <input
            type="color"
            value={config.theme?.mutedTextColor || "#6b7280"}
            onChange={(e) => updateNestedConfig(['theme', 'mutedTextColor'], e.target.value)}
          />
          <small className={styles.settingDescription}>Açıklamalar ve ikincil metin rengi</small>
        </div>
        <div className={styles.settingRow}>
          <label>Soluk Yazı Rengi (Koyu):</label>
          <input
            type="color"
            value={config.theme?.mutedTextColorDark || "#9ca3af"}
            onChange={(e) => updateNestedConfig(['theme', 'mutedTextColorDark'], e.target.value)}
          />
          <small className={styles.settingDescription}>Koyu mod için soluk metin rengi</small>
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>🔘 Buton Renkleri</h3>
        <div className={styles.settingRow}>
          <label>Birincil Buton Arka Plan:</label>
          <input
            type="text"
            value={config.theme?.primaryButtonBg || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}
            onChange={(e) => updateNestedConfig(['theme', 'primaryButtonBg'], e.target.value)}
            placeholder="CSS background değeri"
          />
          <small className={styles.settingDescription}>Kaydet, Gönder gibi birincil butonlar</small>
        </div>
        <div className={styles.settingRow}>
          <label>Birincil Buton Yazı Rengi:</label>
          <input
            type="color"
            value={config.theme?.primaryButtonText || "#ffffff"}
            onChange={(e) => updateNestedConfig(['theme', 'primaryButtonText'], e.target.value)}
          />
          <small className={styles.settingDescription}>Birincil butonların yazı rengi</small>
        </div>
        <div className={styles.settingRow}>
          <label>İkincil Buton Arka Plan:</label>
          <input
            type="color"
            value={config.theme?.secondaryButtonBg || "#f3f4f6"}
            onChange={(e) => updateNestedConfig(['theme', 'secondaryButtonBg'], e.target.value)}
          />
          <small className={styles.settingDescription}>İptal, Geri gibi ikincil butonlar</small>
        </div>
        <div className={styles.settingRow}>
          <label>İkincil Buton Yazı Rengi:</label>
          <input
            type="color"
            value={config.theme?.secondaryButtonText || "#374151"}
            onChange={(e) => updateNestedConfig(['theme', 'secondaryButtonText'], e.target.value)}
          />
          <small className={styles.settingDescription}>İkincil butonların yazı rengi</small>
        </div>
        <div className={styles.settingRow}>
          <label>Tehlike Buton Arka Plan:</label>
          <input
            type="color"
            value={config.theme?.dangerButtonBg || "#dc2626"}
            onChange={(e) => updateNestedConfig(['theme', 'dangerButtonBg'], e.target.value)}
          />
          <small className={styles.settingDescription}>Sil, Sıfırla gibi tehlikeli işlemler</small>
        </div>
        <div className={styles.settingRow}>
          <label>Tehlike Buton Yazı Rengi:</label>
          <input
            type="color"
            value={config.theme?.dangerButtonText || "#ffffff"}
            onChange={(e) => updateNestedConfig(['theme', 'dangerButtonText'], e.target.value)}
          />
          <small className={styles.settingDescription}>Tehlike butonlarının yazı rengi</small>
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>🎨 Özel Renkler</h3>
        <div className={styles.settingRow}>
          <label>Vurgu Rengi:</label>
          <input
            type="color"
            value={config.theme?.accentColor || "#667eea"}
            onChange={(e) => updateNestedConfig(['theme', 'accentColor'], e.target.value)}
          />
          <small className={styles.settingDescription}>Linkler, vurgular ve aktif durumlar</small>
        </div>
        <div className={styles.settingRow}>
          <label>Başarı Rengi:</label>
          <input
            type="color"
            value={config.theme?.successColor || "#10b981"}
            onChange={(e) => updateNestedConfig(['theme', 'successColor'], e.target.value)}
          />
          <small className={styles.settingDescription}>Başarılı işlemler ve onay mesajları</small>
        </div>
        <div className={styles.settingRow}>
          <label>Uyarı Rengi:</label>
          <input
            type="color"
            value={config.theme?.warningColor || "#f59e0b"}
            onChange={(e) => updateNestedConfig(['theme', 'warningColor'], e.target.value)}
          />
          <small className={styles.settingDescription}>Uyarı mesajları ve dikkat çekici öğeler</small>
        </div>
        <div className={styles.settingRow}>
          <label>Hata Rengi:</label>
          <input
            type="color"
            value={config.theme?.errorColor || "#ef4444"}
            onChange={(e) => updateNestedConfig(['theme', 'errorColor'], e.target.value)}
          />
          <small className={styles.settingDescription}>Hata mesajları ve başarısız işlemler</small>
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>📐 Tasarım Öğeleri</h3>
        <div className={styles.settingRow}>
          <label>Kenar Yuvarlaklığı:</label>
          <input
            type="number"
            value={config.theme?.borderRadius || 12}
            onChange={(e) => updateNestedConfig(['theme', 'borderRadius'], parseInt(e.target.value))}
            min="0"
            max="50"
          />px
          <small className={styles.settingDescription}>Kartlar ve butonların köşe yuvarlaklığı</small>
        </div>
        <div className={styles.settingRow}>
          <label>Gölge Rengi (Açık):</label>
          <input
            type="text"
            value={config.theme?.shadowColor || "rgba(0, 0, 0, 0.1)"}
            onChange={(e) => updateNestedConfig(['theme', 'shadowColor'], e.target.value)}
            placeholder="CSS rgba değeri"
          />
          <small className={styles.settingDescription}>Kart gölgeleri için renk</small>
        </div>
        <div className={styles.settingRow}>
          <label>Gölge Rengi (Koyu):</label>
          <input
            type="text"
            value={config.theme?.shadowColorDark || "rgba(0, 0, 0, 0.3)"}
            onChange={(e) => updateNestedConfig(['theme', 'shadowColorDark'], e.target.value)}
            placeholder="CSS rgba değeri"
          />
          <small className={styles.settingDescription}>Koyu mod için gölge rengi</small>
        </div>
      </div>
    </div>
  );
}

// Buttons Tab Component
function ButtonsTab({ config, updateNestedConfig }: {
  config: any;
  updateNestedConfig: (path: string[], value: any) => void;
}) {
  return (
    <div className={styles.settingsSection}>
      <h2>🔘 Buton Tasarımı</h2>

      <div className={styles.settingGroup}>
        <h3>Buton Renkleri</h3>
        <div className={styles.settingRow}>
          <label>Birincil Renk:</label>
          <input
            type="color"
            value={config.buttons?.primaryColor || "#3ee686"}
            onChange={(e) => updateNestedConfig(['buttons', 'primaryColor'], e.target.value)}
          />
        </div>
        <div className={styles.settingRow}>
          <label>Gradyan Başlangıç:</label>
          <input
            type="color"
            value={config.buttons?.primaryGradientStart || "#94f7b7"}
            onChange={(e) => updateNestedConfig(['buttons', 'primaryGradientStart'], e.target.value)}
          />
        </div>
        <div className={styles.settingRow}>
          <label>Gradyan Bitiş:</label>
          <input
            type="color"
            value={config.buttons?.primaryGradientEnd || "#3ee686"}
            onChange={(e) => updateNestedConfig(['buttons', 'primaryGradientEnd'], e.target.value)}
          />
        </div>
        <div className={styles.settingRow}>
          <label>Yazı Rengi:</label>
          <input
            type="color"
            value={config.buttons?.textColor || "#0b0f1a"}
            onChange={(e) => updateNestedConfig(['buttons', 'textColor'], e.target.value)}
          />
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>Buton Özellikleri</h3>
        <div className={styles.settingRow}>
          <label>Kenar Yuvarlaklığı:</label>
          <input
            type="number"
            value={config.buttons?.borderRadius || 12}
            onChange={(e) => updateNestedConfig(['buttons', 'borderRadius'], parseInt(e.target.value))}
            min="0"
            max="50"
          />px
        </div>
        <div className={styles.settingRow}>
          <label>Gölge Efekti:</label>
          <input
            type="checkbox"
            checked={config.buttons?.shadow || false}
            onChange={(e) => updateNestedConfig(['buttons', 'shadow'], e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
}

// Content Tab Component
function ContentTab({ config, updateNestedConfig }: {
  config: any;
  updateNestedConfig: (path: string[], value: any) => void;
}) {
  const [selectedLanguage, setSelectedLanguage] = useState('tr');

  const languages = [
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ];

  const getLocalizedContent = (key: string) => {
    return config.content?.locales?.[selectedLanguage]?.[key] ||
           config.content?.[key] ||
           '';
  };

  const updateLocalizedContent = (key: string, value: string) => {
    const path = ['content', 'locales', selectedLanguage, key];
    updateNestedConfig(path, value);
  };

  return (
    <div className={styles.settingsSection}>
      <h2>📄 Sayfa İçeriği Yönetimi</h2>

      <div className={styles.settingGroup}>
        <h3>Dil Seçimi</h3>
        <div className={styles.settingRow}>
          <label>Dil:</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <p>Seçili dil için metinleri düzenleyin. Kaydedildiğinde tüm diller için içerik korunur.</p>
      </div>

      <div className={styles.settingGroup}>
        <h3>Ana Sayfa Metinleri</h3>
        <div className={styles.settingRow}>
          <label>Ana Başlık:</label>
          <input
            type="text"
            value={getLocalizedContent('mainTitle')}
            onChange={(e) => updateLocalizedContent('mainTitle', e.target.value)}
            placeholder="Ana başlık metni"
          />
        </div>
        <div className={styles.settingRow}>
          <label>Alt Başlık:</label>
          <input
            type="text"
            value={getLocalizedContent('subtitle')}
            onChange={(e) => updateLocalizedContent('subtitle', e.target.value)}
            placeholder="Alt başlık metni"
          />
        </div>
        <div className={styles.settingRow}>
          <label>Açıklama:</label>
          <textarea
            value={getLocalizedContent('description')}
            onChange={(e) => updateLocalizedContent('description', e.target.value)}
            placeholder="Sayfa açıklaması"
            rows={3}
          />
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>Oyun Ekranı Metinleri</h3>
        <div className={styles.settingRow}>
          <label>Başlama Butonu:</label>
          <input
            type="text"
            value={getLocalizedContent('startButton')}
            onChange={(e) => updateLocalizedContent('startButton', e.target.value)}
            placeholder="Başlama butonu metni"
          />
        </div>
        <div className={styles.settingRow}>
          <label>Ana Sayfa Butonu:</label>
          <input
            type="text"
            value={getLocalizedContent('mainPageButton')}
            onChange={(e) => updateLocalizedContent('mainPageButton', e.target.value)}
            placeholder="Ana sayfa butonu metni"
          />
        </div>
        <div className={styles.settingRow}>
          <label>Oyun Bitti Başlığı:</label>
          <input
            type="text"
            value={getLocalizedContent('gameOverTitle')}
            onChange={(e) => updateLocalizedContent('gameOverTitle', e.target.value)}
            placeholder="Oyun bitiş başlığı"
          />
        </div>
        <div className={styles.settingRow}>
          <label>Skor Metni:</label>
          <input
            type="text"
            value={getLocalizedContent('scoreText')}
            onChange={(e) => updateLocalizedContent('scoreText', e.target.value)}
            placeholder="Skor gösterimi metni"
          />
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>Lider Tablosu Metinleri</h3>
        <div className={styles.settingRow}>
          <label>Lider Tablosu Başlığı:</label>
          <input
            type="text"
            value={getLocalizedContent('leaderboardTitle')}
            onChange={(e) => updateLocalizedContent('leaderboardTitle', e.target.value)}
            placeholder="Lider tablosu başlığı"
          />
        </div>
        <div className={styles.settingRow}>
          <label>On-chain Liderler:</label>
          <input
            type="text"
            value={getLocalizedContent('onchainLeadersTitle')}
            onChange={(e) => updateLocalizedContent('onchainLeadersTitle', e.target.value)}
            placeholder="On-chain liderler başlığı"
          />
        </div>
        <div className={styles.settingRow}>
          <label>Toplam Liderler:</label>
          <input
            type="text"
            value={getLocalizedContent('totalLeadersTitle')}
            onChange={(e) => updateLocalizedContent('totalLeadersTitle', e.target.value)}
            placeholder="Toplam liderler başlığı"
          />
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>Başarılar Metinleri</h3>
        <div className={styles.settingRow}>
          <label>Başarılar Başlığı:</label>
          <input
            type="text"
            value={getLocalizedContent('achievementsTitle')}
            onChange={(e) => updateLocalizedContent('achievementsTitle', e.target.value)}
            placeholder="Başarılar başlığı"
          />
        </div>
        <div className={styles.settingRow}>
          <label>Henüz Başarı Yok:</label>
          <input
            type="text"
            value={getLocalizedContent('noAchievementsText')}
            onChange={(e) => updateLocalizedContent('noAchievementsText', e.target.value)}
            placeholder="Başarı bulunamama metni"
          />
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>Turnuvalar Metinleri</h3>
        <div className={styles.settingRow}>
          <label>Turnuvalar Başlığı:</label>
          <input
            type="text"
            value={getLocalizedContent('tournamentsTitle')}
            onChange={(e) => updateLocalizedContent('tournamentsTitle', e.target.value)}
            placeholder="Turnuvalar başlığı"
          />
        </div>
        <div className={styles.settingRow}>
          <label>Yakında Gelecek:</label>
          <input
            type="text"
            value={getLocalizedContent('comingSoonText')}
            onChange={(e) => updateLocalizedContent('comingSoonText', e.target.value)}
            placeholder="Yakında gelecek metni"
          />
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>Görevler Metinleri</h3>
        <div className={styles.settingRow}>
          <label>Görevler Başlığı:</label>
          <input
            type="text"
            value={getLocalizedContent('tasksTitle')}
            onChange={(e) => updateLocalizedContent('tasksTitle', e.target.value)}
            placeholder="Görevler başlığı"
          />
        </div>
        <div className={styles.settingRow}>
          <label>Günlük Görevler:</label>
          <input
            type="text"
            value={getLocalizedContent('dailyTasksTitle')}
            onChange={(e) => updateLocalizedContent('dailyTasksTitle', e.target.value)}
            placeholder="Günlük görevler başlığı"
          />
        </div>
      </div>
    </div>
  );
}

// Presets Tab Component
function PresetsTab({ config: _config, updateConfig }: {
  config: any;
  updateConfig: (updates: any) => void;
}) {
  const applyPreset = (preset: string) => {
    const presets: Record<string, any> = {
      classic: {
        colors: {
          background: "#000000",
          grid: "#333333",
          snakeHead: "#00ff00",
          snakeBody: "#00aa00",
          foodPrimary: "#ff0000",
          foodSecondary: "#aa0000",
        },
        ui: { interfaceTitle: "Classic Snake" }
      },
      ocean: {
        colors: {
          background: "#001122",
          grid: "#003366",
          snakeHead: "#00ffff",
          snakeBody: "#0088aa",
          foodPrimary: "#ffaa00",
          foodSecondary: "#ff6600",
        },
        ui: { interfaceTitle: "Ocean Snake" }
      },
      neon: {
        colors: {
          background: "#0a0a0a",
          grid: "#1a1a1a",
          snakeHead: "#ff00ff",
          snakeBody: "#00ffff",
          foodPrimary: "#ffff00",
          foodSecondary: "#ff8800",
        },
        ui: { interfaceTitle: "Neon Snake" }
      },
      pastel: {
        colors: {
          background: "#f0f8ff",
          grid: "#e6f3ff",
          snakeHead: "#ffb6c1",
          snakeBody: "#dda0dd",
          foodPrimary: "#98fb98",
          foodSecondary: "#f0e68c",
        },
        ui: { interfaceTitle: "Pastel Snake" }
      }
    };

    if (presets[preset]) {
      updateConfig(presets[preset]);
      alert(`${preset.charAt(0).toUpperCase() + preset.slice(1)} teması uygulandı!`);
    }
  };

  return (
    <div className={styles.settingsSection}>
      <h2>⚙️ Hazır Temanlar</h2>
      <p>Hızlı tema değişiklikleri için hazır ayarları kullanın.</p>

      <div className={styles.presetGrid}>
        {[
          { id: 'classic', name: 'Klasik', description: 'Geleneksel siyah-beyaz tema' },
          { id: 'ocean', name: 'Okyanus', description: 'Mavi tonlarında su teması' },
          { id: 'neon', name: 'Neon', description: 'Parlak renklerde gece kulübü teması' },
          { id: 'pastel', name: 'Pastel', description: 'Yumuşak renklerde sakin tema' }
        ].map((preset) => (
          <div key={preset.id} className={styles.presetCard}>
            <h3>{preset.name}</h3>
            <p>{preset.description}</p>
            <button
              className={styles.presetButton}
              onClick={() => applyPreset(preset.id)}
            >
              Uygula
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Data Management Tab Component
function DataTab({ clearTestData, clearingData }: {
  clearTestData: () => void;
  clearingData: boolean;
}) {
  return (
    <div className={styles.settingsSection}>
      <h2>🗃️ Veri Yönetimi</h2>

      <div className={styles.settingGroup}>
        <h3>Test Verilerini Temizle</h3>
        <p>Bu işlem tüm test leaderboard verilerini ve kullanıcı skorlarını silecektir.</p>
        <div className={styles.warningBox}>
          ⚠️ Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?
        </div>
        <button
          className={styles.dangerButton}
          onClick={clearTestData}
          disabled={clearingData}
        >
          {clearingData ? 'Temizleniyor...' : 'Test Verilerini Temizle'}
        </button>
      </div>

      <div className={styles.settingGroup}>
        <h3>Veri İstatistikleri</h3>
        <p>Gelecek sürümlerde veri istatistikleri burada görüntülenecektir.</p>
      </div>
    </div>
  );
}