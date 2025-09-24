/**
 * Authentication Middleware and Route Protection
 *
 * Provides components and utilities for protecting routes
 * and handling authentication state in the application.
 */

import React, { ReactNode, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
  requireTier?: 'free' | 'pro' | 'enterprise'
  requireFeature?: 'analyze' | 'execute' | 'advanced_settings'
  showLoader?: boolean
}

/**
 * Route protection component that redirects unauthenticated users
 */
export function AuthGuard({
  children,
  fallback,
  redirectTo,
  requireTier,
  requireFeature,
  showLoader = true
}: AuthGuardProps) {
  const { isAuthenticated, loading, user, login, hasFeatureAccess } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      login(redirectTo)
    }
  }, [isAuthenticated, loading, login, redirectTo])

  // Still loading authentication state
  if (loading) {
    if (!showLoader) return null
    return fallback || <AuthLoadingSpinner />
  }

  // Not authenticated
  if (!isAuthenticated) {
    return fallback || <AuthLoadingSpinner />
  }

  // Check tier requirement
  if (requireTier && user?.tier !== requireTier) {
    const tierHierarchy: { [key: string]: number } = { free: 0, pro: 1, enterprise: 2 }
    const userTierLevel = tierHierarchy[user?.tier || 'free']
    const requiredTierLevel = tierHierarchy[requireTier]

    if (userTierLevel < requiredTierLevel) {
      return <UpgradeRequired requiredTier={requireTier} userTier={user?.tier || 'free'} />
    }
  }

  // Check feature requirement
  if (requireFeature && !hasFeatureAccess(requireFeature)) {
    return <FeatureAccessRequired feature={requireFeature} userTier={user?.tier || 'free'} />
  }

  return <>{children}</>
}

/**
 * Loading spinner component with clean styling
 */
function AuthLoadingSpinner() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid #f3f4f6',
        borderTop: '3px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{
        color: '#6b7280',
        fontSize: '14px',
        margin: 0
      }}>
        Checking authentication...
      </p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

/**
 * Component shown when user needs to upgrade their tier
 */
function UpgradeRequired({ requiredTier, userTier }: { requiredTier: string; userTier: string }) {
  const { goToFeature } = useAuth()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      padding: '32px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>

      <h3 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#1f2937',
        margin: '0 0 16px 0'
      }}>
        Upgrade Required
      </h3>

      <p style={{
        fontSize: '16px',
        color: '#6b7280',
        margin: '0 0 32px 0',
        maxWidth: '400px',
        lineHeight: '1.6'
      }}>
        This feature requires a {requiredTier} plan. You're currently on the {userTier} plan.
        Upgrade to unlock advanced features and capabilities.
      </p>

      <button
        onClick={() => goToFeature('settings')}
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          border: 'none',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        Upgrade to {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}
      </button>
    </div>
  )
}

/**
 * Component shown when user doesn't have access to a specific feature
 */
function FeatureAccessRequired({ feature, userTier }: { feature: string; userTier: string }) {
  const { goToFeature } = useAuth()

  const featureNames: { [key: string]: string } = {
    analyze: 'Advanced Analytics',
    execute: 'AI Workbench',
    advanced_settings: 'Advanced Settings'
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      padding: '32px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      borderRadius: '12px',
      border: '1px solid #fbbf24'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        background: '#f59e0b',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </div>

      <h3 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#92400e',
        margin: '0 0 16px 0'
      }}>
        Feature Access Required
      </h3>

      <p style={{
        fontSize: '16px',
        color: '#a16207',
        margin: '0 0 32px 0',
        maxWidth: '400px',
        lineHeight: '1.6'
      }}>
        The {featureNames[feature] || feature} feature is not available on your current {userTier} plan.
        Upgrade to access this feature.
      </p>

      <button
        onClick={() => goToFeature('settings')}
        style={{
          background: '#f59e0b',
          border: 'none',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#d97706'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#f59e0b'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        View Upgrade Options
      </button>
    </div>
  )
}

/**
 * Higher-order component for protecting entire pages
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    redirectTo?: string
    requireTier?: 'free' | 'pro' | 'enterprise'
    requireFeature?: 'analyze' | 'execute' | 'advanced_settings'
  }
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}

/**
 * Utility function to check if user should see authenticated content
 */
export function useAuthContent() {
  const { isAuthenticated, loading, user } = useAuth()

  const shouldShowAuth = isAuthenticated && !loading
  const shouldShowAnonymous = !isAuthenticated && !loading
  const shouldShowLoading = loading

  return {
    shouldShowAuth,
    shouldShowAnonymous,
    shouldShowLoading,
    user
  }
}

/**
 * Component that conditionally renders content based on auth state
 */
export function AuthContent({
  authenticated,
  anonymous,
  loading
}: {
  authenticated?: ReactNode
  anonymous?: ReactNode
  loading?: ReactNode
}) {
  const { shouldShowAuth, shouldShowAnonymous, shouldShowLoading } = useAuthContent()

  if (shouldShowLoading && loading) {
    return <>{loading}</>
  }

  if (shouldShowAuth && authenticated) {
    return <>{authenticated}</>
  }

  if (shouldShowAnonymous && anonymous) {
    return <>{anonymous}</>
  }

  return null
}