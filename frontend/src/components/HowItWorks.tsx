import { Camera, Cpu, BadgeCheck } from 'lucide-react'
import { SectionHeading } from './ui/SectionHeading'

const STEPS = [
  {
    icon: Camera,
    step: 'Step 1',
    title: 'Upload a Photo',
    description: 'Upload or capture a clear image of a cow or buffalo from any device.',
  },
  {
    icon: Cpu,
    step: 'Step 2',
    title: 'AI Analyzes the Image',
    description: 'PASHU analyzes visible physical characteristics using artificial intelligence.',
  },
  {
    icon: BadgeCheck,
    step: 'Step 3',
    title: 'Discover the Breed',
    description: 'View the predicted breed along with confidence and breed information.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="How it works"
          title="Breed identification in three simple steps"
          description="No technical knowledge required. Just a clear photo and PASHU handles the rest."
        />

        <div className="relative mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
          <div
            className="absolute left-[16%] right-[16%] top-9 hidden border-t-2 border-dashed border-sage/50 md:block"
            aria-hidden="true"
          />
          {STEPS.map((item) => (
            <div key={item.title} className="surface-card relative p-6 text-center transition-shadow hover:shadow-cardhover sm:p-8">
              <div className="mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-forest text-white shadow-card">
                <item.icon className="h-8 w-8" aria-hidden="true" />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-earth">{item.step}</p>
              <h3 className="mt-2 font-display text-lg font-bold text-ink sm:text-xl">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
