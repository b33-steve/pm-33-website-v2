'use client'

import React, { useState, useEffect } from 'react'
import { Button } from './Button'

export interface ThemeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  size = 'md',
  showLabel = false
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before accessing localStorage
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemTheme

    setTheme(initialTheme)
    applyTheme(initialTheme)
  }, [])

  // Apply theme to document
  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement

    if (newTheme === 'dark') {
      root.setAttribute('data-theme', 'dark')
      root.classList.add('dark')
    } else {
      root.setAttribute('data-theme', 'light')
      root.classList.remove('dark')
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    applyTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={size}
        className={className}
        disabled
        aria-label="Loading theme toggle"
      >
        <span className="w-5 h-5 animate-pulse bg-gray-300 rounded" />
        {showLabel && <span className="ml-2">Theme</span>}
      </Button>
    )
  }

  const SunIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  )

  const MoonIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  )

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={toggleTheme}
      className={className}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      aria-pressed={theme === 'dark'}
      role="switch"
      data-testid="theme-toggle"
    >
      <span className="relative">
        <span
          className={`absolute inset-0 transition-opacity duration-200 ${
            theme === 'light' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <SunIcon />
        </span>
        <span
          className={`absolute inset-0 transition-opacity duration-200 ${
            theme === 'dark' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <MoonIcon />
        </span>
        {/* Placeholder to maintain button size */}
        <span className="invisible">
          <SunIcon />
        </span>
      </span>
      {showLabel && (
        <span className="ml-2 capitalize">
          {theme === 'light' ? 'Light' : 'Dark'}
        </span>
      )}
    </Button>
  )
}

export { ThemeToggle }