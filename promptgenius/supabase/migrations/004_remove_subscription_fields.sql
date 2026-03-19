-- Migration: Remove subscription/Stripe fields
-- Run this after deploying the code changes that remove Stripe

-- Remove Stripe-related columns from users table
ALTER TABLE public.users
  DROP COLUMN IF EXISTS subscription_tier,
  DROP COLUMN IF EXISTS stripe_customer_id,
  DROP COLUMN IF EXISTS stripe_subscription_id;

-- Drop the index on stripe_customer_id if it exists
DROP INDEX IF EXISTS idx_users_stripe_customer_id;

-- Update the handle_new_user function to remove subscription_tier default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
