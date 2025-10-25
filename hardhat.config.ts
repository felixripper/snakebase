import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  networks: {
    base_mainnet: {
      url: process.env.BASE_MAINNET_RPC ?? '',
      accounts: process.env.DEPLOY_PRIVATE_KEY ? [process.env.DEPLOY_PRIVATE_KEY] : [],
    },
  },
};

export default config;
