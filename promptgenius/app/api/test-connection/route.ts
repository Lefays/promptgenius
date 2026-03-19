import { NextResponse } from 'next/server'

export async function GET() {
  const results: any = {}
  
  // Test 1: Check if we can resolve the domain
  try {
    const dns = await fetch('https://irepsqwhkgftczbtoshf.supabase.co', {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    })
    results.dnsResolution = 'SUCCESS'
    results.statusCode = dns.status
  } catch (error: any) {
    results.dnsResolution = 'FAILED'
    results.dnsError = error.message
  }
  
  // Test 2: Try alternative DNS
  try {
    const ip = await fetch('https://1.1.1.1/dns-query?name=irepsqwhkgftczbtoshf.supabase.co', {
      headers: { 'Accept': 'application/dns-json' },
      signal: AbortSignal.timeout(5000)
    })
    const data = await ip.json()
    results.alternativeDNS = data
  } catch (error: any) {
    results.alternativeDNS = 'FAILED: ' + error.message
  }
  
  // Test 3: Check environment variables
  results.environment = {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL
  }
  
  // Test 4: Try direct IP access (Supabase's IP range)
  try {
    // Note: This won't work for Supabase as they require domain-based routing
    results.networkConnectivity = 'Check your firewall/proxy settings'
  } catch (error: any) {
    results.networkError = error.message
  }
  
  // Recommendations
  results.recommendations = []
  
  if (results.dnsResolution === 'FAILED') {
    results.recommendations.push('DNS Resolution Failed - Try these solutions:')
    results.recommendations.push('1. Check if you can access https://supabase.com in your browser')
    results.recommendations.push('2. Try using a different DNS server (8.8.8.8 or 1.1.1.1)')
    results.recommendations.push('3. Check if your firewall/antivirus is blocking the connection')
    results.recommendations.push('4. If on corporate network, check with IT about proxy settings')
    results.recommendations.push('5. Try using a VPN or different network')
  }
  
  return NextResponse.json(results, { status: 200 })
}