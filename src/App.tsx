import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './hooks/useTheme'
import { Layout } from './components/Layout'
import { HomePage } from './components/HomePage'
import { UploadPage } from './components/UploadPage'
import { HistoryPage } from './components/HistoryPage'
import { PaperAnalysis } from './types'
import { mockAnalyses } from './data/mockData'
import { ViewModal } from './components/ViewModal'   // ⭐ ADD THIS
import './index.css'

type Page = 'home' | 'upload' | 'history'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [analyses, setAnalyses] = useState<PaperAnalysis[]>(mockAnalyses)

  // ⭐ ADD — Modal ko open/close karne ke liye
  const [selectedAnalysis, setSelectedAnalysis] = useState<PaperAnalysis | null>(null)

  const handleGetStarted = () => {
    setCurrentPage('upload')
  }

  const handleAnalysisComplete = (analysis: PaperAnalysis) => {
    setAnalyses(prev => [analysis, ...prev])
  }

  // ⭐ View button click → modal open
  const handleViewAnalysis = (analysis: PaperAnalysis) => {
    setSelectedAnalysis(analysis)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onGetStarted={handleGetStarted} />

      case 'upload':
        return <UploadPage onAnalysisComplete={handleAnalysisComplete} />

      case 'history':
        return (
          <HistoryPage 
            analyses={analyses} 
            onViewAnalysis={handleViewAnalysis}   // ⭐ Correct
          />
        )

      default:
        return <HomePage onGetStarted={handleGetStarted} />
    }
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="intelliinsight-ui-theme">
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>

        {/* ⭐ FINAL: Modal Render Here */}
        <ViewModal 
          analysis={selectedAnalysis}
          onClose={() => setSelectedAnalysis(null)}
        />

      </Layout>
    </ThemeProvider>
  )
}

export default App
