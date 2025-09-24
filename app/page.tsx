'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Button, Text, Card, Grid } from '@/components/ui'
import { PageLayout, Section, Container, Navigation } from '@/components/layout'
import { VelocityDemoSkeleton } from '@/components/skeletons/VelocityDemoSkeleton'
import { getPM33GradientStyles } from '@/lib/styles/pm33-theme-utils'

// Dynamic imports for better performance
const InteractiveVelocityDemo = dynamic(
  () => import('@/components/velocity/InteractiveVelocityDemo').then(mod => ({ default: mod.InteractiveVelocityDemo })),
  {
    loading: () => <VelocityDemoSkeleton />,
    ssr: false
  }
)

export default function HomePage() {
  return (
    <>
      <Navigation />
      <PageLayout variant="default" background="gradient" padding="none" className="pt-16">
        {/* Hero Section */}
        <Section as="header" variant="gradient" padding="xl" className="relative overflow-hidden">
          <Container size="xl" padding="lg" className="relative z-10">
            <div className="animate-fadeIn">
              <Grid.Container cols={2} gap="xl" responsive={true}>
                <Grid.Item xs={12} md={6}>
                  <div className="text-center md:text-left">
                    {/* Brand + Hero Headline */}
                    <div className="animate-slideUp delay-100">
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
                </Grid.Item>

                <Grid.Item xs={12} md={6}>
                  <div className="flex justify-center animate-fadeIn delay-300">
                    <Suspense fallback={<VelocityDemoSkeleton />}>
                      <InteractiveVelocityDemo />
                    </Suspense>
                  </div>
                </Grid.Item>
              </Grid.Container>
            </div>
          </Container>
        </Section>

        <main>
          {/* Feature Grid */}
          <Section padding="xl">
            <Container size="xl" padding="lg">
              <div className="text-center mb-16">
                <Text as="h3" size="4xl" weight="bold" variant="primary" className="mb-4">
                  Everything You Need to Ship Faster
                </Text>
                <Text as="p" size="xl" variant="secondary" className="max-w-2xl mx-auto">
                  Comprehensive tools designed for modern product teams
                </Text>
              </div>

              <Grid.Container cols={3} gap="lg" responsive={true}>
                {/* RICE Prioritization */}
                <Grid.Item xs={12} md={4}>
                  <Card variant="glass-subtle" padding="md" hoverable className="h-full" data-testid="feature-card">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-700 rounded-lg flex items-center justify-center mb-4 shadow-md transition-colors duration-300">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <Text as="h4" size="xl" weight="semibold" variant="primary" className="mb-3">
                      RICE Prioritization
                    </Text>
                    <Text as="p" variant="secondary" className="mb-4">
                      Intelligent feature prioritization using AI-enhanced RICE scoring methodology
                    </Text>
                    <Button variant="success" width="full" className="shadow-md hover:shadow-lg hover:scale-105">
                      Try RICE Calculator
                    </Button>
                  </Card>
                </Grid.Item>

                {/* AI Workbench */}
                <Grid.Item xs={12} md={4}>
                  <Card variant="glass-subtle" padding="md" hoverable className="h-full" data-testid="feature-card">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-700 rounded-lg flex items-center justify-center mb-4 shadow-md transition-colors duration-300">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <Text as="h4" size="xl" weight="semibold" variant="primary" className="mb-3">
                      AI Workbench
                    </Text>
                    <Text as="p" variant="secondary" className="mb-4">
                      Generate PRDs, epics, and user stories with advanced AI assistance
                    </Text>
                    <Button variant="secondary" width="full" className="shadow-md hover:shadow-lg hover:scale-105">
                      Try AI Workbench
                    </Button>
                  </Card>
                </Grid.Item>

                {/* Analytics Dashboard */}
                <Grid.Item xs={12} md={4}>
                  <Card variant="glass-subtle" padding="md" hoverable className="h-full" data-testid="feature-card">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-800 dark:to-amber-700 rounded-lg flex items-center justify-center mb-4 shadow-md transition-colors duration-300">
                      <span className="text-2xl">📊</span>
                    </div>
                    <Text as="h4" size="xl" weight="semibold" variant="primary" className="mb-3">
                      Analytics Dashboard
                    </Text>
                    <Text as="p" variant="secondary" className="mb-4">
                      Track velocity, burndown, and team productivity metrics in real-time
                    </Text>
                    <Button variant="warning" width="full" className="shadow-md hover:shadow-lg hover:scale-105">
                      View Analytics
                    </Button>
                  </Card>
                </Grid.Item>
              </Grid.Container>
            </Container>
          </Section>

          {/* CTA Section */}
          <Section padding="xl" variant="glass">
            <Container size="md" padding="lg">
              <Card variant="glass-strong" padding="xl" className="text-center">
                <Text as="h3" size="4xl" weight="bold" variant="primary" className="mb-4">
                  Ready to Ship 3x Faster?
                </Text>
                <Text as="p" size="xl" variant="secondary" className="mb-8">
                  Join 500+ teams already accelerating their product development with PM33
                </Text>
                <Button variant="primary" width="full" size="lg" className="mb-4">
                  Start Free Trial
                </Button>
                <Text as="small" align="center" variant="muted">
                  ✓ 14-day free trial • ✓ No credit card required • ✓ Setup in 5 minutes
                </Text>
              </Card>
            </Container>
          </Section>
        </main>

        <Section as="footer" variant="bordered" padding="lg" className="mt-20">
          <Container size="xl" padding="md">
            <div className="text-center">
              <Text as="p" variant="secondary">
                © 2025 PM33. Built with love for product teams worldwide.
              </Text>
            </div>
          </Container>
        </Section>
      </PageLayout>
    </>
  )
}