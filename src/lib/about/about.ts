import type { Locale } from '#/lib/i18n/locale'

type AboutContent = {
  eyebrow: string
  approvalLabel: string
  intro: string
  portraitAlt: string
  storyTitle: string
  storyParagraphs: Array<string>
  processTitle: string
  processItems: Array<string>
  contactTitle: string
  contactText: string
  contactAction: string
  instagramAction: string
  testimonialsHeading: string
  testimonialsIntro: string
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
    processTitle: 'Prosess og innhold som må godkjennes',
    processItems: [
      'førstepersonstekst om hvorfor Engela maler',
      'konkrete detaljer om materialer, motivasjon og arbeidsprosess',
      'eventuell bakgrunn, utstillinger eller erfaring som kunstneren vil publisere',
      'norsk kildetekst og engelsk oversettelse kontrollert mot samme mening',
    ],
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
    processTitle: 'Process and content awaiting approval',
    processItems: [
      'first-person copy about why Engela paints',
      'specific details about materials, motivation, and working process',
      'any background, exhibitions, or experience the artist wants to publish',
      'Norwegian source copy and an English translation checked against the same meaning',
    ],
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
