'use client';

import { useEffect, useState } from 'react';

type ControlScheme = 'keyboard' | 'swipe' | 'buttons';

type Config = {
  interfaceTitle: string;
  canvasWidth: number;
  canvasHeight: number;
  gridSize: number;
  snakeSpeed: number;
  acceleration: number;
  wrapWalls: boolean;
  selfCollision: boolean;
  obstaclesEnabled: boolean;
  obstacleDensity: number;
  pointsPerFood: number;
  multiFoodEnabled: boolean;
  powerUpsEnabled: boolean;
  snakeColor: string;
  foodColor: string;
  backgroundColor: string;
  controlScheme: ControlScheme;
  soundEnabled: boolean;
};

export default function SettingsPage() {
  const [cfg, setCfg] = useState<Config | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/config', { cache: 'no-store' });
      const data = (await res.json()) as Config;
      setCfg(data);
    })();
  }, []);

  async function save() {
    if (!cfg) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(data.message || 'Kaydetme hatası');
      }
      const data = (await res.json()) as Config;
      setCfg(data);
      setMsg('Kaydedildi');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Hata';
      setMsg(message);
    } finally {
      setSaving(false);
    }
  }

  if (!cfg) return <div style={{ padding: 24 }}>Yükleniyor...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ marginBottom: 16 }}>Oyun Ayarları</h1>

      <section style={sectionStyle}>
        <h2 style={h2}>Genel</h2>
        <Grid>
          <TextField label="Başlık" value={cfg.interfaceTitle} onChange={(v) => setCfg({ ...cfg, interfaceTitle: v })} />
          <NumberField label="Canvas Genişlik" min={100} max={4096} value={cfg.canvasWidth} onChange={(v) => setCfg({ ...cfg, canvasWidth: v })} />
          <NumberField label="Canvas Yükseklik" min={100} max={4096} value={cfg.canvasHeight} onChange={(v) => setCfg({ ...cfg, canvasHeight: v })} />
        </Grid>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2}>Gameplay</h2>
        <Grid>
          <NumberField label="Grid Boyutu" min={5} max={100} value={cfg.gridSize} onChange={(v) => setCfg({ ...cfg, gridSize: v })} />
          <NumberField label="Yılan Hızı (tile/sn)" min={0.5} max={60} step={0.5} value={cfg.snakeSpeed} onChange={(v) => setCfg({ ...cfg, snakeSpeed: v })} />
          <NumberField label="Hızlanma" min={0} max={10} step={0.1} value={cfg.acceleration} onChange={(v) => setCfg({ ...cfg, acceleration: v })} />
          <Toggle label="Duvar Sarma (wrap)" checked={cfg.wrapWalls} onChange={(v) => setCfg({ ...cfg, wrapWalls: v })} />
          <Toggle label="Kendine Çarpma" checked={cfg.selfCollision} onChange={(v) => setCfg({ ...cfg, selfCollision: v })} />
          <Toggle label="Engeller" checked={cfg.obstaclesEnabled} onChange={(v) => setCfg({ ...cfg, obstaclesEnabled: v })} />
          <NumberField label="Engel Yoğunluğu" min={0} max={0.3} step={0.01} value={cfg.obstacleDensity} onChange={(v) => setCfg({ ...cfg, obstacleDensity: v })} />
          <NumberField label="Yiyecek Puanı" min={1} max={1000} value={cfg.pointsPerFood} onChange={(v) => setCfg({ ...cfg, pointsPerFood: v })} />
          <Toggle label="Çoklu Yiyecek" checked={cfg.multiFoodEnabled} onChange={(v) => setCfg({ ...cfg, multiFoodEnabled: v })} />
          <Toggle label="Güçlendirmeler" checked={cfg.powerUpsEnabled} onChange={(v) => setCfg({ ...cfg, powerUpsEnabled: v })} />
        </Grid>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2}>Görünüm</h2>
        <Grid>
          <ColorField label="Yılan Rengi" value={cfg.snakeColor} onChange={(v) => setCfg({ ...cfg, snakeColor: v })} />
          <ColorField label="Yiyecek Rengi" value={cfg.foodColor} onChange={(v) => setCfg({ ...cfg, foodColor: v })} />
          <ColorField label="Arkaplan Rengi" value={cfg.backgroundColor} onChange={(v) => setCfg({ ...cfg, backgroundColor: v })} />
          <SelectField
            label="Kontrol Şeması"
            value={cfg.controlScheme}
            options={[
              { value: 'keyboard', label: 'Klavye' },
              { value: 'swipe', label: 'Kaydırma' },
              { value: 'buttons', label: 'Butonlar' },
            ]}
            onChange={(v) => setCfg({ ...cfg, controlScheme: v as ControlScheme })}
          />
          <Toggle label="Ses" checked={cfg.soundEnabled} onChange={(v) => setCfg({ ...cfg, soundEnabled: v })} />
        </Grid>
      </section>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 16 }}>
        <button onClick={save} disabled={saving} style={buttonPrimary}>
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
        {msg && <span>{msg}</span>}
      </div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(240px, 1fr))', gap: 12 }}>{children}</div>;
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label style={labelStyle}>
      <span>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label style={labelStyle}>
      <span>{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={inputStyle}
      />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={labelStyle}>
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label style={labelStyle}>
      <span>{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: 56, height: 36, padding: 0, border: 'none' }} />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label style={labelStyle}>
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const sectionStyle: React.CSSProperties = { border: '1px solid #223', borderRadius: 8, padding: 16, marginBottom: 16 };
const h2: React.CSSProperties = { marginTop: 0, marginBottom: 12, fontSize: 18 };
const labelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6 };
const inputStyle: React.CSSProperties = { padding: '8px 10px', background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: 6 };
const buttonPrimary: React.CSSProperties = { padding: '8px 14px', borderRadius: 6, background: '#2563eb', color: 'white', border: 0, cursor: 'pointer' };
