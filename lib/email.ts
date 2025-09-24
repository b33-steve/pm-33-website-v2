// import { Resend } from 'resend' // TODO: Install resend package
import { analytics } from './analytics'

// const resend = new Resend(process.env.RESEND_API_KEY)
const resend = null as any // Mock for build

interface User {
  id: string
  email: string
  name?: string
  company?: string
}

interface VelocityData {
  current_score: number
  projected_score: number
  improvement_percentage: number
  monthly_savings: number
  team_size: number
  recommendations: string[]
}

interface EmailTemplate {
  welcome: {
    subject: string
    user_name: string
  }
  velocity_report: {
    subject: string
    report_data: VelocityData
    download_link: string
  }
  trial_ending: {
    subject: string
    days_remaining: number
    upgrade_link: string
  }
  template_download: {
    subject: string
    template_name: string
    download_link: string
  }
}

// Email templates as React components would go here
// For now, we'll use simple HTML templates

function createWelcomeEmailHTML(userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to PM33</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #6366f1; margin-bottom: 10px;">Welcome to PM33!</h1>
        <p style="font-size: 18px; color: #666;">Let's 3x your team's velocity</p>
      </div>

      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #1e293b; margin-top: 0;">Hi ${userName || 'there'}! 👋</h2>
        <p>Thanks for joining the PM33 community! You're now part of a group of forward-thinking product managers who are transforming how software gets built.</p>

        <h3 style="color: #475569;">What's next?</h3>
        <ul style="padding-left: 20px;">
          <li><strong>Try the Velocity Calculator:</strong> Get your team's baseline score</li>
          <li><strong>Download Templates:</strong> Access our proven PM frameworks</li>
          <li><strong>Join the Community:</strong> Connect with other product leaders</li>
          <li><strong>Book a Demo:</strong> See how PM33 can transform your workflow</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://pm-33.com/velocity-calculator" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Calculate Your Velocity →</a>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center; color: #64748b; font-size: 14px;">
        <p>Need help? Reply to this email or visit our <a href="https://pm-33.com/help" style="color: #6366f1;">Help Center</a></p>
        <p>PM33 • Building better software, faster</p>
      </div>
    </body>
    </html>
  `
}

function createVelocityReportEmailHTML(data: VelocityData, reportUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your PM33 Velocity Report</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #6366f1; margin-bottom: 10px;">Your Velocity Analysis</h1>
        <p style="font-size: 18px; color: #666;">Here's how your team can improve</p>
      </div>

      <div style="background: #f0f9ff; border: 1px solid #0ea5e9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #0c4a6e; margin-top: 0;">📊 Your Results</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
          <div style="text-align: center;">
            <div style="font-size: 36px; font-weight: bold; color: #dc2626;">${data.current_score}</div>
            <div style="color: #666; font-size: 14px;">Current Score</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 36px; font-weight: bold; color: #059669;">${data.projected_score}</div>
            <div style="color: #666; font-size: 14px;">Projected Score</div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <div style="font-size: 24px; font-weight: bold; color: #7c3aed;">+${data.improvement_percentage}%</div>
          <div style="color: #666;">Velocity Improvement</div>
        </div>
      </div>

      <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="color: #064e3b; margin-top: 0;">💰 Potential Monthly Savings</h3>
        <div style="text-align: center;">
          <div style="font-size: 32px; font-weight: bold; color: #059669;">$${data.monthly_savings.toLocaleString()}</div>
          <p style="color: #065f46; margin: 10px 0;">With PM33's proven methodology</p>
        </div>
      </div>

      <div style="background: #fefce8; border: 1px solid #eab308; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="color: #713f12; margin-top: 0;">🎯 Top Recommendations</h3>
        <ul style="padding-left: 20px; color: #92400e;">
          ${data.recommendations.map(rec => `<li style="margin-bottom: 8px;">${rec}</li>`).join('')}
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${reportUrl}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; margin-right: 10px;">Download Full Report →</a>
        <a href="https://pm-33.com/demo" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Book a Demo →</a>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center; color: #64748b; font-size: 14px;">
        <p>Ready to 3x your velocity? <a href="https://pm-33.com/pricing" style="color: #6366f1;">Choose your plan</a></p>
        <p>PM33 • Building better software, faster</p>
      </div>
    </body>
    </html>
  `
}

