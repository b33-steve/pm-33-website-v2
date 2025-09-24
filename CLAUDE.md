# PM33 Marketing Website - Claude Code Configuration

## 🚨 CRITICAL: CONCURRENT EXECUTION & FILE MANAGEMENT

**ABSOLUTE RULES:**
1. **ALL operations MUST be concurrent/parallel in a single message**
2. **NEVER save files to root folder** - Use appropriate subdirectories
3. **Batch ALL related operations** - TodoWrite, Task, File ops, Bash commands
4. **USE CLAUDE CODE'S TASK TOOL** for spawning agents concurrently

### ⚡ GOLDEN RULE: "1 MESSAGE = ALL OPERATIONS"

**Example Correct Pattern:**
```javascript
[Single Message - Full Website Development]:
  // Spawn ALL agents concurrently via Claude Code Task tool
  Task("Frontend Developer", "Build homepage with Geist UI and warm theme", "coder")
  Task("Velocity Calculator Dev", "Implement calculator component", "coder")
  Task("API Developer", "Create Next.js API routes", "backend-dev")
  Task("Test Engineer", "Write component tests", "tester")
  Task("Performance Optimizer", "Ensure <2s load time", "perf-analyzer")
  
  // Batch ALL todos
  TodoWrite { todos: [10+ website development todos] }
  
  // Batch ALL file operations
  Write "src/app/page.tsx"
  Write "src/components/VelocityCalculator.tsx"
  Write "src/lib/theme.ts"
  Write "tests/homepage.test.tsx"
```

## 📁 PM33 Website File Structure

**MANDATORY - Never save to root:**
```
pm33-website/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   └── lib/             # Utilities, theme, API
├── tests/               # All test files
├── docs/                # Documentation (only if requested)
├── config/              # Configuration files
├── public/              # Static assets
└── scripts/             # Build and utility scripts
```

## 🎯 Project Overview

Build a high-converting marketing website for PM33, an AI-powered product management platform. Target: $100K MRR by EOY 2025 through PLG motion.

**Stack**: Next.js 15.4.6, TypeScript, Geist UI, Tailwind CSS  
**Design**: Geist components with warm, community-friendly customization  
**Hero Feature**: Velocity Calculator (drives 40% of conversions)

## 🚀 Quick Start with SPARC

### Initialize Project with Concurrent Agents
```javascript
[Single Message - Project Setup]:
  // Claude Code Task tool spawns all agents
  Task("Architect", "Design website architecture with Geist UI", "system-architect")
  Task("Frontend Lead", "Setup Next.js with TypeScript and Geist", "coder")
  Task("Theme Designer", "Create warm color theme overrides", "coder")
  Task("Component Builder", "Build reusable Geist components", "coder")
  Task("Test Lead", "Setup testing framework", "tester")
  
  // Batch bash commands
  Bash "npx create-next-app@latest pm33-website --typescript --tailwind --app"
  Bash "cd pm33-website && npm install @geist-ui/core @geist-ui/icons framer-motion"
  Bash "npm install -D @testing-library/react jest"
  
  // Batch file creation
  Write "src/lib/theme.ts"
  Write "src/app/layout.tsx"
  Write "src/app/page.tsx"
  Write "config/tailwind.config.js"
```

## 🎨 Warm Geist Theme Configuration

### Theme Setup (MUST be in src/lib/theme.ts)
```typescript
// src/lib/theme.ts - NOT in root!
export const pm33Theme = {
  type: 'custom',
  palette: {
    // Warmer than default Geist
    primary: '#4F46E5',      // Warm indigo
    secondary: '#7C3AED',    // Friendly purple
    success: '#10B981',      // Emerald
    warning: '#F59E0B',      // Amber
    
    // Community accent colors
    coral: '#FB7185',
    cyan: '#06B6D4',
    
    // Warm backgrounds
    background: '#FAFAF9',
    foreground: '#1C1917',
  },
  
  radius: {
    // Softer for friendlier feel
    xs: '6px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  }
}
```

## 💻 Core Pages to Build

### Homepage Development Pattern
```javascript
[Single Message - Homepage Implementation]:
  // Spawn specialized agents
  Task("Hero Developer", "Build hero section with rotating headlines", "coder")
  Task("Calculator Developer", "Embed velocity calculator", "coder")
  Task("Features Developer", "Create bento-box feature grid", "coder")
  Task("Conversion Optimizer", "Add analytics tracking", "coder")
  Task("Mobile Developer", "Ensure mobile responsiveness", "mobile-dev")
  
  // All file writes together
  Write "src/app/page.tsx"
  Write "src/components/Hero.tsx"
  Write "src/components/VelocityCalculator.tsx"
  Write "src/components/FeatureGrid.tsx"
  Write "src/components/CTASection.tsx"
  
  // All tests together
  Write "tests/homepage.test.tsx"
  Write "tests/calculator.test.tsx"
```

### Velocity Calculator (Primary Conversion Tool)
```typescript
// src/components/VelocityCalculator.tsx
import { Card, Input, Button, Text } from '@geist-ui/core'

interface VelocityCalculatorProps {
  variant: 'full' | 'embedded' | 'mini'
  onComplete?: (data: VelocityData) => void
}

// Key metrics to calculate:
// - Team velocity improvement: 3x
// - Monthly savings: $15K average
// - ROI: 340%
// - Additional features per month: 10
```

