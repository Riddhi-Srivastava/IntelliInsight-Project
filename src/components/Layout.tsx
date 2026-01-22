import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Brain, Moon, Sun, FileText, History, Home } from 'lucide-react'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { useTheme } from '../hooks/useTheme'
import { cn } from '../lib/utils'

interface LayoutProps {
  children: ReactNode
  currentPage: 'home' | 'upload' | 'history'
  onPageChange: (page: 'home' | 'upload' | 'history') => void
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'upload', label: 'Upload', icon: FileText },
    { id: 'history', label: 'History', icon: History }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-all duration-300">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-lg dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  IntelliInsight
                </h1>
                <p className="text-sm text-muted-foreground">Turning Research Papers into Smart Insights</p>
              </div>
            </motion.div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1 bg-white/50 dark:bg-slate-800/50 rounded-2xl p-1 backdrop-blur-sm">
              {navItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onPageChange(item.id as any)}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium",
                      currentPage === item.id
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-slate-700/50"
                    )}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </motion.button>
                )
              })}
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
                <Moon className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-white/20">
        <nav className="flex items-center justify-around p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.id}
                onClick={() => onPageChange(item.id as any)}
                className={cn(
                  "flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-200",
                  currentPage === item.id
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-muted-foreground"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}