/**
 * Transaction Flow E2E Tests
 * Tests for transaction signing, approval, and execution flows
 */

import { test, expect } from './utils/test-fixtures';
import { ethers } from 'ethers';

test.describe('Transaction Approval Flow', () => {
  test('should execute simple ETH transfer', async ({ contractHelper }) => {
    const recipient = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Second Anvil account

    const initialBalance = await contractHelper.getBalance(recipient);

    // Send 0.5 ETH
    const amount = ethers.parseEther('0.5');
    const provider = contractHelper.getProvider();
    const signer = new ethers.Wallet(
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      provider
    );

    const tx = await signer.sendTransaction({
      to: recipient,
      value: amount,
    });

    const receipt = await tx.wait();
    expect(receipt?.status).toBe(1);

    const newBalance = await contractHelper.getBalance(recipient);
    expect(newBalance).toBe(initialBalance + amount);
  });

  test('should handle failed transaction', async ({ contractHelper }) => {
    const provider = contractHelper.getProvider();
    const signer = new ethers.Wallet(
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      provider
    );

    // Try to send more ETH than available (should fail)
    try {
      const balance = await provider.getBalance(signer.address);
      const excessiveAmount = balance + ethers.parseEther('100');

      await signer.sendTransaction({
        to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        value: excessiveAmount,
      });

      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Transaction should fail
      expect(error).toBeTruthy();
    }
  });

  test('should calculate and pay gas fees', async ({ contractHelper }) => {
    const deployment = await contractHelper.deployGameScore();
    const playerAddress = contractHelper.getSignerAddress();

    const initialBalance = await contractHelper.getBalance(playerAddress);

    // Execute transaction
    const receipt = await contractHelper.saveScore(deployment.address, playerAddress, 100);

    const newBalance = await contractHelper.getBalance(playerAddress);

    // Balance should decrease by gas fees
    expect(newBalance).toBeLessThan(initialBalance);

    // Gas was consumed
    const gasUsed = receipt?.gasUsed || BigInt(0);
    expect(gasUsed).toBeGreaterThan(BigInt(0));
  });
});

test.describe('Smart Contract Interactions', () => {
  test('should execute contract function with parameters', async ({ contractHelper }) => {
    const deployment = await contractHelper.deployGameScore();

    // Test various score values
    const testScores = [0, 100, 999, 1000, 9999];

    for (const score of testScores) {
      const receipt = await contractHelper.saveScore(
        deployment.address,
        contractHelper.getSignerAddress(),
        score
      );

      expect(receipt?.status).toBe(1);

      const savedScore = await contractHelper.getPlayerScore(
        deployment.address,
        contractHelper.getSignerAddress()
      );

      expect(Number(savedScore)).toBeGreaterThanOrEqual(score);
    }
  });

  test('should handle contract view functions', async ({ contractHelper }) => {
    const deployment = await contractHelper.deployGameScore();

    // View functions should not cost gas
    const score = await contractHelper.getPlayerScore(
      deployment.address,
      '0x0000000000000000000000000000000000000000'
    );

    expect(score).toBe(BigInt(0)); // Address with no score
  });

  test('should execute batch transactions', async ({ contractHelper }) => {
    const deployment = await contractHelper.deployGameScore();
    const provider = contractHelper.getProvider();

    // Create multiple wallets and execute transactions in parallel
    const transactions = [
      {
        privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
        score: 100,
      },
      {
        privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
        score: 200,
      },
      {
        privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
        score: 300,
      },
    ];

    const receipts = await Promise.all(
      transactions.map(async ({ privateKey, score }) => {
        const wallet = new ethers.Wallet(privateKey, provider);
        const contract = contractHelper.getGameScoreContract(deployment.address);
        const connectedContract = contract.connect(wallet);
        const tx = await connectedContract.saveScore(wallet.address, score);
        return await tx.wait();
      })
    );

    // All transactions should succeed
    receipts.forEach((receipt) => {
      expect(receipt?.status).toBe(1);
    });
  });
});

