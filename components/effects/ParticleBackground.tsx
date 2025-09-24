'use client'

import { useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { getPM33Color } from '@/lib/styles/pm33-theme-utils'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

interface ParticleBackgroundProps {
  particleCount?: number
  className?: string
  speed?: number
  colors?: string[]
}

export function ParticleBackground({
  particleCount = 50,
  className = '',
  speed = 0.5,
  colors = ['primary', 'secondary', 'accent']
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number>()
  const particles = useRef<Particle[]>([])

  // Generate particles with theme-safe colors
  const generateParticles = useMemo(() => {
    return (width: number, height: number) => {
      const newParticles: Particle[] = []

      for (let i = 0; i < particleCount; i++) {
        const colorIndex = Math.floor(Math.random() * colors.length)
        const colorName = colors[colorIndex]

        newParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * speed,
          speedY: (Math.random() - 0.5) * speed,
          opacity: Math.random() * 0.5 + 0.1,
          color: colorName
        })
      }

      return newParticles
    }
  }, [particleCount, speed, colors])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

      // Regenerate particles on resize
      particles.current = generateParticles(rect.width, rect.height)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)

      particles.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around screen edges
        const canvasWidth = canvas.width / window.devicePixelRatio
        const canvasHeight = canvas.height / window.devicePixelRatio

        if (particle.x < 0) particle.x = canvasWidth
        if (particle.x > canvasWidth) particle.x = 0
        if (particle.y < 0) particle.y = canvasHeight
        if (particle.y > canvasHeight) particle.y = 0

        // Get theme color safely
        let color = '#3b82f6' // fallback
        try {
          const themeColor = getPM33Color(particle.color)
          if (themeColor && themeColor !== '#000') {
            color = themeColor
          }
        } catch (error) {
          console.warn('Theme color fallback used for particle:', particle.color)
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `${color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`
        ctx.fill()

        // Draw connections to nearby particles
        particles.current.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `${color}${Math.floor((0.1 * (1 - distance / 100)) * 255).toString(16).padStart(2, '0')}`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [generateParticles])

  return (
    <motion.div
      className={`absolute inset-0 overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ zIndex: 0 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'transparent',
          filter: 'blur(0.5px)'
        }}
      />

      {/* Optional gradient overlay for better text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.05) 100%)'
        }}
      />
    </motion.div>
  )
}

// Memoized version for performance
export const MemoizedParticleBackground = motion(ParticleBackground)