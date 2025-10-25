import { ethers } from 'hardhat';

async function main() {
  const GameScore = await ethers.getContractFactory('GameScore');
  const gameScore = await GameScore.deploy();

  await gameScore.waitForDeployment();

  const deployedAddress = await gameScore.getAddress();
  console.log('GameScore deployed to:', deployedAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
