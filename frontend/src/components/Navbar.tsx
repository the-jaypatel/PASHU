import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Globe, Menu, X } from 'lucide-react'
import { Logo } from './ui/Logo'
import { ButtonLink } from './ui/Button'
import { scrollToSection } from '../utils/scroll'

interface Language {
  code: string
  label: string
  native: string
}

const LANGUAGES: Language[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
]

interface NavLinkItemProps {
  to: string
  children: string
  onClick?: () => void
}

function NavLinkItem({ to, children, onClick }: NavLinkItemProps) {
  const { pathname } = useLocation()

  const handleClick = () => {
    onClick?.()
    const hash = to.split('#')[1]
    if (hash) {
      if (pathname === '/') {
        scrollToSection(hash)
      }
    }
  }

  return (
    <Link
      to={to}
      onClick={handleClick}
      className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-sage-light/50 hover:text-forest"
    >
      {children}
    </Link>
  )
}

function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(LANGUAGES[0])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-sage-light/50 hover:text-forest"
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span>{selected.native}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-sage/25 bg-white py-1 shadow-cardhover"
        >
          {LANGUAGES.map((language) => (
            <li key={language.code} role="option" aria-selected={selected.code === language.code}>
              <button
                type="button"
                onClick={() => {
                  setSelected(language)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-cream ${
                  selected.code === language.code ? 'font-semibold text-forest' : 'text-ink-soft'
                }`}
              >
                <span>{language.native}</span>
                <span className="text-xs text-ink-muted">{language.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-sage/20 bg-cream/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <Logo onNavigate={closeMenu} />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <NavLinkItem to="/">Home</NavLinkItem>
          <NavLinkItem to="/#how-it-works">How It Works</NavLinkItem>
          <NavLinkItem to="/#about">About</NavLinkItem>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSelector />
          <ButtonLink to="/upload" size="sm" onClick={closeMenu}>
            Identify Breed
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-sage-light/50 md:hidden"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-sage/20 bg-cream md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
            <NavLinkItem to="/" onClick={closeMenu}>
              Home
            </NavLinkItem>
            <NavLinkItem to="/#how-it-works" onClick={closeMenu}>
              How It Works
            </NavLinkItem>
            <NavLinkItem to="/#about" onClick={closeMenu}>
              About
            </NavLinkItem>
            <div className="mt-3 flex flex-col gap-3 border-t border-sage/20 pt-4">
              <LanguageSelector />
              <ButtonLink to="/upload" fullWidth onClick={closeMenu}>
                Identify Breed
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
