# Homepage Interactive Demo Product Requirements Document
## PM33 Marketing Website - Velocity Calculator & Conversion Flow

**Version:** 1.0  
**Date:** September 2025  
**Component:** Interactive Demo (Homepage Hero)  
**Objective:** Drive 40% visitor → tool usage → 25% signup conversion

---

## 1. Executive Summary

### 1.1 Purpose
Create an interactive velocity calculator demo embedded directly in the homepage hero section that demonstrates immediate value, captures leads, and drives signups to the free tier without friction.

### 1.2 Success Metrics
- **Engagement Rate**: 40% of visitors interact with demo
- **Completion Rate**: 60% complete the calculation
- **Soft Conversion**: 25% provide email for detailed report
- **Hard Conversion**: 10% sign up for free tier
- **Time to Value**: <30 seconds to see results

### 1.3 User Flow
```
Land on Homepage → See Demo in Hero → Input Team Data → 
See Results → "Wow" Moment → Get Full Report (Email) → 
Sign Up for Free Tier → Activate Account
```

---

## 2. Interactive Demo Specifications

### 2.1 Demo Component Structure

#### Location: Homepage Hero Section (Right Side)
```tsx
<HeroSection>
  <Grid.Container>
    <Grid xs={24} md={12}>
      {/* Left: Headlines & CTAs */}
    </Grid>
    <Grid xs={24} md={12}>
      {/* Right: Interactive Demo */}
      <InteractiveVelocityDemo />
    </Grid>
  </Grid.Container>
</HeroSection>
```

### 2.2 Demo States & Flow

#### State 1: Initial Attraction (0-5 seconds)
```tsx
<DemoContainer>
  {/* Animated placeholder showing transition */}
  <AnimatedComparison>
    <Before>
      <TeamMetric>5 features/month</TeamMetric>
      <Cost>$50K lost opportunity</Cost>
    </Before>
    <ArrowAnimation /> {/* Pulsing arrow */}
    <After>
      <TeamMetric>15 features/month</TeamMetric>
      <Savings>$150K captured value</Savings>
    </After>
  </AnimatedComparison>
  
  <CTAButton pulse={true}>
    Calculate Your Velocity
  </CTAButton>
</DemoContainer>
```

**Specifications:**
- Auto-animates every 3 seconds to catch attention
- Shows dramatic before/after transformation
- Pulsing CTA button to encourage interaction
- Mobile: Full width card
- Desktop: Embedded in hero grid

#### State 2: Input Collection (5-20 seconds)
```tsx
<DemoContainer>
  <ProgressIndicator steps={3} current={1} />
  
  <QuestionCard>
    <Text h4>How large is your product team?</Text>
    <SegmentedControl
      options={[
        { value: '1-5', label: '1-5' },
        { value: '6-10', label: '6-10', recommended: true },
        { value: '11-20', label: '11-20' },
        { value: '20+', label: '20+' }
      ]}
      onChange={handleTeamSize}
    />
  </QuestionCard>
  
  {/* Auto-advance after selection */}
</DemoContainer>
```

**Progressive Questions:**
1. **Team Size** (Segmented control)
2. **Current Velocity** (Visual slider: 1-20 features/month)
3. **Biggest Bottleneck** (Quick select buttons)

**Key Features:**
- Each question on separate card (no overwhelming forms)
- Auto-advance on selection (no submit buttons)
- Visual inputs (sliders, segments) not text fields
- Skip option for immediate results with defaults
- Smooth transitions between questions

#### State 3: Processing Animation (1-2 seconds)
```tsx
<ProcessingState>
  <AIProcessingAnimation>
    {/* Animated brain/network visualization */}
    <AnimatedIcon>🧠</AnimatedIcon>
    <LoadingText>
      Analyzing your velocity potential...
    </LoadingText>
  </AIProcessingAnimation>
  
  {/* Quick facts during loading */}
  <FactRotator>
    "Average team saves 72 hours/month"
    "45% velocity improvement in 30 days"
    "$180K average annual savings"
  </FactRotator>
</ProcessingState>
```

