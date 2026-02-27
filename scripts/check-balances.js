const hre = require("hardhat");

async function main() {
  console.log("Checking token balances...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const TOKEN_ADDRESS = "0x2f5b38d5289bA211021715CAF9FA792f381379eA";
  const token = await hre.ethers.getContractAt("GovernanceToken", TOKEN_ADDRESS);

  // Check deployer balance
  const balance = await token.balanceOf(deployer.address);
  console.log("Your DGT balance:", hre.ethers.formatEther(balance));

  // Check ETH balance
  const ethBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Your ETH balance:", hre.ethers.formatEther(ethBalance));

  console.log("\n📋 To add DGT to MetaMask:");
  console.log("1. Open MetaMask");
  console.log("2. Click 'Import tokens'");
  console.log("3. Token Address:", TOKEN_ADDRESS);
  console.log("4. Symbol: DGT");
  console.log("5. Decimals: 18");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
