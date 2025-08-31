"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
  Send, 
  Bot,
  User,
  Settings,
  Copy,
  RotateCcw,
  Sparkles,
  ChevronDown,
  AlertCircle,
  Loader2,
  Edit,
  Check,
  X,
  Paperclip,
  FileVideo,
  FileImage,
  File as FileIcon
} from "lucide-react"

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  attachments?: {
    type: 'image' | 'video' | 'file'
    name: string
    url: string
  }[]
}

function TestingPageContent() {
  const searchParams = useSearchParams()
  const { puterReady, chatWithPuter } = usePuter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const uploadedFilePaths = useRef<string[]>([])
  
  // Get prompt and model from URL params
  const initialPrompt = searchParams.get('prompt') || ''
  const initialModel = searchParams.get('model') || 'gpt-4o-mini'
  
  // State
  const [systemPrompt, setSystemPrompt] = useState(initialPrompt)
  const [editingPrompt, setEditingPrompt] = useState(false)
  const [tempPrompt, setTempPrompt] = useState(systemPrompt)
  const [selectedModel, setSelectedModel] = useState(initialModel)
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [filePreview, setFilePreview] = useState<{ name: string; url: string; type: string; path?: string }[]>([])
  
  // Authentication and subscription
  const [user, setUser] = useState<any>(null)
  const [userTier, setUserTier] = useState<SubscriptionTier>('free')
  const [rateLimit, setRateLimit] = useState<{ allowed: boolean; remaining: number; resetTime: number } | null>(null)
  
  // Advanced options
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2000)
  const [showSettings, setShowSettings] = useState(false)

  const models = [
    { id: "gpt-4o", name: "GPT-4o", description: "OpenAI's most capable", multimodal: true },
    { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Fast and efficient", multimodal: true },
    { id: "gpt-5-chat-latest", name: "GPT-5 Chat", description: "Latest GPT model", multimodal: true },
    { id: "claude-opus-4-latest", name: "Claude Opus 4", description: "Most powerful Claude", multimodal: true },
    { id: "claude-sonnet-4-latest", name: "Claude Sonnet 4", description: "Balanced Claude", multimodal: true },
    { id: "claude-3-5-sonnet-latest", name: "Claude 3.5 Sonnet", description: "Latest Sonnet", multimodal: true },
    { id: "grok-3", name: "Grok 3", description: "Fast responses", multimodal: false },
    { id: "mistral-large-latest", name: "Mistral Large", description: "Powerful Mistral", multimodal: false },
    { id: "mistral-medium-latest", name: "Mistral Medium", description: "Balanced Mistral", multimodal: false },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", description: "Google's fast model", multimodal: true }
  ]
  
  // Check if current model supports files
  const isMultimodal = models.find(m => m.id === selectedModel)?.multimodal || false

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      const limit = checkRateLimit(user.id, userTier)
      setRateLimit(limit)
    }
  }, [user, userTier])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const tier = user.user_metadata?.subscription_tier || 'free'
        setUserTier(tier as SubscriptionTier)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if ((!userInput.trim() && filePreview.length === 0) || isGenerating) return

    // Check authentication
    if (!user) {
      alert('Please sign in to test prompts')
      return
    }

    // Check model availability
    if (!isModelAvailable(selectedModel, userTier)) {
      alert(`The model "${selectedModel}" requires a Pro subscription`)
      return
    }

    // Check rate limit
    if (userTier === 'free') {
      const limit = checkRateLimit(user.id, userTier)
      if (!limit.allowed) {
        alert(`Rate limit reached. Resets in ${formatResetTime(limit.resetTime)}`)
        return
      }
    }

    if (!puterReady) {
      alert('AI system is still loading. Please wait a moment.')
      return
    }

    // Build message content with files if present
    let messageContent = userInput
    if (filePreview.length > 0) {
      const fileDescriptions = filePreview.map(f => `[${f.type === 'video' ? '📹' : '📷'} ${f.name}]`).join(' ')
      messageContent = fileDescriptions + (userInput ? '\n' + userInput : '')
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
      attachments: filePreview.length > 0 ? filePreview.map(f => ({
        type: f.type as 'image' | 'video',
        name: f.name,
        url: f.url
      })) : undefined
    }

    setMessages(prev => [...prev, userMessage])
    setUserInput("")
    setAttachedFiles([])
    setFilePreview([])
    setIsGenerating(true)

    try {
      // Use the new chat function for proper conversational responses
      const response = await chatWithPuter(
        systemPrompt,
        userInput,
        selectedModel,
        {
          temperature,
          maxTokens
        }
      )

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: typeof response === 'string' ? response : JSON.stringify(response),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Update rate limit for free users
      if (userTier === 'free') {
        incrementRateLimit(user.id, userTier)
        const limit = checkRateLimit(user.id, userTier)
        setRateLimit(limit)
      }
      
      // Clean up uploaded files after successful response
      if (uploadedFilePaths.current.length > 0) {
        for (const path of uploadedFilePaths.current) {
          try {
            await fetch('/api/files/upload', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ path })
            })
          } catch (error) {
            console.error('Error cleaning up file:', error)
          }
        }
        uploadedFilePaths.current = []
      }
    } catch (error) {
      console.error('Error generating response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const clearConversation = async () => {
    if (confirm('Are you sure you want to clear the conversation?')) {
      // Clean up any remaining uploaded files
      if (uploadedFilePaths.current.length > 0) {
        for (const path of uploadedFilePaths.current) {
          try {
            await fetch('/api/files/upload', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ path })
            })
          } catch (error) {
            console.error('Error cleaning up file:', error)
          }
        }
        uploadedFilePaths.current = []
      }
      
      setMessages([])
      setAttachedFiles([])
      setFilePreview([])
    }
  }
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Filter for video and image files only
    const validFiles = files.filter(file => {
      const isVideo = file.type.startsWith('video/')
      const isImage = file.type.startsWith('image/')
      return isVideo || isImage
    })
    
    if (validFiles.length === 0) {
      alert('Please upload only image or video files')
      return
    }
    
    // Limit file size to 10MB
    const oversizedFiles = validFiles.filter(file => file.size > 10 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      alert('Files must be under 10MB')
      return
    }
    
    if (!user) {
      alert('Please sign in to upload files')
      return
    }
    
    setAttachedFiles(validFiles)
    
    // Upload files to Supabase and create previews
    const previews = await Promise.all(validFiles.map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user.id)
      
      try {
        const response = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) throw new Error('Upload failed')
        
        const { url, path } = await response.json()
        uploadedFilePaths.current.push(path)
        
        const type = file.type.startsWith('video/') ? 'video' : 'image'
        return { name: file.name, url, type, path }
      } catch (error) {
        console.error('Upload error:', error)
        // Fallback to local preview
        const url = URL.createObjectURL(file)
        const type = file.type.startsWith('video/') ? 'video' : 'image'
        return { name: file.name, url, type }
      }
    }))
    
    setFilePreview(previews)
  }
  
  const removeFile = async (index: number) => {
    const newFiles = attachedFiles.filter((_, i) => i !== index)
    const newPreviews = filePreview.filter((_, i) => i !== index)
    
    // Clean up Supabase file if it exists
    const fileToRemove = filePreview[index]
    if (fileToRemove.path) {
      try {
        await fetch('/api/files/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: fileToRemove.path })
        })
        // Remove from tracking
        uploadedFilePaths.current = uploadedFilePaths.current.filter(p => p !== fileToRemove.path)
      } catch (error) {
        console.error('Error deleting file:', error)
      }
    } else {
      // Clean up object URLs for local files
      URL.revokeObjectURL(filePreview[index].url)
    }
    
    setAttachedFiles(newFiles)
    setFilePreview(newPreviews)
  }

  const savePrompt = () => {
    setEditingPrompt(false)
    setSystemPrompt(tempPrompt)
  }

  const cancelEdit = () => {
    setEditingPrompt(false)
    setTempPrompt(systemPrompt)
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Prompt Testing Lab</h1>
          <p className="text-muted-foreground">Test your AI prompts in real-time with different models</p>
        </div>

        {/* Subscription Status */}
        {!user ? (
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium">Sign In Required</p>
                  <p className="text-sm text-muted-foreground">Please sign in to test prompts</p>
                </div>
              </div>
              <Link href="/settings">
                <Button size="sm">Sign In</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
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
                    {rateLimit.remaining} tests remaining • Resets in {formatResetTime(rateLimit.resetTime)}
                  </p>
                )}
              </div>
            </div>
            {userTier === 'free' && (
              <Link href="/pricing">
                <Button size="sm" variant="outline">Upgrade</Button>
              </Link>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - System Prompt & Settings */}
          <div className="space-y-4">
            {/* System Prompt Card */}
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-semibold">System Prompt</Label>
                {editingPrompt ? (
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={savePrompt}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={cancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button size="icon" variant="ghost" onClick={() => {
                    setEditingPrompt(true)
                    setTempPrompt(systemPrompt)
                  }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {editingPrompt ? (
                <Textarea
                  value={tempPrompt}
                  onChange={(e) => setTempPrompt(e.target.value)}
                  className="min-h-[150px] text-sm"
                  placeholder="Enter the system prompt..."
                />
              ) : (
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">
                    {systemPrompt || "No system prompt set. Click edit to add one."}
                  </p>
                </div>
              )}
            </div>

            {/* Model Selection */}
            <div className="rounded-lg border bg-card p-4">
              <Label className="text-sm font-semibold mb-3 block">Model</Label>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setShowModelSelector(!showModelSelector)}
              >
                <span className="text-sm">
                  {models.find(m => m.id === selectedModel)?.name || 'Select Model'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {showModelSelector && (
                <div className="mt-2 space-y-1 max-h-[300px] overflow-y-auto">
                  {models.map(model => {
                    const isAvailable = !user || isModelAvailable(model.id, userTier)
                    const isPremium = ['gpt-4o', 'gpt-5-chat-latest', 'claude-opus-4-latest', 'claude-sonnet-4-latest', 'grok-3', 'mistral-large-latest'].includes(model.id)
                    
                    return (
                      <button
                        key={model.id}
                        onClick={() => {
                          if (isAvailable) {
                            setSelectedModel(model.id)
                            setShowModelSelector(false)
                          }
                        }}
                        disabled={!isAvailable}
                        className={`w-full text-left p-2 rounded text-sm transition-colors ${
                          selectedModel === model.id 
                            ? "bg-primary/10 border border-primary" 
                            : !isAvailable
                            ? "bg-secondary/20 opacity-50 cursor-not-allowed"
                            : "hover:bg-secondary/50"
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
              )}
            </div>

            {/* Advanced Settings */}
            <div className="rounded-lg border bg-card">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between p-4 hover:bg-primary/10 hover:text-primary rounded-t-lg transition-colors"
                onClick={() => setShowSettings(!showSettings)}
              >
                <span className="flex items-center gap-2 font-medium">
                  <Settings className="h-4 w-4" />
                  Model Configuration
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showSettings ? 'rotate-180' : ''}`} />
              </Button>
              
              {showSettings && (
                <div className="p-4 space-y-5 border-t">
                  {/* Temperature Control */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Temperature</Label>
                      <span className="text-xs font-mono bg-secondary px-2 py-1 rounded">{temperature.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Precise</span>
                      <span>Balanced</span>
                      <span>Creative</span>
                    </div>
                  </div>

                  {/* Max Tokens Control */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Response Length</Label>
                      <span className="text-xs font-mono bg-secondary px-2 py-1 rounded">{maxTokens}</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="4000"
                      step="100"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Short</span>
                      <span>Medium</span>
                      <span>Long</span>
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Quick Presets</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setTemperature(0.3)
                          setMaxTokens(1000)
                        }}
                        className="text-xs hover:bg-primary hover:text-primary-foreground"
                      >
                        📊 Factual
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setTemperature(0.7)
                          setMaxTokens(2000)
                        }}
                        className="text-xs hover:bg-primary hover:text-primary-foreground"
                      >
                        ⚖️ Balanced
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setTemperature(1.5)
                          setMaxTokens(3000)
                        }}
                        className="text-xs hover:bg-primary hover:text-primary-foreground"
                      >
                        🎨 Creative
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setTemperature(0.1)
                          setMaxTokens(500)
                        }}
                        className="text-xs hover:bg-primary hover:text-primary-foreground"
                      >
                        🎯 Precise
                      </Button>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Tip:</span> Lower temperature for factual tasks, higher for creative writing. Adjust response length based on your needs.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={clearConversation}
                disabled={messages.length === 0}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Clear Conversation
              </Button>
              <Link href="/generator" className="block">
                <Button variant="outline" className="w-full">
                  Back to Generator
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Panel - Chat Interface */}
          <div className="lg:col-span-2 flex flex-col h-[700px] rounded-lg border bg-card">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Start Testing Your Prompt</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Send a message to test how your AI agent responds with the current system prompt and model.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}>
                      <div className={`flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex flex-col items-start space-y-2">
                        <div className={`p-3 rounded-lg max-w-fit ${
                          message.role === 'user' 
                            ? 'bg-primary/10' 
                            : 'bg-secondary/50'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="relative group">
                                  {attachment.type === 'image' ? (
                                    <img 
                                      src={attachment.url} 
                                      alt={attachment.name}
                                      className="max-w-xs max-h-48 rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                                      onClick={() => window.open(attachment.url, '_blank')}
                                    />
                                  ) : (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border cursor-pointer hover:bg-secondary/70 transition-colors"
                                         onClick={() => window.open(attachment.url, '_blank')}>
                                      <FileVideo className="h-5 w-5" />
                                      <span className="text-sm">{attachment.name}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => copyMessage(message.content)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t">
              {/* File Preview Area */}
              {filePreview.length > 0 && (
                <div className="p-4 pb-2 flex gap-2 flex-wrap">
                  {filePreview.map((file, index) => (
                    <div key={index} className="relative group">
                      {file.type === 'image' ? (
                        <div className="relative">
                          <img 
                            src={file.url} 
                            alt={file.name}
                            className="h-20 w-20 object-cover rounded-lg border"
                          />
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="h-20 w-20 bg-secondary rounded-lg border flex items-center justify-center">
                            <FileVideo className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      <p className="text-xs mt-1 truncate w-20">{file.name}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="p-4">
                <div className="flex gap-2 items-end">
                  {/* File Upload Button - Only show for multimodal models */}
                  {isMultimodal && (
                    <div className="relative">
                      <input
                        type="file"
                        id="file-upload"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isGenerating || !user}
                      />
                      <label
                        htmlFor="file-upload"
                        className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                          isGenerating || !user ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Paperclip className="h-4 w-4" />
                      </label>
                    </div>
                  )}
                  
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isMultimodal ? "Type your message or attach files..." : "Type your message..."}
                    className="flex-1 min-h-[60px] max-h-[120px]"
                    disabled={isGenerating || !user}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={(!userInput.trim() && filePreview.length === 0) || isGenerating || !user}
                    className="px-6"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TestingPage() {
  return (
    <Suspense fallback={
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    }>
      <TestingPageContent />
    </Suspense>
  )
}