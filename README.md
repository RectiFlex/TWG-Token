# The Wally Group Token (TWG)

A secure ERC-20 token implementation with vesting, transaction limits, and early tax mechanisms.

## Features

- **Total Supply**: 10 billion TWG tokens
- **Transaction Limits**: Min 1,000 tokens, Max 150 million tokens per transaction
- **Initial Sell Tax**: 30% for the first 24 hours after trading is enabled
- **Token Distribution**:
  - 4% for Team Reserves (with 3-month vesting)
  - 38% for Migrators
  - 15% for Liquidity
  - 43% for Project/Marketing

## Development

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and add your environment variables:
   ```
   cp .env.example .env
   ```

### Testing

Run the test suite:

```
npm test
```

Run test coverage:

```
npm run coverage
```

### Deployment

Deploy to Ethereum Mainnet:

```
npm run deploy:mainnet
```

Deploy to Sepolia Testnet:

```
npm run deploy:sepolia
```

### Verification

Verify contract on Etherscan for Mainnet:

```
npm run verify:mainnet
```

Verify contract on Etherscan for Sepolia:

```
npm run verify:sepolia
```

## Security

The TWG Token contract includes the following security features:

- Reentrancy protection
- Ownership controls using OpenZeppelin's Ownable
- Transaction limits to prevent large manipulations
- Time-based sell tax to discourage early dumps

## License

MIT 