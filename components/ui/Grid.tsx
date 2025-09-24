'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface GridContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'center' | 'end' | 'stretch'
  responsive?: boolean
  children: React.ReactNode
  'aria-label'?: string
}

const GridContainer = forwardRef<HTMLDivElement, GridContainerProps>(({
  cols = 12,
  gap = 'md',
  justify = 'start',
  align = 'stretch',
  responsive = true,
  className,
  children,
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  // Column classes with responsive design
  const colClasses: Record<number, string> = responsive ? {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
    12: "grid-cols-12"
  } : {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    12: "grid-cols-12"
  }

  // Gap classes with responsive design
  const gapClasses: Record<string, string> = {
    none: "gap-0",
    sm: "gap-2 md:gap-3",
    md: "gap-4 md:gap-6",
    lg: "gap-6 md:gap-8",
    xl: "gap-8 md:gap-12",
    '2xl': "gap-12 md:gap-16"
  }

  // Justify classes
  const justifyClasses: Record<string, string> = {
    start: "justify-items-start",
    center: "justify-items-center",
    end: "justify-items-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly"
  }

  // Align classes
  const alignClasses: Record<string, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch"
  }

  // Combine classes
  const combinedClasses = cn(
    "grid",
    colClasses[cols],
    gapClasses[gap],
    justifyClasses[justify],
    alignClasses[align],
    className
  )

  return (
    <div
      ref={ref}
      className={combinedClasses}
      aria-label={ariaLabel || "Grid container"}
      role="grid"
      {...props}
    >
      {children}
    </div>
  )
})

GridContainer.displayName = 'GridContainer'

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  span?: number
  offset?: number
  children: React.ReactNode
}

const GridItem = forwardRef<HTMLDivElement, GridItemProps>(({
  xs,
  sm,
  md,
  lg,
  xl,
  span,
  offset,
  className,
  children,
  ...props
}, ref) => {
  // Generate responsive column span classes
  const getColSpanClass = (size: number | undefined, breakpoint: string = '') => {
    if (!size) return ''
    const prefix = breakpoint ? `${breakpoint}:` : ''
    return `${prefix}col-span-${size}`
  }

  // Generate offset classes
  const getOffsetClass = (offset: number | undefined) => {
    if (!offset) return ''
    return `col-start-${offset + 1}`
  }

  // Combine responsive classes
  const responsiveClasses = cn(
    span && getColSpanClass(span),
    xs && getColSpanClass(xs),
    sm && getColSpanClass(sm, 'sm'),
    md && getColSpanClass(md, 'md'),
    lg && getColSpanClass(lg, 'lg'),
    xl && getColSpanClass(xl, 'xl'),
    offset && getOffsetClass(offset)
  )

  return (
    <div
      ref={ref}
      className={cn(responsiveClasses, className)}
      role="gridcell"
      {...props}
    >
      {children}
    </div>
  )
})

GridItem.displayName = 'GridItem'

// Compound component pattern
const Grid = {
  Container: GridContainer,
  Item: GridItem
}

export { Grid, GridContainer, GridItem }