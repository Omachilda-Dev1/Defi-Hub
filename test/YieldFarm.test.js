const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("YieldFarm", function () {
  let governanceToken, liquidityPool, yieldFarm;
  let owner, user1, user2;
  const REWARD_PER_BLOCK = ethers.parseEther("10");

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
    governanceToken = await GovernanceToken.deploy();
    
    const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
    liquidityPool = await LiquidityPool.deploy(await governanceToken.getAddress());
    
    const YieldFarm = await ethers.getContractFactory("YieldFarm");
    const currentBlock = await ethers.provider.getBlockNumber();
    yieldFarm = await YieldFarm.deploy(
      await governanceToken.getAddress(),
      REWARD_PER_BLOCK,
      currentBlock
    );
    
    await governanceToken.addMinter(await yieldFarm.getAddress());
    await governanceToken.transfer(await yieldFarm.getAddress(), ethers.parseEther("100000"));
    
    await governanceToken.transfer(user1.address, ethers.parseEther("50000"));
    await governanceToken.connect(user1).approve(
      await liquidityPool.getAddress(),
      ethers.parseEther("10000")
    );
    
    await liquidityPool.connect(user1).addLiquidity(ethers.parseEther("10000"), {
      value: ethers.parseEther("10")
    });
  });

  describe("Pool Management", function () {
    it("Should add pool", async function () {
      await yieldFarm.addPool(
        await liquidityPool.getAddress(),
        100,
        0,
        false
      );
      
      expect(await yieldFarm.poolLength()).to.equal(1);
    });

    it("Should update pool allocation", async function () {
      await yieldFarm.addPool(
        await liquidityPool.getAddress(),
        100,
        0,
        false
      );
      
      await yieldFarm.setPool(0, 200, false);
      const pool = await yieldFarm.poolInfo(0);
      expect(pool.allocPoint).to.equal(200);
    });
  });

  describe("Staking", function () {
    beforeEach(async function () {
      await yieldFarm.addPool(
        await liquidityPool.getAddress(),
        100,
        0,
        false
      );
    });

    it("Should stake LP tokens", async function () {
      const stakeAmount = ethers.parseEther("1");
      const lpBalance = await liquidityPool.balanceOf(user1.address);
      
      await liquidityPool.connect(user1).approve(
        await yieldFarm.getAddress(),
        stakeAmount
      );
      
      await yieldFarm.connect(user1).stake(0, stakeAmount);
      
      const userInfo = await yieldFarm.userInfo(0, user1.address);
      expect(userInfo.amount).to.equal(stakeAmount);
    });

    it("Should calculate pending rewards", async function () {
      const stakeAmount = ethers.parseEther("1");
      
      await liquidityPool.connect(user1).approve(
        await yieldFarm.getAddress(),
        stakeAmount
      );
      
      await yieldFarm.connect(user1).stake(0, stakeAmount);
      
      await ethers.provider.send("evm_mine");
      await ethers.provider.send("evm_mine");
      
      const pending = await yieldFarm.pendingReward(0, user1.address);
      expect(pending).to.be.gt(0);
    });
  });

  describe("Harvesting", function () {
    beforeEach(async function () {
      await yieldFarm.addPool(
        await liquidityPool.getAddress(),
        100,
        0,
        false
      );
      
      const stakeAmount = ethers.parseEther("1");
      await liquidityPool.connect(user1).approve(
        await yieldFarm.getAddress(),
        stakeAmount
      );
      
      await yieldFarm.connect(user1).stake(0, stakeAmount);
    });

    it("Should harvest rewards", async function () {
      await ethers.provider.send("evm_mine");
      await ethers.provider.send("evm_mine");
      
      const initialBalance = await governanceToken.balanceOf(user1.address);
      await yieldFarm.connect(user1).harvest(0);
      const finalBalance = await governanceToken.balanceOf(user1.address);
      
      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("Withdrawal", function () {
    beforeEach(async function () {
      await yieldFarm.addPool(
        await liquidityPool.getAddress(),
        100,
        0,
        false
      );
      
      const stakeAmount = ethers.parseEther("1");
      await liquidityPool.connect(user1).approve(
        await yieldFarm.getAddress(),
        stakeAmount
      );
      
      await yieldFarm.connect(user1).stake(0, stakeAmount);
    });

    it("Should withdraw LP tokens", async function () {
      const userInfo = await yieldFarm.userInfo(0, user1.address);
      const stakeAmount = userInfo.amount;
      
      await yieldFarm.connect(user1).withdraw(0, stakeAmount);
      
      const updatedInfo = await yieldFarm.userInfo(0, user1.address);
      expect(updatedInfo.amount).to.equal(0);
    });
  });
});
