const { ethers } = require("hardhat");

async function main() {
  try {
    console.log("=== TWG Token Vesting Status Checker ===");
    
    // Contract address for the deployed TWGToken
    const contractAddress = "0x6EB64894CFb6a7d00749781aD01975584822dD5F";
    
    // Get the signer (contract owner)
    const [deployer] = await ethers.getSigners();
    console.log(`Owner address: ${deployer.address}`);
    
    // Get contract instance
    const TWGToken = await ethers.getContractFactory("TWGToken");
    const token = await TWGToken.attach(contractAddress);
    
    // Define TEAM wallets with vesting
    const vestedWallets = [
      { address: "0x13375f2f9d12447d1d46cc36940C239351176C0", name: "TEAM 1" },
      { address: "0x47c2962b4fd84D129cb4DC48d8d487E903D866a", name: "TEAM 2" },
      { address: "0xa0336cb7390d9E00DE04aDb64A1ebaDC0D358E0", name: "TEAM 3" },
      { address: "0x42d06669252880169bDBF78f8D8520E0A4E0824", name: "TEAM 4" }
    ];
    
    console.log("\n===== VESTING SCHEDULES =====");
    
    const currentTime = Math.floor(Date.now() / 1000);
    
    for (const wallet of vestedWallets) {
      console.log(`\nChecking vesting for ${wallet.name} (${wallet.address}):`);
      
      try {
        // Get vesting details
        const vesting = await token.vestingSchedules(wallet.address);
        
        if (vesting.amount.gt(0)) {
          const startTime = vesting.startTime.toNumber();
          const endTime = vesting.startTime.add(vesting.duration).toNumber();
          const totalAmount = ethers.utils.formatUnits(vesting.amount, 18);
          const claimed = ethers.utils.formatUnits(vesting.claimed, 18);
          
          console.log(`Total vested amount: ${totalAmount} TWG`);
          console.log(`Amount claimed so far: ${claimed} TWG`);
          console.log(`Vesting started: ${new Date(startTime * 1000).toLocaleString()}`);
          console.log(`Vesting ends: ${new Date(endTime * 1000).toLocaleString()}`);
          
          // Calculate progress
          if (currentTime < startTime) {
            console.log("Status: PENDING (Vesting hasn't started yet)");
            console.log("Available to claim: 0 TWG");
          } else if (currentTime >= endTime) {
            const remaining = ethers.utils.formatUnits(vesting.amount.sub(vesting.claimed), 18);
            console.log("Status: COMPLETED (100% vested)");
            console.log(`Available to claim: ${remaining} TWG`);
          } else {
            // Vesting in progress
            const totalDuration = vesting.duration.toNumber();
            const elapsed = currentTime - startTime;
            const progressPercent = (elapsed / totalDuration) * 100;
            
            // Calculate vested amount based on elapsed time
            const vestedAmount = vesting.amount.mul(elapsed).div(totalDuration);
            const availableToClaim = vestedAmount.sub(vesting.claimed);
            
            console.log(`Status: IN PROGRESS (${progressPercent.toFixed(2)}% vested)`);
            console.log(`Available to claim: ${ethers.utils.formatUnits(availableToClaim, 18)} TWG`);
          }
          
          // Get wallet balance
          const balance = await token.balanceOf(wallet.address);
          console.log(`Current wallet balance: ${ethers.utils.formatUnits(balance, 18)} TWG`);
          
        } else {
          console.log("No vesting schedule found for this address");
          
          // Get wallet balance
          const balance = await token.balanceOf(wallet.address);
          console.log(`Current wallet balance: ${ethers.utils.formatUnits(balance, 18)} TWG`);
        }
      } catch (error) {
        console.log(`Error querying vesting schedule: ${error.message}`);
      }
    }
    
    console.log("\n===== VESTING STATUS SUMMARY =====");
    
    let totalVested = ethers.BigNumber.from("0");
    let totalClaimed = ethers.BigNumber.from("0");
    let totalRemaining = ethers.BigNumber.from("0");
    
    for (const wallet of vestedWallets) {
      try {
        const vesting = await token.vestingSchedules(wallet.address);
        if (vesting.amount.gt(0)) {
          totalVested = totalVested.add(vesting.amount);
          totalClaimed = totalClaimed.add(vesting.claimed);
          totalRemaining = totalRemaining.add(vesting.amount.sub(vesting.claimed));
        }
      } catch (error) {
        // Skip on error
      }
    }
    
    console.log(`Total vested: ${ethers.utils.formatUnits(totalVested, 18)} TWG`);
    console.log(`Total claimed: ${ethers.utils.formatUnits(totalClaimed, 18)} TWG`);
    console.log(`Total remaining: ${ethers.utils.formatUnits(totalRemaining, 18)} TWG`);
    
    // Print help for claiming vested tokens
    console.log("\n===== HOW TO CLAIM VESTED TOKENS =====");
    console.log("To claim vested tokens, team members should:");
    console.log("1. Connect to the contract on Etherscan with their wallet");
    console.log(`2. Open the contract page: https://etherscan.io/address/${contractAddress}#writeContract`);
    console.log("3. Connect their wallet");
    console.log("4. Call the 'claimVestedTokens' function");
    console.log("5. Transaction will release all available vested tokens to their wallet");
    
  } catch (error) {
    console.error("Error checking vesting status:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Script execution failed:", error);
    process.exit(1);
  }); 