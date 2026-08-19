import { Link } from 'react-router-dom'
import { ScanSearch } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-forest-dark text-sage-light">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                <ScanSearch className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-display text-xl font-extrabold tracking-tight text-white">PASHU</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sage">
              AI-powered Indian bovine breed identification for farmers, veterinarians,
              students and researchers.
            </p>
          </div>

          <nav aria-label="Footer">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="transition-colors hover:text-white">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/#about" className="transition-colors hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/upload" className="transition-colors hover:text-white">
                  Identify a Breed
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Built for India</h3>
            <p className="mt-4 text-sm leading-relaxed text-sage">
              Supporting indigenous cattle and buffalo breeds recognised by India's livestock
              development programmes.
            </p>
            <p className="mt-4 text-sm font-semibold text-white">Smart India Hackathon 2026</p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-sage/70">
          <p>© {new Date().getFullYear()} PASHU. Frontend prototype — simulated AI analysis. Built with React, Vite and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  )
}
