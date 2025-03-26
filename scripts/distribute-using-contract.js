const { ethers } = require("hardhat");

async function main() {
  try {
    console.log("===== DISTRIBUTING TWG TOKENS USING CONTRACT FUNCTION =====");
    
    // Contract address for the deployed TWGToken
    const contractAddress = "0x6EB64894CFb6a7d00749781aD01975584822dD5F";
    
    // Get the signer
    const [deployer] = await ethers.getSigners();
    console.log(`Deployer address: ${deployer.address}`);
    
    // Get the contract instance
    const TWGToken = await ethers.getContractFactory("TWGToken");
    const token = await TWGToken.attach(contractAddress);
    
    // Skip ownership check since ownership has been renounced
    console.log(`Contract ownership has been renounced. Proceeding with distribution...`);

    // Token info
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    
    // Check contract balance
    const contractBalance = await token.balanceOf(contractAddress);
    console.log(`Contract Token Balance: ${ethers.utils.formatUnits(contractBalance, decimals)} ${symbol}`);
    
    // Check trading status
    const tradingEnabled = await token.tradingEnabled();
    console.log(`Trading Enabled: ${tradingEnabled}`);
    
    // Define addresses to distribute to (just a few for testing)
    const addressesToDistribute = [
      { address: "0x94efDe2cf44cDCF2120F303593DAec002E44ee11", amount: "16000000", category: "MIGRATOR", vesting: "" },
    ];
    
    // Prepare arrays for the distributeTokens function
    const recipients = addressesToDistribute.map(r => r.address);
    const amounts = addressesToDistribute.map(r => ethers.utils.parseUnits(r.amount, decimals));
    
    // Calculate total to distribute
    const totalToDistribute = amounts.reduce((acc, val) => acc.add(val), ethers.BigNumber.from(0));
    console.log(`Total tokens to distribute: ${ethers.utils.formatUnits(totalToDistribute, decimals)} ${symbol}`);
    
    if (contractBalance.lt(totalToDistribute)) {
      console.error("Contract doesn't have enough tokens to distribute.");
      return;
    }
    
    // Check for zero balances first
    console.log("\n=== CHECKING CURRENT BALANCES ===");
    
    for (let i = 0; i < recipients.length; i++) {
      const balance = await token.balanceOf(recipients[i]);
      if (!balance.isZero()) {
        console.log(`${recipients[i]} (${addressesToDistribute[i].category}) already has ${ethers.utils.formatUnits(balance, decimals)} ${symbol}`);
        console.log("Will add more tokens to this address.");
      } else {
        console.log(`${recipients[i]} (${addressesToDistribute[i].category}) has zero balance`);
      }
    }
    
    if (recipients.length === 0) {
      console.log("No addresses to distribute to. Exiting.");
      return;
    }
    
    // Call the distributeTokens function
    console.log("\n=== DISTRIBUTING TOKENS ===");
    console.log(`Distributing to ${recipients.length} addresses...`);
    
    try {
      const gasEstimate = await token.estimateGas.distributeTokens(recipients, amounts);
      console.log(`Gas estimate for distribution: ${gasEstimate.toString()}`);
      
      const tx = await token.distributeTokens(recipients, amounts, {
        gasLimit: gasEstimate.mul(ethers.BigNumber.from(2)) // Double the gas estimate for safety
      });
      
      console.log(`Transaction hash: ${tx.hash}`);
      console.log("Waiting for transaction confirmation...");
      
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      
      // Verify the new balances
      console.log("\n=== VERIFYING NEW BALANCES ===");
      for (let i = 0; i < recipients.length; i++) {
        const newBalance = await token.balanceOf(recipients[i]);
        console.log(`${recipients[i]} (${addressesToDistribute[i].category}): ${ethers.utils.formatUnits(newBalance, decimals)} ${symbol}`);
      }
      
      // Check the new contract balance
      const newContractBalance = await token.balanceOf(contractAddress);
      console.log(`\nRemaining contract balance: ${ethers.utils.formatUnits(newContractBalance, decimals)} ${symbol}`);
      
    } catch (error) {
      console.error("Failed to distribute tokens:", error.message);
      
      if (error.message.includes("execution reverted")) {
        console.log("\nPossible solutions:");
        console.log("1. Check if the distributeTokens function requires trading to be enabled");
        console.log("2. Check if there are any access control restrictions on the function");
        console.log("3. Look at the contract code to understand the requirements for the distributeTokens function");
      }
    }
    
    console.log("\n===== DISTRIBUTION COMPLETE =====");
    
  } catch (error) {
    console.error("Error in distribution script:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Script execution failed:", error);
    process.exit(1);
  }); 