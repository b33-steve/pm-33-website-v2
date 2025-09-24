'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'glass-subtle' | 'glass-strong' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hoverable?: boolean
  children: React.ReactNode
  'aria-label'?: string
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className,
  children,
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  // Base classes
  const baseClasses = "transition-all duration-300 rounded-lg"

  // Variant classes - theme-aware
  const variantClasses: Record<string, string> = {
    default: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md transition-colors duration-300",
    glass: "glass-effect",
    'glass-subtle': "glass-subtle",
    'glass-strong': "glass-strong",
    elevated: "bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300",
    outlined: "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-sm transition-colors duration-300"
  }

  // Padding classes
  const paddingClasses: Record<string, string> = {
    none: "",
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
    xl: "p-12"
  }

  // Hover classes
  const hoverClasses = hoverable ? "hover:shadow-xl hover:scale-105 cursor-pointer" : ""

  // Combine classes
  const combinedClasses = cn(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    hoverClasses,
    className
  )

  return (
    <div
      ref={ref}
      className={combinedClasses}
      aria-label={ariaLabel}
      role="region"
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

// Card Header component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("pb-4 border-b border-gray-200 dark:border-gray-700 mb-4 transition-colors duration-300", className)}
      {...props}
    >
      {children}
    </div>
  )
})

CardHeader.displayName = 'CardHeader'

// Card Content component
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("", className)}
      {...props}
    >
      {children}
    </div>
  )
})

CardContent.displayName = 'CardContent'

// Card Footer component
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("pt-4 border-t border-gray-200 dark:border-gray-700 mt-4 transition-colors duration-300", className)}
      {...props}
    >
      {children}
    </div>
  )
})

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardContent, CardFooter }