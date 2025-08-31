"use client"

import { useState, useEffect } from 'react'
import { getModelMapping } from '@/lib/api/providers'

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
    }
  ) => {
    if (!puterReady || !window.puter) {
      throw new Error('Puter is not ready')
    }

    setLoading(true)
    
    const puterModel = getModelMapping(model)
    
    try {
      // Create the system prompt
      const systemPrompt = `You are an expert AI prompt engineer. Generate a professional, structured prompt based on the user's requirements.

**CRITICAL RULES:**
- NEVER include meta-commentary like "Here's a prompt for...", "This prompt will...", or "I've created..."
- Start DIRECTLY with the role definition or task assignment
- Output ONLY the prompt itself, ready to be copied and used immediately
- Use clear section headers with ** markdown formatting

**USER REQUIREMENTS:**
Style: ${options.style}
Format: ${options.format}
Temperature: ${options.temperature} (0=precise, 1=creative)
Max Tokens: ${options.maxTokens}
Task Description: "${userInput || 'General assistance'}"

**PROMPT STRUCTURE TO FOLLOW:**
1. Begin with direct role assignment ("You are a/an..." or direct task statement)
2. Include these sections as appropriate:
   - **Instructions:** Clear, numbered steps or bullet points
   - **Constraints:** Specific dos and don'ts
   - **Expected Output Format:** Exact structure required
   - **Tone and Style:** Voice and approach guidelines

Generate the prompt now - output ONLY the prompt itself:`

      // Use Puter's chat API
      console.log('Attempting to use Puter model:', puterModel)
      const response = await window.puter.ai.chat(systemPrompt, {
        model: puterModel,
        temperature: options.temperature,
        max_tokens: options.maxTokens
      })

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
• Using a different model (GPT-4o Mini, Claude Haiku, or Mistral models often have higher limits)`)
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
      // Create a chat-focused prompt
      const chatPrompt = `${systemPrompt}

User Input: ${userMessage}

Please provide your response following the instructions above:`

      console.log('Starting Puter chat with model:', puterModel)
      const response = await window.puter.ai.chat(chatPrompt, {
        model: puterModel,
        temperature: options.temperature,
        max_tokens: options.maxTokens
      })

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
    signInToPuter,
    getPuterUser
  }
}