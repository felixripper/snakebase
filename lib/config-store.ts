/**
 * Shared config store for both /api/config and /api/game-config endpoints
 * Provides in-memory fallback when Upstash Redis is not available
 */

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

// Shared in-memory store
let memoryStore: SimpleConfig | null = null;

export function getMemoryStore(): SimpleConfig | null {
  return memoryStore;
}

export function setMemoryStore(config: SimpleConfig): void {
  memoryStore = config;
}

export function hasUpstash(): boolean {
  return Boolean(
    (process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REST_URL) &&
    (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REST_TOKEN)
  );
}

export function env() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REST_TOKEN;
  if (!url || !token) {
    throw new Error("Missing UPSTASH_REDIS_REST_URL/UPSTASH_REST_URL or UPSTASH_REDIS_REST_TOKEN/UPSTASH_REST_TOKEN");
  }
  return { url, token };
}

export type UpstashResponse = { result: unknown; error?: string };

export async function upstashPipeline(cmds: string[][]): Promise<UpstashResponse[]> {
  const { url, token } = env();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmds),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upstash error: ${res.status} ${text}`);
  }
  return (await res.json()) as UpstashResponse[];
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
