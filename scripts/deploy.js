const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  try {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);
  
  const startingBalance = await deployer.getBalance();
  console.log(`Starting balance: ${ethers.utils.formatEther(startingBalance)} ETH`);
  
    // Get tax collector address from env or use deployer address as fallback
    let taxCollectorAddress = process.env.TAX_COLLECTOR_ADDRESS;
    
    // Validate tax collector address
    if (!taxCollectorAddress || taxCollectorAddress === '0x0000000000000000000000000000000000000000') {
      console.log('No valid tax collector address provided, using deployer address');
      taxCollectorAddress = deployer.address;
    }
    
    console.log(`Using tax collector address: ${taxCollectorAddress}`);
    
    // Deploy token
    const TWGToken = await ethers.getContractFactory("TWGToken");
    console.log("Deploying TWG Token...");
    const token = await TWGToken.deploy(taxCollectorAddress);
    
    console.log("Waiting for deployment transaction to be mined...");
    await token.deployed();
    
    console.log(`TWG Token deployed to: ${token.address}`);
    
    const endingBalance = await deployer.getBalance();
    console.log(`Ending balance: ${ethers.utils.formatEther(endingBalance)} ETH`);
    console.log(`Gas used: ${ethers.utils.formatEther(startingBalance.sub(endingBalance))} ETH`);
    
    console.log("\nPost-deployment reminders:");
    console.log("1. Run verification script with:");
    console.log(`   CONTRACT_ADDRESS=${token.address} TAX_COLLECTOR_ADDRESS=${taxCollectorAddress} npx hardhat run scripts/verify.js --network [network]`);
    console.log("2. Set up vesting schedules for team wallets");
    console.log("3. Distribute tokens to project and migrator wallets");
    console.log("4. Add liquidity with the addLiquidity function");
    console.log("5. Only enable trading when ready to launch");
    
    // Write deployment info to a file for easy reference
    const fs = require('fs');
    const deploymentInfo = {
      network: hre.network.name,
      tokenAddress: token.address,
      taxCollectorAddress: taxCollectorAddress,
      deployerAddress: deployer.address,
      deploymentTime: new Date().toISOString()
    };
    
    fs.writeFileSync(
      'deployment-info.json', 
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("Deployment information saved to deployment-info.json");
    
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });