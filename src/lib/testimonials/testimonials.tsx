import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

import type { Locale } from '#/lib/i18n/locale'
import { cn } from '#/lib/utils'
import { Button } from '#/components/ui/button'

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
  rating: 1 | 2 | 3 | 4 | 5
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

export const approvedTestimonials: ReadonlyArray<Testimonial> = []

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
  const hasValidRating =
    Number.isInteger(entry.rating) && entry.rating >= 1 && entry.rating <= 5
  const hasPermission =
    entry.publicationConsent.status === 'written' &&
    /^\d{4}-\d{2}-\d{2}$/.test(entry.publicationConsent.documentedAt)
  const hasSource =
    entry.source.type === 'google'
      ? Boolean(
          entry.source.url && entry.source.label.no && entry.source.label.en,
        )
      : Boolean(entry.source.label.no && entry.source.label.en)

  return (
    hasQuote &&
    hasAttribution &&
    hasDate &&
    hasValidRating &&
    hasPermission &&
    hasSource
  )
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
  const [activeIndex, setActiveIndex] = useState(0)
  const visibleEntries = entries.filter(isPublishableTestimonial)
  const limitedEntries =
    typeof limit === 'number' ? visibleEntries.slice(0, limit) : visibleEntries

  if (limitedEntries.length === 0) {
    return null
  }

  const carouselLabels = getTestimonialCarouselLabels(locale)
  const totalEntries = limitedEntries.length
  const showControls = totalEntries > 1
  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? totalEntries - 1 : current - 1,
    )
  }
  const showNext = () => {
    setActiveIndex((current) => (current + 1) % totalEntries)
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

        <div
          aria-label={carouselLabels.region}
          aria-roledescription="carousel"
          className="mt-10"
          onKeyDown={(event) => {
            if (!showControls) {
              return
            }

            if (event.key === 'ArrowLeft') {
              event.preventDefault()
              showPrevious()
            } else if (event.key === 'ArrowRight') {
              event.preventDefault()
              showNext()
            }
          }}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {limitedEntries.map((entry, index) => (
                <TestimonialCard
                  key={`${entry.displayName}-${entry.date}`}
                  entry={entry}
                  locale={locale}
                  isActive={index === activeIndex}
                />
              ))}
            </div>
          </div>

          {showControls ? (
            <div className="mt-5 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={carouselLabels.previous}
                onClick={showPrevious}
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <p
                aria-live="polite"
                className="text-sm font-medium text-muted-foreground"
              >
                {carouselLabels.status(activeIndex + 1, totalEntries)}
              </p>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={carouselLabels.next}
                onClick={showNext}
              >
                <ChevronRight aria-hidden="true" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({
  entry,
  locale,
  isActive,
}: {
  entry: Testimonial
  locale: Locale
  isActive: boolean
}) {
  return (
    <article
      aria-hidden={isActive ? undefined : 'true'}
      className="min-w-full rounded-lg border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-semibold text-foreground">{entry.displayName}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            <time dateTime={entry.date}>{entry.date}</time>
            {' - '}
            {entry.source.type === 'google' ? (
              <a
                href={entry.source.url}
                target="_blank"
                rel="noreferrer"
                tabIndex={isActive ? undefined : -1}
                className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {entry.source.label[locale]}
              </a>
            ) : (
              entry.source.label[locale]
            )}
          </p>
        </div>
        <StarRating rating={entry.rating} locale={locale} />
      </div>

      <blockquote className="mt-6 text-lg leading-8">
        "{entry.quote[locale]}"
      </blockquote>
    </article>
  )
}

function StarRating({ rating, locale }: { rating: number; locale: Locale }) {
  const label =
    locale === 'no' ? `${rating} av 5 stjerner` : `${rating} of 5 stars`

  return (
    <div aria-label={label} className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const isFilled = index < rating

        return (
          <Star
            key={index}
            aria-hidden="true"
            className={cn(
              'size-5 stroke-[1.8]',
              isFilled
                ? 'fill-[#B98218] text-[#B98218]'
                : 'fill-transparent text-border',
            )}
          />
        )
      })}
    </div>
  )
}

function getTestimonialCarouselLabels(locale: Locale) {
  if (locale === 'no') {
    return {
      region: 'Kundeuttalelser',
      previous: 'Forrige kundeuttalelse',
      next: 'Neste kundeuttalelse',
      status: (current: number, total: number) =>
        `Kundeuttalelse ${current} av ${total}`,
    }
  }

  return {
    region: 'Testimonial carousel',
    previous: 'Previous testimonial',
    next: 'Next testimonial',
    status: (current: number, total: number) =>
      `Testimonial ${current} of ${total}`,
  }
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
