import { Image as ImageIcon, Sun, Eye } from 'lucide-react'

const TIPS = [
  {
    icon: Sun,
    title: 'Use a clear, well-lit image',
    description: 'Good lighting helps the AI read coat colour and markings accurately.',
  },
  {
    icon: Eye,
    title: 'Keep the animal visible',
    description: 'A full side or front view works best for breed characteristics.',
  },
  {
    icon: ImageIcon,
    title: 'Avoid blur and obstruction',
    description: 'Heavily blurred or partially hidden animals reduce accuracy.',
  },
]

export function UploadTips() {
  return (
    <aside className="surface-card p-6" aria-label="Upload tips">
      <h2 className="font-display text-base font-bold text-ink">For best results</h2>
      <ul className="mt-4 space-y-4">
        {TIPS.map((tip) => (
          <li key={tip.title} className="flex gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage-light text-forest">
              <tip.icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{tip.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{tip.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
