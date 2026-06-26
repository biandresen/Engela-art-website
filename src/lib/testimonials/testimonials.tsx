import type { Locale } from '#/lib/i18n/locale'

type LocalizedText = Record<Locale, string>

export type TestimonialSource =
  | {
      type: 'google'
      label: LocalizedText
      url: string
    }
  | {
      type: 'email'
      label: LocalizedText
    }

export type Testimonial = {
  quote: LocalizedText
  displayName: string
  date: string
  source: TestimonialSource
  publicationConsent: {
    status: 'written' | 'pending'
    documentedAt: string
  }
}

type TestimonialsSectionProps = {
  locale: Locale
  entries: ReadonlyArray<Testimonial>
  heading: string
  intro?: string
  limit?: number
}

export const approvedTestimonials: ReadonlyArray<Testimonial> = []

export function getApprovedTestimonials({
  limit,
}: {
  limit?: number
} = {}) {
  const entries = approvedTestimonials.filter(isPublishableTestimonial)

  return typeof limit === 'number' ? entries.slice(0, limit) : entries
}

export function isPublishableTestimonial(
  entry: Testimonial,
): entry is Testimonial {
  const hasQuote = Boolean(entry.quote.no.trim() && entry.quote.en.trim())
  const hasAttribution = Boolean(entry.displayName.trim())
  const hasDate = /^\d{4}-\d{2}-\d{2}$/.test(entry.date)
  const hasPermission =
    entry.publicationConsent.status === 'written' &&
    /^\d{4}-\d{2}-\d{2}$/.test(entry.publicationConsent.documentedAt)
  const hasSource =
    entry.source.type === 'google'
      ? Boolean(
          entry.source.url && entry.source.label.no && entry.source.label.en,
        )
      : Boolean(entry.source.label.no && entry.source.label.en)

  return hasQuote && hasAttribution && hasDate && hasPermission && hasSource
}

export function TestimonialsSection({
  locale,
  entries,
  heading,
  intro,
  limit,
}: TestimonialsSectionProps) {
  const visibleEntries = entries.filter(isPublishableTestimonial)
  const limitedEntries =
    typeof limit === 'number' ? visibleEntries.slice(0, limit) : visibleEntries

  if (limitedEntries.length === 0) {
    return null
  }

  return (
    <section
      aria-label={heading}
      className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-12"
    >
      <div className="max-w-2xl">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {heading}
        </h2>
        {intro ? (
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            {intro}
          </p>
        ) : null}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {limitedEntries.map((entry) => (
          <article
            key={`${entry.displayName}-${entry.date}`}
            className="border-t border-border pt-5"
          >
            <blockquote className="text-lg leading-8">
              "{entry.quote[locale]}"
            </blockquote>
            <footer className="mt-5 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">
                {entry.displayName}
              </p>
              <p>
                <time dateTime={entry.date}>{entry.date}</time>
                {' - '}
                {entry.source.type === 'google' ? (
                  <a
                    href={entry.source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {entry.source.label[locale]}
                  </a>
                ) : (
                  entry.source.label[locale]
                )}
              </p>
            </footer>
          </article>
        ))}
      </div>
    </section>
  )
}
