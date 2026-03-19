"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import {
  Check,
  Sparkles,
  ArrowRight,
  Zap,
  Bot,
  History,
  Settings,
  Download,
  Shield
} from "lucide-react"

export default function PricingPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
    }
  }

  const features = [
    { icon: Sparkles, text: "Unlimited prompt generation" },
    { icon: Bot, text: "All AI models (GPT-4o, Claude, Gemini, Grok, Mistral)" },
    { icon: History, text: "Full prompt history & cloud sync" },
    { icon: Zap, text: "Testing lab with real-time AI chat" },
    { icon: Settings, text: "Advanced options (temperature, tokens, style)" },
    { icon: Download, text: "Export & download prompts" },
    { icon: Shield, text: "Secure data with Supabase encryption" },
  ]

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Everything is Free</h1>
        <p className="text-lg text-muted-foreground">
          No plans, no limits, no credit card needed. Powered by Puter.
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="rounded-2xl border-2 border-primary bg-card p-8 relative shadow-lg">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full">
              FREE FOREVER
            </span>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white mb-4">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Full Access</h2>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">forever</span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>

          <Link href={user ? "/generator" : "/settings"}>
            <Button className="w-full" size="lg">
              {user ? "Start Generating" : "Sign Up Free"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>All features are powered by Puter's free AI infrastructure.</p>
        <p className="mt-2">No API keys required. Just sign up and start generating.</p>
      </div>
    </div>
  )
}
