import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Book, Code, Settings, Zap, Database, Shield } from "lucide-react"

export default function Documentation() {
  const sections = [
    {
      icon: Zap,
      title: "Getting Started",
      description: "Quick start guide to begin using PromptGenius",
      links: [
        "Installation",
        "First Prompt",
        "Basic Configuration"
      ]
    },
    {
      icon: Code,
      title: "API Reference",
      description: "Complete API documentation for developers",
      links: [
        "Authentication",
        "Endpoints",
        "Rate Limits"
      ]
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Learn how to manage your prompts and data",
      links: [
        "Export/Import",
        "Version Control",
        "Backup"
      ]
    },
    {
      icon: Settings,
      title: "Configuration",
      description: "Customize PromptGenius to your needs",
      links: [
        "User Settings",
        "Team Settings",
        "API Keys"
      ]
    },
    {
      icon: Shield,
      title: "Security",
      description: "Security best practices and guidelines",
      links: [
        "Authentication",
        "Data Encryption",
        "Compliance"
      ]
    },
    {
      icon: Book,
      title: "Tutorials",
      description: "Step-by-step guides for common tasks",
      links: [
        "Advanced Prompting",
        "Team Collaboration",
        "Integrations"
      ]
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
          
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
            <p className="text-xl text-gray-600">
              Everything you need to know about using PromptGenius effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <div key={section.title} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <section.icon className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h2>
                <p className="text-gray-600 mb-4">{section.description}</p>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-purple-600 hover:text-purple-700 text-sm">
                        → {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-purple-50 rounded-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h2>
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Link href="/contact">
              <button className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors">
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}