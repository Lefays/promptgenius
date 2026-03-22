"use client"

import { useState, useEffect } from 'react'
import { getModelMapping, supportsTemperature } from '@/lib/api/providers'
import { PUTER_MODELS } from '@/lib/api/puter'

// Puter types are declared in lib/api/puter.ts

export function usePuter() {
  const [puterReady, setPuterReady] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load Puter.js script dynamically
    if (typeof window !== 'undefined' && !window.puter) {
      const script = document.createElement('script')
      script.src = 'https://js.puter.com/v2/'
      script.async = true
      
      script.onload = async () => {
        setTimeout(async () => {
          if (window.puter) {
            try {
              // Check if user is authenticated
              const authStatus = await window.puter.auth.getUser()
              console.log('Puter auth status:', authStatus)
              
              if (!authStatus || !authStatus.username) {
                // User not authenticated, try to authenticate
                console.log('User not authenticated with Puter, attempting auth...')
                // Puter will handle authentication automatically when needed
              }
              
              setPuterReady(true)
            } catch (error) {
              console.error('Puter auth check error:', error)
              setPuterReady(true) // Still set ready, Puter will prompt for auth when needed
            }
          }
        }, 100)
      }

      script.onerror = () => {
        console.error('Failed to load Puter.js')
        setPuterReady(false)
      }

      document.head.appendChild(script)
    } else if (window.puter) {
      setPuterReady(true)
    }
  }, [])

  const generateWithPuter = async (
    userInput: string,
    model: string,
    options: {
      style: string
      format: string
      temperature: number
      maxTokens: number
      antiPrompt?: string
      imageContext?: string
    }
  ) => {
    if (!puterReady || !window.puter) {
      throw new Error('Puter is not ready')
    }

    setLoading(true)

    const puterModel = getModelMapping(model)

    try {
      // Look up model info for model-specific optimization
      const modelInfo = PUTER_MODELS[model as keyof typeof PUTER_MODELS]
      const modelName = modelInfo?.name || model
      const modelProvider = modelInfo?.provider || 'AI'

      // Build model-specific prompting advice
      const modelAdvice = getModelSpecificAdvice(model)

      // Build style-specific instructions
      const styleGuide = getStyleGuide(options.style)

      // Build format-specific instructions
      const formatGuide = getFormatGuide(options.format)

      const systemPrompt = `You are a world-class prompt engineer. Your job is to produce a single, ready-to-use prompt that someone can paste directly into ${modelName} (${modelProvider}) and get excellent results.

HARD RULES — violating any of these makes the output useless:
1. Output ONLY the final prompt. No preamble, no "Here's a prompt…", no explanation after.
2. Start the prompt with a direct role assignment or task statement.
3. Write it as instructions TO the AI, not commentary ABOUT the prompt.
4. The prompt must be self-contained — anyone should understand it without extra context.

${modelAdvice}

${styleGuide}

${formatGuide}`

      // Build the user message with all context
      let userMessage = userInput || 'General assistance'

      if (options.antiPrompt) {
        userMessage += `\n\nCRITICAL — the generated prompt MUST contain an explicit "Do NOT" or "Avoid" section that forbids the following:\n${options.antiPrompt}`
      }

      if (options.imageContext) {
        userMessage += `\n\nNote: The user attached an image for context. The generated prompt should be designed for tasks involving visual content, image analysis, or image-related workflows.`
      }

      // Use Puter's chat API with messages array for better results
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]

      console.log('Attempting to use Puter model:', puterModel)
      const chatOptions: Record<string, unknown> = {
        model: puterModel,
        max_tokens: options.maxTokens
      }
      if (supportsTemperature(model)) {
        chatOptions.temperature = options.temperature
      }
      const response = await window.puter.ai.chat(messages, chatOptions)

      // Don't log the full response to avoid console clutter
      console.log('Puter response received successfully')
      
      // Handle different response formats from Puter
      if (typeof response === 'string') {
        return response
      } else if (response && 'message' in response && response.message?.content) {
        const content = response.message.content
        
        // If content is an array (Claude format), extract text from each item
        if (Array.isArray(content)) {
          return content.map(item => {
            if (typeof item === 'string') return item
            if (item?.text) return item.text
            return ''
          }).join('')
        }
        
        // If content is a string, return it directly
        if (typeof content === 'string') {
          return content
        }
        
        // If content is an object with text property
        if (content?.text) {
          return content.text
        }
        
        return JSON.stringify(content)
      } else if (response && 'text' in response && response.text) {
        return response.text
      } else if (Array.isArray(response)) {
        // If response is an array, join the text parts
        return response.map(item => item.text || item).join('')
      } else {
        console.error('Unexpected response format:', response)
        return JSON.stringify(response)
      }
    } catch (error) {
      console.error('Puter API error:', error)
      console.error('Error details:', {
        model: model,
        puterModel: puterModel,
        error: error,
        fullError: JSON.stringify(error, null, 2)
      })
      
      // Check if it's a temp account limitation
      if (error?.error?.delegate === 'usage-limited-chat' && error?.error?.code === 'error_400_from_delegate') {
        const currentUser = await window.puter.auth.getUser()
        if (currentUser?.is_temp) {
          throw new Error(`Temporary Puter accounts have limited AI access. To use AI models:
• Sign up for a free Puter account at puter.com
• Or click "Sign In" below to create an account

This will give you access to all AI models with generous free limits.`)
        }
      }
      
      // Check if it's a rate limit error
      if (error?.error?.code === 'rate_limit_exceeded' || 
          error?.error?.message?.includes('rate limit') ||
          error?.error?.message?.includes('too many requests')) {
        throw new Error(`You've reached the usage limit for this model. Please try:
• Waiting a few minutes before trying again
• Using a different model (GPT-5 Nano, Claude Haiku 4.5, or Gemini 3.1 Flash Lite often have higher limits)`)
      }
      
      // For other errors, provide a more helpful message
      const errorMessage = error?.error?.message || error?.message || 'Unknown error'
      throw new Error(`Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const signInToPuter = async () => {
    if (!window.puter) {
      throw new Error('Puter is not loaded')
    }
    
    try {
      await window.puter.auth.signIn()
      const user = await window.puter.auth.getUser()
      console.log('Signed in to Puter:', user)
      return user
    } catch (error) {
      console.error('Failed to sign in to Puter:', error)
      throw error
    }
  }
  
  const getPuterUser = async () => {
    if (!window.puter) return null
    
    try {
      const user = await window.puter.auth.getUser()
      return user
    } catch (error) {
      console.error('Failed to get Puter user:', error)
      return null
    }
  }

  const generateImage = async (
    prompt: string,
    model: string = 'dall-e-3'
  ) => {
    if (!puterReady || !window.puter) {
      throw new Error('Puter is not ready')
    }

    // Check if AI features are available
    if (!window.puter.ai) {
      throw new Error('Puter AI features not available')
    }
    
    if (!window.puter.ai.txt2img) {
      throw new Error('Puter txt2img function not available')
    }

    setLoading(true)
    
    try {
      console.log('Generating image with prompt:', prompt)
      console.log('Using model:', model)
      console.log('Puter AI available:', !!window.puter.ai)
      console.log('txt2img function:', typeof window.puter.ai.txt2img)
      
      // Try different methods to generate image
      let response
      
      // According to Puter docs, the simplest approach should work
      console.log('Calling puter.ai.txt2img...')
      
      try {
        // First try: Just the prompt (simplest form)
        response = await window.puter.ai.txt2img(prompt)
        console.log('txt2img response:', response)
        
        // If response is a promise, await it
        if (response && typeof response.then === 'function') {
          console.log('Response is a promise, awaiting...')
          response = await response
          console.log('Resolved response:', response)
        }
      } catch (e) {
        console.error('txt2img error:', e)
        
        // Check if it's a Puter error response
        if (e && typeof e === 'object') {
          console.error('Error details:', {
            success: e.success,
            error: e.error,
            message: e.error?.message,
            code: e.error?.code
          })
          
          // Handle specific error codes
          if (e.error?.code === 'insufficient_funds') {
            throw new Error('Image generation requires Puter credits. Please add funds to your Puter account or sign in with a funded account.')
          } else if (e.error?.status === 402) {
            throw new Error('This feature requires a paid Puter account. Please upgrade your account at puter.com')
          }
          
          // Extract error message
          const errorMsg = e.error?.message || e.message || 'Unknown error'
          throw new Error(`Image generation failed: ${errorMsg}`)
        } else {
          throw new Error('Image generation failed - check console for details')
        }
      }
      
      // Handle different response formats
      if (typeof response === 'string') {
        // Check if it's an HTML img tag with base64 data
        if (response.includes('<img') && response.includes('data:image')) {
          // Extract the base64 data URL from the img tag
          const srcMatch = response.match(/src="([^"]+)"/);
          if (srcMatch && srcMatch[1]) {
            console.log('Extracted image URL from HTML tag')
            return srcMatch[1]
          }
        }
        // Otherwise return as is (might be a URL or base64 already)
        return response
      } else if (response?.url) {
        return response.url
      } else if (response?.image) {
        return response.image
      } else if (response?.data) {
        return response.data
      } else if (Array.isArray(response) && response.length > 0) {
        // Handle array of images
        const firstImage = response[0]
        if (typeof firstImage === 'string') {
          // Check if it's an HTML img tag
          if (firstImage.includes('<img') && firstImage.includes('data:image')) {
            const srcMatch = firstImage.match(/src="([^"]+)"/);
            if (srcMatch && srcMatch[1]) {
              return srcMatch[1]
            }
          }
          return firstImage
        }
        if (firstImage?.url) return firstImage.url
        if (firstImage?.image) return firstImage.image
        return firstImage
      } else {
        console.error('Unexpected image response format:', response)
        return null
      }
    } catch (error) {
      console.error('Image generation error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const chatWithPuter = async (
    systemPrompt: string,
    userMessage: string,
    model: string,
    options: {
      temperature: number
      maxTokens: number
    }
  ) => {
    if (!puterReady || !window.puter) {
      throw new Error('Puter is not ready')
    }

    setLoading(true)
    
    const puterModel = getModelMapping(model)
    
    try {
      // Use messages array for proper system/user separation
      const messages = [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: userMessage }
      ]

      console.log('Starting Puter chat with model:', puterModel)
      const chatOptions: Record<string, unknown> = {
        model: puterModel,
        max_tokens: options.maxTokens
      }
      if (supportsTemperature(model)) {
        chatOptions.temperature = options.temperature
      }
      const response = await window.puter.ai.chat(messages, chatOptions)

      console.log('Puter chat response received')
      
      // Handle different response formats from Puter
      if (typeof response === 'string') {
        return response
      } else if (response && 'message' in response && response.message?.content) {
        const content = response.message.content
        
        if (Array.isArray(content)) {
          return content.map(item => {
            if (typeof item === 'string') return item
            if (item?.text) return item.text
            return ''
          }).join('')
        }
        
        if (typeof content === 'string') {
          return content
        }
        
        if (content?.text) {
          return content.text
        }
        
        return JSON.stringify(content)
      } else if (response && 'text' in response && response.text) {
        return response.text
      } else if (Array.isArray(response)) {
        return response.map(item => item.text || item).join('')
      } else {
        console.error('Unexpected response format:', response)
        return JSON.stringify(response)
      }
    } catch (error) {
      console.error('Puter chat error:', error)
      
      // Check if it's a rate limit or usage limit error
      if (error?.error?.code === 'rate_limit_exceeded' || 
          error?.error?.message?.includes('rate limit') ||
          error?.error?.message?.includes('too many requests') ||
          error?.error?.message?.includes('Permission denied') ||
          error?.error?.delegate === 'usage-limited-chat') {
        throw new Error(`You've reached the usage limit for this model. Please try:
• Waiting a few minutes before trying again
• Using a different model
• Creating a free Puter account at puter.com for increased limits`)
      }
      
      const errorMessage = error?.error?.message || error?.message || 'Unknown error'
      throw new Error(`Chat error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return {
    puterReady,
    loading,
    generateWithPuter,
    chatWithPuter,
    generateImage,
    signInToPuter,
    getPuterUser
  }
}

// --- Prompt engineering helpers ---

function getModelSpecificAdvice(modelId: string): string {
  if (modelId.includes('claude')) {
    return `MODEL OPTIMIZATION (Claude):
- Use XML tags like <instructions>, <context>, <constraints> to delineate sections — Claude responds especially well to these.
- Put the most important instructions at the beginning AND end (Claude pays extra attention to these positions).
- Use "think step by step" or ask for reasoning before conclusions on complex tasks.`
  }
  if (modelId.includes('gpt') || modelId.includes('o3')) {
    return `MODEL OPTIMIZATION (OpenAI):
- Use markdown headers and numbered lists — GPT models follow structured formatting well.
- Include a concrete example of desired input → output when the task is ambiguous.
- For complex tasks, break instructions into numbered steps.`
  }
  if (modelId.includes('gemini')) {
    return `MODEL OPTIMIZATION (Gemini):
- Gemini excels with clear, detailed instructions and multi-step breakdowns.
- If the task involves analysis, ask Gemini to "consider multiple perspectives."
- Leverage its large context window by being thorough rather than terse.`
  }
  if (modelId.includes('grok')) {
    return `MODEL OPTIMIZATION (Grok):
- Grok responds well to direct, no-nonsense instructions.
- It can handle unconventional or creative angles — lean into that when appropriate.
- Be explicit about tone expectations since Grok defaults to a casual, witty style.`
  }
  if (modelId.includes('deepseek')) {
    return `MODEL OPTIMIZATION (DeepSeek):
- DeepSeek excels at reasoning and code — use "think step by step" for complex logic.
- Structure prompts with clear problem → constraints → expected output.
- For code tasks, specify the language, framework, and any constraints upfront.`
  }
  if (modelId.includes('mistral')) {
    return `MODEL OPTIMIZATION (Mistral):
- Mistral follows concise, well-structured prompts best.
- Use bullet points for multi-part instructions.
- Specify language if multilingual output is desired.`
  }
  if (modelId.includes('qwen')) {
    return `MODEL OPTIMIZATION (Qwen):
- Qwen handles structured prompts and multilingual tasks well.
- Be explicit about expected output format.
- For complex tasks, break down into clear sub-tasks.`
  }
  return ''
}

function getStyleGuide(style: string): string {
  const guides: Record<string, string> = {
    professional: `STYLE — Professional:
The generated prompt should instruct the AI to use formal language, maintain a business-appropriate tone, be precise and authoritative, and avoid slang, humor, or casual phrasing.`,
    creative: `STYLE — Creative:
The generated prompt should instruct the AI to be imaginative, use vivid language, explore unexpected angles, employ metaphors or storytelling when useful, and prioritize originality over convention.`,
    technical: `STYLE — Technical:
The generated prompt should instruct the AI to use precise terminology, include implementation details, reference specific technologies/frameworks when relevant, and prioritize accuracy and depth over simplicity.`,
    casual: `STYLE — Casual:
The generated prompt should instruct the AI to use conversational language, be approachable and friendly, explain things simply, and feel like a knowledgeable friend helping out.`,
    academic: `STYLE — Academic:
The generated prompt should instruct the AI to use scholarly language, cite reasoning frameworks, structure arguments with claims and evidence, maintain objectivity, and use discipline-appropriate terminology.`
  }
  return guides[style] || guides.professional
}

function getFormatGuide(format: string): string {
  const guides: Record<string, string> = {
    detailed: `FORMAT — Detailed:
Generate a comprehensive prompt with multiple sections: role definition, detailed instructions, constraints, output format specification, and examples where helpful. Aim for thoroughness — the prompt should leave no ambiguity about what's expected.`,
    concise: `FORMAT — Concise:
Generate a focused, compact prompt. Every sentence must earn its place. No filler, no redundancy. The prompt should be under 150 words but still crystal-clear about the task, constraints, and expected output.`,
    structured: `FORMAT — Structured:
Generate a prompt with clear visual hierarchy: bold section headers, numbered steps, bullet-point constraints, and a defined output format section. The prompt should be easy to scan and parse at a glance.`,
    conversational: `FORMAT — Conversational:
Generate a prompt that reads like a natural briefing — as if you're explaining the task to a colleague. Use flowing prose rather than rigid sections. Still be clear about expectations, but embed them naturally rather than listing them mechanically.`
  }
  return guides[format] || guides.detailed
}