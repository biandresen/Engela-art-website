import type { Locale } from '#/lib/i18n/locale'
import {
  galleryDefaults,
  getGallery,
  getGallerySearchString,
} from '#/lib/gallery/gallery'
import type { GallerySearch } from '#/lib/gallery/gallery'
import { localizedPaths } from '#/lib/i18n/routes'
import { getPaintingStatusClassName } from '#/lib/paintings/presentation'

import { ArtworkImage } from './ArtworkImage'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

type LocalizedGalleryPageProps = {
  locale: Locale
  search: GallerySearch
  onSearchChange: (search: GallerySearch) => void
}

export function LocalizedGalleryPage({
  locale,
  search,
  onSearchChange,
}: LocalizedGalleryPageProps) {
  const { paintings, content } = getGallery(locale, search)
  const paths = localizedPaths[locale]
  const gallerySearch = getGallerySearchString(search)

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Engela Art
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {content.title}
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          {content.intro}
        </p>
      </div>

      <div className="mt-10 grid gap-6 border-y border-border py-6 md:grid-cols-3">
        <fieldset>
          <legend className="text-sm font-semibold">
            {content.statusFilterLabel}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {(['all', 'available', 'reserved', 'sold'] as const).map(
              (status) => (
                <label
                  key={status}
                  className="inline-flex min-h-11 cursor-pointer items-center rounded-md border border-border px-4 text-sm has-checked:border-foreground has-checked:bg-muted"
                >
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={search.status === status}
                    onChange={() => onSearchChange({ ...search, status })}
                    className="mr-2"
                  />
                  {content.statusOptions[status]}
                </label>
              ),
            )}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold">
            {content.orientationFilterLabel}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {(['all', 'landscape', 'portrait', 'square'] as const).map(
              (orientation) => (
                <label
                  key={orientation}
                  className="inline-flex min-h-11 cursor-pointer items-center rounded-md border border-border px-4 text-sm has-checked:border-foreground has-checked:bg-muted"
                >
                  <input
                    type="radio"
                    name="orientation"
                    value={orientation}
                    checked={search.orientation === orientation}
                    onChange={() => onSearchChange({ ...search, orientation })}
                    className="mr-2"
                  />
                  {content.orientationOptions[orientation]}
                </label>
              ),
            )}
          </div>
        </fieldset>

        <div>
          <label htmlFor="gallery-sort" className="text-sm font-semibold">
            {content.sortLabel}
          </label>
          <select
            id="gallery-sort"
            value={search.sort}
            onChange={(event) =>
              onSearchChange({
                ...search,
                sort: event.target.value as GallerySearch['sort'],
              })
            }
            className="mt-3 min-h-11 w-full rounded-md border border-input bg-surface px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {(
              [
                'year-desc',
                'year-asc',
                'area-desc',
                'area-asc',
                'price-desc',
                'price-asc',
              ] as const
            ).map((sort) => (
              <option key={sort} value={sort}>
                {content.sortOptions[sort]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section aria-label={content.collectionLabel} className="mt-12">
        {paintings.length === 0 ? (
          <div className="rounded-md border border-border bg-surface px-6 py-10 text-center">
            <p className="text-lg font-semibold">{content.emptyMessage}</p>
            <Button
              type="button"
              variant="outline"
              className="mt-6"
              onClick={() => onSearchChange(galleryDefaults)}
            >
              {content.clearFilters}
            </Button>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {paintings.map((presentation) => {
              const painting = presentation.painting

              return (
                <article key={painting.paintingId}>
                  <a
                    href={`${paths.paintings}/${painting.slug}${gallerySearch}`}
                    className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    <div className="flex aspect-[4/5] items-center justify-center bg-muted p-4">
                      <ArtworkImage
                        image={presentation.mainImage}
                        locale={locale}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="max-h-full w-full object-contain transition-opacity group-hover:opacity-90"
                      />
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <h2 className="text-lg font-semibold">
                        {painting.title}
                      </h2>
                      <Badge
                        variant="outline"
                        className={getPaintingStatusClassName(painting.status)}
                      >
                        {presentation.statusLabel}
                      </Badge>
                    </div>
                  </a>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {painting.medium[locale]}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {painting.year} · {painting.widthCm} × {painting.heightCm} ×{' '}
                    {painting.depthCm} cm
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {presentation.priceLabel}
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {content.temporaryMetadata}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
