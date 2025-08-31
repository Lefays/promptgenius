"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getPrompts, deletePrompt as deletePromptFromDB, type Prompt } from "@/lib/supabase/prompts"
import { supabase } from "@/lib/supabase/client"
import { 
  History, 
  Copy, 
  Trash2,
  Search,
  Filter,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
  Loader2
} from "lucide-react"

interface GeneratedPrompt extends Prompt {
  prompt: string // Alias for content
  timestamp: Date | string // Alias for created_at
}

export default function HistoryPage() {
  const [history, setHistory] = useState<GeneratedPrompt[]>([])
  const [filteredHistory, setFilteredHistory] = useState<GeneratedPrompt[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedModel, setSelectedModel] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPrompt, setSelectedPrompt] = useState<GeneratedPrompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const itemsPerPage = 10

  useEffect(() => {
    checkUserAndLoadHistory()
  }, [])
  
  const checkUserAndLoadHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      await loadHistory()
    } else {
      // Load from localStorage for non-authenticated users
      loadLocalHistory()
    }
  }

  useEffect(() => {
    filterHistory()
  }, [history, searchTerm, selectedModel])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const prompts = await getPrompts(100) // Load up to 100 prompts
      // Convert Supabase format to our format
      const formattedHistory = prompts.map(p => ({
        ...p,
        prompt: p.prompt || p.content || '',  // Use prompt field from DB
        timestamp: p.created_at ? new Date(p.created_at) : new Date(),
        userInput: p.user_input
      }))
      setHistory(formattedHistory)
    } catch (error) {
      console.error('Error loading history:', error)
      // Fallback to localStorage
      loadLocalHistory()
    } finally {
      setLoading(false)
    }
  }
  
  const loadLocalHistory = () => {
    const savedHistory = localStorage.getItem('prompt_history')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        // Ensure dates are properly formatted and handle both timestamp and created_at
        const historyWithDates = parsed.map((item: any) => ({
          ...item,
          timestamp: item.timestamp 
            ? (typeof item.timestamp === 'string' ? new Date(item.timestamp) : item.timestamp)
            : (item.created_at ? new Date(item.created_at) : new Date()),
          prompt: item.prompt || item.content || ''
        }))
        setHistory(historyWithDates)
      } catch (error) {
        console.error('Error loading history:', error)
        setHistory([])
      }
    }
    setLoading(false)
  }

  const filterHistory = () => {
    let filtered = [...history]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.userInput?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by model
    if (selectedModel !== "all") {
      filtered = filtered.filter(item => item.model === selectedModel)
    }

    setFilteredHistory(filtered)
    setCurrentPage(1)
  }

  const deletePrompt = async (id: string) => {
    if (user && id) {
      // Delete from Supabase
      const success = await deletePromptFromDB(id)
      if (success) {
        const updatedHistory = history.filter(item => item.id !== id)
        setHistory(updatedHistory)
        if (selectedPrompt?.id === id) {
          setSelectedPrompt(null)
        }
      }
    } else {
      // Delete from localStorage
      const updatedHistory = history.filter(item => item.id !== id)
      setHistory(updatedHistory)
      localStorage.setItem('prompt_history', JSON.stringify(updatedHistory))
      if (selectedPrompt?.id === id) {
        setSelectedPrompt(null)
      }
    }
  }

  const clearAllHistory = async () => {
    if (confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      if (user) {
        // Clear from Supabase
        for (const prompt of history) {
          if (prompt.id) {
            await deletePromptFromDB(prompt.id)
          }
        }
      } else {
        // Clear from localStorage
        localStorage.removeItem('prompt_history')
      }
      setHistory([])
      setFilteredHistory([])
      setSelectedPrompt(null)
    }
  }

  const copyToClipboard = (text: string | any) => {
    const textContent = typeof text === 'string' 
      ? text 
      : JSON.stringify(text, null, 2)
    navigator.clipboard.writeText(textContent)
  }

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-history-${Date.now()}.json`
    a.click()
  }

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d)
  }

  // Pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage)

  const models = ["all", "gpt-4", "gpt-3.5", "claude", "gemini", "llama", "mistral"]

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Prompt History</h1>
            <p className="text-muted-foreground">View and manage your generated prompts</p>
          </div>

          {/* Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-background"
              >
                {models.map(model => (
                  <option key={model} value={model}>
                    {model === "all" ? "All Models" : model.toUpperCase()}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={exportHistory}
                  disabled={history.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearAllHistory}
                  disabled={history.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Total: {history.length} prompts</span>
              <span>•</span>
              <span>Showing: {filteredHistory.length} results</span>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">Loading your prompts...</h3>
              <p className="text-muted-foreground">
                {user ? "Fetching from cloud storage" : "Loading from local storage"}
              </p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No prompts found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedModel !== "all" 
                  ? "Try adjusting your filters" 
                  : "Generate your first prompt to see it here"}
              </p>
              {history.length === 0 && (
                <Link href="/generator">
                  <Button>
                    Start Generating
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* List */}
              <div className="space-y-3">
                {paginatedHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPrompt(item)}
                    className={`p-4 rounded-lg border bg-card cursor-pointer transition-colors hover:bg-secondary/50 ${
                      selectedPrompt?.id === item.id ? "border-primary" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                          {item.model.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(item.timestamp)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          deletePrompt(item.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm line-clamp-3">
                      {typeof item.prompt === 'string' 
                        ? item.prompt 
                        : JSON.stringify(item.prompt, null, 2)}
                    </p>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Detail View */}
              {selectedPrompt && (
                <div className="rounded-lg border bg-card p-6 h-fit lg:sticky lg:top-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Prompt Details</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(selectedPrompt.prompt)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Link href={`/generator?prompt=${encodeURIComponent(
                          typeof selectedPrompt.prompt === 'string' 
                            ? selectedPrompt.prompt 
                            : JSON.stringify(selectedPrompt.prompt)
                        )}&model=${selectedPrompt.model}`}>
                          <Button variant="outline" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Model</Label>
                        <p className="text-sm font-medium">{selectedPrompt.model.toUpperCase()}</p>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">Created</Label>
                        <p className="text-sm">{formatDate(selectedPrompt.timestamp)}</p>
                      </div>

                      {selectedPrompt.style && (
                        <div>
                          <Label className="text-xs text-muted-foreground">Style</Label>
                          <p className="text-sm capitalize">{selectedPrompt.style}</p>
                        </div>
                      )}

                      {selectedPrompt.format && (
                        <div>
                          <Label className="text-xs text-muted-foreground">Format</Label>
                          <p className="text-sm capitalize">{selectedPrompt.format}</p>
                        </div>
                      )}

                      <div>
                        <Label className="text-xs text-muted-foreground">Full Prompt</Label>
                        <div className="mt-2 p-3 bg-secondary/30 rounded-lg max-h-[400px] overflow-y-auto">
                          <pre className="text-sm whitespace-pre-wrap font-mono">
                            {typeof selectedPrompt.prompt === 'string' 
                              ? selectedPrompt.prompt 
                              : JSON.stringify(selectedPrompt.prompt, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}