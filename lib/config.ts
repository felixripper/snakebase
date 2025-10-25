import { z } from 'zod';
import { kvGet, kvSet } from './redis';

const CONFIG_KEY = 'config:game';

export const GameConfigSchema = z.object({
  interfaceTitle: z.string().default('Snakebase'),
  canvasWidth: z.number().int().min(100).max(4096).default(640),
  canvasHeight: z.number().int().min(100).max(4096).default(480),

  gridSize: z.number().int().min(5).max(100).default(20),
  snakeSpeed: z.number().min(0.5).max(60).default(5),
  acceleration: z.number().min(0).max(10).default(0),
  wrapWalls: z.boolean().default(true),
  selfCollision: z.boolean().default(true),
  obstaclesEnabled: z.boolean().default(false),
  obstacleDensity: z.number().min(0).max(0.3).default(0.05),

  pointsPerFood: z.number().int().min(1).max(1000).default(10),
  multiFoodEnabled: z.boolean().default(false),
  powerUpsEnabled: z.boolean().default(false),

  snakeColor: z.string().default('#22c55e'),
  foodColor: z.string().default('#ef4444'),
  backgroundColor: z.string().default('#0b1220'),

  controlScheme: z.enum(['keyboard', 'swipe', 'buttons']).default('keyboard'),
  soundEnabled: z.boolean().default(true),

  difficultyPresets: z
    .object({
      easy: z.record(z.any()).default({ snakeSpeed: 3, acceleration: 0, obstaclesEnabled: false }),
      normal: z.record(z.any()).default({ snakeSpeed: 5 }),
      hard: z.record(z.any()).default({ snakeSpeed: 8, acceleration: 0.5, selfCollision: true, obstaclesEnabled: true }),
    })
    .default({}),
});

export type GameConfig = z.infer<typeof GameConfigSchema>;

export const DEFAULT_CONFIG: GameConfig = GameConfigSchema.parse({});

function isPlainObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function mergeDeep<T>(base: T, patch: Partial<T>): T {
  const out: any = Array.isArray(base) ? [...(base as any)] : { ...(base as any) };
  for (const [k, v] of Object.entries(patch as any)) {
    if (v === undefined) continue;
    if (isPlainObject(v) && isPlainObject((out as any)[k])) {
      (out as any)[k] = mergeDeep((out as any)[k], v as any);
    } else {
      (out as any)[k] = v;
    }
  }
  return out as T;
}

export async function getConfig(): Promise<GameConfig> {
  const raw = await kvGet(CONFIG_KEY);
  if (!raw) return DEFAULT_CONFIG;
  try {
    const parsed = JSON.parse(raw);
    return GameConfigSchema.parse(mergeDeep(DEFAULT_CONFIG, parsed));
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function setConfig(patch: Partial<GameConfig>): Promise<GameConfig> {
  const merged = mergeDeep(await getConfig(), patch);
  const validated = GameConfigSchema.parse(merged);
  await kvSet(CONFIG_KEY, JSON.stringify(validated));
  return validated;
}