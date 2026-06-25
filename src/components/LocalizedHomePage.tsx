import type { Locale } from '#/lib/i18n/locale'
import { getPageContent } from '#/lib/i18n/content'
import { getHomepage } from '#/lib/homepage/homepage'
import { localizedPaths } from '#/lib/i18n/routes'

import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ArtworkImage } from './ArtworkImage'

type LocalizedHomePageProps = {
  locale: Locale
}

export function LocalizedHomePage({ locale }: LocalizedHomePageProps) {
  const content = getPageContent(locale, 'home')
  const {
    heroPainting: heroPresentation,
    featuredPaintings,
    content: homepageContent,
  } = getHomepage(locale)
  const paths = localizedPaths[locale]

  return (
    <main>
      <section
        aria-label={homepageContent.heroLabel}
        className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 lg:grid-cols-2 lg:items-center lg:px-12"
      >
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Engela Art
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {content.intro}
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {homepageContent.temporaryNotice}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <a href={paths.paintings}>{homepageContent.galleryAction}</a>
            </Button>
            <Button asChild variant="link" size="lg">
              <a href={paths.commissions}>
                {homepageContent.commissionsAction}
              </a>
            </Button>
          </div>
        </div>

        <div className="flex min-h-96 items-center justify-center bg-muted p-4">
          <div className="w-full">
            <a
              href={`${paths.paintings}/${heroPresentation.painting.slug}`}
              className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <ArtworkImage
                image={heroPresentation.mainImage}
                locale={locale}
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="eager"
                fetchPriority="high"
                className="max-h-[38rem] w-full object-contain transition-opacity group-hover:opacity-90"
              />
              <h2 className="mt-4 text-lg font-semibold">
                {heroPresentation.painting.title}
              </h2>
            </a>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Badge
                variant="outline"
                className={getStatusClassName(heroPresentation.painting.status)}
              >
                {heroPresentation.statusLabel}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {heroPresentation.priceLabel}
              </p>
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {homepageContent.temporaryMetadata}
            </p>
          </div>
        </div>
      </section>

      <section
        aria-label={homepageContent.featuredLabel}
        className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-12"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {homepageContent.temporaryMetadata}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {homepageContent.featuredTitle}
          </h2>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {featuredPaintings.map((presentation) => {
            const painting = presentation.painting

            return (
              <article
                key={painting.paintingId}
                className="flex flex-col border-t border-border pt-4"
              >
                <a
                  href={`${paths.paintings}/${painting.slug}`}
                  className="group rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  <div className="flex aspect-[4/5] items-center justify-center bg-muted p-4">
                    <ArtworkImage
                      image={presentation.mainImage}
                      locale={locale}
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="max-h-full w-full object-contain transition-opacity group-hover:opacity-90"
                    />
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold">{painting.title}</h3>
                    <Badge
                      variant="outline"
                      className={getStatusClassName(painting.status)}
                    >
                      {presentation.statusLabel}
                    </Badge>
                  </div>
                </a>
                <p className="mt-3 text-sm text-muted-foreground">
                  {presentation.priceLabel}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {homepageContent.temporaryMetadata}
                </p>
              </article>
            )
          })}
        </div>
      </section>

      <section
        aria-label={homepageContent.artistPreviewLabel}
        className="bg-surface"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-center lg:px-12">
          <picture className="block">
            <source
              srcSet="/assets/portrait/engela-480.avif 480w, /assets/portrait/engela-768.avif 768w, /assets/portrait/engela-960.avif 960w"
              sizes="(min-width: 768px) 40vw, 100vw"
              type="image/avif"
            />
            <source
              srcSet="/assets/portrait/engela-480.webp 480w, /assets/portrait/engela-768.webp 768w, /assets/portrait/engela-960.webp 960w"
              sizes="(min-width: 768px) 40vw, 100vw"
              type="image/webp"
            />
            <img
              src="/assets/portrait/engela-960.jpg"
              width="960"
              height="1200"
              sizes="(min-width: 768px) 40vw, 100vw"
              alt={homepageContent.artistPortraitAlt}
              loading="lazy"
              decoding="async"
              className="mx-auto max-h-[34rem] w-full object-contain"
            />
          </picture>

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Engela Art
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {homepageContent.artistPreviewTitle}
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              {homepageContent.artistPreview}
            </p>
            <Button asChild variant="outline" size="lg" className="mt-8">
              <a href={paths.about}>{homepageContent.artistPreviewAction}</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

function getStatusClassName(status: 'available' | 'reserved' | 'sold') {
  if (status === 'available') {
    return 'border-available text-available'
  }

  return status === 'reserved'
    ? 'border-reserved text-reserved'
    : 'border-sold text-sold'
}
