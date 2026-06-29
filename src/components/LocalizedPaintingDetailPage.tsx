import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import type { Locale } from '#/lib/i18n/locale'
import {
  getAdjacentGalleryPaintings,
  getGallerySearchString,
} from '#/lib/gallery/gallery'
import type { GallerySearch } from '#/lib/gallery/gallery'
import { localizedPaths } from '#/lib/i18n/routes'
import { captureAnalyticsEvent } from '#/lib/integrations/client-analytics'
import { getPaintingDetail } from '#/lib/paintings/detail'
import { getPaintingStatusClassName } from '#/lib/paintings/presentation'
import type { Painting } from '#/lib/paintings/types'

import { ArtworkImage } from './ArtworkImage'
import { PaintingImageViewer } from './PaintingImageViewer'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

type LocalizedPaintingDetailPageProps = {
  locale: Locale
  painting: Painting
  gallerySearch: GallerySearch
}

export function LocalizedPaintingDetailPage({
  locale,
  painting,
  gallerySearch,
}: LocalizedPaintingDetailPageProps) {
  const detail = getPaintingDetail(locale, painting)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [viewerImageIndex, setViewerImageIndex] = useState<number | null>(null)
  const imageOpenerRef = useRef<HTMLElement | null>(null)
  const selectedImage = detail.images[selectedImageIndex]
  const paths = localizedPaths[locale]
  const searchString = getGallerySearchString(gallerySearch)
  const adjacentPaintings = getAdjacentGalleryPaintings(
    painting.slug,
    gallerySearch,
  )
  const galleryActionLabel =
    locale === 'no' ? 'Tilbake til malerier' : 'Back to paintings'
  const detailNavigationLabel =
    locale === 'no' ? 'Malerinavigasjon' : 'Painting navigation'
  const previousLabel = locale === 'no' ? 'Forrige' : 'Previous'
  const nextLabel = locale === 'no' ? 'Neste' : 'Next'
  const previousUnavailableLabel =
    locale === 'no'
      ? 'Forrige maleri er ikke tilgjengelig'
      : 'Previous painting unavailable'
  const nextUnavailableLabel =
    locale === 'no'
      ? 'Neste maleri er ikke tilgjengelig'
      : 'Next painting unavailable'
  const actionNavigationLabel =
    locale === 'no' ? 'Malerihandlinger' : 'Painting actions'
  const stickyActionLabel =
    locale === 'no' ? 'Mobil henvendelseshandling' : 'Mobile inquiry action'

  useEffect(() => {
    captureAnalyticsEvent({
      name: 'painting_viewed',
      paintingId: painting.paintingId,
      paintingSlug: painting.slug,
      status: painting.status,
      language: locale,
    })
  }, [locale, painting.paintingId, painting.slug, painting.status])

  function handleInquiryStart() {
    captureAnalyticsEvent({
      name: 'inquiry_started',
      inquiryType: detail.action.inquiryType,
      language: locale,
    })
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 pb-44 sm:px-8 lg:px-12">
      <nav
        aria-label={detailNavigationLabel}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <a
          href={`${paths.paintings}${searchString}`}
          className="inline-flex w-fit items-center gap-2 rounded-sm text-sm font-semibold underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          {galleryActionLabel}
        </a>

        <div className="flex flex-wrap gap-3">
          {adjacentPaintings.previous ? (
            <Button asChild variant="outline" size="sm">
              <a
                href={`${paths.paintings}/${adjacentPaintings.previous.slug}${searchString}`}
                aria-label={`${locale === 'no' ? 'Forrige maleri' : 'Previous painting'}: ${adjacentPaintings.previous.title}`}
              >
                <ChevronLeft aria-hidden="true" />
                {previousLabel}
              </a>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={previousUnavailableLabel}
              disabled
            >
              <ChevronLeft aria-hidden="true" />
              {previousLabel}
            </Button>
          )}

          {adjacentPaintings.next ? (
            <Button asChild variant="outline" size="sm">
              <a
                href={`${paths.paintings}/${adjacentPaintings.next.slug}${searchString}`}
                aria-label={`${locale === 'no' ? 'Neste maleri' : 'Next painting'}: ${adjacentPaintings.next.title}`}
              >
                {nextLabel}
                <ChevronRight aria-hidden="true" />
              </a>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={nextUnavailableLabel}
              disabled
            >
              {nextLabel}
              <ChevronRight aria-hidden="true" />
            </Button>
          )}
        </div>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:items-start">
        <section
          aria-label={detail.content.imagesLabel}
          className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-1"
        >
          <div className="grid gap-4 md:grid-cols-[5rem_minmax(0,1fr)]">
            <div
              className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col md:overflow-visible"
              aria-label={detail.content.thumbnailsLabel}
            >
              {detail.images.map((image, index) => {
                const selected = index === selectedImageIndex
                const thumbnailLabel = selected
                  ? detail.content.selectedThumbnail(index + 1)
                  : detail.content.thumbnail(index + 1)

                return (
                  <button
                    key={`${image.role}-${index}`}
                    type="button"
                    aria-current={selected ? 'true' : undefined}
                    aria-label={`${thumbnailLabel}: ${image.alt[locale]}`}
                    onClick={() => setSelectedImageIndex(index)}
                    className="flex aspect-square w-20 shrink-0 items-center justify-center rounded-md border border-border bg-muted p-1 transition-colors hover:border-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-current:border-foreground aria-current:ring-2 aria-current:ring-ring/40 md:w-full"
                  >
                    <ArtworkImage
                      image={image}
                      locale={locale}
                      sizes="5rem"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                      className="max-h-full w-full object-contain"
                      alt=""
                    />
                  </button>
                )
              })}
            </div>

            <figure className="order-1 md:order-2">
              <button
                type="button"
                aria-label={`${detail.content.openSelectedImage(selectedImageIndex + 1)}: ${selectedImage.alt[locale]}`}
                onClick={(event) => {
                  imageOpenerRef.current = event.currentTarget
                  setViewerImageIndex(selectedImageIndex)
                }}
                className="block w-full rounded-sm bg-muted p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <ArtworkImage
                  image={selectedImage}
                  locale={locale}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  loading="eager"
                  fetchPriority="high"
                  className="mx-auto max-h-[48rem] w-full object-contain"
                />
              </button>
              {selectedImage.caption ? (
                <figcaption className="mt-3 text-sm leading-6 text-muted-foreground">
                  {selectedImage.caption[locale]}
                </figcaption>
              ) : null}
            </figure>
          </div>
        </section>

        <article
          aria-labelledby="painting-detail-title"
          className="lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-2"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Engela Art
          </p>
          <h1
            id="painting-detail-title"
            className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            {painting.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className={getPaintingStatusClassName(painting.status)}
            >
              {detail.statusLabel}
            </Badge>
            <p className="text-sm font-semibold">{detail.priceLabel}</p>
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {detail.content.temporaryMetadata}
          </p>
          <nav
            aria-label={actionNavigationLabel}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <Button asChild variant="outline" size="lg">
              <a href={`${paths.paintings}${searchString}`}>
                {galleryActionLabel}
              </a>
            </Button>
            <Button asChild size="lg">
              <a href={detail.action.href} onClick={handleInquiryStart}>
                {detail.action.label}
              </a>
            </Button>
          </nav>

          <dl className="mt-8 divide-y divide-border border-y border-border">
            <MetadataRow
              label={detail.content.paintingId}
              value={painting.paintingId}
            />
            <MetadataRow
              label={detail.content.medium}
              value={painting.medium[locale]}
            />
            <MetadataRow
              label={detail.content.technique}
              value={painting.technique[locale]}
            />
            <MetadataRow
              label={detail.content.dimensions}
              value={`${painting.widthCm} × ${painting.heightCm} × ${painting.depthCm} cm`}
            />
            <MetadataRow
              label={detail.content.year}
              value={String(painting.year)}
            />
          </dl>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">
              {detail.content.description}
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              {painting.visualSummary[locale]}
            </p>
            {painting.artistNote ? (
              <p className="mt-4 leading-7 text-muted-foreground">
                {painting.artistNote[locale]}
              </p>
            ) : null}
          </section>

          <section className="mt-8 rounded-md border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold">
              {detail.content.purchaseGuidance}
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>{detail.content.unframed}</li>
              <li>{detail.content.shippingExcluded}</li>
              <li>{detail.content.availability}</li>
              <li>{detail.content.delivery}</li>
            </ul>
          </section>

          <section
            aria-label={detail.care.label}
            className="mt-8 rounded-md border border-border bg-surface p-5"
          >
            <h2 className="text-lg font-semibold">{detail.care.title}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              {detail.care.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {detail.care.exceptionalNote ? (
              <p className="mt-4 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
                {detail.care.exceptionalNote}
              </p>
            ) : null}
          </section>

          <Button asChild size="lg" className="mt-8">
            <a href={detail.action.href} onClick={handleInquiryStart}>
              {detail.action.label}
            </a>
          </Button>
          <p className="mt-3 max-w-prose text-sm leading-6 text-muted-foreground">
            {detail.statusNotice}
          </p>
          <div className="mt-6 border-t border-border pt-5">
            <a
              href={detail.commissionAction.href}
              onClick={() =>
                captureAnalyticsEvent({
                  name: 'inquiry_started',
                  inquiryType: 'commission',
                  language: locale,
                })
              }
              className="text-sm font-semibold underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {detail.commissionAction.label}
            </a>
            <p className="mt-2 max-w-prose text-sm leading-6 text-muted-foreground">
              {detail.commissionAction.notice}
            </p>
          </div>
        </article>
      </div>

      <div
        aria-label={stickyActionLabel}
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden"
        role="region"
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <Badge
            variant="outline"
            className={getPaintingStatusClassName(painting.status)}
          >
            {detail.statusLabel}
          </Badge>
          <p className="text-sm font-semibold">{detail.priceLabel}</p>
        </div>
        <Button asChild size="lg" className="w-full">
          <a href={detail.action.href} onClick={handleInquiryStart}>
            {detail.action.label}
          </a>
        </Button>
      </div>

      {viewerImageIndex !== null ? (
        <PaintingImageViewer
          locale={locale}
          images={detail.images}
          activeIndex={viewerImageIndex}
          onActiveIndexChange={setViewerImageIndex}
          onClose={() => {
            setViewerImageIndex(null)
            imageOpenerRef.current?.focus()
          }}
        />
      ) : null}
    </main>
  )
}

function MetadataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr]">
      <dt className="text-sm font-semibold">{label}</dt>
      <dd className="text-sm leading-6 text-muted-foreground">{value}</dd>
    </div>
  )
}
