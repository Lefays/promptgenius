import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    console.log('Attempting to connect to Supabase...')
    const supabase = createServerClient()
    console.log('Supabase client created successfully')

    let query = supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (userId) {
      query = query.eq('user_id', userId)
    } else {
      // For anonymous users, only show prompts without user_id
      query = query.is('user_id', null)
    }

    console.log('Executing query...')
    const { data, error, count } = await query
    console.log('Query result:', { data, error })

    if (error) {
      console.error('Error fetching prompts:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // Handle network/fetch errors (common with firewalls/proxies)
      if (error.message && (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED'))) {
        console.log('Network error - likely firewall/proxy blocking Supabase')
        return NextResponse.json({
          success: true,
          data: [],
          count: 0,
          message: 'Cannot connect to Supabase (network/firewall issue). Using local storage fallback.',
          fallback: true,
          pagination: {
            limit,
            offset,
            hasMore: false
          }
        })
      }
      
      // Return empty array if tables don't exist yet
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        return NextResponse.json({
          success: true,
          data: [],
          count: 0,
          message: 'Database tables not yet created. Please run the schema SQL in Supabase.',
          pagination: {
            limit,
            offset,
            hasMore: false
          }
        })
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      count,
      pagination: {
        limit,
        offset,
        hasMore: count ? offset + limit < count : false
      }
    })
  } catch (error) {
    console.error('Server error fetching prompts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prompts' },
      { status: 500 }
    )
  }
}