import { NextRequest, NextResponse } from 'next/server'
// import { createServerClient } from '@/lib/supabase/server' // Temporarily disabled
import { 
  generateGeminiPrompt, 
  generateLlamaPrompt, 
  generateMistralPrompt, 
  generateFallbackPrompt 
} from './helpers'
import { selectBestTemplate, promptTemplates, enhancePromptWithTechniques } from './prompt-templates'
import { AIProviderService, createSystemPrompt, availableModels } from '@/lib/api/providers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      userInput, 
      model, 
      imageData, 
      options = {},
      apiKey,
      provider = 'gemini',
      grokApiKey
    } = body

    const {
      temperature = 0.7,
      maxTokens = 2000,
      style = 'professional',
      format = 'detailed'
    } = options

    // All models are through Puter now, which can only run in browser
    // Server-side generation is not supported with Puter
    if (provider === 'puter' || !provider) {
      return NextResponse.json({ 
        success: false, 
        error: 'Puter must be used client-side. Please check your provider selection.',
        requiresClientSide: true,
        fallbackPrompt: generateFallbackPrompt(userInput, model)
      })
    }
    
    const providerApiKey = provider === 'grok' ? (grokApiKey || apiKey) : apiKey
    
    if (!providerApiKey) {
      return NextResponse.json({ 
        success: false, 
        error: `${(provider || 'API').toUpperCase()} key is required`,
        fallbackPrompt: generateFallbackPrompt(userInput, model)
      })
    }

    // We'll generate the prompt directly here since AIProviderService 
    // would create a circular dependency (it calls this API route)

    // Detect best template for the user's task
    const bestTemplate = selectBestTemplate(userInput || '')
    const templateGuidance = bestTemplate && promptTemplates[bestTemplate] 
      ? `\n\n**Recommended Structure (${promptTemplates[bestTemplate].name}):**\n${promptTemplates[bestTemplate].structure.join('\n')}` 
      : ''

    // Determine which techniques to apply
    const techniques = []
    if (format === 'detailed') techniques.push('examples')
    if (format === 'structured') techniques.push('structured')
    if (style === 'technical' || style === 'academic') techniques.push('chainOfThought')
    techniques.push('constraints')

    // Construct the system prompt
    const systemPrompt = createSystemPrompt(style)

    // Add template guidance if available
    const enhancedSystemPrompt = templateGuidance 
      ? `${systemPrompt}\n\n${templateGuidance}`
      : systemPrompt

    // Generate the optimized prompt directly
    // Since we're using Puter on the client side, we just return a structured prompt
    const optimizedPrompt = `${enhancedSystemPrompt}

User Request: ${userInput || 'General assistance'}

Style: ${style}
Format: ${format}
Temperature: ${temperature}
Max Tokens: ${maxTokens}

Please provide a comprehensive response following the guidelines above.`

    // Save to Supabase database - skip if there's an error since it's optional
    try {
      // We'll skip database save for now due to type issues
      // This can be enabled once the database schema is updated
      console.log('Database save skipped - prompt generated successfully')
    } catch (dbError) {
      console.error('Failed to save prompt to database:', dbError)
      // Don't fail the request if database save fails
    }

    return NextResponse.json({
      success: true,
      prompt: optimizedPrompt,
      model: model,
      provider: provider || 'puter',
      metadata: {
        style,
        format,
        temperature,
        maxTokens,
        hasImage: !!imageData
      }
    })
  } catch (error) {
    console.error('Error generating prompt:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate prompt'
    const body = await request.json().catch(() => ({}))
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        fallbackPrompt: generateFallbackPrompt(body.userInput, body.model)
      },
      { status: 500 }
    )
  }
}

