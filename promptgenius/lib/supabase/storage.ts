import { supabase } from './client'

const BUCKET_NAME = 'prompt-files'

export async function uploadFile(file: File, userId: string): Promise<string | null> {
  try {
    // Create unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('Upload error:', error)
    return null
  }
}

export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const url = new URL(filePath)
    const pathParts = url.pathname.split(`/${BUCKET_NAME}/`)
    if (pathParts.length < 2) return false
    
    const fileName = pathParts[1]
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

export async function deleteUserFiles(userId: string): Promise<void> {
  try {
    // List all files for user
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(userId)

    if (error) {
      console.error('List error:', error)
      return
    }

    if (!data || data.length === 0) return

    // Delete all files
    const filePaths = data.map(file => `${userId}/${file.name}`)
    await supabase.storage
      .from(BUCKET_NAME)
      .remove(filePaths)
  } catch (error) {
    console.error('Cleanup error:', error)
  }
}