/**
 * Anvil Node Manager for OnchainTestKit
 * Manages local Ethereum test networks using Foundry's Anvil
 */

import { spawn, ChildProcess } from 'child_process';

export interface AnvilConfig {
  port?: number;
  chainId?: number;
  blockTime?: number;
  accounts?: number;
  balance?: number;
  forkUrl?: string;
  forkBlockNumber?: number;
}

const DEFAULT_CONFIG: Required<Omit<AnvilConfig, 'forkUrl' | 'forkBlockNumber'>> = {
  port: 8545,
  chainId: 31337,
  blockTime: 1,
  accounts: 10,
  balance: 10000,
};

export class AnvilNodeManager {
  private process: ChildProcess | null = null;
  private config: AnvilConfig;
  private isRunning = false;

  constructor(config: AnvilConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Start the Anvil node
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Anvil node is already running');
      return;
    }

    const args = [
      '--port',
      this.config.port?.toString() || DEFAULT_CONFIG.port.toString(),
      '--chain-id',
      this.config.chainId?.toString() || DEFAULT_CONFIG.chainId.toString(),
      '--block-time',
      this.config.blockTime?.toString() || DEFAULT_CONFIG.blockTime.toString(),
      '--accounts',
      this.config.accounts?.toString() || DEFAULT_CONFIG.accounts.toString(),
      '--balance',
      this.config.balance?.toString() || DEFAULT_CONFIG.balance.toString(),
    ];

    if (this.config.forkUrl) {
      args.push('--fork-url', this.config.forkUrl);
      if (this.config.forkBlockNumber) {
        args.push('--fork-block-number', this.config.forkBlockNumber.toString());
      }
    }

    return new Promise((resolve, reject) => {
      this.process = spawn('anvil', args);

      this.process.stdout?.on('data', (data) => {
        const output = data.toString();
        console.log(`[Anvil] ${output}`);

        // Anvil is ready when it starts listening
        if (output.includes('Listening on')) {
          this.isRunning = true;
          resolve();
        }
      });

      this.process.stderr?.on('data', (data) => {
        console.error(`[Anvil Error] ${data.toString()}`);
      });

      this.process.on('error', (error) => {
        reject(error);
      });

      this.process.on('exit', (code) => {
        this.isRunning = false;
        if (code !== 0 && code !== null) {
          console.error(`Anvil exited with code ${code}`);
        }
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!this.isRunning) {
          reject(new Error('Anvil failed to start within timeout'));
        }
      }, 30000);
    });
  }

  /**
   * Stop the Anvil node
   */
  async stop(): Promise<void> {
    if (!this.process || !this.isRunning) {
      return;
    }

    return new Promise((resolve) => {
      this.process?.once('exit', () => {
        this.isRunning = false;
        this.process = null;
        resolve();
      });

      this.process?.kill();

      // Force kill after 5 seconds
      setTimeout(() => {
        if (this.process) {
          this.process.kill('SIGKILL');
        }
        resolve();
      }, 5000);
    });
  }

  /**
   * Get the RPC URL for the Anvil node
   */
  getRpcUrl(): string {
    return `http://localhost:${this.config.port || DEFAULT_CONFIG.port}`;
  }

  /**
   * Get the chain ID
   */
  getChainId(): number {
    return this.config.chainId || DEFAULT_CONFIG.chainId;
  }

  /**
   * Check if the node is running
   */
  isNodeRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Reset the node state
   */
  async reset(): Promise<void> {
    await this.stop();
    await this.start();
  }
}