## 📊 Critical Success Metrics

**Performance Requirements:**
- Page Load: <2s (Lighthouse 95+)
- Mobile Score: 95+
- SEO Score: 100
- Accessibility: WCAG 2.1 AA

**Conversion Targets:**
- Homepage → Tool: 40%
- Tool → Signup: 25%
- Signup → Trial: 20%
- Trial → Paid: 25%

## 🚦 Analytics Integration Pattern

```javascript
[Single Message - Analytics Setup]:
  Task("Analytics Engineer", "Setup PostHog tracking", "backend-dev")
  Task("Conversion Tracker", "Implement funnel events", "coder")
  
  Write "src/lib/analytics.ts"
  Write "src/hooks/useAnalytics.ts"
  Write "src/components/TrackedButton.tsx"
  
  TodoWrite { todos: [
    {content: "Track calculator starts", priority: "high"},
    {content: "Track calculator completions", priority: "high"},
    {content: "Track email captures", priority: "high"},
    {content: "Track CTA clicks", priority: "medium"},
    {content: "Track page views", priority: "medium"}
  ]}
```

## 🔍 SEO Implementation

```javascript
[Single Message - SEO Optimization]:
  Task("SEO Specialist", "Optimize meta tags and structure", "coder")
  Task("Content Developer", "Create template pages", "coder")
  
  // Batch template creation
  Write "src/app/templates/prd-generator/page.tsx"
  Write "src/app/templates/sprint-planning/page.tsx"
  Write "src/app/templates/roadmap-builder/page.tsx"
  
  // Target keywords in URLs
  // - /velocity-tracker (primary PLG tool)
  // - /templates/* (SEO long-tail)
  // - /pricing (conversion page)
```

## 🎯 SPARC Workflow for Website Development

### 1. Specification Phase
```bash
npx claude-flow sparc run spec-pseudocode "Marketing website with velocity calculator"
```

### 2. Architecture Phase
```bash
npx claude-flow sparc run architect "Next.js Geist UI website architecture"
```

### 3. TDD Implementation
```bash
npx claude-flow sparc tdd "Homepage with embedded calculator"
npx claude-flow sparc tdd "Pricing page with token tiers"
npx claude-flow sparc tdd "Template library for SEO"
```

### 4. Integration Phase
```bash
npx claude-flow sparc run integration "Stripe and analytics integration"
```

## ⚠️ Common Pitfalls to Avoid

1. **DON'T use Mantine** - Use Geist UI only
2. **DON'T save to root** - Always use src/, tests/, etc.
3. **DON'T hardcode colors** - Use theme variables
4. **DON'T skip mobile** - 60% of traffic is mobile
5. **DON'T forget analytics** - Track every interaction
6. **DON'T work sequentially** - Spawn all agents concurrently

## 🚀 Week 1 Sprint with Concurrent Execution

```javascript
[Single Message - Complete Week 1 Development]:
  // Spawn ALL development agents
  Task("Homepage Dev", "Build complete homepage with hero, calculator, features", "coder")
  Task("Pricing Dev", "Create pricing page with token tiers", "coder")
  Task("Calculator Dev", "Implement full velocity calculator", "coder")
  Task("Template Dev", "Create 5 SEO template pages", "coder")
  Task("API Dev", "Setup API routes for calculator and leads", "backend-dev")
  Task("Test Engineer", "Write tests for all components", "tester")
  Task("Performance Engineer", "Optimize for <2s load", "perf-analyzer")
  Task("Mobile Dev", "Ensure mobile responsiveness", "mobile-dev")
  
  // Create ALL todos at once
  TodoWrite { todos: [
    {content: "Setup Next.js with Geist UI", priority: "high"},
    {content: "Create warm theme overrides", priority: "high"},
    {content: "Build homepage hero section", priority: "high"},
    {content: "Implement velocity calculator", priority: "high"},
    {content: "Create pricing page", priority: "high"},
    {content: "Build 5 template pages", priority: "medium"},
    {content: "Setup analytics tracking", priority: "medium"},
    {content: "Add email capture forms", priority: "medium"},
    {content: "Optimize performance", priority: "low"},
    {content: "Write component tests", priority: "low"}
  ]}
  
  // Batch ALL file operations
  Bash "mkdir -p src/{app,components,lib,hooks} tests config public"
  Write "src/app/page.tsx"
  Write "src/app/pricing/page.tsx"
  Write "src/app/velocity-tracker/page.tsx"
  Write "src/components/VelocityCalculator.tsx"
  Write "src/lib/theme.ts"
  Write "tests/homepage.test.tsx"
```

## 📈 Success Validation

### Performance Checks
```bash
npm run build
npm run lighthouse
npm run test
```

### Conversion Tracking
- Calculator completion rate >15%
- Email capture rate >20%
- Homepage bounce rate <40%

## 🔗 Resources

- [Geist UI Documentation](https://geist-ui.dev)
- [Next.js App Router](https://nextjs.org/docs/app)
- [SPARC Methodology](https://github.com/ruvnet/claude-flow)
- [PM33 Brand Guidelines](internal)

---

**Remember**: 
- **Concurrent execution** = All agents in ONE message
- **File organization** = NEVER save to root
- **Geist UI only** = No Mantine components
- **Warm theme** = Community-friendly colors
- **Track everything** = Analytics on all interactions