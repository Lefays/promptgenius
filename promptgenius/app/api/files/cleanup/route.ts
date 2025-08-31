import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for storage operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const BUCKET_NAME = 'prompt-files'

export async function GET(request: NextRequest) {
  try {
    // This endpoint can be called by a cron job to clean up old files
    // Get all files in the bucket
    const { data: files, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', {
        limit: 1000,
        offset: 0
      })

    if (error) {
      console.error('Error listing files:', error)
      return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ message: 'No files to clean up' })
    }

    const now = Date.now()
    const twoHoursAgo = now - (2 * 60 * 60 * 1000) // 2 hours in milliseconds
    let deletedCount = 0
    const filesToDelete = []

    // Check each file's age based on its name (includes timestamp)
    for (const file of files) {
      // Skip directories
      if (!file.name || file.metadata?.mimetype === 'directory') continue
      
      // Try to extract timestamp from filename (format: userId/timestamp-randomstring.ext)
      const match = file.name.match(/\/(\d+)-/)
      if (match) {
        const fileTimestamp = parseInt(match[1])
        if (fileTimestamp < twoHoursAgo) {
          filesToDelete.push(file.name)
        }
      }
    }

    // Delete old files in batches
    if (filesToDelete.length > 0) {
      const batchSize = 50
      for (let i = 0; i < filesToDelete.length; i += batchSize) {
        const batch = filesToDelete.slice(i, i + batchSize)
        const { error: deleteError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove(batch)
        
        if (deleteError) {
          console.error('Error deleting batch:', deleteError)
        } else {
          deletedCount += batch.length
        }
      }
    }

    return NextResponse.json({ 
      message: `Cleanup completed. Deleted ${deletedCount} files older than 2 hours.`,
      filesChecked: files.length,
      filesDeleted: deletedCount
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { error: 'Internal server error during cleanup' },
      { status: 500 }
    )
  }
}

// POST method to delete specific files immediately
export async function POST(request: NextRequest) {
  try {
    const { paths } = await request.json()
    
    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json(
        { error: 'Invalid paths array' },
        { status: 400 }
      )
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(paths)

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json(
        { error: 'Failed to delete files' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: `Deleted ${paths.length} files`
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}