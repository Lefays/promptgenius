"use client"

import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PuterBanner() {
  return (
    <div className="rounded-lg border bg-card p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">AI-Powered Generation</p>
            <p className="text-sm text-muted-foreground">Advanced models • Privacy-focused</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open('https://docs.puter.com', '_blank')}
        >
          Learn More
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}