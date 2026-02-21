# BASECAMP DeFi Protocol - Deployment Guide

## Prerequisites

1. Node.js v18 or higher
2. MetaMask or compatible wallet
3. Test ETH/MATIC on target network
4. API keys for block explorers

## Network Options

### Testnets (Recommended for Development)
- Sepolia (Ethereum)
- Polygon Mumbai (Low cost)
- Arbitrum Goerli (L2, Low cost)

### Mainnets (Production)
- Polygon (Low cost, fast)
- Arbitrum (L2, Low cost)
- Ethereum (High cost)

## Step-by-Step Deployment

### 1. Environment Setup

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```
PRIVATE_KEY=your_private_key_here
POLYGON_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

### 2. Get Test Tokens

#### Polygon Mumbai
- Faucet: https://faucet.polygon.technology/
- Request: 0.5 MATIC

#### Arbitrum Goerli
- Bridge from Goerli: https://bridge.arbitrum.io/
- Faucet: https://faucet.quicknode.com/arbitrum/goerli

#### Sepolia
- Faucet: https://sepoliafaucet.com/
- Alchemy: https://www.alchemy.com/faucets/ethereum-sepolia

### 3. Compile Contracts

```bash
npm run compile
```

Expected output:
```
Compiled 5 Solidity files successfully
```

### 4. Run Tests

```bash
npm test
```

All tests should pass:
```
  GovernanceToken
    ✓ Should deploy correctly
    ✓ Should mint tokens
    ...

  LiquidityPool
    ✓ Should add liquidity
    ✓ Should swap tokens
    ...

  YieldFarm
    ✓ Should stake tokens
    ✓ Should harvest rewards
    ...

  15 passing
```

### 5. Deploy to Testnet

#### Polygon Mumbai (Recommended)
```bash
npm run deploy:mumbai
```

#### Arbitrum Goerli
```bash
npm run deploy:arbitrum-goerli
```

#### Sepolia
```bash
npm run deploy:sepolia
```

Deployment takes 2-5 minutes. Output:
```
Deploying contracts with account: 0x...
Account balance: 0.5 ETH

1. Deploying GovernanceToken...
GovernanceToken deployed to: 0x...

2. Deploying LiquidityPool...
LiquidityPool deployed to: 0x...

...

Deployment complete!
```

### 6. Verify Contracts

Wait 1-2 minutes after deployment, then:

```bash
npm run verify
```

This verifies all contracts on the block explorer.

### 7. Configure Frontend

Contract addresses are automatically saved to:
```
frontend/src/constants/contracts.ts
```

Update `frontend/src/config/wagmi.ts` with your network:

```typescript
import { polygonMumbai } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'BASECAMP DeFi Protocol',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [polygonMumbai], // Change this
  ssr: false,
})
```

Get WalletConnect Project ID: https://cloud.walletconnect.com

### 8. Test Locally

```bash
npm run frontend
```

Visit http://localhost:5173

Test all features:
1. Connect wallet
2. Swap tokens
3. Add liquidity
4. Stake LP tokens
5. Harvest rewards
6. Vote on proposals

### 9. Deploy Frontend

#### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd frontend
vercel
```

3. Follow prompts:
- Project name: basecamp-defi
- Framework: Vite
- Build command: npm run build
- Output directory: dist

#### Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

### 10. Post-Deployment Checklist

- [ ] All contracts deployed
- [ ] All contracts verified on explorer
- [ ] Frontend deployed and accessible
- [ ] Wallet connects successfully
- [ ] All features tested on testnet
- [ ] Documentation updated with addresses
- [ ] Demo video recorded

## Mainnet Deployment

### Additional Steps for Production

1. Security Audit
   - Get professional audit
   - Fix all findings
   - Implement timelock

2. Gas Optimization
   ```bash
   npm run test:gas
   ```
   Review gas costs and optimize

3. Test Coverage
   ```bash
   npm run test:coverage
   ```
   Ensure >80% coverage

4. Deploy to Mainnet
   ```bash
   npm run deploy:polygon  # or deploy:arbitrum
   ```

5. Verify Contracts
   ```bash
   npm run verify
   ```

6. Add Liquidity
   - Add initial liquidity to pool
   - Minimum: 1 ETH + 1000 DGT

7. Monitor
   - Set up monitoring
   - Watch for unusual activity
   - Have emergency pause ready

## Network-Specific Notes

### Polygon Mumbai
- Fast blocks (2 seconds)
- Low gas costs
- Good for testing
- Faucet reliable

### Arbitrum Goerli
- Very low gas costs
- L2 benefits
- Slightly slower than Mumbai
- Need to bridge from Goerli

### Sepolia
- Ethereum testnet
- Higher gas costs
- Most similar to mainnet
- Good for final testing

## Troubleshooting

### Deployment Fails

Error: Insufficient funds
```
Solution: Get more test tokens from faucet
```

Error: Nonce too high
```
Solution: Reset MetaMask account
Settings > Advanced > Reset Account
```

Error: Contract verification failed
```
Solution: Wait 2 minutes and try again
Check constructor arguments match
```

### Frontend Issues

Wallet won't connect
```
Solution: 
1. Check network in wagmi.ts matches deployment
2. Add network to MetaMask
3. Clear browser cache
```

Transactions fail
```
Solution:
1. Check contract addresses in contracts.ts
2. Verify you have test tokens
3. Check gas settings
```

## Gas Costs Estimate

### Polygon Mumbai
- Deploy all contracts: ~0.1 MATIC
- Add liquidity: ~0.01 MATIC
- Swap: ~0.005 MATIC
- Stake: ~0.005 MATIC

### Arbitrum Goerli
- Deploy all contracts: ~0.05 ETH
- Add liquidity: ~0.005 ETH
- Swap: ~0.002 ETH
- Stake: ~0.002 ETH

### Ethereum Sepolia
- Deploy all contracts: ~0.5 ETH
- Add liquidity: ~0.05 ETH
- Swap: ~0.02 ETH
- Stake: ~0.02 ETH

## Support

Issues? Check:
1. README.md - General setup
2. SETUP.md - Quick start
3. GitHub Issues - Known problems
4. Discord - Community help

## Next Steps

After successful deployment:
1. Create demo video
2. Update portfolio
3. Share on social media
4. Get feedback
5. Iterate and improve
