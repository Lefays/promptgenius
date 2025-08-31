"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  Globe,
  Database,
  Key,
  Network
} from "lucide-react"

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error' | 'warning'
  message: string
  details?: any
}

export default function DiagnosticsPage() {
  const [tests, setTests] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  
  const runDiagnostics = async () => {
    setIsRunning(true)
    setTests([])
    
    const results: TestResult[] = []
    
    // Test 1: Check browser connectivity to Supabase domain
    try {
      const response = await fetch('https://irepsqwhkgftczbtoshf.supabase.co')
      results.push({
        name: 'Domain Resolution',
        status: 'success',
        message: `Successfully resolved Supabase domain (Status: ${response.status})`
      })
    } catch (error: any) {
      results.push({
        name: 'Domain Resolution',
        status: 'error',
        message: 'Cannot resolve Supabase domain - Check DNS/Network settings',
        details: error.message
      })
    }
    setTests([...results])
    
    // Test 2: Check API endpoint
    try {
      const response = await fetch('/api/test-connection')
      const data = await response.json()
      
      if (data.dnsResolution === 'SUCCESS') {
        results.push({
          name: 'API Connection',
          status: 'success',
          message: 'Server can reach Supabase',
          details: data
        })
      } else {
        results.push({
          name: 'API Connection',
          status: 'error',
          message: 'Server cannot reach Supabase',
          details: data
        })
      }
    } catch (error: any) {
      results.push({
        name: 'API Connection',
        status: 'error',
        message: 'Failed to test API connection',
        details: error.message
      })
    }
    setTests([...results])
    
    // Test 3: Check environment variables
    const envCheck = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }
    
    if (envCheck.url && envCheck.anonKey) {
      results.push({
        name: 'Environment Variables',
        status: 'success',
        message: 'All required environment variables are set',
        details: {
          url: envCheck.url,
          hasAnonKey: !!envCheck.anonKey
        }
      })
    } else {
      results.push({
        name: 'Environment Variables',
        status: 'error',
        message: 'Missing environment variables',
        details: envCheck
      })
    }
    setTests([...results])
    
    // Test 4: Try Supabase Auth
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      
      results.push({
        name: 'Supabase Auth',
        status: 'success',
        message: 'Successfully connected to Supabase Auth',
        details: { hasSession: !!data.session }
      })
    } catch (error: any) {
      results.push({
        name: 'Supabase Auth',
        status: 'error',
        message: 'Cannot connect to Supabase Auth',
        details: error.message
      })
    }
    setTests([...results])
    
    // Test 5: Try database query
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1)
        
      if (error) throw error
      
      results.push({
        name: 'Database Connection',
        status: 'success',
        message: 'Successfully connected to database',
        details: data
      })
    } catch (error: any) {
      results.push({
        name: 'Database Connection',
        status: 'warning',
        message: 'Database query failed (tables might not exist yet)',
        details: error.message
      })
    }
    setTests([...results])
    
    // Test 6: Check alternative access
    try {
      // Try to check if we're behind a proxy
      const isLocalhost = window.location.hostname === 'localhost'
      const isHttps = window.location.protocol === 'https:'
      
      results.push({
        name: 'Network Environment',
        status: 'success',
        message: `Running on ${window.location.hostname}`,
        details: {
          hostname: window.location.hostname,
          protocol: window.location.protocol,
          isLocalhost,
          isHttps,
          userAgent: navigator.userAgent
        }
      })
    } catch (error: any) {
      results.push({
        name: 'Network Environment',
        status: 'error',
        message: 'Failed to check network environment',
        details: error.message
      })
    }
    
    setTests([...results])
    setIsRunning(false)
  }
  
  useEffect(() => {
    runDiagnostics()
  }, [])
  
  const getIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <RefreshCw className="h-5 w-5 animate-spin text-gray-500" />
    }
  }
  
  const getSolutions = () => {
    // Only show network error if BOTH browser and API connections fail
    const browserError = tests.find(t => t.name === 'Domain Resolution')?.status === 'error'
    const apiError = tests.find(t => t.name === 'API Connection')?.status === 'error'
    const authWorks = tests.find(t => t.name === 'Supabase Auth')?.status === 'success'
    const dbWorks = tests.find(t => t.name === 'Database Connection')?.status === 'success'
    
    // If auth and DB work, Supabase is functioning properly
    const hasNetworkError = (browserError && apiError) && !authWorks && !dbWorks
    
    if (hasNetworkError) {
      return (
        <div className="mt-8 p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20">
          <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
            Network Connection Issue Detected
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            Your network cannot reach Supabase. This could be due to:
          </p>
          <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
            <li>• <strong>Corporate Firewall:</strong> Your network may be blocking Supabase</li>
            <li>• <strong>DNS Issues:</strong> Try changing your DNS to 8.8.8.8 or 1.1.1.1</li>
            <li>• <strong>Proxy Settings:</strong> Check if you need to configure proxy settings</li>
            <li>• <strong>VPN:</strong> Try connecting through a VPN</li>
            <li>• <strong>Region Block:</strong> Supabase might be blocked in your region</li>
          </ul>
          
          <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded">
            <p className="text-sm font-medium mb-2">Quick Fixes to Try:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Open Command Prompt as Administrator</li>
              <li>Run: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">ipconfig /flushdns</code></li>
              <li>Run: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">nslookup irepsqwhkgftczbtosfh.supabase.co</code></li>
              <li>If nslookup fails, change your DNS server in Network Settings</li>
              <li>Try accessing from a different network (mobile hotspot, etc.)</li>
            </ol>
          </div>
        </div>
      )
    }
    
    // Show success message if Supabase is working
    if (authWorks && dbWorks) {
      return (
        <div className="mt-8 p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20">
          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
            ✅ Supabase Connection Successful
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            Your Supabase backend is fully operational. You can now:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-green-700 dark:text-green-300">
            <li>• Sign up and log in with email/password</li>
            <li>• Generate and save prompts</li>
            <li>• View your prompt history</li>
            <li>• Test prompts with AI models</li>
          </ul>
          {browserError && (
            <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-950/20 rounded">
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Note: Direct browser access to Supabase is blocked, but the app works through the server-side API.
              </p>
            </div>
          )}
        </div>
      )
    }
    
    return null
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Connection Diagnostics</h1>
        <p className="text-muted-foreground">
          Testing your connection to Supabase and identifying any issues
        </p>
      </div>
      
      <div className="space-y-4">
        {tests.map((test, index) => (
          <div key={index} className="rounded-lg border bg-card p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {getIcon(test.status)}
                <div>
                  <h3 className="font-semibold">{test.name}</h3>
                  <p className="text-sm text-muted-foreground">{test.message}</p>
                  {test.details && (
                    <pre className="mt-2 text-xs bg-secondary/50 p-2 rounded overflow-x-auto">
                      {JSON.stringify(test.details, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {tests.length === 0 && (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Running diagnostics...</p>
          </div>
        )}
      </div>
      
      {getSolutions()}
      
      <div className="mt-8 flex justify-center">
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          size="lg"
        >
          {isRunning ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run Diagnostics Again
            </>
          )}
        </Button>
      </div>
      
      <div className="mt-8 p-4 rounded-lg border bg-secondary/30">
        <h3 className="font-semibold mb-2">Your Supabase Configuration</h3>
        <div className="space-y-2 text-sm font-mono">
          <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</p>
          <p>Project: irepsqwhkgftczbtoshf</p>
          <p>Region: Default</p>
        </div>
      </div>
    </div>
  )
}