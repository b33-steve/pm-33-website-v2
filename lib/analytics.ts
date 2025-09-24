import posthog from 'posthog-js'

interface AnalyticsEvent {
  // Conversion Events
  'Calculator Started': { source: string }
  'Calculator Completed': {
    velocity_improvement: number
    monthly_savings: number
    team_size: number
  }
  'Email Captured': {
    source: string
    incentive?: string
  }
  'Signup Started': { source: string }
  'User Signed Up': {
    source: string
    tier: string
  }
  'Trial Started': {
    tier: string
    source: string
  }
  'Subscription Created': {
    tier: string
    monthly_value: number
  }

  // Engagement Events
  'Template Downloaded': {
    template_id: string
    category: string
  }
  'Feature Explored': {
    feature: string
    duration: number
  }
  'Demo Watched': {
    completion: number
  }
  'Report Emailed': {
    email: string
    velocity_score: number
  }

  // Funnel Events
  'Funnel Started': {
    funnel: string
  }
  'Funnel Completed': {
    funnel: string
  }
}

class Analytics {
  private initialized = false

  constructor() {
    this.initialize()
  }

  private initialize() {
    if (typeof window !== 'undefined' && !this.initialized) {
      const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
      const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

      if (posthogKey) {
        posthog.init(posthogKey, {
          api_host: posthogHost || 'https://app.posthog.com',
          // Respect user privacy
          respect_dnt: true,
          // Capture pageviews
          capture_pageview: true,
          // Disable autocapture in production for performance
          autocapture: process.env.NODE_ENV !== 'production'
        })
        this.initialized = true
      } else {
        console.warn('PostHog key not found. Analytics disabled.')
      }
    }
  }

  track<K extends keyof AnalyticsEvent>(
    event: K,
    properties?: AnalyticsEvent[K]
  ) {
    if (typeof window !== 'undefined' && this.initialized) {
      posthog.capture(event, properties)
    } else if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event, properties)
    }
  }

  identify(userId: string, traits?: any) {
    if (typeof window !== 'undefined' && this.initialized) {
      posthog.identify(userId, traits)
    }
  }

  // Page tracking
  page(pageName?: string, properties?: Record<string, any>) {
    if (typeof window !== 'undefined' && this.initialized) {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
        page_name: pageName,
        ...properties
      })
    }
  }

  // Conversion tracking helpers
  startFunnel(funnelName: string, source?: string) {
    this.track('Funnel Started', { funnel: funnelName })
  }

  completeFunnel(funnelName: string) {
    this.track('Funnel Completed', { funnel: funnelName })
  }

  // Calculator specific tracking
  startCalculator(source: string = 'unknown') {
    this.track('Calculator Started', { source })
    this.startFunnel('velocity_calculator', source)
  }

  completeCalculator(data: {
    velocity_improvement: number
    monthly_savings: number
    team_size: number
  }) {
    this.track('Calculator Completed', data)
    this.completeFunnel('velocity_calculator')
  }

  captureEmail(source: string, incentive?: string) {
    this.track('Email Captured', { source, incentive })
  }

  // User lifecycle tracking
  trackSignupStart(source: string) {
    this.track('Signup Started', { source })
    this.startFunnel('user_signup', source)
  }

  trackSignupComplete(source: string, tier: string) {
    this.track('User Signed Up', { source, tier })
    this.completeFunnel('user_signup')
  }

  trackSubscription(tier: string, monthlyValue: number) {
    this.track('Subscription Created', { tier, monthly_value: monthlyValue })
  }

  // Content engagement
  trackTemplateDownload(templateId: string, category: string) {
    this.track('Template Downloaded', { template_id: templateId, category })
  }

  trackFeatureExploration(feature: string, startTime: number) {
    const duration = Date.now() - startTime
    this.track('Feature Explored', { feature, duration })
  }

  trackDemoCompletion(completion: number) {
    this.track('Demo Watched', { completion })
  }

  // Set user properties
  setUserProperties(properties: Record<string, any>) {
    if (typeof window !== 'undefined' && this.initialized) {
      posthog.people.set(properties)
    }
  }

  // Group analytics (for companies/teams)
  group(groupType: string, groupKey: string, properties?: Record<string, any>) {
    if (typeof window !== 'undefined' && this.initialized) {
      posthog.group(groupType, groupKey, properties)
    }
  }

  // Feature flags
  isFeatureEnabled(flagKey: string): boolean {
    if (typeof window !== 'undefined' && this.initialized) {
      return posthog.isFeatureEnabled(flagKey) || false
    }
    return false
  }

  // A/B testing
  getFeatureFlag(flagKey: string): string | boolean {
    if (typeof window !== 'undefined' && this.initialized) {
      return posthog.getFeatureFlag(flagKey) || false
    }
    return false
  }

  // Opt out of tracking
  optOut() {
    if (typeof window !== 'undefined' && this.initialized) {
      posthog.opt_out_capturing()
    }
  }

  // Opt in to tracking
  optIn() {
    if (typeof window !== 'undefined' && this.initialized) {
      posthog.opt_in_capturing()
    }
  }

  // Reset analytics (for user logout)
  reset() {
    if (typeof window !== 'undefined' && this.initialized) {
      posthog.reset()
    }
  }
}

export const analytics = new Analytics()
export type { AnalyticsEvent }