"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"
import { 
  Sparkles, 
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Star,
  Check,
  Users,
  FileText,
  Globe,
  Layers,
  Code,
  Palette,
  ChevronRight,
  Play,
  Award,
  TrendingUp
} from "lucide-react"

export default function LandingPage() {
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const howItWorksRef = useRef(null)
  const pricingRef = useRef(null)
  const faqRef = useRef(null)
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" })
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" })
  const isHowItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" })
  const isPricingInView = useInView(pricingRef, { once: true, margin: "-100px" })
  const isFaqInView = useInView(faqRef, { once: true, margin: "-100px" })

  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scheduleForm, setScheduleForm] = useState({ name: '', email: '', company: '', message: '' })
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handlePricing = async (planName: string) => {
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to select a plan.",
        })
        router.push('/settings')
        return
      }

      if (planName === 'Free') {
        router.push('/generator')
        return
      }

      if (planName === 'Enterprise') {
        setIsScheduleOpen(true)
        return
      }

      // Handle Pro plan - redirect to Stripe checkout
      setLoadingPlan(planName)
      
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: planName === 'Pro' ? 'price_1234567890abcdef' : '',
          userId: user.id 
        })
      })

      const { url, error } = await response.json()
      
      if (error) throw new Error(error)
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to process plan selection.",
        variant: "destructive"
      })
    } finally {
      setLoadingPlan(null)
    }
  }

  const features = [
    {
      title: "Lightning Fast",
      description: "Generate perfect prompts in seconds with our advanced AI algorithms",
      icon: Zap
    },
    {
      title: "Privacy First",
      description: "Your data stays secure with enterprise-grade encryption",
      icon: Shield
    },
    {
      title: "Always Available",
      description: "Access your prompts anytime, anywhere with cloud sync",
      icon: Clock
    }
  ]

  const extendedFeatures = [
    {
      icon: Code,
      title: "Developer Friendly",
      description: "RESTful API with comprehensive documentation"
    },
    {
      icon: Palette,
      title: "Custom Styles",
      description: "Tailor prompts to match your brand voice"
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "Support for 50+ languages worldwide"
    },
    {
      icon: Layers,
      title: "Version Control",
      description: "Track changes and revert to previous versions"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share and collaborate on prompts with your team"
    },
    {
      icon: FileText,
      title: "Export Options",
      description: "Export to JSON, CSV, or direct API integration"
    }
  ]

  const stats = [
    { value: "10K+", label: "Active Users", icon: Users },
    { value: "500K+", label: "Prompts Created", icon: FileText },
    { value: "99.9%", label: "Uptime", icon: TrendingUp },
    { value: "4.9★", label: "User Rating", icon: Award }
  ]

  const howItWorks = [
    {
      step: "01",
      title: "Describe Your Need",
      description: "Tell us what you want your AI to accomplish"
    },
    {
      step: "02",
      title: "Choose Your Model",
      description: "Select from GPT-4, Claude, Gemini, or others"
    },
    {
      step: "03",
      title: "Generate & Refine",
      description: "Get your optimized prompt instantly"
    },
    {
      step: "04",
      title: "Use Anywhere",
      description: "Copy and use in your favorite AI tool"
    }
  ]

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "100 prompts per month",
        "Basic AI models",
        "Community support",
        "Export to text"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      description: "Best for professionals",
      features: [
        "Unlimited prompts",
        "All AI models",
        "Priority support",
        "API access",
        "Team collaboration",
        "Advanced analytics"
      ],
      cta: "Start Pro Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Custom AI training",
        "Dedicated support",
        "SLA guarantee",
        "On-premise option"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ]

  const faqs = [
    {
      question: "How does PromptGenius work?",
      answer: "PromptGenius uses advanced AI algorithms to analyze your requirements and generate optimized prompts tailored for specific AI models. Simply describe what you need, and we'll create the perfect prompt."
    },
    {
      question: "Which AI models are supported?",
      answer: "We support all major AI models including GPT-4, GPT-3.5, Claude 3, Gemini Pro, Llama 3, Mistral, and many more. Our prompts are optimized for each model's specific capabilities."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade encryption for all data transmission and storage. Your prompts and personal information are never shared with third parties."
    },
    {
      question: "Can I use PromptGenius for commercial projects?",
      answer: "Yes! All plans, including the free tier, allow commercial use. The prompts you generate are yours to use however you like."
    },
    {
      question: "Do you offer team plans?",
      answer: "Yes, our Pro and Enterprise plans include team collaboration features. You can share prompts, collaborate in real-time, and manage team permissions."
    }
  ]

  return (
    <>
      {/* Hero Section - Full viewport height */}
      <section className="min-h-screen flex items-center justify-center relative bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-8">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Prompt Generation</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
              Create Perfect
              <br />
              <span className="text-gray-400">AI Prompts</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Transform your ideas into optimized prompts for ChatGPT, Claude, and other AI models in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/generator">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 h-12">
                  Start Generating <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-gray-300 px-8 h-12 group"
                onClick={() => setIsDemoOpen(true)}
              >
                <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            <div className="mt-16 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Simple scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-gray-400 rounded-full mt-1" />
          </div>
        </motion.div>
      </section>

      {/* Enhanced Stats Section */}
      <section ref={statsRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4 group-hover:bg-gray-200 transition-colors">
                  <stat.icon className="h-8 w-8 text-gray-700" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Minimal cards */}
      <section ref={featuresRef} id="features" className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose PromptGenius</h2>
            <p className="text-xl text-gray-600">Everything you need to create better AI interactions</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Extended Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {extendedFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.05 }}
                className="flex gap-4 p-4"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} id="how-it-works" className="py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Four simple steps to perfect prompts</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center relative"
              >
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full" />
                  </div>
                )}
                <div className="relative z-10 bg-white rounded-2xl p-6">
                  <div className="text-4xl font-bold text-gray-200 mb-4">{step.step}</div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Clean cards */}
      <section ref={pricingRef} id="pricing" className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that works for you</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`bg-white rounded-2xl p-8 ${plan.popular ? 'ring-2 ring-black shadow-xl' : 'border border-gray-200'} relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-2">
                    {plan.price}
                    {plan.price !== "Custom" && <span className="text-lg text-gray-500">/mo</span>}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-black hover:bg-gray-800 text-white' : 'bg-white hover:bg-gray-50 text-black border border-gray-300'}`}
                  onClick={() => handlePricing(plan.name)}
                  disabled={loadingPlan === plan.name}
                >
                  {loadingPlan === plan.name ? 'Loading...' : plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-32 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isFaqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isFaqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section - Single centered quote */}
      <section className="py-32 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <blockquote className="text-2xl font-medium mb-8">
            &quot;PromptGenius has completely transformed how we interact with AI. 
            The quality of outputs has improved dramatically, and we&apos;ve saved countless hours.&quot;
          </blockquote>
          <div>
            <div className="font-semibold">Sarah Chen</div>
            <div className="text-gray-600">Head of AI, TechCorp</div>
          </div>
        </div>
      </section>

      {/* CTA Section - Simple and focused */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Create Better Prompts?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join thousands of users creating perfect AI prompts every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generator">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 h-12">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-gray-300 px-8 h-12"
              onClick={() => setIsScheduleOpen(true)}
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Video Demo Modal */}
      <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
        <DialogContent className="sm:max-w-[900px] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold">See PromptGenius in Action</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="PromptGenius Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Watch this 3-minute demo to see how PromptGenius can transform your AI workflow.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Demo Modal */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Schedule a Demo</DialogTitle>
          </DialogHeader>
          <form className="space-y-4 mt-4" onSubmit={(e) => {
            e.preventDefault()
            // Handle demo scheduling
            alert('Demo request submitted! We\'ll contact you soon.')
            setIsScheduleOpen(false)
            setScheduleForm({ name: '', email: '', company: '', message: '' })
          }}>
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={scheduleForm.name}
                onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={scheduleForm.email}
                onChange={(e) => setScheduleForm({ ...scheduleForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company (Optional)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={scheduleForm.company}
                onChange={(e) => setScheduleForm({ ...scheduleForm, company: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message (Optional)</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                value={scheduleForm.message}
                onChange={(e) => setScheduleForm({ ...scheduleForm, message: e.target.value })}
                placeholder="Tell us about your use case..."
              />
            </div>
            <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
              Request Demo
            </Button>
          </form>
        </DialogContent>
      </Dialog>

    </>
  )
}