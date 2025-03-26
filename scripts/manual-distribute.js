const { ethers } = require("hardhat");

async function main() {
  try {
    console.log("===== MANUALLY DISTRIBUTING TWG TOKENS =====");
    
    // Contract address for the deployed TWGToken
    const contractAddress = "0x6EB64894CFb6a7d00749781aD01975584822dD5F";
    
    // Get the signer
    const [deployer] = await ethers.getSigners();
    console.log(`Sender address: ${deployer.address}`);
    
    // Get the contract instance
    const TWGToken = await ethers.getContractFactory("TWGToken");
    const token = await TWGToken.attach(contractAddress);
    
    // Token info
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    
    // Check sender balance
    const senderBalance = await token.balanceOf(deployer.address);
    console.log(`Sender Token Balance: ${ethers.utils.formatUnits(senderBalance, decimals)} ${symbol}`);
    
    // Define addresses to distribute to
    const addressesToDistribute = [
      { address: "0x94efDe2cf44cDCF2120F303593DAec002E44ee11", amount: "16000000", category: "MIGRATOR", vesting: "" },
    ];
    
    // Prepare arrays for direct transfers
    const recipients = addressesToDistribute.map(r => r.address);
    const amounts = addressesToDistribute.map(r => ethers.utils.parseUnits(r.amount, decimals));
    
    // Calculate total to distribute
    const totalToDistribute = amounts.reduce((acc, val) => acc.add(val), ethers.BigNumber.from(0));
    console.log(`Total tokens to distribute: ${ethers.utils.formatUnits(totalToDistribute, decimals)} ${symbol}`);
    
    if (senderBalance.lt(totalToDistribute)) {
      console.error("Sender doesn't have enough tokens to distribute.");
      return;
    }
    
    // Check for current balances first
    console.log("\n=== CHECKING CURRENT BALANCES ===");
    
    for (let i = 0; i < recipients.length; i++) {
      const balance = await token.balanceOf(recipients[i]);
      console.log(`${recipients[i]} (${addressesToDistribute[i].category}) has ${ethers.utils.formatUnits(balance, decimals)} ${symbol}`);
    }
    
    if (recipients.length === 0) {
      console.log("No addresses to distribute to. Exiting.");
      return;
    }
    
    // Perform transfers
    console.log("\n=== DISTRIBUTING TOKENS ===");
    console.log(`Distributing to ${recipients.length} addresses...`);
    
    for (let i = 0; i < recipients.length; i++) {
      console.log(`Transferring ${ethers.utils.formatUnits(amounts[i], decimals)} ${symbol} to ${recipients[i]}...`);
      
      try {
        const gasEstimate = await token.estimateGas.transfer(recipients[i], amounts[i]);
        console.log(`Gas estimate for transfer: ${gasEstimate.toString()}`);
        
        const tx = await token.transfer(recipients[i], amounts[i], {
          gasLimit: gasEstimate.mul(ethers.BigNumber.from(2)) // Double the gas estimate for safety
        });
        
        console.log(`Transaction hash: ${tx.hash}`);
        console.log("Waiting for transaction confirmation...");
        
        const receipt = await tx.wait();
        console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      } catch (error) {
        console.error(`Failed to transfer to ${recipients[i]}:`, error.message);
      }
    }
    
    // Verify the new balances
    console.log("\n=== VERIFYING NEW BALANCES ===");
    for (let i = 0; i < recipients.length; i++) {
      const newBalance = await token.balanceOf(recipients[i]);
      console.log(`${recipients[i]} (${addressesToDistribute[i].category}): ${ethers.utils.formatUnits(newBalance, decimals)} ${symbol}`);
    }
    
    // Check the sender's new balance
    const newSenderBalance = await token.balanceOf(deployer.address);
    console.log(`\nRemaining sender balance: ${ethers.utils.formatUnits(newSenderBalance, decimals)} ${symbol}`);
    
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