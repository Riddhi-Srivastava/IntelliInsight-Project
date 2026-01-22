import axios from 'axios'
import { PaperAnalysis } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export interface UploadResponse {
  success: boolean
  data: PaperAnalysis
  message: string
}

export interface AnalysisListResponse {
  success: boolean
  data: PaperAnalysis[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  statistics: {
    totalAnalyses: number
    conferenceCount: number
    journalCount: number
    implementationCount: number
    theoreticalCount: number
    avgTypeConfidence: number
    avgNatureConfidence: number
  }
}

export interface ApiError {
  error: string
  message: string
  details?: any[]
}

export const analysisApi = {
  // Upload and analyze PDF
  uploadPDF: async (file: File, onProgress?: (progress: number) => void): Promise<PaperAnalysis> => {
    const formData = new FormData()
    formData.append('pdf', file)

    try {
      const response = await api.post<UploadResponse>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(progress)
          }
        },
      })

      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload and analyze PDF')
    }
  },

  // Get all analyses with filters
  getAnalyses: async (params?: {
    page?: number
    limit?: number
    search?: string
    type?: string
    nature?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<AnalysisListResponse> => {
    try {
      const response = await api.get<AnalysisListResponse>('/analysis', { params })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch analyses')
    }
  },

  // Get single analysis
  getAnalysis: async (id: string): Promise<PaperAnalysis> => {
    try {
      const response = await api.get<{ success: boolean; data: PaperAnalysis }>(`/analysis/${id}`)
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch analysis')
    }
  },

  // Delete analysis
  deleteAnalysis: async (id: string): Promise<void> => {
    try {
      await api.delete(`/analysis/${id}`)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete analysis')
    }
  },

  // Batch delete analyses
  batchDeleteAnalyses: async (ids: string[]): Promise<{ deletedCount: number }> => {
    try {
      const response = await api.post<{ success: boolean; deletedCount: number }>(
        '/analysis/batch-delete',
        { ids }
      )
      return { deletedCount: response.data.deletedCount }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete analyses')
    }
  },
}

export default api