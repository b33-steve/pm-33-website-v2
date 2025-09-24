/**
 * Core PM33 App Integration Layer
 *
 * This file provides integration utilities for connecting the marketing site
 * with the core PM33 application through cookie-based authentication.
 */

// Core PM33 app configuration
export const CORE_APP_CONFIG = {
  // Core app base URL (update for production)
  baseUrl: process.env.NEXT_PUBLIC_CORE_APP_URL || 'http://localhost:3000',

  // Cookie names used by core app
  cookies: {
    session: 'pm33_session',
    user: 'pm33_user',
    subscription: 'pm33_subscription'
  },

  // Core app routes
  routes: {
    login: '/login',
    signup: '/signup',
    dashboard: '/dashboard',
    billing: '/billing',
    logout: '/logout'
  }
}

/**
 * Check if user is authenticated via core app cookie
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false

  const sessionCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${CORE_APP_CONFIG.cookies.session}=`))

  return !!sessionCookie
}

/**
 * Get user information from core app cookie
 */
export function getUserFromCookie(): any | null {
  if (typeof window === 'undefined') return null

  try {
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${CORE_APP_CONFIG.cookies.user}=`))

    if (!userCookie) return null

    const userData = userCookie.split('=')[1]
    return JSON.parse(decodeURIComponent(userData))
  } catch (error) {
    console.error('Error parsing user cookie:', error)
    return null
  }
}

/**
 * Get subscription information from core app cookie
 */
export function getSubscriptionFromCookie(): any | null {
  if (typeof window === 'undefined') return null

  try {
    const subCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${CORE_APP_CONFIG.cookies.subscription}=`))

    if (!subCookie) return null

    const subData = subCookie.split('=')[1]
    return JSON.parse(decodeURIComponent(subData))
  } catch (error) {
    console.error('Error parsing subscription cookie:', error)
    return null
  }
}

/**
 * Redirect to core app with return URL
 */
export function redirectToCore(path: string = '', returnUrl?: string): void {
  const baseUrl = CORE_APP_CONFIG.baseUrl
  const targetPath = path.startsWith('/') ? path : `/${path}`

  let redirectUrl = `${baseUrl}${targetPath}`

  if (returnUrl) {
    const params = new URLSearchParams({ return_url: returnUrl })
    redirectUrl += `?${params.toString()}`
  }

  window.location.href = redirectUrl
}

/**
 * Redirect to login with current page as return URL
 */
export function redirectToLogin(): void {
  const returnUrl = window.location.href
  redirectToCore(CORE_APP_CONFIG.routes.login, returnUrl)
}

/**
 * Redirect to signup with current page as return URL
 */
export function redirectToSignup(): void {
  const returnUrl = window.location.href
  redirectToCore(CORE_APP_CONFIG.routes.signup, returnUrl)
}

/**
 * Redirect to dashboard
 */
export function redirectToDashboard(): void {
  redirectToCore(CORE_APP_CONFIG.routes.dashboard)
}

/**
 * Redirect to billing
 */
export function redirectToBilling(): void {
  redirectToCore(CORE_APP_CONFIG.routes.billing)
}

/**
 * Logout and redirect to marketing site
 */
export function logout(): void {
  redirectToCore(CORE_APP_CONFIG.routes.logout, window.location.origin)
}

/**
 * Marketing site authentication hook
 */
export function useAuth() {
  const [user, setUser] = React.useState<any | null>(null)
  const [subscription, setSubscription] = React.useState<any | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const checkAuth = () => {
      const userData = getUserFromCookie()
      const subData = getSubscriptionFromCookie()

      setUser(userData)
      setSubscription(subData)
      setIsLoading(false)
    }

    checkAuth()

    // Check auth status every 30 seconds
    const interval = setInterval(checkAuth, 30000)
    return () => clearInterval(interval)
  }, [])

  return {
    user,
    subscription,
    isLoading,
    isAuthenticated: !!user,
    redirectToLogin,
    redirectToSignup,
    redirectToDashboard,
    redirectToBilling,
    logout
  }
}

// Import React for the hook
import React from 'react'