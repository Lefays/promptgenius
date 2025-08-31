import { supabase } from './client'

export interface Prompt {
  id?: string
  user_id?: string
  title: string
  content: string
  user_input?: string
  model: string
  style?: string
  format?: string
  temperature?: number
  max_tokens?: number
  created_at?: string
  updated_at?: string
}

export async function savePrompt(prompt: Omit<Prompt, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('prompts')
      .insert({
        ...prompt,
        user_id: user.id
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error saving prompt:', error)
    return null
  }
}

export async function getPrompts(limit = 50) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return []
  }
}

export async function deletePrompt(id: string) {
  try {
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting prompt:', error)
    return false
  }
}

export async function getPromptById(id: string) {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching prompt:', error)
    return null
  }
}

export async function getPromptStats() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { total: 0, today: 0, thisWeek: 0 }

    // Get total count
    const { count: total } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Get today's count
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: todayCount } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', today.toISOString())

    // Get this week's count
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const { count: weekCount } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', weekAgo.toISOString())

    return {
      total: total || 0,
      today: todayCount || 0,
      thisWeek: weekCount || 0
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return { total: 0, today: 0, thisWeek: 0 }
  }
}