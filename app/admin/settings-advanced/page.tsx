"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./AdvancedSettings.module.css";
import type { FullGameConfig } from "@/lib/config-store";
import { DEFAULT_FULL_CONFIG } from "@/lib/config-store";
import { GAME_PRESETS, type GamePreset } from "@/lib/presets";

export default function AdvancedSettings() {
  const [config, setConfig] = useState<FullGameConfig | null>(null);
  const [activeTab, setActiveTab] = useState<"colors" | "gameplay" | "player" | "ui" | "typography" | "buttons" | "sounds" | "start">("colors");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      const res = await fetch("/api/full-config");
      if (!res.ok) throw new Error("Failed to load config");
      const data = await res.json();
      // Ensure startScreen defaults exist
      const merged = { ...DEFAULT_FULL_CONFIG, ...data, startScreen: { ...DEFAULT_FULL_CONFIG.startScreen, ...(data.startScreen || {}) } } as FullGameConfig;
      setConfig(merged);
    } catch (error) {
      console.error("Load error:", error);
      setMessage("❌ Failed to load config");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!config) return;
    
    setSaving(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/full-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Save failed");
      }
      
  setMessage("✅ Ayarlar başarıyla kaydedildi!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
  console.error("Kaydetme hatası:", error);
  setMessage(`❌ ${error instanceof Error ? error.message : "Kaydetme başarısız"}`);
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    if (confirm("Varsayılan ayarlara sıfırlansın mı?")) {
      loadConfig();
      setMessage("🔄 Varsayılanlara sıfırlandı");
      setTimeout(() => setMessage(""), 3000);
    }
  }

  function handleLoadPreset(preset: GamePreset) {
    const mergedPreset = { ...DEFAULT_FULL_CONFIG, ...preset.config, startScreen: { ...DEFAULT_FULL_CONFIG.startScreen, ...(preset.config.startScreen || {}) } } as FullGameConfig;
    setConfig(mergedPreset);
    setShowPresets(false);
    setMessage(`✨ Tema yüklendi: ${preset.name}`);
    setTimeout(() => setMessage(""), 3000);
  }

  function handleExport() {
    if (!config) return;
    
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `snake-config-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    setMessage("📥 Ayarlar dışa aktarıldı!");
    setTimeout(() => setMessage(""), 3000);
  }

  function handleImport() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target?.result as string);
        setConfig(importedConfig);
        setMessage("📤 Ayarlar başarıyla içe aktarıldı!");
        setTimeout(() => setMessage(""), 3000);
  } catch {
        setMessage("❌ Geçersiz JSON dosyası");
        setTimeout(() => setMessage(""), 3000);
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function updateConfig(path: string, value: unknown) {
    if (!config) return;
    
    const keys = path.split(".");
    const newConfig = JSON.parse(JSON.stringify(config));
    
  let current: Record<string, unknown> = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
  current = current[keys[i]] as Record<string, unknown>;
    }
    current[keys[keys.length - 1]] = value;
    
    setConfig(newConfig);
  }

  if (loading) {
    return <div className={styles.loading}>Ayarlar yükleniyor...</div>;
  }

  if (!config) {
    return <div className={styles.error}>Ayarlar yüklenemedi</div>;
  }

  return (
    <div className={styles.container}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      
      <div className={styles.header}>
        <h1>🎮 Gelişmiş Oyun Ayarları</h1>
        <p>Yılan oyununun her detayını özelleştir</p>
        
        <div className={styles.quickActions}>
          <button onClick={() => setShowPresets(!showPresets)} className={styles.btnQuick}>
            ✨ Hazır Temalar
          </button>
          <button onClick={handleImport} className={styles.btnQuick}>
            📤 İçe Aktar
          </button>
          <button onClick={handleExport} className={styles.btnQuick}>
            📥 Dışa Aktar
          </button>
        </div>
      </div>

      {showPresets && (
        <div className={styles.presetsPanel}>
          <h3>Hazır Tema Seç</h3>
          <div className={styles.presetGrid}>
            {GAME_PRESETS.map((preset) => (
              <button
                key={preset.id}
                className={styles.presetCard}
                onClick={() => handleLoadPreset(preset)}
              >
                <div className={styles.presetEmoji}>{preset.emoji}</div>
                <div className={styles.presetName}>{preset.name}</div>
                <div className={styles.presetDesc}>{preset.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.tabs}>
        <button 
          className={activeTab === "colors" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("colors")}
        >
          🎨 Renkler
        </button>
        <button 
          className={activeTab === "gameplay" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("gameplay")}
        >
          🕹️ Oynanış
        </button>
        <button 
          className={activeTab === "player" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("player")}
        >
          🐍 Oyuncu
        </button>
        <button 
          className={activeTab === "ui" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("ui")}
        >
          🖼️ Arayüz
        </button>
        <button 
          className={activeTab === "typography" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("typography")}
        >
          ✏️ Tipografi
        </button>
        <button 
          className={activeTab === "buttons" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("buttons")}
        >
          🔘 Butonlar
        </button>
        <button 
          className={activeTab === "sounds" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("sounds")}
        >
          🔊 Sesler
        </button>
        <button 
          className={activeTab === "start" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("start")}
        >
          🚀 Başlangıç
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === "colors" && (
          <div className={styles.section}>
            <h2>Renk Ayarları</h2>
            <div className={styles.grid}>
              <ColorInput label="Arka Plan" value={config.colors.background} onChange={(v) => updateConfig("colors.background", v)} />
              <ColorInput label="Izgara" value={config.colors.grid} onChange={(v) => updateConfig("colors.grid", v)} />
              <ColorInput label="Yılan Baş" value={config.colors.snakeHead} onChange={(v) => updateConfig("colors.snakeHead", v)} />
              <ColorInput label="Yılan Gövdesi" value={config.colors.snakeBody} onChange={(v) => updateConfig("colors.snakeBody", v)} />
              <ColorInput label="Yem (Birincil)" value={config.colors.foodPrimary} onChange={(v) => updateConfig("colors.foodPrimary", v)} />
              <ColorInput label="Yem (İkincil)" value={config.colors.foodSecondary} onChange={(v) => updateConfig("colors.foodSecondary", v)} />
              <ColorInput label="Partikül" value={config.colors.particle} onChange={(v) => updateConfig("colors.particle", v)} />
              <ColorInput label="Arayüz" value={config.colors.ui} onChange={(v) => updateConfig("colors.ui", v)} />
              <ColorInput label="Oynanmaz Bölge" value={config.colors.noPlay} onChange={(v) => updateConfig("colors.noPlay", v)} />
            </div>
          </div>
        )}

        {activeTab === "gameplay" && (
          <div className={styles.section}>
            <h2>Oynanış Ayarları</h2>
            <div className={styles.grid}>
              <NumberInput label="Izgara Boyutu" value={config.gameplay.gridSize} onChange={(v) => updateConfig("gameplay.gridSize", v)} min={10} max={50} />
              <NumberInput label="Sütun" value={config.gameplay.columns} onChange={(v) => updateConfig("gameplay.columns", v)} min={10} max={40} />
              <NumberInput label="Satır" value={config.gameplay.rows} onChange={(v) => updateConfig("gameplay.rows", v)} min={10} max={40} />
              <NumberInput label="Başlangıç Uzunluğu" value={config.gameplay.startLength} onChange={(v) => updateConfig("gameplay.startLength", v)} min={1} max={20} />
              <NumberInput label="Yem Puanı" value={config.gameplay.foodScore} onChange={(v) => updateConfig("gameplay.foodScore", v)} min={1} max={1000} />
              <NumberInput label="Üst Oynanmaz Satır" value={config.gameplay.topNoPlayRows} onChange={(v) => updateConfig("gameplay.topNoPlayRows", v)} min={0} max={10} />
              <ToggleInput label="Duvarlardan Geçiş (Wrap)" value={config.gameplay.wrapWalls} onChange={(v) => updateConfig("gameplay.wrapWalls", v)} />
              <ToggleInput label="Partiküller" value={config.gameplay.particles} onChange={(v) => updateConfig("gameplay.particles", v)} />
              <SelectInput 
                label="Yem Şekli" 
                value={config.gameplay.foodShape} 
                onChange={(v) => updateConfig("gameplay.foodShape", v)}
                options={["heart", "circle", "square"]}
              />
              <SelectInput 
                label="Yem Türü" 
                value={config.gameplay.foodKind} 
                onChange={(v) => updateConfig("gameplay.foodKind", v)}
                options={["burger", "heart", "star"]}
              />
              <SelectInput 
                label="Oynanmaz Bölge Davranışı" 
                value={config.gameplay.noPlayActsAs} 
                onChange={(v) => updateConfig("gameplay.noPlayActsAs", v)}
                options={["wrap", "wall"]}
              />
            </div>
          </div>
        )}

        {activeTab === "player" && (
          <div className={styles.section}>
            <h2>Oyuncu Ayarları</h2>
            <div className={styles.grid}>
              <NumberInput label="Temel Hız" value={config.player.baseSpeed} onChange={(v) => updateConfig("player.baseSpeed", v)} min={1} max={30} step={0.1} />
              <NumberInput label="Yem Başına Hız Artışı" value={config.player.speedIncreasePerFood} onChange={(v) => updateConfig("player.speedIncreasePerFood", v)} min={0} max={5} step={0.1} />
              <NumberInput label="Minimum Adım (ms)" value={config.player.minStepMs} onChange={(v) => updateConfig("player.minStepMs", v)} min={50} max={500} />
              <NumberInput label="Yuvarlak Baş" value={config.player.roundedHead} onChange={(v) => updateConfig("player.roundedHead", v)} min={0} max={1} step={0.01} />
              <NumberInput label="Yuvarlak Gövde" value={config.player.roundedBody} onChange={(v) => updateConfig("player.roundedBody", v)} min={0} max={1} step={0.01} />
            </div>
          </div>
        )}

        {activeTab === "ui" && (
          <div className={styles.section}>
            <h2>Arayüz Ayarları</h2>
            <div className={styles.grid}>
              <TextInput label="Arayüz Başlığı" value={config.ui.interfaceTitle} onChange={(v) => updateConfig("ui.interfaceTitle", v)} maxLength={40} />
              <ToggleInput label="Izgarayı Göster" value={config.ui.showGrid} onChange={(v) => updateConfig("ui.showGrid", v)} />
              <ToggleInput label="Kaydırma İpucunu Göster" value={config.ui.showSwipeHint} onChange={(v) => updateConfig("ui.showSwipeHint", v)} />
            </div>
          </div>
        )}

        {activeTab === "typography" && (
          <div className={styles.section}>
            <h2>Tipografi Ayarları</h2>
            <div className={styles.grid}>
              <TextInput label="Yazı Tipi" value={config.typography.fontFamily} onChange={(v) => updateConfig("typography.fontFamily", v)} />
              <NumberInput label="Başlık Boyutu (px)" value={config.typography.titleSize} onChange={(v) => updateConfig("typography.titleSize", v)} min={12} max={72} />
              <NumberInput label="Başlık Kalınlığı" value={config.typography.titleWeight} onChange={(v) => updateConfig("typography.titleWeight", v)} min={100} max={900} step={100} />
              <NumberInput label="Alt Başlık Boyutu (px)" value={config.typography.subtitleSize} onChange={(v) => updateConfig("typography.subtitleSize", v)} min={10} max={32} />
              <NumberInput label="Buton Yazı Boyutu (px)" value={config.typography.buttonSize} onChange={(v) => updateConfig("typography.buttonSize", v)} min={12} max={32} />
              <NumberInput label="Buton Yazı Kalınlığı" value={config.typography.buttonWeight} onChange={(v) => updateConfig("typography.buttonWeight", v)} min={100} max={900} step={100} />
              <NumberInput label="HUD Yazı Boyutu (px)" value={config.typography.hudSize} onChange={(v) => updateConfig("typography.hudSize", v)} min={10} max={24} />
            </div>
          </div>
        )}

        {activeTab === "buttons" && (
          <div className={styles.section}>
            <h2>Buton Ayarları</h2>
            <div className={styles.grid}>
              <ColorInput label="Birincil Renk" value={config.buttons.primaryColor} onChange={(v) => updateConfig("buttons.primaryColor", v)} />
              <ColorInput label="Gradyan Başlangıcı" value={config.buttons.primaryGradientStart} onChange={(v) => updateConfig("buttons.primaryGradientStart", v)} />
              <ColorInput label="Gradyan Bitişi" value={config.buttons.primaryGradientEnd} onChange={(v) => updateConfig("buttons.primaryGradientEnd", v)} />
              <ColorInput label="Yazı Rengi" value={config.buttons.textColor} onChange={(v) => updateConfig("buttons.textColor", v)} />
              <NumberInput label="Köşe Yarıçapı (px)" value={config.buttons.borderRadius} onChange={(v) => updateConfig("buttons.borderRadius", v)} min={0} max={50} />
              <ToggleInput label="Gölge" value={config.buttons.shadow} onChange={(v) => updateConfig("buttons.shadow", v)} />
            </div>
          </div>
        )}

        {activeTab === "sounds" && (
          <div className={styles.section}>
            <h2>Ses Ayarları</h2>
            <div className={styles.grid}>
              <ToggleInput label="Sesler Açık" value={config.sounds.enabled} onChange={(v) => updateConfig("sounds.enabled", v)} />
              <ToggleInput label="Yeme Sesi" value={config.sounds.eatSound} onChange={(v) => updateConfig("sounds.eatSound", v)} />
              <ToggleInput label="Çarpma Sesi" value={config.sounds.hitSound} onChange={(v) => updateConfig("sounds.hitSound", v)} />
              <NumberInput label="Ses Seviyesi" value={config.sounds.volume} onChange={(v) => updateConfig("sounds.volume", v)} min={0} max={1} step={0.1} />
            </div>
          </div>
        )}

        {activeTab === "start" && (
          <div className={styles.section}>
            <h2>Başlangıç Ekranı & HUD</h2>
            <div className={styles.grid}>
              <TextInput label="Başlık (Title)" value={config.startScreen?.title || ""} onChange={(v) => updateConfig("startScreen.title", v)} />
              <TextInput label="Alt Başlık (Subtitle)" value={config.startScreen?.subtitle || ""} onChange={(v) => updateConfig("startScreen.subtitle", v)} />
              <TextInput label="Oynanış Başlığı (How to Play)" value={config.startScreen?.howToPlayTitle || ""} onChange={(v) => updateConfig("startScreen.howToPlayTitle", v)} />
              <TextAreaInput label="Oynanış Maddeleri (her satır bir madde)" value={(config.startScreen?.howToPlayItems || []).join("\n")} onChange={(text) => updateConfig("startScreen.howToPlayItems", text.split(/\n+/).map(s=>s.trim()).filter(Boolean))} />
              <TextInput label="Öğeler Başlığı (Items)" value={config.startScreen?.itemsTitle || ""} onChange={(v) => updateConfig("startScreen.itemsTitle", v)} />
              <TextAreaInput label="Öğe Maddeleri (her satır bir madde)" value={(config.startScreen?.itemsList || []).join("\n")} onChange={(text) => updateConfig("startScreen.itemsList", text.split(/\n+/).map(s=>s.trim()).filter(Boolean))} />
              <TextInput label="Başla Butonu (Play)" value={config.startScreen?.startButtonLabel || ""} onChange={(v) => updateConfig("startScreen.startButtonLabel", v)} />
              <TextInput label="Tekrar Oyna Butonu" value={config.startScreen?.playAgainLabel || ""} onChange={(v) => updateConfig("startScreen.playAgainLabel", v)} />
              <TextInput label="Oyun Bitti Başlığı" value={config.startScreen?.gameOverTitle || ""} onChange={(v) => updateConfig("startScreen.gameOverTitle", v)} />
              <TextInput label="Kontrol İpucu (Controls Hint)" value={config.startScreen?.controlsHint || ""} onChange={(v) => updateConfig("startScreen.controlsHint", v)} />
              <TextInput label="Skor Etiketi (Score)" value={config.startScreen?.scoreLabel || ""} onChange={(v) => updateConfig("startScreen.scoreLabel", v)} />
              <TextInput label="En İyi Etiketi (Best)" value={config.startScreen?.bestLabel || ""} onChange={(v) => updateConfig("startScreen.bestLabel", v)} />
              <NumberInput label="HUD Yazı Boyutu (px)" value={config.startScreen?.hudFontSize || 14} onChange={(v) => updateConfig("startScreen.hudFontSize", v)} min={10} max={24} />
              <NumberInput label="HUD Yazı Kalınlığı" value={config.startScreen?.hudFontWeight || 700} onChange={(v) => updateConfig("startScreen.hudFontWeight", v)} min={100} max={900} step={100} />
              <TextInput label="HUD Arka Plan (rgba)" value={config.startScreen?.hudBackground || ""} onChange={(v) => updateConfig("startScreen.hudBackground", v)} />
              <NumberInput label="HUD Köşe Yarıçapı (px)" value={config.startScreen?.hudBorderRadius || 12} onChange={(v) => updateConfig("startScreen.hudBorderRadius", v)} min={0} max={50} />
            </div>
          </div>
        )}
      </div>

      {message && <div className={styles.message}>{message}</div>}

      <div className={styles.actions}>
        <button onClick={handleReset} className={styles.btnSecondary} disabled={saving}>
          🔄 Varsayılanlara Sıfırla
        </button>
        <button onClick={handleSave} className={styles.btnPrimary} disabled={saving}>
          {saving ? "Kaydediliyor..." : "💾 Ayarları Kaydet"}
        </button>
      </div>
    </div>
  );
}

// Helper Components
function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <div className={styles.colorInput}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange, min, max, step = 1 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} min={min} max={max} step={step} />
    </div>
  );
}

function TextInput({ label, value, onChange, maxLength }: { label: string; value: string; onChange: (v: string) => void; maxLength?: number }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} maxLength={maxLength} />
    </div>
  );
}

function TextAreaInput({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ToggleInput({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className={styles.field}>
      <label>
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
        {label}
      </label>
    </div>
  );
}

function SelectInput({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
