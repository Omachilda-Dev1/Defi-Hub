import { useState, useEffect } from 'react'
import { useBalances } from './useBalances'

export function usePortfolio() {
  const [loading, setLoading] = useState(true)
  const { ethBalance, dgtBalance, lpBalance, isLoading } = useBalances()
  
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setLoading(false), 500)
    }
  }, [isLoading])
  
  // Calculate USD values (demo prices)
  const dgtPrice = 3
  const lpPrice = 300
  
  const ethNum = Number(ethBalance) || 0
  const dgtNum = Number(dgtBalance) || 0
  const lpNum = Number(lpBalance) || 0
  
  const dgtValueUSD = (dgtNum * dgtPrice).toFixed(2)
  const lpValueUSD = (lpNum * lpPrice).toFixed(2)
  const totalValueUSD = (Number(dgtValueUSD) + Number(lpValueUSD)).toFixed(2)
  
  const portfolioData = {
    totalValue: (dgtNum + lpNum).toFixed(2),
    totalValueUSD,
    dgtBalance: dgtNum.toFixed(2),
    dgtValueUSD,
    lpBalance: lpNum.toFixed(2),
    lpValueUSD,
    rewardsEarned: '0.00',
    rewardsValueUSD: '0.00',
    ethBalance: ethNum.toFixed(4),
    recentActivity: [
      { type: 'Wallet Connected', amount: `${ethNum.toFixed(4)} ETH`, time: 'Now' },
      { type: 'DGT Balance', amount: `${dgtNum.toFixed(0)} DGT`, time: 'Now' }
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

  return { portfolioData, chartData, loading }
}
