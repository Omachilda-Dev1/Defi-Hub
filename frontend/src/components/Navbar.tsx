import { Link } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useTheme } from '../context/ThemeContext'
import { useState } from 'react'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="BASECAMP Logo" className="w-8 h-8" />
              <span className="text-xl font-bold text-black dark:text-primary">BASECAMP</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary px-3 py-2 rounded-md transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-primary px-3 py-2 rounded-md transition-colors">
              Dashboard
            </Link>
            <Link to="/swap" className="text-gray-700 dark:text-gray-300 hover:text-primary px-3 py-2 rounded-md transition-colors">
              Swap
            </Link>
            <Link to="/liquidity" className="text-gray-700 dark:text-gray-300 hover:text-primary px-3 py-2 rounded-md transition-colors">
              Liquidity
            </Link>
            <Link to="/farm" className="text-gray-700 dark:text-gray-300 hover:text-primary px-3 py-2 rounded-md transition-colors">
              Farm
            </Link>
            <Link to="/governance" className="text-gray-700 dark:text-gray-300 hover:text-primary px-3 py-2 rounded-md transition-colors">
              Governance
            </Link>
          </div>

          {/* Right Side - Theme Toggle & Connect Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            
            {/* Custom styled ConnectButton */}
            <div className="hidden lg:block">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted,
                }) => {
                  const ready = mounted
                  const connected = ready && account && chain

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        style: {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              className="px-4 py-2 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all"
                            >
                              Connect Wallet
                            </button>
                          )
                        }

                        if (chain.unsupported) {
                          return (
                            <button
                              onClick={openChainModal}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                            >
                              Wrong network
                            </button>
                          )
                        }

                        return (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={openChainModal}
                              className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white rounded-lg transition-all flex items-center gap-2"
                            >
                              {chain.hasIcon && (
                                <div
                                  style={{
                                    background: chain.iconBackground,
                                    width: 20,
                                    height: 20,
                                    borderRadius: 999,
                                    overflow: 'hidden',
                                  }}
                                >
                                  {chain.iconUrl && (
                                    <img
                                      alt={chain.name ?? 'Chain icon'}
                                      src={chain.iconUrl}
                                      style={{ width: 20, height: 20 }}
                                    />
                                  )}
                                </div>
                              )}
                              {chain.name}
                            </button>

                            <button
                              onClick={openAccountModal}
                              className="px-4 py-2 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all"
                            >
                              {account.displayName}
                            </button>
                          </div>
                        )
                      })()}
                    </div>
                  )
                }}
              </ConnectButton.Custom>
            </div>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-900 px-3 py-2 rounded-md transition-colors"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-900 px-3 py-2 rounded-md transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/swap"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-900 px-3 py-2 rounded-md transition-colors"
              >
                Swap
              </Link>
              <Link
                to="/liquidity"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-900 px-3 py-2 rounded-md transition-colors"
              >
                Liquidity
              </Link>
              <Link
                to="/farm"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-900 px-3 py-2 rounded-md transition-colors"
              >
                Farm
              </Link>
              <Link
                to="/governance"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-900 px-3 py-2 rounded-md transition-colors"
              >
                Governance
              </Link>
              
              {/* Mobile Connect Button */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    mounted,
                  }) => {
                    const ready = mounted
                    const connected = ready && account && chain

                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                          style: {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                      >
                        {(() => {
                          if (!connected) {
                            return (
                              <button
                                onClick={openConnectModal}
                                className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all"
                              >
                                Connect Wallet
                              </button>
                            )
                          }

                          if (chain.unsupported) {
                            return (
                              <button
                                onClick={openChainModal}
                                className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                              >
                                Wrong network
                              </button>
                            )
                          }

                          return (
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={openChainModal}
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white rounded-lg transition-all flex items-center justify-center gap-2"
                              >
                                {chain.hasIcon && (
                                  <div
                                    style={{
                                      background: chain.iconBackground,
                                      width: 20,
                                      height: 20,
                                      borderRadius: 999,
                                      overflow: 'hidden',
                                    }}
                                  >
                                    {chain.iconUrl && (
                                      <img
                                        alt={chain.name ?? 'Chain icon'}
                                        src={chain.iconUrl}
                                        style={{ width: 20, height: 20 }}
                                      />
                                    )}
                                  </div>
                                )}
                                {chain.name}
                              </button>

                              <button
                                onClick={openAccountModal}
                                className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all"
                              >
                                {account.displayName}
                              </button>
                            </div>
                          )
                        })()}
                      </div>
                    )
                  }}
                </ConnectButton.Custom>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
