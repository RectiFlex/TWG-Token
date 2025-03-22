const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("TWGToken Transfers and Limits (Basic)", function () {
  let token;
  let owner;
  let taxCollector;
  let user1;
  let user2;
  let user3;
  
  const TOTAL_SUPPLY = ethers.utils.parseEther("10000000000"); // 10 billion tokens
  const MAX_TX_AMOUNT = ethers.utils.parseEther("150000000"); // 150 million tokens
  const MIN_TX_AMOUNT = ethers.utils.parseEther("1000"); // 1000 tokens
  
  beforeEach(async function () {
    [owner, taxCollector, user1, user2, user3] = await ethers.getSigners();
    
    const TWGToken = await ethers.getContractFactory("TWGToken");
    token = await TWGToken.deploy(taxCollector.address);
    
    // Distribute some tokens to users for testing
    await token.distributeTokens(
      [user1.address, user2.address, user3.address],
      [
        ethers.utils.parseEther("10000000"), // 10 million tokens for user1
        ethers.utils.parseEther("5000000"),  // 5 million tokens for user2
        ethers.utils.parseEther("1000000")   // 1 million tokens for user3
      ]
    );
  });
  
  describe("Transfer restrictions before trading enabled", function () {
    it("Should allow transfers between excluded addresses", async function () {
      // Add user1 to excluded list
      await token.excludeFromTxLimits(user1.address);
      
      // Transfer between excluded addresses should work
      await expect(token.connect(user1).transfer(owner.address, ethers.utils.parseEther("1000000")))
        .to.changeTokenBalances(
          token,
          [user1.address, owner.address],
          [ethers.utils.parseEther("-1000000"), ethers.utils.parseEther("1000000")]
        );
    });
    
    it("Should prevent transfers from non-excluded to non-excluded before trading enabled", async function () {
      // Transfer between non-excluded addresses should fail
      await expect(token.connect(user1).transfer(user2.address, ethers.utils.parseEther("1000000")))
        .to.be.revertedWith("Trading not yet enabled");
    });
  });
  
  describe("Transaction limits after trading enabled", function () {
    beforeEach(async function () {
      // Enable trading
      await token.enableTrading();
    });
    
    it("Should enforce minimum transaction amount", async function () {
      // Try to transfer less than minimum
      await expect(token.connect(user1).transfer(user2.address, ethers.utils.parseEther("999")))
        .to.be.revertedWith("Transfer amount below minimum");
    });
    
    it("Should enforce maximum transaction amount", async function () {
      // Try to transfer more than maximum
      await expect(token.connect(user1).transfer(user2.address, ethers.utils.parseEther("151000000")))
        .to.be.revertedWith("Transfer amount exceeds maximum");
    });
    
    it("Should allow transfers below maximum transaction amount", async function () {
      // Transfer below max should work
      await expect(token.connect(user1).transfer(user2.address, ethers.utils.parseEther("1000000")))
        .to.changeTokenBalances(
          token,
          [user1.address, user2.address],
          [ethers.utils.parseEther("-1000000"), ethers.utils.parseEther("1000000")]
        );
    });
  });
}); 