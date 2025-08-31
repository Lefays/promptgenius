"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, MessageSquare, Phone, MapPin, Send, CheckCircle } from "lucide-react"

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setFormSubmitted(true)
    setTimeout(() => setFormSubmitted(false), 3000)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "support@promptgenius.ai",
      description: "We'll respond within 24 hours"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      content: "Available 9am-6pm PST",
      description: "Get instant help from our team"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri, 9am-5pm PST"
    },
    {
      icon: MapPin,
      title: "Office",
      content: "San Francisco, CA",
      description: "123 AI Street, 94102"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have a question or need help? We're here to assist you. Reach out through any channel below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe" 
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="How can we help?" 
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <textarea 
                    id="message" 
                    rows={4}
                    placeholder="Tell us more about your inquiry..."
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-black hover:bg-gray-800 text-white"
                  disabled={formSubmitted}
                >
                  {formSubmitted ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Other ways to reach us</h2>
              
              <div className="grid grid-cols-1 gap-4">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <item.icon className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-900">{item.content}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Link */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Looking for quick answers?</h3>
                <p className="text-gray-600 mb-4">
                  Check out our FAQ section for instant answers to common questions.
                </p>
                <Link href="/#faq">
                  <Button variant="outline" className="border-gray-300">
                    View FAQ
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Response Time Notice */}
          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <p className="text-purple-900">
              <strong>Average response time:</strong> We typically respond to all inquiries within 24 hours during business days.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}