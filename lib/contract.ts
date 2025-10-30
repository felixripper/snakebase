// Contract configuration for Snakebase on-chain score submission

import { createWalletClient, http, type Hash } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

// Contract addresses (update these when deployed)
export const GAME_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GAME_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

// Contract ABI (simplified for score submission)
export const GAME_CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "score",
        "type": "uint256"
      }
    ],
    "name": "submitScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "getHighScore",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTopScores",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Check if blockchain features are enabled
export const BLOCKCHAIN_ENABLED = process.env.NEXT_PUBLIC_BLOCKCHAIN_ENABLED === 'true';

// Contract deployment status
export function isContractDeployed(): boolean {
  return GAME_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';
}

// Validate contract address format
export function isValidContractAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// On-chain score submission (server-side)
export async function submitScoreOnChain(
  walletAddress: string,
  score: number,
  privateKey?: string
): Promise<{ success: boolean; transactionHash?: Hash; error?: string }> {
  try {
    // Check if blockchain is enabled and contract is deployed
    if (!BLOCKCHAIN_ENABLED || !isContractDeployed()) {
      return { success: false, error: 'Blockchain features not enabled or contract not deployed' };
    }

    // Get private key from environment (for server-side signing)
    const servicePrivateKey = privateKey || process.env.SERVICE_WALLET_PRIVATE_KEY;
    if (!servicePrivateKey) {
      return { success: false, error: 'Service wallet private key not configured' };
    }

    // Create account from private key
    const account = privateKeyToAccount(servicePrivateKey as `0x${string}`);

    // Create wallet client for transaction signing
    const walletClient = createWalletClient({
      chain: base,
      transport: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
      account,
    });

    // Prepare contract call
    const contractAddress = GAME_CONTRACT_ADDRESS as `0x${string}`;

    // Submit score transaction
    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: GAME_CONTRACT_ABI,
      functionName: 'submitScore',
      args: [BigInt(score)],
    });

    console.log(`On-chain score submission successful: ${hash} for score ${score}`);

    return {
      success: true,
      transactionHash: hash
    };

  } catch (error) {
    console.error('On-chain submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}