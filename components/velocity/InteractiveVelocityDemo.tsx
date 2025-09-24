'use client'

import { useState, useEffect, useCallback, useRef, useMemo, lazy, Suspense } from 'react'
import {
  getPM33Color,
  getPM33TextColor,
  getPM33Background,
  getPM33Shadow,
  getPM33GlassStyles,
  getPM33BorderRadius,
  getPM33Spacing,
  getPM33GradientStyles
} from '@/lib/styles/pm33-theme-utils'

interface DemoState {
  stage: 'attract' | 'input' | 'processing' | 'results'
  teamSize?: '1-5' | '6-10' | '11-20' | '20+'
  velocity?: number
  bottleneck?: 'planning' | 'alignment' | 'execution' | 'testing'
  results?: VelocityResults
}

interface VelocityResults {
  current: number
  projected: number
  improvement: number
  timeSaved: number
  valueCaptured: number
  roi: number
  primaryRecommendation: string
}

// Email modal will be lazy loaded when needed

export function InteractiveVelocityDemo() {
  const [state, setState] = useState<DemoState>({ stage: 'attract' })
  const [questionIndex, setQuestionIndex] = useState(0)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [attractCycle, setAttractCycle] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [sliderValue, setSliderValue] = useState(5)

  // Refs for performance optimization
  const rafId = useRef<number | null>(null)
  const processingStartTime = useRef<number>(0)
  const attractAnimationRef = useRef<number>(0)

  // Memoized glass styles for better performance
  const glassStyles = useMemo(() => getPM33GlassStyles(), [])
  const shadowStyles = useMemo(() => ({ boxShadow: getPM33Shadow('xl') }), [])

  // Auto-cycle attract state with requestAnimationFrame
  useEffect(() => {
    if (state.stage === 'attract') {
      let lastTime = 0
      const animate = (currentTime: number) => {
        if (currentTime - lastTime >= 3000) {
          setAttractCycle(prev => (prev + 1) % 4)
          lastTime = currentTime
        }
        attractAnimationRef.current = requestAnimationFrame(animate)
      }
      attractAnimationRef.current = requestAnimationFrame(animate)

      return () => {
        if (attractAnimationRef.current) {
          cancelAnimationFrame(attractAnimationRef.current)
        }
      }
    }
  }, [state.stage])

  const calculateVelocity = (inputs: {
    teamSize: string
    velocity: number
    bottleneck: string
  }): VelocityResults => {
    const teamMultipliers = {
      '1-5': 1,
      '6-10': 1.5,
      '11-20': 2,
      '20+': 2.5
    }

    const bottleneckImpacts = {
      'planning': 3.2,
      'alignment': 2.8,
      'execution': 3.5,
      'testing': 2.4
    }

    const teamMultiplier = teamMultipliers[inputs.teamSize as keyof typeof teamMultipliers] || 1
    const bottleneckImpact = bottleneckImpacts[inputs.bottleneck as keyof typeof bottleneckImpacts] || 2.5

    const projected = Math.round(inputs.velocity * bottleneckImpact)
    const timeSaved = Math.round(teamMultiplier * 72)
    const valueCaptured = Math.round(projected * 10000)

    const recommendations = {
      'planning': 'automating PRD generation could save 32 hours/month',
      'alignment': 'stakeholder dashboards could reduce meetings by 60%',
      'execution': 'velocity tracking could identify bottlenecks instantly',
      'testing': 'automated testing pipelines could double release speed'
    }

    return {
      current: inputs.velocity,
      projected,
      improvement: Math.round((projected / inputs.velocity - 1) * 100),
      timeSaved,
      valueCaptured,
      roi: Math.round((valueCaptured / 99) * 100),
      primaryRecommendation: recommendations[inputs.bottleneck as keyof typeof recommendations] || 'PM automation could transform your workflow'
    }
  }

  const handleStartDemo = useCallback(() => {
    setState(prev => ({ ...prev, stage: 'input' }))
    setQuestionIndex(0)
  }, [])

  const handleAnswer = useCallback((field: string, value: any) => {
    setState(prev => ({ ...prev, [field]: value }))

    if (field === 'teamSize') {
      setTimeout(() => setQuestionIndex(1), 500)
    } else if (field === 'velocity') {
      setTimeout(() => setQuestionIndex(2), 500)
    } else if (field === 'bottleneck') {
      processResults()
    }
  }, [])

  const processResults = useCallback(async () => {
    setState(prev => ({ ...prev, stage: 'processing' }))
    setIsProcessing(true)
    processingStartTime.current = Date.now()

    // Simulate AI processing with progressive feedback
    let progress = 0
    const updateProgress = () => {
      progress += Math.random() * 0.1
      if (progress < 1) {
        rafId.current = requestAnimationFrame(updateProgress)
      }
    }
    updateProgress()

    await new Promise(resolve => setTimeout(resolve, 2000))

    const results = calculateVelocity({
      teamSize: state.teamSize!,
      velocity: state.velocity!,
      bottleneck: state.bottleneck!
    })

    setIsProcessing(false)
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
    }

    setState(prev => ({ ...prev, stage: 'results', results }))
  }, [state.teamSize, state.velocity, state.bottleneck])

  const handleEmailCapture = useCallback(() => {
    setShowEmailModal(true)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      if (attractAnimationRef.current) {
        cancelAnimationFrame(attractAnimationRef.current)
      }
    }
  }, [])

  if (state.stage === 'attract') {
    const attractVariants = [
      { before: 3, after: 12, improvement: '300%', savings: '$125K' },
      { before: 5, after: 15, improvement: '200%', savings: '$200K' },
      { before: 8, after: 20, improvement: '150%', savings: '$300K' },
      { before: 2, after: 10, improvement: '400%', savings: '$85K' }
    ]
    const current = attractVariants[attractCycle]

    return (
      <div
        data-testid="velocity-demo"
        className="glass-effect velocity-demo w-full max-w-md mx-auto min-h-[480px] flex flex-col justify-between p-8 relative overflow-hidden"
        style={{
          ...glassStyles,
          ...shadowStyles,
          borderRadius: getPM33BorderRadius('xl')
        }}
      >
        {/* Shimmer background effect */}
        <div className="absolute inset-0 -z-10">
          <div className="shimmer-gradient absolute inset-0 opacity-30" />
        </div>

        <div className="text-center relative z-10">
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className="text-center transition-all duration-700 ease-out">
                <div style={{ color: getPM33TextColor('muted') }} className="text-sm mb-1">Before</div>
                <div
                  style={{ color: getPM33TextColor('primary') }}
                  className="text-2xl font-bold transition-all duration-500"
                >
                  {current.before}
                </div>
                <div style={{ color: getPM33TextColor('secondary') }} className="text-sm">features/month</div>
                <div className="text-red-500 dark:text-red-400 text-xs mt-1 animate-pulse">
                  Lost opportunity
                </div>
              </div>

              <div className="flex flex-col items-center relative">
                <div className="velocity-arrow-shimmer w-12 h-1 rounded mb-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                  <div className="w-full h-full bg-gradient-to-r from-gray-400/40 dark:from-white/40 to-gray-600/80 dark:to-white/80 rounded" />
                </div>
                <div style={{ color: getPM33TextColor('muted') }} className="text-xs glow-text">
                  With PM33
                </div>
              </div>

              <div className="text-center transition-all duration-700 ease-out">
                <div style={{ color: getPM33TextColor('muted') }} className="text-sm mb-1">After</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 pulse-glow transition-all duration-500">
                  {current.after}
                </div>
                <div style={{ color: getPM33TextColor('secondary') }} className="text-sm">features/month</div>
                <div className="text-green-600 dark:text-green-400 text-xs mt-1 font-medium animate-bounce">
                  {current.savings} captured
                </div>
              </div>
            </div>

            {/* Improvement indicator */}
            <div className="mb-6 transform transition-all duration-500">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                <span className="text-green-400 font-semibold text-sm mr-1">+{current.improvement}</span>
                <span style={{ color: getPM33TextColor('muted') }} className="text-xs">improvement</span>
              </div>
            </div>
          </div>

          <h3
            style={{ color: getPM33TextColor('primary') }}
            className="font-semibold text-xl mb-3 gradient-text-shimmer"
          >
            See Your Velocity Potential
          </h3>
          <p style={{ color: getPM33TextColor('secondary') }} className="mb-6 text-sm leading-relaxed">
            Calculate how much faster your team could ship with AI-powered PM tools
          </p>

          <button
            onClick={handleStartDemo}
            className="haptic-button w-full text-white px-6 py-3 font-medium transition-all duration-300 relative overflow-hidden group"
            style={{
              background: `linear-gradient(135deg, ${getPM33Color('accent-500')}, ${getPM33Color('accent-600')})`,
              borderRadius: getPM33BorderRadius('lg'),
              boxShadow: `${getPM33Shadow('lg')}, 0 0 20px ${getPM33Color('accent-500')}20`
            }}
          >
            {/* Shimmer effect on button */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10">Calculate Your Velocity</span>
            <div className="text-xs mt-1 opacity-90 relative z-10">Takes 30 seconds</div>
          </button>
        </div>

        <style jsx>{`
          .shimmer-gradient {
            background: linear-gradient(
              45deg,
              transparent 30%,
              rgba(255, 255, 255, 0.1) 50%,
              transparent 70%
            );
            animation: shimmer 3s ease-in-out infinite;
          }

          .velocity-arrow-shimmer {
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.4),
              transparent
            );
          }

          @keyframes shimmer {
            0%, 100% { transform: translateX(-100%) rotate(45deg); }
            50% { transform: translateX(200%) rotate(45deg); }
          }

          .animate-shimmer {
            animation: shimmer-sweep 2s ease-in-out infinite;
          }

          @keyframes shimmer-sweep {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          .pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite alternate;
          }

          @keyframes pulse-glow {
            0% { text-shadow: 0 0 5px currentColor; }
            100% { text-shadow: 0 0 10px currentColor, 0 0 15px currentColor; }
          }

          .gradient-text-shimmer {
            background: linear-gradient(
              90deg,
              ${getPM33Color('primary')} 25%,
              ${getPM33Color('accent-500')} 50%,
              ${getPM33Color('primary')} 75%
            );
            background-size: 200% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradient-shift 3s ease-in-out infinite;
          }

          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 0%; }
            50% { background-position: 100% 0%; }
          }

          .glow-text {
            animation: glow 2s ease-in-out infinite alternate;
          }

          @keyframes glow {
            from { text-shadow: 0 0 3px currentColor; }
            to { text-shadow: 0 0 6px currentColor, 0 0 9px currentColor; }
          }

          .haptic-button {
            transform-origin: center;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }

          .haptic-button:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: ${getPM33Shadow('xl')}, 0 0 30px ${getPM33Color('accent-500')}40 !important;
          }

          .haptic-button:active {
            transform: translateY(-1px) scale(0.98);
            transition: all 0.1s ease;
          }
        `}</style>
      </div>
    )
  }

  if (state.stage === 'input') {
    const progressPercentage = ((questionIndex + 1) / 3) * 100

    return (
      <div
        data-testid="velocity-demo"
        className="glass-effect velocity-demo w-full max-w-md mx-auto min-h-[480px] flex flex-col justify-between p-8 relative overflow-hidden"
        style={{
          ...glassStyles,
          ...shadowStyles,
          borderRadius: getPM33BorderRadius('xl')
        }}
      >
        {/* Subtle background shimmer */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="shimmer-gradient absolute inset-0" />
        </div>

        <div className="mb-6 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div style={{ color: getPM33TextColor('primary') }} className="font-medium">
              Question {questionIndex + 1} of 3
            </div>
            <div
              className="w-24 h-2 rounded-full relative overflow-hidden"
              style={{ backgroundColor: `${getPM33Color('gray-300')}40` }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden glow-progress"
                style={{
                  width: `${progressPercentage}%`,
                  background: `linear-gradient(90deg, ${getPM33Color('accent-500')}, ${getPM33Color('accent-400')})`
                }}
              >
                {/* Progress shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center space-x-2 mb-6">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  step <= questionIndex ? 'step-active' : 'step-inactive'
                }`}
                style={{
                  backgroundColor: step <= questionIndex
                    ? getPM33Color('accent-500')
                    : `${getPM33Color('gray-400')}60`,
                  boxShadow: step <= questionIndex
                    ? `0 0 8px ${getPM33Color('accent-500')}60`
                    : 'none'
                }}
              />
            ))}
          </div>
        </div>

        <style jsx>{`
          .shimmer-gradient {
            background: linear-gradient(
              45deg,
              transparent 30%,
              rgba(255, 255, 255, 0.05) 50%,
              transparent 70%
            );
            animation: shimmer 4s ease-in-out infinite;
          }

          @keyframes shimmer {
            0%, 100% { transform: translateX(-100%) rotate(45deg); }
            50% { transform: translateX(200%) rotate(45deg); }
          }

          .animate-shimmer {
            animation: shimmer-sweep 2s ease-in-out infinite;
          }

          @keyframes shimmer-sweep {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          .glow-progress {
            box-shadow: 0 0 10px ${getPM33Color('accent-500')}60;
          }

          .step-active {
            animation: step-glow 1.5s ease-in-out infinite alternate;
          }

          @keyframes step-glow {
            from { box-shadow: 0 0 5px ${getPM33Color('accent-500')}60; }
            to { box-shadow: 0 0 12px ${getPM33Color('accent-500')}80, 0 0 18px ${getPM33Color('accent-500')}40; }
          }

          .step-inactive {
            opacity: 0.6;
            transform: scale(0.8);
          }
        `}</style>

        {questionIndex === 0 && (
          <div className="text-center relative z-10">
            <h4
              style={{ color: getPM33TextColor('primary') }}
              className="font-semibold text-lg mb-6 fade-in-up"
            >
              How large is your product team?
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: '1-5', label: '1-5 people', icon: '👥' },
                { value: '6-10', label: '6-10 people', recommended: true, icon: '👥' },
                { value: '11-20', label: '11-20 people', icon: '👥' },
                { value: '20+', label: '20+ people', icon: '👥' }
              ].map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer('teamSize', option.value)}
                  className="haptic-option-button relative overflow-hidden group fade-in-up"
                  style={{
                    ...glassStyles,
                    borderRadius: getPM33BorderRadius('lg'),
                    border: `1px solid ${getPM33Color('gray-300')}40`,
                    color: getPM33TextColor('primary'),
                    padding: getPM33Spacing(2),
                    animationDelay: `${index * 0.1}s`
                  }}
                  aria-label={`Select team size: ${option.label}${option.recommended ? ' (most common)' : ''}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleAnswer('teamSize', option.value);
                    }
                  }}
                >
                  {option.recommended && (
                    <div
                      className="absolute -top-2 -right-2 text-white text-xs px-2 py-1 rounded-full glow-badge z-20"
                      style={{
                        background: `linear-gradient(135deg, ${getPM33Color('accent-500')}, ${getPM33Color('accent-600')})`,
                        boxShadow: `0 0 10px ${getPM33Color('accent-500')}60`
                      }}
                    >
                      Most common
                    </div>
                  )}

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                  <div className="relative z-10">
                    <div className="text-lg mb-1">{option.icon}</div>
                    <div className="font-medium">{option.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {questionIndex === 1 && (
          <div className="text-center relative z-10">
            <h4
              style={{ color: getPM33TextColor('primary') }}
              className="font-semibold text-lg mb-6 fade-in-up"
            >
              How many features does your team ship per month?
            </h4>
            <div className="mb-6">
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={sliderValue}
                  className="velocity-slider w-full h-3 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(90deg, ${getPM33Color('accent-300')}40 0%, ${getPM33Color('accent-500')} ${(sliderValue / 20) * 100}%, ${getPM33Color('gray-300')}40 ${(sliderValue / 20) * 100}%)`
                  }}
                  aria-label="Number of features per month slider"
                  aria-valuemin={1}
                  aria-valuemax={20}
                  aria-valuenow={sliderValue}
                  aria-valuetext={`${sliderValue} features per month`}
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    setSliderValue(value)
                  }}
                  onMouseUp={(e) => handleAnswer('velocity', parseInt((e.target as HTMLInputElement).value))}
                />
                {/* Glow effect on track */}
                <div
                  className="absolute top-0 left-0 h-3 rounded-lg pointer-events-none glow-track"
                  style={{
                    width: `${(sliderValue / 20) * 100}%`,
                    background: `linear-gradient(90deg, ${getPM33Color('accent-400')}, ${getPM33Color('accent-500')})`,
                    boxShadow: `0 0 10px ${getPM33Color('accent-500')}40`
                  }}
                />
              </div>
              <div className="flex justify-between text-sm mt-4">
                <span style={{ color: getPM33TextColor('muted') }}>1</span>
                <div className="text-center">
                  <div
                    style={{ color: getPM33TextColor('primary') }}
                    className="font-bold text-2xl glow-number transition-all duration-300"
                  >
                    {sliderValue}
                  </div>
                  <div style={{ color: getPM33TextColor('muted') }} className="text-xs">features</div>
                </div>
                <span style={{ color: getPM33TextColor('muted') }}>20+</span>
              </div>
            </div>
            <p style={{ color: getPM33TextColor('secondary') }} className="text-sm leading-relaxed">
              Include both major features and smaller improvements
            </p>
          </div>
        )}

        {questionIndex === 2 && (
          <div className="text-center relative z-10">
            <h4
              style={{ color: getPM33TextColor('primary') }}
              className="font-semibold text-lg mb-6 fade-in-up"
            >
              What's your biggest bottleneck?
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {[
                { value: 'planning', label: '📋 Planning & Requirements', desc: 'Writing PRDs, defining specs', color: 'blue' },
                { value: 'alignment', label: '🤝 Stakeholder Alignment', desc: 'Getting everyone on the same page', color: 'purple' },
                { value: 'execution', label: '⚡ Development Execution', desc: 'Building and shipping features', color: 'green' },
                { value: 'testing', label: '🧪 Testing & QA', desc: 'Quality assurance and validation', color: 'amber' }
              ].map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer('bottleneck', option.value)}
                  className="haptic-bottleneck-button text-left relative overflow-hidden group fade-in-up"
                  style={{
                    ...glassStyles,
                    borderRadius: getPM33BorderRadius('lg'),
                    border: `1px solid ${getPM33Color('gray-300')}40`,
                    color: getPM33TextColor('primary'),
                    padding: getPM33Spacing(2),
                    animationDelay: `${index * 0.1}s`
                  }}
                  aria-label={`Select bottleneck: ${option.label} - ${option.desc}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleAnswer('bottleneck', option.value);
                    }
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                  {/* Left accent bar */}
                  <div
                    className="absolute left-0 top-0 w-1 h-full rounded-r transition-all duration-300 group-hover:w-2"
                    style={{
                      background: `linear-gradient(180deg, ${getPM33Color('accent-400')}, ${getPM33Color('accent-600')})`,
                      boxShadow: `0 0 8px ${getPM33Color('accent-500')}40`
                    }}
                  />

                  <div className="relative z-10 ml-2">
                    <div className="font-medium mb-1 text-base">{option.label}</div>
                    <div style={{ color: getPM33TextColor('secondary') }} className="text-sm leading-relaxed">
                      {option.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (state.stage === 'processing') {
    return (
      <div
        data-testid="velocity-demo"
        className="glass-effect velocity-demo w-full max-w-md mx-auto min-h-[480px] flex flex-col justify-center text-center p-8 relative overflow-hidden"
        style={{
          ...glassStyles,
          ...shadowStyles,
          borderRadius: getPM33BorderRadius('xl')
        }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="processing-shimmer absolute inset-0" />
        </div>

        <div className="mb-8 relative z-10">
          {/* AI Brain with pulsing glow */}
          <div className="relative mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto relative overflow-hidden ai-brain"
              style={{
                background: `linear-gradient(135deg, ${getPM33Color('accent-500')}20, ${getPM33Color('accent-600')}40)`,
                border: `2px solid ${getPM33Color('accent-500')}60`
              }}
            >
              {/* Multiple rotating rings */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent ai-ring-1"
                style={{ borderTopColor: getPM33Color('accent-500') }} />
              <div className="absolute inset-2 rounded-full border-2 border-transparent ai-ring-2"
                style={{ borderRightColor: getPM33Color('accent-400') }} />
              <div className="absolute inset-4 rounded-full border border-transparent ai-ring-3"
                style={{ borderLeftColor: getPM33Color('accent-600') }} />

              <span className="text-3xl relative z-10 animate-bounce">🧠</span>

              {/* Pulsing glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-spin-slow" />
            </div>
          </div>

          <h4
            style={{ color: getPM33TextColor('primary') }}
            className="font-semibold text-lg mb-4 processing-text"
          >
            Analyzing your velocity potential...
          </h4>

          {/* Advanced progress bar with segments */}
          <div className="w-48 mx-auto mb-6">
            <div className="flex space-x-1 mb-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-2 rounded-full processing-segment"
                  style={{
                    background: `${getPM33Color('gray-300')}40`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
            <div style={{ color: getPM33TextColor('muted') }} className="text-xs">
              Processing your team data...
            </div>
          </div>

          {/* Processing steps */}
          <div className="space-y-2 mb-6">
            {[
              '🔍 Analyzing team patterns',
              '📊 Calculating velocity metrics',
              '🎯 Identifying opportunities',
              '💡 Generating recommendations'
            ].map((step, index) => (
              <div
                key={index}
                className="processing-step opacity-0 flex items-center justify-center space-x-2"
                style={{
                  color: getPM33TextColor('secondary'),
                  animationDelay: `${index * 0.5}s`
                }}
              >
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{ color: getPM33TextColor('secondary') }}
          className="text-sm italic animate-fade-in"
        >
          "Average team saves 72 hours/month with PM33"
        </div>

        <style jsx>{`
          .processing-shimmer {
            background: linear-gradient(
              45deg,
              transparent 30%,
              rgba(16, 185, 129, 0.1) 50%,
              transparent 70%
            );
            animation: processing-sweep 2s ease-in-out infinite;
          }

          @keyframes processing-sweep {
            0%, 100% { transform: translateX(-100%) rotate(45deg) scale(0.8); }
            50% { transform: translateX(200%) rotate(45deg) scale(1.2); }
          }

          .ai-brain {
            animation: ai-pulse 2s ease-in-out infinite;
            box-shadow: 0 0 20px ${getPM33Color('accent-500')}40;
          }

          @keyframes ai-pulse {
            0%, 100% {
              box-shadow: 0 0 20px ${getPM33Color('accent-500')}40;
              transform: scale(1);
            }
            50% {
              box-shadow: 0 0 30px ${getPM33Color('accent-500')}60, 0 0 50px ${getPM33Color('accent-500')}30;
              transform: scale(1.05);
            }
          }

          .ai-ring-1 {
            animation: rotate-clockwise 3s linear infinite;
          }

          .ai-ring-2 {
            animation: rotate-counter-clockwise 4s linear infinite;
          }

          .ai-ring-3 {
            animation: rotate-clockwise 2s linear infinite;
          }

          @keyframes rotate-clockwise {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes rotate-counter-clockwise {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
          }

          .processing-segment {
            animation: segment-fill 2s ease-in-out infinite;
          }

          @keyframes segment-fill {
            0%, 50% {
              background: ${getPM33Color('gray-300')}40 !important;
            }
            25%, 75% {
              background: linear-gradient(90deg, ${getPM33Color('accent-400')}, ${getPM33Color('accent-500')}) !important;
              box-shadow: 0 0 10px ${getPM33Color('accent-500')}40;
            }
          }

          .processing-step {
            animation: step-appear 0.5s ease-out 1s both;
          }

          @keyframes step-appear {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .processing-text {
            animation: text-glow 2s ease-in-out infinite alternate;
          }

          @keyframes text-glow {
            from { text-shadow: none; }
            to { text-shadow: 0 0 10px ${getPM33Color('accent-500')}40; }
          }

          .animate-spin-slow {
            animation: spin-slow 4s linear infinite;
          }

          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .animate-fade-in {
            animation: fade-in 1s ease-out 2s both;
          }

          @keyframes fade-in {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    )
  }

  if (state.stage === 'results' && state.results) {
    return (
      <div
        data-testid="velocity-demo"
        className="glass-effect velocity-demo w-full max-w-md mx-auto min-h-[480px] flex flex-col justify-between p-8 relative overflow-hidden"
        style={{
          ...glassStyles,
          ...shadowStyles,
          borderRadius: getPM33BorderRadius('xl')
        }}
      >
        <div className="absolute inset-0 -z-10">
          <div className="results-shimmer absolute inset-0 opacity-20" />
        </div>

        <div className="text-center mb-6 relative z-10">
          <h4
            style={{ color: getPM33TextColor('primary') }}
            className="font-bold text-xl mb-4 gradient-text-shimmer"
          >
            Your Velocity Analysis
          </h4>

          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div style={{ color: getPM33TextColor('muted') }} className="text-sm mb-1">Current</div>
              <div
                style={{ color: getPM33TextColor('primary') }}
                className="text-3xl font-bold counter-animation"
                data-target="{state.results.current}"
              >
                {state.results.current}
              </div>
              <div style={{ color: getPM33TextColor('secondary') }} className="text-sm">features/month</div>
            </div>

            <div className="flex flex-col items-center">
              <div
                className="w-12 h-1 rounded mb-2 relative overflow-hidden"
                style={{
                  background: `linear-gradient(90deg, ${getPM33Color('gray-400')}40, ${getPM33Color('accent-500')})`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </div>
              <div
                style={{ color: getPM33Color('accent-400') }}
                className="font-medium text-sm glow-text animate-bounce"
              >
                {state.results.improvement}% faster
              </div>
            </div>

            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div style={{ color: getPM33TextColor('muted') }} className="text-sm mb-1">With PM33</div>
              <div
                style={{ color: getPM33Color('accent-400') }}
                className="text-3xl font-bold pulse-glow counter-animation"
                data-target="{state.results.projected}"
              >
                {state.results.projected}
              </div>
              <div style={{ color: getPM33TextColor('secondary') }} className="text-sm">features/month</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
          {[
            { icon: '⏱️', value: `${state.results.timeSaved}h`, label: 'saved/month', color: 'green', delay: '0s' },
            { icon: '💰', value: `$${(state.results.valueCaptured / 1000).toFixed(0)}K`, label: 'value/month', color: 'amber', delay: '0.2s' },
            { icon: '📈', value: `${state.results.roi}%`, label: 'ROI', color: 'purple', delay: '0.4s' }
          ].map((metric, index) => (
            <div
              key={index}
              className="metric-card relative overflow-hidden group"
              style={{
                ...glassStyles,
                borderRadius: getPM33BorderRadius('lg'),
                border: `1px solid ${getPM33Color(`${metric.color}-500`)}20`,
                background: `${getPM33Color(`${metric.color}-500`)}10`,
                padding: getPM33Spacing(2),
                animationDelay: metric.delay
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <div className="text-center relative z-10">
                <div className="text-2xl mb-1 animate-bounce metric-icon">{metric.icon}</div>
                <div
                  style={{ color: getPM33TextColor('primary') }}
                  className="font-bold counter-animation"
                  data-target="{metric.value}"
                >
                  {metric.value}
                </div>
                <div style={{ color: getPM33TextColor('muted') }} className="text-xs">{metric.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="relative overflow-hidden mb-6 group"
          style={{
            ...glassStyles,
            borderRadius: getPM33BorderRadius('lg'),
            border: `1px solid ${getPM33Color('gray-300')}20`,
            padding: getPM33Spacing(2)
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />

          <div className="relative z-10">
            <h5
              style={{ color: getPM33TextColor('primary') }}
              className="font-medium mb-2 flex items-center space-x-2"
            >
              <span className="animate-bounce">💡</span>
              <span>Your Biggest Opportunity</span>
            </h5>
            <p style={{ color: getPM33TextColor('secondary') }} className="text-sm leading-relaxed">
              Based on your team size and bottleneck, {state.results.primaryRecommendation}
              and help you ship{' '}
              <span
                style={{ color: getPM33Color('accent-500') }}
                className="font-semibold glow-text"
              >
                {state.results.projected - state.results.current} additional features
              </span>{' '}
              monthly.
            </p>
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <button
            onClick={handleEmailCapture}
            className="haptic-button w-full text-white px-6 py-3 font-medium transition-all duration-300 relative overflow-hidden group"
            style={{
              background: `linear-gradient(135deg, ${getPM33Color('accent-500')}, ${getPM33Color('accent-600')})`,
              borderRadius: getPM33BorderRadius('lg'),
              boxShadow: `${getPM33Shadow('lg')}, 0 0 20px ${getPM33Color('accent-500')}30`
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="relative z-10">
              <span>Get Detailed Report</span>
              <div className="text-xs mt-1 opacity-90">15-page analysis • Free</div>
            </div>
          </button>

          <button
            className="haptic-secondary-button w-full px-6 py-3 font-medium transition-all duration-300 relative overflow-hidden group"
            style={{
              ...glassStyles,
              borderRadius: getPM33BorderRadius('lg'),
              border: `1px solid ${getPM33Color('gray-300')}30`,
              color: getPM33TextColor('primary')
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10">Start Free Trial</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <GlobalStyles />
      {showEmailModal && (
        <Suspense fallback={<div>Loading...</div>}>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Get Your Results</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Email functionality coming soon. For now, enjoy exploring the demo!
              </p>
              <button
                onClick={() => setShowEmailModal(false)}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Suspense>
      )}
    </>
  )
}

// Add global CSS animations for input stage
const GlobalStyles = () => (
  <style jsx global>{`
    .fade-in-up {
      animation: fade-in-up 0.6s ease-out both;
    }

    @keyframes fade-in-up {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .haptic-option-button {
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transform-origin: center;
    }

    .haptic-option-button:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: var(--shadow-lg), 0 0 20px rgba(16, 185, 129, 0.2) !important;
    }

    .haptic-option-button:active {
      transform: translateY(-1px) scale(0.98);
      transition: all 0.1s ease;
    }

    .haptic-bottleneck-button {
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transform-origin: center;
    }

    .haptic-bottleneck-button:hover {
      transform: translateY(-2px) scale(1.01);
      box-shadow: var(--shadow-md) !important;
    }

    .haptic-bottleneck-button:active {
      transform: translateY(-1px) scale(0.99);
      transition: all 0.1s ease;
    }

    .glow-badge {
      animation: badge-glow 2s ease-in-out infinite alternate;
    }

    @keyframes badge-glow {
      from { box-shadow: 0 0 10px rgba(16, 185, 129, 0.6); }
      to { box-shadow: 0 0 15px rgba(16, 185, 129, 0.8), 0 0 25px rgba(16, 185, 129, 0.4); }
    }

    .velocity-slider::-webkit-slider-thumb {
      appearance: none;
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: var(--pm33-accent-500);
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 2px 10px rgba(16, 185, 129, 0.4);
      transition: all 0.2s ease;
    }

    .velocity-slider::-webkit-slider-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.6);
    }

    .velocity-slider::-moz-range-thumb {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: var(--pm33-accent-500);
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 2px 10px rgba(16, 185, 129, 0.4);
    }

    .glow-number {
      animation: number-glow 1s ease-out;
    }

    @keyframes number-glow {
      0% {
        text-shadow: none;
        transform: scale(0.9);
      }
      50% {
        text-shadow: 0 0 15px rgba(16, 185, 129, 0.6);
        transform: scale(1.1);
      }
      100% {
        text-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
        transform: scale(1);
      }
    }
  `}</style>
)

// Enhanced Email Modal Component with animations
interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
}

function EmailModalComponent({ isOpen, onClose }: EmailModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="glass-effect max-w-md w-full relative overflow-hidden modal-slide-up p-8 rounded-xl">
        {/* Background shimmer */}
        <div className="absolute inset-0 -z-10">
          <div className="shimmer-gradient absolute inset-0 opacity-30" />
        </div>

        <div className="relative z-10">
          <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-4 gradient-text-shimmer">
            Get Your Velocity Report
          </h3>
          <p className="text-gray-700 dark:text-white/80 mb-6 leading-relaxed">
            Get a personalized 15-page analysis with team-specific recommendations.
          </p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="your@company.com"
              className="w-full glass-effect px-4 py-3 rounded-lg border border-white/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pm33-accent-500 transition-all duration-300"
            />
            <button className="haptic-button w-full bg-gradient-to-r from-pm33-accent-500 to-pm33-accent-600 hover:from-pm33-accent-600 hover:to-pm33-accent-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10">Send My Report</span>
            </button>
            <button
              onClick={onClose}
              className="w-full text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>

        <style jsx>{`
          .modal-slide-up {
            animation: modal-slide-up 0.4s ease-out;
          }

          @keyframes modal-slide-up {
            0% {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }

          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .shimmer-gradient {
            background: linear-gradient(
              45deg,
              transparent 30%,
              rgba(255, 255, 255, 0.05) 50%,
              transparent 70%
            );
            animation: shimmer 4s ease-in-out infinite;
          }

          @keyframes shimmer {
            0%, 100% { transform: translateX(-100%) rotate(45deg); }
            50% { transform: translateX(200%) rotate(45deg); }
          }
        `}</style>
      </div>
    </div>
  )
}