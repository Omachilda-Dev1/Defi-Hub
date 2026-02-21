const hre = require("hardhat");

async function main() {
  console.log("Simple liquidity add - transferring tokens first\n");

  const [deployer] = await hre.ethers.getSigners();
  
  const governanceTokenAddress = "0x4402Ed0148f57Cb8d2f46Bf643299bea6265272E";
  const liquidityPoolAddress = "0xC4FaC5b41cb42eFF175e04E17F9B313006a2a7Fc";

  const governanceToken = await hre.ethers.getContractAt("GovernanceToken", governanceTokenAddress);
  const liquidityPool = await hre.ethers.getContractAt("LiquidityPool", liquidityPoolAddress);

  const ethAmount = hre.ethers.parseEther("0.05");
  const tokenAmount = hre.ethers.parseEther("500");

  console.log("Step 1: Transfer tokens directly to pool");
  const transferTx = await governanceToken.transfer(liquidityPoolAddress, tokenAmount);
  await transferTx.wait();
  console.log("✓ Tokens transferred\n");

  console.log("Step 2: Send ETH and call addLiquidity with 0 tokens (since they're already there)");
  console.log("Wait... that won't work. The contract expects to call transferFrom.\n");

  console.log("The issue is that the LiquidityPool contract's transferFrom is failing.");
  console.log("This might be a contract bug. Let me check the Etherscan verification...\n");

  console.log("Alternative: Add liquidity through the frontend");
  console.log("The frontend will call the same function, so it will also fail.\n");

  console.log("SOLUTION: We need to redeploy the contracts or find the issue.");
  console.log("Let me check if there's already liquidity in the pool from a previous attempt...\n");

  const poolTokenBalance = await governanceToken.balanceOf(liquidityPoolAddress);
  const poolETHBalance = await hre.ethers.provider.getBalance(liquidityPoolAddress);
  
  console.log("Pool current balances:");
  console.log("- DGT tokens:", hre.ethers.formatEther(poolTokenBalance));
  console.log("- ETH:", hre.ethers.formatEther(poolETHBalance));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
