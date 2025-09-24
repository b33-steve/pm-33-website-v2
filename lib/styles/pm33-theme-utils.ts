/**
 * PM33 Theme Utilities
 * Provides safe access to theme variables with fallbacks
 */

export const getPM33Color = (color: string, fallback?: string): string => {
  if (typeof window === 'undefined') return fallback || '#000'
  const cssVar = `--pm33-${color}`
  const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar)
  return value || fallback || '#000'
}

export const getPM33TextColor = (variant: 'primary' | 'secondary' | 'muted' | 'inverse'): string => {
  const textColors = {
    primary: 'var(--pm33-text-primary, #1a1a1a)',
    secondary: 'var(--pm33-text-secondary, #4a4a4a)',
    muted: 'var(--pm33-text-muted, #6a6a6a)',
    inverse: 'var(--pm33-text-inverse, #ffffff)'
  }
  return textColors[variant]
}

export const getPM33Background = (variant: string): string => {
  return `var(--pm33-bg-${variant}, transparent)`
}

export const getPM33Shadow = (size: 'sm' | 'md' | 'lg' | 'xl'): string => {
  const shadows = {
    sm: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))',
    md: 'var(--shadow-md, 0 4px 6px rgba(0,0,0,0.1))',
    lg: 'var(--shadow-lg, 0 10px 15px rgba(0,0,0,0.1))',
    xl: 'var(--shadow-xl, 0 20px 25px rgba(0,0,0,0.1))'
  }
  return shadows[size]
}

export const getPM33GlassStyles = () => ({
  background: 'var(--pm33-bg-glass, rgba(255,255,255,0.1))',
  backdropFilter: 'blur(10px)',
  border: '1px solid var(--pm33-border-glass, rgba(255,255,255,0.2))'
})

export const getPM33BorderRadius = (size: 'sm' | 'md' | 'lg' | 'xl') => {
  const radii = {
    sm: 'var(--radius-sm, 4px)',
    md: 'var(--radius-md, 8px)',
    lg: 'var(--radius-lg, 12px)',
    xl: 'var(--radius-xl, 16px)'
  }
  return radii[size]
}

export const getPM33Spacing = (multiplier: number): string => {
  return `calc(var(--spacing-unit, 8px) * ${multiplier})`
}

export const getPM33FontSize = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'): string => {
  const sizes = {
    xs: 'var(--font-xs, 0.75rem)',
    sm: 'var(--font-sm, 0.875rem)',
    md: 'var(--font-md, 1rem)',
    lg: 'var(--font-lg, 1.125rem)',
    xl: 'var(--font-xl, 1.25rem)',
    '2xl': 'var(--font-2xl, 1.5rem)',
    '3xl': 'var(--font-3xl, 1.875rem)'
  }
  return sizes[size]
}

export const getPM33FontFamily = (type: 'sans' | 'mono' | 'serif' = 'sans'): string => {
  const families = {
    sans: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
    mono: 'var(--font-mono, "SF Mono", monospace)',
    serif: 'var(--font-serif, Georgia, serif)'
  }
  return families[type]
}

export const getPM33GradientStyles = (type: 'primary' | 'secondary' | 'accent' = 'primary') => {
  const gradients = {
    primary: 'var(--gradient-primary, linear-gradient(135deg, #667eea 0%, #764ba2 100%))',
    secondary: 'var(--gradient-secondary, linear-gradient(135deg, #f093fb 0%, #f5576c 100%))',
    accent: 'var(--gradient-accent, linear-gradient(135deg, #4facfe 0%, #00f2fe 100%))'
  }
  return {
    background: gradients[type],
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent'
  }
}

export const getPM33ButtonStyles = (variant: string) => {
  const baseStyles = {
    padding: getPM33Spacing(2),
    borderRadius: getPM33BorderRadius('md'),
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  }

  const variantStyles: Record<string, any> = {
    primary: {
      background: 'var(--pm33-primary, #3b82f6)',
      color: 'var(--pm33-text-inverse, #ffffff)',
      boxShadow: getPM33Shadow('md')
    },
    secondary: {
      background: 'var(--pm33-secondary, #64748b)',
      color: 'var(--pm33-text-inverse, #ffffff)',
      boxShadow: getPM33Shadow('sm')
    },
    glass: {
      ...getPM33GlassStyles(),
      color: 'var(--pm33-text-primary, #1a1a1a)'
    }
  }

  return { ...baseStyles, ...(variantStyles[variant] || {}) }
}