import type { Locale } from '#/lib/i18n/locale'
import { presentPainting } from '#/lib/paintings/presentation'
import type {
  PaintingOrientation,
  PaintingQuery,
  PaintingSort,
  PaintingStatus,
} from '#/lib/paintings/types'
import { paintingCatalog } from '#/local-db/paintings'

export const galleryDefaults = {
  status: 'all',
  orientation: 'all',
  sort: 'year-desc',
} as const satisfies Required<PaintingQuery>

const statuses = ['all', 'available', 'reserved', 'sold'] as const
const orientations = ['all', 'landscape', 'portrait', 'square'] as const
const sorts = [
  'year-desc',
  'year-asc',
  'area-desc',
  'area-asc',
  'price-desc',
  'price-asc',
] as const

export type GallerySearch = {
  status: PaintingStatus | 'all'
  orientation: PaintingOrientation | 'all'
  sort: PaintingSort
}

export function validateGallerySearch(
  search: Record<string, unknown>,
): GallerySearch {
  return {
    status: includes(statuses, search.status)
      ? search.status
      : galleryDefaults.status,
    orientation: includes(orientations, search.orientation)
      ? search.orientation
      : galleryDefaults.orientation,
    sort: includes(sorts, search.sort) ? search.sort : galleryDefaults.sort,
  }
}

export function getGallery(locale: Locale, search: GallerySearch) {
  return {
    paintings: paintingCatalog
      .query(search)
      .map((painting) => presentPainting(locale, painting)),
    content:
      locale === 'no'
        ? {
            title: 'Malerier',
            intro:
              'Utforsk hele den midlertidige katalogen. Opplysninger merket som midlertidige avventer kunstnerens godkjenning.',
            collectionLabel: 'Malerisamling',
            temporaryMetadata: 'Midlertidige katalogopplysninger',
            statusFilterLabel: 'Status',
            orientationFilterLabel: 'Retning',
            sortLabel: 'Sorter etter',
            emptyMessage: 'Ingen malerier passer med de valgte filtrene.',
            clearFilters: 'Nullstill alle filtre',
            statusOptions: {
              all: 'Alle',
              available: 'Tilgjengelig',
              reserved: 'Reservert',
              sold: 'Solgt',
            },
            orientationOptions: {
              all: 'Alle',
              landscape: 'Liggende',
              portrait: 'Stående',
              square: 'Kvadratisk',
            },
            sortOptions: {
              'year-desc': 'Nyeste først',
              'year-asc': 'Eldste først',
              'area-desc': 'Største flate først',
              'area-asc': 'Minste flate først',
              'price-desc': 'Høyeste pris først',
              'price-asc': 'Laveste pris først',
            },
          }
        : {
            title: 'Paintings',
            intro:
              'Explore the complete temporary catalog. Details marked as temporary await artist approval.',
            collectionLabel: 'Painting collection',
            temporaryMetadata: 'Temporary catalog metadata',
            statusFilterLabel: 'Status',
            orientationFilterLabel: 'Orientation',
            sortLabel: 'Sort by',
            emptyMessage: 'No paintings match the selected filters.',
            clearFilters: 'Clear all filters',
            statusOptions: {
              all: 'All',
              available: 'Available',
              reserved: 'Reserved',
              sold: 'Sold',
            },
            orientationOptions: {
              all: 'All',
              landscape: 'Landscape',
              portrait: 'Portrait',
              square: 'Square',
            },
            sortOptions: {
              'year-desc': 'Newest first',
              'year-asc': 'Oldest first',
              'area-desc': 'Largest area first',
              'area-asc': 'Smallest area first',
              'price-desc': 'Highest price first',
              'price-asc': 'Lowest price first',
            },
          },
  }
}

export function getGallerySearchString(search: GallerySearch): string {
  const parameters = new URLSearchParams()

  if (search.status !== galleryDefaults.status) {
    parameters.set('status', search.status)
  }
  if (search.orientation !== galleryDefaults.orientation) {
    parameters.set('orientation', search.orientation)
  }
  if (search.sort !== galleryDefaults.sort) {
    parameters.set('sort', search.sort)
  }

  const query = parameters.toString()

  return query ? `?${query}` : ''
}

function includes<const T extends ReadonlyArray<string>>(
  values: T,
  value: unknown,
): value is T[number] {
  return typeof value === 'string' && values.includes(value)
}
