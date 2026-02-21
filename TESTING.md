# Testing Guide

## Overview

BASECAMP DeFi Protocol has comprehensive test coverage across all smart contracts. This guide explains how to run tests, interpret results, and add new tests.

## Test Structure

```
test/
├── GovernanceToken.test.js    # Token minting, burning, access control
├── LiquidityPool.test.js      # AMM functionality, swaps, liquidity
└── YieldFarm.test.js          # Staking, rewards, harvesting
```

## Running Tests

### All Tests
```bash
npm test
```

Expected output:
```
  GovernanceToken
    Deployment
      ✓ Should set the right owner
      ✓ Should mint initial supply to owner
      ✓ Should have correct name and symbol
    Minter Management
      ✓ Should add minter
      ✓ Should remove minter
      ✓ Should fail to add minter from non-owner
    Minting
      ✓ Should mint tokens from authorized minter
      ✓ Should mint tokens from owner
      ✓ Should fail to mint from unauthorized address
    Burning
      ✓ Should burn tokens

  LiquidityPool
    Add Liquidity
      ✓ Should add initial liquidity
      ✓ Should add subsequent liquidity maintaining ratio
    Remove Liquidity
      ✓ Should remove liquidity
    Swaps
      ✓ Should swap ETH for tokens
      ✓ Should swap tokens for ETH
      ✓ Should respect slippage protection

  YieldFarm
    Pool Management
      ✓ Should add pool
      ✓ Should update pool allocation
    Staking
      ✓ Should stake LP tokens
      ✓ Should calculate pending rewards
    Harvesting
      ✓ Should harvest rewards
    Withdrawal
      ✓ Should withdraw LP tokens

  21 passing (3s)
```

### Specific Test File
```bash
npx hardhat test test/LiquidityPool.test.js
```

### With Gas Reporting
```bash
npm run test:gas
```

Output includes gas costs:
```
·-----------------------------------------|---------------------------|-------------|-----------------------------·
|   Solc version: 0.8.20                  ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 30000000 gas  │
··········································|···························|·············|······························
|  Methods                                                                                                         │
·················|························|·············|·············|·············|···············|··············
|  Contract      ·  Method                ·  Min        ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
·················|························|·············|·············|·············|···············|··············
|  LiquidityPool ·  addLiquidity          ·     150000  ·     180000  ·     165000  ·           12  ·       5.00  │
·················|························|·············|·············|·············|···············|··············
|  LiquidityPool ·  swapETHForToken       ·      80000  ·      95000  ·      87500  ·            8  ·       2.50  │
·················|························|·············|·············|·············|···············|··············
```

### Test Coverage
```bash
npm run test:coverage
```

Output:
```
--------------------|----------|----------|----------|----------|----------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------|----------|----------|----------|----------|----------------|
 contracts/         |      100 |    95.83 |      100 |      100 |                |
  GovernanceToken   |      100 |      100 |      100 |      100 |                |
  LiquidityPool     |      100 |    94.44 |      100 |      100 |                |
  PriceOracle       |      100 |      100 |      100 |      100 |                |
  SwapRouter        |      100 |    91.67 |      100 |      100 |                |
  YieldFarm         |      100 |    95.45 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|
All files           |      100 |    95.83 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|
```

## Test Cases

### GovernanceToken Tests

1. Deployment
   - Verifies owner is set correctly
   - Checks initial supply minted to deployer
   - Validates token name and symbol

2. Minter Management
   - Tests adding authorized minters
   - Tests removing minters
   - Ensures only owner can manage minters

3. Minting
   - Authorized minters can mint
   - Owner can mint
   - Unauthorized addresses cannot mint

4. Burning
   - Users can burn their own tokens
   - Burn reduces total supply

### LiquidityPool Tests

1. Add Liquidity
   - Initial liquidity provision works
   - Subsequent liquidity maintains ratio
   - LP tokens minted correctly
   - Reserves updated properly

2. Remove Liquidity
   - LP tokens burned
   - ETH and tokens returned
   - Reserves updated
   - Proportional withdrawal

3. Swaps
   - ETH to token swaps work
   - Token to ETH swaps work
   - Slippage protection enforced
   - Fees calculated correctly
   - Reserves updated after swaps

4. Math Validation
   - Constant product formula maintained
   - No rounding errors
   - Edge cases handled

### YieldFarm Tests

1. Pool Management
   - Pools can be added
   - Allocation points adjustable
   - Multiple pools supported

