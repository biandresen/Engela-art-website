import type { Locale } from '#/lib/i18n/locale'
import { getInquiryTypeForPaintingStatus } from '#/lib/inquiries/inquiry'

import { getCareGuidance } from './care'
import { presentPainting } from './presentation'
import type { Painting } from './types'

export function getPaintingDetail(locale: Locale, painting: Painting) {
  const presentation = presentPainting(locale, painting)
  const inquiryType = getInquiryTypeForPaintingStatus(painting.status)
  const actionLabel =
    locale === 'no'
      ? painting.status === 'available'
        ? 'Spør om dette maleriet'
        : painting.status === 'reserved'
          ? 'Bli med på interesselisten'
          : 'Spør om lignende arbeid'
      : painting.status === 'available'
        ? 'Inquire about this painting'
        : painting.status === 'reserved'
          ? 'Join the interest list'
          : 'Ask about similar work'
  const statusNotice =
    locale === 'no'
      ? painting.status === 'available'
        ? 'En forespørsel reserverer ikke maleriet.'
        : painting.status === 'reserved'
          ? 'Å bli med på interesselisten reserverer eller garanterer ikke maleriet. Interessen behandles i rekkefølgen forespørslene mottas. Hvis du blir kontaktet, har du 48 timer på å svare.'
          : 'En forespørsel om lignende arbeid lover ikke en nøyaktig kopi og oppretter ikke et bestillingsoppdrag.'
      : painting.status === 'available'
        ? 'Sending an inquiry does not reserve the painting.'
        : painting.status === 'reserved'
          ? 'Joining the interest list does not reserve or guarantee the painting. Interest follows inquiry submission order; if contacted, you have 48 hours to respond.'
          : 'A similar-work inquiry does not promise an exact copy or create a commission.'
  const commissionAction =
    locale === 'no'
      ? {
          label: 'Snakk om bestillingsverk inspirert av dette',
          notice:
            'Bestillingsverk vurderes separat og lover ikke nøyaktige reproduksjoner.',
        }
      : {
          label: 'Discuss a commission inspired by this work',
          notice:
            'Commission inquiries are reviewed separately and do not promise exact reproductions.',
        }

  return {
    ...presentation,
    images: painting.images,
    care: getCareGuidance(locale, painting),
    action: {
      label: actionLabel,
      inquiryType,
      href: `/${locale}/${locale === 'no' ? 'kontakt' : 'contact'}?${new URLSearchParams(
        {
          type: inquiryType,
          painting: painting.slug,
        },
      )}`,
    },
    commissionAction: {
      ...commissionAction,
      href: `/${locale}/${locale === 'no' ? 'kontakt' : 'contact'}?${new URLSearchParams(
        {
          type: 'commission',
          painting: painting.slug,
        },
      )}`,
    },
    statusNotice,
    content:
      locale === 'no'
        ? {
            imagesLabel: 'Bilder av maleriet',
            paintingId: 'Maleri-ID',
            medium: 'Medium',
            dimensions: 'Mål',
            year: 'År',
            description: 'Beskrivelse',
            temporaryMetadata: 'Midlertidige katalogopplysninger',
            purchaseGuidance: 'Kjøpsinformasjon',
            unframed: 'Selges uten ramme.',
            shippingExcluded: 'Oppgitt pris er uten frakt.',
            availability:
              'Tilgjengelighet bekreftes av kunstneren før en reservasjon opprettes.',
            delivery:
              'Henting i Nannestad avtales på e-post. Sporing og passende tilgjengelig dekning brukes ved sending. Internasjonal levering vurderes i hvert enkelt tilfelle.',
          }
        : {
            imagesLabel: 'Painting images',
            paintingId: 'Painting ID',
            medium: 'Medium',
            dimensions: 'Dimensions',
            year: 'Year',
            description: 'Description',
            temporaryMetadata: 'Temporary catalog metadata',
            purchaseGuidance: 'Purchase information',
            unframed: 'Sold unframed.',
            shippingExcluded: 'Listed price excludes shipping.',
            availability:
              'Availability is confirmed by the artist before a reservation is created.',
            delivery:
              'Pickup in Nannestad is arranged by email. Tracked shipping with appropriate available coverage is used for deliveries. International delivery is considered case by case.',
          },
  }
}
