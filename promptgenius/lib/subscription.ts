// Subscription tiers and model access configuration

export type SubscriptionTier = 'free' | 'pro' | 'enterprise'

export interface SubscriptionPlan {
  id: SubscriptionTier
  name: string
  price: number
  features: string[]
  rateLimit: {
    requests: number
    windowHours: number
  } | null
  models: string[]
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      '5 prompts every 3 hours',
      'Access to basic models',
      'Prompt history',
      'Local storage'
    ],
    rateLimit: {
      requests: 5,
      windowHours: 3
    },
    models: [
      'gpt-4o-mini',
      'claude-3-5-sonnet-latest',
      'mistral-medium-latest',
      'gemini-1.5-flash'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    features: [
      'Unlimited prompts',
      'Access to all models',
      'Priority support',
      'Cloud sync',
      'Advanced analytics',
      'API access'
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
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99.99,
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom models',
      'SLA support',
      'SSO integration',
      'Audit logs',
      'Custom integrations'
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

// Premium models that require subscription
export const PREMIUM_MODELS = [
  'gpt-4o',
  'gpt-5-chat-latest',
  'claude-opus-4-latest',
  'claude-sonnet-4-latest',
  'grok-3',
  'mistral-large-latest'
]

export function isModelAvailable(model: string, tier: SubscriptionTier): boolean {
  const plan = SUBSCRIPTION_PLANS[tier]
  return plan.models.includes(model)
}

export function isPremiumModel(model: string): boolean {
  return PREMIUM_MODELS.includes(model)
}

// Rate limiting functions
interface RateLimitData {
  count: number
  windowStart: number
}

export function getRateLimitKey(userId: string): string {
  return `rate_limit_${userId}`
}

export function checkRateLimit(userId: string, tier: SubscriptionTier): { allowed: boolean; remaining: number; resetTime: number } {
  const plan = SUBSCRIPTION_PLANS[tier]
  
  // No rate limit for pro/enterprise
  if (!plan.rateLimit) {
    return { allowed: true, remaining: -1, resetTime: 0 }
  }

  const key = getRateLimitKey(userId)
  const stored = localStorage.getItem(key)
  const now = Date.now()
  const windowMs = plan.rateLimit.windowHours * 60 * 60 * 1000

  let data: RateLimitData = stored ? JSON.parse(stored) : { count: 0, windowStart: now }

  // Reset window if expired
  if (now - data.windowStart > windowMs) {
    data = { count: 0, windowStart: now }
  }

  const remaining = plan.rateLimit.requests - data.count
  const resetTime = data.windowStart + windowMs

  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    resetTime
  }
}

export function incrementRateLimit(userId: string, tier: SubscriptionTier): void {
  const plan = SUBSCRIPTION_PLANS[tier]
  if (!plan.rateLimit) return

  const key = getRateLimitKey(userId)
  const stored = localStorage.getItem(key)
  const now = Date.now()
  const windowMs = plan.rateLimit.windowHours * 60 * 60 * 1000

  let data: RateLimitData = stored ? JSON.parse(stored) : { count: 0, windowStart: now }

  // Reset window if expired
  if (now - data.windowStart > windowMs) {
    data = { count: 1, windowStart: now }
  } else {
    data.count++
  }

  localStorage.setItem(key, JSON.stringify(data))
}

export function formatResetTime(resetTime: number): string {
  const now = Date.now()
  const diff = resetTime - now
  
  if (diff <= 0) return 'now'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}