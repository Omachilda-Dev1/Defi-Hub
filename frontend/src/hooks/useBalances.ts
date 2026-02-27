import { useAccount, useBalance } from 'wagmi'
import { useEffect } from 'react'
import { formatEther } from 'viem'

export function useBalances() {
  const { address, isConnected } = useAccount()
  const dgtBalance = '900000'
  const lpBalance = '0'
  const ethBalanceStatic = '0.2548'

  // Try to get real ETH balance
  const { data: realEthBalance } = useBalance({
    address: address,
  })

  // Use real ETH balance if available, otherwise use static
  const ethBalance = realEthBalance ? formatEther(realEthBalance.value) : ethBalanceStatic

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

