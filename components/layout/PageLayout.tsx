'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface PageLayoutProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'centered' | 'wide' | 'full'
  background?: 'default' | 'gradient' | 'glass' | 'solid'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export function PageLayout({
  children,
  className,
  variant = 'default',
  background = 'default',
  padding = 'md',
  ...props
}: PageLayoutProps) {
  // Background variants
  const backgroundClasses = {
    default: 'bg-white dark:bg-gray-900 transition-colors duration-300',
    gradient: 'bg-gradient-to-br from-sky-50 via-purple-50 to-sky-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300',
    glass: 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm transition-colors duration-300',
    solid: 'bg-gray-50 dark:bg-gray-800 transition-colors duration-300'
  }

  // Layout variants
  const variantClasses = {
    default: 'min-h-screen',
    centered: 'min-h-screen flex flex-col items-center justify-center',
    wide: 'min-h-screen w-full',
    full: 'h-screen w-screen overflow-hidden'
  }

  // Padding variants
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  }

  const classes = cn(
    'relative',
    backgroundClasses[background],
    variantClasses[variant],
    paddingClasses[padding],
    className
  )

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}