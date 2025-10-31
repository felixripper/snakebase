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

  // Genel tema ayarları - sayfaların görünümü için
  theme: z.object({
    // Sayfa arka planları
    pageBackground: z.string().default('linear-gradient(135deg, #667eea 0%, #764ba2 100%)'),
    pageBackgroundDark: z.string().default('linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'),
    cardBackground: z.string().default('#ffffff'),
    cardBackgroundDark: z.string().default('#1f2937'),

    // Yazı tipleri ve renkleri
    fontFamily: z.string().default('system-ui, -apple-system, sans-serif'),
    headingColor: z.string().default('#1f2937'),
    headingColorDark: z.string().default('#f9fafb'),
    textColor: z.string().default('#374151'),
    textColorDark: z.string().default('#d1d5db'),
    mutedTextColor: z.string().default('#6b7280'),
    mutedTextColorDark: z.string().default('#9ca3af'),

    // Buton renkleri
    primaryButtonBg: z.string().default('linear-gradient(135deg, #667eea 0%, #764ba2 100%)'),
    primaryButtonText: z.string().default('#ffffff'),
    secondaryButtonBg: z.string().default('#f3f4f6'),
    secondaryButtonText: z.string().default('#374151'),
    dangerButtonBg: z.string().default('#dc2626'),
    dangerButtonText: z.string().default('#ffffff'),

    // Kenarlık ve gölge
    borderRadius: z.number().min(0).max(50).default(12),
    shadowColor: z.string().default('rgba(0, 0, 0, 0.1)'),
    shadowColorDark: z.string().default('rgba(0, 0, 0, 0.3)'),

    // Özel renkler
    accentColor: z.string().default('#667eea'),
    successColor: z.string().default('#10b981'),
    warningColor: z.string().default('#f59e0b'),
    errorColor: z.string().default('#ef4444'),
  }).default({}),

  // Yem ayarları
  foodIcon: z.object({
    type: z.enum(['emoji', 'image']).default('emoji'),
    value: z.string().default('🍎'), // emoji veya image path
    size: z.number().min(0.5).max(3).default(1), // multiplier
    animation: z.enum(['none', 'pulse', 'rotate', 'bounce']).default('none'),
  }).default({}),

  // Lider tablosu görünümü
  leaderboardUI: z.object({
    headerBackground: z.string().default('linear-gradient(135deg, #667eea 0%, #764ba2 100%)'),
    headerTextColor: z.string().default('#ffffff'),
    rowBackgroundEven: z.string().default('#ffffff'),
    rowBackgroundOdd: z.string().default('#f8f9fa'),
    rowBackgroundHover: z.string().default('#e9ecef'),
    currentUserHighlight: z.string().default('#fff3cd'),
    topThreeBackground: z.string().default('#fef3c7'),
    textColor: z.string().default('#333333'),
    fontSize: z.number().min(10).max(24).default(14),
    borderRadius: z.number().min(0).max(30).default(12),
    spacing: z.number().min(0).max(40).default(20),
  }).default({}),

  // Profil sayfası görünümü
  profileUI: z.object({
    cardBackground: z.string().default('#ffffff'),
    cardShadow: z.string().default('0 4px 12px rgba(0,0,0,0.1)'),
    headerGradient: z.string().default('linear-gradient(135deg, #667eea 0%, #764ba2 100%)'),
    statCardBackground: z.string().default('#ffffff'),
    statValueColor: z.string().default('#667eea'),
    statLabelColor: z.string().default('#666666'),
    borderRadius: z.number().min(0).max(30).default(12),
    spacing: z.number().min(0).max(40).default(20),
  }).default({}),

  // Kayıt formu görünümü
  registrationUI: z.object({
    cardBackground: z.string().default('#ffffff'),
    inputBorderColor: z.string().default('#e0e0e0'),
    inputFocusColor: z.string().default('#667eea'),
    buttonGradient: z.string().default('linear-gradient(135deg, #667eea 0%, #764ba2 100%)'),
    buttonTextColor: z.string().default('#ffffff'),
    errorColor: z.string().default('#dc3545'),
    successColor: z.string().default('#28a745'),
    borderRadius: z.number().min(0).max(30).default(8),
  }).default({}),

  // Skor gönderme popup görünümü
  scoreSubmissionUI: z.object({
    cardBackground: z.string().default('#ffffff'),
    scoreDisplayGradient: z.string().default('linear-gradient(135deg, #667eea 0%, #764ba2 100%)'),
    buttonGradient: z.string().default('linear-gradient(135deg, #667eea 0%, #764ba2 100%)'),
    buttonTextColor: z.string().default('#ffffff'),
    cancelButtonBackground: z.string().default('#e0e0e0'),
    cancelButtonTextColor: z.string().default('#333333'),
    borderRadius: z.number().min(0).max(30).default(16),
  }).default({}),

  difficultyPresets: z
    .object({
      easy: z.record(z.unknown()).default({ snakeSpeed: 3, acceleration: 0, obstaclesEnabled: false }),
      normal: z.record(z.unknown()).default({ snakeSpeed: 5 }),
      hard: z.record(z.unknown()).default({ snakeSpeed: 8, acceleration: 0.5, selfCollision: true, obstaclesEnabled: true }),
    })
    .default({}),
});

export type GameConfig = z.infer<typeof GameConfigSchema>;

export const DEFAULT_CONFIG: GameConfig = GameConfigSchema.parse({});

// Tip güvenli birleştirme (nested objectler için)
function mergeConfig(base: GameConfig, patch: Partial<GameConfig>): GameConfig {
  const merged: GameConfig = {
    ...base,
    ...patch,
    foodIcon: {
      ...base.foodIcon,
      ...(patch.foodIcon ?? {}),
    },
    leaderboardUI: {
      ...base.leaderboardUI,
      ...(patch.leaderboardUI ?? {}),
    },
    profileUI: {
      ...base.profileUI,
      ...(patch.profileUI ?? {}),
    },
    registrationUI: {
      ...base.registrationUI,
      ...(patch.registrationUI ?? {}),
    },
    scoreSubmissionUI: {
      ...base.scoreSubmissionUI,
      ...(patch.scoreSubmissionUI ?? {}),
    },
    theme: {
      ...base.theme,
      ...(patch.theme ?? {}),
    },
    difficultyPresets: {
      ...base.difficultyPresets,
      ...(patch.difficultyPresets ?? {}),
    },
  };
  return merged;
}

export async function getConfig(): Promise<GameConfig> {
  const raw = await kvGet(CONFIG_KEY);
  if (!raw) return DEFAULT_CONFIG;
  try {
    const parsed = GameConfigSchema.partial().parse(JSON.parse(raw));
    return mergeConfig(DEFAULT_CONFIG, parsed);
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function setConfig(patch: Partial<GameConfig>): Promise<GameConfig> {
  const current = await getConfig();
  const validatedPatch = GameConfigSchema.partial().parse(patch);
  const merged = mergeConfig(current, validatedPatch);
  const validated = GameConfigSchema.parse(merged);
  await kvSet(CONFIG_KEY, JSON.stringify(validated));
  return validated;
}
