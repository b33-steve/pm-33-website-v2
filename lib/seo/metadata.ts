import type { Metadata } from 'next'

// Base site configuration
export const siteConfig = {
  name: 'PM33',
  description: 'Eliminate 78% of PM busywork with AI-powered strategic intelligence, automated PRDs, and real-time velocity tracking.',
  url: 'https://pm-33.com',
  ogImage: 'https://pm-33.com/og-image.jpg',
  keywords: [
    'product management',
    'PM tool',
    'velocity tracking',
    'strategic intelligence',
    'PRD automation',
    'product manager',
    'agile',
    'scrum',
    'product development',
    'AI-powered',
    'productivity',
    'workflow optimization'
  ],
  authors: [
    {
      name: 'PM33 Team',
      url: 'https://pm-33.com',
    },
  ],
  creator: 'PM33',
  publisher: 'PM33',
  category: 'Technology',
}

// Default metadata for the application
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Ship 3x Faster with Strategic Intelligence`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  category: siteConfig.category,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: `${siteConfig.name} - Ship 3x Faster with Strategic Intelligence`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Ship 3x Faster with Strategic Intelligence`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - Ship 3x Faster with Strategic Intelligence`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@PM33',
    site: '@PM33',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
}

// Generate metadata for specific pages
export function generateMetadata({
  title,
  description,
  image,
  url,
  keywords = [],
  noIndex = false,
  canonical,
}: {
  title?: string
  description?: string
  image?: string
  url?: string
  keywords?: string[]
  noIndex?: boolean
  canonical?: string
}): Metadata {
  return {
    title: title ? `${title} | ${siteConfig.name}` : defaultMetadata.title,
    description: description || siteConfig.description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: canonical || url || '/',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: title || `${siteConfig.name} - Ship 3x Faster with Strategic Intelligence`,
      description: description || siteConfig.description,
      url: url || siteConfig.url,
      images: [
        {
          url: image || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title || `${siteConfig.name} - Ship 3x Faster with Strategic Intelligence`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title || `${siteConfig.name} - Ship 3x Faster with Strategic Intelligence`,
      description: description || siteConfig.description,
      images: [image || siteConfig.ogImage],
    },
  }
}

// Specific page metadata
export const pageMetadata = {
  home: generateMetadata({
    title: 'Ship 3x Faster with Strategic Intelligence',
    description: 'Eliminate 78% of PM busywork with AI-powered strategic intelligence, automated PRDs, and real-time velocity tracking. Join 2,500+ product managers.',
    keywords: ['product management software', 'AI product management', 'velocity tracking'],
  }),

  velocityTracker: generateMetadata({
    title: 'Velocity Tracker - Real-time Product Development Metrics',
    description: 'Track your team\'s velocity with real-time metrics and AI-powered insights. Identify bottlenecks and optimize your product development process.',
    keywords: ['velocity tracking', 'product metrics', 'development speed', 'team productivity'],
  }),

  pricing: generateMetadata({
    title: 'Pricing - Transparent Plans for Every Team Size',
    description: 'Choose the perfect plan for your team. Start free, scale as you grow. No hidden fees, cancel anytime.',
    keywords: ['pricing', 'plans', 'cost', 'subscription', 'product management pricing'],
  }),

  features: generateMetadata({
    title: 'Features - Complete Product Management Platform',
    description: 'Discover all PM33 features: Strategic Intelligence, PRD automation, backlog management, velocity tracking, and more.',
    keywords: ['product management features', 'PRD automation', 'strategic intelligence', 'backlog management'],
  }),

  integrations: generateMetadata({
    title: 'Integrations - Connect Your Existing Tools',
    description: 'Seamlessly integrate with Jira, GitHub, Slack, and 50+ other tools. Centralize your product management workflow.',
    keywords: ['integrations', 'Jira integration', 'GitHub integration', 'Slack integration', 'API'],
  }),

  blog: generateMetadata({
    title: 'Blog - Product Management Insights and Best Practices',
    description: 'Expert insights on product management, agile methodologies, team productivity, and industry trends.',
    keywords: ['product management blog', 'PM insights', 'agile', 'product strategy'],
  }),

  about: generateMetadata({
    title: 'About - The Future of Product Management',
    description: 'Learn about PM33\'s mission to revolutionize product management with AI-powered intelligence and automation.',
    keywords: ['about PM33', 'company', 'mission', 'product management tools'],
  }),

  contact: generateMetadata({
    title: 'Contact - Get in Touch',
    description: 'Contact our team for support, partnerships, or general inquiries. We\'re here to help you succeed.',
    keywords: ['contact', 'support', 'help', 'sales'],
  }),

  privacy: generateMetadata({
    title: 'Privacy Policy',
    description: 'PM33 privacy policy - how we collect, use, and protect your data.',
    noIndex: true,
  }),

  terms: generateMetadata({
    title: 'Terms of Service',
    description: 'PM33 terms of service and user agreement.',
    noIndex: true,
  }),
}

// JSON-LD structured data
export const generateStructuredData = (type: 'WebSite' | 'Organization' | 'Product' | 'SoftwareApplication', data?: any) => {
  const baseData = {
    '@context': 'https://schema.org',
  }

  switch (type) {
    case 'WebSite':
      return {
        ...baseData,
        '@type': 'WebSite',
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }

    case 'Organization':
      return {
        ...baseData,
        '@type': 'Organization',
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+1-555-PM33-HELP',
          contactType: 'Customer Service',
          availableLanguage: ['English'],
        },
        sameAs: [
          'https://twitter.com/PM33',
          'https://linkedin.com/company/pm33',
          'https://github.com/pm33',
        ],
      }

    case 'SoftwareApplication':
      return {
        ...baseData,
        '@type': 'SoftwareApplication',
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'ProjectManagementSoftware',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          priceValidUntil: '2025-12-31',
          availability: 'https://schema.org/InStock',
          description: 'Free plan available',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '2500',
          bestRating: '5',
          worstRating: '1',
        },
        screenshot: `${siteConfig.url}/screenshot.jpg`,
        softwareVersion: '2.0',
        ...data,
      }

    default:
      return baseData
  }
}