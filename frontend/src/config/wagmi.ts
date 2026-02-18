import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'BASECAMP DeFi Protocol',
  projectId: 'YOUR_PROJECT_ID',
  chains: [sepolia],
  ssr: false,
})
