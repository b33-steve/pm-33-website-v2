// import { loadStripe } from '@stripe/stripe-js' // TODO: Install stripe-js package
import { api } from './api'
import { analytics } from './analytics'

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)
const stripePromise = Promise.resolve(null) as any // Mock for build

interface PricingTier {
  id: string
  name: string
  price: number
  tokens: number
  features: string[]
  stripe_price_id: string
  popular?: boolean
}

interface User {
  id: string
  email: string
  name?: string
  tier: string
}

interface SubscriptionDetails {
  tier: string
  status: 'active' | 'trial' | 'cancelled' | 'past_due'
  next_billing_date: string
  amount: number
  currency: string
}

// PM33 Pricing Tiers
export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    tokens: 5,
    features: [
      'Velocity Calculator',
      '5 AI Operations/month',
      'Basic Templates',
      'Community Access'
    ],
    stripe_price_id: '', // Free tier doesn't need Stripe
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    tokens: 100,
    features: [
      'Everything in Free',
      '100 AI Operations/month',
      'Premium Templates',
      'Strategic Analysis Tool',
      'Email Support'
    ],
    stripe_price_id: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || '',
  },
  {
    id: 'team',
    name: 'Team',
    price: 149,
    tokens: 500,
    features: [
      'Everything in Starter',
      '500 AI Operations/month',
      'Team Collaboration',
      'Custom Templates',
      'Priority Support',
      'Velocity Reporting'
    ],
    stripe_price_id: process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID || '',
    popular: true
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 299,
    tokens: 1500,
    features: [
      'Everything in Team',
      '1,500 AI Operations/month',
      'Advanced Analytics',
      'Custom Integrations',
      'Dedicated Success Manager'
    ],
    stripe_price_id: process.env.NEXT_PUBLIC_STRIPE_SCALE_PRICE_ID || '',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 0, // Custom pricing
    tokens: -1, // Unlimited
    features: [
      'Everything in Scale',
      'Unlimited AI Operations',
      'Custom Development',
      'On-premise Deployment',
      'SLA & Premium Support'
    ],
    stripe_price_id: '', // Custom pricing
  }
]

class PaymentService {
  async createCheckoutSession(tier: PricingTier, user?: User) {
    try {
      if (!tier.stripe_price_id) {
        throw new Error('This tier does not support online checkout')
      }

      const response = await api.post('/api/stripe/create-session', {
        price_id: tier.stripe_price_id,
        success_url: `${window.location.origin}/welcome?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/pricing`,
        metadata: {
          user_id: user?.id || 'anonymous',
          tier: tier.name
        }
      })

      const { sessionId } = response as { sessionId: string }

      // Track checkout initiated
      analytics.track('Checkout Started' as any, {
        tier: tier.name,
        price: tier.price,
        source: 'pricing_page'
      })

      // Redirect to Stripe
      const stripe = await stripePromise
      const { error } = await stripe!.redirectToCheckout({ sessionId })

      if (error) {
        throw new Error(error.message)
      }

    } catch (error) {
      console.error('Checkout session error:', error)
      throw error
    }
  }

  async updateSubscription(newTier: PricingTier) {
    try {
      if (!newTier.stripe_price_id) {
        throw new Error('This tier does not support subscription updates')
      }

      const response = await api.post('/api/stripe/update-subscription', {
        price_id: newTier.stripe_price_id
      })

      // Track subscription change
      analytics.track('Subscription Updated' as any, {
        new_tier: newTier.name,
        new_price: newTier.price
      })

      return response

    } catch (error) {
      console.error('Subscription update error:', error)
      throw error
    }
  }

  async cancelSubscription() {
    try {
      const response = await api.post('/api/stripe/cancel-subscription')

      // Track cancellation
      analytics.track('Subscription Cancelled' as any, {
        timestamp: new Date().toISOString()
      })

      return response

    } catch (error) {
      console.error('Subscription cancellation error:', error)
      throw error
    }
  }

  async getSubscriptionDetails(): Promise<SubscriptionDetails | null> {
    try {
      const response = await api.get<SubscriptionDetails>('/api/billing/subscription')
      return response
    } catch (error) {
      console.error('Get subscription error:', error)
      return null
    }
  }

  async getUsage() {
    try {
      const response = await api.get('/api/user/usage')
      return response
    } catch (error) {
      console.error('Get usage error:', error)
      throw error
    }
  }

  // Helper to get tier by ID
  getTierById(tierId: string): PricingTier | undefined {
    return PRICING_TIERS.find(tier => tier.id === tierId)
  }

  // Helper to get tier by Stripe price ID
  getTierByPriceId(priceId: string): PricingTier | undefined {
    return PRICING_TIERS.find(tier => tier.stripe_price_id === priceId)
  }

  // Helper to format price
  formatPrice(price: number, currency: string = 'USD'): string {
    if (price === 0) return 'Free'

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0
    }).format(price)
  }

  // Check if user can upgrade/downgrade
  canChangeTo(currentTier: string, targetTier: string): boolean {
    const currentIndex = PRICING_TIERS.findIndex(t => t.id === currentTier)
    const targetIndex = PRICING_TIERS.findIndex(t => t.id === targetTier)

    // Can't change to same tier
    if (currentIndex === targetIndex) return false

    // Can't change to/from enterprise via self-service
    if (currentTier === 'enterprise' || targetTier === 'enterprise') return false

    // Can change between any other tiers
    return currentIndex !== -1 && targetIndex !== -1
  }

  // Calculate savings for annual billing
  calculateAnnualSavings(monthlyPrice: number): number {
    const annualDiscount = 0.2 // 20% discount for annual
    const annualPrice = monthlyPrice * 12 * (1 - annualDiscount)
    const monthlySavings = (monthlyPrice * 12) - annualPrice
    return monthlySavings
  }
}

export const payment = new PaymentService()
export type { PricingTier, SubscriptionDetails }