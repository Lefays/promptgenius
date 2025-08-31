import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CookiePolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies</h2>
              <p className="text-gray-600 mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and understanding how you use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
              <p className="text-gray-600 mb-4">We use cookies for the following purposes:</p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Essential Cookies</h3>
              <p className="text-gray-600 mb-4">
                These cookies are necessary for the website to function properly. They enable basic functions like 
                page navigation and access to secure areas of the website.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Performance Cookies</h3>
              <p className="text-gray-600 mb-4">
                These cookies help us understand how visitors interact with our website by collecting and reporting 
                information anonymously. This helps us improve our website's performance.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Functionality Cookies</h3>
              <p className="text-gray-600 mb-4">
                These cookies enable the website to provide enhanced functionality and personalization, such as 
                remembering your login details and preferences.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Marketing Cookies</h3>
              <p className="text-gray-600 mb-4">
                These cookies are used to track visitors across websites to display ads that are relevant and 
                engaging for individual users.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-600 mb-4">
                We use services from third parties that may set cookies on your device:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                <li><strong>Stripe:</strong> For secure payment processing</li>
                <li><strong>Supabase:</strong> For authentication and data management</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Cookies</h2>
              <p className="text-gray-600 mb-4">
                You can control and manage cookies in various ways:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Browser Settings</h3>
              <p className="text-gray-600 mb-4">
                Most browsers allow you to refuse or accept cookies. You can usually find these settings in the 
                'options' or 'preferences' menu of your browser.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Cookie Preferences</h3>
              <p className="text-gray-600 mb-4">
                When you first visit our website, we'll ask for your consent to use non-essential cookies. 
                You can change your preferences at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Impact of Disabling Cookies</h2>
              <p className="text-gray-600 mb-4">
                Please note that if you disable cookies, some features of our website may not function properly. 
                Essential cookies cannot be disabled as they are required for the website to work.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with 
                an updated revision date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about our use of cookies, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  Email: privacy@promptgenius.ai<br />
                  Address: 123 AI Street, San Francisco, CA 94102
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}