import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 1500) // 1.5 seconds loading time

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black transition-opacity duration-500">
      <div className="relative">
        {/* Animated circles around logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border-4 border-primary/20 rounded-full animate-ping"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 border-4 border-primary/40 rounded-full animate-pulse"></div>
        </div>
        
        {/* Logo with animation */}
        <div className="relative z-10 animate-bounce">
          <svg width="80" height="80" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 5L35 30H5L20 5Z" fill="#FDB813" className="animate-pulse"/>
            <path d="M20 12L28 25H12L20 12Z" fill="#000000"/>
            <path d="M20 15L24 22H16L20 15Z" fill="#FDB813"/>
          </svg>
        </div>

        {/* Loading text */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-black dark:text-primary animate-pulse">
            BASECAMP
          </h2>
          <div className="flex justify-center gap-1 mt-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
