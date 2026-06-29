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
    approvalLabel: 'Anne Mari Engelsrud',
    intro:
      'Anne Mari Engelsrud er kunstneren bak Engela Art. Hun maler originale arbeider med varme, struktur og et ønske om å gi glede videre.',
    portraitAlt: 'Portrett av Anne Mari Engelsrud, kunstneren bak Engela Art',
    storyTitle: 'Historien bak kunsten',
    storyParagraphs: [
      'Anne Mari vokste opp på gård i Nannestad. Allerede tidlig var det tydelig for både henne selv og menneskene rundt henne at hun hadde en kunstnerisk side og en sterk glede ved å tegne og male.',
      'Drømmen om å male og skape har fulgt henne lenge. Etter at hun ble pensjonist, fikk hun endelig mer rom til å ta den drømmen på alvor og la kreativiteten få en større plass i hverdagen.',
      'Engela Art er bygget rundt den personlige gleden ved original kunst: arbeider som kan leve i et hjem, skape varme i et rom og gi andre noe av den samme gleden Anne Mari finner i prosessen.',
    ],
    processTitle: 'Hvordan Anne Mari jobber',
    processIntro:
      'Anne Mari bygger hvert maleri lag for lag, fra en rolig idéfase til arbeid med farger, struktur og de siste justeringene.',
    processItems: [
      'Motivet starter ofte med stemning, farge og bevegelse før komposisjonen strammes inn.',
      'Materialer velges etter overflate og uttrykk, med rom for tekstur, transparente lag og synlige penselspor.',
      'Arbeidet vurderes underveis i naturlig lys, slik at balanse, kontrast og detaljer får tid til å lande.',
      'Når maleriet er ferdig, fotograferes og beskrives det før det legges ut for henvendelser.',
    ],
    processImages: buildProcessImages([
      {
        file: 'studio-table',
        alt: 'Arbeidsbord med pensler, maling og lerret hos Anne Mari',
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
      'Når Engela Art har reelle kundeuttalelser med skriftlig publiseringstillatelse, kan de vises her.',
  },
  en: {
    eyebrow: 'Engela Art',
    approvalLabel: 'Anne Mari Engelsrud',
    intro:
      'Anne Mari Engelsrud is the artist behind Engela Art. She paints original works with warmth, texture, and a wish to pass joy on to others.',
    portraitAlt:
      'Portrait of Anne Mari Engelsrud, the artist behind Engela Art',
    storyTitle: 'The story behind the work',
    storyParagraphs: [
      'Anne Mari grew up on a farm in Nannestad. From early on, it was clear to both her and the people around her that she had an artistic side and loved drawing and painting.',
      'The dream of painting and creating stayed with her for many years. After retirement, she finally had more room to embrace that dream and give creativity a larger place in everyday life.',
      'Engela Art is built around the personal joy of original art: works that can live in a home, bring warmth to a room, and share some of the joy Anne Mari finds in the process.',
    ],
    processTitle: 'How Anne Mari works',
    processIntro:
      'Anne Mari builds each painting layer by layer, moving from a quiet idea stage into colour, texture, and final adjustments.',
    processItems: [
      'A piece often begins with mood, colour, and movement before the composition is tightened.',
      'Materials are chosen for surface and expression, with room for texture, transparent layers, and visible brushwork.',
      'The work is checked in natural light so balance, contrast, and details have time to settle.',
      'When a painting is finished, it is photographed and described before it is published for inquiries.',
    ],
    processImages: buildProcessImages([
      {
        file: 'studio-table',
        alt: "Studio table with brushes, paint, and canvas in Anne Mari's workspace",
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
      'When Engela Art has real buyer testimonials with written publication permission, they can appear here.',
  },
}

export function getAboutContent(locale: Locale) {
  return aboutContent[locale]
}
