const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TWGToken Basic Functionality", function () {
  let token;
  let owner;
  let taxCollector;
  let user1;
  let user2;
  let uniswapRouter;
  const TOTAL_SUPPLY = ethers.utils.parseEther("10000000000"); // 10 billion tokens
  
  beforeEach(async function () {
    [owner, taxCollector, user1, user2, uniswapRouter] = await ethers.getSigners();
    
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
  
  it("Should have the correct initial token allocation", async function () {
    // Initially all tokens are in the contract
    expect(await token.balanceOf(token.address)).to.equal(TOTAL_SUPPLY);
    expect(await token.balanceOf(owner.address)).to.equal(0);
  });
  
  it("Should set the correct tax collector", async function () {
    expect(await token.taxCollector()).to.equal(taxCollector.address);
  });
  
  it("Should exclude owner and tax collector from tax", async function () {
    expect(await token.isExcludedFromTax(owner.address)).to.be.true;
    expect(await token.isExcludedFromTax(taxCollector.address)).to.be.true;
    expect(await token.isExcludedFromTax(token.address)).to.be.true;
  });
  
  it("Should exclude owner and tax collector from tx limits", async function () {
    expect(await token.isExcludedFromTxLimits(owner.address)).to.be.true;
    expect(await token.isExcludedFromTxLimits(taxCollector.address)).to.be.true;
    expect(await token.isExcludedFromTxLimits(token.address)).to.be.true;
  });
  
  it("Should not enable trading by default", async function () {
    expect(await token.tradingEnabled()).to.be.false;
  });
}); 