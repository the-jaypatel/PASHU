import { SearchX } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { ButtonLink } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <AppShell>
      <section className="container-page flex flex-col items-center py-20 text-center sm:py-28">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cream-dark text-forest">
          <SearchX className="h-10 w-10" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-sm text-ink-soft">
          The page you're looking for doesn't exist. Let's get you back to identifying breeds.
        </p>
        <div className="mt-8">
          <ButtonLink to="/" size="lg">
            Back to Home
          </ButtonLink>
        </div>
      </section>
    </AppShell>
  )
}