import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'BASECAMP DeFi Protocol',
  projectId: '3908efdec2ac65bd3c0fcafe2b637755',
  chains: [sepolia],
  ssr: false,
})
