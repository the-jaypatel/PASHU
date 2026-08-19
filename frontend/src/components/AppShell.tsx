import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
