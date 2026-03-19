-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  model VARCHAR(100) NOT NULL,
  style VARCHAR(50),
  format VARCHAR(50),
  temperature DECIMAL(2,1),
  max_tokens INTEGER,
  has_image BOOLEAN DEFAULT FALSE,
  user_input TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table (for additional user data if needed)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_model ON prompts(model);

-- Enable Row Level Security
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for prompts
-- Policy for authenticated users to read their own prompts
CREATE POLICY "Users can read their own prompts" ON prompts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for authenticated users to insert their own prompts
CREATE POLICY "Users can insert their own prompts" ON prompts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to update their own prompts
CREATE POLICY "Users can update their own prompts" ON prompts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to delete their own prompts
CREATE POLICY "Users can delete their own prompts" ON prompts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for anonymous users to create prompts (without user_id)
CREATE POLICY "Anonymous users can create prompts" ON prompts
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Policy for anonymous users to read prompts without user_id
CREATE POLICY "Anonymous users can read anonymous prompts" ON prompts
  FOR SELECT
  TO anon
  USING (user_id IS NULL);

-- Create RLS policies for users table
CREATE POLICY "Users can read their own profile" ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at
CREATE TRIGGER update_prompts_updated_at BEFORE UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();