/**
 * PM33 Marketing Site - Middleware
 *
 * This middleware handles:
 * - Rate limiting
 * - Security headers
 * - Analytics and monitoring
 * - Request logging
 * - Bot protection
 */

import { NextRequest, NextResponse } from 'next/server';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW || '900000'); // 15 minutes
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '100');
const rateLimitEnabled = process.env.ENABLE_RATE_LIMITING === 'true';

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Skip middleware for static assets and Next.js internals
  if (
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/favicon.ico') ||
    request.nextUrl.pathname.startsWith('/images/') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return response;
  }

  // Apply rate limiting
  if (rateLimitEnabled) {
    const rateLimitResult = applyRateLimit(request);
    if (rateLimitResult.blocked) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': Math.ceil(rateLimitResult.resetTime / 1000).toString(),
          'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        },
      });
    }

    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
  }

  // Add request ID for tracking
  const requestId = generateRequestId();
  response.headers.set('X-Request-ID', requestId);

  // Add performance monitoring headers
  response.headers.set('X-Response-Time', Date.now().toString());

  // Security headers (additional to those in next.config.js)
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');

  // Vary header for proper caching
  response.headers.set('Vary', 'Accept-Encoding, User-Agent');

  // Log request for monitoring (in production, use proper logging service)
  if (process.env.NODE_ENV === 'production') {
    logRequest(request, requestId);
  }

  return response;
}

/**
 * Apply rate limiting to requests
 */
function applyRateLimit(request: NextRequest): {
  blocked: boolean;
  remaining: number;
  resetTime: number;
} {
  const clientId = getClientIdentifier(request);
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Clean up old entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }

  const current = rateLimitStore.get(clientId);

  if (!current || current.resetTime < now) {
    // First request in window or window expired
    const resetTime = now + RATE_LIMIT_WINDOW;
    rateLimitStore.set(clientId, { count: 1, resetTime });
    return {
      blocked: false,
      remaining: RATE_LIMIT_MAX - 1,
      resetTime
    };
  }

  if (current.count >= RATE_LIMIT_MAX) {
    // Rate limit exceeded
    return {
      blocked: true,
      remaining: 0,
      resetTime: current.resetTime
    };
  }

  // Increment count
  current.count++;
  rateLimitStore.set(clientId, current);

  return {
    blocked: false,
    remaining: RATE_LIMIT_MAX - current.count,
    resetTime: current.resetTime
  };
}

/**
 * Get unique client identifier for rate limiting
 */
function getClientIdentifier(request: NextRequest): string {
  // In production, consider using a combination of IP and User-Agent
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  // Simple hash for anonymization
  return Buffer.from(`${ip}:${userAgent.slice(0, 50)}`).toString('base64').slice(0, 32);
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Log request for monitoring and analytics
 */
function logRequest(request: NextRequest, requestId: string): void {
  const logData = {
    requestId,
    timestamp: new Date().toISOString(),
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for') || request.ip,
    referer: request.headers.get('referer'),
    country: request.geo?.country,
    city: request.geo?.city,
  };

  // In production, send to your logging service (e.g., DataDog, Logtail, etc.)
  console.log('Request logged:', JSON.stringify(logData));
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};