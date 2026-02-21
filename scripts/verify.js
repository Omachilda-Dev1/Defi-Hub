const hre = require("hardhat");

async function main() {
  const network = hre.network.name;
  console.log(`Verifying contracts on ${network}...`);

  // Load deployed addresses
  const { contracts } = require("../frontend/src/constants/contracts.ts");

  try {
    // Verify GovernanceToken
    console.log("\nVerifying GovernanceToken...");
    await hre.run("verify:verify", {
      address: contracts.GovernanceToken,
      constructorArguments: []
    });

    // Verify LiquidityPool
    console.log("\nVerifying LiquidityPool...");
    await hre.run("verify:verify", {
      address: contracts.LiquidityPool,
      constructorArguments: [contracts.GovernanceToken]
    });

    // Verify SwapRouter
    console.log("\nVerifying SwapRouter...");
    await hre.run("verify:verify", {
      address: contracts.SwapRouter,
      constructorArguments: [contracts.LiquidityPool]
    });

    // Verify YieldFarm
    console.log("\nVerifying YieldFarm...");
    const rewardPerBlock = hre.ethers.parseEther("10");
    await hre.run("verify:verify", {
      address: contracts.YieldFarm,
      constructorArguments: [
        contracts.GovernanceToken,
        rewardPerBlock,
        0
      ]
    });

    // Verify PriceOracle
    console.log("\nVerifying PriceOracle...");
    const priceFeedAddress = getPriceFeedAddress(network);
    await hre.run("verify:verify", {
      address: contracts.PriceOracle,
      constructorArguments: [priceFeedAddress]
    });

    console.log("\nAll contracts verified successfully!");
  } catch (error) {
    console.error("Verification error:", error);
  }
}

function getPriceFeedAddress(network) {
  const feeds = {
    sepolia: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    polygonMumbai: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
    arbitrumGoerli: "0x62CAe0FA2da220f43a51F86Db2EDb36DcA9A5A08",
    polygon: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
    arbitrum: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612"
  };
  return feeds[network] || feeds.sepolia;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
