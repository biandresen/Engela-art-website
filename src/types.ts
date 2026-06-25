type PaintingStatus = 'available' | 'reserved' | 'sold'

export type Painting = {
  title: string
  slug: string
  medium: string
  dimensions: string
  year?: number
  priceNok?: number
  status: PaintingStatus
  description: string
  images: Array<{
    src: string
    alt: string
  }>
  featured: boolean
}
