/**
 * Core App Authentication Integration
 * 
 * Handles cookie-based JWT authentication with the PM33 core app.
 * Provides utilities for session detection, user state management,
 * and seamless redirects between the marketing site and core app.
 */

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  tier: 'free' | 'pro' | 'enterprise'
  createdAt: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  error: string | null
}

interface AuthConfig {
  coreAppUrl: string
  cookieName: string
  cookieDomain?: string
  secure?: boolean
}

class CoreAppAuth {
  private config: AuthConfig
  private cache = new Map<string, { data: any; expires: number }>()
  private listeners = new Set<(state: AuthState) => void>()
  private currentState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  }

  constructor(config: AuthConfig) {
    this.config = {
      secure: process.env.NODE_ENV === 'production',
      ...config
    }
  }

  /**
   * Initialize authentication by checking existing session
   */
  async initialize(): Promise<AuthState> {
    try {
      this.updateState({ loading: true, error: null })
      
      const token = this.getAuthToken()
      if (!token) {
        this.updateState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null
        })
        return this.currentState
      }

      // Validate token and get user info
      const user = await this.validateToken(token)
      if (user) {
        this.updateState({
          isAuthenticated: true,
          user,
          loading: false,
          error: null
        })
      } else {
        // Token invalid, clear it
        this.clearAuthToken()
        this.updateState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null
        })
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      this.updateState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      })
    }

    return this.currentState
  }

  /**
   * Get current authentication state
   */
  getState(): AuthState {
    return { ...this.currentState }
  }

  /**
   * Subscribe to authentication state changes
   */
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Check if user is authenticated (fast check)
   */
  isAuthenticated(): boolean {
    return this.currentState.isAuthenticated
  }

  /**
   * Get current user data
   */
  getUser(): User | null {
    return this.currentState.user
  }

  /**
   * Redirect to core app login with return URL
   */
  redirectToLogin(returnUrl?: string): void {
    const currentUrl = returnUrl || window.location.href
    const loginUrl = new URL('/login', this.config.coreAppUrl)
    loginUrl.searchParams.set('return_to', currentUrl)
    window.location.href = loginUrl.toString()
  }

  /**
   * Redirect to core app signup with return URL
   */
  redirectToSignup(returnUrl?: string): void {
    const currentUrl = returnUrl || window.location.href
    const signupUrl = new URL('/signup', this.config.coreAppUrl)
    signupUrl.searchParams.set('return_to', currentUrl)
    window.location.href = signupUrl.toString()
  }

  /**
   * Redirect to core app dashboard
   */
  redirectToDashboard(): void {
    window.location.href = this.config.coreAppUrl
  }

  /**
   * Redirect to specific core app feature
   */
  redirectToFeature(feature: 'analyze' | 'execute' | 'settings'): void {
    window.location.href = `${this.config.coreAppUrl}/${feature}`
  }

  /**
   * Logout user by calling core app logout endpoint
   */
  async logout(): Promise<void> {
    try {
      // Call core app logout endpoint
      await fetch(`${this.config.coreAppUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state regardless of API call success
      this.clearAuthToken()
      this.updateState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      })
    }
  }

  /**
   * Get authentication token from cookies
   */
  private getAuthToken(): string | null {
    if (typeof document === 'undefined') return null
    
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === this.config.cookieName) {
        return decodeURIComponent(value)
      }
    }
    return null
  }

  /**
   * Clear authentication token
   */
  private clearAuthToken(): void {
    if (typeof document === 'undefined') return
    
    const domain = this.config.cookieDomain ? `; domain=${this.config.cookieDomain}` : ''
    document.cookie = `${this.config.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`
  }

  /**
   * Validate token with core app and get user info
   */
  private async validateToken(token: string): Promise<User | null> {
    // Check cache first (valid for 5 minutes)
    const cacheKey = `validate_${token.slice(-10)}`
    const cached = this.cache.get(cacheKey)
    if (cached && cached.expires > Date.now()) {
      return cached.data
    }

    try {
      const response = await fetch(`${this.config.coreAppUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          return null
        }
        throw new Error(`Validation failed: ${response.statusText}`)
      }

      const user = await response.json()
      
      // Cache for 5 minutes
      this.cache.set(cacheKey, {
        data: user,
        expires: Date.now() + 5 * 60 * 1000
      })

      return user
    } catch (error) {
      console.error('Token validation error:', error)
      return null
    }
  }

  /**
   * Update authentication state and notify listeners
   */
  private updateState(updates: Partial<AuthState>): void {
    this.currentState = { ...this.currentState, ...updates }
    this.listeners.forEach(listener => {
      try {
        listener(this.currentState)
      } catch (error) {
        console.error('Auth state listener error:', error)
      }
    })
  }

  /**
   * Check if user has access to specific features
   */
  hasFeatureAccess(feature: 'analyze' | 'execute' | 'advanced_settings'): boolean {
    const user = this.getUser()
    if (!user) return false

    switch (feature) {
      case 'analyze':
        return true // All authenticated users
      case 'execute':
        return user.tier === 'pro' || user.tier === 'enterprise'
      case 'advanced_settings':
        return user.tier === 'enterprise'
      default:
        return false
    }
  }

  /**
   * Get user tier badge info
   */
  getUserTierInfo(): { label: string; color: string; features: string[] } {
    const user = this.getUser()
    if (!user) return { label: 'Guest', color: 'gray', features: [] }

    switch (user.tier) {
      case 'free':
        return {
          label: 'Free',
          color: 'green',
          features: ['Basic Analysis', 'Templates']
        }
      case 'pro':
        return {
          label: 'Pro',
          color: 'blue',
          features: ['Advanced Analysis', 'AI Workbench', 'Priority Support']
        }
      case 'enterprise':
        return {
          label: 'Enterprise',
          color: 'purple',
          features: ['All Features', 'Custom Integration', 'Dedicated Support']
        }
      default:
        return { label: 'Unknown', color: 'gray', features: [] }
    }
  }
}

// Create singleton instance
const coreAppAuth = new CoreAppAuth({
  coreAppUrl: process.env.NEXT_PUBLIC_CORE_APP_URL || 'http://localhost:3000',
  cookieName: 'pm33_auth_token',
  cookieDomain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN
})

export { coreAppAuth, type User, type AuthState, type AuthConfig }
export default coreAppAuth