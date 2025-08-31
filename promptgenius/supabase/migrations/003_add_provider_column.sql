-- Add provider column to prompts table
ALTER TABLE prompts 
ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'puter';

-- Update existing rows to have a provider value
UPDATE prompts 
SET provider = 'puter' 
WHERE provider IS NULL;