import { kvGet, kvSet } from './redis';
import bcrypt from 'bcryptjs';

// User type definition
export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: number;
  walletAddress?: string; // Opsiyonel - cüzdan bağlanabilir
}

// Redis key patterns
const USER_BY_EMAIL_KEY = (email: string) => `user:email:${email.toLowerCase()}`;
const USER_BY_USERNAME_KEY = (username: string) => `user:username:${username.toLowerCase()}`;
const USER_BY_ID_KEY = (id: string) => `user:id:${id}`;
const USER_BY_WALLET_KEY = (wallet: string) => `user:wallet:${wallet.toLowerCase()}`;

// Generate unique user ID
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Create new user
export async function createUser(
  email: string,
  username: string,
  password: string
): Promise<User | null> {
  const emailLower = email.toLowerCase();
  const usernameLower = username.toLowerCase();

  // Check if email already exists
  const existingByEmail = await kvGet(USER_BY_EMAIL_KEY(emailLower));
  if (existingByEmail) {
    return null; // Email already exists
  }

  // Check if username already exists
  const existingByUsername = await kvGet(USER_BY_USERNAME_KEY(usernameLower));
  if (existingByUsername) {
    return null; // Username already exists
  }

  // Create user
  const userId = generateUserId();
  const passwordHash = await hashPassword(password);
  
  const user: User = {
    id: userId,
    email: emailLower,
    username: usernameLower,
    passwordHash,
    createdAt: Date.now(),
  };

  // Store user data
  const userData = JSON.stringify(user);
  await kvSet(USER_BY_ID_KEY(userId), userData);
  await kvSet(USER_BY_EMAIL_KEY(emailLower), userId);
  await kvSet(USER_BY_USERNAME_KEY(usernameLower), userId);

  return user;
}

// Create or return user with wallet only (no email/password). Email is synthesized.
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
  const syntheticEmail = `${walletLower}@wallet.local`;
  const passwordHash = 'WALLET_AUTH';

  const user: User = {
    id: userId,
    email: syntheticEmail,
    username: uname,
    passwordHash,
    createdAt: Date.now(),
    walletAddress: walletLower,
  };

  const userData = JSON.stringify(user);
  await kvSet(USER_BY_ID_KEY(userId), userData);
  await kvSet(USER_BY_EMAIL_KEY(syntheticEmail), userId);
  await kvSet(USER_BY_USERNAME_KEY(uname), userId);
  await kvSet(USER_BY_WALLET_KEY(walletLower), userId);

  return user;
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  const emailLower = email.toLowerCase();
  const userId = await kvGet(USER_BY_EMAIL_KEY(emailLower));
  
  if (!userId) return null;
  
  const userData = await kvGet(USER_BY_ID_KEY(userId));
  if (!userData) return null;
  
  return JSON.parse(userData) as User;
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
  const userData = await kvGet(USER_BY_ID_KEY(id));
  if (!userData) return null;
  
  return JSON.parse(userData) as User;
}

// Link wallet to user account
export async function linkWalletToUser(userId: string, walletAddress: string): Promise<boolean> {
  const user = await getUserById(userId);
  if (!user) return false;

  const walletLower = walletAddress.toLowerCase();
  
  // Check if wallet already linked to another user
  const existingWalletUser = await kvGet(USER_BY_WALLET_KEY(walletLower));
  if (existingWalletUser && existingWalletUser !== userId) {
    return false; // Wallet already linked to another account
  }

  // Update user
  user.walletAddress = walletLower;
  const userData = JSON.stringify(user);
  
  await kvSet(USER_BY_ID_KEY(userId), userData);
  await kvSet(USER_BY_WALLET_KEY(walletLower), userId);
  
  return true;
}

// Get user by wallet address
export async function getUserByWallet(walletAddress: string): Promise<User | null> {
  const walletLower = walletAddress.toLowerCase();
  const userId = await kvGet(USER_BY_WALLET_KEY(walletLower));
  
  if (!userId) return null;
  
  return getUserById(userId);
}

// Update user password
export async function updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
  const user = await getUserById(userId);
  if (!user) return false;

  user.passwordHash = await hashPassword(newPassword);
  const userData = JSON.stringify(user);
  
  await kvSet(USER_BY_ID_KEY(userId), userData);
  return true;
}
