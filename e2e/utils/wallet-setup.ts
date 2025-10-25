/**
 * Wallet Setup Utilities for OnchainTestKit
 * Provides helper functions for wallet initialization and management
 */

import { Page } from '@playwright/test';
import { WalletType } from '@coinbase/onchaintestkit';

export interface WalletConfig {
  type: WalletType;
  seedPhrase: string;
  password: string;
}

/**
 * Default test wallet configuration
 * WARNING: Never use these credentials in production!
 */
export const DEFAULT_WALLET_CONFIG: WalletConfig = {
  type: 'metamask' as WalletType,
  seedPhrase: 'test test test test test test test test test test test junk',
  password: 'TestPassword123!',
};

/**
 * Get wallet extension path based on wallet type
 */
export function getWalletExtensionPath(walletType: WalletType): string {
  // These paths would be configured based on your setup
  const extensionPaths: Record<WalletType, string> = {
    metamask: './e2e/extensions/metamask',
    coinbase: './e2e/extensions/coinbase-wallet',
  };

  return extensionPaths[walletType] || extensionPaths.metamask;
}

/**
 * Wait for wallet to be ready
 */
export async function waitForWalletReady(page: Page, timeout = 30000) {
  await page.waitForFunction(
    () => {
      return typeof window.ethereum !== 'undefined';
    },
    { timeout }
  );
}

/**
 * Check if wallet is connected
 */
export async function isWalletConnected(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    if (typeof window.ethereum === 'undefined') return false;
    return window.ethereum.isConnected();
  });
}

/**
 * Get connected wallet address
 */
export async function getConnectedAddress(page: Page): Promise<string | null> {
  return page.evaluate(async () => {
    if (typeof window.ethereum === 'undefined') return null;
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    return accounts[0] || null;
  });
}

/**
 * Switch to specific network
 */
export async function switchNetwork(page: Page, chainId: string) {
  await page.evaluate(async (chainIdHex) => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('Wallet not found');
    }
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  }, chainId);
}

/**
 * Add custom network to wallet
 */
export async function addNetwork(
  page: Page,
  network: {
    chainId: string;
    chainName: string;
    rpcUrls: string[];
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
  }
) {
  await page.evaluate(async (networkConfig) => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('Wallet not found');
    }
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkConfig],
    });
  }, network);
}
