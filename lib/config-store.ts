/**
 * Shared config store for both /api/config and /api/game-config endpoints
 * Uses Upstash Redis for persistence, with in-memory fallback
 */

import { Redis } from "@upstash/redis";

// Legacy simple config for backward compatibility
type SimpleConfig = {
  backgroundColor: string;
  snakeColor: string;
  foodColor: string;
  snakeSpeed: number;
  pointsPerFood: number;
  interfaceTitle: string;
};

// Full game configuration with all customizable options
export type FullGameConfig = {
  colors: {
    background: string;
    grid: string;
    snakeHead: string;
    snakeBody: string;
    foodPrimary: string;
    foodSecondary: string;
    particle: string;
    ui: string;
    noPlay: string;
  };
  player: {
    baseSpeed: number;
    speedIncreasePerFood: number;
    minStepMs: number;
    roundedHead: number;
    roundedBody: number;
  };
  gameplay: {
    gridSize: number;
    columns: number;
    rows: number;
    wrapWalls: boolean;
    startLength: number;
    foodScore: number;
    particles: boolean;
    foodShape: "heart" | "circle" | "square";
    foodKind: "burger" | "heart" | "star";
    topNoPlayRows: number;
    noPlayActsAs: "wrap" | "wall";
  };
  ui: {
    showGrid: boolean;
    showSwipeHint: boolean;
    interfaceTitle: string;
  };
  typography: {
    fontFamily: string;
    titleSize: number;
    titleWeight: number;
    subtitleSize: number;
    buttonSize: number;
    buttonWeight: number;
    hudSize: number;
  };
  buttons: {
    primaryColor: string;
    primaryGradientStart: string;
    primaryGradientEnd: string;
    textColor: string;
    borderRadius: number;
    shadow: boolean;
  };
  sounds: {
    enabled: boolean;
    eatSound: boolean;
    hitSound: boolean;
    volume: number;
  };
  difficulty: "easy" | "normal" | "hard";
};

export const DEFAULT_FULL_CONFIG: FullGameConfig = {
  colors: {
    background: "#0052FF",
    grid: "#1c60f2",
    snakeHead: "#dfb4b4",
    snakeBody: "#ffffff",
    foodPrimary: "#e1ff00",
    foodSecondary: "#fff700",
    particle: "#ffffff",
    ui: "#ffffff",
    noPlay: "#06103a"
  },
  player: {
    baseSpeed: 6,
    speedIncreasePerFood: 0.6,
    minStepMs: 140,
    roundedHead: 0.39,
    roundedBody: 0.1
  },
  gameplay: {
    gridSize: 30,
    columns: 20,
    rows: 28,
    wrapWalls: true,
    startLength: 7,
    foodScore: 30,
    particles: true,
    foodShape: "heart",
    foodKind: "burger",
    topNoPlayRows: 3,
    noPlayActsAs: "wrap"
  },
  ui: {
    showGrid: false,
    showSwipeHint: false,
    interfaceTitle: "Eat & Grow"
  },
  typography: {
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    titleSize: 28,
    titleWeight: 900,
    subtitleSize: 14,
    buttonSize: 16,
    buttonWeight: 800,
    hudSize: 14
  },
  buttons: {
    primaryColor: "#3ee686",
    primaryGradientStart: "#94f7b7",
    primaryGradientEnd: "#3ee686",
    textColor: "#0b0f1a",
    borderRadius: 12,
    shadow: true
  },
  sounds: {
    enabled: true,
    eatSound: true,
    hitSound: true,
    volume: 0.5
  },
  difficulty: "normal"
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
export const KEY_FULL = "game_config_full_v1";

// Shared in-memory store (supports both formats)
let memoryStore: SimpleConfig | null = null;
let memoryStoreFull: FullGameConfig | null = null;

export function getMemoryStore(): SimpleConfig | null {
  return memoryStore;
}

export function setMemoryStore(config: SimpleConfig): void {
  memoryStore = config;
}

export function getMemoryStoreFull(): FullGameConfig | null {
  return memoryStoreFull;
}

export function setMemoryStoreFull(config: FullGameConfig): void {
  memoryStoreFull = config;
}

/**
 * Convert SimpleConfig to FullGameConfig (backward compatibility)
 */
export function simpleToFull(simple: SimpleConfig): FullGameConfig {
  return {
    ...DEFAULT_FULL_CONFIG,
    colors: {
      ...DEFAULT_FULL_CONFIG.colors,
      background: simple.backgroundColor,
      snakeHead: simple.snakeColor,
      foodPrimary: simple.foodColor
    },
    player: {
      ...DEFAULT_FULL_CONFIG.player,
      baseSpeed: simple.snakeSpeed
    },
    gameplay: {
      ...DEFAULT_FULL_CONFIG.gameplay,
      foodScore: simple.pointsPerFood
    },
    ui: {
      ...DEFAULT_FULL_CONFIG.ui,
      interfaceTitle: simple.interfaceTitle
    }
  };
}

/**
 * Convert FullGameConfig to SimpleConfig (backward compatibility)
 */
export function fullToSimple(full: FullGameConfig): SimpleConfig {
  return {
    backgroundColor: full.colors.background,
    snakeColor: full.colors.snakeHead,
    foodColor: full.colors.foodPrimary,
    snakeSpeed: full.player.baseSpeed,
    pointsPerFood: full.gameplay.foodScore,
    interfaceTitle: full.ui.interfaceTitle
  };
}

/**
 * Initialize Redis client with Vercel KV environment variables
 */
function getRedisClient(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) {
    console.warn("Redis env vars not found, using in-memory fallback");
    return null;
  }
  
  return new Redis({ url, token });
}

