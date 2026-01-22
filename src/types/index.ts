export interface PaperAnalysis {
  id: string
  title: string
  type: 'Conference' | 'Journal'
  typeConfidence: number
  nature: 'Implementation' | 'Theoretical'
  natureConfidence: number
  evidence: string[]
  uploadDate: Date
  status: 'processing' | 'completed' | 'error'
}

export interface UploadProgress {
  progress: number
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error'
  message: string
}

export interface ClassificationResult {
  type: string
  confidence: number
  color: string
  icon: string
}