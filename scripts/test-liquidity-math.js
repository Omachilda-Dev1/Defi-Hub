const hre = require("hardhat");

async function main() {
  console.log("Testing liquidity math\n");

  const ethAmount = hre.ethers.parseEther("0.05");
  const tokenAmount = hre.ethers.parseEther("500");

  console.log("Input amounts:");
  console.log("- ETH:", ethAmount.toString(), "wei");
  console.log("- Token:", tokenAmount.toString(), "wei");
  
  // Calculate sqrt manually
  const product = ethAmount * tokenAmount;
  console.log("\nProduct (eth * token):", product.toString());
  
  // JavaScript sqrt (approximate)
  const ethFloat = 0.05;
  const tokenFloat = 500;
  const liquidityFloat = Math.sqrt(ethFloat * tokenFloat);
  console.log("Expected liquidity (float):", liquidityFloat, "ETH worth");
  console.log("Expected liquidity (wei):", hre.ethers.parseEther(liquidityFloat.toString()).toString());
  
  const MINIMUM_LIQUIDITY = 1000n;
  console.log("\nMinimum liquidity required:", MINIMUM_LIQUIDITY.toString(), "wei");
  console.log("Expected liquidity:", hre.ethers.parseEther(liquidityFloat.toString()).toString(), "wei");
  console.log("Will pass minimum check:", hre.ethers.parseEther(liquidityFloat.toString()) > MINIMUM_LIQUIDITY ? "YES ✓" : "NO ✗");
  
  // Try with smaller amounts
  console.log("\n--- Testing with smaller amounts ---");
  const smallEth = hre.ethers.parseEther("0.001");
  const smallToken = hre.ethers.parseEther("10");
  const smallLiquidity = Math.sqrt(0.001 * 10);
  console.log("Small amounts: 0.001 ETH + 10 DGT");
  console.log("Expected liquidity:", smallLiquidity, "ETH worth");
  console.log("In wei:", hre.ethers.parseEther(smallLiquidity.toString()).toString());
  console.log("Will pass:", hre.ethers.parseEther(smallLiquidity.toString()) > MINIMUM_LIQUIDITY ? "YES ✓" : "NO ✗");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