function createTemplateDownloadEmailHTML(templateName: string, downloadLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your PM33 Template Download</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #6366f1; margin-bottom: 10px;">Your Template is Ready!</h1>
        <p style="font-size: 18px; color: #666;">${templateName}</p>
      </div>

      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #1e293b; margin-top: 0;">📋 ${templateName}</h2>
        <p>This battle-tested template has helped hundreds of product teams ship faster and with higher quality.</p>

        <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #475569;">How to use this template:</h4>
          <ol style="padding-left: 20px; color: #64748b;">
            <li>Customize it for your product and team</li>
            <li>Share with stakeholders for alignment</li>
            <li>Use it as a living document throughout development</li>
            <li>Iterate based on feedback and learnings</li>
          </ol>
        </div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${downloadLink}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Download Template →</a>
      </div>

      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <h3 style="color: #0c4a6e; margin-top: 0;">🚀 Want More?</h3>
        <p style="color: #0369a1;">Get access to our complete library of PM templates, plus AI-powered analysis tools:</p>
        <ul style="color: #0369a1; padding-left: 20px;">
          <li>50+ proven templates and frameworks</li>
          <li>AI-powered strategic analysis</li>
          <li>Velocity optimization tools</li>
          <li>Priority PM community access</li>
        </ul>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://pm-33.com/pricing" style="background: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Upgrade to Pro →</a>
        </div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center; color: #64748b; font-size: 14px;">
        <p>Questions? Reply to this email or visit our <a href="https://pm-33.com/help" style="color: #6366f1;">Help Center</a></p>
        <p>PM33 • Building better software, faster</p>
      </div>
    </body>
    </html>
  `
}

class EmailService {
  private fromAddress = 'PM33 <noreply@pm-33.com>'
  private replyToAddress = 'hello@pm-33.com'

  async sendWelcomeEmail(user: User): Promise<void> {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.log('Resend API key not configured, skipping email')
        return
      }

      const htmlContent = createWelcomeEmailHTML(user.name || '')

      await resend.emails.send({
        from: this.fromAddress,
        to: user.email,
        replyTo: this.replyToAddress,
        subject: 'Welcome to PM33 - Let\'s 3x Your Velocity 🚀',
        html: htmlContent
      })

      console.log('Welcome email sent to:', user.email)

      // Track email sent
      analytics.track('Email Sent' as any, {
        email_type: 'welcome',
        recipient: user.email,
        user_id: user.id
      })

    } catch (error) {
      console.error('Failed to send welcome email:', error)
      throw error
    }
  }

  async sendVelocityReport(email: string, data: VelocityData): Promise<void> {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.log('Resend API key not configured, skipping email')
        return
      }

      const reportUrl = await this.generateReportURL(data)
      const htmlContent = createVelocityReportEmailHTML(data, reportUrl)

      await resend.emails.send({
        from: this.fromAddress,
        to: email,
        replyTo: this.replyToAddress,
        subject: `Your Team Could Save $${data.monthly_savings.toLocaleString()}/month - PM33 Velocity Report`,
        html: htmlContent
      })

      console.log('Velocity report sent to:', email)

      // Track email sent
      analytics.track('Report Emailed', {
        email,
        velocity_score: data.current_score
      })

    } catch (error) {
      console.error('Failed to send velocity report:', error)
      throw error
    }
  }

  async sendTemplateDownload(email: string, templateName: string, downloadLink: string): Promise<void> {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.log('Resend API key not configured, skipping email')
        return
      }

      const htmlContent = createTemplateDownloadEmailHTML(templateName, downloadLink)

      await resend.emails.send({
        from: this.fromAddress,
        to: email,
        replyTo: this.replyToAddress,
        subject: `Your ${templateName} template is ready to download`,
        html: htmlContent
      })

      console.log('Template download email sent to:', email)

      // Track email sent
      analytics.track('Email Sent' as any, {
        email_type: 'template_download',
        template_name: templateName,
        recipient: email
      })

    } catch (error) {
      console.error('Failed to send template download email:', error)
      throw error
    }
  }

  async sendTrialEndingNotification(user: User, daysRemaining: number): Promise<void> {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.log('Resend API key not configured, skipping email')
        return
      }

      const upgradeLink = 'https://pm-33.com/pricing'

      await resend.emails.send({
        from: this.fromAddress,
        to: user.email,
        replyTo: this.replyToAddress,
        subject: `Your PM33 trial ends in ${daysRemaining} days`,
        html: `
          <h1>Your trial is ending soon</h1>
          <p>Hi ${user.name || 'there'},</p>
          <p>Your PM33 trial ends in ${daysRemaining} days. Don't lose access to your velocity optimization tools!</p>
          <a href="${upgradeLink}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Upgrade Now</a>
        `
      })

      console.log('Trial ending notification sent to:', user.email)

    } catch (error) {
      console.error('Failed to send trial ending notification:', error)
      throw error
    }
  }

  async addToNewsletter(email: string, source: string = 'website'): Promise<void> {
    try {
      if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
        console.log('Resend not configured for newsletter, skipping')
        return
      }

      // Add to Resend audience
      await resend.contacts.create({
        email,
        audienceId: process.env.RESEND_AUDIENCE_ID,
        firstName: '', // Would be extracted from form if available
        lastName: '',
        unsubscribed: false,
      })

      console.log('Added to newsletter:', email)

      // Track subscription
      analytics.track('Newsletter Subscribed' as any, {
        email,
        source
      })

    } catch (error) {
      console.error('Failed to add to newsletter:', error)
      // Don't throw error for newsletter subscription failures
    }
  }

  private async generateReportURL(data: VelocityData): Promise<string> {
    // In a real application, you would:
    // 1. Generate a PDF report
    // 2. Upload it to cloud storage (S3, etc.)
    // 3. Return the download URL

    // For now, return a placeholder URL
    const reportId = Date.now().toString(36)
    return `https://pm-33.com/reports/${reportId}`
  }

  // Utility method to validate email addresses
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Utility method to get unsubscribe link
  getUnsubscribeLink(email: string): string {
    // In production, this would include a secure token
    return `https://pm-33.com/unsubscribe?email=${encodeURIComponent(email)}`
  }
}

export const email = new EmailService()
export type { VelocityData, User, EmailTemplate }