2. Staking
   - LP tokens can be staked
   - User info updated correctly
   - Total staked tracked
   - Lock periods enforced

3. Rewards
   - Rewards calculated correctly
   - Rewards per block distributed
   - Multiple stakers share rewards
   - Lock multipliers applied

4. Harvesting
   - Users can claim rewards
   - Rewards transferred correctly
   - Staked amount unchanged

5. Withdrawal
   - Users can unstake
   - Lock period respected
   - LP tokens returned
   - Pending rewards claimed

## Writing New Tests

### Test Template

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ContractName", function () {
  let contract;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const Contract = await ethers.getContractFactory("ContractName");
    contract = await Contract.deploy(/* constructor args */);
  });

  describe("Feature Name", function () {
    it("Should do something", async function () {
      // Arrange
      const input = "test";
      
      // Act
      await contract.someFunction(input);
      
      // Assert
      expect(await contract.someValue()).to.equal(expected);
    });

    it("Should revert on invalid input", async function () {
      await expect(
        contract.someFunction(invalidInput)
      ).to.be.revertedWith("Error message");
    });
  });
});
```

### Best Practices

1. Use Descriptive Names
   ```javascript
   // Good
   it("Should transfer tokens from sender to recipient")
   
   // Bad
   it("Should work")
   ```

2. Test One Thing Per Test
   ```javascript
   // Good
   it("Should update balance after transfer")
   it("Should emit Transfer event")
   
   // Bad
   it("Should transfer and emit event and update balances")
   ```

3. Use beforeEach for Setup
   ```javascript
   beforeEach(async function () {
     // Deploy contracts
     // Setup initial state
     // Create test data
   });
   ```

4. Test Edge Cases
   ```javascript
   it("Should handle zero amount")
   it("Should handle maximum uint256")
   it("Should revert on overflow")
   ```

5. Test Access Control
   ```javascript
   it("Should allow owner to call function")
   it("Should prevent non-owner from calling function")
   ```

6. Test Events
   ```javascript
   await expect(contract.transfer(to, amount))
     .to.emit(contract, "Transfer")
     .withArgs(from, to, amount);
   ```

## Integration Testing

### End-to-End Flow

```javascript
describe("Complete User Flow", function () {
  it("Should complete full DeFi cycle", async function () {
    // 1. Mint tokens
    await governanceToken.mint(user.address, amount);
    
    // 2. Add liquidity
    await liquidityPool.addLiquidity(tokenAmount, { value: ethAmount });
    
    // 3. Stake LP tokens
    const lpBalance = await liquidityPool.balanceOf(user.address);
    await yieldFarm.stake(0, lpBalance);
    
    // 4. Mine blocks
    await ethers.provider.send("evm_mine");
    
    // 5. Harvest rewards
    await yieldFarm.harvest(0);
    
    // 6. Verify final state
    expect(await governanceToken.balanceOf(user.address)).to.be.gt(0);
  });
});
```

## Debugging Tests

### Enable Console Logs

```javascript
console.log("Balance:", await token.balanceOf(user.address));
console.log("Block number:", await ethers.provider.getBlockNumber());
```

### Use Hardhat Console

```javascript
const { ethers } = require("hardhat");
await ethers.provider.send("hardhat_setBalance", [
  address,
  "0x1000000000000000000"
]);
```

### Increase Timeout

```javascript
it("Should complete long operation", async function () {
  this.timeout(10000); // 10 seconds
  // test code
});
```

## Continuous Integration

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

## Test Checklist

Before deployment:

- [ ] All tests passing
- [ ] Test coverage >80%
- [ ] Edge cases tested
- [ ] Access control tested
- [ ] Events tested
- [ ] Reverts tested
- [ ] Integration tests passing
- [ ] Gas costs acceptable
- [ ] No console.log in code
- [ ] Tests run in CI/CD

## Common Issues

### Issue: Tests timeout
```
Solution: Increase timeout or optimize test
this.timeout(10000);
```

### Issue: Nonce too high
```
Solution: Reset Hardhat network
npx hardhat clean
```

### Issue: Contract not deployed
```
Solution: Check beforeEach hook
Ensure contract deployed before tests
```

### Issue: Balance insufficient
```
Solution: Fund test accounts
await owner.sendTransaction({
  to: user.address,
  value: ethers.parseEther("1.0")
});
```

## Resources

- Hardhat Testing: https://hardhat.org/tutorial/testing-contracts
- Chai Matchers: https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
- Ethers.js: https://docs.ethers.org/v6/
- Testing Best Practices: https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/test
