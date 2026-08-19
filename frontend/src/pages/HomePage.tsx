import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { HowItWorks } from '../components/HowItWorks'
import { AboutSection } from '../components/AboutSection'
import { Footer } from '../components/Footer'
import { scrollToSection } from '../utils/scroll'

export function HomePage() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const timer = setTimeout(() => scrollToSection(id), 60)
      return () => clearTimeout(timer)
    }
  }, [hash])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <AboutSection />
      </main>
      <Footer />
    </div>
  )
}
