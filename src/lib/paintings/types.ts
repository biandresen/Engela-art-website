export type LocalizedText = {
  no: string
  en: string
}

export type PaintingStatus = 'available' | 'reserved' | 'sold'

export type PaintingOrientation = 'landscape' | 'portrait' | 'square'

export type PaintingSort =
  | 'year-desc'
  | 'year-asc'
  | 'area-desc'
  | 'area-asc'
  | 'price-desc'
  | 'price-asc'

export type PaintingQuery = {
  status?: PaintingStatus | 'all'
  orientation?: PaintingOrientation | 'all'
  sort?: PaintingSort
}

export type PaintingImageRole = 'main' | 'room-context' | 'detail'

export type CareProfile =
  | 'acrylic'
  | 'textured-surface'
  | 'oil'
  | 'pastel-chalk'
  | 'glitter-delicate'

export type PaintingImage = {
  role: PaintingImageRole
  alt: LocalizedText
  caption?: LocalizedText
  width: number
  height: number
  variants: Array<{
    width: number
    height: number
    avif: string
    webp: string
    fallback: string
  }>
}

export type PaintingRecord = {
  paintingId: `EA-${number}-${string}`
  metadataApproval: 'temporary' | 'artist-approved'
  title: string
  slug: string
  medium: LocalizedText
  visualSummary: LocalizedText
  artistNote?: LocalizedText
  widthCm: number
  heightCm: number
  depthCm: number
  year: number
  listedPriceNok: number
  status: PaintingStatus
  images: Array<PaintingImage>
  featured: boolean
  featuredOrder?: number
  careProfiles: Array<CareProfile>
  exceptionalCareNote?: LocalizedText
}

export type Painting = PaintingRecord & {
  orientation: PaintingOrientation
  areaCm2: number
}