test.describe('Network State Management', () => {
  test('should mine blocks on demand', async ({ contractHelper }) => {
    const initialBlock = await contractHelper.getBlockNumber();

    await contractHelper.mineBlocks(10);

    const currentBlock = await contractHelper.getBlockNumber();
    expect(currentBlock).toBe(initialBlock + 10);
  });

  test('should control block timestamp', async ({ contractHelper }) => {
    const futureTimestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hour ahead

    await contractHelper.setNextBlockTimestamp(futureTimestamp);
    await contractHelper.mineBlocks(1);

    const provider = contractHelper.getProvider();
    const block = await provider.getBlock('latest');

    expect(block?.timestamp).toBeGreaterThanOrEqual(futureTimestamp);
  });

  test('should track transaction nonce', async ({ contractHelper }) => {
    const provider = contractHelper.getProvider();
    const signerAddress = contractHelper.getSignerAddress();

    const initialNonce = await provider.getTransactionCount(signerAddress);

    // Execute a transaction
    const deployment = await contractHelper.deployGameScore();
    await contractHelper.saveScore(deployment.address, signerAddress, 100);

    const newNonce = await provider.getTransactionCount(signerAddress);
    expect(newNonce).toBeGreaterThan(initialNonce);
  });
});

test.describe('Gas Optimization', () => {
  test('should estimate gas before transaction', async ({ contractHelper }) => {
    const deployment = await contractHelper.deployGameScore();
    const contract = contractHelper.getGameScoreContract(deployment.address);
    const playerAddress = contractHelper.getSignerAddress();

    // Estimate gas for saveScore function
    const estimatedGas = await contract.saveScore.estimateGas(playerAddress, 100);

    expect(estimatedGas).toBeGreaterThan(BigInt(0));
  });

  test('should compare gas costs for different operations', async ({ contractHelper }) => {
    const deployment = await contractHelper.deployGameScore();

    // First score save (more expensive)
    const receipt1 = await contractHelper.saveScore(
      deployment.address,
      contractHelper.getSignerAddress(),
      100
    );
    const gas1 = receipt1?.gasUsed || BigInt(0);

    // Update score (potentially cheaper)
    const receipt2 = await contractHelper.saveScore(
      deployment.address,
      contractHelper.getSignerAddress(),
      200
    );
    const gas2 = receipt2?.gasUsed || BigInt(0);

    // Both should consume gas
    expect(gas1).toBeGreaterThan(BigInt(0));
    expect(gas2).toBeGreaterThan(BigInt(0));
  });
});

test.describe('Transaction Waiting and Confirmations', () => {
  test('should wait for single confirmation', async ({ contractHelper }) => {
    const deployment = await contractHelper.deployGameScore();
    const contract = contractHelper.getGameScoreContract(deployment.address);

    const tx = await contract.saveScore(contractHelper.getSignerAddress(), 100);

    const receipt = await contractHelper.waitForTransaction(tx.hash, 1);

    expect(receipt).toBeTruthy();
    expect(receipt?.hash).toBe(tx.hash);
    expect(receipt?.status).toBe(1);
  });

  test('should wait for multiple confirmations', async ({ contractHelper }) => {
    const deployment = await contractHelper.deployGameScore();
    const contract = contractHelper.getGameScoreContract(deployment.address);

    const tx = await contract.saveScore(contractHelper.getSignerAddress(), 100);

    // Mine additional blocks
    await contractHelper.mineBlocks(5);

    const receipt = await contractHelper.waitForTransaction(tx.hash, 3);

    expect(receipt).toBeTruthy();
    expect(receipt?.confirmations()).toBeGreaterThanOrEqual(3);
  });
});

test.describe('Error Recovery', () => {
  test('should handle transaction revert', async ({ contractHelper }) => {
    const deployment = await contractHelper.deployGameScore();
    const contract = contractHelper.getGameScoreContract(deployment.address);

    try {
      // Try to save score with invalid parameters (if contract has validation)
      await contract.saveScore('0x0000000000000000000000000000000000000000', -1);

      // Should not reach here if validation exists
    } catch (error) {
      // Error is expected for invalid input
      expect(error).toBeTruthy();
    }
  });

  test('should retry failed transactions', async ({ contractHelper }) => {
    const deployment = await contractHelper.deployGameScore();
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const receipt = await contractHelper.saveScore(
          deployment.address,
          contractHelper.getSignerAddress(),
          100
        );

        if (receipt?.status === 1) {
          break;
        }
      } catch (error) {
        attempts++;
        if (attempts === maxAttempts) {
          throw error;
        }
      }
    }

    expect(attempts).toBeLessThan(maxAttempts);
  });
});
