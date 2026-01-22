import { useState } from "react"
import { motion } from 'framer-motion'
import { Brain, FileText, Target, Zap, Shield, Clock } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface HomePageProps {
  onGetStarted: () => void
}

export function HomePage({ onGetStarted }: HomePageProps) {

  const [showDemo, setShowDemo] = useState(false)

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning models classify papers with 80+ accuracy',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Dual Classification',
      description: 'Identifies both publication type and research nature automatically',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Evidence Extraction',
      description: 'Highlights key sentences containing experimental evidence',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your research papers are processed securely and privately',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Clock,
      title: 'Instant Results',
      description: 'Get comprehensive analysis results in seconds, not hours',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: FileText,
      title: 'Detailed Reports',
      description: 'Download professional PDF reports with complete analysis',
      color: 'from-teal-500 to-blue-500'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="max-w-6xl mx-auto">

      {/* ⭐ AUTO-PLAY GOOGLE DRIVE VIDEO MODAL ⭐ */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl max-w-3xl w-[90%]">
            
            {/* CLOSE BUTTON */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowDemo(false)}
                className="text-xl font-bold text-gray-700 dark:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* GOOGLE DRIVE VIDEO WITH AUTOPLAY */}
            <iframe
              src="https://res.cloudinary.com/dknho57xz/video/upload/l_audio:ElevenLabs_2025-11-28T14_22_56_Anika_-_Interactive_E_Learning_Bot_Voice_pvc_sp96_s57_sb7_se0_b_m2_cggcf6/Screen_Recording_2025-11-26_at_9.19.54_PM_ouqqy6.mov
"
              className="w-full h-[400px] rounded-lg"
              allow="autoplay"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-4 py-2 rounded-full mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Research Analysis
          </span>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center leading-tight">
  <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
    Turn Research Papers into
  </span>

  <span className="block relative mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
    Smart Insights
    <motion.div
      className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-full max-w-xs bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    />
  </span>
</h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Upload any research paper and get instant AI-powered classification, evidence extraction, 
          and comprehensive analysis. Perfect for researchers, students, and academics.
        </p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="px-8 py-3 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <FileText className="mr-2 h-5 w-5" />
            Get Started Free
          </Button>

          <Button 
            variant="outline" 
            size="lg"
            onClick={() => setShowDemo(true)}
            className="px-8 py-3 text-lg border-2 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950 dark:hover:to-purple-950"
          >
            View Demo
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {[
          { number: '75%+', label: 'Classification Accuracy' },
          { number: '< 10s', label: 'Analysis Time' },
          { number: '25+', label: 'Papers Analyzed' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="text-center p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {stat.number}
            </div>
            <div className="text-muted-foreground font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Features Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-white/20 hover:scale-105">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="text-center bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-12 mb-8 border border-white/20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Ready to Analyze Your Research Papers?
        </h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of researchers who trust IntelliInsight for accurate, fast, and reliable paper analysis.
        </p>
        <Button 
          onClick={onGetStarted}
          size="lg"
          className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Brain className="mr-2 h-5 w-5" />
          Start Analyzing Now
        </Button>
      </motion.div>

    </div>
  )
}
