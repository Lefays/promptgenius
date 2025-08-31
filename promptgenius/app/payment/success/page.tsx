"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tier, setTier] = useState<string>("")

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (sessionId) {
      verifyPayment(sessionId)
    }
  }, [searchParams])

  const verifyPayment = async (sessionId: string) => {
    try {
      // Verify the payment with your backend
      const response = await fetch('/api/stripe/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })

      const data = await response.json()
      
      if (data.success) {
        // Update user's subscription tier
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.auth.updateUser({
            data: { 
              subscription_tier: data.tier,
              stripe_customer_id: data.customerId,
              stripe_subscription_id: data.subscriptionId
            }
          })
          setTier(data.tier)
        }
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          {loading ? (
            <>
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Processing Payment...</h1>
              <p className="text-muted-foreground">Please wait while we confirm your subscription.</p>
            </>
          ) : (
            <>
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-lg text-muted-foreground">
                  Welcome to {tier === 'pro' ? 'Pro' : 'Enterprise'}! 
                </p>
              </div>

              <div className="bg-card rounded-lg border p-6 text-left space-y-4">
                <h2 className="font-semibold">What's next?</h2>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Your account has been upgraded</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>All premium models are now unlocked</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Rate limits have been removed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>You can manage your subscription in Settings</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/generator" className="flex-1">
                  <Button className="w-full">
                    Start Generating
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/settings" className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Settings
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-muted-foreground">
                A confirmation email has been sent to your registered email address.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Processing Payment...</h1>
            <p className="text-muted-foreground">Please wait while we confirm your subscription.</p>
          </div>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}