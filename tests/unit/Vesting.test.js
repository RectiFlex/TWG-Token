const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TWGToken Vesting Functionality (Basic)", function () {
  let token;
  let owner;
  let taxCollector;
  let beneficiary1;
  let beneficiary2;
  
  const VESTING_AMOUNT_1 = ethers.utils.parseEther("10000000"); // 10 million tokens
  const VESTING_AMOUNT_2 = ethers.utils.parseEther("5000000");  // 5 million tokens
  const VESTING_DURATION_1 = 90; // 90 days
  const VESTING_DURATION_2 = 180; // 180 days
  
  beforeEach(async function () {
    [owner, taxCollector, beneficiary1, beneficiary2] = await ethers.getSigners();
    
    const TWGToken = await ethers.getContractFactory("TWGToken");
    token = await TWGToken.deploy(taxCollector.address);
  });
  
  describe("Creating vesting schedule", function () {
    it("Should create a vesting schedule correctly", async function () {
      await token.createVesting(beneficiary1.address, VESTING_AMOUNT_1, VESTING_DURATION_1);
      
      expect(await token.vestedAmount(beneficiary1.address)).to.equal(VESTING_AMOUNT_1);
      
      const vestingStartTime = await token.vestingStartTime(beneficiary1.address);
      const vestingEndTime = await token.vestingEndTime(beneficiary1.address);
      
      // Check that end time is later than start time by at least the duration
      const durationInSeconds = VESTING_DURATION_1 * 24 * 60 * 60;
      expect(vestingEndTime.sub(vestingStartTime)).to.be.at.least(durationInSeconds);
    });
    
    it("Should revert if not called by owner", async function () {
      await expect(
        token.connect(beneficiary1).createVesting(
          beneficiary1.address, 
          VESTING_AMOUNT_1, 
          VESTING_DURATION_1
        )
      ).to.be.reverted;
    });
    
    it("Should revert with zero address", async function () {
      const zeroAddress = "0x0000000000000000000000000000000000000000";
      await expect(
        token.createVesting(
          zeroAddress, 
          VESTING_AMOUNT_1, 
          VESTING_DURATION_1
        )
      ).to.be.revertedWith("Beneficiary cannot be zero address");
    });
    
    it("Should revert with zero amount", async function () {
      await expect(
        token.createVesting(
          beneficiary1.address, 
          0, 
          VESTING_DURATION_1
        )
      ).to.be.revertedWith("Vesting amount must be greater than zero");
    });
    
    it("Should revert with zero duration", async function () {
      await expect(
        token.createVesting(
          beneficiary1.address, 
          VESTING_AMOUNT_1, 
          0
        )
      ).to.be.revertedWith("Vesting duration must be greater than zero");
    });
  });
  
  describe("Basic vesting functionality", function () {
    it("Should have initial available amount of 0", async function () {
      // Create vesting schedule
      await token.createVesting(beneficiary1.address, VESTING_AMOUNT_1, VESTING_DURATION_1);
      
      // Check available amount (should be 0 or very small since not much time has passed)
      const available = await token.calculateAvailableVested(beneficiary1.address);
      expect(available).to.be.lt(VESTING_AMOUNT_1.div(100)); // Less than 1% should be available immediately
    });
  });
}); 