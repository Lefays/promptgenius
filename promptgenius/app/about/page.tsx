import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, Target, Zap, Award, Rocket, Heart } from "lucide-react"

export default function About() {
  const values = [
    {
      icon: Zap,
      title: "Innovation",
      description: "Pushing the boundaries of AI technology to create powerful, intuitive tools."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a supportive ecosystem where creators can learn and grow together."
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Committed to delivering the highest quality experience in every interaction."
    },
    {
      icon: Heart,
      title: "Empathy",
      description: "Understanding and addressing the real needs of our users with care."
    }
  ]

  const milestones = [
    { year: "2023", event: "Founded with a vision to democratize AI prompt engineering" },
    { year: "2024 Q1", event: "Launched beta version with 1,000+ early adopters" },
    { year: "2024 Q2", event: "Reached 10,000 active users and 500K prompts created" },
    { year: "2024 Q3", event: "Introduced advanced features and enterprise solutions" },
    { year: "2024 Q4", event: "Expanded team and secured strategic partnerships" }
  ]

  const team = [
    {
      name: "Alex Chen",
      role: "CEO & Co-founder",
      bio: "Former AI researcher at OpenAI with 10+ years in machine learning."
    },
    {
      name: "Sarah Martinez",
      role: "CTO & Co-founder",
      bio: "Engineering leader from Google, passionate about developer tools."
    },
    {
      name: "Michael Johnson",
      role: "Head of Product",
      bio: "Product veteran from Stripe, focused on user experience."
    },
    {
      name: "Emily Davis",
      role: "Head of Design",
      bio: "Award-winning designer creating intuitive AI interfaces."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Empowering Creators with AI
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're on a mission to make AI accessible to everyone by providing the tools 
                and knowledge needed to create powerful, effective prompts.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  PromptGenius was born from a simple observation: while AI models were becoming 
                  increasingly powerful, most people struggled to communicate effectively with them.
                </p>
                <p className="text-gray-600 mb-4">
                  Our founders, having worked at the forefront of AI development, recognized that 
                  the key to unlocking AI's potential wasn't just better models—it was better prompts.
                </p>
                <p className="text-gray-600">
                  Today, we're proud to serve thousands of creators, developers, and businesses 
                  who use PromptGenius to transform their ideas into reality.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Rocket className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">10,000+</p>
                      <p className="text-gray-600">Active Users</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Award className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">500,000+</p>
                      <p className="text-gray-600">Prompts Created</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Users className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">50+</p>
                      <p className="text-gray-600">Team Members</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-xl text-gray-600">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div key={value.title} className="text-center p-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <p className="text-xl text-gray-600">
                Key milestones in our growth
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6 mb-8">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-16 bg-purple-200 mx-auto mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="text-sm font-semibold text-purple-600 mb-1">{milestone.year}</p>
                    <p className="text-gray-700">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-600">
                The talented people behind PromptGenius
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-purple-600 text-sm mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-purple-50 to-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join Us on Our Mission
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Whether you're a creator, developer, or business, we're here to help you succeed with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/generator">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8">
                  Start Creating
                </Button>
              </Link>
              <Link href="/careers">
                <Button size="lg" variant="outline" className="border-gray-300 px-8">
                  Join Our Team
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}