/**
 * Get config from Upstash Redis or fallback to memory/default (Simple format for backward compatibility)
 */
export async function getConfig(): Promise<SimpleConfig> {
  try {
    const redis = getRedisClient();
    if (redis) {
      // Try to get full config first
      const storedFull = await redis.get<FullGameConfig>(KEY_FULL);
      if (storedFull) {
        setMemoryStoreFull(storedFull);
        return fullToSimple(storedFull);
      }
      
      // Fallback to simple config
      const stored = await redis.get<SimpleConfig>(KEY);
      if (stored) {
        setMemoryStore(stored);
        return stored;
      }
    }
  } catch (err) {
    console.warn("Upstash Redis read failed:", err);
  }
  
  // Fallback to memory or default
  if (memoryStoreFull) return fullToSimple(memoryStoreFull);
  return memoryStore ?? DEFAULT_SIMPLE_CONFIG;
}

/**
 * Get full config from Upstash Redis or fallback to memory/default
 */
export async function getFullConfig(): Promise<FullGameConfig> {
  try {
    const redis = getRedisClient();
    if (redis) {
      const stored = await redis.get<FullGameConfig>(KEY_FULL);
      if (stored) {
        setMemoryStoreFull(stored);
        return stored;
      }
      
      // Try to migrate from simple config
      const simpleStored = await redis.get<SimpleConfig>(KEY);
      if (simpleStored) {
        const full = simpleToFull(simpleStored);
        setMemoryStoreFull(full);
        return full;
      }
    }
  } catch (err) {
    console.warn("Upstash Redis read failed:", err);
  }
  
  // Fallback to memory or default
  return memoryStoreFull ?? DEFAULT_FULL_CONFIG;
}

/**
 * Save config to Upstash Redis and memory (Simple format for backward compatibility)
 */
export async function saveConfig(config: SimpleConfig): Promise<void> {
  setMemoryStore(config);
  
  try {
    const redis = getRedisClient();
    if (redis) {
      await redis.set(KEY, config);
      console.log("Simple config saved to Upstash Redis");
    } else {
      console.log("Simple config saved to memory only (Redis not configured)");
    }
  } catch (err) {
    console.error("Upstash Redis write failed:", err);
  }
}

/**
 * Save full config to Upstash Redis and memory
 */
export async function saveFullConfig(config: FullGameConfig): Promise<void> {
  setMemoryStoreFull(config);
  
  try {
    const redis = getRedisClient();
    if (redis) {
      await redis.set(KEY_FULL, config);
      // Also save as simple config for backward compatibility
      await redis.set(KEY, fullToSimple(config));
      console.log("Full config saved to Upstash Redis");
    } else {
      console.log("Full config saved to memory only (Redis not configured)");
    }
  } catch (err) {
    console.error("Upstash Redis write failed:", err);
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

export function validateFullConfig(input: Partial<FullGameConfig>): { ok: true; value: FullGameConfig } | { ok: false; message: string } {
  const colorRe = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  const cfg: FullGameConfig = { ...DEFAULT_FULL_CONFIG, ...input };

  // Validate colors
  const colors = cfg.colors || {};
  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === 'string' && !colorRe.test(value)) {
      return { ok: false, message: `Invalid color: ${key}` };
    }
  }

  // Validate player settings
  if (cfg.player.baseSpeed < 1 || cfg.player.baseSpeed > 30) {
    return { ok: false, message: "baseSpeed must be between 1 and 30" };
  }
  if (cfg.player.speedIncreasePerFood < 0 || cfg.player.speedIncreasePerFood > 5) {
    return { ok: false, message: "speedIncreasePerFood must be between 0 and 5" };
  }

  // Validate gameplay settings
  if (cfg.gameplay.foodScore < 1 || cfg.gameplay.foodScore > 10000) {
    return { ok: false, message: "foodScore must be between 1 and 10000" };
  }
  if (cfg.gameplay.startLength < 1 || cfg.gameplay.startLength > 20) {
    return { ok: false, message: "startLength must be between 1 and 20" };
  }

  // Validate typography
  if (cfg.typography.titleSize < 12 || cfg.typography.titleSize > 72) {
    return { ok: false, message: "titleSize must be between 12 and 72" };
  }

  // Validate sounds
  if (cfg.sounds.volume < 0 || cfg.sounds.volume > 1) {
    return { ok: false, message: "volume must be between 0 and 1" };
  }

  return { ok: true, value: cfg };
}

export type { SimpleConfig };
