/**
 * Authentication Hooks for PM33 Core App Integration
 * 
 * Provides React hooks for managing authentication state,
 * user data, and authentication actions with the core app.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import coreAppAuth, { type AuthState, type User } from '../auth/core-app-auth'

/**
 * Main authentication hook
 * Provides complete authentication state and actions
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>(coreAppAuth.getState())
  const initializedRef = useRef(false)

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = coreAppAuth.subscribe(setState)
    return unsubscribe
  }, [])

  // Initialize auth on first mount
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      coreAppAuth.initialize()
    }
  }, [])

  // Actions
  const login = useCallback((returnUrl?: string) => {
    coreAppAuth.redirectToLogin(returnUrl)
  }, [])

  const signup = useCallback((returnUrl?: string) => {
    coreAppAuth.redirectToSignup(returnUrl)
  }, [])

  const logout = useCallback(async () => {
    await coreAppAuth.logout()
  }, [])

  const goToDashboard = useCallback(() => {
    coreAppAuth.redirectToDashboard()
  }, [])

  const goToFeature = useCallback((feature: 'analyze' | 'execute' | 'settings') => {
    coreAppAuth.redirectToFeature(feature)
  }, [])

  const hasFeatureAccess = useCallback((feature: 'analyze' | 'execute' | 'advanced_settings') => {
    return coreAppAuth.hasFeatureAccess(feature)
  }, [])

  const getUserTierInfo = useCallback(() => {
    return coreAppAuth.getUserTierInfo()
  }, [])

  return {
    // State
    ...state,
    
    // Actions
    login,
    signup,
    logout,
    goToDashboard,
    goToFeature,
    
    // Utilities
    hasFeatureAccess,
    getUserTierInfo
  }
}

/**
 * Simplified hook for just user data
 * Useful when you only need user information
 */
export function useUser() {
  const { user, loading, error, isAuthenticated } = useAuth()
  
  return {
    user,
    loading,
    error,
    isAuthenticated
  }
}

/**
 * Hook for authentication actions only
 * Useful for components that only need to trigger auth actions
 */
export function useAuthActions() {
  const { login, signup, logout, goToDashboard, goToFeature } = useAuth()
  
  return {
    login,
    signup,
    logout,
    goToDashboard,
    goToFeature
  }
}

/**
 * Hook for checking feature access
 * Returns both the check function and current user tier info
 */
export function useFeatureAccess() {
  const { hasFeatureAccess, getUserTierInfo, user } = useAuth()
  
  return {
    hasFeatureAccess,
    getUserTierInfo,
    userTier: user?.tier || null
  }
}

/**
 * Hook that redirects to login if not authenticated
 * Useful for protected pages/components
 */
export function useRequireAuth(redirectTo?: string) {
  const { isAuthenticated, loading, login } = useAuth()
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      login(redirectTo)
    }
  }, [isAuthenticated, loading, login, redirectTo])
  
  return {
    isAuthenticated,
    loading
  }
}

/**
 * Hook for handling authentication state with local storage persistence
 * Keeps track of intended actions after authentication
 */
export function useAuthIntent() {
  const [intent, setIntent] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()
  
  // Load intent from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedIntent = localStorage.getItem('pm33_auth_intent')
      if (savedIntent) {
        setIntent(savedIntent)
      }
    }
  }, [])
  
  // Clear intent when authenticated
  useEffect(() => {
    if (isAuthenticated && intent) {
      localStorage.removeItem('pm33_auth_intent')
      setIntent(null)
    }
  }, [isAuthenticated, intent])
  
  const saveIntent = useCallback((intentAction: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pm33_auth_intent', intentAction)
      setIntent(intentAction)
    }
  }, [])
  
  const clearIntent = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pm33_auth_intent')
      setIntent(null)
    }
  }, [])
  
  return {
    intent,
    saveIntent,
    clearIntent
  }
}

/**
 * Hook for authentication-aware navigation
 * Provides smart routing based on auth state
 */
export function useAuthNavigation() {
  const { isAuthenticated, loading, login, goToDashboard, goToFeature } = useAuth()
  
  const navigateToFeature = useCallback((feature: 'analyze' | 'execute' | 'settings') => {
    if (isAuthenticated) {
      goToFeature(feature)
    } else {
      // Save intent and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.setItem('pm33_auth_intent', `feature:${feature}`)
      }
      login()
    }
  }, [isAuthenticated, goToFeature, login])
  
  const navigateToDashboard = useCallback(() => {
    if (isAuthenticated) {
      goToDashboard()
    } else {
      // Save intent and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.setItem('pm33_auth_intent', 'dashboard')
      }
      login()
    }
  }, [isAuthenticated, goToDashboard, login])
  
  return {
    navigateToFeature,
    navigateToDashboard,
    isAuthenticated,
    loading
  }
}