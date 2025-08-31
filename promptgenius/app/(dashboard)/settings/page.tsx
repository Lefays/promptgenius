"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase/client"
import { 
  Trash2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Database,
  Sparkles,
  Settings2,
  Shield,
  Zap,
  Gift,
  Info,
  User,
  Mail,
  LogIn,
  LogOut,
  UserPlus,
  Edit2,
  Save
} from "lucide-react"

export default function SettingsPage() {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [storageUsed, setStorageUsed] = useState(0)
  const [historyCount, setHistoryCount] = useState(0)
  
  // Auth states
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [editingProfile, setEditingProfile] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    // Check for existing session
    checkUser()
    
    // Calculate storage usage
    calculateStorageUsage()
    
    // Load saved display name from localStorage
    const savedSettings = localStorage.getItem('user_settings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        if (settings.displayName) {
          setDisplayName(settings.displayName)
        }
      } catch {}
    }
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // Try to load from localStorage first, fallback to user metadata
        const savedSettings = localStorage.getItem('user_settings')
        if (savedSettings) {
          try {
            const settings = JSON.parse(savedSettings)
            setDisplayName(settings.displayName || session.user.user_metadata?.display_name || '')
          } catch {
            setDisplayName(session.user.user_metadata?.display_name || '')
          }
        } else {
          setDisplayName(session.user.user_metadata?.display_name || '')
        }
        setEmail(session.user.email || '')
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        setDisplayName(user.user_metadata?.display_name || '')
        setEmail(user.email || '')
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = async () => {
    setAuthError(null)
    setLoading(true)
    
    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName || email.split('@')[0]
            }
          }
        })
        
        if (error) throw error
        
        if (data.user) {
          // Automatically sign in the user after signup
          setUser(data.user)
          setDisplayName(data.user.user_metadata?.display_name || '')
          setSaveStatus("saved")
          setAuthMode('signin') // Switch to sign-in mode
          setAuthError(null)
          
          // Refresh the page data
          const { data: { user: refreshedUser } } = await supabase.auth.getUser()
          if (refreshedUser) {
            setUser(refreshedUser)
          }
          
          setTimeout(() => setSaveStatus("idle"), 2000)
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        
        if (data.user) {
          setUser(data.user)
          setDisplayName(data.user.user_metadata?.display_name || '')
          setSaveStatus("saved")
          setTimeout(() => setSaveStatus("idle"), 2000)
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      
      // Provide user-friendly error messages
      let errorMessage = 'Authentication failed'
      
      if (error.message?.includes('fetch failed') || error.message?.includes('NetworkError')) {
        errorMessage = 'Cannot connect to authentication server. Please check your internet connection.'
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password'
      } else if (error.message?.includes('User already registered')) {
        errorMessage = 'An account with this email already exists'
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = 'Password must be at least 6 characters'
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setAuthError(errorMessage)
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setEmail('')
      setPassword('')
      setDisplayName('')
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error('Error signing out:', error)
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }
  }

  const updateProfile = async () => {
    if (!user) return
    
    setSaveStatus("saving")
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      })
      
      if (error) throw error
      
      // Save to localStorage for immediate sidebar update
      const userSettings = {
        displayName: displayName,
        email: user.email
      }
      localStorage.setItem('user_settings', JSON.stringify(userSettings))
      
      // Dispatch storage event to notify sidebar
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'user_settings',
        newValue: JSON.stringify(userSettings),
        storageArea: localStorage
      }))
      
      setEditingProfile(false)
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }
  }

  const calculateStorageUsage = () => {
    let totalSize = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length
      }
    }
    setStorageUsed(Math.round(totalSize / 1024)) // Convert to KB
    
    // Count history items
    const history = localStorage.getItem('prompt_history')
    if (history) {
      try {
        const parsed = JSON.parse(history)
        setHistoryCount(Array.isArray(parsed) ? parsed.length : 0)
      } catch {}
    }
  }

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all prompt history? This cannot be undone.')) {
      localStorage.removeItem('prompt_history')
      setSaveStatus("saved")
      calculateStorageUsage()
      setTimeout(() => setSaveStatus("idle"), 2000)
    }
  }

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear ALL local data? This will remove all settings and history. This cannot be undone.')) {
      // Keep auth-related items
      const authKeys = ['supabase.auth.token', 'supabase.auth.expires_at']
      const authData: Record<string, string> = {}
      
      authKeys.forEach(key => {
        const value = localStorage.getItem(key)
        if (value) authData[key] = value
      })
      
      localStorage.clear()
      
      // Restore auth items
      Object.entries(authData).forEach(([key, value]) => {
        localStorage.setItem(key, value)
      })
      
      setSaveStatus("saved")
      calculateStorageUsage()
      setTimeout(() => setSaveStatus("idle"), 2000)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* User Profile Section */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5" />
            <h2 className="text-xl font-semibold">User Account</h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : user ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div>
                  <p className="text-sm text-muted-foreground">Signed in as</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="display-name">Display Name</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="display-name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={!editingProfile}
                      placeholder="Enter your display name"
                    />
                    {editingProfile ? (
                      <Button
                        onClick={updateProfile}
                        size="icon"
                        className="shrink-0"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setEditingProfile(true)}
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    value={user.email}
                    disabled
                    className="mt-1"
                  />
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Account created: {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-4 text-muted-foreground">
                Sign in to save your prompts across devices
              </div>
              
              <div className="space-y-3">
                {authMode === 'signup' && (
                  <div>
                    <Label htmlFor="signup-name">Display Name</Label>
                    <Input
                      id="signup-name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                      className="mt-1"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="auth-email">Email</Label>
                  <Input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="auth-password">Password</Label>
                  <Input
                    id="auth-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="mt-1"
                  />
                </div>
                
                {authError && (
                  <div className="text-sm text-red-500">{authError}</div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleAuth}
                    disabled={!email || !password || loading}
                    className="flex-1"
                  >
                    {authMode === 'signin' ? (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign Up
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  >
                    {authMode === 'signin' ? 'Need an account?' : 'Have an account?'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Storage Management */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Storage Management</h2>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-1">Local Storage Used</p>
                <p className="text-2xl font-bold">{storageUsed} KB</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-1">Prompt History</p>
                <p className="text-2xl font-bold">{historyCount} items</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={clearHistory}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear History
              </Button>
              <Button 
                variant="destructive" 
                onClick={clearAllData}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Local Data
              </Button>
              <Button 
                variant="outline" 
                onClick={calculateStorageUsage}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Stats
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Note: Clearing local data will not affect your account or cloud-saved prompts
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {saveStatus === "saved" && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300">
            <CheckCircle className="h-5 w-5" />
            <span>Operation completed successfully</span>
          </div>
        )}
        
        {saveStatus === "error" && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300">
            <AlertCircle className="h-5 w-5" />
            <span>An error occurred. Please try again.</span>
          </div>
        )}
      </div>
    </div>
  )
}