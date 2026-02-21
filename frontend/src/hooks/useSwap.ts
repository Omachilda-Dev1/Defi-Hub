import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import { CONTRACT_ADDRESSES, SwapRouterABI, GovernanceTokenABI } from '../constants/abis'

interface SwapParams {
  fromToken: string
  toToken: string
  amount: string
  slippage: number
}

export function useSwap() {
  const [loading, setLoading] = useState(false)
  const [quote] = useState<string | null>(null)
  
  const { writeContractAsync } = useWriteContract()

  const getQuote = async (amount: string) => {
    try {
      const amountWei = parseEther(amount)
      return amountWei.toString()
    } catch (error) {
      console.error('Error getting quote:', error)
      return null
    }
  }

  const swap = async (params: SwapParams) => {
    setLoading(true)
    try {
      const isETHToToken = params.fromToken === 'ETH'
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes
      
      if (isETHToToken) {
        // Swap ETH for Token
        const minTokenOut = parseEther(params.amount) * BigInt(100 - params.slippage) / BigInt(100)
        
        await writeContractAsync({
          address: CONTRACT_ADDRESSES.SwapRouter,
          abi: SwapRouterABI,
          functionName: 'swapETHForToken',
          args: [minTokenOut, BigInt(deadline)],
          value: parseEther(params.amount)
        })
      } else {
        // Swap Token for ETH - need approval first
        const tokenAmount = parseEther(params.amount)
        
        // Approve tokens
        await writeContractAsync({
          address: CONTRACT_ADDRESSES.GovernanceToken,
          abi: GovernanceTokenABI,
          functionName: 'approve',
          args: [CONTRACT_ADDRESSES.SwapRouter, tokenAmount]
        })
        
        // Execute swap
        const minETHOut = tokenAmount * BigInt(100 - params.slippage) / BigInt(100)
        await writeContractAsync({
          address: CONTRACT_ADDRESSES.SwapRouter,
          abi: SwapRouterABI,
          functionName: 'swapTokenForETH',
          args: [tokenAmount, minETHOut, BigInt(deadline)]
        })
      }
    } catch (error) {
      console.error('Swap failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { swap, loading, quote, getQuote }
}
