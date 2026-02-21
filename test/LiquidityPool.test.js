const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LiquidityPool", function () {
  let governanceToken, liquidityPool;
  let owner, user1, user2;
  const INITIAL_ETH = ethers.parseEther("10");
  const INITIAL_TOKENS = ethers.parseEther("10000");

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
    governanceToken = await GovernanceToken.deploy();
    
    const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
    liquidityPool = await LiquidityPool.deploy(await governanceToken.getAddress());
    
    await governanceToken.transfer(user1.address, ethers.parseEther("50000"));
    await governanceToken.transfer(user2.address, ethers.parseEther("50000"));
  });

  describe("Add Liquidity", function () {
    it("Should add initial liquidity", async function () {
      await governanceToken.connect(user1).approve(
        await liquidityPool.getAddress(),
        INITIAL_TOKENS
      );
      
      await liquidityPool.connect(user1).addLiquidity(INITIAL_TOKENS, {
        value: INITIAL_ETH
      });
      
      expect(await liquidityPool.reserveETH()).to.equal(INITIAL_ETH);
      expect(await liquidityPool.reserveToken()).to.equal(INITIAL_TOKENS);
      expect(await liquidityPool.balanceOf(user1.address)).to.be.gt(0);
    });

    it("Should add subsequent liquidity maintaining ratio", async function () {
      await governanceToken.connect(user1).approve(
        await liquidityPool.getAddress(),
        INITIAL_TOKENS
      );
      
      await liquidityPool.connect(user1).addLiquidity(INITIAL_TOKENS, {
        value: INITIAL_ETH
      });
      
      const addETH = ethers.parseEther("5");
      const addTokens = ethers.parseEther("5000");
      
      await governanceToken.connect(user2).approve(
        await liquidityPool.getAddress(),
        addTokens
      );
      
      await liquidityPool.connect(user2).addLiquidity(addTokens, {
        value: addETH
      });
      
      expect(await liquidityPool.balanceOf(user2.address)).to.be.gt(0);
    });
  });

  describe("Remove Liquidity", function () {
    beforeEach(async function () {
      await governanceToken.connect(user1).approve(
        await liquidityPool.getAddress(),
        INITIAL_TOKENS
      );
      
      await liquidityPool.connect(user1).addLiquidity(INITIAL_TOKENS, {
        value: INITIAL_ETH
      });
    });

    it("Should remove liquidity", async function () {
      const lpBalance = await liquidityPool.balanceOf(user1.address);
      const initialETHBalance = await ethers.provider.getBalance(user1.address);
      
      await liquidityPool.connect(user1).removeLiquidity(lpBalance);
      
      expect(await liquidityPool.balanceOf(user1.address)).to.equal(0);
      expect(await ethers.provider.getBalance(user1.address)).to.be.gt(initialETHBalance);
    });
  });

  describe("Swaps", function () {
    beforeEach(async function () {
      await governanceToken.connect(user1).approve(
        await liquidityPool.getAddress(),
        INITIAL_TOKENS
      );
      
      await liquidityPool.connect(user1).addLiquidity(INITIAL_TOKENS, {
        value: INITIAL_ETH
      });
    });

    it("Should swap ETH for tokens", async function () {
      const swapAmount = ethers.parseEther("1");
      const expectedOut = await liquidityPool.getAmountOut(
        swapAmount,
        await liquidityPool.reserveETH(),
        await liquidityPool.reserveToken()
      );
      
      await liquidityPool.connect(user2).swapETHForToken(expectedOut, {
        value: swapAmount
      });
      
      expect(await governanceToken.balanceOf(user2.address)).to.be.gte(expectedOut);
    });

    it("Should swap tokens for ETH", async function () {
      const swapAmount = ethers.parseEther("1000");
      const expectedOut = await liquidityPool.getAmountOut(
        swapAmount,
        await liquidityPool.reserveToken(),
        await liquidityPool.reserveETH()
      );
      
      await governanceToken.connect(user2).approve(
        await liquidityPool.getAddress(),
        swapAmount
      );
      
      const initialBalance = await ethers.provider.getBalance(user2.address);
      
      await liquidityPool.connect(user2).swapTokenForETH(swapAmount, expectedOut);
      
      expect(await ethers.provider.getBalance(user2.address)).to.be.gt(initialBalance);
    });

    it("Should respect slippage protection", async function () {
      const swapAmount = ethers.parseEther("1");
      const tooHighMin = ethers.parseEther("10000");
      
      await expect(
        liquidityPool.connect(user2).swapETHForToken(tooHighMin, {
          value: swapAmount
        })
      ).to.be.revertedWith("Insufficient output amount");
    });
  });
});
