"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  RefreshCw,
  Trash2,
  Copy,
  Download,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PromptHistoryItem {
  id: string
  prompt: string
  model: string
  user_input: string | null
  style: string | null
  format: string | null
  temperature: number | null
  max_tokens: number | null
  has_image: boolean
  created_at: string
  updated_at: string
}

interface PromptHistoryProps {
  onLoadPrompt?: (prompt: PromptHistoryItem) => void
  userId?: string | null
}

export function PromptHistory({ onLoadPrompt, userId }: PromptHistoryProps) {
  const [history, setHistory] = useState<PromptHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 10

  useEffect(() => {
    loadHistory()
  }, [currentPage, userId])

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        limit: itemsPerPage.toString(),
        offset: (currentPage * itemsPerPage).toString()
      })
      
      if (userId) {
        params.append('userId', userId)
      }

      const response = await fetch(`/api/prompts/list?${params}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        setHistory(result.data)
        setTotalCount(result.count || 0)
      }
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deletePrompt = async (promptId: string) => {
    try {
      const response = await fetch(`/api/prompts/delete?id=${promptId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await loadHistory()
      }
    } catch (error) {
      console.error('Error deleting prompt:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadPrompt = (prompt: PromptHistoryItem) => {
    const blob = new Blob([prompt.prompt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-${prompt.model}-${prompt.id.slice(0, 8)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredHistory = history.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.user_input && item.user_input.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesModel = selectedModel === null || item.model === selectedModel
    
    return matchesSearch && matchesModel
  })

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const models = Array.from(new Set(history.map(h => h.model)))

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <select
          value={selectedModel || ""}
          onChange={(e) => setSelectedModel(e.target.value || null)}
          className="px-3 py-2 rounded-md border border-input bg-background text-sm"
        >
          <option value="">All Models</option>
          {models.map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
        <Button
          variant="outline"
          size="icon"
          onClick={loadHistory}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* History Items */}
      {isLoading && filteredHistory.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="space-y-2">
          {filteredHistory.map(item => (
            <div
              key={item.id}
              className="group rounded-lg border bg-card p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {item.model}
                    </span>
                    {item.has_image && (
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                        Has Image
                      </span>
                    )}
                    {item.style && (
                      <span className="text-xs text-muted-foreground">
                        {item.style}
                      </span>
                    )}
                    {item.format && (
                      <span className="text-xs text-muted-foreground">
                        {item.format}
                      </span>
                    )}
                  </div>
                  
                  {item.user_input && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Input:</strong> {item.user_input.slice(0, 100)}
                      {item.user_input.length > 100 && "..."}
                    </p>
                  )}
                  
                  <p className="text-sm">
                    {item.prompt.slice(0, 150)}
                    {item.prompt.length > 150 && "..."}
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onLoadPrompt && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onLoadPrompt(item)}
                      title="Load prompt"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(item.prompt)}
                    title="Copy prompt"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => downloadPrompt(item)}
                    title="Download prompt"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePrompt(item.id)}
                    title="Delete prompt"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery || selectedModel ? "No prompts found matching your filters" : "No prompts yet. Generate your first prompt to get started!"}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}