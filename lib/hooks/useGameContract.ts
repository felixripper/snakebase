/**
 * useGameContract Hook
 * React hooks for interacting with SnakeGameScore contract on Base
 */

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { getContractConfig, type PlayerData, isContractAvailable } from '@/lib/contract';
import type { Address } from 'viem';

/**
 * Main hook for writing to the contract
 */
export function useGameContract() {
  const { address, chainId } = useAccount();
  const contractConfig = getContractConfig();
  const available = isContractAvailable();

  // Write operations
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  /**
   * Register player on blockchain
   */
  const register = async (username: string) => {
    if (!available || !address) {
      throw new Error('Contract not available or wallet not connected');
    }
    return writeContract({
      address: contractConfig.address,
      abi: contractConfig.abi,
      functionName: 'register',
      args: [username],
    });
  };

  /**
   * Submit score to blockchain
   */
  const submitScore = async (score: number) => {
    if (!available || !address) {
      throw new Error('Contract not available or wallet not connected');
    }
    return writeContract({
      address: contractConfig.address,
      abi: contractConfig.abi,
      functionName: 'submitScore',
      args: [BigInt(score)],
    });
  };

  return {
    // Contract state
    contractAddress: contractConfig.address,
    isContractAvailable: available,
    isCorrectChain: chainId === contractConfig.chainId,
    
    // Write operations
    register,
    submitScore,
    
    // Transaction state
    isPending,
    isConfirming,
    isConfirmed,
    writeError,
    hash,
  };
}

/**
 * Hook to read player data from blockchain
 */
export function usePlayerData(playerAddress?: Address) {
  const contractConfig = getContractConfig();
  const available = isContractAvailable();

  const { data, isLoading, error, refetch } = useReadContract({
    address: available ? contractConfig.address : undefined,
    abi: contractConfig.abi,
    functionName: 'getPlayer',
    args: playerAddress ? [playerAddress] : undefined,
    query: {
      enabled: available && !!playerAddress,
    },
  });

  // Transform the tuple response to PlayerData
  const player: PlayerData | null = data ? {
    username: data[0] as string,
    highScore: data[1] as bigint,
    lastPlayed: data[2] as bigint,
    isRegistered: data[3] as boolean,
  } : null;

  return {
    player,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to check if player is registered
 */
export function useIsPlayerRegistered(playerAddress?: Address) {
  const contractConfig = getContractConfig();
  const available = isContractAvailable();

  const { data: isRegistered, isLoading, error } = useReadContract({
    address: available ? contractConfig.address : undefined,
    abi: contractConfig.abi,
    functionName: 'isRegistered',
    args: playerAddress ? [playerAddress] : undefined,
    query: {
      enabled: available && !!playerAddress,
    },
  });

  return {
    isRegistered: isRegistered || false,
    isLoading,
    error,
  };
}

/**
 * Hook to get top players from blockchain
 */
export function useTopPlayers(limit: number = 10) {
  const contractConfig = getContractConfig();
  const available = isContractAvailable();

  const { data, isLoading, error, refetch } = useReadContract({
    address: available ? contractConfig.address : undefined,
    abi: contractConfig.abi,
    functionName: 'getTopPlayers',
    args: [BigInt(limit)],
    query: {
      enabled: available,
    },
  });

  // Transform the response to TopPlayersData
  const topPlayers: { address: Address; username: string; score: bigint }[] = data ? 
    (data[0] as Address[]).map((addr, i) => ({
      address: addr,
      username: (data[1] as string[])[i],
      score: (data[2] as bigint[])[i],
    })) : [];

  return {
    topPlayers,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to get total players count
 */
export function useTotalPlayers() {
  const contractConfig = getContractConfig();
  const available = isContractAvailable();

  const { data: totalPlayers, isLoading, error } = useReadContract({
    address: available ? contractConfig.address : undefined,
    abi: contractConfig.abi,
    functionName: 'getTotalPlayers',
    query: {
      enabled: available,
    },
  });

  return {
    totalPlayers: totalPlayers ? Number(totalPlayers) : 0,
    isLoading,
    error,
  };
}
