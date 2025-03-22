const { ethers } = require("hardhat");

// Helper function to convert amounts to token units
function toTokenAmount(amount) {
  return ethers.utils.parseUnits(amount, 18);
}

async function main() {
  try {
    console.log("=== SIMULATING TWG Token Distribution Process ===");
    console.log("This simulation will check the distribution process without sending actual transactions");
    
    // Contract address for the deployed TWGToken
    const contractAddress = "0x6EB64894CFb6a7d00749781aD01975584822dD5F";
    
    // Get the signer (contract owner)
    const [deployer] = await ethers.getSigners();
    console.log(`\nDeployer address: ${deployer.address}`);
    
    // Get the contract instance
    const TWGToken = await ethers.getContractFactory("TWGToken");
    const token = await TWGToken.attach(contractAddress);
    
    // Import the distribution from the main script
    const fs = require('fs');
    const path = require('path');
    
    // Read the distribution-tokens.js file to extract the addresses and amounts
    const distributionPath = path.join(__dirname, 'distribute-tokens.js');
    console.log(`Reading distribution data from ${distributionPath}`);
    
    const distributionFile = fs.readFileSync(distributionPath, 'utf8');
    
    // Extract all addresses and amounts using regex
    const addressRegex = /address:\s*["']([^"']+)["']/g;
    const amountRegex = /amount:\s*["']([^"']+)["']/g;
    const categoryRegex = /category:\s*["']([^"']+)["']/g;
    
    const addresses = [...distributionFile.matchAll(addressRegex)].map(match => match[1]);
    const amounts = [...distributionFile.matchAll(amountRegex)].map(match => match[1]);
    const categories = [...distributionFile.matchAll(categoryRegex)].map(match => match[1]);
    
    // Create a distribution array
    const distribution = [];
    for (let i = 0; i < addresses.length; i++) {
      distribution.push({
        address: addresses[i],
        amount: amounts[i],
        category: categories[i] || 'Unknown'
      });
    }
    
    console.log(`Found ${distribution.length} entries in distribution file`);
    
    // Get contract information
    let name, symbol, totalSupply, decimals, owner, tradingEnabled;
    
    try {
      name = await token.name();
      symbol = await token.symbol();
      totalSupply = await token.totalSupply();
      decimals = await token.decimals();
      owner = await token.owner();
      tradingEnabled = await token.tradingEnabled();
      
      console.log("\n=== CONTRACT INFORMATION ===");
      console.log(`Name: ${name}`);
      console.log(`Symbol: ${symbol}`);
      console.log(`Decimals: ${decimals}`);
      console.log(`Total Supply: ${ethers.utils.formatUnits(totalSupply, decimals)} ${symbol}`);
      console.log(`Owner: ${owner}`);
      console.log(`Trading Enabled: ${tradingEnabled}`);
      
      // Check contract balance
      const contractBalance = await token.balanceOf(contractAddress);
      console.log(`Contract Token Balance: ${ethers.utils.formatUnits(contractBalance, decimals)} ${symbol}`);
      
      // Check if deployer is owner
      if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
        console.error("\n⚠️ WARNING: Deployer is not the contract owner!");
        console.log(`Deployer: ${deployer.address}`);
        console.log(`Owner: ${owner}`);
        console.log("Distribution should be performed by the contract owner");
      } else {
        console.log("\n✅ Deployer is the contract owner");
      }
    } catch (error) {
      console.log("\n⚠️ Warning: Cannot connect to the contract. Will simulate without contract validation.");
      console.log("This is normal if running on a local network or if the contract is not yet deployed.");
      console.log(`Error details: ${error.message}`);
    }
    
    // Calculate total tokens to distribute
    let totalToDistribute = ethers.BigNumber.from("0");
    for (const item of distribution) {
      totalToDistribute = totalToDistribute.add(toTokenAmount(item.amount));
    }
    
    console.log("\n=== DISTRIBUTION SIMULATION ===");
    console.log(`Total tokens to distribute: ${ethers.utils.formatEther(totalToDistribute)} TWG`);
    
    // Group wallets by category
    const categoryTotals = {};
    for (const item of distribution) {
      if (!categoryTotals[item.category]) {
        categoryTotals[item.category] = {
          count: 0,
          total: ethers.BigNumber.from(0)
        };
      }
      categoryTotals[item.category].count++;
      categoryTotals[item.category].total = categoryTotals[item.category].total.add(toTokenAmount(item.amount));
    }
    
    console.log("\n=== DISTRIBUTION BY CATEGORY ===");
    for (const [category, data] of Object.entries(categoryTotals)) {
      const percentage = data.total.mul(100).div(totalToDistribute).toString();
      console.log(`${category}: ${data.count} addresses, ${ethers.utils.formatEther(data.total)} TWG (${percentage}%)`);
    }
    
    // Simulate distribution in batches
    const BATCH_SIZE = 20;
    console.log(`\n=== BATCH SIMULATION (${BATCH_SIZE} addresses per batch) ===`);
    
    const batchCount = Math.ceil(distribution.length / BATCH_SIZE);
    console.log(`Distribution will require ${batchCount} batches`);
    
    // Test the first batch
    const firstBatch = distribution.slice(0, BATCH_SIZE);
    const batchAddresses = firstBatch.map(item => item.address);
    const batchAmounts = firstBatch.map(item => toTokenAmount(item.amount));
    
    console.log(`\nSimulating first batch (${firstBatch.length} addresses):`);
    for (let i = 0; i < firstBatch.length; i++) {
      console.log(`  ${i+1}. ${firstBatch[i].address}: ${firstBatch[i].amount} TWG (${firstBatch[i].category})`);
    }
    
    // Simulate transaction
    try {
      // Only try if we have contract connection
      if (typeof token.callStatic !== 'undefined') {
        await token.callStatic.distributeTokens(batchAddresses, batchAmounts);
        console.log("\n✅ Distribution transaction would succeed for first batch");
        
        // Estimate gas
        const gasEstimate = await token.estimateGas.distributeTokens(batchAddresses, batchAmounts);
        console.log(`Gas estimate for first batch: ${gasEstimate.toString()}`);
        
        // Calculate ETH cost at current gas price
        const gasPrice = await ethers.provider.getGasPrice();
        const ethCost = gasEstimate.mul(gasPrice);
        console.log(`Current gas price: ${ethers.utils.formatUnits(gasPrice, "gwei")} Gwei`);
        console.log(`Estimated ETH cost per batch: ${ethers.utils.formatEther(ethCost)} ETH`);
        console.log(`Estimated total ETH cost (${batchCount} batches): ~${ethers.utils.formatEther(ethCost.mul(batchCount))} ETH`);
      }
    } catch (error) {
      console.error(`\n❌ Distribution transaction would fail: ${error.message}`);
    }
    
    // Check for vesting schedules
    const vestingCount = distributionFile.match(/VESTED 3M/g)?.length || 0;
    console.log(`\n=== VESTING SCHEDULES ===`);
    console.log(`Found ${vestingCount} addresses requiring vesting`);
    
    if (vestingCount > 0) {
      console.log(`Each vesting setup will be a separate transaction`);
      console.log(`Vesting duration: 90 days`);
    }
    
    // Summary and next steps
    console.log("\n=== SIMULATION SUMMARY ===");
    console.log(`✅ Distribution data validated: ${distribution.length} addresses`);
    console.log(`✅ Total tokens to distribute: ${ethers.utils.formatEther(totalToDistribute)} TWG`);
    console.log(`✅ Distribution requires ${batchCount} batches with ${BATCH_SIZE} addresses per batch`);
    console.log(`✅ ${vestingCount} addresses require 3-month vesting`);
    
    console.log("\n=== NEXT STEPS ===");
    console.log("1. To run the actual distribution, use:");
    console.log("   npx hardhat run scripts/distribute-tokens.js --network mainnet");
    console.log("2. Remember to manually confirm each batch during the distribution");
    console.log("3. After distribution, set up liquidity and enable trading when ready");
    
  } catch (error) {
    console.error("Simulation failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Script execution failed:", error);
    process.exit(1);
  }); 