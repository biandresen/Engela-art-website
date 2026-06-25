import type { Locale } from '#/lib/i18n/locale'

import type { Painting } from './types'

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
    statusLabel: labels[locale].statuses[painting.status],
    priceLabel: `${labels[locale].prices[painting.status]}: ${formattedPrice}`,
  }
}

export function getPaintingStatusClassName(status: Painting['status']): string {
  if (status === 'available') {
    return 'border-available text-available'
  }

  return status === 'reserved'
    ? 'border-reserved text-reserved'
    : 'border-sold text-sold'
}