#### State 4: Results Display (20+ seconds)
```tsx
<ResultsContainer>
  {/* Animated number counting up */}
  <VelocityImprovement>
    <CurrentVelocity>
      <Number>5</Number>
      <Label>Current</Label>
    </CurrentVelocity>
    
    <AnimatedArrow />
    
    <PotentialVelocity>
      <CountUpNumber from={5} to={15} duration={2} />
      <Label>With PM33</Label>
      <Badge>3x Faster</Badge>
    </PotentialVelocity>
  </VelocityImprovement>
  
  {/* Key metrics in cards */}
  <MetricsGrid>
    <MetricCard glow="green">
      <Icon>⏱️</Icon>
      <Value>72 hrs/month</Value>
      <Label>Time Saved</Label>
    </MetricCard>
    
    <MetricCard glow="gold">
      <Icon>💰</Icon>
      <Value>$15K/month</Value>
      <Label>Value Created</Label>
    </MetricCard>
    
    <MetricCard glow="purple">
      <Icon>📈</Icon>
      <Value>340% ROI</Value>
      <Label>Return on Investment</Label>
    </MetricCard>
  </MetricsGrid>
  
  {/* Personalized insight */}
  <InsightCard>
    <Text h4>Your Biggest Opportunity</Text>
    <Text>
      Based on your team size and current velocity, 
      automating PRD generation could save 32 hours/month
      and help you ship 3 additional features.
    </Text>
  </InsightCard>
  
  {/* CTA Section */}
  <CTASection>
    <PrimaryCTA>
      Get Detailed Report
      <Subtext>No credit card required</Subtext>
    </PrimaryCTA>
    
    <SecondaryCTA>
      Start Free Trial
    </SecondaryCTA>
  </CTASection>
</ResultsContainer>
```

### 2.3 Detailed Report Modal (Email Capture)

When user clicks "Get Detailed Report":

```tsx
<Modal>
  <ModalContent>
    <Text h3>Your Velocity Analysis Report is Ready!</Text>
    
    {/* Value Preview */}
    <ReportPreview>
      <PreviewImage src="/report-preview.png" />
      <List>
        ✓ 15-page personalized analysis
        ✓ Team-specific recommendations  
        ✓ 90-day improvement roadmap
        ✓ ROI calculations & projections
      </List>
    </ReportPreview>
    
    {/* Email Form */}
    <EmailForm>
      <Input 
        type="email"
        placeholder="your@company.com"
        size="large"
      />
      <Button type="secondary" width="100%">
        Send My Report
        <Badge>FREE</Badge>
      </Button>
    </EmailForm>
    
    {/* Trust Elements */}
    <TrustText>
      <Lock /> We'll also send you our weekly PM insights
      <br />
      <Text small>Unsubscribe anytime. No spam.</Text>
    </TrustText>
  </ModalContent>
</Modal>
```

---

## 3. Conversion Flow to Free Tier

### 3.1 Email Capture → Nurture Flow

After email submission:

1. **Immediate**: Send report PDF via email
2. **Immediate**: Show thank you state with next steps
3. **Day 1**: Welcome email with quick wins
4. **Day 3**: Case study of similar team
5. **Day 7**: Free tier activation reminder
6. **Day 14**: Limited-time premium trial offer

### 3.2 Direct Signup Flow

When user clicks "Start Free Trial" from results:

```
Results → Signup Page → Email/Password → 
Company Info → Free Tier Dashboard
```

#### Signup Page (`/signup`)
```tsx
<SignupPage>
  {/* Progress indicator */}
  <ProgressBar steps={3} current={1} />
  
  {/* Social proof banner */}
  <TrustBanner>
    <Text>Join 2,500+ PMs from</Text>
    <LogoStrip>
      {/* Company logos */}
    </LogoStrip>
  </TrustBanner>
  
  {/* Main form */}
  <SignupForm>
    <Text h2>Start Your Free PM33 Account</Text>
    <Text subheading>
      No credit card required. Full access for 14 days.
    </Text>
    
    {/* OAuth options */}
    <OAuthButtons>
      <GoogleSignup />
      <GitHubSignup />
    </OAuthButtons>
    
    <Divider>or</Divider>
    
    {/* Email signup */}
    <Input 
      type="email"
      placeholder="work@company.com"
      value={prefillFromDemo}
    />
    <Input 
      type="password"
      placeholder="Create password"
    />
    
    <Button type="secondary" size="large" width="100%">
      Create Free Account
    </Button>
    
    {/* Free tier benefits */}
    <FreeAccountIncludes>
      <Text bold>Your free account includes:</Text>
      <List>
        ✓ 100 AI operations/month
        ✓ Velocity tracking dashboard
        ✓ Basic Jira integration
        ✓ 1 team workspace
        ✓ Community support
      </List>
    </FreeAccountIncludes>
  </SignupForm>
  
  {/* Testimonial */}
  <TestimonialCard>
    "PM33 helped us identify $200K in quarterly 
    velocity improvements in just 10 minutes"
    - Sarah Chen, Stripe
  </TestimonialCard>
</SignupPage>
```

