interface TokenCardProps {
  title: string
  balance: string
  usdValue?: string
}

export default function TokenCard({ title, balance, usdValue }: TokenCardProps) {
  return (
    <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4 sm:p-6 border border-primary/20 transition-colors">
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 truncate">{title}</h3>
      </div>
      <div className="space-y-1 sm:space-y-2">
        <p className="text-xl sm:text-2xl font-bold text-black dark:text-white break-all">{balance}</p>
        {usdValue && (
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-all">${usdValue} USD</p>
        )}
      </div>
    </div>
  )
}
