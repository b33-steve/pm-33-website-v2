'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'small' | 'strong' | 'em'
  variant?: 'primary' | 'secondary' | 'muted' | 'inverse' | 'accent' | 'success' | 'warning' | 'error'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  align?: 'left' | 'center' | 'right' | 'justify'
  children: React.ReactNode
}

const Text = forwardRef<HTMLElement, TextProps>(({
  as = 'p',
  variant = 'primary',
  size = 'base',
  weight = 'normal',
  align = 'left',
  className,
  children,
  ...props
}, ref) => {
  // Base classes
  const baseClasses = "transition-colors duration-200"

  // Variant classes for colors - theme-aware
  const variantClasses: Record<string, string> = {
    primary: "text-gray-900 dark:text-white",
    secondary: "text-gray-700 dark:text-gray-300",
    muted: "text-gray-600 dark:text-gray-400",
    inverse: "text-white dark:text-gray-900",
    accent: "text-blue-600 dark:text-blue-400",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    error: "text-red-600 dark:text-red-400"
  }

  // Size classes
  const sizeClasses: Record<string, string> = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    '2xl': "text-2xl",
    '3xl': "text-3xl",
    '4xl': "text-4xl",
    '5xl': "text-5xl",
    '6xl': "text-6xl"
  }

  // Weight classes
  const weightClasses: Record<string, string> = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold"
  }

  // Alignment classes
  const alignClasses: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify"
  }

  // Default sizes for heading elements
  const headingDefaults: Record<string, { size: string; weight: string }> = {
    h1: { size: '4xl', weight: 'bold' },
    h2: { size: '3xl', weight: 'bold' },
    h3: { size: '2xl', weight: 'semibold' },
    h4: { size: 'xl', weight: 'semibold' },
    h5: { size: 'lg', weight: 'medium' },
    h6: { size: 'base', weight: 'medium' }
  }

  // Determine final size and weight
  const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(as)
  const finalSize = isHeading && headingDefaults[as] ? headingDefaults[as].size : size
  const finalWeight = isHeading && headingDefaults[as] ? headingDefaults[as].weight : weight

  // Combine classes
  const combinedClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[finalSize as keyof typeof sizeClasses],
    weightClasses[finalWeight as keyof typeof weightClasses],
    alignClasses[align],
    className
  )

  // Get the appropriate aria-level for headings
  const getAriaLevel = (): number | undefined => {
    if (props['aria-level']) return props['aria-level']
    if (isHeading) {
      return parseInt(as.replace('h', ''))
    }
    return undefined
  }

  // Create the element with proper accessibility attributes
  const Element = as

  // Build props based on element type
  const ariaLevel = getAriaLevel()
  const role = props.role || (isHeading ? 'heading' : undefined)

  // Use React.createElement to avoid type issues
  return React.createElement(
    Element,
    {
      ...props,
      ref,
      className: combinedClasses,
      ...(ariaLevel !== undefined && { 'aria-level': ariaLevel }),
      ...(role && { role })
    },
    children
  )
})

Text.displayName = 'Text'

export { Text }