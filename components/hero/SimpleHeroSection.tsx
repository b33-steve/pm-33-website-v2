'use client'

import { Button, Text, Grid } from '@/components/ui'
import { getPM33GradientStyles } from '@/lib/styles/pm33-theme-utils'

export function SimpleHeroSection() {
  return (
    <div className="text-center md:text-left">
      {/* Brand + Hero Headline */}
      <div className="animate-fadeIn">
        <Text as="h1" size="6xl" weight="bold" variant="primary" className="mb-6">
          <span
            className="inline-block"
            style={getPM33GradientStyles('primary')}
          >
            PM33
          </span>
        </Text>

        {/* Single Powerful Message */}
        <Text as="h2" size="4xl" weight="bold" variant="primary" className="mb-6 leading-tight">
          Ship 3x More Features
          <br />
          <span
            className="inline-block"
            style={getPM33GradientStyles('secondary')}
          >
            Without Hiring More Engineers
          </span>
        </Text>
      </div>

      {/* Value Proposition */}
      <div className="animate-fadeIn delay-200">
        <Text as="p" size="xl" variant="secondary" className="mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed">
          Stop wasting 40% of your sprint capacity on manual planning. Join 2,847 PMs
          who've eliminated backlog overwhelm and shipped 312% more features this quarter.
        </Text>
      </div>

      {/* Social Proof Bar */}
      <div className="animate-fadeIn delay-300">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mb-8 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2 hover:scale-105 transition-transform">
            <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
            <span>4.9/5 from 1,200+ PMs</span>
          </div>
          <div className="flex items-center gap-2 hover:scale-105 transition-transform">
            <span className="text-green-500">✓</span>
            <span>2,847 teams actively using</span>
          </div>
          <div className="flex items-center gap-2 hover:scale-105 transition-transform">
            <span className="text-blue-500">🚀</span>
            <span>Average 3.2x velocity increase</span>
          </div>
        </div>
      </div>

      {/* Enhanced CTA Buttons */}
      <div className="animate-fadeIn delay-400">
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-6">
          <div className="hover:scale-102 hover:-translate-y-1 transition-transform">
            <Button
              variant="primary"
              size="lg"
              className="px-10 py-5 text-lg font-semibold relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                background: 'var(--pm33-gradient-primary)',
                boxShadow: 'var(--shadow-primary)'
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Start FREE 14-Day Trial
                <span className="animate-bounce">→</span>
              </span>
            </Button>
          </div>

          <div className="hover:scale-102 hover:-translate-y-1 transition-transform">
            <Button
              variant="secondary"
              size="lg"
              className="px-10 py-5 text-lg font-semibold relative overflow-hidden border-2 backdrop-blur-sm"
              style={{
                borderColor: 'var(--pm33-primary)',
                background: 'var(--pm33-bg-glass)',
                color: 'var(--pm33-primary)'
              }}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">▶</span>
                Watch 2-Minute Demo
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Risk Reversal */}
      <div className="animate-fadeIn delay-500">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1 hover:scale-105 transition-transform">
            <span className="text-green-500">✓</span>
            No credit card required
          </span>
          <span className="flex items-center gap-1 hover:scale-105 transition-transform">
            <span className="text-green-500">✓</span>
            Cancel anytime
          </span>
          <span className="flex items-center gap-1 hover:scale-105 transition-transform">
            <span className="text-green-500">✓</span>
            30-day money-back guarantee
          </span>
        </div>
      </div>
    </div>
  )
}