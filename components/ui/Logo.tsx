'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface LogoProps {
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function Logo({
  width = 200,
  height = 60,
  className = '',
  priority = false
}: LogoProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  // Detect theme from document attribute (same as ThemeToggle)
  useEffect(() => {
    setMounted(true)

    const detectTheme = () => {
      const root = document.documentElement
      const dataTheme = root.getAttribute('data-theme')
      const hasClass = root.classList.contains('dark')

      if (dataTheme === 'dark' || hasClass) {
        setTheme('dark')
      } else {
        setTheme('light')
      }
    }

    // Initial detection
    detectTheme()

    // Watch for theme changes
    const observer = new MutationObserver(detectTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    })

    return () => observer.disconnect()
  }, [])

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        className={`animate-pulse bg-gray-300 rounded ${className}`}
        style={{ width, height }}
      />
    )
  }

  // Use dark logo for dark theme, light logo for light theme
  const logoSrc = theme === 'dark' ? '/pm33-logo-dark.png' : '/pm33-logo-light.png'

  return (
    <Image
      src={logoSrc}
      alt="PM33 Logo"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  )
}