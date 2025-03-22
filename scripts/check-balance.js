const { ethers } = require("hardhat");

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    console.log(`Deployer address: ${deployer.address}`);
    
    const balance = await deployer.getBalance();
    console.log(`ETH Balance: ${ethers.utils.formatEther(balance)} ETH`);
    
    // Check if balance is sufficient for deployment
    const minRecommendedBalance = ethers.utils.parseEther("0.1"); // 0.1 ETH
    if (balance.lt(minRecommendedBalance)) {
      console.warn(`WARNING: Your balance is below the recommended 0.1 ETH for mainnet deployment.`);
      console.warn(`Consider adding more ETH to your account before proceeding.`);
    }
  } catch (error) {
    console.error("Failed to check balance:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 