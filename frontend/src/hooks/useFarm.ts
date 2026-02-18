import { useState } from 'react'

export function useFarm() {
  const [loading, setLoading] = useState(false)
  
  const farmData = {
    totalStaked: '12,345.67',
    apy: '125.5',
    rewardPerBlock: '10.00',
    lpBalance: '100.00',
    stakedAmount: '50.00',
    lockEndTime: 'Not locked',
    pendingRewards: '25.50',
    pendingRewardsUSD: '127.50'
  }

  const stake = async (amount: string) => {
    setLoading(true)
    try {
      console.log('Staking:', amount)
      await new Promise(resolve => setTimeout(resolve, 2000))
    } finally {
      setLoading(false)
    }
  }

  const unstake = async (amount: string) => {
    setLoading(true)
    try {
      console.log('Unstaking:', amount)
      await new Promise(resolve => setTimeout(resolve, 2000))
    } finally {
      setLoading(false)
    }
  }

  const harvest = async () => {
    setLoading(true)
    try {
      console.log('Harvesting rewards')
      await new Promise(resolve => setTimeout(resolve, 2000))
    } finally {
      setLoading(false)
    }
  }

  return { farmData, stake, unstake, harvest, loading }
}
