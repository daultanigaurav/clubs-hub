const API_BASE_URL = 'http://localhost:5000/api'

interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token')
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Request failed')
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData: {
    name: string
    email: string
    password: string
    role?: string
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getCurrentUser() {
    return this.request('/auth/me')
  }

  // Clubs endpoints
  async getClubs(params?: {
    category?: string
    search?: string
    page?: number
    limit?: number
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    const queryString = queryParams.toString()
    return this.request(`/clubs${queryString ? `?${queryString}` : ''}`)
  }

  async getClub(id: string) {
    return this.request(`/clubs/${id}`)
  }

  async createClub(clubData: any) {
    return this.request('/clubs', {
      method: 'POST',
      body: JSON.stringify(clubData),
    })
  }

  async joinClub(id: string) {
    return this.request(`/clubs/${id}/join`, {
      method: 'POST',
    })
  }

  async leaveClub(id: string) {
    return this.request(`/clubs/${id}/leave`, {
      method: 'POST',
    })
  }

  // Events endpoints
  async getEvents(params?: {
    club?: string
    eventType?: string
    status?: string
    search?: string
    page?: number
    limit?: number
    upcoming?: boolean
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    const queryString = queryParams.toString()
    return this.request(`/events${queryString ? `?${queryString}` : ''}`)
  }

  async getEvent(id: string) {
    return this.request(`/events/${id}`)
  }

  async createEvent(eventData: any) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    })
  }

  async registerForEvent(id: string) {
    return this.request(`/events/${id}/register`, {
      method: 'POST',
    })
  }

  async unregisterFromEvent(id: string) {
    return this.request(`/events/${id}/unregister`, {
      method: 'POST',
    })
  }

  // Announcements endpoints
  async getAnnouncements(params?: {
    club?: string
    priority?: string
    search?: string
    page?: number
    limit?: number
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    const queryString = queryParams.toString()
    return this.request(`/announcements${queryString ? `?${queryString}` : ''}`)
  }

  async getAnnouncement(id: string) {
    return this.request(`/announcements/${id}`)
  }

  async createAnnouncement(announcementData: any) {
    return this.request('/announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    })
  }

  // Users endpoints
  async getUserProfile() {
    return this.request('/users/profile')
  }

  async updateUserProfile(profileData: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  async getUserClubs() {
    return this.request('/users/clubs')
  }

  async getUserEvents(params?: {
    status?: string
    page?: number
    limit?: number
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    const queryString = queryParams.toString()
    return this.request(`/users/events${queryString ? `?${queryString}` : ''}`)
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
export default apiClient

