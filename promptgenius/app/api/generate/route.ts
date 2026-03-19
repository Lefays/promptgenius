import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateFallbackPrompt } from './helpers'
import { selectBestTemplate, promptTemplates } from './prompt-templates'
import { createSystemPrompt } from '@/lib/api/providers'

// Lazy-initialize Supabase client to avoid build-time errors
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

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
      // Get the authenticated user from the request headers
      const authHeader = request.headers.get('authorization')
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '')
        const supabase = getSupabase()
        const { data: { user } } = await supabase.auth.getUser(token)

        if (user) {
          // Save the prompt to the database
          const { error } = await supabase
            .from('prompts')
            .insert({
              user_id: user.id,
              title: userInput ? userInput.substring(0, 100) : 'AI Prompt',
              content: optimizedPrompt,
              user_input: userInput,
              model: model,
              style: style,
              format: format,
              temperature: temperature,
              max_tokens: maxTokens
            })

          if (error) {
            console.error('Database save error:', error)
          } else {
            console.log('Prompt saved to database successfully')
          }
        }
      }
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
