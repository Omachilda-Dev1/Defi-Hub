interface TokenCardProps {
  title: string
  balance: string
  usdValue?: string
}

export default function TokenCard({ title, balance, usdValue }: TokenCardProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 transition-colors">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-black dark:text-white">{balance}</p>
        {usdValue && (
          <p className="text-sm text-gray-600 dark:text-gray-400">${usdValue} USD</p>
        )}
      </div>
    </div>
  )
}
