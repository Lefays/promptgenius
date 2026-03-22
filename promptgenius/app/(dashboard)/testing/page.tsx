"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { usePuter } from "@/lib/hooks/use-puter"
import { supportsTemperature } from "@/lib/api/providers"
import {
  Send,
  Bot,
  User,
  Settings,
  Copy,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Loader2,
  Edit,
  Check,
  X,
  Paperclip
} from "lucide-react"

interface Attachment {
  type: 'image' | 'text'
  name: string
  url?: string       // for images (object URL)
  textContent?: string // for text files
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  attachments?: Attachment[]
}

function TestingPageContent() {
  const searchParams = useSearchParams()
  const { puterReady, chatWithPuter, generateImage } = usePuter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Get prompt and model from sessionStorage (preferred) or URL params (fallback)
  const storedPrompt = typeof window !== 'undefined' ? sessionStorage.getItem('test_prompt') : null
  const storedModel = typeof window !== 'undefined' ? sessionStorage.getItem('test_model') : null
  const initialPrompt = storedPrompt || searchParams.get('prompt') || ''
  const initialModel = storedModel || searchParams.get('model') || 'gpt-5-nano'

  // Clean up sessionStorage after reading
  useEffect(() => {
    if (storedPrompt) sessionStorage.removeItem('test_prompt')
    if (storedModel) sessionStorage.removeItem('test_model')
  }, [])

  // State
  const [systemPrompt, setSystemPrompt] = useState(initialPrompt)
  const [editingPrompt, setEditingPrompt] = useState(false)
  const [tempPrompt, setTempPrompt] = useState(systemPrompt)
  const [selectedModel, setSelectedModel] = useState(initialModel)
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([])
  
  // Typing animation
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const [displayedContent, setDisplayedContent] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Advanced options
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2000)
  const [showSettings, setShowSettings] = useState(false)
  const [promptExpanded, setPromptExpanded] = useState(false)

  const models = [
    // OpenAI
    { id: "gpt-5.4", name: "GPT-5.4", description: "Most capable OpenAI model", multimodal: true, type: "chat" },
    { id: "gpt-5.3-chat", name: "GPT-5.3 Chat", description: "Advanced conversational AI", multimodal: true, type: "chat" },
    { id: "gpt-5-nano", name: "GPT-5 Nano", description: "Fast and lightweight (default)", multimodal: false, type: "chat" },
    { id: "gpt-5-mini", name: "GPT-5 Mini", description: "Balanced speed and quality", multimodal: true, type: "chat" },
    { id: "o3-pro", name: "o3 Pro", description: "Advanced reasoning", multimodal: false, type: "chat" },
    // Anthropic
    { id: "claude-opus-4-6", name: "Claude Opus 4.6", description: "Most capable Claude", multimodal: true, type: "chat" },
    { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", description: "Fast and intelligent", multimodal: true, type: "chat" },
    { id: "claude-opus-4-5", name: "Claude Opus 4.5", description: "Powerful reasoning", multimodal: true, type: "chat" },
    { id: "claude-haiku-4-5", name: "Claude Haiku 4.5", description: "Ultra-fast Claude", multimodal: true, type: "chat" },
    // Google
    { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro", description: "Google's most capable", multimodal: true, type: "chat" },
    { id: "gemini-3.1-flash-lite-preview", name: "Gemini 3.1 Flash Lite", description: "Google's fastest", multimodal: true, type: "chat" },
    { id: "gemini-2.5-pro-preview", name: "Gemini 2.5 Pro", description: "Strong all-rounder", multimodal: true, type: "chat" },
    // xAI
    { id: "grok-4.1-fast", name: "Grok 4.1 Fast", description: "Fast and witty", multimodal: false, type: "chat" },
    { id: "grok-4-fast", name: "Grok 4 Fast", description: "Powerful Grok", multimodal: false, type: "chat" },
    // DeepSeek
    { id: "deepseek-v3.2", name: "DeepSeek v3.2", description: "Latest DeepSeek", multimodal: false, type: "chat" },
    { id: "deepseek-r1-0528", name: "DeepSeek R1", description: "Research reasoning", multimodal: false, type: "chat" },
    // Mistral
    { id: "mistral-medium-2508", name: "Mistral Medium 3.1", description: "Powerful Mistral", multimodal: false, type: "chat" },
    { id: "mistral-small-2603", name: "Mistral Small 4", description: "Fast Mistral", multimodal: false, type: "chat" },
    // Qwen
    { id: "qwen3.5-72b", name: "Qwen 3.5 72B", description: "Strong open model", multimodal: false, type: "chat" },
  ]
  
  // All models support text file attachments; multimodal models also support images
  const isMultimodal = models.find(m => m.id === selectedModel)?.multimodal || false

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const isNearBottom = useRef(true)

  // Clean up typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
    }
  }, [])

  // Only auto-scroll if user is already near the bottom
  useEffect(() => {
    if (isNearBottom.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [messages, displayedContent])

  const handleChatScroll = () => {
    const container = chatContainerRef.current
    if (!container) return
    const threshold = 100
    isNearBottom.current = container.scrollHeight - container.scrollTop - container.clientHeight < threshold
  }

  const animateTyping = (messageId: string, fullText: string): Promise<void> => {
    return new Promise((resolve) => {
      setTypingMessageId(messageId)
      setDisplayedContent("")
      let index = 0
      const chunkSize = 2 // characters per tick for natural speed
      typingIntervalRef.current = setInterval(() => {
        index += chunkSize
        if (index >= fullText.length) {
          setDisplayedContent(fullText)
          if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
          typingIntervalRef.current = null
          setTypingMessageId(null)
          resolve()
        } else {
          setDisplayedContent(fullText.slice(0, index))
        }
      }, 15) // ~15ms per tick for smooth, fast typing
    })
  }

  const handleSendMessage = async () => {
    if ((!userInput.trim() && pendingAttachments.length === 0) || isGenerating) return

    if (!puterReady) {
      alert('AI system is still loading. Please wait a moment.')
      return
    }

    // Build the display content and the AI context separately
    let displayContent = userInput
    let aiContext = userInput

    if (pendingAttachments.length > 0) {
      const labels = pendingAttachments.map(a =>
        a.type === 'text' ? `[📄 ${a.name}]` : `[🖼️ ${a.name}]`
      ).join(' ')
      displayContent = labels + (userInput ? '\n' + userInput : '')

      // Inject text file contents into what the AI actually receives
      const textParts = pendingAttachments
        .filter(a => a.type === 'text' && a.textContent)
        .map(a => `--- File: ${a.name} ---\n${a.textContent}\n--- End of ${a.name} ---`)
      if (textParts.length > 0) {
        aiContext = textParts.join('\n\n') + (userInput ? '\n\n' + userInput : '')
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: displayContent,
      timestamp: new Date(),
      attachments: pendingAttachments.length > 0 ? [...pendingAttachments] : undefined
    }

    setMessages(prev => [...prev, userMessage])
    setUserInput("")
    setPendingAttachments([])
    setIsGenerating(true)
    setIsThinking(true)

    try {
      let response
      let assistantMessage: Message

      // Check if this is an image generation model
      const currentModel = models.find(m => m.id === selectedModel)
      const isImageModel = currentModel?.type === 'image'

      if (isImageModel) {
        // Show generating message first (with unique ID)
        const generatingMessageId = `generating-${Date.now()}-${Math.random()}`
        const generatingMessage: Message = {
          id: generatingMessageId,
          role: 'assistant',
          content: '🎨 Generating image...',
          timestamp: new Date()
        }
        setIsThinking(false)
        setMessages(prev => [...prev, generatingMessage])

        try {
          // Generate image with DALL-E
          const imagePrompt = systemPrompt ? `${systemPrompt}\n\n${userInput}` : userInput
          response = await generateImage(imagePrompt, selectedModel)
        } catch (error) {
          console.error('Image generation failed:', error)
          response = null
        }

        // Remove generating message
        setMessages(prev => prev.filter(m => m.id !== generatingMessageId))

        // Create message with image
        if (response) {
          assistantMessage = {
            id: `response-${Date.now()}-${Math.random()}`,
            role: 'assistant',
            content: 'Generated image:',
            timestamp: new Date(),
            attachments: [{
              type: 'image',
              name: 'generated-image.png',
              url: response
            }]
          }
        } else {
          assistantMessage = {
            id: `error-${Date.now()}-${Math.random()}`,
            role: 'assistant',
            content: 'Failed to generate image. Please try again or use a different model.',
            timestamp: new Date()
          }
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        // Use the chat function for text models
        response = await chatWithPuter(
          systemPrompt,
          aiContext,
          selectedModel,
          {
            temperature,
            maxTokens
          }
        )

        const fullContent = typeof response === 'string' ? response : JSON.stringify(response)
        const messageId = `response-${Date.now()}-${Math.random()}`

        assistantMessage = {
          id: messageId,
          role: 'assistant',
          content: fullContent,
          timestamp: new Date()
        }

        setIsThinking(false)
        setMessages(prev => [...prev, assistantMessage])

        // Animate the typing effect
        await animateTyping(messageId, fullContent)
      }
    } catch (error) {
      console.error('Error generating response:', error)
      setIsThinking(false)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
      setIsThinking(false)
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

  const clearConversation = () => {
    if (confirm('Are you sure you want to clear the conversation?')) {
      // Revoke any image object URLs in messages
      for (const msg of messages) {
        if (msg.attachments) {
          for (const a of msg.attachments) {
            if (a.type === 'image' && a.url?.startsWith('blob:')) {
              URL.revokeObjectURL(a.url)
            }
          }
        }
      }
      setMessages([])
      setPendingAttachments([])
    }
  }
  
  // Supported text file extensions
  const textExtensions = ['.txt', '.md', '.csv', '.json', '.xml', '.html', '.css', '.js', '.ts', '.py', '.java', '.c', '.cpp', '.log', '.yaml', '.yml', '.toml', '.ini', '.cfg', '.env', '.sh', '.bat', '.sql', '.jsx', '.tsx', '.rb', '.go', '.rs', '.php', '.swift']

  const isTextFile = (file: File) => {
    if (file.type.startsWith('text/')) return true
    if (file.type === 'application/json') return true
    if (file.type === 'application/xml') return true
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    return textExtensions.includes(ext)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Accept images and text-based files
    const validFiles = files.filter(file => {
      return file.type.startsWith('image/') || isTextFile(file)
    })

    if (validFiles.length === 0) {
      alert('Please upload image or text files (.txt, .md, .json, .csv, .py, .js, etc.)')
      return
    }

    // Limit file size to 10MB
    const oversizedFiles = validFiles.filter(file => file.size > 10 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      alert('Files must be under 10MB')
      return
    }

    // Process files into attachments
    const newAttachments = await Promise.all(validFiles.map(async (file): Promise<Attachment> => {
      if (file.type.startsWith('image/')) {
        return {
          type: 'image',
          name: file.name,
          url: URL.createObjectURL(file)
        }
      } else {
        // Read text file content
        const textContent = await file.text()
        return {
          type: 'text',
          name: file.name,
          textContent: textContent.slice(0, 50000) // cap at 50k chars to avoid huge context
        }
      }
    }))

    setPendingAttachments(prev => [...prev, ...newAttachments])

    // Reset the input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = ''
  }
  
  const removeFile = (index: number) => {
    const toRemove = pendingAttachments[index]
    if (toRemove.type === 'image' && toRemove.url?.startsWith('blob:')) {
      URL.revokeObjectURL(toRemove.url)
    }
    setPendingAttachments(prev => prev.filter((_, i) => i !== index))
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
                  {systemPrompt ? (
                    <>
                      <p className={`text-sm whitespace-pre-wrap ${!promptExpanded ? 'line-clamp-4' : ''}`}>
                        {systemPrompt}
                      </p>
                      {systemPrompt.length > 200 && (
                        <button
                          onClick={() => setPromptExpanded(!promptExpanded)}
                          className="text-xs text-primary hover:underline mt-2"
                        >
                          {promptExpanded ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No system prompt set. Click edit to add one.</p>
                  )}
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
                    const isAvailable = true

                    
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
                  {supportsTemperature(selectedModel) ? (
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
                  ) : (
                    <div className="rounded-md bg-secondary/30 p-3">
                      <p className="text-sm text-muted-foreground">
                        Temperature is not configurable for {models.find(m => m.id === selectedModel)?.name || selectedModel} — this model uses a fixed temperature.
                      </p>
                    </div>
                  )}

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
          <div 
            className="lg:col-span-2 flex flex-col h-[700px] rounded-lg border bg-card relative"
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (!isGenerating) setIsDragging(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX
              const y = e.clientY
              if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
                setIsDragging(false)
              }
            }}
            onDrop={async (e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsDragging(false)
              if (isGenerating) return

              const files = Array.from(e.dataTransfer.files)
              if (files.length > 0 && fileInputRef.current) {
                const dt = new DataTransfer()
                files.forEach(file => dt.items.add(file))
                fileInputRef.current.files = dt.files
                await handleFileUpload({ target: { files: dt.files } } as any)
              }
            }}
          >
            {/* Drag overlay for entire chat */}
            {isDragging && (
              <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center z-50 pointer-events-none">
                <div className="text-center bg-background/95 p-6 rounded-lg">
                  <Paperclip className="h-12 w-12 mx-auto mb-2 text-primary animate-bounce" />
                  <p className="text-lg font-medium">Drop your files here</p>
                  <p className="text-sm text-muted-foreground">Images and text files up to 10MB</p>
                </div>
              </div>
            )}
            {/* Messages Area */}
            <div ref={chatContainerRef} onScroll={handleChatScroll} className="flex-1 overflow-y-auto p-4 space-y-4">
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
                          <p className="text-sm whitespace-pre-wrap">
                            {typingMessageId === message.id ? displayedContent : message.content}
                            {typingMessageId === message.id && (
                              <span className="inline-block w-0.5 h-4 bg-foreground ml-0.5 align-middle animate-pulse" />
                            )}
                          </p>
                          
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="relative group">
                                  {attachment.type === 'image' && attachment.url ? (
                                    <img
                                      src={attachment.url}
                                      alt={attachment.name}
                                      className="max-w-xs max-h-48 rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                                      onClick={() => attachment.url && window.open(attachment.url, '_blank')}
                                    />
                                  ) : (
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 border text-xs">
                                      <Paperclip className="h-4 w-4 flex-shrink-0" />
                                      <span className="truncate max-w-[200px]">{attachment.name}</span>
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
              {/* Thinking indicator */}
              {isThinking && (
                <div className="flex gap-3 justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0 bg-secondary">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t relative">
              {/* Pending Attachments Preview */}
              {pendingAttachments.length > 0 && (
                <div className="p-4 pb-2 flex gap-2 flex-wrap">
                  {pendingAttachments.map((attachment, index) => (
                    <div key={index} className="relative group">
                      {attachment.type === 'image' && attachment.url ? (
                        <div className="relative">
                          <img
                            src={attachment.url}
                            alt={attachment.name}
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
                          <div className="h-20 w-20 bg-secondary rounded-lg border flex flex-col items-center justify-center p-1">
                            <Paperclip className="h-6 w-6 text-muted-foreground mb-1" />
                            <span className="text-[10px] text-muted-foreground truncate w-full text-center">{attachment.name.split('.').pop()}</span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      <p className="text-xs mt-1 truncate w-20">{attachment.name}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-4">
                <div className="flex gap-2 items-end">
                  {/* File Upload Button - always available */}
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="file-upload"
                      multiple
                      accept={isMultimodal ? "image/*,.txt,.md,.csv,.json,.xml,.html,.css,.js,.ts,.py,.java,.log,.yaml,.yml,.toml,.sql,.jsx,.tsx,.rb,.go,.rs,.php" : ".txt,.md,.csv,.json,.xml,.html,.css,.js,.ts,.py,.java,.log,.yaml,.yml,.toml,.sql,.jsx,.tsx,.rb,.go,.rs,.php"}
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isGenerating}
                    />
                    <label
                      htmlFor="file-upload"
                      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                        isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Paperclip className="h-4 w-4" />
                    </label>
                  </div>

                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message or attach files..."
                    className="flex-1 min-h-[60px] max-h-[120px]"
                    disabled={isGenerating}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={(!userInput.trim() && pendingAttachments.length === 0) || isGenerating}
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