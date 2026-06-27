import type { Locale } from '#/lib/i18n/locale'

import type { Painting, PaintingImage } from './types'

const labels = {
  no: {
    statuses: {
      available: 'Tilgjengelig',
      reserved: 'Reservert',
      sold: 'Solgt',
    },
    prices: {
      available: 'Pris',
      reserved: 'Oppgitt pris',
      sold: 'Historisk oppgitt pris',
    },
  },
  en: {
    statuses: {
      available: 'Available',
      reserved: 'Reserved',
      sold: 'Sold',
    },
    prices: {
      available: 'Price',
      reserved: 'Listed price',
      sold: 'Historical listed price',
    },
  },
} as const

export function presentPainting(locale: Locale, painting: Painting) {
  const mainImage = painting.images.find((image) => image.role === 'main')
  const roomContextImage = painting.images.find(
    (image) => image.role === 'room-context',
  )

  if (!mainImage) {
    throw new Error(`Painting requires a main image: ${painting.slug}`)
  }

  const formattedPrice = new Intl.NumberFormat(
    locale === 'no' ? 'nb-NO' : 'en-US',
    {
      style: 'currency',
      currency: 'NOK',
      maximumFractionDigits: 0,
    },
  ).format(painting.listedPriceNok)

  return {
    painting,
    mainImage,
    roomContextImage,
    statusLabel: labels[locale].statuses[painting.status],
    priceLabel: `${labels[locale].prices[painting.status]}: ${formattedPrice}`,
  }
}

export type PaintingPresentation = {
  painting: Painting
  mainImage: PaintingImage
  roomContextImage?: PaintingImage
  statusLabel: string
  priceLabel: string
}

export function getPaintingStatusClassName(status: Painting['status']): string {
  if (status === 'available') {
    return 'border-2 border-available bg-available/10 text-available'
  }

  return status === 'reserved'
    ? 'border-2 border-reserved bg-reserved/14 text-reserved'
    : 'border-2 border-sold bg-sold/10 text-sold'
}
