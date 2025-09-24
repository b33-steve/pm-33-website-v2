export interface VelocityInputs {
  teamSize: '1-5' | '6-10' | '11-20' | '20+'
  currentVelocity: number
  bottleneck: 'planning' | 'alignment' | 'execution' | 'testing'
}

export interface VelocityResults {
  current: number
  projected: number
  improvement: number
  timeSaved: number
  valueCaptured: number
  roi: number
  recommendations: string[]
  primaryInsight: string
}

function getTeamMultiplier(teamSize: string): number {
  const multipliers = {
    '1-5': 1,
    '6-10': 1.5,
    '11-20': 2,
    '20+': 2.5
  }
  return multipliers[teamSize as keyof typeof multipliers] || 1
}

function getBottleneckImpact(bottleneck: string): number {
  const impacts = {
    'planning': 3.2, // PRD automation has highest impact
    'alignment': 2.8, // Stakeholder dashboards significant
    'execution': 3.5, // Velocity tracking most impactful
    'testing': 2.4   // QA automation moderate impact
  }
  return impacts[bottleneck as keyof typeof impacts] || 2.5
}

function getRecommendations(inputs: VelocityInputs): string[] {
  const baseRecommendations = [
    'Implement automated PRD generation',
    'Set up velocity tracking dashboard',
    'Create stakeholder alignment workflows'
  ]

  const bottleneckSpecific = {
    'planning': [
      'AI-powered requirement generation',
      'Template-based PRD creation',
      'Automated user story breakdown'
    ],
    'alignment': [
      'Real-time stakeholder dashboards',
      'Automated status updates',
      'Priority alignment workflows'
    ],
    'execution': [
      'Sprint velocity optimization',
      'Bottleneck identification alerts',
      'Resource allocation intelligence'
    ],
    'testing': [
      'Automated QA pipeline setup',
      'Test case generation',
      'Release readiness scoring'
    ]
  }

  return [
    ...baseRecommendations,
    ...(bottleneckSpecific[inputs.bottleneck] || [])
  ]
}

function getPrimaryInsight(inputs: VelocityInputs, results: VelocityResults): string {
  const insights = {
    'planning': `Automating PRD generation could save your ${inputs.teamSize} team 32 hours/month and help ship ${results.projected - results.current} additional features`,
    'alignment': `Stakeholder dashboards could reduce alignment meetings by 60% and accelerate feature delivery by ${results.improvement}%`,
    'execution': `Velocity tracking could identify bottlenecks instantly and boost your team's output from ${results.current} to ${results.projected} features monthly`,
    'testing': `Automated testing pipelines could double your release speed and capture $${(results.valueCaptured / 1000).toFixed(0)}K additional value`
  }

  return insights[inputs.bottleneck] || `PM33 automation could transform your workflow and boost velocity by ${results.improvement}%`
}

export function calculateVelocity(inputs: VelocityInputs): VelocityResults {
  // Validate inputs
  if (!inputs.teamSize || !inputs.currentVelocity || !inputs.bottleneck) {
    throw new Error('Missing required inputs for velocity calculation')
  }

  if (inputs.currentVelocity < 1 || inputs.currentVelocity > 50) {
    throw new Error('Current velocity must be between 1 and 50 features per month')
  }

  // Base calculations
  const teamMultiplier = getTeamMultiplier(inputs.teamSize)
  const bottleneckImpact = getBottleneckImpact(inputs.bottleneck)

  // Calculate projected improvements
  const projected = Math.round(inputs.currentVelocity * bottleneckImpact)
  const improvement = Math.round((projected / inputs.currentVelocity - 1) * 100)

  // Time and value calculations
  const timeSaved = Math.round(teamMultiplier * 72) // 72 base hours per month
  const valueCaptured = projected * 10000 // $10K per feature assumption
  const roi = Math.round((valueCaptured / 99) * 100) // Based on Team tier pricing

  const results: VelocityResults = {
    current: inputs.currentVelocity,
    projected,
    improvement,
    timeSaved,
    valueCaptured,
    roi,
    recommendations: getRecommendations(inputs),
    primaryInsight: ''
  }

  // Add primary insight after results are calculated
  results.primaryInsight = getPrimaryInsight(inputs, results)

  return results
}

// Utility function for formatting results
export function formatVelocityResults(results: VelocityResults) {
  return {
    ...results,
    formattedValue: `$${(results.valueCaptured / 1000).toFixed(0)}K`,
    formattedROI: `${results.roi}%`,
    formattedImprovement: `${results.improvement}%`,
    formattedTimeSaved: `${results.timeSaved} hours`
  }
}

// Analytics tracking helper
export function trackVelocityCalculation(inputs: VelocityInputs, results: VelocityResults) {
  // This would integrate with your analytics platform
  if (typeof window !== 'undefined' && (window as any).analytics) {
    (window as any).analytics.track('Velocity Calculation Completed', {
      teamSize: inputs.teamSize,
      currentVelocity: inputs.currentVelocity,
      bottleneck: inputs.bottleneck,
      projectedVelocity: results.projected,
      improvement: results.improvement,
      valueCaptured: results.valueCaptured,
      location: 'homepage_demo'
    })
  }
}