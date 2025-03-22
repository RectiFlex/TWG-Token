const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("TWGToken - Full Lifecycle Integration Test", function () {
  let token;
  let owner;
  let taxCollector;
  let teamWallet;
  let projectWallet;
  let user1;
  let user2;
  let uniswapRouter;
  let uniswapPair;
  
  // Constants
  const TOTAL_SUPPLY = ethers.parseEther("10000000000"); // 10 billion tokens
  const TEAM_ALLOCATION = ethers.parseEther("400000000"); // 400 million tokens (4%)
  const PROJECT_ALLOCATION = ethers.parseEther("4300000000"); // 4.3 billion tokens (43%)
  const LIQUIDITY_ALLOCATION = ethers.parseEther("1500000000"); // 1.5 billion tokens (15%)
  const MIGRATORS_ALLOCATION = ethers.parseEther("3800000000"); // 3.8 billion tokens (38%)
  const VESTING_DURATION = 90; // 90 days
  
  before(async function () {
    [owner, taxCollector, teamWallet, projectWallet, user1, user2, uniswapRouter, uniswapPair] = await ethers.getSigners();
    
    // Deploy token
    const TWGToken = await ethers.getContractFactory("TWGToken");
    token = await TWGToken.deploy(taxCollector.address, uniswapRouter.address);
    
    console.log("Token deployed to:", token.target);
  });
  
  describe("1. Initial Setup Phase", function () {
    it("Should distribute tokens to team wallet with vesting", async function () {
      // Create vesting for team wallet
      await token.createVesting(teamWallet.address, TEAM_ALLOCATION, VESTING_DURATION);
      
      expect(await token.vestedAmount(teamWallet.address)).to.equal(TEAM_ALLOCATION);
      
      const vestingStartTime = await token.vestingStartTime(teamWallet.address);
      const vestingEndTime = await token.vestingEndTime(teamWallet.address);
      
      expect(vestingEndTime).to.equal(vestingStartTime + VESTING_DURATION * 24 * 60 * 60);
    });
    
    it("Should distribute tokens to project wallet", async function () {
      // Distribute directly to project wallet
      await token.distributeTokens([projectWallet.address], [PROJECT_ALLOCATION]);
      
      expect(await token.balanceOf(projectWallet.address)).to.equal(PROJECT_ALLOCATION);
    });
    
    it("Should add liquidity with correct amount", async function () {
      // We'll use the ETH value directly for simplicity in this test
      const ethForLiquidity = ethers.parseEther("10");
      
      // Add liquidity to uniswap
      await token.addLiquidity(LIQUIDITY_ALLOCATION, { value: ethForLiquidity });
      
      // Set uniswapPair for testing
      Object.defineProperty(token, 'uniswapV2Pair', {
        get: () => uniswapPair.address
      });
    });
  });
  
  describe("2. Pre-trading Phase", function () {
    it("Should allow team to transfer tokens", async function () {
      // Simulate time passing to release some tokens
      const vestingStartTime = await token.vestingStartTime(teamWallet.address);
      const vestingEndTime = await token.vestingEndTime(teamWallet.address);
      const quarterDuration = (vestingEndTime - vestingStartTime) / 4;
      
      await time.setNextBlockTimestamp(vestingStartTime + quarterDuration);
      await ethers.provider.send("evm_mine");
      
      // Release 1/4 of vested tokens
      await token.releaseVestedTokens(teamWallet.address);
      
      const expectedReleased = TEAM_ALLOCATION / 4n;
      expect(await token.balanceOf(teamWallet.address)).to.be.closeTo(
        expectedReleased,
        ethers.parseEther("1") // Allow small margin of error
      );
      
      // Team should be able to transfer to user1 before trading is enabled
      // but first we need to exclude teamWallet from tx limits
      await token.excludeFromTxLimits(teamWallet.address);
      
      const transferAmount = ethers.parseEther("1000000");
      await token.connect(teamWallet).transfer(user1.address, transferAmount);
      
      expect(await token.balanceOf(user1.address)).to.equal(transferAmount);
    });
    
    it("Should prevent regular users from transferring before trading is enabled", async function () {
      // user1 tries to transfer to user2
      const transferAmount = ethers.parseEther("100000");
      
      await expect(token.connect(user1).transfer(user2.address, transferAmount))
        .to.be.revertedWith("Trading not yet enabled");
    });
  });
  
  describe("3. Trading Enabled Phase", function () {
    before(async function () {
      // Enable trading
      await token.enableTrading();
    });
    
    it("Should allow regular transfers after trading is enabled", async function () {
      const transferAmount = ethers.parseEther("100000");
      
      await token.connect(user1).transfer(user2.address, transferAmount);
      
      expect(await token.balanceOf(user2.address)).to.equal(transferAmount);
    });
    
    it("Should enforce transaction limits", async function () {
      // Should enforce minimum transaction amount
      await expect(token.connect(user2).transfer(user1.address, ethers.parseEther("999")))
        .to.be.revertedWith("Transfer amount below minimum");
      
      // Should enforce maximum transaction amount
      await expect(token.connect(user1).transfer(user2.address, ethers.parseEther("151000000")))
        .to.be.revertedWith("Transfer amount exceeds maximum");
    });
    
    it("Should apply sell tax during tax period", async function () {
      // user2 sells tokens to uniswap pair
      const sellAmount = ethers.parseEther("50000");
      const taxAmount = (sellAmount * 30n) / 100n; // 30% tax
      const receivedAmount = sellAmount - taxAmount;
      
      await expect(token.connect(user2).transfer(uniswapPair.address, sellAmount))
        .to.changeTokenBalances(
          token,
          [user2.address, uniswapPair.address, taxCollector.address],
          [sellAmount * -1n, receivedAmount, taxAmount]
        );
    });
  });
  
  describe("4. Post-tax Period Phase", function () {
    before(async function () {
      // Fast forward time to after tax period (24 hours)
      const tradingEnabledTimestamp = await token.tradingEnabledTimestamp();
      await time.setNextBlockTimestamp(tradingEnabledTimestamp + 24 * 60 * 60 + 1);
      await ethers.provider.send("evm_mine");
    });
    
    it("Should not apply sell tax after tax period", async function () {
      // user1 sells tokens to uniswap pair
      const sellAmount = ethers.parseEther("50000");
      
      await expect(token.connect(user1).transfer(uniswapPair.address, sellAmount))
        .to.changeTokenBalances(
          token,
          [user1.address, uniswapPair.address],
          [sellAmount * -1n, sellAmount]
        );
    });
  });
  
  describe("5. Vesting Completion Phase", function () {
    before(async function () {
      // Fast forward time to after vesting period
      const vestingEndTime = await token.vestingEndTime(teamWallet.address);
      await time.setNextBlockTimestamp(vestingEndTime + 1);
      await ethers.provider.send("evm_mine");
    });
    
    it("Should release all remaining vested tokens", async function () {
      const remainingVested = await token.calculateAvailableVested(teamWallet.address);
      
      await expect(token.releaseVestedTokens(teamWallet.address))
        .to.changeTokenBalances(
          token,
          [token.target, teamWallet.address],
          [remainingVested * -1n, remainingVested]
        );
    });
  });
}); 