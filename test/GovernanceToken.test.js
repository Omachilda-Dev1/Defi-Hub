const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GovernanceToken", function () {
  let governanceToken;
  let owner, minter, user;

  beforeEach(async function () {
    [owner, minter, user] = await ethers.getSigners();
    
    const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
    governanceToken = await GovernanceToken.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await governanceToken.owner()).to.equal(owner.address);
    });

    it("Should mint initial supply to owner", async function () {
      const initialSupply = ethers.parseEther("1000000");
      expect(await governanceToken.balanceOf(owner.address)).to.equal(initialSupply);
    });

    it("Should have correct name and symbol", async function () {
      expect(await governanceToken.name()).to.equal("DeFi Governance Token");
      expect(await governanceToken.symbol()).to.equal("DGT");
    });
  });

  describe("Minter Management", function () {
    it("Should add minter", async function () {
      await governanceToken.addMinter(minter.address);
      expect(await governanceToken.minters(minter.address)).to.be.true;
    });

    it("Should remove minter", async function () {
      await governanceToken.addMinter(minter.address);
      await governanceToken.removeMinter(minter.address);
      expect(await governanceToken.minters(minter.address)).to.be.false;
    });

    it("Should fail to add minter from non-owner", async function () {
      await expect(
        governanceToken.connect(user).addMinter(minter.address)
      ).to.be.reverted;
    });
  });

  describe("Minting", function () {
    beforeEach(async function () {
      await governanceToken.addMinter(minter.address);
    });

    it("Should mint tokens from authorized minter", async function () {
      const amount = ethers.parseEther("1000");
      await governanceToken.connect(minter).mint(user.address, amount);
      expect(await governanceToken.balanceOf(user.address)).to.equal(amount);
    });

    it("Should mint tokens from owner", async function () {
      const amount = ethers.parseEther("1000");
      await governanceToken.mint(user.address, amount);
      expect(await governanceToken.balanceOf(user.address)).to.equal(amount);
    });

    it("Should fail to mint from unauthorized address", async function () {
      const amount = ethers.parseEther("1000");
      await expect(
        governanceToken.connect(user).mint(user.address, amount)
      ).to.be.revertedWith("Not authorized to mint");
    });
  });

  describe("Burning", function () {
    it("Should burn tokens", async function () {
      const burnAmount = ethers.parseEther("1000");
      const initialBalance = await governanceToken.balanceOf(owner.address);
      
      await governanceToken.burn(burnAmount);
      
      expect(await governanceToken.balanceOf(owner.address)).to.equal(
        initialBalance - burnAmount
      );
    });
  });
});
