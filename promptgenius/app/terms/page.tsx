import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Effective Date: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing or using PromptGenius ("the Service"), you agree to be bound by these Terms of Service. 
                If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                PromptGenius provides an AI-powered platform for creating, testing, and managing prompts for various AI models. 
                Features include prompt generation, optimization, version control, and collaboration tools.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Account Creation</h3>
              <p className="text-gray-600 mb-4">
                To use certain features, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Promptly update any changes to your information</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Account Termination</h3>
              <p className="text-gray-600 mb-4">
                We reserve the right to suspend or terminate accounts that violate these terms or engage in prohibited activities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
              <p className="text-gray-600 mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Generate content that violates any laws or third-party rights</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Transmit viruses, malware, or harmful code</li>
                <li>Engage in any activity that could damage our reputation</li>
                <li>Resell or redistribute the Service without permission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Our Property</h3>
              <p className="text-gray-600 mb-4">
                The Service, including its original content, features, and functionality, is owned by PromptGenius 
                and is protected by international copyright, trademark, and other intellectual property laws.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Your Content</h3>
              <p className="text-gray-600 mb-4">
                You retain ownership of content you create using the Service. By using the Service, you grant us a 
                worldwide, non-exclusive license to use, store, and display your content as necessary to provide the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Payment Terms</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Subscription Plans</h3>
              <p className="text-gray-600 mb-4">
                Paid features require a subscription. Subscriptions automatically renew unless canceled before the renewal date.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Billing</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Payments are processed securely through Stripe</li>
                <li>You authorize us to charge your payment method for recurring fees</li>
                <li>Prices may change with 30 days notice</li>
                <li>No refunds for partial months or unused features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. API Usage</h2>
              <p className="text-gray-600 mb-4">
                If you use our API, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Comply with rate limits and usage guidelines</li>
                <li>Not reverse engineer or attempt to extract source code</li>
                <li>Use the API only for its intended purpose</li>
                <li>Maintain the security of your API keys</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Disclaimers</h2>
              <p className="text-gray-600 mb-4">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING 
                BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-gray-600 mb-4">
                We do not guarantee that:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>The Service will be uninterrupted or error-free</li>
                <li>AI-generated content will be accurate or suitable for your purposes</li>
                <li>The Service will meet your specific requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, PROMPTGENIUS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED 
                DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
              <p className="text-gray-600 mb-4">
                You agree to indemnify and hold harmless PromptGenius, its affiliates, and their respective officers, 
                directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising 
                from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-600 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the State of California, 
                United States, without regard to its conflict of law provisions. Any disputes shall be resolved in the 
                courts of San Francisco County, California.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these Terms at any time. Material changes will be notified via email 
                or prominent notice on the Service. Continued use after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                For questions about these Terms, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  Email: legal@promptgenius.ai<br />
                  Address: 123 AI Street, San Francisco, CA 94102<br />
                  Phone: +1 (555) 123-4567
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