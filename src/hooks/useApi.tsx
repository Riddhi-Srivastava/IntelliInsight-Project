import { useState, useEffect } from 'react'
import { analysisApi } from '../services/api'
import { PaperAnalysis } from '../types'

export function useAnalyses() {
  const [analyses, setAnalyses] = useState<PaperAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statistics, setStatistics] = useState({
    totalAnalyses: 0,
    conferenceCount: 0,
    journalCount: 0,
    implementationCount: 0,
    theoreticalCount: 0,
    avgTypeConfidence: 0,
    avgNatureConfidence: 0
  })

  const fetchAnalyses = async (params?: {
    search?: string
    type?: string
    nature?: string
    page?: number
    limit?: number
  }) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await analysisApi.getAnalyses(params)
      setAnalyses(response.data)
      setStatistics(response.statistics)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching analyses:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteAnalysis = async (id: string) => {
    try {
      await analysisApi.deleteAnalysis(id)
      setAnalyses(prev => prev.filter(analysis => analysis.id !== id))
      
      // Update statistics
      setStatistics(prev => ({
        ...prev,
        totalAnalyses: prev.totalAnalyses - 1
      }))
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const batchDeleteAnalyses = async (ids: string[]) => {
    try {
      const result = await analysisApi.batchDeleteAnalyses(ids)
      setAnalyses(prev => prev.filter(analysis => !ids.includes(analysis.id)))
      
      // Update statistics
      setStatistics(prev => ({
        ...prev,
        totalAnalyses: prev.totalAnalyses - result.deletedCount
      }))
      
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const addAnalysis = (analysis: PaperAnalysis) => {
    setAnalyses(prev => [analysis, ...prev])
    setStatistics(prev => ({
      ...prev,
      totalAnalyses: prev.totalAnalyses + 1,
      conferenceCount: analysis.type === 'Conference' ? prev.conferenceCount + 1 : prev.conferenceCount,
      journalCount: analysis.type === 'Journal' ? prev.journalCount + 1 : prev.journalCount,
      implementationCount: analysis.nature === 'Implementation' ? prev.implementationCount + 1 : prev.implementationCount,
      theoreticalCount: analysis.nature === 'Theoretical' ? prev.theoreticalCount + 1 : prev.theoreticalCount
    }))
  }

  useEffect(() => {
    fetchAnalyses()
  }, [])

  return {
    analyses,
    loading,
    error,
    statistics,
    fetchAnalyses,
    deleteAnalysis,
    batchDeleteAnalyses,
    addAnalysis,
    refetch: fetchAnalyses
  }
}

export function useUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadPDF = async (file: File): Promise<PaperAnalysis> => {
    try {
      setUploading(true)
      setProgress(0)
      setError(null)

      const analysis = await analysisApi.uploadPDF(file, (progress) => {
        setProgress(progress)
      })

      return analysis
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const reset = () => {
    setUploading(false)
    setProgress(0)
    setError(null)
  }

  return {
    uploading,
    progress,
    error,
    uploadPDF,
    reset
  }
}