'use client'

export function VelocityDemoSkeleton() {
  return (
    <div
      className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-8 shadow-xl w-full max-w-md mx-auto min-h-[480px] animate-pulse"
      aria-label="Loading velocity demo..."
    >
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        {/* Header skeleton */}
        <div className="w-full space-y-3">
          <div className="h-6 bg-white/20 rounded-lg w-3/4 mx-auto"></div>
          <div className="h-4 bg-white/20 rounded-lg w-5/6 mx-auto"></div>
        </div>

        {/* Chart skeleton */}
        <div className="flex items-center justify-center space-x-8 w-full">
          <div className="text-center space-y-2">
            <div className="h-3 bg-white/20 rounded w-16 mx-auto"></div>
            <div className="h-8 bg-white/20 rounded w-12 mx-auto"></div>
            <div className="h-3 bg-white/20 rounded w-20 mx-auto"></div>
          </div>

          <div className="w-12 h-1 bg-gradient-to-r from-white/20 to-white/40 rounded"></div>

          <div className="text-center space-y-2">
            <div className="h-3 bg-white/20 rounded w-16 mx-auto"></div>
            <div className="h-8 bg-white/20 rounded w-12 mx-auto"></div>
            <div className="h-3 bg-white/20 rounded w-20 mx-auto"></div>
          </div>
        </div>

        {/* Button skeleton */}
        <div className="w-full mt-6">
          <div className="h-12 bg-white/20 rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}