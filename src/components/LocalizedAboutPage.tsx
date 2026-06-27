import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { Locale } from '#/lib/i18n/locale'
import { getPageContent } from '#/lib/i18n/content'
import { localizedPaths } from '#/lib/i18n/routes'
import type { AboutProcessImage } from '#/lib/about/about'
import { getAboutContent } from '#/lib/about/about'
import {
  TestimonialsSection,
  getApprovedTestimonials,
} from '#/lib/testimonials/testimonials'
import { env } from '#/env'
import { cn } from '#/lib/utils'

import { Button } from './ui/button'

export function LocalizedAboutPage({ locale }: { locale: Locale }) {
  const content = getPageContent(locale, 'about')
  const about = getAboutContent(locale)
  const paths = localizedPaths[locale]
  const testimonials = getApprovedTestimonials()

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(18rem,30rem)] md:items-center lg:px-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {about.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {content.intro}
          </p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {about.approvalLabel}
          </p>
          <p className="mt-3 leading-7 text-muted-foreground">{about.intro}</p>
        </div>

        <picture>
          <source
            type="image/avif"
            srcSet="/assets/portrait/engela-480.avif 480w, /assets/portrait/engela-768.avif 768w, /assets/portrait/engela-960.avif 960w"
            sizes="(min-width: 768px) 40vw, 100vw"
          />
          <source
            type="image/webp"
            srcSet="/assets/portrait/engela-480.webp 480w, /assets/portrait/engela-768.webp 768w, /assets/portrait/engela-960.webp 960w"
            sizes="(min-width: 768px) 40vw, 100vw"
          />
          <img
            src="/assets/portrait/engela-960.jpg"
            width="960"
            height="1200"
            alt={about.portraitAlt}
            className="h-auto w-full rounded-md bg-surface object-cover"
          />
        </picture>
      </section>

      <section className="bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-2 lg:px-12">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {about.storyTitle}
            </h2>
            <div className="mt-5 space-y-5 text-lg leading-8 text-muted-foreground">
              {about.storyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <AboutProcessSection
            title={about.processTitle}
            intro={about.processIntro}
            items={about.processItems}
            images={about.processImages}
            carouselLabel={about.processCarouselLabel}
            previousLabel={about.processPreviousLabel}
            nextLabel={about.processNextLabel}
            slideStatus={about.processSlideStatus}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {about.contactTitle}
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {about.contactText}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <a href={paths.contact}>{about.contactAction}</a>
            </Button>
            <Button asChild variant="link" size="lg">
              <a
                href={env.VITE_INSTAGRAM_URL ?? 'https://www.instagram.com/'}
                target="_blank"
                rel="noreferrer"
              >
                {about.instagramAction}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <TestimonialsSection
        locale={locale}
        entries={testimonials}
        heading={about.testimonialsHeading}
        intro={about.testimonialsIntro}
      />
    </main>
  )
}

type AboutProcessSectionProps = {
  title: string
  intro: string
  items: ReadonlyArray<string>
  images: ReadonlyArray<AboutProcessImage>
  carouselLabel: string
  previousLabel: string
  nextLabel: string
  slideStatus: (current: number, total: number) => string
}

export function AboutProcessSection({
  title,
  intro,
  items,
  images,
  carouselLabel,
  previousLabel,
  nextLabel,
  slideStatus,
}: AboutProcessSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const showCarousel = images.length > 0
  const totalImages = images.length

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? Math.max(totalImages - 1, 0) : current - 1,
    )
  }
  const showNext = () => {
    setActiveIndex((current) => (current + 1) % totalImages)
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-5 text-lg leading-8 text-muted-foreground">{intro}</p>
      <ul className="mt-5 space-y-3 text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="border-t border-border pt-3">
            {item}
          </li>
        ))}
      </ul>

      {showCarousel ? (
        <section
          aria-label={carouselLabel}
          aria-roledescription="carousel"
          className="mt-8"
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault()
              showPrevious()
            } else if (event.key === 'ArrowRight') {
              event.preventDefault()
              showNext()
            }
          }}
        >
          <div className="overflow-hidden rounded-md border border-border bg-background">
            <div
              className="flex transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {images.map((image) => (
                <figure key={image.id} className="min-w-full">
                  <ProcessImage image={image} />
                  <figcaption className="border-t border-border px-4 py-3 text-sm leading-6 text-muted-foreground">
                    {image.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={previousLabel}
              onClick={showPrevious}
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <p
              aria-live="polite"
              className="text-sm font-medium text-muted-foreground"
            >
              {slideStatus(activeIndex + 1, totalImages)}
            </p>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={nextLabel}
              onClick={showNext}
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                aria-label={image.caption}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'size-2.5 rounded-full border border-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
                  index === activeIndex ? 'bg-primary' : 'bg-transparent',
                )}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function ProcessImage({ image }: { image: AboutProcessImage }) {
  const largestVariant = image.variants.at(-1)

  if (!largestVariant) {
    return null
  }

  const avifSrcSet = image.variants
    .map((variant) => `${variant.avif} ${variant.width}w`)
    .join(', ')
  const webpSrcSet = image.variants
    .map((variant) => `${variant.webp} ${variant.width}w`)
    .join(', ')

  return (
    <picture className="block">
      <source
        type="image/avif"
        srcSet={avifSrcSet}
        sizes="(min-width: 768px) 40vw, 100vw"
      />
      <source
        type="image/webp"
        srcSet={webpSrcSet}
        sizes="(min-width: 768px) 40vw, 100vw"
      />
      <img
        src={largestVariant.fallback}
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className="aspect-[4/3] w-full bg-surface object-cover"
      />
    </picture>
  )
}
