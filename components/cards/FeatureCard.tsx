'use client'

import { useState, useEffect, useRef } from 'react'
import { Button, Text, Card } from '@/components/ui'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

interface FeatureCardProps {
  title: string
  description: string
  icon: string
  iconBgGradient: string
  buttonVariant: 'success' | 'secondary' | 'warning' | 'error' | 'primary'
  buttonText: string
  index: number
}

export function FeatureCard({
  title,
  description,
  icon,
  iconBgGradient,
  buttonVariant,
  buttonText,
  index
}: FeatureCardProps) {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true
  })

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isVisible) {
      // Stagger the animation based on index
      const timer = setTimeout(() => {
        setIsLoaded(true)
      }, index * 50)
      return () => clearTimeout(timer)
    }
  }, [isVisible, index])

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ${
        isLoaded
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-10 scale-95'
      }`}
    >
      <Card variant="glass-subtle" padding="md" hoverable className="h-full" data-testid="feature-card">
        <div className={`w-12 h-12 ${iconBgGradient} rounded-lg flex items-center justify-center mb-4 shadow-md transition-all duration-300 hover:scale-110`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <Text as="h4" size="xl" weight="semibold" variant="primary" className="mb-3">
          {title}
        </Text>
        <Text as="p" variant="secondary" className="mb-4">
          {description}
        </Text>
        <Button variant={buttonVariant} width="full" className="shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          {buttonText}
        </Button>
      </Card>
    </div>
  )
}