import { kvGet, kvSet } from '@/lib/redis';
import { getUserById, getUserByWallet } from '@/lib/user-store';

// Keys
const WALLETS_SET_KEY = 'scores:wallets'; // JSON stringified string[] as fallback for set
const HIGH_KEY = (wallet: string) => `scores:high:${wallet}`; // stringified number
const DISPLAY_KEY = (wallet: string) => `scores:display:${wallet}`; // username display cache
const HISTORY_KEY = (wallet: string) => `scores:history:${wallet}`; // JSON string array of entries

export type LeaderboardRow = {
  walletAddress: string;
  username: string;
  score: number;
};

type HistoryEntry = { ts: number; score: number };

async function addWalletToSet(wallet: string): Promise<void> {
  const raw = await kvGet(WALLETS_SET_KEY);
  const arr = raw ? (JSON.parse(raw) as string[]) : [];
  if (!arr.includes(wallet)) {
    arr.push(wallet);
    await kvSet(WALLETS_SET_KEY, JSON.stringify(arr));
  }
}

export async function submitScoreForSession(userId: string, score: number): Promise<void> {
  if (!Number.isFinite(score) || score < 0) return;
  const user = await getUserById(userId);
  if (!user || !user.walletAddress) return; // Only record if wallet linked
  const wallet = user.walletAddress.toLowerCase();

  // Update high score (max)
  const existingHighRaw = await kvGet(HIGH_KEY(wallet));
  const existingHigh = existingHighRaw ? Number(existingHighRaw) : 0;
  const newHigh = Math.max(existingHigh, Math.floor(score));
  if (newHigh !== existingHigh) {
    await kvSet(HIGH_KEY(wallet), String(newHigh));
  }

  // Cache display username
  const display = user.username || wallet.slice(0, 6) + '...' + wallet.slice(-4);
  await kvSet(DISPLAY_KEY(wallet), display);

  // Append to history (bounded to 100)
  const histRaw = await kvGet(HISTORY_KEY(wallet));
  const hist: HistoryEntry[] = histRaw ? JSON.parse(histRaw) as HistoryEntry[] : [];
  hist.push({ ts: Date.now(), score: Math.floor(score) });
  // Keep last 100
  const trimmed = hist.slice(-100);
  await kvSet(HISTORY_KEY(wallet), JSON.stringify(trimmed));

  // Track wallets set
  await addWalletToSet(wallet);
}

export async function getTopHighScores(limit = 25): Promise<LeaderboardRow[]> {
  const raw = await kvGet(WALLETS_SET_KEY);
  const wallets: string[] = raw ? (JSON.parse(raw) as string[]) : [];
  const rows: LeaderboardRow[] = [];
  for (const w of wallets) {
    const sRaw = await kvGet(HIGH_KEY(w));
    if (!sRaw) continue;
    const score = Number(sRaw) || 0;
    if (score <= 0) continue;
    let username = (await kvGet(DISPLAY_KEY(w))) || '';
    if (!username) {
      const u = await getUserByWallet(w);
      username = u?.username || w.slice(0, 6) + '...' + w.slice(-4);
    }
    rows.push({ walletAddress: w, username, score });
  }
  rows.sort((a, b) => b.score - a.score);
  return rows.slice(0, limit);
}

export async function getHistoryByWallet(wallet: string, limit = 50): Promise<HistoryEntry[]> {
  const w = wallet.toLowerCase();
  const histRaw = await kvGet(HISTORY_KEY(w));
  const hist: HistoryEntry[] = histRaw ? JSON.parse(histRaw) as HistoryEntry[] : [];
  return hist.slice(-limit).reverse();
}
