// Simple auth mock for API client
const auth = {
  async ensureValidToken(): Promise<string | null> {
    // In production, this would check cookies or local storage
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  },

  async refreshToken(): Promise<void> {
    // In production, this would refresh the token
    throw new Error('Token refresh not implemented')
  }
}

class APIError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

interface APIRequestOptions extends RequestInit {
  skipAuth?: boolean
  retryCount?: number
}

class APIClient {
  private baseURL: string
  private maxRetries = 3

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.pm-33.com'
  }

  async request<T>(
    endpoint: string,
    options: APIRequestOptions = {}
  ): Promise<T> {
    const { skipAuth = false, retryCount = 0, ...fetchOptions } = options

    try {
      const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers as Record<string, string>
      }

      // Add authentication if not skipped
      if (!skipAuth) {
        const token = await auth.ensureValidToken()
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
      }

      const response = await fetch(url, {
        ...fetchOptions,
        headers
      })

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response)
        throw new APIError(
          response.status,
          errorData.code || 'UNKNOWN_ERROR',
          errorData.message || response.statusText,
          errorData.details
        )
      }

      return this.parseSuccessResponse<T>(response)
    } catch (error) {
      if (error instanceof APIError) {
        // Handle specific API errors
        if (error.status === 401 && !skipAuth && retryCount < 1) {
          // Try to refresh token and retry
          try {
            await auth.refreshToken()
            return this.request(endpoint, { ...options, retryCount: retryCount + 1 })
          } catch (refreshError) {
            // Refresh failed, redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
            throw error
          }
        }

        if (error.status === 429) {
          // Rate limited - implement exponential backoff
          if (retryCount < this.maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000
            await this.sleep(delay)
            return this.request(endpoint, { ...options, retryCount: retryCount + 1 })
          }
        }

        if (error.status >= 500 && retryCount < this.maxRetries) {
          // Server error - retry with exponential backoff
          const delay = Math.pow(2, retryCount) * 1000
          await this.sleep(delay)
          return this.request(endpoint, { ...options, retryCount: retryCount + 1 })
        }

        throw error
      }

      // Network or other errors
      if (retryCount < this.maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000
        await this.sleep(delay)
        return this.request(endpoint, { ...options, retryCount: retryCount + 1 })
      }

      console.error('API Request failed:', error)
      throw new APIError(0, 'NETWORK_ERROR', 'Network error. Please try again.')
    }
  }

  async get<T>(endpoint: string, options?: APIRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, options?: APIRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T>(endpoint: string, data?: any, options?: APIRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async patch<T>(endpoint: string, data?: any, options?: APIRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T>(endpoint: string, options?: APIRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  private async parseErrorResponse(response: Response) {
    try {
      return await response.json()
    } catch {
      return {
        code: 'PARSE_ERROR',
        message: `HTTP ${response.status}: ${response.statusText}`,
        details: null
      }
    }
  }

  private async parseSuccessResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return null as T
    }

    try {
      return await response.json()
    } catch {
      throw new APIError(
        response.status,
        'PARSE_ERROR',
        'Failed to parse response as JSON'
      )
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Utility method for file uploads
  async uploadFile(
    endpoint: string,
    file: File,
    additionalFields?: Record<string, string>,
    options?: APIRequestOptions
  ): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)

    if (additionalFields) {
      Object.entries(additionalFields).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    const headers: Record<string, string> = {}

    // Add authentication if not skipped
    if (!options?.skipAuth) {
      const token = await auth.ensureValidToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
      ...options
    })

    if (!response.ok) {
      const errorData = await this.parseErrorResponse(response)
      throw new APIError(
        response.status,
        errorData.code || 'UPLOAD_ERROR',
        errorData.message || 'File upload failed',
        errorData.details
      )
    }

    return this.parseSuccessResponse(response)
  }
}

// Error handling utilities
export function handleAPIError(error: unknown): string {
  if (error instanceof APIError) {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        return error.details?.field
          ? `Invalid ${error.details.field}: ${error.message}`
          : `Validation error: ${error.message}`

      case 'UNAUTHORIZED':
        return 'Please sign in to continue'

      case 'FORBIDDEN':
        return 'You do not have permission to perform this action'

      case 'NOT_FOUND':
        return 'The requested resource was not found'

      case 'RATE_LIMITED':
        return 'Too many requests. Please try again later.'

      case 'NETWORK_ERROR':
        return 'Network error. Please check your connection and try again.'

      default:
        return error.message || 'An unexpected error occurred'
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}

// Toast notification helper
export function showErrorToast(error: unknown) {
  const message = handleAPIError(error)

  // Use your preferred toast library here
  // For now, just console.error
  console.error('API Error:', message)

  // If you have a toast library installed:
  // toast.error(message)
}

export const api = new APIClient()
export { APIError }
export type { APIRequestOptions }