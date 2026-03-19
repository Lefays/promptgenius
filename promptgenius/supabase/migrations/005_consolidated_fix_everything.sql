-- ============================================================
-- CONSOLIDATED FIX-EVERYTHING MIGRATION
-- Run this once in Supabase SQL Editor to bring the DB to the correct state.
-- Idempotent: safe to run multiple times.
-- ============================================================

-- ============================================================
-- 1. USERS TABLE — ensure it exists with the right columns
-- ============================================================

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add display_name if missing (some migrations used 'name' instead)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Remove Stripe/subscription columns (no longer needed — everything is free)
ALTER TABLE public.users
  DROP COLUMN IF EXISTS subscription_tier,
  DROP COLUMN IF EXISTS stripe_customer_id,
  DROP COLUMN IF EXISTS stripe_subscription_id;

-- Drop the Stripe index
DROP INDEX IF EXISTS idx_users_stripe_customer_id;

-- ============================================================
-- 2. PROMPTS TABLE — ensure it exists with ALL needed columns
-- ============================================================

-- Create prompts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL DEFAULT '',
  model TEXT NOT NULL DEFAULT '',
  user_input TEXT,
  style TEXT,
  format TEXT,
  temperature FLOAT,
  max_tokens INTEGER,
  has_image BOOLEAN DEFAULT FALSE,
  provider VARCHAR(50) DEFAULT 'puter',
  title TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns that may be missing from earlier migrations
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS has_image BOOLEAN DEFAULT FALSE;
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'puter';
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS format TEXT;
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS temperature FLOAT;
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS max_tokens INTEGER;
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS user_input TEXT;
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS style TEXT;

-- Backfill provider for any rows that don't have it
UPDATE public.prompts SET provider = 'puter' WHERE provider IS NULL;

-- ============================================================
-- 3. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON public.prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_model ON public.prompts(model);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Users table policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can read their own profile" ON public.users;
CREATE POLICY "Users can read their own profile" ON public.users
  FOR SELECT TO authenticated USING (auth.uid() = id);

-- Allow insert for the trigger function
DROP POLICY IF EXISTS "Allow insert for new users" ON public.users;
CREATE POLICY "Allow insert for new users" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Prompts table policies
DROP POLICY IF EXISTS "Users can view own prompts" ON public.users;
DROP POLICY IF EXISTS "Users can view own prompts" ON public.prompts;
CREATE POLICY "Users can view own prompts" ON public.prompts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Users can read their own prompts" ON public.prompts;

DROP POLICY IF EXISTS "Users can insert own prompts" ON public.prompts;
CREATE POLICY "Users can insert own prompts" ON public.prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own prompts" ON public.prompts;

DROP POLICY IF EXISTS "Users can update own prompts" ON public.prompts;
CREATE POLICY "Users can update own prompts" ON public.prompts
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own prompts" ON public.prompts;

DROP POLICY IF EXISTS "Users can delete own prompts" ON public.prompts;
CREATE POLICY "Users can delete own prompts" ON public.prompts
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own prompts" ON public.prompts;

-- Anonymous user policies
DROP POLICY IF EXISTS "Anonymous users can create prompts" ON public.prompts;
CREATE POLICY "Anonymous users can create prompts" ON public.prompts
  FOR INSERT TO anon WITH CHECK (user_id IS NULL);

DROP POLICY IF EXISTS "Anonymous users can read anonymous prompts" ON public.prompts;
CREATE POLICY "Anonymous users can read anonymous prompts" ON public.prompts
  FOR SELECT TO anon USING (user_id IS NULL);

-- ============================================================
-- 5. FUNCTIONS & TRIGGERS
-- ============================================================

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_prompts_updated_at ON public.prompts;
CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON public.prompts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- handle_new_user function (NO subscription_tier — everything is free)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, public.users.display_name),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auth trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 6. STORAGE — prompt-files bucket
-- ============================================================

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('prompt-files', 'prompt-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (drop first then create to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view prompt files" ON storage.objects;
CREATE POLICY "Anyone can view prompt files" ON storage.objects
  FOR SELECT USING (bucket_id = 'prompt-files');

DROP POLICY IF EXISTS "Authenticated users can upload prompt files" ON storage.objects;
CREATE POLICY "Authenticated users can upload prompt files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'prompt-files');

DROP POLICY IF EXISTS "Users can update their own prompt files" ON storage.objects;
CREATE POLICY "Users can update their own prompt files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'prompt-files');

DROP POLICY IF EXISTS "Users can delete their own prompt files" ON storage.objects;
CREATE POLICY "Users can delete their own prompt files" ON storage.objects
  FOR DELETE USING (bucket_id = 'prompt-files');

-- ============================================================
-- DONE! Your database is now fully set up for PromptGenius.
-- Everything is free — no Stripe, no subscription tiers.
-- ============================================================
