import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User, ArrowRight } from "lucide-react"

export default function Blog() {
  const posts = [
    {
      title: "10 Advanced Prompting Techniques for Better AI Responses",
      excerpt: "Discover professional techniques to craft prompts that get exceptional results from AI models.",
      author: "Sarah Chen",
      date: "Jan 15, 2025",
      readTime: "5 min read",
      category: "Tutorial",
      featured: true
    },
    {
      title: "The Future of AI: Predictions for 2025 and Beyond",
      excerpt: "Explore upcoming trends in artificial intelligence and how they'll shape the way we work.",
      author: "Michael Johnson",
      date: "Jan 12, 2025",
      readTime: "8 min read",
      category: "Industry"
    },
    {
      title: "How PromptGenius Saved Our Team 20 Hours Per Week",
      excerpt: "A case study on how TechCorp transformed their workflow with intelligent prompt management.",
      author: "Emily Davis",
      date: "Jan 10, 2025",
      readTime: "6 min read",
      category: "Case Study"
    },
    {
      title: "Getting Started with the PromptGenius API",
      excerpt: "A comprehensive guide to integrating PromptGenius into your applications.",
      author: "Alex Chen",
      date: "Jan 8, 2025",
      readTime: "10 min read",
      category: "Development"
    },
    {
      title: "Prompt Engineering: Art or Science?",
      excerpt: "Understanding the balance between creativity and methodology in prompt design.",
      author: "Sarah Martinez",
      date: "Jan 5, 2025",
      readTime: "7 min read",
      category: "Opinion"
    },
    {
      title: "5 Common Prompting Mistakes and How to Avoid Them",
      excerpt: "Learn from common errors to improve your AI interactions immediately.",
      author: "Michael Johnson",
      date: "Jan 3, 2025",
      readTime: "4 min read",
      category: "Tutorial"
    }
  ]

  const categories = ["All", "Tutorial", "Industry", "Case Study", "Development", "Opinion"]

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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
            <p className="text-xl text-gray-600">
              Insights, tutorials, and updates from the PromptGenius team.
            </p>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  category === "All" 
                    ? "bg-black text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {posts.filter(p => p.featured).map((post) => (
            <div key={post.title} className="mb-12 p-8 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  Featured
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                  {post.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </span>
                </div>
                <Link href="#" className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                  Read More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.filter(p => !p.featured).map((post) => (
              <article key={post.title} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="mb-3">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <span>{post.date}</span>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors">
              Load More Articles
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}