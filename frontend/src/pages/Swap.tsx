import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useSwap } from '../hooks/useSwap'

export default function Swap() {
  const { isConnected } = useAccount()
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [fromToken, setFromToken] = useState('ETH')
  const [toToken, setToToken] = useState('DGT')
  const [slippage, setSlippage] = useState('0.5')

  const { swap, loading, quote } = useSwap()

  const handleSwap = async () => {
    if (!fromAmount || !isConnected) return
    
    try {
      await swap({
        fromToken,
        toToken,
        amount: fromAmount,
        slippage: parseFloat(slippage)
      })
      setFromAmount('')
      setToAmount('')
    } catch (error) {
      console.error('Swap failed:', error)
    }
  }

  const handleFlip = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">Swap Tokens</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Slippage:</span>
            <input
              type="text"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              className="w-16 bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-700 px-2 py-1 rounded text-sm transition-colors"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-black rounded-lg p-4 border border-gray-300 dark:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">From</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Balance: 0.00</span>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.0"
                className="flex-1 bg-transparent text-2xl text-black dark:text-white outline-none"
              />
              <select
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
                className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-lg font-semibold border border-gray-300 dark:border-gray-700 transition-colors"
              >
                <option value="ETH">ETH</option>
                <option value="DGT">DGT</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleFlip}
              className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-black dark:text-white p-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          <div className="bg-white dark:bg-black rounded-lg p-4 border border-gray-300 dark:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">To</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Balance: 0.00</span>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={toAmount}
                readOnly
                placeholder="0.0"
                className="flex-1 bg-transparent text-2xl text-black dark:text-white outline-none"
              />
              <select
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
                className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-lg font-semibold border border-gray-300 dark:border-gray-700 transition-colors"
              >
                <option value="DGT">DGT</option>
                <option value="ETH">ETH</option>
              </select>
            </div>
          </div>

          {quote && (
            <div className="bg-white dark:bg-black rounded-lg p-4 text-sm border border-gray-300 dark:border-gray-700 transition-colors">
              <div className="flex justify-between text-gray-600 dark:text-gray-400 mb-2">
                <span>Rate</span>
                <span className="text-black dark:text-white">{quote.rate}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400 mb-2">
                <span>Price Impact</span>
                <span className="text-black dark:text-white">{quote.priceImpact}%</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Fee</span>
                <span className="text-black dark:text-white">{quote.fee}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleSwap}
            disabled={!isConnected || !fromAmount || loading}
            className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-semibold py-4 rounded-lg transition-colors"
          >
            {!isConnected ? 'Connect Wallet' : loading ? 'Swapping...' : 'Swap'}
          </button>
        </div>
      </div>
    </div>
  )
}
