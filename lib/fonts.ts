import { Inter, JetBrains_Mono } from 'next/font/google'

// Primary font - Inter for body text and UI
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevent invisible text during font swap
  preload: true,
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'sans-serif'
  ],
})

// Monospace font for code blocks (if needed)
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  fallback: [
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'monospace'
  ],
})

// Font optimization utilities
export const fontOptimizationCSS = `
  /* Font loading optimization */
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Inter Regular'), local('Inter-Regular');
  }

  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-display: swap;
    src: local('Inter Medium'), local('Inter-Medium');
  }

  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: local('Inter SemiBold'), local('Inter-SemiBold');
  }

  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: local('Inter Bold'), local('Inter-Bold');
  }

  /* System font fallback stack */
  .font-system {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }

  /* Prevent layout shift during font load */
  .font-inter {
    font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    font-feature-settings: 'rlig' 1, 'calt' 1, 'ss01' 1;
  }

  /* Critical font loading styles */
  html {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }

  html.fonts-loaded {
    font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
`

// Font loading optimization script (to be injected in head)
export const fontLoadingScript = `
  (function() {
    // Check if Inter font is already available
    if (document.fonts && document.fonts.check) {
      if (document.fonts.check('12px Inter')) {
        document.documentElement.classList.add('fonts-loaded');
      } else {
        // Load fonts asynchronously
        document.fonts.ready.then(function() {
          document.documentElement.classList.add('fonts-loaded');
        });
      }
    } else {
      // Fallback for browsers without Font Loading API
      setTimeout(function() {
        document.documentElement.classList.add('fonts-loaded');
      }, 100);
    }
  })();
`

// Preload critical font files
export const fontPreloadLinks = [
  {
    rel: 'preload',
    href: '/fonts/inter-regular.woff2',
    as: 'font',
    type: 'font/woff2',
    crossOrigin: '',
  },
  {
    rel: 'preload',
    href: '/fonts/inter-medium.woff2',
    as: 'font',
    type: 'font/woff2',
    crossOrigin: '',
  },
  {
    rel: 'preload',
    href: '/fonts/inter-semibold.woff2',
    as: 'font',
    type: 'font/woff2',
    crossOrigin: '',
  },
  {
    rel: 'preload',
    href: '/fonts/inter-bold.woff2',
    as: 'font',
    type: 'font/woff2',
    crossOrigin: '',
  },
]