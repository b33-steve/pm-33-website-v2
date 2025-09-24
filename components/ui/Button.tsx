'use client'

import React, { forwardRef, KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  width?: 'auto' | 'full'
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  children: React.ReactNode
  'aria-label'?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'default',
  size = 'md',
  width = 'auto',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  className,
  children,
  onClick,
  onKeyDown,
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  // Base button classes
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"

  // Variant classes - theme-aware
  const variantClasses: Record<string, string> = {
    default: "bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white focus:ring-gray-500 transition-colors duration-200",
    primary: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white focus:ring-blue-500 shadow-md hover:shadow-lg transition-all duration-200",
    secondary: "bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white focus:ring-purple-500 shadow-md hover:shadow-lg transition-all duration-200",
    success: "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 text-white focus:ring-green-500 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200",
    warning: "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-white focus:ring-yellow-500 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200",
    error: "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white focus:ring-red-500 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-gray-500 transition-colors duration-200",
    outline: "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-gray-500 transition-colors duration-200"
  }

  // Size classes
  const sizeClasses: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-lg"
  }

  // Width classes
  const widthClasses: Record<string, string> = {
    auto: "",
    full: "w-full"
  }

  // Handle keyboard interactions
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (onClick && !disabled && !loading) {
        onClick(event as any)
      }
    }
    onKeyDown?.(event)
  }

  // Handle click with loading state
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && onClick) {
      onClick(event)
    }
  }

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="img"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  // Combine classes
  const combinedClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClasses[width],
    className
  )

  return (
    <button
      ref={ref}
      className={combinedClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-disabled={disabled || loading}
      role="button"
      tabIndex={0}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={loading ? "opacity-0" : ""}>
        {children}
      </span>
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export { Button }