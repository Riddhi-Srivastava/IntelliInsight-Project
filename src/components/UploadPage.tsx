import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  AlertCircle,
  Download,
  Eye,
  Brain,
  Target,
  Lightbulb
} from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { cn, formatConfidence } from '../lib/utils'
import { PaperAnalysis, UploadProgress } from '../types'
import jsPDF from "jspdf";



const evidenceSets = [
  [
    "The study proposes a millimeter-wave (mmWave) sensor combined with differential filter paper for cancer cell detection.",
    "Cancer cell samples produce distinct mmWave absorption/permittivity responses compared to normal cells.",
    "The experimental setup uses soaked filter papers scanned through an mmWave sensor.",
    "Method relies on physical sensing rather than AI.",
    "mmWave measurements reliably distinguish cancerous from non-cancerous samples."
  ],
  [
    "Proposes a transformer-less hybrid series active filter using a 5-level D-NPC converter.",
    "Real-time HIL test bench implemented using Opal-RT and DS1103.",
    "HIL results match offline simulations closely.",
    "Load voltage THD improved to 5.6%.",
    "System handles sag/swell and 28% THD grid conditions."
  ],
  [
    "Analyzes 542 publications on Green & Sustainable Software.",
    "Sharp rise in publications after 2011.",
    "USA & Europe lead sustainability research.",
    "Top themes include Green IT & Energy Efficiency.",
    "Field shows strong multinational collaboration."
  ],
  [
    "2024 JCN index categorizes papers into six divisions.",
    "Special issue highlights Integrated Sensing & Communications.",
    "Covers MIMO, OTFS, NOMA and PHY-layer topics.",
    "AI-for-Comm papers include MEC, FL and SDN.",
    "Index maps titles to their page ranges."
  ],
  [
    "Improved bee colony algorithm for UAV task allocation.",
    "ISODATA clustering handles dynamic tasks.",
    "Sudden tasks inserted using similarity-based mapping.",
    "Self-regulation improves robustness.",
    "Outperforms ACO and classical optimization models."
  ],
  [
    "Counterpoise electrode reduces MRI RF heating in AIMD leads.",
    "Couples RF-induced currents safely into tissue.",
    "Simulations show ~3× SAR reduction.",
    "Therapy-signal path remains unaffected.",
    "Electrode length strongly affects performance."
  ],
  [
    "mmWave CPW + SIR biosensor for high-sensitivity detection.",
    "Filter-paper method removes microfluidic needs.",
    "Ethanol-water test shows strong resonance shifts.",
    "Cancer cell suspensions cause measurable TP shifts.",
    "Detects solids, liquids and biological samples."
  ],
  [
    "RACB ranking evaluates citation-behavior reputation.",
    "Improved prediction vs PageRank & CiteScore.",
    "Detects abnormal citation patterns.",
    "GA-BP neural network improves CDI modeling.",
    "Case study adjusts rankings meaningfully."
  ],
  [
    "PLC over PV DC bus using HF transformer topology.",
    "Bypass LC filter prevents MPPT disturbance.",
    "FSK at 132.5 kHz used for communication.",
    "Energy harvesting powers module electronics.",
    "PLC signals do not affect PV output."
  ],
  [
    "Study evaluates PV+BESS flexibility under Finnish tariffs.",
    "70PB yields best peak shaving performance.",
    "Grid energy drops ~24% with battery.",
    "Battery charges only from PV surplus.",
    "SOC limits used to preserve battery health."
  ],
  [
    "Whistleblowing in SE is under-researched.",
    "Six major themes identified in literature.",
    "‘Mum effect’ reduces issue reporting.",
    "Most studies are lab-based, not real-world.",
    "Recommends stronger internal reporting culture."
  ],
  [
    "SLR of intelligent surveillance (2010–2019).",
    "220 journal papers reviewed.",
    "Trends: tracking, integrated systems, deep learning.",
    "Challenges: occlusion, crowd density, low light.",
    "Frameworks evolved from CCTV → cloud/edge."
  ],
  [
    "3D COMSOL model of transformer void discharges.",
    "Void radius >1 mm triggers strong PD.",
    "EF increases exponentially near voids.",
    "Hotspot near inner windings identified.",
    "Recommends EF-energy-charge fingerprinting."
  ],
  [
    "Microservices readiness model using TOE + HOT-Fit.",
    "Organization factor has highest influence.",
    "Programmer ability key human factor.",
    "User satisfaction key environmental factor.",
    "Security often overlooked in migration."
  ],
  [
    "Transfer Learning DPD model scales 20→100 MHz.",
    "Frozen layers reused; top layers fine-tuned.",
    "1000× reduction in identification cost.",
    "ACLR improves 9 dB; EVM improves 8.6%.",
    "Validated with 4×4 APA OTA measurements."
  ]
];

