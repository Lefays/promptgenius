import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Supabase connection...')
    console.log('Environment variables:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set'
    })

    const supabase = createServerClient()
    
    // Test 1: Check if we can query the prompts table
    const { data: prompts, error: promptsError } = await supabase
      .from('prompts')
      .select('*')
      .limit(1)

    // Test 2: Check table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('prompts')
      .select('*')
      .limit(0)

    return NextResponse.json({
      success: !promptsError,
      connection: 'Supabase client created',
      tableExists: !promptsError,
      error: promptsError ? {
        message: promptsError.message,
        details: promptsError.details,
        hint: promptsError.hint,
        code: promptsError.code
      } : null,
      promptsFound: prompts ? prompts.length : 0,
      environment: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing',
        keys: 'Configured'
      }
    })
  } catch (error) {
    console.error('Test DB Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Check your .env.local file and ensure the server was restarted'
    })
  }
}