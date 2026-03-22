"use client"

import {
  HelpCircle,
  Sparkles,
  History,
  Shield,
  Zap,
  Bot,
  Github,
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Users,
  Cpu,
  Settings
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HelpPage() {
  const faqs = [
    {
      question: "How does PromptGenius work?",
      answer: "PromptGenius uses Puter's free AI infrastructure to generate optimized prompts. No API keys or accounts are required - just open the app and start generating prompts instantly."
    },
    {
      question: "What AI models are available?",
      answer: "We support GPT-5.4, GPT-5.3, GPT-5 Nano/Mini, o3 Pro, Claude Opus 4.6, Claude Sonnet 4.6, Claude Opus 4.5, Claude Haiku 4.5, Gemini 3.1 Pro, Gemini 3.1 Flash Lite, Gemini 2.5 Pro, Grok 4.1, Grok 4, DeepSeek v3.2, DeepSeek R1, Mistral Medium 3.1, Mistral Small 4, and Qwen 3.5. All models are available for free."
    },
    {
      question: "Is PromptGenius really free?",
      answer: "Yes! PromptGenius is completely free with no account required. You get unlimited prompts, access to all AI models, prompt history, and the testing lab - all at no cost."
    },
    {
      question: "Do I need to create an account?",
      answer: "No. PromptGenius works without any account or sign-up. Just open the app and start generating prompts right away."
    },
    {
      question: "How do I test my generated prompts?",
      answer: "After generating a prompt, click the 'Test' button to open our Testing Lab. There you can chat with AI models using your prompt as the system message to see how it performs."
    },
    {
      question: "Is my data secure?",
      answer: "Yes! Your prompts are stored locally in the browser. Nothing is sent to external servers beyond the AI model calls needed to generate your prompts. You have full control over your data."
    },
    {
      question: "Why am I getting 'Permission denied' errors?",
      answer: "This usually means you've hit Puter's rate limit. Wait a few minutes and try again, or try using a different model."
    },
    {
      question: "Can I export my prompt history?",
      answer: "Yes! Go to the History page to view all your generated prompts. You can copy, test, or regenerate any previous prompt from there."
    },
    {
      question: "What's the difference between prompt styles?",
      answer: "Professional: Formal and structured. Creative: Imaginative and engaging. Technical: Precise with implementation details. Casual: Friendly and conversational. Academic: Research-focused with citations."
    },
    {
      question: "What is the Anti-Prompt feature?",
      answer: "The Anti-Prompt field in Advanced Options lets you specify things the generated prompt should NOT include or do. For example, you can tell it to avoid jargon, skip bullet points, or not mention competitors."
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
      description: "Your data stays in your browser"
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
      description: "Fine-tune temperature, length, and anti-prompts"
    },
    {
      icon: Users,
      title: "Multiple Models",
      description: "Choose from 15+ AI models"
    }
  ]

  const troubleshooting = [
    {
      issue: "Can't generate prompts",
      solution: "Try refreshing the page or using a different model. If the issue persists, wait a few minutes and try again.",
      icon: XCircle
    },
    {
      issue: "Puter authentication popup keeps appearing",
      solution: "This is normal for first-time use. Puter uses temporary accounts. The popup should only appear once per session.",
      icon: AlertCircle
    },
    {
      issue: "Generated prompt is cut off",
      solution: "Increase the Max Tokens in Advanced Options. Some models have token limits - try GPT-5.4 or Claude Opus 4.6 for longer outputs.",
      icon: AlertCircle
    },
    {
      issue: "Model not responding",
      solution: "Some models may have temporary usage limits from Puter. Try a different model or wait a few minutes.",
      icon: AlertCircle
    }
  ]

  const modelGuide = [
    {
      model: "GPT-5 Nano",
      bestFor: "Fast default model for everyday tasks",
      tier: "Free"
    },
    {
      model: "GPT-5.4",
      bestFor: "Most capable OpenAI model for complex tasks",
      tier: "Free"
    },
    {
      model: "Claude Opus 4.6",
      bestFor: "Deep analysis and advanced reasoning",
      tier: "Free"
    },
    {
      model: "Claude Sonnet 4.6",
      bestFor: "Fast and intelligent responses",
      tier: "Free"
    },
    {
      model: "Gemini 3.1 Pro",
      bestFor: "Large context and multimodal tasks",
      tier: "Free"
    },
    {
      model: "Gemini 3.1 Flash Lite",
      bestFor: "Fastest Google model for quick responses",
      tier: "Free"
    },
    {
      model: "DeepSeek v3.2",
      bestFor: "Strong coding and technical tasks",
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
                  <p className="font-medium">Go to the Generator</p>
                  <p className="text-sm text-muted-foreground">Open the Generator page from the sidebar. No account needed - just jump right in.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">2</span>
                <div>
                  <p className="font-medium">Describe what you want your AI to do</p>
                  <p className="text-sm text-muted-foreground">Explain the task in the text box. Be specific about the goal and any requirements.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">3</span>
                <div>
                  <p className="font-medium">Pick a model</p>
                  <p className="text-sm text-muted-foreground">Select which AI model you want to generate your prompt with (GPT-5, Claude Opus, Gemini 3.1, etc.)</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">4</span>
                <div>
                  <p className="font-medium">Click Generate</p>
                  <p className="text-sm text-muted-foreground">Hit the Generate button and get an optimized prompt tailored for your chosen model.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">5</span>
                <div>
                  <p className="font-medium">Test it in the Testing Lab</p>
                  <p className="text-sm text-muted-foreground">Click the Test button to open the Testing Lab, where you can chat with AI using your prompt and see the results in real-time.</p>
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

          {/* Free for Everyone */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Everything is Free
            </h2>
            <div className="p-4 rounded-lg border border-primary">
              <h3 className="font-semibold mb-2">No Account Needed</h3>
              <p className="text-2xl font-bold mb-3">$0<span className="text-sm font-normal"> forever</span></p>
              <p className="text-sm text-muted-foreground mb-3">Just open PromptGenius and start generating. No sign-up, no credit card, no strings attached.</p>
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
                  Prompt history stored locally
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Testing lab
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Advanced options with anti-prompt
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  No account required
                </li>
              </ul>
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
                  <p className="font-medium">Community Support</p>
                  <p className="text-sm text-muted-foreground">Get help from the community on GitHub</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pb-8">
            <p>PromptGenius v1.0.0 - Built with Next.js and Puter</p>
            <p className="mt-1">Created by the PromptGenius team</p>
          </div>
        </div>
      </div>
    </div>
  )
}
