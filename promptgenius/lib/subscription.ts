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
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-5-chat-latest',
      'claude-opus-4-latest',
      'claude-sonnet-4-latest',
      'claude-3-5-sonnet-latest',
      'grok-3',
      'mistral-large-latest',
      'mistral-medium-latest',
      'gemini-1.5-flash'
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
