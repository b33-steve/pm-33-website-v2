'use client'

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()
  private observers: Map<string, PerformanceObserver> = new Map()

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Measure Core Web Vitals
  measureWebVitals() {
    if (typeof window === 'undefined') return

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as any
      this.recordMetric('lcp', lastEntry.renderTime || lastEntry.loadTime)
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    this.observers.set('lcp', lcpObserver)

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        this.recordMetric('fid', entry.processingStart - entry.startTime)
      })
    })
    fidObserver.observe({ type: 'first-input', buffered: true })
    this.observers.set('fid', fidObserver)

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
          this.recordMetric('cls', clsValue)
        }
      }
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })
    this.observers.set('cls', clsObserver)

    // Time to First Byte (TTFB)
    this.measureTTFB()

    // First Contentful Paint (FCP)
    this.measureFCP()
  }

  private measureTTFB() {
    if (typeof window === 'undefined') return

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart
      this.recordMetric('ttfb', ttfb)
    }
  }

  private measureFCP() {
    if (typeof window === 'undefined') return

    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.recordMetric('fcp', entry.startTime)
        }
      })
    })
    fcpObserver.observe({ type: 'paint', buffered: true })
    this.observers.set('fcp', fcpObserver)
  }

  // Record custom metrics
  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    this.metrics.get(name)?.push(value)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${value.toFixed(2)}ms`)
    }
  }

  // Get average metric value
  getMetricAverage(name: string): number | null {
    const values = this.metrics.get(name)
    if (!values || values.length === 0) return null

    const sum = values.reduce((a, b) => a + b, 0)
    return sum / values.length
  }

  // Get all metrics
  getAllMetrics(): Record<string, number | null> {
    const result: Record<string, number | null> = {}
    for (const [name] of this.metrics) {
      result[name] = this.getMetricAverage(name)
    }
    return result
  }

  // Clean up observers
  cleanup() {
    for (const observer of this.observers.values()) {
      observer.disconnect()
    }
    this.observers.clear()
  }

  // Report metrics to analytics
  reportToAnalytics() {
    const metrics = this.getAllMetrics()

    // Send to Google Analytics or other analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      for (const [metric, value] of Object.entries(metrics)) {
        if (value !== null) {
          (window as any).gtag('event', 'performance', {
            metric_name: metric,
            value: Math.round(value),
            metric_value: value
          })
        }
      }
    }

    return metrics
  }
}

// Utility to measure component render time
export function measureComponentPerformance(componentName: string) {
  const startTime = performance.now()

  return {
    end: () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      PerformanceMonitor.getInstance().recordMetric(`component_${componentName}`, duration)
      return duration
    }
  }
}

// Utility to track bundle size impact
export function trackBundleSize() {
  if (typeof window === 'undefined') return

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  const jsResources = resources.filter(r => r.name.endsWith('.js'))
  const cssResources = resources.filter(r => r.name.endsWith('.css'))

  const totalJsSize = jsResources.reduce((sum, r) => sum + (r.encodedBodySize || 0), 0)
  const totalCssSize = cssResources.reduce((sum, r) => sum + (r.encodedBodySize || 0), 0)

  return {
    js: totalJsSize,
    css: totalCssSize,
    total: totalJsSize + totalCssSize,
    jsCount: jsResources.length,
    cssCount: cssResources.length
  }
}

// Utility to detect slow connections
export function detectSlowConnection(): boolean {
  if (typeof window === 'undefined') return false

  const connection = (navigator as any).connection ||
                    (navigator as any).mozConnection ||
                    (navigator as any).webkitConnection

  if (connection) {
    const effectiveType = connection.effectiveType
    return effectiveType === 'slow-2g' || effectiveType === '2g'
  }

  return false
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance()