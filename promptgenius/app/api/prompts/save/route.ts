import { NextRequest, NextResponse } from 'next/server'
// import { createServerClient } from '@/lib/supabase/server' // Temporarily disabled

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      prompt, 
      model, 
      style, 
      format, 
      temperature, 
      maxTokens,
      hasImage,
      userInput,
      userId 
    } = body

    if (!prompt || !model) {
      return NextResponse.json(
        { success: false, error: 'Prompt and model are required' },
        { status: 400 }
      )
    }

    // Skip database save for now due to type issues
    // This can be enabled once the database schema is updated
    const data = {
      id: crypto.randomUUID(),
      prompt,
      model,
      style,
      format,
      temperature,
      max_tokens: maxTokens,
      has_image: hasImage || false,
      user_input: userInput,
      user_id: userId || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // No error since we're using mock data
    const error = null

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Server error saving prompt:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save prompt' },
      { status: 500 }
    )
  }
}