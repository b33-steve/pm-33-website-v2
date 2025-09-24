# PM33 Platform API Documentation

## Overview

The PM33 Platform provides a comprehensive REST API for managing users, PRD documents, and velocity tracking. All endpoints return JSON responses and follow REST conventions.

### Base URL
```
http://localhost:3000/api (development)
https://pm-33.com/api (production)
```

### Authentication

Most endpoints require authentication via JWT token. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Authentication endpoints: 5-10 requests per 15 minutes
- AI generation endpoints: 10 requests per hour
- Other endpoints: 100 requests per 15 minutes

### Error Responses

All errors follow this format:
```json
{
  "error": "Error type",
  "message": "Human readable error message",
  "code": "ERROR_CODE",
  "details": {} // Optional additional details
}
```

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "subscriptionTier": "FREE",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token_here",
    "requiresEmailVerification": true
  }
}
```

### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "subscriptionTier": "FREE"
    },
    "token": "jwt_token_here"
  }
}
```

### POST /api/auth/logout
Logout user and invalidate session.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET /api/auth/me
Get current user information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "subscriptionTier": "FREE",
      "emailVerified": false,
      "_count": {
        "prdDocuments": 5,
        "velocityMetrics": 12
      }
    }
  }
}
```

## User Management

### PUT /api/users/profile
Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "username": "johnsmith",
  "bio": "Product Manager at TechCorp",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "johnsmith",
      "firstName": "John",
      "lastName": "Smith",
      "bio": "Product Manager at TechCorp",
      "avatarUrl": "https://example.com/avatar.jpg"
    }
  }
}
```

## PRD Document Management

### POST /api/prd/generate
Generate a new PRD document using AI.

**Subscription Required:** PRO or ENTERPRISE

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Mobile App Authentication Feature",
  "prompt": "We need to build a secure authentication system for our mobile app. The system should support email/password login, social logins (Google, Apple), and biometric authentication. Target users are tech-savvy millennials who value security and convenience.",
  "template": "standard_prd",
  "teamId": "team_id_optional"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "PRD generated successfully",
  "data": {
    "document": {
      "id": "prd_id",
      "title": "Mobile App Authentication Feature",
      "content": {
        "title": "Mobile App Authentication Feature - Product Requirements Document",
        "executive_summary": "...",
        "features": [...],
        "user_stories": [...],
        "technical_requirements": [...],
        "timeline": {...}
      },
      "status": "DRAFT",
      "version": "1.0.0",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### GET /api/prd
List user's PRD documents with pagination and filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `status` (optional): Filter by status (DRAFT, REVIEW, APPROVED, ARCHIVED)
- `search` (optional): Search in title and content
- `sortBy` (optional): Sort field (default: updatedAt)
- `sortOrder` (optional): Sort order (asc, desc, default: desc)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "prd_id",
        "title": "Mobile App Authentication Feature",
        "status": "DRAFT",
        "version": "1.0.0",
        "isPublic": false,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "author": {
          "id": "user_id",
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### GET /api/prd/{id}
Get specific PRD document by ID.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "document": {
      "id": "prd_id",
      "title": "Mobile App Authentication Feature",
      "content": {
        "title": "Mobile App Authentication Feature - Product Requirements Document",
        "executive_summary": "...",
        "problem_statement": "...",
        "features": [...],
        "user_stories": [...],
        "technical_requirements": [...],
        "timeline": {...}
      },
      "status": "DRAFT",
      "version": "1.0.0",
      "createdAt": "2024-01-01T00:00:00Z",
      "author": {
        "id": "user_id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "user@example.com"
      }
    }
  }
}
```

### PUT /api/prd/{id}
Update PRD document.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated Mobile App Authentication Feature",
  "content": {...},
  "status": "REVIEW",
  "version": "1.1.0",
  "isPublic": false
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "PRD document updated successfully",
  "data": {
    "document": {
      "id": "prd_id",
      "title": "Updated Mobile App Authentication Feature",
      "status": "REVIEW",
      "version": "1.1.0"
    }
  }
}
```

### DELETE /api/prd/{id}
Delete PRD document.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "PRD document deleted successfully"
}
```

## Velocity Tracking

### POST /api/velocity
Create a new velocity metric.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "sprintNumber": 15,
  "periodStart": "2024-01-01T00:00:00Z",
  "periodEnd": "2024-01-14T23:59:59Z",
  "storyPoints": 25,
  "tasksCompleted": 12,
  "teamSize": 5,
  "bugCount": 2,
  "reworkHours": 4.5,
  "notes": {
    "blockers": ["API integration delays"],
    "achievements": ["Completed user authentication"]
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Velocity metric created successfully",
  "data": {
    "metric": {
      "id": "metric_id",
      "sprintNumber": 15,
      "velocity": 23.5,
      "storyPoints": 25,
      "tasksCompleted": 12,
      "periodStart": "2024-01-01T00:00:00Z",
      "periodEnd": "2024-01-14T23:59:59Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### GET /api/velocity
List velocity metrics with pagination and filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`, `limit`, `sortBy`, `sortOrder` (same as PRD endpoints)
- `sprintNumber` (optional): Filter by sprint number
- `fromDate` (optional): Filter metrics from this date
- `toDate` (optional): Filter metrics to this date

