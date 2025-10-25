/**
 * Contract Deployment Helpers for OnchainTestKit
 * Utilities for deploying and interacting with smart contracts in tests
 */

import { ethers } from 'ethers';
import { AnvilNodeManager } from './anvil-manager';

// Import your contract ABI and bytecode
import GameScoreArtifact from '../../artifacts/contracts/GameScore.sol/GameScore.json';

export interface ContractDeployment {
  address: string;
  contract: ethers.BaseContract;
  deploymentTx: ethers.ContractTransactionResponse;
}

export class ContractHelper {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;

  constructor(private nodeManager: AnvilNodeManager, privateKey?: string) {
    this.provider = new ethers.JsonRpcProvider(nodeManager.getRpcUrl());

    // Use provided private key or default Anvil test account
    this.signer = privateKey
      ? new ethers.Wallet(privateKey, this.provider)
      : new ethers.Wallet(
          '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', // First Anvil account
          this.provider
        );
  }

  /**
   * Deploy GameScore contract
   */
  async deployGameScore(): Promise<ContractDeployment> {
    const factory = new ethers.ContractFactory(
      GameScoreArtifact.abi,
      GameScoreArtifact.bytecode,
      this.signer
    );

    const contract = await factory.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    const deploymentTx = contract.deploymentTransaction() as ethers.ContractTransactionResponse;

    console.log(`GameScore deployed at: ${address}`);

    return {
      address,
      contract,
      deploymentTx,
    };
  }

  /**
   * Get GameScore contract instance at specific address
   */
  getGameScoreContract(address: string): ethers.Contract {
    return new ethers.Contract(address, GameScoreArtifact.abi, this.signer);
  }

  /**
   * Save a score to the contract
   */
  async saveScore(
    contractAddress: string,
    playerAddress: string,
    score: number
  ): Promise<ethers.ContractTransactionReceipt | null> {
    const contract = this.getGameScoreContract(contractAddress);
    const tx = await contract.saveScore(playerAddress, score);
    return await tx.wait();
  }

  /**
   * Get top scores from the contract
   */
  async getTopScores(
    contractAddress: string,
    count: number = 10
  ): Promise<Array<{ player: string; score: bigint }>> {
    const contract = this.getGameScoreContract(contractAddress);
    const scores = await contract.getTopScores(count);

    return scores.map((entry: { player: string; score: bigint }) => ({
      player: entry.player,
      score: entry.score,
    }));
  }

  /**
   * Get player's score
   */
  async getPlayerScore(contractAddress: string, playerAddress: string): Promise<bigint> {
    const contract = this.getGameScoreContract(contractAddress);
    return await contract.getScore(playerAddress);
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(
    txHash: string,
    confirmations = 1
  ): Promise<ethers.TransactionReceipt | null> {
    return await this.provider.waitForTransaction(txHash, confirmations);
  }

  /**
   * Get account balance
   */
  async getBalance(address: string): Promise<bigint> {
    return await this.provider.getBalance(address);
  }

  /**
   * Fund an account with ETH
   */
  async fundAccount(toAddress: string, amount: string): Promise<ethers.TransactionReceipt | null> {
    const tx = await this.signer.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amount),
    });
    return await tx.wait();
  }

  /**
   * Get current block number
   */
  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  /**
   * Mine blocks (Anvil specific)
   */
  async mineBlocks(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.provider.send('evm_mine', []);
    }
  }

  /**
   * Set next block timestamp (Anvil specific)
   */
  async setNextBlockTimestamp(timestamp: number): Promise<void> {
    await this.provider.send('evm_setNextBlockTimestamp', [timestamp]);
  }

  /**
   * Get signer address
   */
  getSignerAddress(): string {
    return this.signer.address;
  }

  /**
   * Get provider
   */
  getProvider(): ethers.JsonRpcProvider {
    return this.provider;
  }
}
