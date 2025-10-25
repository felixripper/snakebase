/**
 * Test Fixtures for OnchainTestKit E2E Tests
 * Provides reusable test setup and teardown logic
 */

/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from '@playwright/test';
import { AnvilNodeManager } from './anvil-manager';
import { ContractHelper } from './contract-helper';

export interface OnchainTestFixtures {
  anvilNode: AnvilNodeManager;
  contractHelper: ContractHelper;
  fundedAccount: string;
}

/**
 * Extended test fixture with Anvil node and contract helpers
 */
export const test = base.extend<OnchainTestFixtures>({
  // Anvil node setup
  anvilNode: async ({}, use) => {
    const node = new AnvilNodeManager({
      port: 8545,
      chainId: 31337,
      blockTime: 1,
    });

    await node.start();
    await use(node);
    await node.stop();
  },

  // Contract helper setup
  contractHelper: async ({ anvilNode }, use) => {
    const helper = new ContractHelper(anvilNode);
    await use(helper);
  },

  // Pre-funded test account
  fundedAccount: async ({ contractHelper }, use) => {
    const address = contractHelper.getSignerAddress();
    await use(address);
  },
});

export { expect } from '@playwright/test';
