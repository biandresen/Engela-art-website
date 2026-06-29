import type { Locale } from '#/lib/i18n/locale'
import { cn } from '#/lib/utils'

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

export type CustomerPhoto = {
  image: {
    src: string
    width: number
    height: number
    alt: LocalizedText
  }
  caption: LocalizedText
  paintingReference: {
    slug: string
    title: string
  }
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
  googleProfileUrl?: string
  googleProfileLabel?: string
  className?: string
}

export const approvedTestimonials: ReadonlyArray<Testimonial> = [
  {
    quote: {
      no: '[DUMMY] Maleriet ga rommet en helt ny varme, og dialogen føltes personlig fra første melding.',
      en: '[DUMMY] The painting brought a new warmth to the room, and the conversation felt personal from the first message.',
    },
    displayName: 'Dummy Kunde 1',
    date: '2026-06-01',
    source: {
      type: 'email',
      label: {
        no: 'Dummy e-postuttalelse',
        en: 'Dummy email testimonial',
      },
    },
    publicationConsent: {
      status: 'written',
      documentedAt: '2026-06-01',
    },
  },
  {
    quote: {
      no: '[DUMMY] Vi fikk god hjelp til å forstå størrelse, uttrykk og hvordan maleriet ville passe hjemme hos oss.',
      en: '[DUMMY] We got thoughtful help understanding the size, mood, and how the painting would fit in our home.',
    },
    displayName: 'Dummy Kunde 2',
    date: '2026-06-02',
    source: {
      type: 'email',
      label: {
        no: 'Dummy e-postuttalelse',
        en: 'Dummy email testimonial',
      },
    },
    publicationConsent: {
      status: 'written',
      documentedAt: '2026-06-02',
    },
  },
  {
    quote: {
      no: '[DUMMY] Det føltes trygt å kjøpe originalkunst når prosessen var så rolig, tydelig og menneskelig.',
      en: '[DUMMY] Buying original art felt safe because the process was calm, clear, and human.',
    },
    displayName: 'Dummy Kunde 3',
    date: '2026-06-03',
    source: {
      type: 'email',
      label: {
        no: 'Dummy e-postuttalelse',
        en: 'Dummy email testimonial',
      },
    },
    publicationConsent: {
      status: 'written',
      documentedAt: '2026-06-03',
    },
  },
]

export const approvedCustomerPhotos: ReadonlyArray<CustomerPhoto> = []

export function getApprovedTestimonials({
  limit,
}: {
  limit?: number
} = {}) {
  const entries = approvedTestimonials.filter(isPublishableTestimonial)

  return typeof limit === 'number' ? entries.slice(0, limit) : entries
}

export function getApprovedCustomerPhotos({
  limit,
}: {
  limit?: number
} = {}) {
  const entries = approvedCustomerPhotos.filter(isPublishableCustomerPhoto)

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

export function isPublishableCustomerPhoto(
  entry: CustomerPhoto,
): entry is CustomerPhoto {
  const hasImage = Boolean(
    entry.image.src.trim() &&
    entry.image.alt.no.trim() &&
    entry.image.alt.en.trim() &&
    entry.image.width > 0 &&
    entry.image.height > 0,
  )
  const hasCaption = Boolean(entry.caption.no.trim() && entry.caption.en.trim())
  const hasPaintingReference = Boolean(
    entry.paintingReference.slug.trim() && entry.paintingReference.title.trim(),
  )
  const hasPermission =
    entry.publicationConsent.status === 'written' &&
    /^\d{4}-\d{2}-\d{2}$/.test(entry.publicationConsent.documentedAt)

  return hasImage && hasCaption && hasPaintingReference && hasPermission
}

export function TestimonialsSection({
  locale,
  entries,
  heading,
  intro,
  limit,
  googleProfileUrl,
  googleProfileLabel,
  className,
}: TestimonialsSectionProps) {
  const visibleEntries = entries.filter(isPublishableTestimonial)
  const limitedEntries =
    typeof limit === 'number' ? visibleEntries.slice(0, limit) : visibleEntries

  if (limitedEntries.length === 0) {
    return null
  }

  return (
    <section aria-label={heading} className={cn('py-16', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {heading}
          </h2>
          {intro ? (
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              {intro}
            </p>
          ) : null}
          {googleProfileUrl ? (
            <a
              href={googleProfileUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex w-fit rounded-sm text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {googleProfileLabel ??
                (locale === 'no'
                  ? 'Se Google-profilen'
                  : 'View the Google profile')}
            </a>
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
      </div>
    </section>
  )
}

type CustomerPhotosSectionProps = {
  locale: Locale
  entries: ReadonlyArray<CustomerPhoto>
  heading: string
  intro?: string
  limit?: number
}

export function CustomerPhotosSection({
  locale,
  entries,
  heading,
  intro,
  limit,
}: CustomerPhotosSectionProps) {
  const visibleEntries = entries.filter(isPublishableCustomerPhoto)
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

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {limitedEntries.map((entry) => (
          <figure
            key={`${entry.paintingReference.slug}-${entry.image.src}`}
            className="border-t border-border pt-5"
          >
            <img
              src={entry.image.src}
              width={entry.image.width}
              height={entry.image.height}
              alt={entry.image.alt[locale]}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full bg-muted object-cover"
            />
            <figcaption className="mt-4 text-sm leading-6 text-muted-foreground">
              <span className="block text-base font-semibold text-foreground">
                {entry.paintingReference.title}
              </span>
              {entry.caption[locale]}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
