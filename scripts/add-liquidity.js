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

async function main() {
  try {
    console.log("=== TWG Token Liquidity Addition ===");
    
    // Contract address for the deployed TWGToken
    const contractAddress = "0x6EB64894CFb6a7d00749781aD01975584822dD5F";
    
    // Get the signer (contract owner)
    const [deployer] = await ethers.getSigners();
    console.log(`Owner address: ${deployer.address}`);
    
    // Get contract instance
    const TWGToken = await ethers.getContractFactory("TWGToken");
    const token = await TWGToken.attach(contractAddress);
    
    // Check owner balance
    const ownerBalance = await token.balanceOf(deployer.address);
    console.log(`Owner TWG balance: ${ethers.utils.formatUnits(ownerBalance, 18)} TWG`);
    
    // Check contract balance
    const contractBalance = await token.balanceOf(contractAddress);
    console.log(`Contract TWG balance: ${ethers.utils.formatUnits(contractBalance, 18)} TWG`);
    
    // Get total supply
    const totalSupply = await token.totalSupply();
    console.log(`Total supply: ${ethers.utils.formatUnits(totalSupply, 18)} TWG`);
    
    // Check if trading is enabled
    const tradingEnabled = await token.tradingEnabled();
    console.log(`Trading enabled: ${tradingEnabled}`);
    
    // Prompt for liquidity amount
    console.log("\nRecommended liquidity: 5-20% of total supply");
    console.log(`Recommended range: ${ethers.utils.formatUnits(totalSupply.mul(5).div(100), 18)} - ${ethers.utils.formatUnits(totalSupply.mul(20).div(100), 18)} TWG`);
    
    let liquidityAmount;
    const customAmount = await prompt("\nWould you like to specify a custom amount of tokens for liquidity? (y/n): ");
    
    if (customAmount) {
      const amountStr = await new Promise(resolve => {
        rl.question("Enter amount of tokens to add to liquidity (e.g., 1000000 for 1 million tokens): ", resolve);
      });
      liquidityAmount = ethers.utils.parseUnits(amountStr, 18);
    } else {
      // Default to 10% of total supply
      liquidityAmount = totalSupply.mul(10).div(100);
      console.log(`Using default: ${ethers.utils.formatUnits(liquidityAmount, 18)} TWG (10% of total supply)`);
    }
    
    // Check if contract has enough tokens
    if (contractBalance.lt(liquidityAmount)) {
      console.error("\nERROR: Contract doesn't have enough tokens for liquidity");
      console.log(`Required: ${ethers.utils.formatUnits(liquidityAmount, 18)} TWG`);
      console.log(`Available: ${ethers.utils.formatUnits(contractBalance, 18)} TWG`);
      rl.close();
      return;
    }
    
    // Ask for ETH amount to pair with tokens
    console.log("\nYou'll need to provide ETH to pair with your tokens");
    const ethAmount = await new Promise(resolve => {
      rl.question("Enter amount of ETH to add to liquidity (e.g., 1.5 for 1.5 ETH): ", resolve);
    });
    
    const ethAmountWei = ethers.utils.parseEther(ethAmount);
    console.log(`ETH amount: ${ethers.utils.formatEther(ethAmountWei)} ETH`);
    
    // Check owner ETH balance
    const ethBalance = await deployer.getBalance();
    console.log(`Owner ETH balance: ${ethers.utils.formatEther(ethBalance)} ETH`);
    
    if (ethBalance.lt(ethAmountWei.add(ethers.utils.parseEther("0.05")))) { // Add buffer for gas
      console.error("\nERROR: Not enough ETH in wallet (including gas buffer)");
      rl.close();
      return;
    }
    
    // Display summary
    console.log("\n=== Liquidity Addition Summary ===");
    console.log(`TWG amount: ${ethers.utils.formatUnits(liquidityAmount, 18)} TWG`);
    console.log(`ETH amount: ${ethers.utils.formatEther(ethAmountWei)} ETH`);
    console.log(`Provider: Uniswap V2`);
    
    // Calculate estimated price
    const tokenPerEth = liquidityAmount.div(ethAmountWei);
    console.log(`\nEstimated initial price: 1 ETH = ${ethers.utils.formatUnits(tokenPerEth, 18)} TWG`);
    console.log(`Estimated token value: 1 TWG = ${ethers.utils.formatEther(ethAmountWei.mul(ethers.utils.parseEther("1")).div(liquidityAmount))} ETH`);
    
    // Confirm
    const proceed = await prompt("\nProceed with adding liquidity? (y/n): ");
    
    if (proceed) {
      console.log("\nAdding liquidity...");
      
      // First, approve the router to spend tokens
      console.log("Sending approval transaction...");
      const approveTx = await token.approve(
        await token.uniswapV2Router(), 
        liquidityAmount
      );
      console.log(`Approval transaction sent: ${approveTx.hash}`);
      
      const approveReceipt = await approveTx.wait();
      console.log(`Approval confirmed in block ${approveReceipt.blockNumber}`);
      
      // Add liquidity
      console.log("\nSending addLiquidity transaction...");
      const addLiquidityTx = await token.addLiquidity(
        liquidityAmount,
        { value: ethAmountWei }
      );
      console.log(`Transaction sent: ${addLiquidityTx.hash}`);
      
      console.log("Waiting for confirmation (this may take a minute)...");
      const receipt = await addLiquidityTx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(`Gas used: ${receipt.gasUsed.toString()}`);
      
      console.log("\n✅ Liquidity added successfully!");
      
      // Get Uniswap pair address
      const pairAddress = await token.uniswapV2Pair();
      console.log(`\nUniswap V2 pair address: ${pairAddress}`);
      console.log(`View on Etherscan: https://etherscan.io/address/${pairAddress}`);
      
      // Check if trading is enabled, prompt to enable if not
      if (!tradingEnabled) {
        const enableTrading = await prompt("\nWould you like to enable trading now? (y/n): ");
        
        if (enableTrading) {
          console.log("\nEnabling trading...");
          const enableTx = await token.enableTrading();
          console.log(`Transaction sent: ${enableTx.hash}`);
          
          console.log("Waiting for confirmation...");
          const enableReceipt = await enableTx.wait();
          console.log(`Transaction confirmed in block ${enableReceipt.blockNumber}`);
          
          console.log("\n✅ Trading enabled successfully!");
          console.log("NOTE: Initial sell tax is set to 30% for the first 24 hours.");
        } else {
          console.log("\nTrading remains disabled. You can enable it later using the enableTrading function.");
        }
      }
      
    } else {
      console.log("Liquidity addition cancelled.");
    }
    
    rl.close();
    
  } catch (error) {
    console.error("Error adding liquidity:", error);
    rl.close();
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Script execution failed:", error);
    process.exit(1);
  }); 