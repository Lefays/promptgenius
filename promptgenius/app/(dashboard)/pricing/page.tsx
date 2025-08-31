"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { SUBSCRIPTION_PLANS, type SubscriptionTier } from "@/lib/subscription"
import { loadStripe } from '@stripe/stripe-js'
import { 
  Check, 
  X, 
  Sparkles,
  Crown,
  Building,
  ArrowRight,
  Info
} from "lucide-react"

export default function PricingPage() {
  const [user, setUser] = useState<any>(null)
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        // Get user's subscription tier from metadata or database
        const tier = user.user_metadata?.subscription_tier || 'free'
        setCurrentTier(tier)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (!user) {
      // Redirect to settings page for sign up
      window.location.href = '/settings'
      return
    }

    if (tier === 'free') {
      // Downgrade to free (would need subscription management)
      alert('Please manage your subscription through your account settings or contact support.')
      return
    }

    try {
      setLoading(true)
      
      // Get the price ID based on tier
      const priceId = tier === 'pro' 
        ? process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID 
        : process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID

      if (!priceId) {
        // Fallback for demo if Stripe is not configured
        alert('Stripe is not configured. Please add your Stripe Price IDs to the environment variables.')
        
        // For demo purposes, just update the user metadata
        await supabase.auth.updateUser({
          data: { subscription_tier: tier }
        })
        setCurrentTier(tier)
        return
      }

      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          tier,
          userId: user.id,
          userEmail: user.email
        })
      })

      const { sessionId, url } = await response.json()

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url
      } else if (sessionId && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        // Use Stripe.js for embedded checkout
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId })
          if (error) {
            console.error('Stripe redirect error:', error)
            alert('Failed to redirect to checkout. Please try again.')
          }
        }
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'free':
        return <Sparkles className="h-8 w-8" />
      case 'pro':
        return <Crown className="h-8 w-8" />
      case 'enterprise':
        return <Building className="h-8 w-8" />
    }
  }

  const getTierColor = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'free':
        return 'from-gray-500 to-gray-600'
      case 'pro':
        return 'from-blue-500 to-purple-500'
      case 'enterprise':
        return 'from-purple-500 to-pink-500'
    }
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground">
          Unlock powerful AI models and features with our flexible pricing
        </p>
      </div>

      {!user && (
        <div className="mb-8 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-900 dark:text-amber-100">Account Required</p>
              <p className="text-amber-700 dark:text-amber-300">
                Please sign in or create an account to use any plan, including the free tier.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {(Object.keys(SUBSCRIPTION_PLANS) as SubscriptionTier[]).map((tier) => {
          const plan = SUBSCRIPTION_PLANS[tier]
          const isCurrentPlan = currentTier === tier
          const isPro = tier === 'pro'
          
          return (
            <div
              key={tier}
              className={`rounded-lg border ${
                isPro ? 'border-primary shadow-lg scale-105' : 'border-border'
              } bg-card p-6 relative`}
            >
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${getTierColor(tier)} text-white mb-4`}>
                  {getIcon(tier)}
                </div>
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    ${plan.price === 0 ? '0' : plan.price.toFixed(2)}
                  </span>
                  {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.rateLimit && (
                <div className="mb-6 p-3 rounded-lg bg-secondary/50">
                  <p className="text-sm font-medium mb-1">Rate Limit</p>
                  <p className="text-xs text-muted-foreground">
                    {plan.rateLimit.requests} requests per {plan.rateLimit.windowHours} hours
                  </p>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Available Models</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  {tier === 'free' ? (
                    <>
                      <p>• GPT-4o Mini</p>
                      <p>• Claude 3.5 Sonnet</p>
                      <p>• Mistral Medium</p>
                      <p>• Gemini 1.5 Flash</p>
                    </>
                  ) : (
                    <>
                      <p>• All Free tier models</p>
                      <p className="text-primary font-medium">• GPT-4o & GPT-5</p>
                      <p className="text-primary font-medium">• Claude Opus 4</p>
                      <p className="text-primary font-medium">• Mistral Large</p>
                      <p className="text-primary font-medium">• Grok 3</p>
                    </>
                  )}
                </div>
              </div>

              <Button
                className="w-full"
                variant={isCurrentPlan ? "outline" : isPro ? "default" : "outline"}
                disabled={isCurrentPlan}
                onClick={() => handleUpgrade(tier)}
              >
                {isCurrentPlan ? (
                  'Current Plan'
                ) : tier === 'free' ? (
                  'Get Started'
                ) : (
                  <>
                    Upgrade to {plan.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )
        })}
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>All plans include automatic saving, prompt history, and dark mode.</p>
        <p className="mt-2">Cancel or change your plan anytime.</p>
      </div>
    </div>
  )
}