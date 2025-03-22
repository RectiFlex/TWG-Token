const { ethers } = require("hardhat");

async function main() {
  try {
    console.log("===== CHECKING TWG TOKEN BALANCES =====");
    
    // Contract address for the deployed TWGToken
    const contractAddress = "0x6EB64894CFb6a7d00749781aD01975584822dD5F";
    
    // Get the signer
    const [deployer] = await ethers.getSigners();
    console.log(`Current account address: ${deployer.address}`);
    
    // Get the contract instance
    const TWGToken = await ethers.getContractFactory("TWGToken");
    const token = await TWGToken.attach(contractAddress);
    
    // Get token info
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    const totalSupply = await token.totalSupply();
    const owner = await token.owner();
    
    console.log("\n=== TOKEN INFORMATION ===");
    console.log(`Name: ${name}`);
    console.log(`Symbol: ${symbol}`);
    console.log(`Decimals: ${decimals}`);
    console.log(`Total Supply: ${ethers.utils.formatUnits(totalSupply, decimals)} ${symbol}`);
    console.log(`Owner: ${owner}`);
    
    // Check balances
    console.log("\n=== KEY BALANCES ===");
    
    // Contract balance
    const contractBalance = await token.balanceOf(contractAddress);
    console.log(`Contract Balance: ${ethers.utils.formatUnits(contractBalance, decimals)} ${symbol}`);
    
    // Deployer balance
    const deployerBalance = await token.balanceOf(deployer.address);
    console.log(`Deployer Balance: ${ethers.utils.formatUnits(deployerBalance, decimals)} ${symbol}`);
    
    // Owner balance (if different from deployer)
    if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
      const ownerBalance = await token.balanceOf(owner);
      console.log(`Owner Balance: ${ethers.utils.formatUnits(ownerBalance, decimals)} ${symbol}`);
    }
    
    // Check who has most of the tokens
    const percentInContract = contractBalance.mul(100).div(totalSupply);
    const percentInDeployer = deployerBalance.mul(100).div(totalSupply);
    
    console.log(`\nPercentage of tokens in contract: ${percentInContract.toString()}%`);
    console.log(`Percentage of tokens in deployer account: ${percentInDeployer.toString()}%`);
    
    // Calculate remaining tokens
    const remainingPercent = ethers.BigNumber.from(100).sub(percentInContract).sub(percentInDeployer);
    console.log(`Percentage of tokens distributed elsewhere: ${remainingPercent.toString()}%`);
    
    // Check for approval to move tokens if needed
    if (contractBalance.gt(0)) {
      console.log("\nContract has tokens directly in its balance. Use token.transfer() for distribution.");
    } else if (deployerBalance.gt(0)) {
      const allowance = await token.allowance(deployer.address, contractAddress);
      console.log(`\nDeployer → Contract Allowance: ${ethers.utils.formatUnits(allowance, decimals)} ${symbol}`);
      
      if (allowance.lt(deployerBalance)) {
        console.log("Consider approving the contract to spend your tokens if transferFrom will be used.");
      }
    }
    
  } catch (error) {
    console.error("Error checking balances:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Script execution failed:", error);
    process.exit(1);
  }); 