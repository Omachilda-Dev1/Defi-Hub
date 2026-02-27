import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { usePrice } from '../hooks/usePrice'

export default function Home() {
  const { isConnected } = useAccount()
  const { ethPrice, isLoading } = usePrice()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Network Grid Background */}
        <div className="absolute inset-0 opacity-50">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgb(251, 184, 19)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Network nodes */}
            <circle cx="10%" cy="20%" r="3" fill="#FDB813" opacity="0.6"/>
            <circle cx="30%" cy="15%" r="2" fill="#FDB813" opacity="0.4"/>
            <circle cx="50%" cy="25%" r="4" fill="#FDB813" opacity="0.7"/>
            <circle cx="70%" cy="18%" r="2.5" fill="#FDB813" opacity="0.5"/>
            <circle cx="90%" cy="22%" r="3" fill="#FDB813" opacity="0.6"/>
            <circle cx="15%" cy="40%" r="2" fill="#FDB813" opacity="0.4"/>
            <circle cx="40%" cy="45%" r="3.5" fill="#FDB813" opacity="0.6"/>
            <circle cx="65%" cy="42%" r="2" fill="#FDB813" opacity="0.5"/>
            <circle cx="85%" cy="48%" r="3" fill="#FDB813" opacity="0.6"/>
            {/* Connection lines */}
            <line x1="10%" y1="20%" x2="30%" y2="15%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
            <line x1="30%" y1="15%" x2="50%" y2="25%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
            <line x1="50%" y1="25%" x2="70%" y2="18%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
            <line x1="70%" y1="18%" x2="90%" y2="22%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
            <line x1="15%" y1="40%" x2="40%" y2="45%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
            <line x1="40%" y1="45%" x2="65%" y2="42%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
            <line x1="65%" y1="42%" x2="85%" y2="48%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
            <line x1="50%" y1="25%" x2="40%" y2="45%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <span className="text-primary font-semibold text-sm">Deployed on Sepolia Testnet</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white mb-6 leading-tight px-4">
              <span className="block">Welcome to</span>
              <span className="block text-primary mt-2">BASECAMP DeFi</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-4 max-w-3xl mx-auto px-4">
              Your Complete Decentralized Finance Platform
            </p>

            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-500 mb-12 max-w-2xl mx-auto px-4">
              Swap tokens, provide liquidity, earn rewards, and participate in governance - all in one place
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {isConnected ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-8 py-4 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
                  >
                    View Dashboard
                  </Link>
                  <Link
                    to="/swap"
                    className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-black dark:text-white font-semibold rounded-lg border-2 border-gray-200 dark:border-gray-700 transition-all transform hover:scale-105 w-full sm:w-auto"
                  >
                    Start Trading
                  </Link>
                </>
              ) : (
                <button className="px-8 py-4 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto">
                  Connect Wallet
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto px-4">
              <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4 sm:p-6 border border-primary/20 transition-colors">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2 break-words">
                  {isLoading ? '...' : `$${ethPrice}`}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">ETH Price (Live)</div>
              </div>
              <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4 sm:p-6 border border-primary/20 transition-colors">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">5</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Smart Contracts</div>
              </div>
              <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4 sm:p-6 border border-primary/20 transition-colors">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">0.3%</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Trading Fee</div>
              </div>
              <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4 sm:p-6 border border-primary/20 transition-colors">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">10</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">DGT per Block</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black dark:text-white mb-4">
            Everything You Need in DeFi
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Built with security, efficiency, and user experience in mind
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-primary/10 dark:bg-primary/5 rounded-xl p-8 border border-primary/20 hover:border-primary dark:hover:border-primary transition-all transform hover:scale-105">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">Token Swapping</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Swap ETH and DGT tokens instantly using our automated market maker
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-primary/10 dark:bg-primary/5 rounded-xl p-8 border border-primary/20 hover:border-primary dark:hover:border-primary transition-all transform hover:scale-105">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">Liquidity Pools</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Provide liquidity and earn 0.3% of all trading fees automatically
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-primary/10 dark:bg-primary/5 rounded-xl p-8 border border-primary/20 hover:border-primary dark:hover:border-primary transition-all transform hover:scale-105">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">Yield Farming</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Stake your LP tokens and earn DGT rewards every block
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-primary/10 dark:bg-primary/5 rounded-xl p-8 border border-primary/20 hover:border-primary dark:hover:border-primary transition-all transform hover:scale-105">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">Governance</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Vote on proposals and shape the future of the protocol
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-primary/10 dark:bg-primary/5 border-y border-primary/20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Secure, tested, and production-ready
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="p-4">
              <div className="text-xl sm:text-2xl font-bold text-primary mb-2 break-words">Solidity</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Smart Contracts</div>
            </div>
            <div className="p-4">
              <div className="text-xl sm:text-2xl font-bold text-primary mb-2">React</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Frontend</div>
            </div>
            <div className="p-4">
              <div className="text-xl sm:text-2xl font-bold text-primary mb-2 break-words">TypeScript</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Type Safety</div>
            </div>
            <div className="p-4">
              <div className="text-xl sm:text-2xl font-bold text-primary mb-2 break-words">Chainlink</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Price Feeds</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12 text-center border border-primary/20">
          <h2 className="text-4xl font-bold text-black dark:text-white mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Connect your wallet and experience the future of decentralized finance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isConnected ? (
              <Link
                to="/swap"
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Trading Now
              </Link>
            ) : (
              <button className="px-8 py-4 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                Connect Wallet to Begin
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
