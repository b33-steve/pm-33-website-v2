'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  center?: boolean
  as?: keyof JSX.IntrinsicElements
}

export function Container({
  children,
  className,
  size = 'xl',
  padding = 'md',
  center = true,
  as: Component = 'div',
  ...props
}: ContainerProps) {
  // Size classes with responsive design
  const sizeClasses = {
    sm: 'max-w-2xl',       // 672px
    md: 'max-w-4xl',       // 896px
    lg: 'max-w-6xl',       // 1152px
    xl: 'max-w-7xl',       // 1280px
    '2xl': 'max-w-8xl',    // 1536px
    full: 'w-full'
  }

  // Padding classes (responsive)
  const paddingClasses = {
    none: '',
    sm: 'px-4',                    // 16px
    md: 'px-4 sm:px-6 lg:px-8',    // 16px -> 24px -> 32px
    lg: 'px-6 sm:px-8 lg:px-12',   // 24px -> 32px -> 48px
    xl: 'px-8 sm:px-12 lg:px-16'   // 32px -> 48px -> 64px
  }

  const classes = cn(
    sizeClasses[size],
    paddingClasses[padding],
    center && 'mx-auto',
    className
  )

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}