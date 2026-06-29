import type { Locale } from '#/lib/i18n/locale'

export type FaqKey =
  | 'framing'
  | 'shipping'
  | 'pickup'
  | 'reserved-interest'
  | 'international-sales'
  | 'commissions'
  | 'response-target'
  | 'payment-methods'

export type FaqItem = {
  key: FaqKey
  id: `faq-${FaqKey}`
  question: string
  answer: string
}

const contactFaqKeys: Array<FaqKey> = [
  'response-target',
  'pickup',
  'reserved-interest',
  'commissions',
]

const faqContent: Record<
  Locale,
  Record<FaqKey, Omit<FaqItem, 'key' | 'id'>>
> = {
  no: {
    framing: {
      question: 'Er maleriene innrammet?',
      answer:
        'Nei. V1-malerier selges uten ramme. Eventuelle rammer, møbler eller rekvisitter i miljøbilder er kun illustrasjon og følger ikke med.',
    },
    shipping: {
      question: 'Er frakt inkludert i prisen?',
      answer:
        'Nei. Prisen inkluderer ikke frakt. Fraktkostnad og leveringsmåte avtales skriftlig før reservasjon, faktura eller betaling.',
    },
    pickup: {
      question: 'Kan jeg hente maleriet selv?',
      answer:
        'Ja, henting i Nannestad kan avtales. Nøyaktig hentested deles privat først etter at kjøper, tidspunkt og plan er bekreftet skriftlig.',
    },
    'reserved-interest': {
      question: 'Hvordan spør jeg om et reservert maleri?',
      answer:
        'Du kan sende en henvendelse for å bli notert på interesselisten. Det reserverer ikke maleriet og gir ingen garanti, men Engela Art bruker innsendingstidspunktet hvis en reservasjon faller bort.',
    },
    'international-sales': {
      question: 'Sender dere internasjonalt?',
      answer:
        'Internasjonale henvendelser vurderes enkeltvis. Mottakerland, emballasje, sporing, dekning, toll, importkostnader og totalpris må avklares før en eventuell avtale.',
    },
    commissions: {
      question: 'Kan jeg bestille et nytt maleri?',
      answer:
        'Du kan sende en forespørsel om et nytt maleri inspirert av Anne Maris eksisterende uttrykk. Det er ikke en automatisk bestilling, og nøyaktig kopi eller fremmede stiler loves ikke.',
    },
    'response-target': {
      question: 'Hvor raskt svarer Engela Art?',
      answer:
        'Målet er personlig svar innen to virkedager. Innsending av skjemaet oppretter ingen reservasjon, kjøp eller bestillingsavtale.',
    },
    'payment-methods': {
      question: 'Hvilke betalingsmåter kan jeg bruke?',
      answer:
        'Etter skriftlig bekreftelse sender Engela Art faktura. Betaling kan normalt gjøres med bankoverføring, Vipps Business eller PayPal Business.',
    },
  },
  en: {
    framing: {
      question: 'Are paintings framed?',
      answer:
        'No. V1 paintings are sold unframed. Any frames, furniture, or props shown in room images are illustrative only and are not included.',
    },
    shipping: {
      question: 'Is shipping included in the price?',
      answer:
        'No. Listed price excludes shipping. Shipping cost and delivery method are agreed in writing before reservation, invoice, or payment.',
    },
    pickup: {
      question: 'Can I pick up a painting?',
      answer:
        'Yes. Pickup in Nannestad can be arranged. The exact pickup location is shared privately only after the buyer, time, and plan are confirmed in writing.',
    },
    'reserved-interest': {
      question: 'How do I ask about a reserved painting?',
      answer:
        'You can send an inquiry to join the interest list. This does not reserve or guarantee the painting, but Engela Art uses submission time if a reservation is released.',
    },
    'international-sales': {
      question: 'Do you ship internationally?',
      answer:
        'International inquiries are assessed case by case. Destination, packaging, tracking, coverage, customs, import costs, and total price must be clarified before any agreement.',
    },
    commissions: {
      question: 'Can I commission a new painting?',
      answer:
        "You can inquire about a new painting inspired by Anne Mari's existing practice. This is not an automatic order, and exact copies or unrelated styles are not promised.",
    },
    'response-target': {
      question: 'How quickly will Engela Art reply?',
      answer:
        'The response target is a personal reply within two business days. Submitting the form does not create a reservation, purchase, or commission agreement.',
    },
    'payment-methods': {
      question: 'Which payment methods are available?',
      answer:
        'After written confirmation, Engela Art sends an invoice. Payment can normally be made by bank transfer, Vipps Business, or PayPal Business.',
    },
  },
}

export function getFaqItems(locale: Locale, scope: 'contact' | 'full') {
  const keys =
    scope === 'contact' ? contactFaqKeys : Object.keys(faqContent[locale])

  return keys.map((key) => {
    const faqKey = key as FaqKey

    return {
      key: faqKey,
      id: `faq-${faqKey}`,
      ...faqContent[locale][faqKey],
    } satisfies FaqItem
  })
}
