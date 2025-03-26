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
    
    // Token info
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    const totalSupply = await token.totalSupply();
    
    console.log(`\nToken Info:`);
    console.log(`- Name: ${name}`);
    console.log(`- Symbol: ${symbol}`);
    console.log(`- Decimals: ${decimals}`);
    console.log(`- Total Supply: ${ethers.utils.formatUnits(totalSupply, decimals)} ${symbol}`);
    
    // Check important balances
    const addresses = [
      { name: "Contract", address: contractAddress },
      { name: "Your Address", address: deployer.address },
      { name: "Target Address", address: "0x94efDe2cf44cDCF2120F303593DAec002E44ee11" },
    ];
    
    console.log(`\nAccount Balances:`);
    for (const item of addresses) {
      const balance = await token.balanceOf(item.address);
      console.log(`- ${item.name} (${item.address}): ${ethers.utils.formatUnits(balance, decimals)} ${symbol}`);
    }
    
  } catch (error) {
    console.error("Error in balance check script:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Script execution failed:", error);
    process.exit(1);
  }); 