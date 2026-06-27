import type { Locale } from '#/lib/i18n/locale'

type AboutContent = {
  eyebrow: string
  approvalLabel: string
  intro: string
  portraitAlt: string
  storyTitle: string
  storyParagraphs: Array<string>
  processTitle: string
  processIntro: string
  processItems: Array<string>
  processImages: Array<AboutProcessImage>
  processCarouselLabel: string
  processPreviousLabel: string
  processNextLabel: string
  processSlideStatus: (current: number, total: number) => string
  contactTitle: string
  contactText: string
  contactAction: string
  instagramAction: string
  testimonialsHeading: string
  testimonialsIntro: string
}

export type AboutProcessImage = {
  id: string
  alt: string
  caption: string
  width: number
  height: number
  variants: Array<{
    width: number
    avif: string
    webp: string
    fallback: string
  }>
}

const processImageFiles = [
  'studio-table',
  'brushes-and-palette',
  'canvas-detail',
  'finishing-work',
] as const

function buildProcessImages(
  entries: Array<{
    file: (typeof processImageFiles)[number]
    alt: string
    caption: string
  }>,
): Array<AboutProcessImage> {
  return entries.map((entry) => ({
    id: entry.file,
    alt: entry.alt,
    caption: entry.caption,
    width: 1200,
    height: 900,
    variants: [640, 1200].map((width) => ({
      width,
      avif: `/assets/about/process/${entry.file}-${width}.avif`,
      webp: `/assets/about/process/${entry.file}-${width}.webp`,
      fallback: `/assets/about/process/${entry.file}-${width}.jpg`,
    })),
  }))
}

export const aboutContent: Record<Locale, AboutContent> = {
  no: {
    eyebrow: 'Engela Art',
    approvalLabel: 'Kunstnergodkjent biografi mangler',
    intro:
      'Engela Art erstatter denne midlertidige sideteksten når kunstneren har godkjent norsk kildetekst og engelsk oversettelse.',
    portraitAlt: 'Portrett av Engela, kunstneren bak Engela Art',
    storyTitle: 'Historien bak kunsten',
    storyParagraphs: [
      'Denne siden er satt opp for en personlig kunstnerfortelling, men den publiserer ikke en offisiell biografi før innholdet er godkjent av kunstneren.',
      'Den endelige teksten bør beskrive Engelas egen motivasjon, bakgrunn, inspirasjon og arbeidsmåte med konkrete detaljer i stedet for generelle markedsføringspåstander.',
    ],
    processTitle: 'Hvordan jeg jobber',
    processIntro:
      'Engela bygger hvert maleri lag for lag, fra en rolig idéfase til arbeid med farger, struktur og de siste justeringene i atelieret.',
    processItems: [
      'Motivet starter ofte med stemning, farge og bevegelse før komposisjonen strammes inn.',
      'Materialer velges etter overflate og uttrykk, med rom for tekstur, transparente lag og synlige penselspor.',
      'Arbeidet vurderes underveis i naturlig lys, slik at balanse, kontrast og detaljer får tid til å lande.',
      'Når maleriet er ferdig, fotograferes og beskrives det før det legges ut for henvendelser.',
    ],
    processImages: buildProcessImages([
      {
        file: 'studio-table',
        alt: 'Arbeidsbord med pensler, maling og lerret i Engelas atelier',
        caption: 'Materialene legges frem før farge og komposisjon prøves ut.',
      },
      {
        file: 'brushes-and-palette',
        alt: 'Pensler og palett med varme akryltoner',
        caption:
          'Fargevalg bygges gradvis gjennom prøver, blanding og justering.',
      },
      {
        file: 'canvas-detail',
        alt: 'Nærbilde av tekstur og penselspor på et lerret',
        caption: 'Struktur og lag gir maleriet dybde også på nært hold.',
      },
      {
        file: 'finishing-work',
        alt: 'Kunstneren vurderer et maleri i arbeid',
        caption: 'De siste valgene handler om ro, kontrast og helhet.',
      },
    ]),
    processCarouselLabel: 'Prosessbilder',
    processPreviousLabel: 'Forrige prosessbilde',
    processNextLabel: 'Neste prosessbilde',
    processSlideStatus: (current, total) => `Bilde ${current} av ${total}`,
    contactTitle: 'Vil du spørre om et maleri?',
    contactText:
      'Bruk kontaktskjemaet for henvendelser om malerier, bestillingsverk eller andre spørsmål. Instagram kan brukes til å følge Engela Art, men kjøpsdialog bør gå via skjema eller e-post.',
    contactAction: 'Send en henvendelse',
    instagramAction: 'Besøk Instagram',
    testimonialsHeading: 'Tilbakemeldinger',
    testimonialsIntro:
      'Godkjente kundeuttalelser kan vises her når de har reell kilde og skriftlig publiseringstillatelse.',
  },
  en: {
    eyebrow: 'Engela Art',
    approvalLabel: 'Artist-approved biography pending',
    intro:
      'Engela Art will replace this temporary page copy after the artist approves the final Norwegian source text and English translation.',
    portraitAlt: 'Portrait of Engela, the artist behind Engela Art',
    storyTitle: 'The story behind the work',
    storyParagraphs: [
      'This page is prepared for a personal artist story, but it does not publish an official biography until the artist has approved the content.',
      "The final copy should describe Engela's own motivation, background, inspiration, and process with concrete details instead of generic marketing claims.",
    ],
    processTitle: 'How I work',
    processIntro:
      'Engela builds each painting layer by layer, moving from a quiet idea stage into colour, texture, and final adjustments in the studio.',
    processItems: [
      'A piece often begins with mood, colour, and movement before the composition is tightened.',
      'Materials are chosen for surface and expression, with room for texture, transparent layers, and visible brushwork.',
      'The work is checked in natural light so balance, contrast, and details have time to settle.',
      'When a painting is finished, it is photographed and described before it is published for inquiries.',
    ],
    processImages: buildProcessImages([
      {
        file: 'studio-table',
        alt: "Studio table with brushes, paint, and canvas in Engela's workspace",
        caption:
          'Materials are set out before colour and composition are explored.',
      },
      {
        file: 'brushes-and-palette',
        alt: 'Brushes and palette with warm acrylic colours',
        caption:
          'Colour choices are built through tests, mixing, and adjustment.',
      },
      {
        file: 'canvas-detail',
        alt: 'Close view of texture and brush marks on canvas',
        caption: 'Texture and layers give the painting depth up close.',
      },
      {
        file: 'finishing-work',
        alt: 'Artist reviewing a painting in progress',
        caption: 'The final choices are about calm, contrast, and wholeness.',
      },
    ]),
    processCarouselLabel: 'Process images',
    processPreviousLabel: 'Previous process image',
    processNextLabel: 'Next process image',
    processSlideStatus: (current, total) => `Image ${current} of ${total}`,
    contactTitle: 'Want to ask about a painting?',
    contactText:
      'Use the contact form for painting inquiries, commissions, or general questions. Instagram is available for following Engela Art, but purchase conversations should stay in the form or email.',
    contactAction: 'Send an inquiry',
    instagramAction: 'Visit Instagram',
    testimonialsHeading: 'Testimonials',
    testimonialsIntro:
      'Approved buyer testimonials can appear here when they have a real source and written publication permission.',
  },
}

export function getAboutContent(locale: Locale) {
  return aboutContent[locale]
}