### 3.3 Free Tier Activation

After signup completion:

```tsx
<WelcomePage>
  <Text h1>Welcome to PM33! 🎉</Text>
  
  <OnboardingSteps>
    <Step completed>
      <Icon>✓</Icon>
      Account Created
    </Step>
    <Step active>
      <Icon>2</Icon>
      Connect Your Tools
    </Step>
    <Step>
      <Icon>3</Icon>
      See Your First Insights
    </Step>
  </OnboardingSteps>
  
  <QuickStart>
    <Card>
      <Text h3>Connect Jira (Recommended)</Text>
      <Text>
        Import your backlog to get personalized insights
      </Text>
      <Button>Connect Jira</Button>
      <Link>Skip for now</Link>
    </Card>
  </QuickStart>
  
  {/* Value reminder */}
  <ValueReminder>
    Based on your calculator results, PM33 can help you:
    • Ship 10 more features this quarter
    • Save 72 hours of PM busywork
    • Generate $150K in additional value
  </ValueReminder>
</WelcomePage>
```

---

## 4. Technical Implementation

### 4.1 Component Architecture

```tsx
// components/demo/InteractiveVelocityDemo.tsx
interface DemoState {
  stage: 'attract' | 'input' | 'processing' | 'results'
  teamSize?: string
  velocity?: number
  bottleneck?: string
  results?: VelocityResults
}

export function InteractiveVelocityDemo() {
  const [state, setState] = useState<DemoState>({ 
    stage: 'attract' 
  })
  const [email, setEmail] = useState('')
  
  // Track engagement
  useEffect(() => {
    if (state.stage === 'input') {
      analytics.track('Demo Started', {
        location: 'homepage_hero'
      })
    }
  }, [state.stage])
  
  // Auto-advance through questions
  const handleAnswer = (field: string, value: any) => {
    setState(prev => ({ ...prev, [field]: value }))
    
    // Auto-advance logic
    if (field === 'bottleneck') {
      calculateResults()
    }
  }
  
  // Calculate and show results
  const calculateResults = async () => {
    setState(prev => ({ ...prev, stage: 'processing' }))
    
    // Simulate processing
    await delay(2000)
    
    const results = calculateVelocity(state)
    setState(prev => ({ 
      ...prev, 
      stage: 'results',
      results 
    }))
    
    analytics.track('Demo Completed', {
      ...results,
      location: 'homepage_hero'
    })
  }
  
  return (
    <Card className="relative overflow-hidden glass">
      {state.stage === 'attract' && <AttractState />}
      {state.stage === 'input' && <InputState />}
      {state.stage === 'processing' && <ProcessingState />}
      {state.stage === 'results' && <ResultsState />}
    </Card>
  )
}
```

### 4.2 Data Flow

```typescript
// lib/velocity-calculator.ts
interface VelocityInputs {
  teamSize: '1-5' | '6-10' | '11-20' | '20+'
  currentVelocity: number
  bottleneck: 'planning' | 'alignment' | 'execution' | 'testing'
}

interface VelocityResults {
  current: number
  projected: number
  improvement: number
  timeSaved: number
  valueCaptured: number
  roi: number
  recommendations: string[]
}

export function calculateVelocity(inputs: VelocityInputs): VelocityResults {
  // Base calculations
  const teamMultiplier = getTeamMultiplier(inputs.teamSize)
  const bottleneckImpact = getBottleneckImpact(inputs.bottleneck)
  
  // Calculate improvements
  const projected = inputs.currentVelocity * 3 * bottleneckImpact
  const timeSaved = teamMultiplier * 72 // hours per month
  const valueCaptured = projected * 10000 // $10K per feature
  
  return {
    current: inputs.currentVelocity,
    projected: Math.round(projected),
    improvement: Math.round((projected / inputs.currentVelocity - 1) * 100),
    timeSaved,
    valueCaptured,
    roi: Math.round((valueCaptured / 99) * 100), // Based on Team tier
    recommendations: getRecommendations(inputs)
  }
}
```

