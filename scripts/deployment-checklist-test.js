const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  console.log("========== TWG TOKEN DEPLOYMENT CHECKLIST (TEST VERSION) ==========");
  console.log("NOTE: This is a TEST version with reduced ETH requirements");
  let readyForDeployment = true;
  
  try {
    // 1. Check deployer balance
    const [deployer] = await ethers.getSigners();
    console.log(`Deployer address: ${deployer.address}`);
    
    const balance = await deployer.getBalance();
    console.log(`ETH Balance: ${ethers.utils.formatEther(balance)} ETH`);
    
    // Using a much lower threshold for testing purposes
    const minRecommendedBalance = ethers.utils.parseEther("0.001"); // 0.001 ETH for testing
    if (balance.lt(minRecommendedBalance)) {
      console.log("❌ INSUFFICIENT BALANCE: Your balance is below the minimum threshold");
      readyForDeployment = false;
    } else {
      console.log("✅ Balance is sufficient (for testing purposes only)");
      console.log("   ⚠️ For actual mainnet, you would need at least 0.1 ETH");
    }
    
    // 2. Check network
    console.log(`Network: ${hre.network.name}`);
    if (hre.network.name === 'mainnet') {
      console.log("✅ Mainnet network selected");
      console.log("   ⚠️ YOU ARE ABOUT TO DEPLOY ON MAINNET WITH REAL ETH");
    } else {
      console.log("✅ Test network selected: " + hre.network.name);
    }
    
    // 3. Check tax collector address
    const taxCollectorAddress = process.env.TAX_COLLECTOR_ADDRESS;
    console.log(`Tax Collector Address: ${taxCollectorAddress}`);
    
    if (!taxCollectorAddress || taxCollectorAddress === '0x0000000000000000000000000000000000000000') {
      console.log("❌ Invalid tax collector address");
      readyForDeployment = false;
    } else {
      console.log("✅ Tax collector address is set");
    }
    
    // 4. Check Etherscan API key for verification
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    if (!etherscanApiKey) {
      console.log("⚠️ Etherscan API key not found - contract verification may fail");
    } else {
      console.log("✅ Etherscan API key is set");
    }
    
    // 5. Final readiness check
    console.log("\n========== DEPLOYMENT READINESS SUMMARY ==========");
    if (readyForDeployment) {
      console.log("✅ READY FOR DEPLOYMENT (TEST CHECKLIST)");
      console.log("\nTo deploy, run:");
      if (hre.network.name === 'mainnet') {
        console.log("⚠️ REAL MAINNET DEPLOYMENT: npx hardhat run scripts/deploy.js --network mainnet");
      } else {
        console.log(`npx hardhat run scripts/deploy.js --network ${hre.network.name}`);
      }
    } else {
      console.log("❌ NOT READY FOR DEPLOYMENT - Please fix the issues above");
    }
    
    console.log("\n⚠️ IMPORTANT REMINDERS:");
    console.log("- Mainnet deployments are permanent and cannot be undone");
    console.log("- Make sure your contract has been thoroughly tested and audited");
    console.log("- Have a post-deployment plan for token distribution and liquidity");
    console.log("- Initial contract ownership will be assigned to the deployer address");
    
  } catch (error) {
    console.error("Checklist failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 