// SPDX-License-Identifier: MIT
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying SnakeGameLeaderboard contract...");

  const SnakeGameLeaderboard = await ethers.getContractFactory("SnakeGameLeaderboard");
  const leaderboard = await SnakeGameLeaderboard.deploy();

  await leaderboard.waitForDeployment();

  const address = await leaderboard.getAddress();

  console.log("SnakeGameLeaderboard deployed to:", address);
  console.log("\nAdd this to your .env.local / Vercel env:");
  console.log(`NEXT_PUBLIC_LEADERBOARD_CONTRACT=${address}`);
  console.log("\nVerify the contract on Basescan (optional):");
  console.log(`npx hardhat verify --network baseSepolia ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
