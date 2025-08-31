"use client"

import { 
  HelpCircle, 
  Sparkles, 
  Settings, 
  History,
  Shield,
  Zap,
  CreditCard,
  Bot,
  Github,
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Users,
  Cpu
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HelpPage() {
  const faqs = [
    {
      question: "How does PromptGenius work?",
      answer: "PromptGenius uses Puter's free AI infrastructure to generate optimized prompts. No API keys are required - just sign up with your email and start generating prompts instantly."
    },
    {
      question: "What AI models are available?",
      answer: "We support GPT-4o, GPT-4o Mini, GPT-5, Claude (Opus, Sonnet, Haiku), Gemini 1.5 Flash, Grok 3, and Mistral models. Free users can access select models, while Pro users get full access."
    },
    {
      question: "What are the subscription tiers?",
      answer: "Free tier: 5 prompts per 3 hours with basic models. Pro ($19.99/month): Unlimited prompts with all models. Enterprise ($99.99/month): Priority support, team features, and custom integrations."
    },
    {
      question: "How do I test my generated prompts?",
      answer: "After generating a prompt, click the 'Test' button to open our Testing Lab. There you can chat with AI models using your prompt as the system message to see how it performs."
    },
    {
      question: "Is my data secure?",
      answer: "Yes! Your prompts and user data are stored securely in Supabase with encryption. We don't share your data with third parties, and you can delete your account and data at any time."
    },
    {
      question: "Why am I getting 'Permission denied' errors?",
      answer: "This usually means you've hit Puter's rate limit. Wait a few minutes and try again, or try using a different model. Pro users have higher limits."
    },
    {
      question: "Can I export my prompt history?",
      answer: "Yes! Go to the History page to view all your generated prompts. You can copy, test, or regenerate any previous prompt from there."
    },
    {
      question: "What's the difference between prompt styles?",
      answer: "Professional: Formal and structured. Creative: Imaginative and engaging. Technical: Precise with implementation details. Casual: Friendly and conversational. Academic: Research-focused with citations."
    }
  ]

  const features = [
    {
      icon: Cpu,
      title: "Puter-Powered AI",
      description: "Free AI generation without API keys"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data encrypted with Supabase"
    },
    {
      icon: History,
      title: "Prompt History",
      description: "Track and reuse all your prompts"
    },
    {
      icon: Bot,
      title: "Testing Lab",
      description: "Test prompts with real AI models"
    },
    {
      icon: Settings,
      title: "Advanced Options",
      description: "Fine-tune temperature and length"
    },
    {
      icon: Users,
      title: "Multiple Models",
      description: "Choose from 10+ AI models"
    }
  ]

  const troubleshooting = [
    {
      issue: "Can't generate prompts",
      solution: "Make sure you're signed in. Check if you've hit the rate limit (5 prompts/3 hours for free users). Try a different model or upgrade to Pro.",
      icon: XCircle
    },
    {
      issue: "Puter authentication popup keeps appearing",
      solution: "This is normal for first-time use. Puter uses temporary accounts. The popup should only appear once per session.",
      icon: AlertCircle
    },
    {
      issue: "Generated prompt is cut off",
      solution: "Increase the Max Tokens in Advanced Options. Some models have token limits - try GPT-4o or Claude for longer outputs.",
      icon: AlertCircle
    },
    {
      issue: "Can't access Pro models",
      solution: "Pro models require a subscription. Visit the Pricing page to upgrade your account.",
      icon: CreditCard
    }
  ]

  const modelGuide = [
    {
      model: "GPT-4o Mini",
      bestFor: "Quick, efficient prompts for everyday tasks",
      tier: "Free"
    },
    {
      model: "GPT-4o",
      bestFor: "Complex reasoning and detailed instructions",
      tier: "Pro"
    },
    {
      model: "Claude 3.5 Sonnet",
      bestFor: "Creative writing and nuanced responses",
      tier: "Free"
    },
    {
      model: "Claude Opus 4",
      bestFor: "Advanced analysis and long-form content",
      tier: "Pro"
    },
    {
      model: "Gemini 1.5 Flash",
      bestFor: "Fast responses with good accuracy",
      tier: "Free"
    },
    {
      model: "Mistral Medium",
      bestFor: "Technical and coding tasks",
      tier: "Free"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Help Center</h1>
            <p className="text-muted-foreground">Everything you need to know about using PromptGenius effectively</p>
          </div>

          {/* Getting Started */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Start Guide
            </h2>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">1</span>
                <div>
                  <p className="font-medium">Sign up or log in</p>
                  <p className="text-sm text-muted-foreground">Go to Settings and create an account with your email. It's free and takes seconds.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">2</span>
                <div>
                  <p className="font-medium">Describe your AI task</p>
                  <p className="text-sm text-muted-foreground">In the Generator, explain what you want your AI agent to do. Be specific about the goal.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">3</span>
                <div>
                  <p className="font-medium">Choose your AI model</p>
                  <p className="text-sm text-muted-foreground">Select which AI model you'll use the prompt with (GPT-4, Claude, etc.)</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">4</span>
                <div>
                  <p className="font-medium">Generate your prompt</p>
                  <p className="text-sm text-muted-foreground">Click Generate and get an optimized prompt tailored for your chosen model.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">5</span>
                <div>
                  <p className="font-medium">Test and refine</p>
                  <p className="text-sm text-muted-foreground">Use the Testing Lab to chat with AI using your prompt and see the results in real-time.</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Features Grid */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Key Features</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <feature.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Selection Guide */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Model Selection Guide
            </h2>
            <div className="space-y-3">
              {modelGuide.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div className="flex-1">
                    <p className="font-medium">{item.model}</p>
                    <p className="text-sm text-muted-foreground">{item.bestFor}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    item.tier === 'Free' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {item.tier}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Troubleshooting
            </h2>
            <div className="space-y-4">
              {troubleshooting.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <item.icon className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium mb-1">{item.issue}</p>
                    <p className="text-sm text-muted-foreground">{item.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
                  <h3 className="font-medium mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Tiers */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Subscription Plans
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Free</h3>
                <p className="text-2xl font-bold mb-3">$0<span className="text-sm font-normal">/month</span></p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    5 prompts per 3 hours
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Basic AI models
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Prompt history
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border border-primary">
                <h3 className="font-semibold mb-2">Pro</h3>
                <p className="text-2xl font-bold mb-3">$19.99<span className="text-sm font-normal">/month</span></p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Unlimited prompts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    All AI models
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Priority generation
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Enterprise</h3>
                <p className="text-2xl font-bold mb-3">$99.99<span className="text-sm font-normal">/month</span></p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Team collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Custom integrations
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link href="/pricing">
                <Button>View Pricing Details</Button>
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Need More Help?</h2>
            <p className="text-sm text-muted-foreground mb-4">
              We're here to help! Choose the best way to get support:
            </p>
            <div className="space-y-3">
              <a 
                href="https://github.com/Lefays/prompt-generative/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-secondary/50 transition-colors"
              >
                <Github className="h-5 w-5" />
                <div className="flex-1">
                  <p className="font-medium">Report Issues on GitHub</p>
                  <p className="text-sm text-muted-foreground">Found a bug? Let us know on our GitHub repository</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
              
              <a 
                href="https://github.com/Lefays/prompt-generative"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-secondary/50 transition-colors"
              >
                <Github className="h-5 w-5" />
                <div className="flex-1">
                  <p className="font-medium">Star us on GitHub</p>
                  <p className="text-sm text-muted-foreground">Support the project by giving us a star</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>

              <div className="flex items-center gap-3 p-3 rounded-lg border bg-secondary/30">
                <Sparkles className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">Pro Support</p>
                  <p className="text-sm text-muted-foreground">Pro and Enterprise users get priority email support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pb-8">
            <p>PromptGenius v1.0.0 • Built with Next.js, Supabase, and Puter</p>
            <p className="mt-1">Created with ❤️ by the PromptGenius team</p>
          </div>
        </div>
      </div>
    </div>
  )
}