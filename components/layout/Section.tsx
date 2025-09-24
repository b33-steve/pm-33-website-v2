'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface SectionProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'gradient' | 'bordered'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  background?: boolean
  as?: keyof JSX.IntrinsicElements
  id?: string
  'aria-label'?: string
}

export function Section({
  children,
  className,
  variant = 'default',
  padding = 'lg',
  margin = 'none',
  background = false,
  as: Component = 'section',
  id,
  'aria-label': ariaLabel,
  ...props
}: SectionProps) {
  // Variant styles
  const variantClasses = {
    default: background
      ? 'bg-white/50 dark:bg-gray-800/50 transition-colors duration-300'
      : '',
    glass: 'backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-xl shadow-lg transition-all duration-300',
    gradient: 'bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-emerald-500/10 rounded-xl',
    bordered: 'border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 transition-colors duration-300'
  }

  // Padding classes (8pt grid system)
  const paddingClasses = {
    none: '',
    sm: 'p-4',      // 16px
    md: 'p-6',      // 24px
    lg: 'py-20',    // 80px vertical, responsive horizontal
    xl: 'py-24',    // 96px vertical, responsive horizontal
    '2xl': 'py-32'  // 128px vertical, responsive horizontal
  }

  // Margin classes
  const marginClasses = {
    none: '',
    sm: 'm-4',
    md: 'm-6',
    lg: 'm-8',
    xl: 'm-12',
    '2xl': 'm-16'
  }

  const classes = cn(
    'relative',
    variantClasses[variant],
    paddingClasses[padding],
    marginClasses[margin],
    className
  )

  return (
    <Component
      className={classes}
      id={id}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </Component>
  )
}