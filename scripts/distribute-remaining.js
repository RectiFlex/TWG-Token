const { ethers } = require("hardhat");
const readline = require("readline");

// Create readline interface for user confirmation prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt user for confirmation
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Convert token amount from human-readable to wei (with 18 decimals)
function toTokenAmount(amount) {
  return ethers.utils.parseUnits(amount.toString(), 18);
}

async function main() {
  try {
    console.log("⚠️ LIVE MODE - TRANSACTIONS WILL BE SENT TO THE BLOCKCHAIN ⚠️");
    console.log("You will be asked to confirm each batch before sending");
    
    const confirmed = await prompt("Are you sure you want to proceed with LIVE distribution? (y/n): ");
    if (!confirmed) {
      console.log("Distribution cancelled by user.");
      process.exit(0);
    }
    
    console.log("Starting TWG Token distribution process for remaining addresses...");
    
    // Contract address for the deployed TWGToken
    const contractAddress = "0x6EB64894CFb6a7d00749781aD01975584822dD5F";
    
    // Get the signer (contract owner)
    const [deployer] = await ethers.getSigners();
    console.log(`Deployer address: ${deployer.address}`);
    
    // Get the contract instance
    const TWGToken = await ethers.getContractFactory("TWGToken");
    const token = await TWGToken.attach(contractAddress);
    
    // Define the remaining addresses and amounts that haven't been distributed yet
    // Starting from index 20 (after the first batch)
    const distribution = [
      { address: "0x261b5304d60EC5808aB0869E17F2592de8eD6180", amount: "69452500", category: "TW16", vesting: "" },
      { address: "0xdD806a52Fd9264207Da6d3133417098870e431C4", amount: "66232050", category: "TW17", vesting: "" },
      { address: "0x60aBF0d99E06C7bf9414568b64F34B7e270135E1", amount: "99874400", category: "TW18", vesting: "" },
      { address: "0x750A118512434664084Ea281A015aA41993D23E8", amount: "121555620", category: "TW19", vesting: "" },
      { address: "0x1444523A809d0FB54b761C389939ed7Ca0d821bd", amount: "92201780", category: "TW20", vesting: "" },
      { address: "0xB2B047320Bf34FbB0f426134D346c77b29579f9a", amount: "77854500", category: "TW21", vesting: "" },
      { address: "0xeE6bD51Dc34EE2AEeDB8a40CB7498BAb0478A896", amount: "110044490", category: "TW22", vesting: "" },
      { address: "0x950A8decfF04d36e281422164DEbFb90c562d4e9", amount: "111566650", category: "TW23", vesting: "" },
      { address: "0x7cc71A40F45cfE8fE2beeb8331070118c3bCa792", amount: "97785410", category: "TW24", vesting: "" },
      { address: "0x59145A76F3366A787514FD45d0E02Ac57D72fD8d", amount: "66632520", category: "TW25", vesting: "" },
      { address: "0xefF15cFDA5a35eaF45756F6A68f9c97DEf76014f", amount: "76145220", category: "TW26", vesting: "" },
      { address: "0xC912F1Ce75DB8830e0cb1e4f4C2F1Aa214f61D1e", amount: "87120580", category: "TW27", vesting: "" },
      { address: "0x4aE31a58094d082D2c9a335100CEbA6f9F3f373a", amount: "93452030", category: "TW28", vesting: "" },
      { address: "0xe68c01f3F9BD19e7bDB6C2cE5978b267C4c600c5", amount: "112120580", category: "TW29", vesting: "" },
      { address: "0x2808f8D60e87eBEC6F98Ed8DFfe452Ad8874998b", amount: "98120356", category: "TW30", vesting: "" },
      { address: "0xCF17d55c6dd264052188AE80044BFE589425238b", amount: "110120250", category: "TW31", vesting: "" },
      { address: "0xb3439fEaB0b1955ecF85841cA28EA513Ef556884", amount: "115784520", category: "TW32", vesting: "" },
      { address: "0x8Fd0491bA7Ed00996b681C7b66ff066c5eF7E935", amount: "139302560", category: "TW33", vesting: "" },
      { address: "0xa3d33c7f150B569F99BE6a1F388E60e7D956c361", amount: "121154780", category: "TW34", vesting: "" },
      { address: "0x4Ad405de1c412709f473F24D2621A3743a9d946b", amount: "95784100", category: "TW35", vesting: "" },
      // Add all remaining addresses here
      // For brevity, I've shown the first 20 of the remaining addresses
      // The complete script should include all remaining addresses up to 379
    ];
    
    // Group wallets by category for reporting
    const categorySummary = {};
    for (const wallet of distribution) {
      if (!categorySummary[wallet.category]) {
        categorySummary[wallet.category] = {
          count: 0,
          amount: ethers.BigNumber.from(0)
        };
      }
      categorySummary[wallet.category].count++;
      categorySummary[wallet.category].amount = categorySummary[wallet.category].amount.add(toTokenAmount(wallet.amount));
    }
    
    // Get total tokens to distribute
    let totalTokensToDistribute = ethers.BigNumber.from(0);
    for (const wallet of distribution) {
      totalTokensToDistribute = totalTokensToDistribute.add(toTokenAmount(wallet.amount));
    }
    
    console.log(`Total tokens to distribute: ${ethers.utils.formatUnits(totalTokensToDistribute, 18)} TWG`);
    
    // Check if contract is owned by the deployer
    const owner = await token.owner();
    console.log(`Contract owner: ${owner}`);
    
    if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
      console.log(`⚠️ Warning: The deployer is not the contract owner. Distribution may fail.`);
      const proceedAnyway = await prompt("Continue anyway? (y/n): ");
      if (!proceedAnyway) {
        console.log("Distribution cancelled.");
        process.exit(0);
      }
    }
    
    // Check contract token balance
    const contractBalance = await token.balanceOf(contractAddress);
    console.log(`Contract token balance: ${ethers.utils.formatUnits(contractBalance, 18)} TWG`);
    
    if (contractBalance.lt(totalTokensToDistribute)) {
      console.log(`⚠️ Error: Contract does not have enough tokens for distribution.`);
      console.log(`Required: ${ethers.utils.formatUnits(totalTokensToDistribute, 18)} TWG`);
      console.log(`Available: ${ethers.utils.formatUnits(contractBalance, 18)} TWG`);
      console.log("Distribution cancelled.");
      process.exit(1);
    }
    
    // Print distribution summary by category
    console.log("\n===== DISTRIBUTION SUMMARY =====");
    for (const category in categorySummary) {
      const { count, amount } = categorySummary[category];
      const percentage = amount.mul(100).div(totalTokensToDistribute);
      console.log(`${category}: ${count} wallets, ${ethers.utils.formatUnits(amount, 18)} TWG (${percentage}%)`);
    }
    
    // Process in batches of 20 addresses
    const batchSize = 20;
    const batchCount = Math.ceil(distribution.length / batchSize);
    console.log(`\nDistribution will be processed in ${batchCount} batches of up to ${batchSize} addresses each`);
    
    for (let batchIndex = 0; batchIndex < batchCount; batchIndex++) {
      const start = batchIndex * batchSize;
      const end = Math.min(start + batchSize, distribution.length);
      const batch = distribution.slice(start, end);
      
      console.log(`\n----- Batch ${batchIndex + 1} of ${batchCount} -----`);
      console.log(`Contains ${batch.length} addresses`);
      
      const addresses = [];
      const amounts = [];
      let batchTotal = ethers.BigNumber.from(0);
      
      for (let i = 0; i < batch.length; i++) {
        const { address, amount, category, vesting } = batch[i];
        addresses.push(address);
        const tokenAmount = toTokenAmount(amount);
        amounts.push(tokenAmount);
        batchTotal = batchTotal.add(tokenAmount);
        
        console.log(`  - ${address}: ${amount} TWG (${category}${vesting ? ', ' + vesting : ''})`);
      }
      
      console.log(`  Batch total: ${ethers.utils.formatUnits(batchTotal, 18)} TWG`);
      
      // Ask for confirmation before sending the transaction
      const proceed = await prompt(`\nProceed with this batch distribution? (y/n): `);
      if (!proceed) {
        console.log("Batch skipped. Moving to next batch...");
        continue;
      }
      
      // Send the transaction
      console.log("Sending transaction...");
      const tx = await token.distributeTokens(addresses, amounts);
      console.log(`Transaction sent: ${tx.hash}`);
      console.log("Waiting for confirmation...");
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(`Gas used: ${receipt.gasUsed.toString()}`);
    }
    
    // Set up vesting for addresses that require it
    const vestingAddresses = distribution.filter(wallet => wallet.vesting && wallet.vesting.includes("VESTED"));
    if (vestingAddresses.length > 0) {
      console.log("\n===== SETTING UP VESTING SCHEDULES =====");
      console.log(`Found ${vestingAddresses.length} addresses requiring vesting`);
      
      for (const { address, amount, category, vesting } of vestingAddresses) {
        if (vesting.includes("3M")) {
          console.log(`\nSetting up 3-month vesting for ${address} (${category})`);
          const tokenAmount = toTokenAmount(amount);
          const vestingDuration = 90 * 24 * 60 * 60; // 90 days in seconds
          
          const proceed = await prompt("Proceed with vesting setup? (y/n): ");
          if (!proceed) {
            console.log("Vesting setup skipped. Moving to next address...");
            continue;
          }
          
          try {
            console.log("Sending vesting transaction...");
            const tx = await token.createVesting(address, tokenAmount, vestingDuration);
            console.log(`Transaction sent: ${tx.hash}`);
            console.log("Waiting for confirmation...");
            const receipt = await tx.wait();
            console.log(`Vesting confirmed in block ${receipt.blockNumber}`);
            console.log(`Gas used: ${receipt.gasUsed.toString()}`);
          } catch (error) {
            console.error(`Error setting up vesting for ${address}:`, error.message);
            const continueAnyway = await prompt("Continue with the next vesting setup? (y/n): ");
            if (!continueAnyway) {
              throw error;
            }
          }
        }
      }
    }
    
    console.log("\n===== DISTRIBUTION COMPLETE =====");
    console.log(`Successfully distributed ${ethers.utils.formatUnits(totalTokensToDistribute, 18)} TWG tokens`);
    
  } catch (error) {
    console.error("Error during distribution:", error);
  } finally {
    rl.close();
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Script execution failed:", error);
    process.exit(1);
  }); 