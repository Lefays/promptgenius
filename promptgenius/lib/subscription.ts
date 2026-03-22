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
      'gpt-5.4',
      'gpt-5.3-chat',
      'gpt-5-nano',
      'gpt-5-mini',
      'o3-pro',
      'claude-opus-4-6',
      'claude-sonnet-4-6',
      'claude-opus-4-5',
      'claude-haiku-4-5',
      'gemini-3.1-pro-preview',
      'gemini-3.1-flash-lite-preview',
      'gemini-2.5-pro-preview',
      'grok-4.1-fast',
      'grok-4-fast',
      'deepseek-v3.2',
      'deepseek-r1-0528',
      'mistral-medium-2508',
      'mistral-small-2603',
      'qwen3.5-72b'
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
