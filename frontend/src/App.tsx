import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { config } from './config/wagmi'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import Swap from './pages/Swap'
import Liquidity from './pages/Liquidity'
import Farm from './pages/Farm'
import Governance from './pages/Governance'

const queryClient = new QueryClient()

function App() {
  return (
    <ThemeProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <Router>
              <div className="min-h-screen bg-white dark:bg-black transition-colors">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/swap" element={<Swap />} />
                    <Route path="/liquidity" element={<Liquidity />} />
                    <Route path="/farm" element={<Farm />} />
                    <Route path="/governance" element={<Governance />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}

export default App
