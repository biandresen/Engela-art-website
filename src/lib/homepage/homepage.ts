import type { Locale } from '#/lib/i18n/locale'
import type { Painting } from '#/lib/paintings/types'
import { paintingCatalog } from '#/local-db/paintings'

const seasonalHeroPaintingSlug = 'temporary-painting-04'

export function getHomepage(locale: Locale) {
  const heroPainting = paintingCatalog.getBySlug(seasonalHeroPaintingSlug)

  if (!heroPainting) {
    throw new Error(
      `Configured seasonal hero painting was not found: ${seasonalHeroPaintingSlug}`,
    )
  }

  const content =
    locale === 'no'
      ? {
          heroLabel: 'Midlertidig sesongutvalg',
          temporaryNotice:
            'Midlertidig hjemmesideinnhold – endelig tekst og utvalg avventer kunstnerens godkjenning.',
          galleryAction: 'Se alle malerier',
          commissionsAction: 'Les om bestillingsverk',
          featuredLabel: 'Utvalgte malerier',
          featuredTitle: 'Redaksjonelt utvalg',
          temporaryMetadata: 'Midlertidige katalogopplysninger',
          artistPreviewLabel: 'Om kunstneren',
          artistPreviewTitle: 'Kunstneren bak Engela Art',
          artistPreview:
            'Midlertidig kunstnerpresentasjon – godkjent biografi og prosessbeskrivelse mangler.',
          artistPreviewAction: 'Om Engela',
          artistPortraitAlt: 'Portrett av Engela',
          statuses: {
            available: 'Tilgjengelig',
            reserved: 'Reservert',
            sold: 'Solgt',
          },
          priceLabels: {
            available: 'Pris',
            reserved: 'Oppgitt pris',
            sold: 'Historisk oppgitt pris',
          },
        }
      : {
          heroLabel: 'Temporary seasonal selection',
          temporaryNotice:
            'Temporary homepage content — final copy and selection await artist approval.',
          galleryAction: 'View all paintings',
          commissionsAction: 'Read about commissions',
          featuredLabel: 'Featured paintings',
          featuredTitle: 'Editorial selection',
          temporaryMetadata: 'Temporary catalog metadata',
          artistPreviewLabel: 'About the artist',
          artistPreviewTitle: 'The artist behind Engela Art',
          artistPreview:
            'Temporary artist preview — approved biography and process details are pending.',
          artistPreviewAction: 'About Engela',
          artistPortraitAlt: 'Portrait of Engela',
          statuses: {
            available: 'Available',
            reserved: 'Reserved',
            sold: 'Sold',
          },
          priceLabels: {
            available: 'Price',
            reserved: 'Listed price',
            sold: 'Historical listed price',
          },
        }

  return {
    heroPainting: presentPainting(heroPainting),
    featuredPaintings: paintingCatalog.featured().map(presentPainting),
    content,
  }

  function presentPainting(painting: Painting) {
    const mainImage = painting.images.find((image) => image.role === 'main')

    if (!mainImage) {
      throw new Error(
        `Homepage painting requires a main image: ${painting.slug}`,
      )
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
      statusLabel: content.statuses[painting.status],
      priceLabel: `${content.priceLabels[painting.status]}: ${formattedPrice}`,
    }
  }
}
