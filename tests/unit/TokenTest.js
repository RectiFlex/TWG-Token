const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TWGToken", function () {
  let token;
  let owner;
  let taxCollector;
  let user1;
  let user2;
  const TOTAL_SUPPLY = ethers.utils.parseEther("10000000000"); // 10 billion tokens
  
  beforeEach(async function () {
    [owner, taxCollector, user1, user2] = await ethers.getSigners();
    
    const TWGToken = await ethers.getContractFactory("TWGToken");
    token = await TWGToken.deploy(taxCollector.address);
  });
  
  it("Should have the correct name and symbol", async function () {
    expect(await token.name()).to.equal("The Wally Group Token");
    expect(await token.symbol()).to.equal("TWG");
  });
  
  it("Should have the correct total supply", async function () {
    expect(await token.totalSupply()).to.equal(TOTAL_SUPPLY);
  });
  
  it("Should mint total supply to contract itself", async function () {
    expect(await token.balanceOf(token.address)).to.equal(TOTAL_SUPPLY);
    expect(await token.balanceOf(owner.address)).to.equal(0);
  });
  
  it("Should set the correct tax collector", async function () {
    expect(await token.taxCollector()).to.equal(taxCollector.address);
  });
  
  it("Should allow owner to change tax collector", async function () {
    await token.setTaxCollector(user1.address);
    expect(await token.taxCollector()).to.equal(user1.address);
  });
  
  it("Should revert if non-owner tries to change tax collector", async function () {
    await expect(token.connect(user1).setTaxCollector(user2.address))
      .to.be.reverted;
  });
  
  it("Should revert if trying to set tax collector to zero address", async function () {
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    await expect(token.setTaxCollector(zeroAddress))
      .to.be.revertedWith("Tax collector cannot be zero address");
  });
  
  it("Should not enable trading by default", async function () {
    expect(await token.tradingEnabled()).to.equal(false);
  });
  
  it("Should distribute tokens correctly", async function () {
    const amount = ethers.utils.parseEther("1000000");
    await token.distributeTokens([user1.address], [amount]);
    expect(await token.balanceOf(user1.address)).to.equal(amount);
  });
}); 