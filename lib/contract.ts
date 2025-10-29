/**
 * Smart Contract Integration for Snake Game on Base
 * Simple on-chain score tracking
 */

// Blockchain integration removed for game-only mode; use plain string types for addresses

// Contract address on Base Mainnet (will be set after deployment)
// Prefer `NEXT_PUBLIC_GAME_CONTRACT`, but fall back to legacy `NEXT_PUBLIC_LEADERBOARD_CONTRACT`
export const GAME_CONTRACT_ADDRESS: string = (
  process.env.NEXT_PUBLIC_GAME_CONTRACT ||
  process.env.NEXT_PUBLIC_LEADERBOARD_CONTRACT ||
  '0x0000000000000000000000000000000000000000'
);

// Chain ID for Base Mainnet
export const BASE_CHAIN_ID = 8453;

// Simplified ABI for SnakeGameScore contract
export const GAME_CONTRACT_ABI = [
  {
    name: 'register',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_username', type: 'string' }],
    outputs: [],
  },
  {
    name: 'submitScore',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_score', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'getPlayer',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '_player', type: 'address' }],
    outputs: [
      { name: 'username', type: 'string' },
      { name: 'highScore', type: 'uint256' },
      { name: 'lastPlayed', type: 'uint256' },
      { name: 'isRegistered', type: 'bool' },
    ],
  },
  {
    name: 'isRegistered',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '_player', type: 'address' }],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'getTotalPlayers',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'getTopPlayers',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '_limit', type: 'uint256' }],
    outputs: [
      { name: 'addresses', type: 'address[]' },
      { name: 'usernames', type: 'string[]' },
      { name: 'scores', type: 'uint256[]' },
    ],
  },
  // Events
  {
    name: 'PlayerRegistered',
    type: 'event',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'player', type: 'address' },
      { indexed: false, name: 'username', type: 'string' },
    ],
  },
  {
    name: 'ScoreSubmitted',
    type: 'event',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'player', type: 'address' },
      { indexed: false, name: 'score', type: 'uint256' },
      { indexed: false, name: 'highScore', type: 'uint256' },
    ],
  },
] as const;

// TypeScript types
export interface PlayerData {
  username: string;
  highScore: bigint;
  lastPlayed: bigint;
  isRegistered: boolean;
}

export interface TopPlayersData {
  addresses: string[];
  usernames: string[];
  scores: bigint[];
}

// Check if blockchain integration is enabled
export const BLOCKCHAIN_ENABLED = false;

// Helper to check if contract is available
export function isContractAvailable(): boolean {
  return BLOCKCHAIN_ENABLED;
}

// Get contract config
export function getContractConfig() {
  return {
    address: GAME_CONTRACT_ADDRESS,
    abi: GAME_CONTRACT_ABI,
    chainId: BASE_CHAIN_ID,
  };
}
