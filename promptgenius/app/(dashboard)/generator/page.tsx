"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase/client"
import { usePuter } from "@/lib/hooks/use-puter"
import { 
  checkRateLimit, 
  incrementRateLimit, 
  isModelAvailable, 
  formatResetTime,
  type SubscriptionTier 
} from "@/lib/subscription"
import { 
  Sparkles, 
  Upload, 
  Copy, 
  Download,
  RefreshCw,
  Image as ImageIcon,
  X,
  Settings,
  History,
  Save,
  ChevronDown,
  FileText,
  Trash2,
  Bot
} from "lucide-react"

interface GeneratedPrompt {
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

export default function GeneratorPage() {
  const router = useRouter()
  const [userInput, setUserInput] = useState("")
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini")
  const { puterReady, generateWithPuter, signInToPuter, getPuterUser } = usePuter()
  const [puterUser, setPuterUser] = useState<any>(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [history, setHistory] = useState<GeneratedPrompt[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [advancedOptions, setAdvancedOptions] = useState({
    temperature: 0.7,
    maxTokens: 2000,
    style: "professional",
    format: "detailed"
  })
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Authentication and subscription state
  const [user, setUser] = useState<any>(null)
  const [userTier, setUserTier] = useState<SubscriptionTier>('free')
  const [rateLimit, setRateLimit] = useState<{ allowed: boolean; remaining: number; resetTime: number } | null>(null)

  useEffect(() => {
    // Check user authentication and load history
    checkUser()
    loadHistoryFromSupabase()
    checkPuterUser()
  }, [])
  
  const checkPuterUser = async () => {
    if (puterReady) {
      const user = await getPuterUser()
      setPuterUser(user)
    }
  }
  
  useEffect(() => {
    checkPuterUser()
  }, [puterReady])

  useEffect(() => {
    // Update rate limit when user or tier changes
    if (user) {
      const limit = checkRateLimit(user.id, userTier)
      setRateLimit(limit)
    }
  }, [user, userTier])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        // Get user's subscription tier from metadata
        const tier = user.user_metadata?.subscription_tier || 'free'
        setUserTier(tier as SubscriptionTier)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    }
  }

  const loadHistoryFromSupabase = async () => {
    setIsLoadingHistory(true)
    try {
      const response = await fetch('/api/prompts/list?limit=50')
      const result = await response.json()
      
      if (result.success && result.data && result.data.length > 0) {
        // Use Supabase data if available
        setHistory(result.data)
      } else {
        // Use localStorage if Supabase is empty or unavailable
        loadFromLocalStorage()
      }
      
      // If we got a fallback flag, it means network is blocking Supabase
      if (result.fallback) {
        console.log('Using localStorage due to network restrictions')
        loadFromLocalStorage()
      }
    } catch (error) {
      console.error('Error loading history from Supabase:', error)
      loadFromLocalStorage()
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const loadFromLocalStorage = () => {
    const savedHistory = localStorage.getItem('prompt_history')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        // Ensure proper format
        const formatted = parsed.map((item: any) => ({
          id: item.id || Date.now().toString(),
          prompt: item.prompt,
          model: item.model,
          user_input: item.user_input || null,
          style: item.style || null,
          format: item.format || null,
          temperature: item.temperature || null,
          max_tokens: item.max_tokens || item.maxTokens || null,
          has_image: item.has_image || false,
          created_at: item.created_at || item.timestamp || new Date().toISOString(),
          updated_at: item.updated_at || new Date().toISOString()
        }))
        setHistory(formatted)
      } catch (e) {
        console.error('Error parsing localStorage:', e)
      }
    }
  }

  const models = [
    { id: "gpt-4o", name: "GPT-4o", description: "OpenAI's most capable" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Fast and efficient" },
    { id: "gpt-5-chat-latest", name: "GPT-5 Chat", description: "Latest GPT model" },
    { id: "claude-opus-4-latest", name: "Claude Opus 4", description: "Most powerful Claude" },
    { id: "claude-sonnet-4-latest", name: "Claude Sonnet 4", description: "Balanced Claude" },
    { id: "claude-3-5-sonnet-latest", name: "Claude 3.5 Sonnet", description: "Latest Sonnet" },
    { id: "grok-3", name: "Grok 3", description: "Fast responses" },
    { id: "mistral-large-latest", name: "Mistral Large", description: "Powerful Mistral" },
    { id: "mistral-medium-latest", name: "Mistral Medium", description: "Balanced Mistral" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", description: "Google's fast model" }
  ]

  const promptStyles = [
    { id: "professional", name: "Professional" },
    { id: "creative", name: "Creative" },
    { id: "technical", name: "Technical" },
    { id: "casual", name: "Casual" },
    { id: "academic", name: "Academic" }
  ]

  const promptFormats = [
    { id: "detailed", name: "Detailed" },
    { id: "concise", name: "Concise" },
    { id: "structured", name: "Structured" },
    { id: "conversational", name: "Conversational" }
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
    setImagePreview(null)
  }

  const generatePrompt = async () => {
    // Check if user is authenticated
    if (!user) {
      setGeneratedPrompt('Please sign in to generate prompts. Click on Settings to create an account.')
      return
    }

    // Check if model is available for user's tier
    if (!isModelAvailable(selectedModel, userTier)) {
      setGeneratedPrompt(`The model "${selectedModel}" is only available for Pro and Enterprise users. Please upgrade your plan or select a different model.`)
      return
    }

    // Check rate limit for free users
    if (userTier === 'free') {
      const limit = checkRateLimit(user.id, userTier)
      if (!limit.allowed) {
        setGeneratedPrompt(`Rate limit reached. You have 0 prompts remaining. Resets in ${formatResetTime(limit.resetTime)}.\n\nUpgrade to Pro for unlimited prompts!`)
        return
      }
    }

    if (!puterReady) {
      alert('Puter is still loading. Please wait a moment and try again.')
      return
    }

    setIsGenerating(true)
    
    try {
      const prompt = await generateWithPuter(
        userInput,
        selectedModel,
        advancedOptions
      )
      
      // Ensure prompt is always a string
      const promptText = typeof prompt === 'string' 
        ? prompt 
        : JSON.stringify(prompt, null, 2)
      
      setGeneratedPrompt(promptText)
      
      // Increment rate limit for free users
      if (userTier === 'free') {
        incrementRateLimit(user.id, userTier)
        // Update rate limit display
        const limit = checkRateLimit(user.id, userTier)
        setRateLimit(limit)
      }
      
      // Save to localStorage
      const newPrompt: GeneratedPrompt = {
        id: Date.now().toString(),
        prompt: promptText,
        model: selectedModel,
        user_input: userInput,
        style: advancedOptions.style,
        format: advancedOptions.format,
        temperature: advancedOptions.temperature,
        max_tokens: advancedOptions.maxTokens,
        has_image: !!uploadedImage,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const existingHistory = localStorage.getItem('prompt_history')
      let localHistory = []
      if (existingHistory) {
        try {
          localHistory = JSON.parse(existingHistory)
        } catch {}
      }
      localHistory.unshift(newPrompt)
      localHistory = localHistory.slice(0, 50)
      localStorage.setItem('prompt_history', JSON.stringify(localHistory))
      
      // Refresh history
      await loadHistoryFromSupabase()
    } catch (error: any) {
      console.error('Error generating prompt:', error)
      
      // Use the error message directly if it's our custom error
      let errorMessage = error.message || 'An error occurred while generating the prompt.'
      
      // Only override for specific Puter error patterns we haven't already handled
      if (error?.error?.delegate === 'usage-limited-chat') {
        errorMessage = `This model has reached its usage limit. Please try one of these alternatives:
• GPT-4o or GPT-4o Mini
• Claude models
• Mistral models
• Gemini 1.5 Flash

These models typically have higher or no usage limits.`
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      setGeneratedPrompt(errorMessage)
      
      // Don't re-throw, just log the error
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    const promptText = typeof generatedPrompt === 'string' 
      ? generatedPrompt 
      : JSON.stringify(generatedPrompt, null, 2)
    navigator.clipboard.writeText(promptText)
  }

  const downloadPrompt = () => {
    const promptText = typeof generatedPrompt === 'string' 
      ? generatedPrompt 
      : JSON.stringify(generatedPrompt, null, 2)
    const blob = new Blob([promptText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-${selectedModel}-${Date.now()}.txt`
    a.click()
  }

  const testPrompt = () => {
    const promptText = typeof generatedPrompt === 'string' 
      ? generatedPrompt 
      : JSON.stringify(generatedPrompt, null, 2)
    
    // Encode the prompt and model to pass as URL parameters
    const params = new URLSearchParams({
      prompt: promptText,
      model: selectedModel
    })
    
    router.push(`/testing?${params.toString()}`)
  }

  const loadFromHistory = (prompt: GeneratedPrompt) => {
    setGeneratedPrompt(prompt.prompt)
    setSelectedModel(prompt.model)
    if (prompt.user_input) setUserInput(prompt.user_input)
    if (prompt.style) setAdvancedOptions(prev => ({ ...prev, style: prompt.style! }))
    if (prompt.format) setAdvancedOptions(prev => ({ ...prev, format: prompt.format! }))
    if (prompt.temperature !== null) setAdvancedOptions(prev => ({ ...prev, temperature: prompt.temperature! }))
    if (prompt.max_tokens !== null) setAdvancedOptions(prev => ({ ...prev, maxTokens: prompt.max_tokens! }))
    setShowHistory(false)
  }

  const deleteFromHistory = async (promptId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent loading the prompt when clicking delete
    
    // Delete from localStorage
    const savedHistory = localStorage.getItem('prompt_history')
    if (savedHistory) {
      try {
        let localHistory = JSON.parse(savedHistory)
        localHistory = localHistory.filter((item: any) => item.id !== promptId)
        localStorage.setItem('prompt_history', JSON.stringify(localHistory))
      } catch {}
    }
    
    // Try to delete from Supabase
    try {
      const response = await fetch(`/api/prompts/delete?id=${promptId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Refresh history
        await loadHistoryFromSupabase()
      } else {
        // If Supabase fails, just reload from localStorage
        loadFromLocalStorage()
      }
    } catch (error) {
      console.error('Error deleting prompt:', error)
      // Reload from localStorage if network fails
      loadFromLocalStorage()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Prompt Generator</h1>
            <p className="text-muted-foreground">Create optimized prompts for any AI model with advanced customization</p>
          </div>
          
          {/* Show subscription status */}
          {!user ? (
            <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500 text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Sign In Required</p>
                    <p className="text-sm text-muted-foreground">Please sign in to generate prompts</p>
                  </div>
                </div>
                <Link href="/settings">
                  <Button size="sm">Sign In</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border bg-card p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    userTier === 'pro' ? 'bg-gradient-to-br from-blue-500 to-purple-500' :
                    userTier === 'enterprise' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                    'bg-gray-500'
                  } text-white`}>
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium capitalize">{userTier} Plan</p>
                    {userTier === 'free' && rateLimit && (
                      <p className="text-sm text-muted-foreground">
                        {rateLimit.remaining} prompts remaining • Resets in {formatResetTime(rateLimit.resetTime)}
                      </p>
                    )}
                    {userTier !== 'free' && (
                      <p className="text-sm text-muted-foreground">Unlimited prompts • All models</p>
                    )}
                  </div>
                </div>
                {userTier === 'free' && (
                  <Link href="/pricing">
                    <Button size="sm" variant="outline">Upgrade</Button>
                  </Link>
                )}
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Input Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Input Section */}
              <div className="rounded-lg border bg-card p-6">
                <Label htmlFor="prompt-input" className="text-lg font-semibold mb-4 block">
                  Describe Your Task
                </Label>
                <textarea
                  id="prompt-input"
                  placeholder="Example: I want an AI agent that helps users write professional emails with the right tone and structure..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                />
                
                {/* Image Upload */}
                <div className="mt-4">
                  <Label className="block mb-2">Add Context Image (Optional)</Label>
                  {!uploadedImage ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/20 hover:bg-secondary/30 transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                      <span className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  ) : imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Uploaded"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Advanced Options */}
              <div className="rounded-lg border bg-card p-6">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="text-lg font-semibold">Advanced Options</span>
                  <ChevronDown className={`h-5 w-5 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                </button>
                
                {showAdvanced && (
                  <div className="mt-4 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="style">Prompt Style</Label>
                        <select
                          id="style"
                          value={advancedOptions.style}
                          onChange={(e) => setAdvancedOptions({...advancedOptions, style: e.target.value})}
                          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                          {promptStyles.map(style => (
                            <option key={style.id} value={style.id}>{style.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="format">Output Format</Label>
                        <select
                          id="format"
                          value={advancedOptions.format}
                          onChange={(e) => setAdvancedOptions({...advancedOptions, format: e.target.value})}
                          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                          {promptFormats.map(format => (
                            <option key={format.id} value={format.id}>{format.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="temperature">Temperature: {advancedOptions.temperature}</Label>
                      <input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={advancedOptions.temperature}
                        onChange={(e) => setAdvancedOptions({...advancedOptions, temperature: parseFloat(e.target.value)})}
                        className="mt-1 w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Precise</span>
                        <span>Creative</span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="max-tokens">Max Tokens: {advancedOptions.maxTokens}</Label>
                      <input
                        id="max-tokens"
                        type="range"
                        min="500"
                        max="4000"
                        step="100"
                        value={advancedOptions.maxTokens}
                        onChange={(e) => setAdvancedOptions({...advancedOptions, maxTokens: parseInt(e.target.value)})}
                        className="mt-1 w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <div className="rounded-lg">
                <Button 
                  onClick={generatePrompt} 
                  disabled={isGenerating || (!userInput && !uploadedImage)}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Prompt
                    </>
                  )}
                </Button>
              </div>

              {/* Generated Prompt */}
              {generatedPrompt && (
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Generated Prompt</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={testPrompt}>
                        <Bot className="h-4 w-4 mr-1" /> Test
                      </Button>
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4 mr-1" /> Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadPrompt}>
                        <Download className="h-4 w-4 mr-1" /> Download
                      </Button>
                    </div>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {typeof generatedPrompt === 'string' 
                        ? generatedPrompt 
                        : JSON.stringify(generatedPrompt, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Model Selection */}
              <div className="rounded-lg border bg-card p-6">
                <Label className="text-lg font-semibold mb-4 block">Select AI Model</Label>
                <div className="space-y-2">
                  {models.map(model => {
                    const isAvailable = !user || isModelAvailable(model.id, userTier)
                    const isPremium = ['gpt-4o', 'gpt-5-chat-latest', 'claude-opus-4-latest', 'claude-sonnet-4-latest', 'grok-3', 'mistral-large-latest'].includes(model.id)
                    
                    return (
                      <button
                        key={model.id}
                        onClick={() => isAvailable && setSelectedModel(model.id)}
                        disabled={!isAvailable}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedModel === model.id 
                            ? "border-primary bg-primary/10" 
                            : !isAvailable
                            ? "border-input bg-secondary/20 opacity-50 cursor-not-allowed"
                            : "border-input hover:bg-secondary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{model.name}</div>
                            <div className="text-xs text-muted-foreground">{model.description}</div>
                          </div>
                          {isPremium && userTier === 'free' && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">PRO</span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History className="mr-2 h-4 w-4" />
                  View History
                </Button>
              </div>


              {/* History Panel */}
              {showHistory && (
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="font-semibold mb-3">Recent Prompts</h3>
                  {isLoadingHistory ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  ) : history.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {history.slice(0, 10).map(item => (
                        <div
                          key={item.id}
                          className="group relative w-full text-left p-2 rounded hover:bg-secondary/50 transition-colors cursor-pointer"
                          onClick={() => loadFromHistory(item)}
                        >
                          <button
                            onClick={(e) => deleteFromHistory(item.id, e)}
                            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded"
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </button>
                          <div className="pr-8">
                            <div className="text-sm font-medium">{item.model}</div>
                            {item.user_input && (
                              <div className="text-xs text-muted-foreground truncate">
                                {item.user_input}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              {new Date(item.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No prompts yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}