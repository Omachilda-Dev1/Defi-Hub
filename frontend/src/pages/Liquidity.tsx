import { useState } from 'react'
import { useAccount } from 'wagmi'

export default function Liquidity() {
  const { isConnected } = useAccount()
  const [tab, setTab] = useState<'add' | 'remove'>('add')
  const [ethAmount, setEthAmount] = useState('')
  const [tokenAmount, setTokenAmount] = useState('')
  const [lpAmount, setLpAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddLiquidity = async () => {
    if (!ethAmount || !tokenAmount || !isConnected) return
    setLoading(true)
    try {
      console.log('Adding liquidity:', { ethAmount, tokenAmount })
    } catch (error) {
      console.error('Add liquidity failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveLiquidity = async () => {
    if (!lpAmount || !isConnected) return
    setLoading(true)
    try {
      console.log('Removing liquidity:', lpAmount)
    } catch (error) {
      console.error('Remove liquidity failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 transition-colors">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Liquidity Pool</h2>

        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setTab('add')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              tab === 'add'
                ? 'bg-primary text-black'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Add Liquidity
          </button>
          <button
            onClick={() => setTab('remove')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
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
            <div className="bg-white dark:bg-black rounded-lg p-4 border border-gray-300 dark:border-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">ETH Amount</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Balance: 0.00</span>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={ethAmount}
                  onChange={(e) => setEthAmount(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-2xl text-black dark:text-white outline-none"
                />
                <span className="text-black dark:text-white font-semibold">ETH</span>
              </div>
            </div>

            <div className="bg-white dark:bg-black rounded-lg p-4 border border-gray-300 dark:border-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">DGT Amount</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Balance: 0.00</span>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-2xl text-black dark:text-white outline-none"
                />
                <span className="text-black dark:text-white font-semibold">DGT</span>
              </div>
            </div>

            <div className="bg-white dark:bg-black rounded-lg p-4 text-sm border border-gray-300 dark:border-gray-700 transition-colors">
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
                <span className="text-black dark:text-white">1 ETH = 1000 DGT</span>
              </div>
            </div>

            <button
              onClick={handleAddLiquidity}
              disabled={!isConnected || !ethAmount || !tokenAmount || loading}
              className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-semibold py-4 rounded-lg transition-colors"
            >
              {!isConnected ? 'Connect Wallet' : loading ? 'Adding...' : 'Add Liquidity'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white dark:bg-black rounded-lg p-4 border border-gray-300 dark:border-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">LP Tokens</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Balance: 0.00</span>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={lpAmount}
                  onChange={(e) => setLpAmount(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-2xl text-black dark:text-white outline-none"
                />
                <span className="text-black dark:text-white font-semibold">LP</span>
              </div>
            </div>

            <div className="bg-white dark:bg-black rounded-lg p-4 text-sm border border-gray-300 dark:border-gray-700 transition-colors">
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
              disabled={!isConnected || !lpAmount || loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-colors"
            >
              {!isConnected ? 'Connect Wallet' : loading ? 'Removing...' : 'Remove Liquidity'}
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 transition-colors">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Your Liquidity</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>LP Tokens</span>
            <span className="text-black dark:text-white">0.00</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Share of Pool</span>
            <span className="text-black dark:text-white">0.00%</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Pooled ETH</span>
            <span className="text-black dark:text-white">0.00 ETH</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Pooled DGT</span>
            <span className="text-black dark:text-white">0.00 DGT</span>
          </div>
        </div>
      </div>
    </div>
  )
}
