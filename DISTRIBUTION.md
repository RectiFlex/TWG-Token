# TWG Token Distribution Guide

This document outlines the process for distributing the TWG Tokens from the contract to various wallets according to the tokenomics plan.

## Contract Information
- **Contract Address**: `0x6EB64894CFb6a7d00749781aD01975584822dD5F`
- **Total Supply**: 10,000,000,000 TWG (10 billion)
- **Owner**: `0x94efDe2cf44cDCF2120F303593DAec002E44ee11`

## Pre-Distribution Checklist

Before starting the distribution process, ensure:

1. You have access to the owner wallet with sufficient ETH for gas
2. You have verified the contract on Etherscan
3. You have a list of valid wallet addresses and amounts for distribution
4. Trading is disabled (default state)

## Wallet Address Validation

All Ethereum wallet addresses must:
- Start with '0x'
- Contain exactly 42 characters (including '0x')
- Only contain hexadecimal characters (0-9, a-f, A-F)

Run the validation script to check your wallet addresses before distribution:

```
npx hardhat run scripts/validate-addresses.js
```

## Distribution Process

### 1. Update the Distribution Script

Edit the `scripts/distribute-tokens.js` file to include all valid wallet addresses and token amounts. The script is configured to:

- Process wallets in batches of 20 for gas optimization
- Request confirmation before each transaction
- Set up vesting schedules for wallets marked with "VESTED 3M"

### 2. Run the Distribution Script

Execute the distribution script:

```
npx hardhat run scripts/distribute-tokens.js --network mainnet
```

This will:
1. Connect to the mainnet
2. Verify contract token balance
3. Display a distribution summary by category
4. Process distribution in batches, requesting confirmation for each
5. Set up vesting schedules for wallets requiring 3-month vesting

### 3. Set Up Vesting Schedules

For team wallets requiring vesting:
- The script will set up 90-day vesting periods
- Tokens will gradually unlock over the 90-day period
- The wallet owner can check their vesting status using the `vestingSchedules` function

## Post-Distribution Steps

After distributing all tokens:

### 1. Add Liquidity

Call the `addLiquidity` function to add tokens to the liquidity pool:

```javascript
// Example script snippet
const liquidityAmount = ethers.utils.parseUnits("1000000", 18); // 1 million tokens
const tx = await token.addLiquidity(liquidityAmount);
await tx.wait();
```

### 2. Enable Trading

When ready to launch, enable trading using the `enableTrading` function:

```javascript
const tx = await token.enableTrading();
await tx.wait();
```

Note: Trading will start with a 30% sell tax for the first 24 hours, then automatically decrease to 10%.

### 3. Verify Final Token Distribution

Check token balances:
1. Visit the contract on Etherscan: [0x6EB64894CFb6a7d00749781aD01975584822dD5F](https://etherscan.io/address/0x6EB64894CFb6a7d00749781aD01975584822dD5F)
2. Go to the "Read Contract" section
3. Use the `balanceOf` function to verify balances for each address

## Common Issues and Solutions

### Insufficient Gas
- If transactions fail due to insufficient gas, increase the gas limit in your script or wallet

### Transaction Reverted
- Check that the owner wallet is initiating the transaction
- Verify the contract has sufficient token balance
- Ensure addresses are valid Ethereum addresses

### Vesting Issues
- If a vesting transaction fails, try setting up vesting individually using the contract's `createVesting` function directly

## Security Considerations

- Keep the owner's private key secure
- Consider transferring ownership to a multi-signature wallet after distribution
- Monitor contract activity regularly during and after distribution
- Consider locking liquidity to build investor trust

## Support

If you encounter any issues during the distribution process, contact the development team for assistance. 