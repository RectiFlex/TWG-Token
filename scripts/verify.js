// This script verifies the TWG token deployment and distribution
// It requires hardhat and ethers.js

const { ethers } = require("hardhat");
const hre = require("hardhat");

// The deployed token address (to be replaced after deployment)
const TOKEN_ADDRESS = "DEPLOYED_TOKEN_ADDRESS_HERE";

async function main() {
  try {
    // Check for required environment variables
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const taxCollectorAddress = process.env.TAX_COLLECTOR_ADDRESS;
    
    if (!contractAddress) {
      throw new Error("CONTRACT_ADDRESS environment variable is required");
    }

    if (!taxCollectorAddress) {
      throw new Error("TAX_COLLECTOR_ADDRESS environment variable is required");
    }
    
    console.log(`Verifying contract at address: ${contractAddress}`);
    console.log(`Tax collector address: ${taxCollectorAddress}`);
    console.log(`Network: ${hre.network.name}`);
    
    // Verify the contract
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [taxCollectorAddress],
    });
    
    console.log("Contract verified successfully!");
  } catch (error) {
    if (error.message.includes("Contract source code already verified")) {
      console.log("Contract is already verified!");
    } else {
      console.error("Verification failed:", error);
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });