"use client";

import { useState, useEffect } from "react";
import styles from "./AdvancedSettings.module.css";
import type { FullGameConfig } from "@/lib/config-store";

export default function AdvancedSettings() {
  const [config, setConfig] = useState<FullGameConfig | null>(null);
  const [activeTab, setActiveTab] = useState<"colors" | "gameplay" | "player" | "ui" | "typography" | "buttons" | "sounds">("colors");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      const res = await fetch("/api/full-config");
      if (!res.ok) throw new Error("Failed to load config");
      const data = await res.json();
      setConfig(data);
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
      
      setMessage("✅ Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Save error:", error);
      setMessage(`❌ ${error instanceof Error ? error.message : "Save failed"}`);
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    if (confirm("Reset to default settings?")) {
      loadConfig();
      setMessage("🔄 Reset to defaults");
      setTimeout(() => setMessage(""), 3000);
    }
  }

  function updateConfig(path: string, value: any) {
    if (!config) return;
    
    const keys = path.split(".");
    const newConfig = JSON.parse(JSON.stringify(config));
    
    let current: any = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setConfig(newConfig);
  }

  if (loading) {
    return <div className={styles.loading}>Loading configuration...</div>;
  }

  if (!config) {
    return <div className={styles.error}>Failed to load configuration</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🎮 Advanced Game Settings</h1>
        <p>Customize every aspect of your snake game</p>
      </div>

      <div className={styles.tabs}>
        <button 
          className={activeTab === "colors" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("colors")}
        >
          🎨 Colors
        </button>
        <button 
          className={activeTab === "gameplay" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("gameplay")}
        >
          🕹️ Gameplay
        </button>
        <button 
          className={activeTab === "player" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("player")}
        >
          🐍 Player
        </button>
        <button 
          className={activeTab === "ui" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("ui")}
        >
          🖼️ UI
        </button>
        <button 
          className={activeTab === "typography" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("typography")}
        >
          ✏️ Typography
        </button>
        <button 
          className={activeTab === "buttons" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("buttons")}
        >
          🔘 Buttons
        </button>
        <button 
          className={activeTab === "sounds" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("sounds")}
        >
          🔊 Sounds
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === "colors" && (
          <div className={styles.section}>
            <h2>Color Settings</h2>
            <div className={styles.grid}>
              <ColorInput label="Background" value={config.colors.background} onChange={(v) => updateConfig("colors.background", v)} />
              <ColorInput label="Grid" value={config.colors.grid} onChange={(v) => updateConfig("colors.grid", v)} />
              <ColorInput label="Snake Head" value={config.colors.snakeHead} onChange={(v) => updateConfig("colors.snakeHead", v)} />
              <ColorInput label="Snake Body" value={config.colors.snakeBody} onChange={(v) => updateConfig("colors.snakeBody", v)} />
              <ColorInput label="Food Primary" value={config.colors.foodPrimary} onChange={(v) => updateConfig("colors.foodPrimary", v)} />
              <ColorInput label="Food Secondary" value={config.colors.foodSecondary} onChange={(v) => updateConfig("colors.foodSecondary", v)} />
              <ColorInput label="Particle" value={config.colors.particle} onChange={(v) => updateConfig("colors.particle", v)} />
              <ColorInput label="UI" value={config.colors.ui} onChange={(v) => updateConfig("colors.ui", v)} />
              <ColorInput label="No-Play Zone" value={config.colors.noPlay} onChange={(v) => updateConfig("colors.noPlay", v)} />
            </div>
          </div>
        )}

        {activeTab === "gameplay" && (
          <div className={styles.section}>
            <h2>Gameplay Settings</h2>
            <div className={styles.grid}>
              <NumberInput label="Grid Size" value={config.gameplay.gridSize} onChange={(v) => updateConfig("gameplay.gridSize", v)} min={10} max={50} />
              <NumberInput label="Columns" value={config.gameplay.columns} onChange={(v) => updateConfig("gameplay.columns", v)} min={10} max={40} />
              <NumberInput label="Rows" value={config.gameplay.rows} onChange={(v) => updateConfig("gameplay.rows", v)} min={10} max={40} />
              <NumberInput label="Start Length" value={config.gameplay.startLength} onChange={(v) => updateConfig("gameplay.startLength", v)} min={1} max={20} />
              <NumberInput label="Food Score" value={config.gameplay.foodScore} onChange={(v) => updateConfig("gameplay.foodScore", v)} min={1} max={1000} />
              <NumberInput label="Top No-Play Rows" value={config.gameplay.topNoPlayRows} onChange={(v) => updateConfig("gameplay.topNoPlayRows", v)} min={0} max={10} />
              <ToggleInput label="Wrap Walls" value={config.gameplay.wrapWalls} onChange={(v) => updateConfig("gameplay.wrapWalls", v)} />
              <ToggleInput label="Particles" value={config.gameplay.particles} onChange={(v) => updateConfig("gameplay.particles", v)} />
              <SelectInput 
                label="Food Shape" 
                value={config.gameplay.foodShape} 
                onChange={(v) => updateConfig("gameplay.foodShape", v)}
                options={["heart", "circle", "square"]}
              />
              <SelectInput 
                label="Food Kind" 
                value={config.gameplay.foodKind} 
                onChange={(v) => updateConfig("gameplay.foodKind", v)}
                options={["burger", "heart", "star"]}
              />
              <SelectInput 
                label="No-Play Acts As" 
                value={config.gameplay.noPlayActsAs} 
                onChange={(v) => updateConfig("gameplay.noPlayActsAs", v)}
                options={["wrap", "wall"]}
              />
            </div>
          </div>
        )}

        {activeTab === "player" && (
          <div className={styles.section}>
            <h2>Player Settings</h2>
            <div className={styles.grid}>
              <NumberInput label="Base Speed" value={config.player.baseSpeed} onChange={(v) => updateConfig("player.baseSpeed", v)} min={1} max={30} step={0.1} />
              <NumberInput label="Speed Increase Per Food" value={config.player.speedIncreasePerFood} onChange={(v) => updateConfig("player.speedIncreasePerFood", v)} min={0} max={5} step={0.1} />
              <NumberInput label="Min Step (ms)" value={config.player.minStepMs} onChange={(v) => updateConfig("player.minStepMs", v)} min={50} max={500} />
              <NumberInput label="Rounded Head" value={config.player.roundedHead} onChange={(v) => updateConfig("player.roundedHead", v)} min={0} max={1} step={0.01} />
              <NumberInput label="Rounded Body" value={config.player.roundedBody} onChange={(v) => updateConfig("player.roundedBody", v)} min={0} max={1} step={0.01} />
            </div>
          </div>
        )}

        {activeTab === "ui" && (
          <div className={styles.section}>
            <h2>UI Settings</h2>
            <div className={styles.grid}>
              <TextInput label="Interface Title" value={config.ui.interfaceTitle} onChange={(v) => updateConfig("ui.interfaceTitle", v)} maxLength={40} />
              <ToggleInput label="Show Grid" value={config.ui.showGrid} onChange={(v) => updateConfig("ui.showGrid", v)} />
              <ToggleInput label="Show Swipe Hint" value={config.ui.showSwipeHint} onChange={(v) => updateConfig("ui.showSwipeHint", v)} />
            </div>
          </div>
        )}

        {activeTab === "typography" && (
          <div className={styles.section}>
            <h2>Typography Settings</h2>
            <div className={styles.grid}>
              <TextInput label="Font Family" value={config.typography.fontFamily} onChange={(v) => updateConfig("typography.fontFamily", v)} />
              <NumberInput label="Title Size (px)" value={config.typography.titleSize} onChange={(v) => updateConfig("typography.titleSize", v)} min={12} max={72} />
              <NumberInput label="Title Weight" value={config.typography.titleWeight} onChange={(v) => updateConfig("typography.titleWeight", v)} min={100} max={900} step={100} />
              <NumberInput label="Subtitle Size (px)" value={config.typography.subtitleSize} onChange={(v) => updateConfig("typography.subtitleSize", v)} min={10} max={32} />
              <NumberInput label="Button Size (px)" value={config.typography.buttonSize} onChange={(v) => updateConfig("typography.buttonSize", v)} min={12} max={32} />
              <NumberInput label="Button Weight" value={config.typography.buttonWeight} onChange={(v) => updateConfig("typography.buttonWeight", v)} min={100} max={900} step={100} />
              <NumberInput label="HUD Size (px)" value={config.typography.hudSize} onChange={(v) => updateConfig("typography.hudSize", v)} min={10} max={24} />
            </div>
          </div>
        )}

        {activeTab === "buttons" && (
          <div className={styles.section}>
            <h2>Button Settings</h2>
            <div className={styles.grid}>
              <ColorInput label="Primary Color" value={config.buttons.primaryColor} onChange={(v) => updateConfig("buttons.primaryColor", v)} />
              <ColorInput label="Gradient Start" value={config.buttons.primaryGradientStart} onChange={(v) => updateConfig("buttons.primaryGradientStart", v)} />
              <ColorInput label="Gradient End" value={config.buttons.primaryGradientEnd} onChange={(v) => updateConfig("buttons.primaryGradientEnd", v)} />
              <ColorInput label="Text Color" value={config.buttons.textColor} onChange={(v) => updateConfig("buttons.textColor", v)} />
              <NumberInput label="Border Radius (px)" value={config.buttons.borderRadius} onChange={(v) => updateConfig("buttons.borderRadius", v)} min={0} max={50} />
              <ToggleInput label="Shadow" value={config.buttons.shadow} onChange={(v) => updateConfig("buttons.shadow", v)} />
            </div>
          </div>
        )}

        {activeTab === "sounds" && (
          <div className={styles.section}>
            <h2>Sound Settings</h2>
            <div className={styles.grid}>
              <ToggleInput label="Sounds Enabled" value={config.sounds.enabled} onChange={(v) => updateConfig("sounds.enabled", v)} />
              <ToggleInput label="Eat Sound" value={config.sounds.eatSound} onChange={(v) => updateConfig("sounds.eatSound", v)} />
              <ToggleInput label="Hit Sound" value={config.sounds.hitSound} onChange={(v) => updateConfig("sounds.hitSound", v)} />
              <NumberInput label="Volume" value={config.sounds.volume} onChange={(v) => updateConfig("sounds.volume", v)} min={0} max={1} step={0.1} />
            </div>
          </div>
        )}
      </div>

      {message && <div className={styles.message}>{message}</div>}

      <div className={styles.actions}>
        <button onClick={handleReset} className={styles.btnSecondary} disabled={saving}>
          🔄 Reset to Default
        </button>
        <button onClick={handleSave} className={styles.btnPrimary} disabled={saving}>
          {saving ? "Saving..." : "💾 Save Settings"}
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
