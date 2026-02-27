import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useFarm } from '../hooks/useFarm'

export default function Farm() {
  const { isConnected } = useAccount()
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const { farmData, stake, unstake, harvest, loading } = useFarm()

  const handleStake = async () => {
    if (!stakeAmount || !isConnected) return
    try {
      await stake(stakeAmount)
      setStakeAmount('')
    } catch (error) {
      console.error('Stake failed:', error)
    }
  }

  const handleUnstake = async () => {
    if (!unstakeAmount || !isConnected) return
    try {
      await unstake(unstakeAmount)
      setUnstakeAmount('')
    } catch (error) {
      console.error('Unstake failed:', error)
    }
  }

  const handleHarvest = async () => {
    if (!isConnected) return
    try {
      await harvest()
    } catch (error) {
      console.error('Harvest failed:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-2">Yield Farming</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Stake LP tokens to earn DGT rewards</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800 transition-colors">
            <h3 className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Total Staked</h3>
            <p className="text-xl sm:text-2xl font-bold text-black dark:text-white">{farmData.totalStaked} LP</p>
          </div>
          <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800 transition-colors">
            <h3 className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">APY</h3>
            <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{farmData.apy}%</p>
          </div>
          <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800 transition-colors">
            <h3 className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Rewards Per Block</h3>
            <p className="text-xl sm:text-2xl font-bold text-black dark:text-white">{farmData.rewardPerBlock} DGT</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800 transition-colors">
            <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white mb-4 sm:mb-6">Stake LP Tokens</h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-black rounded-lg p-4 border border-gray-300 dark:border-gray-700 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Amount to Stake</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Balance: {farmData.lpBalance}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 bg-transparent text-2xl text-black dark:text-white outline-none"
                  />
                  <button
                    onClick={() => setStakeAmount(farmData.lpBalance)}
                    className="text-primary hover:text-primary-dark text-sm font-semibold transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <button
                onClick={handleStake}
                disabled={!isConnected || !stakeAmount || loading}
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-lg transition-colors"
              >
                {!isConnected ? 'Connect Wallet' : loading ? 'Staking...' : 'Stake'}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Your Staking Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Staked Amount</span>
                  <span className="text-black dark:text-white">{farmData.stakedAmount} LP</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Lock End Time</span>
                  <span className="text-black dark:text-white">{farmData.lockEndTime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800 transition-colors">
              <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white mb-4 sm:mb-6">Rewards</h2>
              
              <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg p-4 sm:p-6 mb-4 border border-primary/30">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Pending Rewards</p>
                <p className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-4">{farmData.pendingRewards} DGT</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">${farmData.pendingRewardsUSD} USD</p>
              </div>

              <button
                onClick={handleHarvest}
                disabled={!isConnected || farmData.pendingRewards === '0.00' || loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm sm:text-base"
              >
                {!isConnected ? 'Connect Wallet' : loading ? 'Harvesting...' : 'Harvest Rewards'}
              </button>
            </div>

            <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800 transition-colors">
              <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white mb-4 sm:mb-6">Unstake</h2>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-black rounded-lg p-3 sm:p-4 border border-gray-300 dark:border-gray-700 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Amount to Unstake</span>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Staked: {farmData.stakedAmount}</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <input
                      type="text"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      placeholder="0.0"
                      className="flex-1 bg-transparent text-xl sm:text-2xl text-black dark:text-white outline-none"
                    />
                    <button
                      onClick={() => setUnstakeAmount(farmData.stakedAmount)}
                      className="text-primary hover:text-primary-dark text-xs sm:text-sm font-semibold transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleUnstake}
                  disabled={!isConnected || !unstakeAmount || loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm sm:text-base"
                >
                  {!isConnected ? 'Connect Wallet' : loading ? 'Unstaking...' : 'Unstake'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
