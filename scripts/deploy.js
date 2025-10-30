const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying SnakeGameScore contract...");

  // Get the contract factory
  const SnakeGameScore = await ethers.getContractFactory("SnakeGameScore");

  // Deploy the contract
  const snakeGameScore = await SnakeGameScore.deploy();

  // Wait for deployment to finish
  await snakeGameScore.waitForDeployment();

  const contractAddress = await snakeGameScore.getAddress();

  console.log("SnakeGameScore deployed to:", contractAddress);
  console.log("Contract deployment completed!");

  // Verify contract on Etherscan (if API key is provided)
  if (process.env.BASESCAN_API_KEY) {
    console.log("Verifying contract on BaseScan...");

    try {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified successfully!");
    } catch (error) {
      console.error("Contract verification failed:", error.message);
    }
  } else {
    console.log("BASESCAN_API_KEY not provided. Skipping verification.");
    console.log("To verify manually, run:");
    console.log(`npx hardhat verify --network base ${contractAddress}`);
  }

  return contractAddress;
}

main()
  .then((address) => {
    console.log("\nDeployment successful!");
    console.log("Contract address:", address);
    console.log("\nNext steps:");
    console.log("1. Update NEXT_PUBLIC_GAME_CONTRACT_ADDRESS in your .env file");
    console.log("2. Test the contract on Base Mainnet");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });