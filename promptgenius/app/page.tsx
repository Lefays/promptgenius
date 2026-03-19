import Navbar from "@/components/navbar"
import LandingPage from "@/components/landing-page"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <LandingPage />
      <Footer />
    </div>
  )
}