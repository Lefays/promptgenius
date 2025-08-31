import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = createServerClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Sign out successful!' })
  } catch (error) {
    console.error('Signout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}