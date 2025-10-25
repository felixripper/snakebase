/**
 * Contract Deployment E2E Tests
 * Tests for deploying and interacting with GameScore smart contract
 */

import { test, expect } from './utils/test-fixtures';
import { ethers } from 'ethers';

test.describe('GameScore Contract Deployment', () => {
  test('should deploy GameScore contract successfully', async ({ contractHelper }) => {
    const deployment = await contractHelper.deployGameScore();

    expect(deployment.address).toBeTruthy();
    expect(ethers.isAddress(deployment.address)).toBe(true);
    expect(deployment.deploymentTx).toBeTruthy();
  });

  test('should save and retrieve player score', async ({ contractHelper }) => {
    const deployment = await contractHelper.deployGameScore();
    const playerAddress = contractHelper.getSignerAddress();
    const testScore = 1000;

    // Save score
    const receipt = await contractHelper.saveScore(deployment.address, playerAddress, testScore);
    expect(receipt).toBeTruthy();
    expect(receipt?.status).toBe(1);

    // Retrieve score
    const savedScore = await contractHelper.getPlayerScore(deployment.address, playerAddress);
    expect(savedScore).toBe(BigInt(testScore));
  });

  test('should update player score if higher', async ({ contractHelper }) => {
    const deployment = await contractHelper.deployGameScore();
    const playerAddress = contractHelper.getSignerAddress();

    // Save initial score
    await contractHelper.saveScore(deployment.address, playerAddress, 500);

    // Save higher score
    await contractHelper.saveScore(deployment.address, playerAddress, 1000);

    const finalScore = await contractHelper.getPlayerScore(deployment.address, playerAddress);
    expect(finalScore).toBe(BigInt(1000));
  });

  test('should not update player score if lower', async ({ contractHelper }) => {
    const deployment = await contractHelper.deployGameScore();
    const playerAddress = contractHelper.getSignerAddress();

    // Save initial score
    await contractHelper.saveScore(deployment.address, playerAddress, 1000);

    // Try to save lower score
    await contractHelper.saveScore(deployment.address, playerAddress, 500);

    const finalScore = await contractHelper.getPlayerScore(deployment.address, playerAddress);
    expect(finalScore).toBe(BigInt(1000));
  });

  test('should retrieve top scores', async ({ contractHelper }) => {
    const deployment = await contractHelper.deployGameScore();

    // Create multiple accounts and save scores
    const provider = contractHelper.getProvider();
    const scores = [
      {
        privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
        score: 1000,
      },
      {
        privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
        score: 2000,
      },
      {
        privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
        score: 1500,
      },
    ];

    for (const { privateKey, score } of scores) {
      const wallet = new ethers.Wallet(privateKey, provider);
      const address = wallet.address;
      await contractHelper.saveScore(deployment.address, address, score);
    }

    const topScores = await contractHelper.getTopScores(deployment.address, 3);
    expect(topScores.length).toBe(3);

    // Verify scores are sorted in descending order
    expect(topScores[0].score).toBe(BigInt(2000));
    expect(topScores[1].score).toBe(BigInt(1500));
    expect(topScores[2].score).toBe(BigInt(1000));
  });

  test('should handle multiple players', async ({ contractHelper }) => {
    const deployment = await contractHelper.deployGameScore();
    const provider = contractHelper.getProvider();

    // Create 5 different players
    const players = [
      {
        privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
        score: 800,
      },
      {
        privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
        score: 1200,
      },
      {
        privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
        score: 950,
      },
      {
        privateKey: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
        score: 1500,
      },
      {
        privateKey: '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a',
        score: 600,
      },
    ];

    for (const { privateKey, score } of players) {
      const wallet = new ethers.Wallet(privateKey, provider);
      await contractHelper.saveScore(deployment.address, wallet.address, score);
    }

    const topScores = await contractHelper.getTopScores(deployment.address, 5);
    expect(topScores.length).toBe(5);

    // Verify highest score is first
    expect(Number(topScores[0].score)).toBe(1500);
  });

  test('should emit ScoreSaved event', async ({ contractHelper }) => {
    const deployment = await contractHelper.deployGameScore();
    const playerAddress = contractHelper.getSignerAddress();
    const testScore = 1000;

    const contract = contractHelper.getGameScoreContract(deployment.address);
    const tx = await contract.saveScore(playerAddress, testScore);
    const receipt = await tx.wait();

    // Check for ScoreSaved event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const event = receipt?.logs.find((log: any) => {
      try {
        const parsedLog = contract.interface.parseLog({
          topics: [...log.topics],
          data: log.data,
        });
        return parsedLog?.name === 'ScoreSaved';
      } catch {
        return false;
      }
    });

    expect(event).toBeTruthy();
  });

  test('should handle contract balance checks', async ({ contractHelper, fundedAccount }) => {
    const deployment = await contractHelper.deployGameScore();

    // Check deployer has sufficient balance
    const balance = await contractHelper.getBalance(fundedAccount);
    expect(balance).toBeGreaterThan(BigInt(0));

    // Check contract balance
    const contractBalance = await contractHelper.getBalance(deployment.address);
    expect(contractBalance).toBe(BigInt(0));
  });
});

test.describe('Advanced Contract Features', () => {
  test('should mine blocks and verify timestamp', async ({ contractHelper }) => {
    const initialBlock = await contractHelper.getBlockNumber();

    // Mine 5 blocks
    await contractHelper.mineBlocks(5);

    const newBlock = await contractHelper.getBlockNumber();
    expect(newBlock).toBe(initialBlock + 5);
  });

  test('should fund new account', async ({ contractHelper }) => {
    // Create a new random wallet
    const randomWallet = ethers.Wallet.createRandom();
    const newAddress = randomWallet.address;

    // Check initial balance is 0
    const initialBalance = await contractHelper.getBalance(newAddress);
    expect(initialBalance).toBe(BigInt(0));

    // Fund with 1 ETH
    await contractHelper.fundAccount(newAddress, '1.0');

    // Verify balance
    const newBalance = await contractHelper.getBalance(newAddress);
    expect(newBalance).toBe(ethers.parseEther('1.0'));
  });

  test('should wait for transaction confirmation', async ({ contractHelper }) => {
    const deployment = await contractHelper.deployGameScore();
    const playerAddress = contractHelper.getSignerAddress();

    const contract = contractHelper.getGameScoreContract(deployment.address);
    const tx = await contract.saveScore(playerAddress, 100);

    // Wait for 1 confirmation
    const receipt = await contractHelper.waitForTransaction(tx.hash, 1);

    expect(receipt).toBeTruthy();
    expect(receipt?.status).toBe(1);
    expect(receipt?.hash).toBe(tx.hash);
  });
});
