import { kvGet, kvSet } from './redis';
import { memoryCache } from './cache';

// User type definition
export interface User {
  id: string;
  username: string;
  createdAt: number;
  walletAddress: string;
  avatarUrl?: string; // Optional avatar URL
}

// Redis key patterns
const USER_BY_USERNAME_KEY = (username: string) => `user:username:${username.toLowerCase()}`;
const USER_BY_ID_KEY = (id: string) => `user:id:${id}`;
const USER_BY_WALLET_KEY = (wallet: string) => `user:wallet:${wallet.toLowerCase()}`;

// Generate unique user ID
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
// Create or return user with wallet
export async function createUserWithWallet(
  walletAddress: string,
  suggestedUsername?: string
): Promise<User> {
  const walletLower = walletAddress.toLowerCase();

  // If user already exists by wallet, return it
  const existing = await getUserByWallet(walletLower);
  if (existing) return existing;

  // Generate unique username
  const baseName = (suggestedUsername || `player_${walletLower.slice(2, 6)}`).toLowerCase();
  let uname = baseName;
  let counter = 0;
  while (await kvGet(USER_BY_USERNAME_KEY(uname))) {
    counter += 1;
    uname = `${baseName}_${counter}`;
  }

  const userId = generateUserId();

  const user: User = {
    id: userId,
    username: uname,
    createdAt: Date.now(),
    walletAddress: walletLower,
  };

  const userData = JSON.stringify(user);
  await kvSet(USER_BY_ID_KEY(userId), userData);
  await kvSet(USER_BY_USERNAME_KEY(uname), userId);
  await kvSet(USER_BY_WALLET_KEY(walletLower), userId);

  return user;
}

// Get user by username
export async function getUserByUsername(username: string): Promise<User | null> {
  const usernameLower = username.toLowerCase();
  const userId = await kvGet(USER_BY_USERNAME_KEY(usernameLower));
  
  if (!userId) return null;
  
  const userData = await kvGet(USER_BY_ID_KEY(userId));
  if (!userData) return null;
  
  return JSON.parse(userData) as User;
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  // Check cache first (5 minute TTL)
  const cacheKey = `user:cache:${id}`;
  const cached = memoryCache.get<User>(cacheKey, 300_000);
  if (cached) return cached;

  const userData = await kvGet(USER_BY_ID_KEY(id));
  if (!userData) return null;
  
  const user = JSON.parse(userData) as User;
  memoryCache.set(cacheKey, user);
  return user;
}

// Get user by wallet address
export async function getUserByWallet(walletAddress: string): Promise<User | null> {
  const walletLower = walletAddress.toLowerCase();
  
  // Check cache first (5 minute TTL)
  const cacheKey = `user:wallet:cache:${walletLower}`;
  const cached = memoryCache.get<User>(cacheKey, 300_000);
  if (cached) return cached;

  const userId = await kvGet(USER_BY_WALLET_KEY(walletLower));
  if (!userId) return null;
  
  const user = await getUserById(userId);
  if (user) {
    memoryCache.set(cacheKey, user);
  }
  return user;
}

// Update username
export async function updateUsername(userId: string, newUsername: string): Promise<boolean> {
  const user = await getUserById(userId);
  if (!user) return false;

  const newUsernameLower = newUsername.toLowerCase();

  // Check if new username already taken
  const existing = await kvGet(USER_BY_USERNAME_KEY(newUsernameLower));
  if (existing && existing !== userId) {
    return false; // Username already taken
  }

  // Remove old username mapping
  await kvSet(USER_BY_USERNAME_KEY(user.username.toLowerCase()), null as unknown as string);

  // Update user
  user.username = newUsernameLower;
  const userData = JSON.stringify(user);
  
  await kvSet(USER_BY_ID_KEY(userId), userData);
  await kvSet(USER_BY_USERNAME_KEY(newUsernameLower), userId);
  
  // Invalidate cache
  memoryCache.delete(`user:cache:${userId}`);
  memoryCache.delete(`user:wallet:cache:${user.walletAddress.toLowerCase()}`);
  
  return true;
}

// Update avatar URL
export async function updateAvatar(userId: string, avatarUrl: string): Promise<boolean> {
  const user = await getUserById(userId);
  if (!user) return false;

  user.avatarUrl = avatarUrl;
  const userData = JSON.stringify(user);
  
  await kvSet(USER_BY_ID_KEY(userId), userData);
  
  // Invalidate cache
  memoryCache.delete(`user:cache:${userId}`);
  memoryCache.delete(`user:wallet:cache:${user.walletAddress.toLowerCase()}`);
  
  return true;
}
