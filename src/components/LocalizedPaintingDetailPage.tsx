import { useRef, useState } from 'react'

import type { Locale } from '#/lib/i18n/locale'
import { getGallerySearchString, galleryDefaults } from '#/lib/gallery/gallery'
import type { GallerySearch } from '#/lib/gallery/gallery'
import { localizedPaths } from '#/lib/i18n/routes'
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
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)
  const imageOpenerRef = useRef<HTMLElement | null>(null)
  const paths = localizedPaths[locale]
  const searchString = getGallerySearchString(gallerySearch)
  const hasGalleryState =
    gallerySearch.status !== galleryDefaults.status ||
    gallerySearch.orientation !== galleryDefaults.orientation ||
    gallerySearch.sort !== galleryDefaults.sort
  const galleryActionLabel =
    locale === 'no'
      ? hasGalleryState
        ? 'Tilbake til malerier'
        : 'Se alle malerier'
      : hasGalleryState
        ? 'Back to paintings'
        : 'View all paintings'

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 pb-32 sm:px-8 lg:px-12">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
        <section aria-label={detail.content.imagesLabel}>
          <div className="space-y-8">
            {detail.images.map((image, index) => (
              <figure key={`${image.role}-${index}`}>
                <button
                  type="button"
                  aria-label={`${detail.content.imagesLabel}: ${index + 1}`}
                  onClick={(event) => {
                    imageOpenerRef.current = event.currentTarget
                    setActiveImageIndex(index)
                  }}
                  className="block w-full rounded-sm bg-muted p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  <ArtworkImage
                    image={image}
                    locale={locale}
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    className="mx-auto max-h-[48rem] w-full object-contain"
                  />
                </button>
                {image.caption ? (
                  <figcaption className="mt-3 text-sm leading-6 text-muted-foreground">
                    {image.caption[locale]}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Engela Art
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
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
          <a
            href={`${paths.paintings}${searchString}`}
            className="mt-6 inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm font-semibold hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {galleryActionLabel}
          </a>

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
            <a href={detail.action.href}>{detail.action.label}</a>
          </Button>
          <p className="mt-3 max-w-prose text-sm leading-6 text-muted-foreground">
            {detail.statusNotice}
          </p>
          <div className="mt-6 border-t border-border pt-5">
            <a
              href={detail.commissionAction.href}
              className="text-sm font-semibold underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {detail.commissionAction.label}
            </a>
            <p className="mt-2 max-w-prose text-sm leading-6 text-muted-foreground">
              {detail.commissionAction.notice}
            </p>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <Button asChild size="lg" className="w-full">
          <a href={detail.action.href}>{detail.action.label}</a>
        </Button>
      </div>

      {activeImageIndex !== null ? (
        <PaintingImageViewer
          locale={locale}
          images={detail.images}
          activeIndex={activeImageIndex}
          onActiveIndexChange={setActiveImageIndex}
          onClose={() => {
            setActiveImageIndex(null)
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
