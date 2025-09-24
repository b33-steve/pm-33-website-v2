/** @type {import('next').NextConfig} */

// Bundle analyzer integration
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  // Image optimization configuration
  images: {
    domains: ['localhost', 'pm33.com', 'staging.pm33.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Output configuration for Docker standalone
  output: 'standalone',

  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@tailwindcss/typography',
      'react',
      'react-dom'
    ],
    // Enable React Server Components optimizations
    serverComponentsExternalPackages: ['framer-motion'],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
    // Enable emotion for better CSS-in-JS performance
    styledComponents: false,
  },

  // Webpack configuration for advanced optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Code splitting optimizations
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Framework chunk
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // Libraries chunk
            lib: {
              test(module) {
                return module.size() > 160000 &&
                  /node_modules[\\/]/.test(module.identifier());
              },
              name(module) {
                const hash = require('crypto').createHash('sha1');
                hash.update(module.identifier());
                return hash.digest('hex').substring(0, 8);
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            // Common components
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
              priority: 20,
              test: /[\\/]components[\\/]/,
            },
            // Async chunks for lazy loaded components
            shared: {
              name: 'shared',
              priority: 10,
              test: /[\\/]node_modules[\\/]/,
              chunks: 'async',
              reuseExistingChunk: true,
            },
          },
        },
      }

      // Minimize bundle size
      config.optimization.minimize = true;

      // Tree shaking for Framer Motion
      config.resolve.alias = {
        ...config.resolve.alias,
        'framer-motion': require.resolve('framer-motion'),
      };
    }

    return config;
  },

  // Enable SWC minification
  swcMinify: true,

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // API rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },

  // Security headers
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          // Prevent XSS attacks
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Referrer policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          // Strict Transport Security (HTTPS only)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: getContentSecurityPolicy()
          }
        ],
      },
      {
        // Cache control for static assets
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Cache control for images
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400'
          }
        ]
      }
    ];
  },

  // Redirects for legacy URLs
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

/**
 * Generate Content Security Policy
 */
function getContentSecurityPolicy() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const csp = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-eval'", // Required for Next.js development
      "'unsafe-inline'", // Required for Tailwind CSS
      ...(isDevelopment ? ["'unsafe-eval'"] : []),
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://cdn.vercel-insights.com',
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for Tailwind CSS
      'https://fonts.googleapis.com',
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      'https://www.google-analytics.com',
    ],
    'font-src': [
      "'self'",
      'data:',
      'https://fonts.gstatic.com',
    ],
    'connect-src': [
      "'self'",
      'https://www.google-analytics.com',
      'https://vitals.vercel-insights.com',
      ...(isDevelopment ? ['ws://localhost:*', 'http://localhost:*'] : []),
      process.env.NEXT_PUBLIC_CORE_APP_URL || '',
    ].filter(Boolean),
    'frame-ancestors': ["'none'"],
    'form-action': ["'self'"],
    'base-uri': ["'self'"],
    'object-src': ["'none'"],
    'worker-src': ["'self'", 'blob:'],
    'child-src': ["'self'"],
    'frame-src': ["'none'"],
    'media-src': ["'self'"],
  };

  // Convert CSP object to string
  return Object.entries(csp)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

// Export with bundle analyzer wrapper
module.exports = withBundleAnalyzer(nextConfig);