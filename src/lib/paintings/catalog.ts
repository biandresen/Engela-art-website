import { z } from 'zod'

import type {
  Painting,
  PaintingOrientation,
  PaintingQuery,
  PaintingRecord,
  PaintingSort,
} from './types'

export type PaintingCatalog = {
  all: () => ReadonlyArray<Painting>
  getBySlug: (slug: string) => Painting | undefined
  featured: () => ReadonlyArray<Painting>
  query: (query?: PaintingQuery) => ReadonlyArray<Painting>
}

const localizedTextSchema = z.object({
  no: z.string().trim().min(1, 'Translation is required'),
  en: z.string().trim().min(1, 'Translation is required'),
})

const publicAssetPath = /^\/assets\/paintings\/.+/

const paintingImageSchema = z.object({
  role: z.enum(['main', 'room-context', 'detail']),
  alt: localizedTextSchema,
  caption: localizedTextSchema.optional(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  variants: z
    .array(
      z.object({
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        avif: z
          .string()
          .regex(publicAssetPath, 'Must use a public derivative path')
          .endsWith('.avif'),
        webp: z
          .string()
          .regex(publicAssetPath, 'Must use a public derivative path')
          .endsWith('.webp'),
        fallback: z
          .string()
          .regex(publicAssetPath, 'Must use a public derivative path')
          .endsWith('.jpg'),
      }),
    )
    .min(2, 'At least two responsive variants are required'),
})

const paintingRecordSchema = z.object({
  paintingId: z.string().regex(/^EA-\d{4}-\d{3}$/, 'Use EA-YYYY-NNN format'),
  metadataApproval: z.enum(['temporary', 'artist-approved']),
  title: z.string().trim().min(1),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a stable URL-safe slug'),
  medium: localizedTextSchema,
  visualSummary: localizedTextSchema,
  artistNote: localizedTextSchema.optional(),
  widthCm: z.number().positive(),
  heightCm: z.number().positive(),
  depthCm: z.number().positive(),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  listedPriceNok: z.number().int().positive(),
  status: z.enum(['available', 'reserved', 'sold']),
  images: z.array(paintingImageSchema).min(1),
  featured: z.boolean(),
  featuredOrder: z.number().int().positive().optional(),
  careProfiles: z
    .array(
      z.enum([
        'acrylic',
        'textured-surface',
        'oil',
        'pastel-chalk',
        'glitter-delicate',
      ]),
    )
    .min(1),
  exceptionalCareNote: localizedTextSchema.optional(),
})

export class PaintingCatalogValidationError extends Error {
  readonly issues: ReadonlyArray<string>

  constructor(issues: Array<string>) {
    super(`Painting catalog validation failed:\n- ${issues.join('\n- ')}`)
    this.name = 'PaintingCatalogValidationError'
    this.issues = issues
  }
}

export function createPaintingCatalog(
  records: ReadonlyArray<PaintingRecord>,
): PaintingCatalog {
  const issues = validateCollection(records)

  if (issues.length > 0) {
    throw new PaintingCatalogValidationError(issues)
  }

  const paintings = records.map((record) =>
    addDerivedValues(paintingRecordSchema.parse(record) as PaintingRecord),
  )

  return {
    all(): ReadonlyArray<Painting> {
      return queryPaintings(paintings)
    },
    getBySlug(slug: string): Painting | undefined {
      return paintings.find((painting) => painting.slug === slug)
    },
    featured(): ReadonlyArray<Painting> {
      return paintings
        .filter((painting) => painting.featured)
        .sort(
          (left, right) =>
            (left.featuredOrder ?? 0) - (right.featuredOrder ?? 0),
        )
    },
    query(query: PaintingQuery = {}): ReadonlyArray<Painting> {
      return queryPaintings(paintings, query)
    },
  }
}

function queryPaintings(
  paintings: ReadonlyArray<Painting>,
  query: PaintingQuery = {},
): Array<Painting> {
  const { status = 'all', orientation = 'all', sort = 'year-desc' } = query

  return paintings
    .filter(
      (painting) =>
        (status === 'all' || painting.status === status) &&
        (orientation === 'all' || painting.orientation === orientation),
    )
    .sort(createPaintingComparator(sort))
}

function createPaintingComparator(
  sort: PaintingSort,
): (left: Painting, right: Painting) => number {
  const [field, direction] = sort.split('-') as [
    'year' | 'area' | 'price',
    'asc' | 'desc',
  ]
  const directionMultiplier = direction === 'asc' ? 1 : -1

  return (left, right) => {
    const leftValue = getSortValue(left, field)
    const rightValue = getSortValue(right, field)
    const valueDifference = (leftValue - rightValue) * directionMultiplier

    return valueDifference || left.title.localeCompare(right.title, 'nb')
  }
}

function getSortValue(
  painting: Painting,
  field: 'year' | 'area' | 'price',
): number {
  if (field === 'area') {
    return painting.areaCm2
  }

  return field === 'price' ? painting.listedPriceNok : painting.year
}

function validateCollection(
  records: ReadonlyArray<PaintingRecord>,
): Array<string> {
  const issues: Array<string> = []

  records.forEach((record, index) => {
    const result = paintingRecordSchema.safeParse(record)

    if (!result.success) {
      issues.push(
        ...result.error.issues.map(
          (issue) =>
            `Painting ${index + 1} ${issue.path.join('.')}: ${issue.message}`,
        ),
      )
    }

    const idYear = /^EA-(\d{4})-\d{3}$/.exec(record.paintingId)?.[1]
    if (idYear && Number(idYear) !== record.year) {
      issues.push(
        `Painting ${record.paintingId} year segment must match creation year ${record.year}`,
      )
    }

    if (!record.images.some((image) => image.role === 'main')) {
      issues.push(`Painting ${record.paintingId} requires a main image`)
    }

    if (!record.images.some((image) => image.role === 'room-context')) {
      issues.push(`Painting ${record.paintingId} requires a room-context image`)
    }

    if (record.featured && record.featuredOrder === undefined) {
      issues.push(
        `Painting ${record.paintingId} featuredOrder is required when featured`,
      )
    }
  })

  issues.push(
    ...findDuplicates(
      records.map((record) => record.paintingId),
      'painting ID',
    ),
    ...findDuplicates(
      records.map((record) => record.slug),
      'painting slug',
    ),
    ...findDuplicates(
      records.flatMap((record) =>
        record.featuredOrder === undefined ? [] : [record.featuredOrder],
      ),
      'featured order',
    ),
  )

  return issues
}

function findDuplicates(
  values: ReadonlyArray<string | number>,
  label: string,
): Array<string> {
  const seen = new Set<string | number>()
  const duplicates = new Set<string | number>()

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value)
    }
    seen.add(value)
  }

  return [...duplicates].map((value) => `Duplicate ${label}: ${value}`)
}

function addDerivedValues(record: PaintingRecord): Painting {
  return {
    ...record,
    orientation: deriveOrientation(record.widthCm, record.heightCm),
    areaCm2: record.widthCm * record.heightCm,
  }
}

function deriveOrientation(
  widthCm: number,
  heightCm: number,
): PaintingOrientation {
  if (widthCm === heightCm) {
    return 'square'
  }

  return widthCm > heightCm ? 'landscape' : 'portrait'
}
