const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = hre.network.name;
  console.log(`Starting deployment to ${network}...\n`);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Get Chainlink price feed address for network
  const priceFeedAddress = getPriceFeedAddress(network);
  console.log("Using Chainlink price feed:", priceFeedAddress);

  // 1. Deploy GovernanceToken
  console.log("\n1. Deploying GovernanceToken...");
  const GovernanceToken = await hre.ethers.getContractFactory("GovernanceToken");
  const governanceToken = await GovernanceToken.deploy();
  await governanceToken.waitForDeployment();
  const governanceTokenAddress = await governanceToken.getAddress();
  console.log("GovernanceToken deployed to:", governanceTokenAddress);

  // 2. Deploy LiquidityPool
  console.log("\n2. Deploying LiquidityPool...");
  const LiquidityPool = await hre.ethers.getContractFactory("LiquidityPool");
  const liquidityPool = await LiquidityPool.deploy(governanceTokenAddress);
  await liquidityPool.waitForDeployment();
  const liquidityPoolAddress = await liquidityPool.getAddress();
  console.log("LiquidityPool deployed to:", liquidityPoolAddress);

  // 3. Deploy SwapRouter
  console.log("\n3. Deploying SwapRouter...");
  const SwapRouter = await hre.ethers.getContractFactory("SwapRouter");
  const swapRouter = await SwapRouter.deploy(liquidityPoolAddress);
  await swapRouter.waitForDeployment();
  const swapRouterAddress = await swapRouter.getAddress();
  console.log("SwapRouter deployed to:", swapRouterAddress);

  // 4. Deploy YieldFarm
  console.log("\n4. Deploying YieldFarm...");
  const rewardPerBlock = hre.ethers.parseEther("10");
  const currentBlock = await hre.ethers.provider.getBlockNumber();
  
  const YieldFarm = await hre.ethers.getContractFactory("YieldFarm");
  const yieldFarm = await YieldFarm.deploy(
    governanceTokenAddress,
    rewardPerBlock,
    currentBlock
  );
  await yieldFarm.waitForDeployment();
  const yieldFarmAddress = await yieldFarm.getAddress();
  console.log("YieldFarm deployed to:", yieldFarmAddress);

  // 5. Deploy PriceOracle
  console.log("\n5. Deploying PriceOracle...");
  const PriceOracle = await hre.ethers.getContractFactory("PriceOracle");
  const priceOracle = await PriceOracle.deploy(priceFeedAddress);
  await priceOracle.waitForDeployment();
  const priceOracleAddress = await priceOracle.getAddress();
  console.log("PriceOracle deployed to:", priceOracleAddress);

  // Setup: Add YieldFarm as minter
  console.log("\n6. Setting up permissions...");
  const tx1 = await governanceToken.addMinter(yieldFarmAddress);
  await tx1.wait();
  console.log("YieldFarm added as minter");

  // Setup: Transfer tokens to YieldFarm for rewards
  const rewardAmount = hre.ethers.parseEther("100000");
  const tx2 = await governanceToken.transfer(yieldFarmAddress, rewardAmount);
  await tx2.wait();
  console.log("Transferred reward tokens to YieldFarm");

  // Setup: Add LP pool to YieldFarm
  const tx3 = await yieldFarm.addPool(liquidityPoolAddress, 100, 0, false);
  await tx3.wait();
  console.log("Added LP pool to YieldFarm");

  // Save deployment addresses
  const addresses = {
    GovernanceToken: governanceTokenAddress,
    LiquidityPool: liquidityPoolAddress,
    SwapRouter: swapRouterAddress,
    YieldFarm: yieldFarmAddress,
    PriceOracle: priceOracleAddress,
    network: network,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: currentBlock
  };

  // Save to frontend
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "constants");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "contracts.ts"),
    `export const contracts = ${JSON.stringify(addresses, null, 2)} as const;\n`
  );

  // Save deployment info
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, `${network}-${Date.now()}.json`),
    JSON.stringify(addresses, null, 2)
  );

  console.log("\nDeployment complete!");
  console.log("\nContract addresses saved to:");
  console.log("- frontend/src/constants/contracts.ts");
  console.log("- deployments/");
  
  console.log("\nNext steps:");
  console.log("1. Verify contracts: npm run verify");
  console.log("2. Add liquidity to the pool");
  console.log("3. Test all functionality");
  
  console.log("\nDeployed contracts:");
  console.log(JSON.stringify(addresses, null, 2));

  // Display block explorer links
  const explorerUrl = getExplorerUrl(network);
  if (explorerUrl) {
    console.log("\nView on block explorer:");
    console.log(`GovernanceToken: ${explorerUrl}/address/${governanceTokenAddress}`);
    console.log(`LiquidityPool: ${explorerUrl}/address/${liquidityPoolAddress}`);
    console.log(`SwapRouter: ${explorerUrl}/address/${swapRouterAddress}`);
    console.log(`YieldFarm: ${explorerUrl}/address/${yieldFarmAddress}`);
    console.log(`PriceOracle: ${explorerUrl}/address/${priceOracleAddress}`);
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

function getExplorerUrl(network) {
  const explorers = {
    sepolia: "https://sepolia.etherscan.io",
    polygonMumbai: "https://mumbai.polygonscan.com",
    arbitrumGoerli: "https://goerli.arbiscan.io",
    polygon: "https://polygonscan.com",
    arbitrum: "https://arbiscan.io"
  };
  return explorers[network];
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
