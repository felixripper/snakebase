"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SimpleConfig = {
  backgroundColor: string;
  snakeColor: string;
  foodColor: string;
  snakeSpeed: number;
  pointsPerFood: number;
  interfaceTitle: string;
};

const DEFAULTS: SimpleConfig = {
  backgroundColor: "#0052FF",
  snakeColor: "#dfb4b4",
  foodColor: "#e1ff00",
  snakeSpeed: 6,
  pointsPerFood: 30,
  interfaceTitle: "Eat & Grow",
};

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && typeof error.message === "string") {
    return error.message;
  }
  if (typeof error === "string" && error) {
    return error;
  }
  return fallback;
}

export default function ControlPanel() {
  const [cfg, setCfg] = useState<SimpleConfig>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/game-config", { cache: "no-store" });
        if (!res.ok) throw new Error(`GET /api/game-config failed: ${res.status}`);
        const data = (await res.json()) as SimpleConfig;
        if (!cancelled) setCfg(data);
      } catch (error: unknown) {
        if (!cancelled) setError(getErrorMessage(error, "Konfigürasyon alınamadı"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fullPatchForGame = useMemo(() => {
    return {
      colors: {
        background: cfg.backgroundColor || DEFAULTS.backgroundColor,
        grid: "#1c60f2",
        snakeHead: cfg.snakeColor || DEFAULTS.snakeColor,
        snakeBody: "#ffffff",
        foodPrimary: cfg.foodColor || DEFAULTS.foodColor,
        foodSecondary: "#fff700",
        particle: "#ffffff",
        ui: "#ffffff",
        noPlay: "#06103a",
      },
      player: {
        baseSpeed: cfg.snakeSpeed ?? DEFAULTS.snakeSpeed,
        speedIncreasePerFood: 0.6,
        minStepMs: 140,
        roundedHead: 0.39,
        roundedBody: 0.1,
      },
      gameplay: {
        gridSize: 30,
        columns: 20,
        rows: 28,
        wrapWalls: true,
        startLength: 7,
        foodScore: cfg.pointsPerFood ?? DEFAULTS.pointsPerFood,
        particles: true,
        foodShape: "heart",
        foodKind: "burger",
        topNoPlayRows: 3,
        noPlayActsAs: "wrap",
      },
      ui: {
        showGrid: false,
        showSwipeHint: false,
        interfaceTitle: cfg.interfaceTitle || DEFAULTS.interfaceTitle,
      },
      difficulty: "normal",
    };
  }, [cfg]);

  useEffect(() => {
    const w = iframeRef.current?.contentWindow;
    if (!w) return;
    w.postMessage({ type: "UPDATE_CONFIG", config: fullPatchForGame }, window.location.origin);
  }, [fullPatchForGame]);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/game-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cfg),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.error || `PUT failed: ${res.status}`);
      }
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Kaydedilemedi"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 16, height: "100vh", padding: 16, boxSizing: "border-box", background: "#0b0f1a", color: "#fff", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" }}>
      <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16 }}>
        <h2 style={{ margin: "4px 0 12px" }}>Control Panel</h2>
        {loading ? <div>Yükleniyor…</div> : null}
        {error ? <div style={{ color: "#ff7d7d", marginBottom: 8 }}>Hata: {error}</div> : null}

        <div style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Interface Title</span>
            <input
              type="text"
              value={cfg.interfaceTitle}
              onChange={(e) => setCfg((c) => ({ ...c, interfaceTitle: e.target.value }))}
              maxLength={40}
              style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "#101421", color: "#fff" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Background Color</span>
            <input
              type="text"
              value={cfg.backgroundColor}
              onChange={(e) => setCfg((c) => ({ ...c, backgroundColor: e.target.value }))}
              placeholder="#0052FF"
              style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "#101421", color: "#fff" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Snake Color</span>
            <input
              type="text"
              value={cfg.snakeColor}
              onChange={(e) => setCfg((c) => ({ ...c, snakeColor: e.target.value }))}
              placeholder="#dfb4b4"
              style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "#101421", color: "#fff" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Food Color</span>
            <input
              type="text"
              value={cfg.foodColor}
              onChange={(e) => setCfg((c) => ({ ...c, foodColor: e.target.value }))}
              placeholder="#e1ff00"
              style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "#101421", color: "#fff" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Snake Speed</span>
            <input
              type="number"
              min={1}
              max={30}
              value={cfg.snakeSpeed}
              onChange={(e) => setCfg((c) => ({ ...c, snakeSpeed: Number(e.target.value) }))}
              style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "#101421", color: "#fff" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Points Per Food</span>
            <input
              type="number"
              min={1}
              max={5000}
              value={cfg.pointsPerFood}
              onChange={(e) => setCfg((c) => ({ ...c, pointsPerFood: Number(e.target.value) }))}
              style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "#101421", color: "#fff" }}
            />
          </label>

          <button
            onClick={save}
            disabled={saving}
            style={{ marginTop: 8, padding: "12px 14px", borderRadius: 10, border: "none", fontWeight: 800, letterSpacing: 0.3, background: "linear-gradient(180deg, #94f7b7 0%, #3ee686 100%)", color: "#0b0f1a", cursor: "pointer" }}
          >
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>

          <div style={{ fontSize: 12, opacity: 0.8 }}>
            Kaydedince kalıcı olur. Sağdaki önizleme alanı (iframe) panel değişikliklerinde anında güncellenir.
          </div>
        </div>
      </div>

      <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
        <iframe
          ref={iframeRef}
          src="/eat-grow.html"
          title="Preview"
          style={{ width: "100%", height: "100%", border: "none", background: "#000" }}
        />
      </div>
    </div>
  );
}
