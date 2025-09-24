/**
 * Bundle Analyzer Configuration for PM33 Marketing Site
 *
 * This configuration enables webpack bundle analysis to identify
 * bundle size issues and optimization opportunities.
 */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
  analyzerMode: 'static',
  reportFilename: './bundle-analysis.html'
});

// Base Next.js configuration
const nextConfig = require('./next.config.js');

module.exports = withBundleAnalyzer(nextConfig);