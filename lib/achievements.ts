import { kvGet, kvSet } from '@/lib/redis';
import { getUserById } from '@/lib/user-store';
import { memoryCache } from '@/lib/cache';

// Achievements key
const ACHIEVEMENTS_KEY = (userId: string) => `achievements:${userId}`;
const DAILY_QUEST_KEY = (userId: string) => `dailyquest:${userId}`;

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: PlayerStats) => boolean;
  unlockedAt?: number;
};

export type PlayerStats = {
  totalGames: number;
  highScore: number;
  totalScore: number;
};

export type DailyQuest = {
  date: string; // YYYY-MM-DD
  goal: number; // games to play today
  progress: number;
  completed: boolean;
};

// Predefined achievements
const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_game',
    name: 'İlk Oyun',
    description: 'İlk oyununu tamamla',
    icon: '🎮',
    condition: (s) => s.totalGames >= 1
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: '10 oyun oyna',
    icon: '🏅',
    condition: (s) => s.totalGames >= 10
  },
  {
    id: 'centurion',
    name: 'Centurion',
    description: '100 oyun oyna',
    icon: '🏆',
    condition: (s) => s.totalGames >= 100
  },
  {
    id: 'beginner_score',
    name: 'Başlangıç',
    description: '100 puan topla',
    icon: '⭐',
    condition: (s) => s.highScore >= 100
  },
  {
    id: 'intermediate_score',
    name: 'Orta Seviye',
    description: '500 puan topla',
    icon: '🌟',
    condition: (s) => s.highScore >= 500
  },
  {
    id: 'expert_score',
    name: 'Uzman',
    description: '1000 puan topla',
    icon: '💫',
    condition: (s) => s.highScore >= 1000
  },
  {
    id: 'master_score',
    name: 'Master',
    description: '2000 puan topla',
    icon: '🔥',
    condition: (s) => s.highScore >= 2000
  }
];

export async function getPlayerAchievements(userId: string): Promise<{ unlocked: Achievement[]; locked: Achievement[] }> {
  // Check cache first (2 minute TTL)
  const cacheKey = `achievements:cache:${userId}`;
  const cached = memoryCache.get<{ unlocked: Achievement[]; locked: Achievement[] }>(cacheKey, 120_000);
  if (cached) return cached;

  const raw = await kvGet(ACHIEVEMENTS_KEY(userId));
  const unlocked: Record<string, number> = raw ? JSON.parse(raw) : {};

  const user = await getUserById(userId);
  if (!user) return { unlocked: [], locked: ALL_ACHIEVEMENTS };

  // Dummy stats from user; ideally we'd pull from score-store
  const _stats: PlayerStats = { totalGames: 0, highScore: 0, totalScore: 0 };

  const unlockedList: Achievement[] = [];
  const lockedList: Achievement[] = [];

  for (const ach of ALL_ACHIEVEMENTS) {
    if (unlocked[ach.id]) {
      unlockedList.push({ ...ach, unlockedAt: unlocked[ach.id] });
    } else {
      lockedList.push(ach);
    }
  }

  const result = { unlocked: unlockedList, locked: lockedList };
  memoryCache.set(cacheKey, result);
  return result;
}

export async function checkAndUnlockAchievements(userId: string, stats: PlayerStats): Promise<Achievement[]> {
  const raw = await kvGet(ACHIEVEMENTS_KEY(userId));
  const unlocked: Record<string, number> = raw ? JSON.parse(raw) : {};
  const newlyUnlocked: Achievement[] = [];

  for (const ach of ALL_ACHIEVEMENTS) {
    if (!unlocked[ach.id] && ach.condition(stats)) {
      unlocked[ach.id] = Date.now();
      newlyUnlocked.push({ ...ach, unlockedAt: Date.now() });
    }
  }

  if (newlyUnlocked.length > 0) {
    await kvSet(ACHIEVEMENTS_KEY(userId), JSON.stringify(unlocked));
    // Invalidate cache
    memoryCache.delete(`achievements:cache:${userId}`);
  }

  return newlyUnlocked;
}

export async function getDailyQuest(userId: string): Promise<DailyQuest> {
  const today = new Date().toISOString().split('T')[0];
  const raw = await kvGet(DAILY_QUEST_KEY(userId));
  const quest: DailyQuest = raw ? JSON.parse(raw) : { date: '', goal: 5, progress: 0, completed: false };

  if (quest.date !== today) {
    // Reset daily quest
    return { date: today, goal: 5, progress: 0, completed: false };
  }
  return quest;
}

export async function progressDailyQuest(userId: string, increment = 1): Promise<DailyQuest> {
  const quest = await getDailyQuest(userId);
  quest.progress = Math.min(quest.progress + increment, quest.goal);
  if (quest.progress >= quest.goal) quest.completed = true;
  await kvSet(DAILY_QUEST_KEY(userId), JSON.stringify(quest));
  return quest;
}
