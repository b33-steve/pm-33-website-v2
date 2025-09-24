import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PM33 - Ship 3x Faster with AI-Powered Product Management',
  description: 'PM33 helps product teams ship faster with AI-powered prioritization, PRD generation, and velocity tracking.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}