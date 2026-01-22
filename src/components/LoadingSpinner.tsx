import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  showBrain?: boolean
}

export function LoadingSpinner({ size = 'md', message, showBrain = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        {showBrain ? (
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse" />
            <div className="relative p-4 bg-white dark:bg-slate-900 rounded-full">
              <Brain className={`${sizeClasses[size]} text-indigo-600 dark:text-indigo-400`} />
            </div>
          </div>
        ) : (
          <Loader2 className={`${sizeClasses[size]} text-indigo-600 dark:text-indigo-400 animate-spin`} />
        )}
      </motion.div>
      
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground text-center max-w-xs"
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

export function FullPageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
      <LoadingSpinner size="lg" message={message} showBrain />
    </div>
  )
}