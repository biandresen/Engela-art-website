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
          heroLabel: 'Sesongutvalg',
          temporaryNotice:
            'Anne Mari Engelsrud maler originale arbeider med varme farger, tekstur og rolig bevegelse. Hun vokste opp på gård i Nannestad, og kunsten bærer med seg både natur, minner og gleden ved å skape.',
          galleryAction: 'Se alle malerier',
          commissionsAction: 'Les om bestillingsverk',
          featuredLabel: 'Utvalgte malerier',
          featuredTitle: 'Utvalgte verk',
          temporaryMetadata: 'Originalt maleri fra Engela Art',
          artistPreviewLabel: 'Om kunstneren',
          artistPreviewTitle: 'Anne Mari Engelsrud',
          artistPreview:
            'Etter mange år med ønsket om å male og være kreativ, kunne Anne Mari ta drømmen på alvor etter pensjonisttilværelsen. Hun deler kunsten sin i håp om å gi andre glede.',
          artistPreviewAction: 'Om Anne Mari',
          artistPortraitAlt: 'Portrett av Anne Mari Engelsrud',
        }
      : {
          heroLabel: 'Seasonal selection',
          temporaryNotice:
            'Anne Mari Engelsrud paints original works with warm colour, texture, and quiet movement. Raised on a farm in Nannestad, she carries nature, memory, and the joy of making into her art.',
          galleryAction: 'View all paintings',
          commissionsAction: 'Read about commissions',
          featuredLabel: 'Featured paintings',
          featuredTitle: 'Selected works',
          temporaryMetadata: 'Original painting from Engela Art',
          artistPreviewLabel: 'About the artist',
          artistPreviewTitle: 'Anne Mari Engelsrud',
          artistPreview:
            'After many years of wanting to paint and be creative, Anne Mari was finally able to embrace that dream after retirement. She shares her art in the hope that it brings joy to others.',
          artistPreviewAction: 'About Anne Mari',
          artistPortraitAlt: 'Portrait of Anne Mari Engelsrud',
        }

  return {
    heroPainting: presentPainting(locale, heroPainting),
    featuredPaintings: paintingCatalog
      .featured()
      .map((painting) => presentPainting(locale, painting)),
    content,
  }
}
