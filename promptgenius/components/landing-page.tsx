"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion, useInView } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Sparkles, ArrowRight, Zap, Shield, Clock, Star, Check, Users, FileText, Globe, Layers, Code, Palette, ChevronRight, Play, Award, TrendingUp
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
  
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" })
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" })
  const isHowItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" })
  const isPricingInView = useInView(pricingRef, { once: true, margin: "-100px" })
  const isFaqInView = useInView(faqRef, { once: true, margin: "-100px" })

  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scheduleForm, setScheduleForm] = useState({ name: '', email: '', company: '', message: '' })
  
  const handleGetStarted = () => {
    router.push('/generator')
  }

  const features = [
    { title: "Lightning Fast", description: "Generate perfect prompts in seconds with advanced AI algorithms.", icon: Zap, colSpan: "md:col-span-2", bg: "bg-gray-100" },
    { title: "Privacy First", description: "Your data stays secure with enterprise-grade encryption.", icon: Shield, colSpan: "md:col-span-1", bg: "bg-black text-white" },
    { title: "Always Available", description: "Access your prompts anytime, anywhere with cloud sync.", icon: Clock, colSpan: "md:col-span-1", bg: "bg-white border-2 border-gray-200" },
    { title: "Developer Friendly", description: "RESTful API with comprehensive robust documentation.", icon: Code, colSpan: "md:col-span-2", bg: "bg-purple-100" }
  ]

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "500K+", label: "Prompts Created" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9★", label: "User Rating" }
  ]

  const howItWorks = [
    { step: "01", title: "Describe", description: "Tell us what you want your AI to accomplish in plain English." },
    { step: "02", title: "Select", description: "Choose from GPT-4, Claude, Gemini, or other leading models." },
    { step: "03", title: "Generate", description: "Get your optimized, highly-effective prompt instantly." },
    { step: "04", title: "Deploy", description: "Copy and use in your favorite AI tool or via our API." }
  ]

  const faqs = [
    { question: "How does PromptGenius work?", answer: "PromptGenius uses advanced AI algorithms to analyze your requirements and generate optimized prompts tailored for specific AI models." },
    { question: "Which AI models are supported?", answer: "We support major AI models including GPT-4, Claude 3, Gemini Pro, and Llama 3." },
    { question: "Is my data secure?", answer: "Yes. We use enterprise-grade encryption for all data transmission and storage." },
    { question: "Can I use PromptGenius for commercial projects?", answer: "Yes! All plans, including the free tier, allow commercial use." },
    { question: "Do you offer team plans?", answer: "Yes, our Pro and Enterprise plans include team collaboration features." }
  ]

  return (
    <div className="bg-white text-black font-sans selection:bg-purple-200 selection:text-black">
      {/* Editorial, Asymmetrical Hero Section */}
      <section className="min-h-screen pt-32 pb-20 flex flex-col justify-center border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-12 gap-12 items-center"
          >
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-4 py-1.5 mb-8">
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div>
                <span className="text-sm font-semibold tracking-wide uppercase">AI-Powered Engineering</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] mb-8 uppercase">
                Write <br/>
                <span className="text-gray-400">Better</span><br/>
                Prompts.
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-xl leading-relaxed font-medium">
                Transform your raw ideas into masterfully structured prompts for Claude, ChatGPT, and Gemini. 
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/generator">
                  <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 h-14 text-base font-semibold rounded-none border border-black">
                    Start Generating <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-black px-8 h-14 text-base font-semibold rounded-none hover:bg-gray-50 group"
                  onClick={() => setIsDemoOpen(true)}
                >
                  <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Visual element replacing the generic 2-column image */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative w-full aspect-[4/5] bg-gray-50 border border-gray-200 p-8 flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-bl-full -z-10 mix-blend-multiply opacity-50"></div>
                
                <div className="space-y-4">
                  <div className="h-4 w-1/3 bg-gray-200 rounded-sm"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded-sm"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded-sm"></div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white border border-gray-200 shadow-sm">
                    <p className="font-mono text-sm text-gray-600">{"{"}</p>
                    <p className="font-mono text-sm pl-4"><span className="text-purple-600">"role"</span>: "system",</p>
                    <p className="font-mono text-sm pl-4"><span className="text-purple-600">"content"</span>: "You are an expert..."</p>
                    <p className="font-mono text-sm text-gray-600">{"}"}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brutalist Stats Bar */}
      <section ref={statsRef} className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200 border-x border-gray-200">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="py-12 px-6 text-center"
              >
                <div className="text-4xl md:text-5xl font-black mb-2 tracking-tight">{stat.value}</div>
                <div className="text-gray-600 font-medium uppercase tracking-wider text-xs">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section ref={featuresRef} id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">Built for <br/><span className="text-purple-600">Excellence</span></h2>
            <p className="text-xl text-gray-600 max-w-2xl font-medium">We deliver enterprise-grade performance packaged in an interface that gets out of your way.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`${feature.bg} ${feature.colSpan} p-10 flex flex-col justify-between min-h-[300px]`}
                >
                  <div className="w-14 h-14 bg-white/20 backdrop-blur border border-white/10 flex items-center justify-center mb-8 rounded-none">
                    <Icon className={`h-6 w-6 ${feature.bg.includes('text-white') ? 'text-white' : 'text-black'}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 tracking-tight">{feature.title}</h3>
                    <p className={`font-medium ${feature.bg.includes('text-white') ? 'text-gray-300' : 'text-gray-600'}`}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Structured Process Section */}
      <section ref={howItWorksRef} id="how-it-works" className="py-32 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-20 text-center">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-x-8 gap-y-16">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative"
              >
                <div className="text-7xl md:text-8xl font-black text-gray-200 mb-6 tracking-tighter">{step.step}</div>
                <h3 className="text-xl font-bold mb-3 uppercase tracking-wide">{step.title}</h3>
                <p className="text-gray-600 font-medium">{step.description}</p>
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-[2.5rem] left-[60%] w-[80%] h-px bg-gray-300"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Distinct Pricing Section */}
      <section ref={pricingRef} id="pricing" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">Zero <span className="text-gray-400">Cost.</span></h2>
            <p className="text-xl text-gray-600 font-medium">No credit cards, no limits.</p>
          </div>

          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isPricingInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="bg-white border-4 border-black p-10 relative"
            >
              <div className="absolute top-0 right-0 bg-purple-600 text-white font-bold uppercase text-xs px-4 py-2 translate-x-2 -translate-y-2 border-2 border-black">
                Unlimited
              </div>
              <h3 className="text-3xl font-black uppercase mb-4 tracking-tight">Forever Free</h3>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-6xl font-black tracking-tighter">$0</span>
                <span className="text-xl font-bold text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-10 border-t border-gray-200 pt-8">
                {["Unlimited prompt generation", "Access to all AI models", "Cloud sync & history", "API Access available", "Commercial use permitted"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-black flex-shrink-0" strokeWidth={3} />
                    <span className="font-medium text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full bg-black text-white hover:bg-gray-800 h-14 rounded-none text-base font-bold uppercase tracking-wide"
                onClick={handleGetStarted}
              >
                Start Using Now
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Clean FAQ */}
      <section ref={faqRef} className="py-32 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-5xl font-black tracking-tighter uppercase mb-16 text-center">FAQ</h2>

          <div className="grid gap-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={isFaqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-6 bg-white border border-gray-200 flex items-center justify-between hover:border-black transition-colors"
                >
                  <span className="font-bold text-lg pr-8">{faq.question}</span>
                  <ChevronRight className={`h-6 w-6 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="p-6 bg-white border-x border-b border-gray-200 -mt-px">
                    <p className="text-gray-600 font-medium leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bold CTA */}
      <section className="py-32 bg-black text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-10 leading-[0.9]">
            Stop Guessing.<br/>
            <span className="text-purple-400">Start Writing.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            <Link href="/generator">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-10 h-16 text-lg font-bold uppercase tracking-wider rounded-none">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modals remain structurally similar, styled minimally */}
      <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
        <DialogContent className="sm:max-w-[900px] p-0 rounded-none border-2 border-black">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-3xl font-black uppercase tracking-tight">Product Demo</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="relative aspect-video bg-gray-100 border border-gray-200">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Demo Video"
                frameBorder="0"
                allowFullScreen
                className="absolute inset-0"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}