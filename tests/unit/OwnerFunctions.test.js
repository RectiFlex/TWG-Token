const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TWGToken Owner Functions", function () {
  let token;
  let owner;
  let taxCollector;
  let user1;
  let user2;
  let uniswapRouter;
  
  beforeEach(async function () {
    [owner, taxCollector, user1, user2, uniswapRouter] = await ethers.getSigners();
    
    const TWGToken = await ethers.getContractFactory("TWGToken");
    token = await TWGToken.deploy(taxCollector.address);
  });
  
  describe("enableTrading", function () {
    it("Should enable trading", async function () {
      await token.enableTrading();
      expect(await token.tradingEnabled()).to.be.true;
    });
    
    it("Should set the trading enabled timestamp", async function () {
      const tx = await token.enableTrading();
      const blockTimestamp = (await ethers.provider.getBlock(tx.blockNumber)).timestamp;
      
      expect(await token.tradingEnabledTimestamp()).to.equal(blockTimestamp);
    });
    
    it("Should revert if not called by owner", async function () {
      await expect(token.connect(user1).enableTrading()).to.be.reverted;
    });
    
    it("Should revert if trading is already enabled", async function () {
      await token.enableTrading();
      await expect(token.enableTrading()).to.be.revertedWith("Trading already enabled");
    });
  });
  
  describe("setTaxCollector", function () {
    it("Should update the tax collector", async function () {
      await token.setTaxCollector(user1.address);
      expect(await token.taxCollector()).to.equal(user1.address);
    });
    
    it("Should exclude the new tax collector from tax and limits", async function () {
      await token.setTaxCollector(user1.address);
      expect(await token.isExcludedFromTax(user1.address)).to.be.true;
      expect(await token.isExcludedFromTxLimits(user1.address)).to.be.true;
    });
    
    it("Should revert if not called by owner", async function () {
      await expect(token.connect(user1).setTaxCollector(user2.address)).to.be.reverted;
    });
    
    it("Should revert if zero address provided", async function () {
      const zeroAddress = "0x0000000000000000000000000000000000000000";
      await expect(token.setTaxCollector(zeroAddress)).to.be.revertedWith(
        "Tax collector cannot be zero address"
      );
    });
  });
  
  describe("excludeFromTax and includeInTax", function () {
    it("Should exclude an account from tax", async function () {
      await token.excludeFromTax(user1.address);
      expect(await token.isExcludedFromTax(user1.address)).to.be.true;
    });
    
    it("Should include an account in tax", async function () {
      await token.excludeFromTax(user1.address);
      await token.includeInTax(user1.address);
      expect(await token.isExcludedFromTax(user1.address)).to.be.false;
    });
    
    it("Should revert if account is already excluded", async function () {
      await token.excludeFromTax(user1.address);
      await expect(token.excludeFromTax(user1.address)).to.be.revertedWith(
        "Account already excluded from tax"
      );
    });
    
    it("Should revert if account is already included", async function () {
      await expect(token.includeInTax(user1.address)).to.be.revertedWith(
        "Account already included in tax"
      );
    });
  });
  
  describe("excludeFromTxLimits and includeInTxLimits", function () {
    it("Should exclude an account from tx limits", async function () {
      await token.excludeFromTxLimits(user1.address);
      expect(await token.isExcludedFromTxLimits(user1.address)).to.be.true;
    });
    
    it("Should include an account in tx limits", async function () {
      await token.excludeFromTxLimits(user1.address);
      await token.includeInTxLimits(user1.address);
      expect(await token.isExcludedFromTxLimits(user1.address)).to.be.false;
    });
    
    it("Should revert if account is already excluded", async function () {
      await token.excludeFromTxLimits(user1.address);
      await expect(token.excludeFromTxLimits(user1.address)).to.be.revertedWith(
        "Account already excluded from limits"
      );
    });
    
    it("Should revert if account is already included", async function () {
      await expect(token.includeInTxLimits(user1.address)).to.be.revertedWith(
        "Account already included in limits"
      );
    });
  });
}); 