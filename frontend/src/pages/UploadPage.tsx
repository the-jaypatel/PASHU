import { AppShell } from '../components/AppShell'
import { UploadDropzone } from '../components/UploadDropzone'
import { UploadTips } from '../components/UploadTips'

export function UploadPage() {
  return (
    <AppShell>
      <section className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Identify a Bovine Breed
          </h1>
          <p className="mt-3 text-base leading-relaxed text-ink-soft sm:text-lg">
            Upload a clear image of a cow or buffalo to begin the analysis.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 lg:grid-cols-[1fr_20rem]">
          <UploadDropzone />
          <UploadTips />
        </div>
      </section>
    </AppShell>
  )
}
