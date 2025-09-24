/**
 * Docker Health Check for PM33 Marketing Site
 *
 * This script performs a basic health check for the containerized application.
 * It verifies that the Next.js server is responding correctly.
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3025,
  path: '/api/health',
  method: 'GET',
  timeout: 2000
};

const healthCheck = http.request(options, (res) => {
  console.log(`Health check status: ${res.statusCode}`);

  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    console.error(`Health check failed with status: ${res.statusCode}`);
    process.exit(1);
  }
});

healthCheck.on('error', (err) => {
  console.error('Health check request failed:', err.message);
  process.exit(1);
});

healthCheck.on('timeout', () => {
  console.error('Health check request timed out');
  healthCheck.destroy();
  process.exit(1);
});

healthCheck.end();