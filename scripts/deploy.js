const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

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
  const SEPOLIA_ETH_USD_FEED = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
  
  const PriceOracle = await hre.ethers.getContractFactory("PriceOracle");
  const priceOracle = await PriceOracle.deploy(SEPOLIA_ETH_USD_FEED);
  await priceOracle.waitForDeployment();
  const priceOracleAddress = await priceOracle.getAddress();
  console.log("PriceOracle deployed to:", priceOracleAddress);

  // Setup: Add YieldFarm as minter
  console.log("\n6. Setting up permissions...");
  await governanceToken.addMinter(yieldFarmAddress);
  console.log("YieldFarm added as minter");

  // Setup: Transfer tokens to YieldFarm for rewards
  const rewardAmount = hre.ethers.parseEther("100000");
  await governanceToken.transfer(yieldFarmAddress, rewardAmount);
  console.log("Transferred reward tokens to YieldFarm");

  // Setup: Add LP pool to YieldFarm
  await yieldFarm.addPool(liquidityPoolAddress, 100, 0, false);
  console.log("Added LP pool to YieldFarm");

  // Save deployment addresses
  const addresses = {
    GovernanceToken: governanceTokenAddress,
    LiquidityPool: liquidityPoolAddress,
    SwapRouter: swapRouterAddress,
    YieldFarm: yieldFarmAddress,
    PriceOracle: priceOracleAddress,
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  const contractsDir = path.join(__dirname, "..", "frontend", "src", "constants");
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "contracts.ts"),
    `export const contracts = ${JSON.stringify(addresses, null, 2)} as const;\n`
  );

  console.log("\n✅ Deployment complete!");
  console.log("\nContract addresses saved to frontend/src/constants/contracts.ts");
  console.log("\nDeployed contracts:");
  console.log(JSON.stringify(addresses, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
