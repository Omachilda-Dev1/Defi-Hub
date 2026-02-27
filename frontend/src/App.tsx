import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { config } from './config/wagmi'
import { ThemeProvider } from './context/ThemeContext'
import LoadingScreen from './components/LoadingScreen'
import NetworkBackground from './components/NetworkBackground'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Swap from './pages/Swap'
import Liquidity from './pages/Liquidity'
import Farm from './pages/Farm'
import Governance from './pages/Governance'

const queryClient = new QueryClient()

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ThemeProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            {isLoading && <LoadingScreen />}
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900 transition-colors relative">
                <NetworkBackground />
                <div className="relative z-10">
                  <Navbar />
                  <main className="pb-8">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/swap" element={<Swap />} />
                      <Route path="/liquidity" element={<Liquidity />} />
                      <Route path="/farm" element={<Farm />} />
                      <Route path="/governance" element={<Governance />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </div>
            </Router>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}

export default App
