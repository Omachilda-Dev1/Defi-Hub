import { useState } from 'react'
import { useWriteContract, useReadContract, useAccount } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { CONTRACT_ADDRESSES, YieldFarmABI, LiquidityPoolABI } from '../constants/abis'

export function useFarm() {
  const [loading, setLoading] = useState(false)
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  
  // Read user info from farm (pool 0 is LP token pool)
  const { data: userInfo } = useReadContract({
    address: CONTRACT_ADDRESSES.YieldFarm,
    abi: YieldFarmABI,
    functionName: 'userInfo',
    args: [BigInt(0), address || '0x0000000000000000000000000000000000000000'],
  })

  // Read pending rewards
  const { data: pendingRewards } = useReadContract({
    address: CONTRACT_ADDRESSES.YieldFarm,
    abi: YieldFarmABI,
    functionName: 'pendingReward',
    args: [BigInt(0), address || '0x0000000000000000000000000000000000000000'],
  })

  // Read LP token balance
  const { data: lpBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.LiquidityPool,
    abi: LiquidityPoolABI,
    functionName: 'balanceOf',
    args: [address || '0x0000000000000000000000000000000000000000'],
  })
  
  const farmData = {
    totalStaked: userInfo ? formatEther(userInfo[0] as bigint) : '0.00',
    apy: '125.5',
    rewardPerBlock: '10.00',
    lpBalance: lpBalance ? formatEther(lpBalance as bigint) : '0.00',
    stakedAmount: userInfo ? formatEther(userInfo[0] as bigint) : '0.00',
    lockEndTime: 'Not locked',
    pendingRewards: pendingRewards ? formatEther(pendingRewards as bigint) : '0.00',
    pendingRewardsUSD: pendingRewards ? (Number(formatEther(pendingRewards as bigint)) * 5).toFixed(2) : '0.00'
  }

  const stake = async (amount: string) => {
    setLoading(true)
    try {
      const amountWei = parseEther(amount)
      
      // Approve LP tokens first
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.LiquidityPool,
        abi: LiquidityPoolABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.YieldFarm, amountWei]
      })
      
      // Stake LP tokens (pool 0)
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.YieldFarm,
        abi: YieldFarmABI,
        functionName: 'stake',
        args: [BigInt(0), amountWei]
      })
    } catch (error) {
      console.error('Staking failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const unstake = async (amount: string) => {
    setLoading(true)
    try {
      const amountWei = parseEther(amount)
      
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.YieldFarm,
        abi: YieldFarmABI,
        functionName: 'withdraw',
        args: [BigInt(0), amountWei]
      })
    } catch (error) {
      console.error('Unstaking failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const harvest = async () => {
    setLoading(true)
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.YieldFarm,
        abi: YieldFarmABI,
        functionName: 'harvest',
        args: [BigInt(0)]
      })
    } catch (error) {
      console.error('Harvesting failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { farmData, stake, unstake, harvest, loading }
}
