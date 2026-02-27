import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useBalances } from '../hooks/useBalances'
import { CONTRACT_ADDRESSES, LiquidityPoolABI, GovernanceTokenABI } from '../constants/abis'

export default function Liquidity() {
  const { isConnected } = useAccount()
  const { ethBalance, dgtBalance, lpBalance, isLoading: balancesLoading } = useBalances()
  const [tab, setTab] = useState<'add' | 'remove'>('add')
  const [ethAmount, setEthAmount] = useState('')
  const [tokenAmount, setTokenAmount] = useState('')
  const [lpAmount, setLpAmount] = useState('')
  const [status, setStatus] = useState('')

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  // Read pool reserves
  const { data: reserveETH } = useReadContract({
    address: CONTRACT_ADDRESSES.LiquidityPool,
    abi: LiquidityPoolABI,
    functionName: 'reserveETH',
  })

  const { data: reserveToken } = useReadContract({
    address: CONTRACT_ADDRESSES.LiquidityPool,
    abi: LiquidityPoolABI,
    functionName: 'reserveToken',
  })

  // Auto-calculate token amount when ETH amount changes
  useEffect(() => {
    if (ethAmount && reserveETH && reserveToken) {
      const ethReserve = Number(formatEther(reserveETH as bigint))
      const tokenReserve = Number(formatEther(reserveToken as bigint))
      
      if (ethReserve > 0 && tokenReserve > 0) {
        // Calculate required token amount to maintain ratio
        const requiredTokens = (Number(ethAmount) * tokenReserve) / ethReserve
        setTokenAmount(requiredTokens.toFixed(6))
      } else {
        // Pool is empty - suggest 1 ETH = 1000 DGT ratio
        const suggestedTokens = Number(ethAmount) * 1000
        setTokenAmount(suggestedTokens.toString())
      }
    } else if (!ethAmount) {
      setTokenAmount('')
    }
  }, [ethAmount, reserveETH, reserveToken])

  const handleApprove = async () => {
    if (!tokenAmount || !isConnected) return
    
    setStatus('Please confirm in MetaMask...')
    
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.GovernanceToken,
        abi: GovernanceTokenABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.LiquidityPool, parseEther(tokenAmount)],
      })
      
      setStatus('Approval submitted. Waiting for confirmation...')
    } catch (error: any) {
      console.error('Approval error:', error)
      if (error.message?.includes('User rejected') || error.message?.includes('User denied')) {
        setStatus('Transaction rejected by user')
      } else if (error.message?.includes('missing provider')) {
        setStatus('MetaMask not connected')
      } else {
        setStatus(`Error: ${error.shortMessage || error.message || 'Unknown error'}`)
      }
      setTimeout(() => setStatus(''), 5000)
    }
  }

  const handleAddLiquidity = async () => {
    if (!ethAmount || !tokenAmount || !isConnected) return
    
    setStatus('Please confirm in MetaMask...')
    
    try {
      // Use writeContract with manual gas override
      writeContract({
        address: CONTRACT_ADDRESSES.LiquidityPool,
        abi: LiquidityPoolABI,
        functionName: 'addLiquidity',
        args: [parseEther(tokenAmount)],
        value: parseEther(ethAmount),
      }, {
        // Override gas estimation
        gas: 500000n,
      } as any)
      
      setStatus('Transaction submitted. Waiting for confirmation...')
    } catch (error: any) {
      console.error('Add liquidity error:', error)
      if (error.message?.includes('User rejected') || error.message?.includes('User denied')) {
        setStatus('Transaction rejected by user')
      } else if (error.message?.includes('missing provider')) {
        setStatus('MetaMask not connected')
      } else if (error.message?.includes('gas limit too high')) {
        setStatus('Gas estimation failed. Try manually editing gas in MetaMask to 500000')
      } else {
        setStatus(`Error: ${error.shortMessage || error.message || 'Unknown error'}`)
      }
      setTimeout(() => setStatus(''), 5000)
    }
  }

  const handleRemoveLiquidity = async () => {
    if (!lpAmount || !isConnected) return
    
    setStatus('Please confirm in MetaMask...')
    
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.LiquidityPool,
        abi: LiquidityPoolABI,
        functionName: 'removeLiquidity',
        args: [parseEther(lpAmount)],
      })
      
      setStatus('Transaction submitted. Waiting for confirmation...')
    } catch (error: any) {
      console.error('Remove liquidity error:', error)
      if (error.message?.includes('User rejected') || error.message?.includes('User denied')) {
        setStatus('Transaction rejected by user')
      } else if (error.message?.includes('missing provider')) {
        setStatus('MetaMask not connected')
      } else if (error.message?.includes('gas limit too high')) {
        setStatus('Gas estimation failed. Please try again.')
      } else {
        setStatus(`Error: ${error.shortMessage || error.message || 'Unknown error'}`)
      }
      setTimeout(() => setStatus(''), 5000)
    }
  }

  // Reset status when transaction is confirmed
  if (isSuccess && status.includes('Waiting for confirmation')) {
    setStatus('Transaction confirmed!')
    setTimeout(() => {
      setStatus('')
      setEthAmount('')
      setTokenAmount('')
      setLpAmount('')
    }, 3000)
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="max-w-lg mx-auto">
        <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800 transition-colors">
          <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4 sm:mb-6">Liquidity Pool</h2>

          <div className="flex space-x-2 mb-4 sm:mb-6">
            <button
              onClick={() => setTab('add')}
              className={`flex-1 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-colors ${
              tab === 'add'
                ? 'bg-primary text-black'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Add Liquidity
          </button>
            <button
              onClick={() => setTab('remove')}
              className={`flex-1 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-colors ${
              tab === 'remove'
                ? 'bg-primary text-black'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Remove Liquidity
          </button>
        </div>

        {tab === 'add' ? (
            <div className="space-y-4">
              <div className="bg-white dark:bg-black rounded-lg p-3 sm:p-4 border border-gray-300 dark:border-gray-700 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">ETH Amount</span>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate ml-2">Balance: {balancesLoading ? 'Loading...' : Number(ethBalance).toFixed(4)}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <input
                    type="text"
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 bg-transparent text-xl sm:text-2xl text-black dark:text-white outline-none min-w-0"
                  />
                  <span className="text-black dark:text-white font-semibold text-sm sm:text-base whitespace-nowrap">ETH</span>
                </div>
              </div>

              <div className="bg-white dark:bg-black rounded-lg p-3 sm:p-4 border border-gray-300 dark:border-gray-700 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                    {reserveETH && Number(formatEther(reserveETH as bigint)) > 0 ? 'DGT (Auto)' : 'DGT (Set ratio)'}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate ml-2">Balance: {balancesLoading ? 'Loading...' : Number(dgtBalance).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <input
                    type="text"
                    value={tokenAmount}
                    onChange={(e) => {
                      // Allow manual editing only if pool is empty
                      if (!reserveETH || Number(formatEther(reserveETH as bigint)) === 0) {
                        setTokenAmount(e.target.value)
                      }
                    }}
                    placeholder="0.0"
                    className="flex-1 bg-transparent text-xl sm:text-2xl text-black dark:text-white outline-none min-w-0"
                  />
                  <span className="text-black dark:text-white font-semibold text-sm sm:text-base whitespace-nowrap">DGT</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {reserveETH && Number(formatEther(reserveETH as bigint)) > 0 
                    ? 'Calculated by pool ratio' 
                    : 'Pool empty - set initial price'}
                </p>
              </div>

              <div className="bg-white dark:bg-black rounded-lg p-3 sm:p-4 text-xs sm:text-sm border border-gray-300 dark:border-gray-700 transition-colors">
              <div className="flex justify-between text-gray-600 dark:text-gray-400 mb-2">
                <span>LP Tokens to Receive</span>
                <span className="text-black dark:text-white">0.00</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400 mb-2">
                <span>Share of Pool</span>
                <span className="text-black dark:text-white">0.00%</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Rate</span>
                <span className="text-black dark:text-white break-all">1 ETH = 1000 DGT</span>
              </div>
            </div>

              <button
                onClick={handleApprove}
                disabled={!isConnected || !tokenAmount || isPending || isConfirming}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 rounded-lg transition-colors text-sm sm:text-base mb-2"
              >
                {!isConnected ? 'Connect Wallet' : isPending || isConfirming ? 'Approving...' : 'Approve DGT'}
              </button>

              <button
                onClick={handleAddLiquidity}
                disabled={!isConnected || !ethAmount || !tokenAmount || isPending || isConfirming}
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-semibold py-3 sm:py-4 rounded-lg transition-colors text-sm sm:text-base"
              >
                {!isConnected ? 'Connect Wallet' : isPending || isConfirming ? 'Adding...' : 'Add Liquidity'}
              </button>

              {status && (
                <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                  {status}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white dark:bg-black rounded-lg p-3 sm:p-4 border border-gray-300 dark:border-gray-700 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">LP Tokens</span>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Balance: {balancesLoading ? 'Loading...' : Number(lpBalance).toFixed(4)}</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <input
                    type="text"
                    value={lpAmount}
                    onChange={(e) => setLpAmount(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 bg-transparent text-xl sm:text-2xl text-black dark:text-white outline-none"
                  />
                  <span className="text-black dark:text-white font-semibold text-sm sm:text-base">LP</span>
                </div>
              </div>

              <div className="bg-white dark:bg-black rounded-lg p-3 sm:p-4 text-xs sm:text-sm border border-gray-300 dark:border-gray-700 transition-colors">
              <div className="flex justify-between text-gray-600 dark:text-gray-400 mb-2">
                <span>ETH to Receive</span>
                <span className="text-black dark:text-white">0.00 ETH</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>DGT to Receive</span>
                <span className="text-black dark:text-white">0.00 DGT</span>
              </div>
            </div>

              <button
                onClick={handleRemoveLiquidity}
                disabled={!isConnected || !lpAmount || isPending || isConfirming}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 rounded-lg transition-colors text-sm sm:text-base"
              >
                {!isConnected ? 'Connect Wallet' : isPending || isConfirming ? 'Removing...' : 'Remove Liquidity'}
              </button>

              {status && (
                <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                  {status}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 sm:mt-6 bg-primary/10 dark:bg-primary/5 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800 transition-colors">
          <h3 className="text-base sm:text-lg font-semibold text-black dark:text-white mb-4">Your Liquidity</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span>LP Tokens</span>
              <span className="text-black dark:text-white">0.00</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span>Share of Pool</span>
              <span className="text-black dark:text-white">0.00%</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span>Pooled ETH</span>
              <span className="text-black dark:text-white">0.00 ETH</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span>Pooled DGT</span>
              <span className="text-black dark:text-white">0.00 DGT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
