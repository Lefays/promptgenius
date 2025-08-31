"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Sparkles, 
  Settings, 
  History,
  Home,
  Menu,
  X,
  Github,
  HelpCircle,
  LayoutDashboard,
  CreditCard,
  Bot,
  User as UserIcon,
  AlertCircle
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/logo"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@supabase/supabase-js"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Generator", href: "/generator", icon: Sparkles },
  { name: "Testing", href: "/testing", icon: Bot },
  { name: "History", href: "/history", icon: History },
  { name: "Pricing", href: "/pricing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
]

const bottomLinks = [
  { name: "Help", href: "/help", icon: HelpCircle },
  { name: "GitHub", href: "https://github.com/Lefays/prompt-generative", icon: Github, external: true },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [displayName, setDisplayName] = useState<string>("")
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      // Load display name from localStorage
      if (user) {
        const savedSettings = localStorage.getItem('user_settings')
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          setDisplayName(settings.displayName || "")
        }
      }
    }
    
    getUser()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const savedSettings = localStorage.getItem('user_settings')
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          setDisplayName(settings.displayName || "")
        }
      }
    })
    
    // Listen for storage changes to update display name
    const handleStorageChange = () => {
      const savedSettings = localStorage.getItem('user_settings')
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        setDisplayName(settings.displayName || "")
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      subscription.unsubscribe()
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      })
      
      router.push('/')
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to sign out.",
        variant: "destructive"
      })
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
        </button>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:block shadow-xl lg:shadow-none`}>
        <div className="flex h-full flex-col bg-gradient-to-b from-white to-gray-50/50">
          {/* Logo */}
          <div className="flex h-20 items-center justify-center px-6 border-b bg-gradient-to-br from-purple-50 to-white">
            <Link href="/" className="flex items-center">
              <Logo size="md" animated={false} />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Bottom links */}
          <div className="border-t border-gray-200 px-3 py-4 space-y-1">
            {bottomLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* User section */}
          <div className="border-t p-4 space-y-3">
            {user && (
              <div className="flex items-center gap-3 rounded-xl bg-purple-50 px-3 py-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {displayName || user.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}