let evidenceCounter = 0;


interface UploadPageProps {
  onAnalysisComplete: (analysis: PaperAnalysis) => void
}

export function UploadPage({ onAnalysisComplete }: UploadPageProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle',
    message: 'Ready to upload'
  })
  const [currentAnalysis, setCurrentAnalysis] = useState<PaperAnalysis | null>(null)

  const generatePdf = () => {
    if (!currentAnalysis) return;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Research Paper Analysis Report", 10, 10);

    doc.setFontSize(12);
    doc.text(`Title: ${currentAnalysis.title}`, 10, 25);
    doc.text(`Type: ${currentAnalysis.type} (${formatConfidence(currentAnalysis.typeConfidence)})`, 10, 35);
    doc.text(`Nature: ${currentAnalysis.nature} (${formatConfidence(currentAnalysis.natureConfidence)})`, 10, 45);

    doc.text("Top Evidence:", 10, 60);
    currentAnalysis.evidence.slice(0, 3).forEach((ev, i) => {
      doc.text(`${i + 1}. ${ev}`, 10, 70 + i * 10);
    });

    doc.save(`${currentAnalysis.title}_Report.pdf`);
  };


  const simulateAnalysis = useCallback((fileName: string) => {

   const mockAnalysis: PaperAnalysis = {
  id: Date.now().toString(),
  title: fileName.replace('.pdf', '').replace(/[-_]/g, ' ').replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  ),
  type: Math.random() > 0.5 ? 'Conference' : 'Journal',
  typeConfidence: 0.7 + Math.random() * 0.25,
  nature: Math.random() > 0.6 ? 'Implementation' : 'Theoretical',
  natureConfidence: 0.75 + Math.random() * 0.2,

  evidence: evidenceSets[evidenceCounter],

  // ⭐ REQUIRED FIELDS TO FIX ERROR
  uploadDate: new Date(),
  status: "completed"
}


    // ⭐ Move to next evidence for next upload
    evidenceCounter = (evidenceCounter + 1) % evidenceSets.length;


    // Remaining code untouched
    let progress = 0
    setUploadProgress({ progress, status: 'uploading', message: 'Uploading PDF...' })

    const uploadInterval = setInterval(() => {
      progress += Math.random() * 15 + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(uploadInterval)
        setUploadProgress({ progress, status: 'processing', message: 'Analyzing paper...' })
        
        setTimeout(() => {
          setUploadProgress({ progress: 100, status: 'completed', message: 'Analysis complete!' })
          setCurrentAnalysis(mockAnalysis)
          onAnalysisComplete(mockAnalysis)
        }, 2000)
      } else {
        setUploadProgress({ progress, status: 'uploading', message: `Uploading... ${Math.round(progress)}%` })
      }
    }, 300)
  }, [onAnalysisComplete])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (file.type === 'application/pdf') {
        simulateAnalysis(file.name)
      } else {
        setUploadProgress({
          progress: 0,
          status: 'error',
          message: 'Please upload a PDF file'
        })
      }
    }
  }, [simulateAnalysis])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      if (file.type === 'application/pdf') {
        simulateAnalysis(file.name)
      } else {
        setUploadProgress({
          progress: 0,
          status: 'error',
          message: 'Please upload a PDF file'
        })
      }
    }
  }, [simulateAnalysis])

  const resetUpload = () => {
    setUploadProgress({ progress: 0, status: 'idle', message: 'Ready to upload' })
    setCurrentAnalysis(null)
  }

  const getStatusIcon = () => {
    switch (uploadProgress.status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      case 'completed':
        return <CheckCircle className="h-8 w-8 text-green-600" />
      case 'error':
        return <XCircle className="h-8 w-8 text-red-600" />
      default:
        return <Upload className="h-8 w-8 text-muted-foreground" />
    }
  }

  const getClassificationIcon = (type: string) => {
    if (type === 'Conference') return <Target className="h-5 w-5" />
    if (type === 'Journal') return <FileText className="h-5 w-5" />
    if (type === 'Implementation') return <Brain className="h-5 w-5" />
    return <Lightbulb className="h-5 w-5" />
  }


  return (
    <>
      {/*
        ⭐⭐ From here onwards EVERYTHING is your same UI — 
        not a single line changed.
      */}
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Upload Research Paper
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload your PDF research paper for instant AI-powered analysis
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* LEFT SECTION */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card className="h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" /> Upload PDF</CardTitle>
                  <CardDescription>Drag and drop your research paper or click to browse</CardDescription>
                </CardHeader>
                <CardContent>

                  <div
                    className={cn(
                      "relative border-2 border-dashed rounded-xl p-8 text-center",
                      dragActive && "border-indigo-500",
                      uploadProgress.status === 'error' && "border-red-400",
                      uploadProgress.status === 'completed' && "border-green-400"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => uploadProgress.status === 'idle' && document.getElementById('file-input')?.click()}
                  >
                    <input type="file" id="file-input" className="hidden" accept=".pdf" onChange={handleFileInput} disabled={uploadProgress.status !== 'idle'} />

                    <motion.div className="flex flex-col items-center space-y-4">
                      {getStatusIcon()}
                      <div>
                        <p className="text-lg font-medium mb-2">
                          {uploadProgress.status === 'idle' ? 'Drop your PDF here' : uploadProgress.message}
                        </p>
                        {uploadProgress.status === 'idle' && (
                          <p className="text-sm text-muted-foreground">or click to browse files (max 10MB)</p>
                        )}
                      </div>

                      {(uploadProgress.status === 'uploading' || uploadProgress.status === 'processing') && (
                        <div className="w-full">
                          <Progress value={uploadProgress.progress} className="mb-2" />
                          <p className="text-sm text-muted-foreground">{uploadProgress.progress}% complete</p>
                        </div>
                      )}

                      {uploadProgress.status === 'error' && (
                        <Button onClick={resetUpload} variant="outline" size="sm">Try Again</Button>
                      )}
                    </motion.div>
                  </div>

                </CardContent>
              </Card>
            </motion.div>

            {/* RIGHT SECTION */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Card className="h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5" /> Analysis Results</CardTitle>
                  <CardDescription>AI-powered classification and evidence extraction</CardDescription>
                </CardHeader>
                <CardContent>

                  <AnimatePresence mode="wait">
                    {!currentAnalysis ? (
                      <motion.div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">Upload a paper to see results</h3>
                        <p className="text-sm text-muted-foreground">Get instant classification and evidence extraction</p>
                      </motion.div>
                    ) : (
                      <motion.div className="space-y-6">

                        <div>
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{currentAnalysis.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Analyzed on {currentAnalysis.uploadDate.toLocaleDateString()}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-indigo-50 border">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getClassificationIcon(currentAnalysis.type)}
                                <span className="font-medium">{currentAnalysis.type}</span>
                              </div>
                              <span className="text-sm font-mono bg-indigo-100 px-2 py-1 rounded">
                                {formatConfidence(currentAnalysis.typeConfidence)}
                              </span>
                            </div>
                            <Progress value={currentAnalysis.typeConfidence * 100} className="h-2" />
                          </div>

                          <div className="p-4 rounded-xl bg-purple-50 border">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getClassificationIcon(currentAnalysis.nature)}
                                <span className="font-medium">{currentAnalysis.nature}</span>
                              </div>
                              <span className="text-sm font-mono bg-purple-100 px-2 py-1 rounded">
                                {formatConfidence(currentAnalysis.natureConfidence)}
                              </span>
                            </div>
                            <Progress value={currentAnalysis.natureConfidence * 100} className="h-2" />
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2"><Eye className="h-4 w-4" /> Key Evidence (Top 3)</h4>
                          <div className="space-y-2">
                            {currentAnalysis.evidence.slice(0, 3).map((evidence, index) => (
                              <motion.div key={index} className="p-3 bg-slate-50 rounded-lg border">
                                <p className="text-sm leading-relaxed">{evidence}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button size="sm" className="flex-1" onClick={generatePdf}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Report
                          </Button>

                          <Button variant="outline" size="sm" onClick={resetUpload}>
                            Upload Another
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </CardContent>
              </Card>
            </motion.div>

          </div>

        </motion.div>
      </div>
    </>
  )
}
