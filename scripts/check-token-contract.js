const { ethers } = require("hardhat");

async function main() {
  try {
    console.log("===== CHECKING TWG TOKEN CONTRACT FUNCTIONS =====");
    
    // Contract address for the deployed TWGToken
    const contractAddress = "0x6EB64894CFb6a7d00749781aD01975584822dD5F";
    
    // Get the signer
    const [deployer] = await ethers.getSigners();
    console.log(`Current account address: ${deployer.address}`);
    
    // Get the contract instance
    const TWGToken = await ethers.getContractFactory("TWGToken");
    const token = await TWGToken.attach(contractAddress);
    
    // Get basic token info
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
    console.log(`Is current user owner: ${owner.toLowerCase() === deployer.address.toLowerCase()}`);
    
    // Check trading status
    let tradingEnabled = false;
    try {
      tradingEnabled = await token.tradingEnabled();
      console.log(`Trading Enabled: ${tradingEnabled}`);
    } catch (err) {
      console.log("Could not check trading status:", err.message);
    }
    
    // Check balances
    console.log("\n=== BALANCES ===");
    
    // Token contract balance
    const contractBalance = await token.balanceOf(contractAddress);
    console.log(`Contract Self-Balance: ${ethers.utils.formatUnits(contractBalance, decimals)} ${symbol}`);
    
    // Owner balance
    const ownerBalance = await token.balanceOf(owner);
    console.log(`Owner Balance: ${ethers.utils.formatUnits(ownerBalance, decimals)} ${symbol}`);
    
    // Current user balance (if different from owner)
    if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
      const userBalance = await token.balanceOf(deployer.address);
      console.log(`Current User Balance: ${ethers.utils.formatUnits(userBalance, decimals)} ${symbol}`);
    }
    
    // Check transfer functionality
    console.log("\n=== TRANSFER FUNCTIONS ===");
    
    // Check if there's a distribute function
    try {
      const hasDistributeFunction = typeof token.distribute === 'function';
      console.log(`Has distribute() function: ${hasDistributeFunction}`);
    } catch (err) {
      console.log("No distribute function found");
    }
    
    // Check if there's a distributeTokens function
    try {
      const hasDistributeTokensFunction = typeof token.distributeTokens === 'function';
      console.log(`Has distributeTokens() function: ${hasDistributeTokensFunction}`);
    } catch (err) {
      console.log("No distributeTokens function found");
    }
    
    // Check if there's an airdrop function
    try {
      const hasAirdropFunction = typeof token.airdrop === 'function';
      console.log(`Has airdrop() function: ${hasAirdropFunction}`);
    } catch (err) {
      console.log("No airdrop function found");
    }
    
    // Check if there's a releaseTokens function
    try {
      const hasReleaseTokensFunction = typeof token.releaseTokens === 'function';
      console.log(`Has releaseTokens() function: ${hasReleaseTokensFunction}`);
    } catch (err) {
      console.log("No releaseTokens function found");
    }
    
    // Get contract interface functions
    console.log("\n=== CONTRACT ABI FUNCTIONS ===");
    try {
      const abi = TWGToken.interface.fragments
        .filter(fragment => fragment.type === 'function')
        .map(fragment => fragment.name);
      
      console.log("Available functions:");
      abi.forEach(name => console.log(`- ${name}`));
    } catch (err) {
      console.log("Could not list contract functions:", err.message);
    }
    
  } catch (error) {
    console.error("Error checking token contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Script execution failed:", error);
    process.exit(1);
  }); 