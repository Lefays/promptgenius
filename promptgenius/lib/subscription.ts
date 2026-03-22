// Everything is free - no subscription tiers needed

export type SubscriptionTier = 'free'

export interface SubscriptionPlan {
  id: SubscriptionTier
  name: string
  price: number
  features: string[]
  rateLimit: null
  models: string[]
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Unlimited prompts',
      'Access to all models',
      'Prompt history',
      'Cloud sync',
      'Testing lab',
      'Advanced options'
    ],
    rateLimit: null,
    models: [
      'gpt-4.1',
      'gpt-4.1-mini',
      'gpt-4.1-nano',
      'gpt-4o',
      'o3-mini',
      'claude-sonnet-4-20250514',
      'claude-3-7-sonnet-latest',
      'claude-3-5-haiku-latest',
      'gemini-2.0-flash',
      'gemini-2.5-pro-preview-06-05',
      'grok-3-mini-fast',
      'llama-4-maverick',
      'mistral-large-latest',
      'deepseek-chat',
      'deepseek-r1'
    ]
  }
}

export function isModelAvailable(_model: string, _tier: SubscriptionTier): boolean {
  return true // All models are free
}

export function isPremiumModel(_model: string): boolean {
  return false // No premium models - everything is free
}

export function checkRateLimit(_userId: string, _tier: SubscriptionTier): { allowed: boolean; remaining: number; resetTime: number } {
  return { allowed: true, remaining: -1, resetTime: 0 } // No rate limits
}

export function incrementRateLimit(_userId: string, _tier: SubscriptionTier): void {
  // No-op - no rate limits
}

export function formatResetTime(_resetTime: number): string {
  return ''
}
