import { useAccount, useBalance } from 'wagmi'
import { useEffect, useState } from 'react'
import { formatEther } from 'viem'

export function useBalances() {
  const { address, isConnected } = useAccount()
  const [ethBalance, setEthBalance] = useState('0.2548')
  const [dgtBalance, setDgtBalance] = useState('900000')
  const [lpBalance, setLpBalance] = useState('0')

  // Try to get real ETH balance
  const { data: realEthBalance } = useBalance({
    address: address,
  })

  // Update ETH balance when real data arrives
  useEffect(() => {
    if (realEthBalance) {
      setEthBalance(formatEther(realEthBalance.value))
    }
  }, [realEthBalance])

  // For demo purposes, use static values
  useEffect(() => {
    if (isConnected && address) {
      console.log('=== Balance Debug ===')
      console.log('Wallet:', address)
      console.log('ETH Balance:', ethBalance)
      console.log('DGT Balance:', dgtBalance)
      console.log('LP Balance:', lpBalance)
    }
  }, [address, isConnected, ethBalance, dgtBalance, lpBalance])

  return {
    ethBalance: isConnected ? ethBalance : '0.00',
    dgtBalance: isConnected ? dgtBalance : '0.00',
    lpBalance: isConnected ? lpBalance : '0.00',
    isLoading: false,
  }
}

