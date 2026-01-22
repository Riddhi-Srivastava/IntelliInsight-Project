import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Download, 
  Trash2, 
  Eye, 
  Calendar,
  FileText,
  Target,
  Brain,
  Lightbulb,
  Clock
} from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'
import { formatDate, formatConfidence, truncateText } from '../lib/utils'
import { PaperAnalysis } from '../types'
import { mockAnalyses } from '../data/mockData'
import jsPDF from "jspdf"   // ⭐ PDF library import

interface HistoryPageProps {
  analyses: PaperAnalysis[]
  onViewAnalysis: (analysis: PaperAnalysis) => void
}

export function HistoryPage({ analyses = mockAnalyses, onViewAnalysis }: HistoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'conference' | 'journal'>('all')
  const [filterNature, setFilterNature] = useState<'all' | 'implementation' | 'theoretical'>('all')
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([])

  // ⭐⭐⭐ PDF DOWNLOAD FUNCTION
  const handleDownload = (analysis: PaperAnalysis) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Research Paper Report", 14, 20);

    doc.setFontSize(12);
    let y = 35;

    doc.text(`Title: ${analysis.title}`, 14, y);  
    y += 10;

    doc.text(`Type: ${analysis.type}`, 14, y);
    y += 10;

    doc.text(`Type Confidence: ${formatConfidence(analysis.typeConfidence)}`, 14, y);
    y += 10;

    doc.text(`Nature: ${analysis.nature}`, 14, y);
    y += 10;

    doc.text(`Nature Confidence: ${formatConfidence(analysis.natureConfidence)}`, 14, y);
    y += 10;

    doc.text("Key Evidence:", 14, y);
    y += 10;

    const splitText = doc.splitTextToSize(analysis.evidence[0], 180);
    doc.text(splitText, 14, y);

    doc.save(`${analysis.title}_report.pdf`);
  };

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = analysis.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || analysis.type.toLowerCase() === filterType
    const matchesNature = filterNature === 'all' || analysis.nature.toLowerCase() === filterNature
    return matchesSearch && matchesType && matchesNature
  })

  const toggleSelection = (id: string) => {
    setSelectedAnalyses(prev =>
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="max-w-6xl mx-auto">

      <motion.div className="space-y-4">
        {filteredAnalyses.map((analysis) => (
          <Card key={analysis.id} className="bg-white/70 dark:bg-slate-800/70 border-white/20 group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">

                <div className="flex items-start space-x-4 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedAnalyses.includes(analysis.id)}
                    onChange={() => toggleSelection(analysis.id)}
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg group-hover:text-indigo-600 transition">{analysis.title}</h3>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(analysis.uploadDate)}</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>2m read</span>
                      </div>
                    </div>

                    <div className="mt-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200/50">
                      <p className="text-sm font-medium mb-1">Key Evidence:</p>
                      <p className="text-sm">{truncateText(analysis.evidence[0], 120)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">

                  {/* VIEW BUTTON */}
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => onViewAnalysis(analysis)}
                    className="opacity-0 group-hover:opacity-100 transition"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>

                  {/* ⭐ PDF DOWNLOAD BUTTON */}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDownload(analysis)}
                    className="opacity-0 group-hover:opacity-100 transition"
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                </div>

              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

    </div>
  )
}
