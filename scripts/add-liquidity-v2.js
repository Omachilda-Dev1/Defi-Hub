const hre = require("hardhat");

async function main() {
  console.log("Adding liquidity - Version 2\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Account:", deployer.address);

  const governanceTokenAddress = "0x2f5b38d5289bA211021715CAF9FA792f381379eA";
  const liquidityPoolAddress = "0xcB85c9B67fB9EBd87191c83D1F321B096558C88F";

  const governanceToken = await hre.ethers.getContractAt("GovernanceToken", governanceTokenAddress);
  const liquidityPool = await hre.ethers.getContractAt("LiquidityPool", liquidityPoolAddress);

  const ethAmount = hre.ethers.parseEther("0.05");
  const tokenAmount = hre.ethers.parseEther("500");

  console.log("Amounts:");
  console.log("- ETH:", hre.ethers.formatEther(ethAmount));
  console.log("- DGT:", hre.ethers.formatEther(tokenAmount));
  console.log();

  // Approve with a very large amount
  console.log("1. Approving tokens with max amount...");
  const maxApproval = hre.ethers.MaxUint256;
  const approveTx = await governanceToken.approve(liquidityPoolAddress, maxApproval);
  await approveTx.wait();
  console.log("✓ Approved\n");

  // Check allowance
  const allowance = await governanceToken.allowance(deployer.address, liquidityPoolAddress);
  console.log("Allowance:", hre.ethers.formatEther(allowance), "(should be huge)\n");

  // Try adding liquidity
  console.log("2. Adding liquidity...");
  const tx = await liquidityPool.addLiquidity(tokenAmount, { 
    value: ethAmount
  });
  
  console.log("Transaction sent:", tx.hash);
  console.log("Waiting for confirmation...");
  
  const receipt = await tx.wait();
  console.log("✓ Success! Block:", receipt.blockNumber);
  
  // Check results
  const reserveETH = await liquidityPool.reserveETH();
  const reserveToken = await liquidityPool.reserveToken();
  const lpBalance = await liquidityPool.balanceOf(deployer.address);

  console.log("\nPool Status:");
  console.log("- ETH Reserve:", hre.ethers.formatEther(reserveETH));
  console.log("- DGT Reserve:", hre.ethers.formatEther(reserveToken));
  console.log("- Your LP Tokens:", hre.ethers.formatEther(lpBalance));
  console.log("\n✓ Pool ready for swapping!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Failed:", error.message);
    process.exit(1);
  });
