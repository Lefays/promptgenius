import { NextResponse } from 'next/server'

export async function GET() {
  // Test if environment variables are set
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
  
  return NextResponse.json({
    status: 'ok',
    supabase: {
      url: hasSupabaseUrl ? 'configured' : 'missing',
      anonKey: hasSupabaseKey ? 'configured' : 'missing',
      serviceKey: hasServiceKey ? 'configured' : 'missing'
    },
    message: 'Auth system is ready. Use POST /api/auth/signin or /api/auth/signup to authenticate.'
  })
}