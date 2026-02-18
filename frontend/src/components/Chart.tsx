import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '../context/ThemeContext'

interface ChartProps {
  data: Array<{ name: string; value: number }>
  title: string
}

export default function Chart({ data, title }: ChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 transition-colors">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis dataKey="name" stroke={isDark ? '#9ca3af' : '#6b7280'} />
          <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDark ? '#111827' : '#ffffff', 
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: isDark ? '#ffffff' : '#000000'
            }}
          />
          <Line type="monotone" dataKey="value" stroke="#FDB813" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
