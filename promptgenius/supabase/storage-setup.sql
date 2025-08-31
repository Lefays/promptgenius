-- Create storage bucket for prompt files if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'prompt-files', 
  'prompt-files', 
  true,  -- Make it public so AI models can access the files
  false, 
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 52428800;

-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public viewing" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon uploads" ON storage.objects;

-- Create new RLS policies for the bucket
-- Allow anyone to upload (we control access in the API)
CREATE POLICY "Allow all uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'prompt-files');

-- Allow anyone to view files (needed for AI models to access)
CREATE POLICY "Allow public viewing"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'prompt-files');

-- Allow users to delete their own files
CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'prompt-files' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- Allow service role to do everything (for API operations)
CREATE POLICY "Service role full access"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'prompt-files');