import type { Painting } from '#/types'

export const paintings: Array<Painting> = [
  {
    title: 'Sommer',
    slug: 'sommer',
    medium: 'oljemaling',
    dimensions: '40x60',
    year: 2026,
    priceNok: 3000,
    status: 'available',
    description: 'Stort bilde med fin sol',
    images: [{ src: 'url', alt: 'Stort bilde med fin sol' }],
    featured: true,
  },
]
