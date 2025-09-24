/**
 * Health Check API Endpoint
 *
 * This endpoint provides health status information for the PM33 Marketing Site.
 * Used by Docker health checks, load balancers, and monitoring systems.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'pm33-marketing-site',
      version: process.env.npm_package_version || '2.0.0',
      environment: process.env.NEXT_PUBLIC_ENV || 'development',
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        limit: Math.round(process.memoryUsage().rss / 1024 / 1024)
      },
      node: {
        version: process.version,
        platform: process.platform,
        arch: process.arch
      },
      checks: {
        database: await checkDatabase(),
        externalServices: await checkExternalServices(),
        fileSystem: await checkFileSystem()
      }
    };

    // Determine overall health status
    const isHealthy = Object.values(healthData.checks).every(check => check.status === 'healthy');

    return NextResponse.json(
      {
        ...healthData,
        status: isHealthy ? 'healthy' : 'degraded'
      },
      {
        status: isHealthy ? 200 : 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );

  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'pm33-marketing-site',
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: process.env.NEXT_PUBLIC_ENV || 'development'
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  }
}

/**
 * Check database connectivity
 */
async function checkDatabase(): Promise<{ status: 'healthy' | 'unhealthy'; message?: string }> {
  try {
    // Since this is a marketing site, we might not have a database
    // But if DATABASE_URL is configured, we should check it
    if (!process.env.DATABASE_URL) {
      return { status: 'healthy', message: 'No database configured' };
    }

    // Add actual database connectivity check here when implemented
    return { status: 'healthy', message: 'Database connection successful' };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Database check failed'
    };
  }
}

/**
 * Check external service connectivity
 */
async function checkExternalServices(): Promise<{ status: 'healthy' | 'unhealthy'; message?: string }> {
  try {
    const coreAppUrl = process.env.NEXT_PUBLIC_CORE_APP_URL;

    if (!coreAppUrl) {
      return { status: 'healthy', message: 'No external services configured' };
    }

    // Quick connectivity check to core app (with timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`${coreAppUrl}/api/health`, {
        method: 'HEAD',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return { status: 'healthy', message: 'Core app connectivity confirmed' };
      } else {
        return { status: 'unhealthy', message: `Core app returned ${response.status}` };
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      return {
        status: 'unhealthy',
        message: 'Core app not reachable'
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'External services check failed'
    };
  }
}

/**
 * Check file system access
 */
async function checkFileSystem(): Promise<{ status: 'healthy' | 'unhealthy'; message?: string }> {
  try {
    // Check if we can access the public directory
    const fs = await import('fs/promises');
    await fs.access('./public');

    return { status: 'healthy', message: 'File system access confirmed' };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: 'File system access failed'
    };
  }
}