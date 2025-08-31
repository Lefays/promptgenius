"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getPromptStats, getPrompts } from "@/lib/supabase/prompts"
import { supabase } from "@/lib/supabase/client"
import { 
  Sparkles, 
  History, 
  TrendingUp,
  Clock,
  Layers,
  ArrowRight,
  BarChart3,
  FileText,
  Zap,
  Trophy,
  Target,
  Activity
} from "lucide-react"
import { motion } from "framer-motion"

interface PromptStats {
  total: number
  today: number
  thisWeek: number
  favoriteModel: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<PromptStats>({
    total: 0,
    today: 0,
    thisWeek: 0,
    favoriteModel: "GPT-4"
  })
  const [recentPrompts, setRecentPrompts] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUserAndLoadData()
  }, [])
  
  const checkUserAndLoadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      await loadDashboardDataFromSupabase()
    } else {
      loadDashboardDataFromLocal()
    }
  }

  const loadDashboardDataFromSupabase = async () => {
    try {
      // Get stats from Supabase
      const supabaseStats = await getPromptStats()
      
      // Get recent prompts
      const prompts = await getPrompts(5)
      
      // Find most used model from recent prompts
      const modelCounts: { [key: string]: number } = {}
      prompts.forEach((p: any) => {
        modelCounts[p.model] = (modelCounts[p.model] || 0) + 1
      })
      const favoriteModel = Object.entries(modelCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "GPT-4"
      
      setStats({
        total: supabaseStats.total,
        today: supabaseStats.today,
        thisWeek: supabaseStats.thisWeek,
        favoriteModel
      })
      
      setRecentPrompts(prompts.slice(0, 3))
    } catch (error) {
      console.error('Error loading from Supabase:', error)
      // Fallback to local storage
      loadDashboardDataFromLocal()
    }
  }
  
  const loadDashboardDataFromLocal = () => {
    // Load from localStorage
    const savedHistory = localStorage.getItem('prompt_history')
    if (savedHistory) {
      try {
        const prompts = JSON.parse(savedHistory)
        
        // Calculate stats
        const now = new Date()
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        
        const todayPrompts = prompts.filter((p: any) => 
          new Date(p.created_at || p.timestamp) >= todayStart
        )
        
        const weekPrompts = prompts.filter((p: any) => 
          new Date(p.created_at || p.timestamp) >= weekStart
        )
        
        // Find most used model
        const modelCounts: { [key: string]: number } = {}
        prompts.forEach((p: any) => {
          modelCounts[p.model] = (modelCounts[p.model] || 0) + 1
        })
        const favoriteModel = Object.entries(modelCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "GPT-4"
        
        setStats({
          total: prompts.length,
          today: todayPrompts.length,
          thisWeek: weekPrompts.length,
          favoriteModel
        })
        
        setRecentPrompts(prompts.slice(0, 3))
      } catch (e) {
        console.error('Error loading stats:', e)
      }
    }
  }

  const statCards = [
    {
      title: "Total Prompts",
      value: stats.total,
      icon: FileText,
      color: "text-gray-900",
      bgColor: "bg-purple-50"
    },
    {
      title: "Today",
      value: stats.today,
      icon: Clock,
      color: "text-gray-900",
      bgColor: "bg-purple-50"
    },
    {
      title: "This Week",
      value: stats.thisWeek,
      icon: TrendingUp,
      color: "text-gray-900",
      bgColor: "bg-purple-50"
    },
    {
      title: "Favorite Model",
      value: stats.favoriteModel,
      icon: Layers,
      color: "text-gray-900",
      bgColor: "bg-purple-50"
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900"
        >
          Welcome to Your Dashboard
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 mt-3 text-lg"
        >
          Track your AI prompt generation journey and unlock new possibilities ✨
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="relative group"
          >
            <div className="relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-purple-200 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</p>
                  </div>
                  <p className={`text-4xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  {stat.title !== "Favorite Model" && (
                    <p className="text-xs text-gray-400 mt-2">
                      {stat.title === "Total Prompts" && "All time"}
                      {stat.title === "Today" && "Last 24 hours"}
                      {stat.title === "This Week" && "Last 7 days"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Generate New */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Quick Generate</h2>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Create a new optimized prompt with our AI-powered generator.
          </p>
          <Link href="/generator">
            <Button className="w-full">
              Start Generating
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* View History */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Prompt History</h2>
            <History className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Access and manage all your previously generated prompts.
          </p>
          <Link href="/history">
            <Button variant="outline" className="w-full">
              View All History
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Prompts</h2>
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        
        {recentPrompts.length > 0 ? (
          <div className="space-y-3">
            {recentPrompts.map((prompt, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {prompt.model}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(prompt.created_at || prompt.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  {prompt.user_input && (
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {prompt.user_input}
                    </p>
                  )}
                </div>
                <Link href="/history">
                  <Button variant="ghost" size="sm">
                    View
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-3">
              No prompts generated yet
            </p>
            <Link href="/generator">
              <Button size="sm">Generate Your First Prompt</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-3">Pro Tips</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">1</span>
            </div>
            <div>
              <p className="text-sm font-medium">Be Specific</p>
              <p className="text-xs text-muted-foreground">
                The more details you provide, the better the generated prompt.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">2</span>
            </div>
            <div>
              <p className="text-sm font-medium">Choose the Right Model</p>
              <p className="text-xs text-muted-foreground">
                Different AI models excel at different types of tasks.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">3</span>
            </div>
            <div>
              <p className="text-sm font-medium">Use Advanced Options</p>
              <p className="text-xs text-muted-foreground">
                Fine-tune temperature and format for optimal results.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">4</span>
            </div>
            <div>
              <p className="text-sm font-medium">Save Your Favorites</p>
              <p className="text-xs text-muted-foreground">
                All prompts are automatically saved for future reference.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}