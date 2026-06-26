import type { Locale } from '#/lib/i18n/locale'
import { presentPainting } from '#/lib/paintings/presentation'
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
          featuredTitle: 'Utvalgte verk',
          temporaryMetadata: 'Midlertidige katalogopplysninger',
          artistPreviewLabel: 'Om kunstneren',
          artistPreviewTitle: 'Kunstneren bak Engela Art',
          artistPreview:
            'Midlertidig kunstnerpresentasjon – godkjent biografi og prosessbeskrivelse mangler.',
          artistPreviewAction: 'Om Engela',
          artistPortraitAlt: 'Portrett av Engela',
        }
      : {
          heroLabel: 'Temporary seasonal selection',
          temporaryNotice:
            'Temporary homepage content — final copy and selection await artist approval.',
          galleryAction: 'View all paintings',
          commissionsAction: 'Read about commissions',
          featuredLabel: 'Featured paintings',
          featuredTitle: 'Selected works',
          temporaryMetadata: 'Temporary catalog metadata',
          artistPreviewLabel: 'About the artist',
          artistPreviewTitle: 'The artist behind Engela Art',
          artistPreview:
            'Temporary artist preview — approved biography and process details are pending.',
          artistPreviewAction: 'About Engela',
          artistPortraitAlt: 'Portrait of Engela',
        }

  return {
    heroPainting: presentPainting(locale, heroPainting),
    featuredPaintings: paintingCatalog
      .featured()
      .map((painting) => presentPainting(locale, painting)),
    content,
  }
}
