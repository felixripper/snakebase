/**
 * Shared config store for both /api/config and /api/game-config endpoints
 * Uses Vercel KV (Redis) for persistence, with in-memory fallback
 */

import { kv } from "@vercel/kv";

type SimpleConfig = {
  backgroundColor: string;
  snakeColor: string;
  foodColor: string;
  snakeSpeed: number;
  pointsPerFood: number;
  interfaceTitle: string;
};

export const DEFAULT_SIMPLE_CONFIG: SimpleConfig = {
  backgroundColor: "#0052FF",
  snakeColor: "#dfb4b4",
  foodColor: "#e1ff00",
  snakeSpeed: 6,
  pointsPerFood: 30,
  interfaceTitle: "Eat & Grow",
};

export const KEY = "game_config_v1";

// Shared in-memory store (fallback only)
let memoryStore: SimpleConfig | null = null;

export function getMemoryStore(): SimpleConfig | null {
  return memoryStore;
}

export function setMemoryStore(config: SimpleConfig): void {
  memoryStore = config;
}

/**
 * Get config from Vercel KV or fallback to memory/default
 */
export async function getConfig(): Promise<SimpleConfig> {
  try {
    const stored = await kv.get<SimpleConfig>(KEY);
    if (stored) {
      setMemoryStore(stored); // Sync to memory
      return stored;
    }
  } catch (err) {
    console.warn("Vercel KV read failed:", err);
  }
  
  // Fallback to memory or default
  return memoryStore ?? DEFAULT_SIMPLE_CONFIG;
}

/**
 * Save config to Vercel KV and memory
 */
export async function saveConfig(config: SimpleConfig): Promise<void> {
  setMemoryStore(config); // Always update memory
  
  try {
    await kv.set(KEY, config);
  } catch (err) {
    console.error("Vercel KV write failed:", err);
    // Continue with memory fallback
  }
}

export function getErrorMessage(error: unknown, fallback = "Internal Server Error") {
  if (error instanceof Error && typeof error.message === "string") {
    return error.message;
  }
  if (typeof error === "string" && error) {
    return error;
  }
  return fallback;
}

export function validateConfig(input: Partial<SimpleConfig>): { ok: true; value: SimpleConfig } | { ok: false; message: string } {
  const colorRe = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  const cfg: SimpleConfig = { ...DEFAULT_SIMPLE_CONFIG, ...input };

  if (!colorRe.test(cfg.backgroundColor)) return { ok: false, message: "Invalid backgroundColor" };
  if (!colorRe.test(cfg.snakeColor)) return { ok: false, message: "Invalid snakeColor" };
  if (!colorRe.test(cfg.foodColor)) return { ok: false, message: "Invalid foodColor" };

  if (!Number.isFinite(cfg.snakeSpeed) || cfg.snakeSpeed < 1 || cfg.snakeSpeed > 30) {
    return { ok: false, message: "snakeSpeed must be between 1 and 30" };
  }
  if (!Number.isFinite(cfg.pointsPerFood) || cfg.pointsPerFood < 1 || cfg.pointsPerFood > 5000) {
    return { ok: false, message: "pointsPerFood must be between 1 and 5000" };
  }
  cfg.interfaceTitle = String(cfg.interfaceTitle ?? "").slice(0, 40) || DEFAULT_SIMPLE_CONFIG.interfaceTitle;

  return { ok: true, value: cfg };
}

export type { SimpleConfig };
