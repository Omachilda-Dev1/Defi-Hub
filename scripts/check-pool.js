const hre = require("hardhat");

async function main() {
  const network = hre.network.name;
  console.log(`Checking pool status on ${network}...\n`);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Account:", deployer.address);

  // Contract addresses
  const governanceTokenAddress = "0x2f5b38d5289bA211021715CAF9FA792f381379eA";
  const liquidityPoolAddress = "0xcB85c9B67fB9EBd87191c83D1F321B096558C88F";

  // Get contract instances
  const governanceToken = await hre.ethers.getContractAt("GovernanceToken", governanceTokenAddress);
  const liquidityPool = await hre.ethers.getContractAt("LiquidityPool", liquidityPoolAddress);

  // Check balances
  const ethBalance = await hre.ethers.provider.getBalance(deployer.address);
  const tokenBalance = await governanceToken.balanceOf(deployer.address);
  const allowance = await governanceToken.allowance(deployer.address, liquidityPoolAddress);
  
  console.log("\nYour Balances:");
  console.log("- ETH:", hre.ethers.formatEther(ethBalance));
  console.log("- DGT:", hre.ethers.formatEther(tokenBalance));
  console.log("- Allowance to Pool:", hre.ethers.formatEther(allowance));

  // Check pool state
  const reserveETH = await liquidityPool.reserveETH();
  const reserveToken = await liquidityPool.reserveToken();
  const totalSupply = await liquidityPool.totalSupply();
  const lpBalance = await liquidityPool.balanceOf(deployer.address);

  console.log("\nPool Status:");
  console.log("- ETH Reserve:", hre.ethers.formatEther(reserveETH));
  console.log("- DGT Reserve:", hre.ethers.formatEther(reserveToken));
  console.log("- Total LP Supply:", hre.ethers.formatEther(totalSupply));
  console.log("- Your LP Balance:", hre.ethers.formatEther(lpBalance));

  // Check token address in pool
  const poolTokenAddress = await liquidityPool.token();
  console.log("\nContract Configuration:");
  console.log("- Token in Pool:", poolTokenAddress);
  console.log("- Expected Token:", governanceTokenAddress);
  console.log("- Match:", poolTokenAddress.toLowerCase() === governanceTokenAddress.toLowerCase() ? "✓" : "✗");

  // Try to simulate adding liquidity
  console.log("\nTesting addLiquidity call...");
  const testEth = hre.ethers.parseEther("0.02");
  const testToken = hre.ethers.parseEther("200");
  
  // Check if allowance is sufficient
  if (allowance < testToken) {
    console.log("- Allowance insufficient! Need to approve more tokens.");
    console.log(`  Current: ${hre.ethers.formatEther(allowance)}, Need: ${hre.ethers.formatEther(testToken)}`);
  } else {
    console.log("- Allowance sufficient: ✓");
  }
  
  try {
    // Test direct transfer (not transferFrom)
    const testAmount = hre.ethers.parseEther("1");
    await governanceToken.transfer.staticCall(liquidityPoolAddress, testAmount);
    console.log("- Can transfer tokens directly: ✓");
  } catch (error) {
    console.log("- Can transfer tokens directly: ✗");
    console.log("  Error:", error.message.split('\n')[0]);
  }

  try {
    // Simulate the pool calling transferFrom
    await governanceToken.transferFrom.staticCall(
      deployer.address,
      liquidityPoolAddress,
      testToken
    );
    console.log("- Can transferFrom (as deployer): ✓");
  } catch (error) {
    console.log("- Can transferFrom (as deployer): ✗");
    console.log("  Error:", error.message.split('\n')[0]);
    console.log("\n  This is the issue! The pool needs to call transferFrom, but it's failing.");
    console.log("  The pool contract should be calling it, not you directly.");
  }

  try {
    await liquidityPool.addLiquidity.staticCall(testToken, { value: testEth });
    console.log("- addLiquidity simulation: ✓ Should work!");
  } catch (error) {
    console.log("- addLiquidity simulation: ✗ Will fail");
    const errorMsg = error.message;
    if (errorMsg.includes("ERC20InsufficientAllowance")) {
      console.log("  Reason: Insufficient allowance");
    } else if (errorMsg.includes("Insufficient initial liquidity")) {
      console.log("  Reason: Liquidity amount too small");
    } else {
      console.log("  Error:", errorMsg.split('\n')[0]);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
