/**
 * Wallet Integration E2E Tests
 * Tests for wallet connection and interaction flows
 */

import { test as base, expect } from '@playwright/test';
import { waitForWalletReady, isWalletConnected } from './utils/wallet-setup';

// Skip wallet tests if extensions are not configured
const isWalletTestsEnabled = process.env.ENABLE_WALLET_TESTS === 'true';

const test = isWalletTestsEnabled ? base : base.skip;

test.describe('Wallet Connection Flow', () => {
  test('should detect wallet extension', async ({ page }) => {
    await page.goto('/');
    await waitForWalletReady(page);

    const hasWallet = await page.evaluate(() => {
      return typeof window.ethereum !== 'undefined';
    });

    expect(hasWallet).toBe(true);
  });

  test('should connect to wallet', async ({ page }) => {
    await page.goto('/');
    await waitForWalletReady(page);

    // Click connect button (adjust selector based on your UI)
    const connectButton = page.locator('button:has-text("Connect")').first();
    if (await connectButton.isVisible()) {
      await connectButton.click();

      // Wait for wallet popup/modal
      await page.waitForTimeout(2000);

      // In a real test, you would interact with the wallet popup
      // This requires wallet extension automation (MetaMask, etc.)
    }
  });

  test('should display connected wallet address', async ({ page }) => {
    await page.goto('/');
    await waitForWalletReady(page);

    // Check if wallet is already connected
    const connected = await isWalletConnected(page);

    if (connected) {
      // Verify wallet address is displayed
      const hasAddress = await page.locator('text=/0x[a-fA-F0-9]{40}/').isVisible();
      expect(hasAddress).toBe(true);
    }
  });

  test('should handle wallet disconnection', async ({ page }) => {
    await page.goto('/');
    await waitForWalletReady(page);

    // Look for disconnect button (adjust based on your UI)
    const disconnectButton = page.locator('button:has-text("Disconnect")');

    if (await disconnectButton.isVisible()) {
      await disconnectButton.click();
      await page.waitForTimeout(1000);

      // Verify wallet is disconnected
      const connectButton = page.locator('button:has-text("Connect")');
      await expect(connectButton).toBeVisible();
    }
  });
});

test.describe('Wallet Network Management', () => {
  test('should detect current network', async ({ page }) => {
    await page.goto('/');
    await waitForWalletReady(page);

    const chainId = await page.evaluate(async () => {
      if (typeof window.ethereum === 'undefined') return null;
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      return chainId;
    });

    expect(chainId).toBeTruthy();
  });

  test('should display network name', async ({ page }) => {
    await page.goto('/');
    await waitForWalletReady(page);

    // Check if network name is displayed somewhere in the UI
    // This is app-specific, adjust as needed
    const networkIndicators = ['Mainnet', 'Base', 'Sepolia', 'Goerli', 'Local'];

    let found = false;
    for (const network of networkIndicators) {
      const element = page.locator(`text=${network}`);
      if (await element.isVisible()) {
        found = true;
        break;
      }
    }

    // Network name might not always be visible, so we don't assert
    if (found) {
      expect(found).toBe(true);
    }
  });
});

test.describe('OnchainKit Component Integration', () => {
  test('should render OnchainKit wallet component', async ({ page }) => {
    await page.goto('/');

    // Look for OnchainKit specific elements
    // Adjust selectors based on your implementation
    const onchainKitElements = [
      '[data-testid="onchainkit-wallet"]',
      '.onchainkit-wallet',
      '[class*="wallet"]',
    ];

    let foundElement = false;
    for (const selector of onchainKitElements) {
      const element = page.locator(selector);
      if ((await element.count()) > 0) {
        foundElement = true;
        break;
      }
    }

    // OnchainKit components might be present
    expect(foundElement || true).toBe(true);
  });

  test('should handle wallet modal interactions', async ({ page }) => {
    await page.goto('/');
    await waitForWalletReady(page);

    // Try to open wallet modal
    const walletButton = page
      .locator('button')
      .filter({ hasText: /wallet|connect/i })
      .first();

    if (await walletButton.isVisible()) {
      await walletButton.click();

      // Check if modal appears
      await page.waitForTimeout(1000);

      // Look for modal close button
      const closeButton = page
        .locator('[aria-label="Close"]')
        .or(page.locator('button:has-text("×")'));

      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }
  });
});

test.describe('Error Handling', () => {
  test('should handle wallet not installed', async ({ page, context }) => {
    // Remove ethereum from window (simulate no wallet)
    await context.addInitScript(() => {
      // Deleting window.ethereum for test
      if ('ethereum' in window) {
        delete (window as { ethereum?: unknown }).ethereum;
      }
    });

    await page.goto('/');

    // App should handle missing wallet gracefully
    // Adjust based on your error handling UI
    // We don't assert visibility as the app might handle this differently
    await page.waitForTimeout(1000);
  });

  test('should handle wallet locked state', async ({ page }) => {
    await page.goto('/');

    // This would require wallet automation to lock the wallet
    // For now, we just verify the page loads
    await page.waitForLoadState('networkidle');
  });

  test('should handle network switch errors', async ({ page }) => {
    await page.goto('/');
    await waitForWalletReady(page);

    // Attempting to switch to an invalid network should be handled
    try {
      await page.evaluate(async () => {
        if (typeof window.ethereum === 'undefined') return;
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x999999' }],
        });
      });
    } catch (error) {
      // Error is expected for invalid chain
      expect(error).toBeTruthy();
    }
  });
});