### 4.3 Analytics Events

```typescript
// Track every step for optimization
analytics.track('Demo Viewed', { stage: 'attract' })
analytics.track('Demo Started', { location: 'homepage_hero' })
analytics.track('Demo Question Answered', { question: 'team_size', value })
analytics.track('Demo Completed', { results })
analytics.track('Report Requested', { email })
analytics.track('Signup Started', { source: 'demo_results' })
analytics.track('Free Tier Activated', { source: 'homepage_demo' })
```

---

## 5. Mobile Considerations

### 5.1 Mobile Layout
- Demo appears below headline on mobile
- Full-width cards instead of grid
- Larger touch targets (minimum 44px)
- Simplified animations for performance

### 5.2 Mobile-Specific Features
- Swipe between questions instead of auto-advance
- Bottom sheet for results display
- Floating CTA buttons
- Haptic feedback on interactions (if supported)

---

## 6. A/B Testing Strategy

### 6.1 Test Variants

#### Test 1: Auto-play vs Click-to-start
- Variant A: Demo auto-animates on page load
- Variant B: Static state until user clicks

#### Test 2: Question Flow
- Variant A: 3 questions (current)
- Variant B: 1 question (team size only)
- Variant C: 5 questions (more detailed)

#### Test 3: Results Display
- Variant A: Focus on velocity (3x faster)
- Variant B: Focus on savings ($15K/month)
- Variant C: Focus on ROI (340%)

#### Test 4: CTA Copy
- Variant A: "Get Detailed Report"
- Variant B: "See My Full Analysis"
- Variant C: "Unlock Your Velocity Score"

### 6.2 Success Metrics
- Primary: Email capture rate
- Secondary: Free tier signups
- Tertiary: Time spent on results

---

## 7. Performance Requirements

### 7.1 Load Performance
- Demo visible within 1.5s (LCP)
- Interactive within 2.5s (TTI)
- No layout shift during animation (CLS < 0.1)

### 7.2 Runtime Performance
- Smooth 60fps animations
- Instant question transitions (<100ms)
- Processing state exactly 2 seconds

### 7.3 Bundle Size
- Demo component: <50KB gzipped
- Lazy load after initial render
- Code split from main bundle

---

## 8. Success Criteria

### Week 1 Goals
- [ ] 40% engagement rate with demo
- [ ] 60% completion rate
- [ ] 25% email capture rate
- [ ] 100+ free tier signups

### Month 1 Goals
- [ ] 50% engagement rate (after optimization)
- [ ] 70% completion rate
- [ ] 30% email capture rate
- [ ] 1,000+ free tier signups
- [ ] 10% free → paid conversion

### Key Learning Metrics
- Which questions have highest drop-off?
- Which results metric drives most conversions?
- Average time to complete demo
- Mobile vs desktop conversion rates

---

## 9. Implementation Phases

### Phase 1: MVP (Week 1)
- Basic 3-question flow
- Simple results display
- Email capture modal
- Basic analytics

### Phase 2: Enhancement (Week 2)
- Animated transitions
- Processing state
- Detailed results
- A/B testing framework

### Phase 3: Optimization (Week 3-4)
- Test variants
- Mobile optimizations
- Conversion improvements
- Advanced analytics

### Phase 4: Scale (Month 2)
- Personalization based on source
- Industry-specific calculations
- Integration previews
- Retargeting setup

---

## 10. Link Destinations

### From Demo Results:
- **"Get Detailed Report"** → Email modal (same page)
- **"Start Free Trial"** → `/signup?source=demo&prefill=true`
- **"See How It Works"** → Scroll to features section

### From Email Success:
- **"Access Dashboard"** → `/signup?source=report&email={email}`
- **"Browse Templates"** → `/templates` (free resources)
- **"Join Community"** → `/community` (PM League)

### From Other CTAs:
- **Nav "Start Free Trial"** → `/signup?source=nav`
- **Hero "Calculate Velocity"** → Scroll to demo
- **Hero "Watch Demo"** → `/demo` (video page)
- **Footer "Get Started"** → `/signup?source=footer`

All paths ultimately lead to `/signup` for the free tier, with source tracking for attribution.