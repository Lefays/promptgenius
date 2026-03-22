"use client"

import { useState } from "react"
import Link from "next/link"
import Logo from "@/components/logo"
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Here you would typically send to your newsletter API
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      })
      
      setEmail('')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  const footerLinks = {
    Product: [
      { name: "Features", href: "/#features" },
      { name: "Pricing", href: "/#pricing" },
      { name: "API Access", href: "/api-docs" },
      { name: "Integrations", href: "/integrations" },
    ],
    Company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
    Resources: [
      { name: "Documentation", href: "/docs" },
      { name: "Guides", href: "/guides" },
      { name: "Community", href: "/community" },
      { name: "Support", href: "/support" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "License", href: "/license" },
    ],
  }

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "https://github.com/promptgenius" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/promptgenius" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/promptgenius" },
    { name: "Email", icon: Mail, href: "mailto:hello@promptgenius.ai" },
  ]

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {/* Logo and Description */}
            <div className="col-span-2">
              <Link href="/" className="inline-block">
                <Logo size="sm" animated={false} />
              </Link>
              <p className="mt-4 text-sm text-gray-600 max-w-xs">
                Transform your ideas into powerful AI prompts. Build, test, and deploy
                intelligent conversations with ease.
              </p>
              {/* Social Links */}
              <div className="flex gap-4 mt-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={link.name}
                  >
                    <link.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">{category}</h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1 group"
                      >
                        {link.name}
                        {link.href.startsWith("http") && (
                          <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-1 transition-all" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Stay up to date</h3>
              <p className="text-sm text-gray-600 mt-1">
                Get the latest updates on new features and prompt engineering tips.
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={handleNewsletter}>
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent flex-1 md:w-64"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} PromptGenius. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Cookies
              </Link>
              <Link href="/sitemap" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}