function generateGPT4Prompt(userInput: string, style: string, format: string, temperature: number, maxTokens: number, imageData?: string): string {
  const styleMap: { [key: string]: string } = {
    professional: "professional, clear, and authoritative",
    creative: "creative, imaginative, and engaging",
    technical: "technically precise and detailed",
    casual: "friendly, approachable, and conversational",
    academic: "scholarly, well-researched, and formal"
  }

  const formatMap: { [key: string]: string } = {
    detailed: "comprehensive with examples and explanations",
    concise: "brief and to the point",
    structured: "well-organized with clear sections",
    conversational: "natural dialogue flow"
  }

  return `You are a highly capable AI assistant with advanced reasoning and analysis capabilities.

Your task: ${userInput}

${imageData ? "Context: An image has been provided. Analyze it carefully and incorporate relevant visual information into your response." : ""}

Instructions:
- Adopt a ${styleMap[style]} tone
- Provide a response that is ${formatMap[format]}
- Focus on accuracy, helpfulness, and clarity
- Use your advanced reasoning to provide insightful analysis
- Break down complex topics into understandable components
${temperature > 0.7 ? "- Feel free to be creative and explore different perspectives" : "- Maintain precision and stick to factual information"}

Output parameters:
- Maximum length: Approximately ${maxTokens} tokens
- Structure: ${format}
- Style: ${style}

Please provide your response:`
}

function generateGPT35Prompt(userInput: string, style: string, format: string, temperature: number, maxTokens: number, imageData?: string): string {
  return `Task: ${userInput}

Please provide a ${style} response that is ${format}.
${imageData ? "Note: Consider the context from the provided image." : ""}

Requirements:
- Be clear and helpful
- Use a ${style} tone
- Keep the response ${format}
- Maximum length: ${maxTokens} tokens

Response:`
}

function generateClaudePrompt(userInput: string, style: string, format: string, temperature: number, maxTokens: number, imageData?: string): string {
  return `Human: I need assistance with the following task:

${userInput}

${imageData ? "I've provided an image for additional context. Please analyze it and incorporate relevant information." : ""}

Please provide a ${style} response that is ${format}. Focus on:
1. Clear, systematic thinking
2. Comprehensive coverage of the topic
3. Practical, actionable insights
4. ${temperature > 0.7 ? "Creative solutions and novel perspectives" : "Accurate, fact-based information"}

Assistant:`
}

function getModelSpecificGuidance(model: string, style: string, format: string): string {
  const styleGuides: { [key: string]: string } = {
    professional: "Use clear, authoritative language with structured reasoning",
    creative: "Employ vivid descriptions, metaphors, and innovative approaches",
    technical: "Include precise terminology, code examples when relevant, and systematic breakdowns",
    casual: "Use conversational tone with relatable examples and approachable language",
    academic: "Incorporate scholarly tone, citations format, and methodical analysis"
  }

  const formatGuides: { [key: string]: string } = {
    detailed: "Provide comprehensive coverage with examples, edge cases, and thorough explanations",
    concise: "Focus on essential points, use bullet points, avoid redundancy",
    structured: "Use clear headers, numbered lists, and logical flow between sections",
    conversational: "Natural dialogue style with smooth transitions and engaging narrative"
  }

  const modelSpecifics: { [key: string]: string } = {
    'gpt-4': `
**GPT-4 Optimization:**
- Leverage advanced reasoning capabilities
- Include complex multi-step instructions
- Use chain-of-thought prompting for analytical tasks
- Can handle nuanced context and subtle requirements`,
    
    'gpt-3.5': `
**GPT-3.5 Optimization:**
- Keep instructions clear and direct
- Break complex tasks into simpler steps
- Provide clear examples for better understanding
- Focus on efficiency and speed`,
    
    'claude': `
**Claude Optimization:**
- Emphasize systematic thinking and analysis
- Include ethical considerations where relevant
- Use "Human:" and "Assistant:" format
- Leverage ability to handle long contexts
- Encourage thorough, thoughtful responses`,
    
    'gemini': `
**Gemini Optimization:**
- Utilize multimodal capabilities when applicable
- Structure for clear, formatted outputs
- Include specific examples and use cases
- Leverage strong analytical capabilities`,
    
    'llama': `
**LLaMA Optimization:**
- Direct, clear instructions work best
- Include context and background information
- Use simple, structured formatting
- Focus on open-ended generation tasks`,
    
    'mistral': `
**Mistral Optimization:**
- Efficient, concise instructions
- Focus on specific tasks
- Clear output requirements
- Leverage instruction-following capabilities`
  }

  return `
**STYLE GUIDANCE (${style}):**
${styleGuides[style] || styleGuides.professional}

**FORMAT GUIDANCE (${format}):**
${formatGuides[format] || formatGuides.detailed}

${modelSpecifics[model] || modelSpecifics['gpt-4']}`
}