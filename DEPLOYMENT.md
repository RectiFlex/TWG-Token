# TWG Token Deployment Guide

This guide outlines the steps to deploy The Wally Group Token (TWG) to the Ethereum network.

## Prerequisites

1. Node.js (>= 14.x) and npm installed
2. Access to an Ethereum wallet with ETH for deployment (Metamask or hardware wallet)
3. Etherscan API key for contract verification
4. RPC URL for the Ethereum network (Mainnet or Sepolia testnet)

## Setup

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/TWG-Token.git
   cd TWG-Token
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the provided `.env.example`:
   ```
   cp .env.example .env
   ```

4. Edit the `.env` file and add your:
   - Ethereum RPC URLs
   - Private key for deployment
   - Etherscan API key
   - Other configuration variables

## Deployment

### Test Network Deployment (Sepolia)

1. Make sure your wallet has sufficient Sepolia ETH
2. Set the TAX_COLLECTOR_ADDRESS in your `.env` file
3. Deploy to Sepolia:
   ```
   npm run deploy:sepolia
   ```
4. Note the deployed contract address
5. Verify the contract on Sepolia Etherscan:
   ```
   CONTRACT_ADDRESS=<deployed-address> TAX_COLLECTOR_ADDRESS=<tax-collector-address> npm run verify:sepolia
   ```

### Mainnet Deployment

1. Make sure your wallet has sufficient ETH for deployment
2. Set the TAX_COLLECTOR_ADDRESS in your `.env` file
3. Deploy to Mainnet:
   ```
   npm run deploy:mainnet
   ```
4. Note the deployed contract address
5. Verify the contract on Etherscan:
   ```
   CONTRACT_ADDRESS=<deployed-address> TAX_COLLECTOR_ADDRESS=<tax-collector-address> npm run verify:mainnet
   ```

## Post-Deployment

After successful deployment, you should perform the following steps:

1. Set up token vesting for team wallets:
   ```javascript
   // Example using ethers.js
   const TWGToken = await ethers.getContractFactory("TWGToken");
   const token = TWGToken.attach("DEPLOYED_CONTRACT_ADDRESS");
   
   // Create vesting for team wallet (90 days vesting)
   await token.createVesting("TEAM_WALLET_ADDRESS", ethers.utils.parseEther("10000000"), 90);
   ```

2. Distribute tokens to project wallets:
   ```javascript
   // Example using ethers.js
   await token.distributeTokens(
     ["PROJECT_WALLET_1", "PROJECT_WALLET_2"],
     [ethers.utils.parseEther("5000000"), ethers.utils.parseEther("5000000")]
   );
   ```

3. Add liquidity to Uniswap with the full contract:
   ```javascript
   // Example using ethers.js
   await token.addLiquidity(ethers.utils.parseEther("1500000"), { value: ethers.utils.parseEther("10") });
   ```

4. Enable trading when ready to launch:
   ```javascript
   // Example using ethers.js
   await token.enableTrading();
   ```

## Security Considerations

1. Always use a secure private key for deployment
2. Test thoroughly on the testnet before mainnet deployment
3. Consider a smart contract audit before mainnet deployment
4. Keep access to owner wallet secure - consider using a hardware wallet 