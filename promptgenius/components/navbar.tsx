"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Logo from "@/components/logo"
import { Menu, X, ArrowRight, Mail, Lock, User as UserIcon, Github, Chrome } from "lucide-react"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  // const [isSignupOpen, setIsSignupOpen] = useState(false) // Unused
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })
  const [user, setUser] = useState<User | null>(null)
  const { scrollY } = useScroll()
  const router = useRouter()
  const { toast } = useToast()
  
  // Check for authenticated user
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    
    checkUser()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    
    return () => subscription.unsubscribe()
  }, [])
  
  // Transform values based on scroll
  const navPadding = useTransform(scrollY, [0, 100], ["1.25rem", "0.75rem"])
  const navWidth = useTransform(scrollY, [0, 100], ["100%", "85%"])
  const navTop = useTransform(scrollY, [0, 100], ["0px", "20px"])
  const navBorderRadius = useTransform(scrollY, [0, 100], ["0px", "20px"])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" }
  ]

  const handleOpenAuth = (isLoginForm: boolean) => {
    setIsLogin(isLoginForm)
    setIsLoginOpen(true)
    setFormData({ email: '', password: '', name: '' })
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // Sign in
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Sign in failed')
        }
        
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        })
        
        setIsLoginOpen(false)
        router.push('/generator')
      } else {
        // Sign up
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: formData.email, 
            password: formData.password, 
            name: formData.name 
          })
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Sign up failed')
        }
        
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        })
        
        setIsLoginOpen(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to sign in with Google.",
        variant: "destructive"
      })
    }
  }

  const handleGithubAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to sign in with GitHub.",
        variant: "destructive"
      })
    }
  }
  
  // Unused function - keeping for potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      <motion.nav
        className="fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 bg-white/95 backdrop-blur-lg"
        style={{
          width: navWidth,
          top: navTop,
          borderRadius: navBorderRadius,
          paddingTop: navPadding,
          paddingBottom: navPadding,
          paddingLeft: "2rem",
          paddingRight: "2rem",
          boxShadow: isScrolled ? "0 10px 40px rgba(0, 0, 0, 0.08)" : "0 2px 10px rgba(0, 0, 0, 0.05)"
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Logo size={isScrolled ? "sm" : "md"} animated={false} />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <nav className="flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link href="/generator">
                    <Button
                      className="bg-black hover:bg-gray-800 text-white px-6"
                    >
                      Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{user.email?.split('@')[0]}</span>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4"
                    onClick={() => handleOpenAuth(true)}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="bg-black hover:bg-gray-800 text-white px-6"
                    onClick={() => handleOpenAuth(false)}
                  >
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative z-10 text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Auth Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
          <div className="p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-center">
                {isLogin ? "Welcome Back" : "Create Account"}
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                {isLogin 
                  ? "Sign in to access your prompts and settings" 
                  : "Start creating amazing AI prompts today"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleAuth}
                  type="button"
                >
                  <Chrome className="h-4 w-4 mr-2" />
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGithubAuth}
                  type="button"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Form Fields */}
              <form className="space-y-4" onSubmit={handleAuth}>
                {!isLogin && (
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <div className="relative mt-1">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        className="pl-10 h-11"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      className="pl-10 h-11"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 h-11"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-gray-600">Remember me</span>
                    </label>
                    <Link href="#" className="text-sm text-purple-600 hover:text-purple-700">
                      Forgot password?
                    </Link>
                  </div>
                )}

                <Button 
                  className="w-full h-11 bg-black hover:bg-gray-800 text-white"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Loading..." : (isLogin ? "Sign In" : "Create Account")}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-0 h-full w-3/4 bg-white"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="flex flex-col gap-6 p-8 pt-24">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                <div className="mt-8 space-y-3">
                  {user ? (
                    <>
                      <div className="p-3 bg-purple-50 rounded-lg mb-4">
                        <p className="text-sm text-gray-600">Signed in as</p>
                        <p className="font-medium text-gray-900">{user.email}</p>
                      </div>
                      <Link href="/generator" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          className="w-full bg-black hover:bg-gray-800 text-white"
                        >
                          Go to Dashboard
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 text-gray-900 hover:bg-gray-50"
                        onClick={() => {
                          setIsMenuOpen(false)
                          handleOpenAuth(true)
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        className="w-full bg-black hover:bg-gray-800 text-white"
                        onClick={() => {
                          setIsMenuOpen(false)
                          handleOpenAuth(false)
                        }}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-24" />
    </>
  )
}