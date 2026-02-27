import { useState } from 'react'
import { useAccount } from 'wagmi'

interface Proposal {
  id: number
  title: string
  description: string
  forVotes: string
  againstVotes: string
  status: 'active' | 'passed' | 'rejected'
  endTime: string
}

export default function Governance() {
  const { isConnected } = useAccount()
  const [votingPower] = useState('1,234.56')
  
  const proposals: Proposal[] = [
    {
      id: 1,
      title: 'Increase Reward Rate',
      description: 'Proposal to increase farming rewards from 10 DGT/block to 15 DGT/block',
      forVotes: '45,678',
      againstVotes: '12,345',
      status: 'active',
      endTime: '2 days'
    },
    {
      id: 2,
      title: 'Add New Trading Pair',
      description: 'Add USDC/ETH trading pair to the platform',
      forVotes: '67,890',
      againstVotes: '8,901',
      status: 'passed',
      endTime: 'Ended'
    },
    {
      id: 3,
      title: 'Reduce Trading Fees',
      description: 'Reduce swap fees from 0.3% to 0.25%',
      forVotes: '23,456',
      againstVotes: '45,678',
      status: 'rejected',
      endTime: 'Ended'
    }
  ]

  const handleVote = (proposalId: number, support: boolean) => {
    if (!isConnected) return
    console.log(`Voting ${support ? 'for' : 'against'} proposal ${proposalId}`)
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-2">Governance</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Vote on proposals to shape the future of BASECAMP</p>
        </div>

        <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800 mb-6 sm:mb-8 transition-colors">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Your Voting Power</h3>
              <p className="text-xl sm:text-2xl font-bold text-black dark:text-white">{votingPower} DGT</p>
            </div>
            <div className="text-left sm:text-right">
              <h3 className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Active Proposals</h3>
              <p className="text-xl sm:text-2xl font-bold text-black dark:text-white">
                {proposals.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800 transition-colors">
              <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white">{proposal.title}</h3>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                      proposal.status === 'active' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : proposal.status === 'passed'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {proposal.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{proposal.description}</p>
                </div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {proposal.endTime}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span className="text-green-600 dark:text-green-400">For</span>
                    <span className="text-black dark:text-white">{proposal.forVotes} DGT</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ 
                        width: `${(parseFloat(proposal.forVotes.replace(/,/g, '')) / 
                          (parseFloat(proposal.forVotes.replace(/,/g, '')) + 
                           parseFloat(proposal.againstVotes.replace(/,/g, '')))) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span className="text-red-600 dark:text-red-400">Against</span>
                    <span className="text-black dark:text-white">{proposal.againstVotes} DGT</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full"
                      style={{ 
                        width: `${(parseFloat(proposal.againstVotes.replace(/,/g, '')) / 
                          (parseFloat(proposal.forVotes.replace(/,/g, '')) + 
                           parseFloat(proposal.againstVotes.replace(/,/g, '')))) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>

              {proposal.status === 'active' && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={() => handleVote(proposal.id, true)}
                    disabled={!isConnected}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Vote For
                  </button>
                  <button
                    onClick={() => handleVote(proposal.id, false)}
                    disabled={!isConnected}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Vote Against
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
