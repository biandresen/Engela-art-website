import { createPaintingCatalog } from '#/lib/paintings/catalog'
import type {
  LocalizedText,
  PaintingImage,
  PaintingRecord,
} from '#/lib/paintings/types'

const sharedMedium: LocalizedText = {
  no: 'Akryl og strukturpasta på lerret.',
  en: 'Acrylic and texture paste on canvas.',
}

const sharedTechnique: LocalizedText = {
  no: 'Lagvis arbeid med pensel, palettkniv og oppbygde teksturer.',
  en: 'Layered brushwork, palette-knife marks, and built-up texture.',
}

const texturedAcrylicCareNote: LocalizedText = {
  no: 'Den teksturerte overflaten bør håndteres varsomt og ikke gnis.',
  en: 'Handle the textured surface carefully and avoid rubbing it.',
}

const paintingCopy: Partial<
  Record<
    number,
    {
      title: string
      visualSummary: LocalizedText
      artistNote: LocalizedText
    }
  >
> = {
  1: {
    title: 'Jordvarme',
    visualSummary: {
      no: 'Et varmt, stående maleri der jordtoner, lysere strøk og taktile lag møtes i en rolig bevegelse.',
      en: 'A warm portrait-format painting where earth tones, lighter strokes, and tactile layers meet in quiet movement.',
    },
    artistNote: {
      no: 'Anne Mari arbeider her med varme og ro, inspirert av landskap, vekst og følelsen av jord under hendene.',
      en: 'Here Anne Mari works with warmth and calm, inspired by landscape, growth, and the feeling of soil in the hands.',
    },
  },
  2: {
    title: 'Lys over åker',
    visualSummary: {
      no: 'Et liggende maleri med åpne felt, myke kontraster og en horisontal rytme som minner om lys over kulturlandskap.',
      en: 'A landscape-format painting with open fields, soft contrasts, and a horizontal rhythm reminiscent of light across farmland.',
    },
    artistNote: {
      no: 'Motivet henter stemning fra Nannestad og fra Anne Maris nære forhold til gårdsliv, natur og skiftende lys.',
      en: 'The mood draws from Nannestad and Anne Mari’s close relationship with farm life, nature, and changing light.',
    },
  },
  3: {
    title: 'Stille glede',
    visualSummary: {
      no: 'Et kvadratisk maleri med balanserte fargefelt, små detaljer og en dempet energi som inviterer til å se lenge.',
      en: 'A square painting with balanced colour fields, small details, and a quiet energy that invites longer looking.',
    },
    artistNote: {
      no: 'Arbeidet handler om den stille gleden ved å skape, og om ønsket om å sende den følelsen videre.',
      en: 'The work is about the quiet joy of creating, and the wish to pass that feeling on.',
    },
  },
  4: {
    title: 'Sommerminne',
    visualSummary: {
      no: 'Et lyst, liggende maleri med varme nyanser, organiske overganger og tekstur som gir flaten liv.',
      en: 'A bright landscape-format painting with warm tones, organic transitions, and texture that gives the surface life.',
    },
    artistNote: {
      no: 'Anne Mari lar farger og struktur bære minnet om en mild sommerdag, uten å binde motivet til ett bestemt sted.',
      en: 'Anne Mari lets colour and texture carry the memory of a mild summer day without tying the motif to one fixed place.',
    },
  },
  5: {
    title: 'Morgenro',
    visualSummary: {
      no: 'Et stående maleri med rolige fargelag, tydelige spor etter hånden og en oppadgående følelse.',
      en: 'A portrait-format painting with calm colour layers, visible hand-made marks, and an upward feeling.',
    },
    artistNote: {
      no: 'Maleriet søker en fredelig start: det øyeblikket før dagen tar fart, der fargene fortsatt er myke.',
      en: 'The painting seeks a peaceful beginning: the moment before the day gathers pace, while the colours are still soft.',
    },
  },
  6: {
    title: 'Hjemlengsel',
    visualSummary: {
      no: 'Et kvadratisk maleri med varme kontraster, tette lag og en stemning av tilhørighet og minner.',
      en: 'A square painting with warm contrasts, dense layers, and a mood of belonging and memory.',
    },
    artistNote: {
      no: 'Anne Mari vender tilbake til følelsen av hjem, natur og kreativ frihet i et uttrykk som er både nært og åpent.',
      en: 'Anne Mari returns to the feeling of home, nature, and creative freedom in an expression that feels both close and open.',
    },
  },
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
  const copy = paintingCopy[sequence]

  return {
    paintingId: `EA-2026-${idSequence}`,
    metadataApproval: 'artist-approved',
    title: copy?.title ?? `Maleri ${paddedSequence}`,
    slug,
    medium: sharedMedium,
    technique: sharedTechnique,
    visualSummary: copy?.visualSummary ?? {
      no: 'Originalt maleri fra Engela Art.',
      en: 'Original painting from Engela Art.',
    },
    artistNote: copy?.artistNote,
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
    exceptionalCareNote: texturedAcrylicCareNote,
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
            no: `Rett forfra-bilde av maleri ${sequence}.`,
            en: `Straight-on image of painting ${sequence}.`,
          }
        : {
            no: `Maleriet ${sequence} vist i et rom for skala og stemning.`,
            en: `Painting ${sequence} shown in a room for scale and atmosphere.`,
          },
    caption:
      role === 'room-context'
        ? {
            no: 'Miljøbildet viser skala og stemning. Ramme og møbler følger ikke med.',
            en: 'The room view shows scale and atmosphere. Frame and furnishings are not included.',
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
