import { Stethoscope, Tractor, GraduationCap, FlaskConical } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from './ui/SectionHeading'

interface Audience {
  icon: LucideIcon
  title: string
  description: string
}

const AUDIENCES: Audience[] = [
  {
    icon: Tractor,
    title: 'Farmers',
    description: 'Know your cattle breed instantly and make better livestock decisions.',
  },
  {
    icon: Stethoscope,
    title: 'Veterinary Professionals',
    description: 'Support breed-based health, nutrition and breeding recommendations.',
  },
  {
    icon: GraduationCap,
    title: 'Students & Researchers',
    description: 'Study India\u2019s rich bovine diversity with an easy identification tool.',
  },
  {
    icon: FlaskConical,
    title: 'Livestock Organizations',
    description: 'Support breed documentation, conservation and policy initiatives.',
  },
]

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 bg-cream-dark/60 py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="About PASHU"
          title="Technology that understands nature"
          description="PASHU uses artificial intelligence to assist in the identification of Indian bovine breeds from images, making livestock knowledge accessible to everyone."
        />

        <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
          {AUDIENCES.map((item) => (
            <div key={item.title} className="surface-card flex items-start gap-4 p-5 transition-shadow hover:shadow-cardhover sm:p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage-light text-forest">
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-ink">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 text-center sm:grid-cols-4">
          {[
            { value: '14+', label: 'Bovine breeds' },
            { value: '3', label: 'Top predictions' },
            { value: '10s', label: 'To results' },
            { value: '5', label: 'Supported formats' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl font-extrabold text-forest sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
