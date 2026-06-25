import { createPaintingCatalog } from '#/lib/paintings/catalog'
import type {
  LocalizedText,
  PaintingImage,
  PaintingRecord,
} from '#/lib/paintings/types'

const temporaryMedium: LocalizedText = {
  no: 'Midlertidig mediumtekst. Materialene må godkjennes av kunstneren.',
  en: 'Temporary medium text. Materials require artist approval.',
}

const temporaryCareNote: LocalizedText = {
  no: 'Midlertidig pleieprofil. Endelig veiledning avventer materialbekreftelse.',
  en: 'Temporary care profile. Final guidance awaits material confirmation.',
}

const temporaryRecords: Array<PaintingRecord> = [
  createTemporaryPainting({
    sequence: 1,
    dimensions: [40, 60, 2],
    listedPriceNok: 1000,
    status: 'available',
    featuredOrder: 1,
    mainDimensions: [
      [480, 640],
      [960, 1280],
    ],
  }),
  createTemporaryPainting({
    sequence: 2,
    dimensions: [60, 40, 2],
    listedPriceNok: 2000,
    status: 'reserved',
    featuredOrder: 2,
    mainDimensions: [
      [480, 360],
      [960, 721],
    ],
  }),
  createTemporaryPainting({
    sequence: 3,
    dimensions: [50, 50, 2],
    listedPriceNok: 3000,
    status: 'sold',
    featuredOrder: 3,
    mainDimensions: [
      [480, 478],
      [960, 957],
    ],
  }),
  createTemporaryPainting({
    sequence: 4,
    dimensions: [70, 50, 2],
    listedPriceNok: 4000,
    status: 'available',
    mainDimensions: [
      [480, 361],
      [960, 722],
    ],
  }),
  createTemporaryPainting({
    sequence: 5,
    dimensions: [45, 65, 2],
    listedPriceNok: 5000,
    status: 'reserved',
    mainDimensions: [
      [480, 596],
      [960, 1191],
    ],
  }),
  createTemporaryPainting({
    sequence: 6,
    dimensions: [55, 55, 2],
    listedPriceNok: 6000,
    status: 'sold',
    mainDimensions: [
      [480, 478],
      [960, 957],
    ],
  }),
]

export const paintingCatalog = createPaintingCatalog(temporaryRecords)

type TemporaryPaintingInput = {
  sequence: number
  dimensions: [widthCm: number, heightCm: number, depthCm: number]
  listedPriceNok: number
  status: PaintingRecord['status']
  featuredOrder?: number
  mainDimensions: Array<[width: number, height: number]>
}

function createTemporaryPainting({
  sequence,
  dimensions: [widthCm, heightCm, depthCm],
  listedPriceNok,
  status,
  featuredOrder,
  mainDimensions,
}: TemporaryPaintingInput): PaintingRecord {
  const paddedSequence = String(sequence).padStart(2, '0')
  const idSequence = String(sequence).padStart(3, '0')
  const slug = `temporary-painting-${paddedSequence}`

  return {
    paintingId: `EA-2026-${idSequence}`,
    metadataApproval: 'temporary',
    title: `Temporary painting ${paddedSequence}`,
    slug,
    medium: temporaryMedium,
    visualSummary: {
      no: `Midlertidig katalogtekst for maleri ${paddedSequence}. Faktabeskrivelse avventer kunstnerens godkjenning.`,
      en: `Temporary catalog copy for painting ${paddedSequence}. Factual description awaits artist approval.`,
    },
    widthCm,
    heightCm,
    depthCm,
    year: 2026,
    listedPriceNok,
    status,
    images: [
      createImage(slug, paddedSequence, 'main', mainDimensions),
      createImage(slug, paddedSequence, 'room-context', [
        [640, 480],
        [1200, 900],
      ]),
    ],
    featured: featuredOrder !== undefined,
    featuredOrder,
    careProfiles: ['acrylic'],
    exceptionalCareNote: temporaryCareNote,
  }
}

function createImage(
  slug: string,
  sequence: string,
  role: PaintingImage['role'],
  dimensions: Array<[width: number, height: number]>,
): PaintingImage {
  const largest = dimensions.at(-1)

  if (!largest) {
    throw new Error(`Painting ${slug} requires image dimensions`)
  }

  return {
    role,
    alt:
      role === 'main'
        ? {
            no: `Midlertidig hovedbilde for maleri ${sequence}. Godkjent alternativ tekst mangler.`,
            en: `Temporary main image for painting ${sequence}. Approved alternative text is pending.`,
          }
        : {
            no: `Midlertidig romvisualisering for maleri ${sequence}.`,
            en: `Temporary room visualization for painting ${sequence}.`,
          },
    caption:
      role === 'room-context'
        ? {
            no: 'Midlertidig visualisering med plassholderdimensjoner. Ramme og møbler følger ikke med.',
            en: 'Temporary visualization using placeholder dimensions. Frame and furnishings are not included.',
          }
        : undefined,
    width: largest[0],
    height: largest[1],
    variants: dimensions.map(([width, height]) => ({
      width,
      height,
      avif: `/assets/paintings/${slug}/${role}-${width}.avif`,
      webp: `/assets/paintings/${slug}/${role}-${width}.webp`,
      fallback: `/assets/paintings/${slug}/${role}-${width}.jpg`,
    })),
  }
}