**Response (200):**
```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "id": "metric_id",
        "sprintNumber": 15,
        "velocity": 23.5,
        "storyPoints": 25,
        "tasksCompleted": 12,
        "periodStart": "2024-01-01T00:00:00Z",
        "periodEnd": "2024-01-14T23:59:59Z"
      }
    ],
    "pagination": {...}
  }
}
```

### GET /api/velocity/analysis
Get velocity analysis and predictions.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `periods` (optional): Number of periods to analyze (default: 6, max: 20)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "currentVelocity": 23.5,
      "averageVelocity": 21.8,
      "velocityTrend": "UP",
      "predictedNextSprint": 24.2,
      "performanceScore": 87,
      "recommendations": [
        "Great progress! Maintain current practices and consider taking on more work",
        "Continue current practices - performance is stable"
      ]
    }
  }
}
```

### POST /api/velocity/team
Get team velocity analysis.

**Subscription Required:** PRO or ENTERPRISE

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "userIds": ["user1_id", "user2_id", "user3_id"],
  "lookbackPeriods": 6
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "teamMetrics": {
      "teamVelocity": 85.4,
      "teamSize": 3,
      "velocityPerMember": 28.5,
      "completionRate": 85,
      "qualityScore": 92,
      "improvementAreas": [
        "Team is performing well - focus on continuous improvement"
      ]
    }
  }
}
```

## Health Check

### GET /api/health
System health check endpoint.

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "development",
  "checks": {
    "application": {"status": "healthy"},
    "database": {"status": "healthy"},
    "apis": {"status": "healthy"}
  },
  "summary": {
    "total": 5,
    "healthy": 5,
    "unhealthy": 0,
    "score": 100
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `AUTHENTICATION_REQUIRED` | Missing or invalid authentication |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `SUBSCRIPTION_REQUIRED` | Feature requires paid subscription |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `USER_EXISTS` | Email or username already taken |
| `INVALID_CREDENTIALS` | Wrong email/password |
| `DOCUMENT_NOT_FOUND` | PRD document not found |
| `METRIC_NOT_FOUND` | Velocity metric not found |
| `AI_GENERATION_FAILED` | AI service error |
| `DATABASE_ERROR` | Database operation failed |
| `INTERNAL_ERROR` | Unexpected server error |

## Rate Limits

| Endpoint Category | Limit | Window |
|------------------|-------|---------|
| Auth (register/login) | 5-10 requests | 15 minutes |
| AI Generation | 10 requests | 1 hour |
| General API | 100 requests | 15 minutes |

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp
- `Retry-After`: Seconds to wait (on 429 errors)

## SDK and Libraries

### JavaScript/TypeScript
```javascript
// Example API client usage
const api = new PM33Client({
  baseUrl: 'https://pm-33.com/api',
  token: 'your_jwt_token'
});

// Generate PRD
const prd = await api.prd.generate({
  title: 'New Feature',
  prompt: 'Description of the feature...'
});

// Create velocity metric
const metric = await api.velocity.create({
  sprintNumber: 1,
  storyPoints: 20,
  tasksCompleted: 8,
  periodStart: '2024-01-01',
  periodEnd: '2024-01-14'
});
```

For more examples and detailed integration guides, visit our [documentation portal](https://docs.pm-33.com).