import { useState, useEffect } from 'react'

export function usePortfolio() {
  const [loading, setLoading] = useState(true)
  
  const portfolioData = {
    totalValue: '15,234.56',
    totalValueUSD: '45,703.68',
    dgtBalance: '10,000.00',
    dgtValueUSD: '30,000.00',
    lpBalance: '50.00',
    lpValueUSD: '15,000.00',
    rewardsEarned: '234.56',
    rewardsValueUSD: '703.68',
    recentActivity: [
      { type: 'Swap', amount: '1.5 ETH → 1,500 DGT', time: '2 hours ago' },
      { type: 'Add Liquidity', amount: '10 LP tokens', time: '5 hours ago' },
      { type: 'Harvest', amount: '50 DGT', time: '1 day ago' },
      { type: 'Stake', amount: '25 LP tokens', time: '2 days ago' }
    ]
  }

  const chartData = [
    { name: 'Mon', value: 42000 },
    { name: 'Tue', value: 43500 },
    { name: 'Wed', value: 44200 },
    { name: 'Thu', value: 43800 },
    { name: 'Fri', value: 45000 },
    { name: 'Sat', value: 45500 },
    { name: 'Sun', value: 45703 }
  ]

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  return { portfolioData, chartData, loading }
}
