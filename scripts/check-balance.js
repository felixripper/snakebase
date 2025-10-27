// Check wallet balance on Base network
const { ethers } = require("hardhat");

async function main() {
  console.log("💰 Wallet Balance Kontrolü");
  console.log("==========================\n");

  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    console.log("❌ No signer found. Make sure DEPLOYER_PRIVATE_KEY is set in .env.local");
    return;
  }

  const deployer = signers[0];
  const address = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(address);
  
  console.log("📍 Wallet Address:", address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH\n");
  
  const balanceNum = parseFloat(ethers.formatEther(balance));
  if (balanceNum === 0) {
    console.log("❌ No ETH in wallet!\n");
    console.log("🔗 To add ETH:");
    console.log("   1. Go to https://bridge.base.org");
    console.log("   2. Bridge ETH to Base Mainnet");
    console.log("   3. Send to:", address);
    console.log("   4. Minimum: ~$5 worth of ETH\n");
    console.log("📱 Or use Coinbase:");
    console.log("   1. Buy ETH on Coinbase");
    console.log("   2. Withdraw → Select 'Base' network");
    console.log("   3. Send to:", address);
  } else if (balanceNum < 0.001) {
    console.log("⚠️  Low balance - may not be enough for deployment");
    console.log("   Recommended: At least 0.001 ETH (~$2-3)");
  } else {
    console.log("✅ Sufficient balance for deployment!");
    console.log("   Estimated gas cost: ~$1-3");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

