// SPDX-License-Identifier: MIT
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying SnakeGameScore contract to Base...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  console.log("⏳ Deploying contract...");
  const SnakeGameScore = await ethers.getContractFactory("SnakeGameScore");
  const contract = await SnakeGameScore.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("\n✅ SnakeGameScore deployed successfully!");
  console.log("📍 Contract address:", address);
  console.log("\n" + "=".repeat(60));
  console.log("🔧 NEXT STEPS:");
  console.log("=".repeat(60));
  console.log("\n1️⃣  Add to your .env.local:");
  console.log(`   NEXT_PUBLIC_BLOCKCHAIN_ENABLED=true`);
  console.log(`   NEXT_PUBLIC_GAME_CONTRACT=${address}`);
  console.log(`   NEXT_PUBLIC_CHAIN_ID=8453`);
  
  console.log("\n2️⃣  Add to Vercel Environment Variables:");
  console.log(`   NEXT_PUBLIC_BLOCKCHAIN_ENABLED=true`);
  console.log(`   NEXT_PUBLIC_GAME_CONTRACT=${address}`);
  console.log(`   NEXT_PUBLIC_CHAIN_ID=8453`);
  
  console.log("\n3️⃣  Verify contract on BaseScan (optional):");
  console.log(`   npx hardhat verify --network base ${address}`);
  
  console.log("\n4️⃣  View on BaseScan:");
  console.log(`   https://basescan.org/address/${address}`);
  console.log("\n" + "=".repeat(60) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

