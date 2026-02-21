import { useState, useEffect } from 'react'
import { useReadContract, useAccount, useBalance } from 'wagmi'
import { formatEther } from 'viem'
import { CONTRACT_ADDRESSES, GovernanceTokenABI, LiquidityPoolABI, YieldFarmABI } from '../constants/abis'

export function usePortfolio() {
  const [loading, setLoading] = useState(true)
  const { address } = useAccount()
  
  // Read DGT balance
  const { data: dgtBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.GovernanceToken,
    abi: GovernanceTokenABI,
    functionName: 'balanceOf',
    args: [address || '0x0000000000000000000000000000000000000000'],
  })

  // Read LP balance
  const { data: lpBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.LiquidityPool,
    abi: LiquidityPoolABI,
    functionName: 'balanceOf',
    args: [address || '0x0000000000000000000000000000000000000000'],
  })

  // Read pending rewards
  const { data: pendingRewards } = useReadContract({
    address: CONTRACT_ADDRESSES.YieldFarm,
    abi: YieldFarmABI,
    functionName: 'pendingReward',
    args: [BigInt(0), address || '0x0000000000000000000000000000000000000000'],
  })

  // ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
  })
  
  const dgtBalanceFormatted = dgtBalance ? formatEther(dgtBalance as bigint) : '0.00'
  const lpBalanceFormatted = lpBalance ? formatEther(lpBalance as bigint) : '0.00'
  const rewardsFormatted = pendingRewards ? formatEther(pendingRewards as bigint) : '0.00'
  
  // Assume 1 DGT = $3 for demo purposes
  const dgtPrice = 3
  const lpPrice = 300 // Assume 1 LP = $300
  
  const dgtValueUSD = (Number(dgtBalanceFormatted) * dgtPrice).toFixed(2)
  const lpValueUSD = (Number(lpBalanceFormatted) * lpPrice).toFixed(2)
  const rewardsValueUSD = (Number(rewardsFormatted) * dgtPrice).toFixed(2)
  const totalValueUSD = (Number(dgtValueUSD) + Number(lpValueUSD) + Number(rewardsValueUSD)).toFixed(2)
  
  const portfolioData = {
    totalValue: (Number(dgtBalanceFormatted) + Number(lpBalanceFormatted) + Number(rewardsFormatted)).toFixed(2),
    totalValueUSD,
    dgtBalance: Number(dgtBalanceFormatted).toFixed(2),
    dgtValueUSD,
    lpBalance: Number(lpBalanceFormatted).toFixed(2),
    lpValueUSD,
    rewardsEarned: Number(rewardsFormatted).toFixed(2),
    rewardsValueUSD,
    ethBalance: ethBalance ? formatEther(ethBalance.value) : '0.00',
    recentActivity: [
      { type: 'Connect Wallet', amount: 'View your transactions', time: 'Now' }
    ]
  }

  const chartData = [
    { name: 'Mon', value: Number(totalValueUSD) * 0.92 },
    { name: 'Tue', value: Number(totalValueUSD) * 0.95 },
    { name: 'Wed', value: Number(totalValueUSD) * 0.97 },
    { name: 'Thu', value: Number(totalValueUSD) * 0.96 },
    { name: 'Fri', value: Number(totalValueUSD) * 0.98 },
    { name: 'Sat', value: Number(totalValueUSD) * 0.99 },
    { name: 'Sun', value: Number(totalValueUSD) }
  ]

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  return { portfolioData, chartData, loading }
}
