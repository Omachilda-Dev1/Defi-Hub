const hre = require("hardhat");

async function main() {
  const network = hre.network.name;
  console.log(`Adding initial liquidity on ${network}...\n`);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Contract addresses (update these with your deployed addresses)
  const governanceTokenAddress = "0x4402Ed0148f57Cb8d2f46Bf643299bea6265272E";
  const liquidityPoolAddress = "0xC4FaC5b41cb42eFF175e04E17F9B313006a2a7Fc";

  // Get contract instances
  const governanceToken = await hre.ethers.getContractAt("GovernanceToken", governanceTokenAddress);
  const liquidityPool = await hre.ethers.getContractAt("LiquidityPool", liquidityPoolAddress);

  // Check token balance
  const tokenBalance = await governanceToken.balanceOf(deployer.address);
  console.log("Your DGT balance:", hre.ethers.formatEther(tokenBalance), "DGT\n");

  if (tokenBalance === 0n) {
    console.log("❌ Error: You don't have any DGT tokens!");
    console.log("\nYou need to mint tokens first. The deployer has minting rights.");
    console.log("Run this command to mint tokens to yourself:");
    console.log(`npx hardhat console --network ${network}`);
    console.log("Then run:");
    console.log(`const token = await ethers.getContractAt("GovernanceToken", "${governanceTokenAddress}")`);
    console.log(`await token.mint("${deployer.address}", ethers.parseEther("1000000"))`);
    process.exit(1);
  }

  // Amount to add (0.02 ETH and 200 DGT tokens for sufficient liquidity)
  const ethAmount = hre.ethers.parseEther("0.02");
  const tokenAmount = hre.ethers.parseEther("200");

  if (tokenBalance < tokenAmount) {
    console.log(`❌ Error: Insufficient DGT tokens!`);
    console.log(`You have: ${hre.ethers.formatEther(tokenBalance)} DGT`);
    console.log(`You need: ${hre.ethers.formatEther(tokenAmount)} DGT`);
    console.log("\nMint more tokens first.");
    process.exit(1);
  }

  console.log("Adding liquidity:");
  console.log("- ETH:", hre.ethers.formatEther(ethAmount));
  console.log("- DGT:", hre.ethers.formatEther(tokenAmount));
  console.log("- Ratio: 1 ETH = 10,000 DGT");
  
  // Calculate expected liquidity: sqrt(ethAmount * tokenAmount)
  // sqrt(0.02 * 200) = sqrt(4) = 2 ETH worth
  console.log("- Expected liquidity: ~2 LP tokens\n");

  // Step 1: Approve tokens
  console.log("1. Approving DGT tokens...");
  const approveTx = await governanceToken.approve(liquidityPoolAddress, tokenAmount);
  await approveTx.wait();
  console.log("✓ Tokens approved\n");

  // Step 2: Add liquidity
  console.log("2. Adding liquidity to pool...");
  try {
    const addLiquidityTx = await liquidityPool.addLiquidity(tokenAmount, { 
      value: ethAmount,
      gasLimit: 500000 // Set explicit gas limit
    });
    const receipt = await addLiquidityTx.wait();
    console.log("✓ Liquidity added successfully!\n");
  } catch (error) {
    console.error("\n❌ Transaction failed!");
    
    // Try to get the revert reason
    if (error.message) {
      console.error("Error message:", error.message);
    }
    
    // Try calling the function statically to get the revert reason
    try {
      await liquidityPool.addLiquidity.staticCall(tokenAmount, { value: ethAmount });
    } catch (staticError) {
      console.error("Revert reason:", staticError.message);
    }
    
    throw error;
  }

  // Check pool reserves
  const reserveETH = await liquidityPool.reserveETH();
  const reserveToken = await liquidityPool.reserveToken();
  const lpBalance = await liquidityPool.balanceOf(deployer.address);

  console.log("Pool Status:");
  console.log("- ETH Reserve:", hre.ethers.formatEther(reserveETH));
  console.log("- DGT Reserve:", hre.ethers.formatEther(reserveToken));
  console.log("- Your LP Tokens:", hre.ethers.formatEther(lpBalance));
  console.log("\n✓ Pool is now ready for swapping!");
  
  console.log("\nYou can now:");
  console.log("1. Swap ETH for DGT tokens");
  console.log("2. Swap DGT tokens for ETH");
  console.log("3. Add more liquidity");
  console.log("4. Stake LP tokens in the farm");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
