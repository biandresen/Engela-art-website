import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="page-wrap px-4 py-16">
      <section className="island-shell rounded-2xl p-6 sm:p-10">
        <p className="island-kicker mb-3">Artist portfolio</p>
        <h1 className="display-title max-w-4xl text-5xl font-bold text-[var(--sea-ink)] sm:text-7xl">
          Engela Art Website
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--sea-ink-soft)]">
          A foundation for an artist portfolio and inquiry-first painting sales
          website.
        </p>
      </section>
    </main>
  )
}
