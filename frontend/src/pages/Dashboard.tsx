import { useAccount } from 'wagmi'
import TokenCard from '../components/TokenCard'
import Chart from '../components/Chart'
import { usePortfolio } from '../hooks/usePortfolio'

export default function Dashboard() {
  const { isConnected } = useAccount()
  const { portfolioData, chartData, loading } = usePortfolio()

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 dark:text-gray-400">Please connect your wallet to view your portfolio</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-2">Portfolio Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Track your DeFi assets and earnings</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <TokenCard
          title="ETH Balance"
          balance={portfolioData.ethBalance}
          usdValue={(Number(portfolioData.ethBalance) * 2000).toFixed(2)}
        />
        <TokenCard
          title="DGT Balance"
          balance={portfolioData.dgtBalance}
          usdValue={portfolioData.dgtValueUSD}
        />
        <TokenCard
          title="LP Tokens"
          balance={portfolioData.lpBalance}
          usdValue={portfolioData.lpValueUSD}
        />
        <TokenCard
          title="Rewards Earned"
          balance={portfolioData.rewardsEarned}
          usdValue={portfolioData.rewardsValueUSD}
        />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Chart data={chartData} title="Portfolio Value (7 Days)" />
          <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800 transition-colors">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {portfolioData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800 last:border-0">
                  <div>
                    <p className="text-sm sm:text-base text-black dark:text-white font-medium">{activity.type}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{activity.time}</p>
                  </div>
                  <p className="text-sm sm:text-base text-primary font-semibold">{activity.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
