import type { Locale } from '#/lib/i18n/locale'

import type { CareProfile, Painting } from './types'

const baseline = {
  no: [
    'Hold maleriet unna vedvarende direkte sollys, høy luftfuktighet og raske temperatursvingninger.',
    'Unngå berøring av overflaten og bruk aldri vann, rengjøringsmidler eller løsemidler.',
  ],
  en: [
    'Keep the painting away from persistent direct sunlight, high humidity, and rapid temperature changes.',
    'Avoid touching the surface and never use water, household cleaners, or solvents.',
  ],
} as const

const profileGuidance: Record<CareProfile, Record<Locale, string>> = {
  acrylic: {
    no: 'Fjern støv fra akrylflater forsiktig med en ren, tørr og myk pensel.',
    en: 'Dust acrylic surfaces gently with a clean, dry, soft brush.',
  },
  'textured-surface': {
    no: 'Strukturerte flater er sårbare for trykk og hekting. Ikke bruk klut eller støvkost som kan feste seg.',
    en: 'Textured surfaces are vulnerable to pressure and snagging. Do not use cloths or dusters that can catch.',
  },
  oil: {
    no: 'Oljemalte flater skal ikke rengjøres eller fernisseres uten råd fra en kvalifisert konservator.',
    en: 'Do not clean or varnish oil-painted surfaces without advice from a qualified conservator.',
  },
  'pastel-chalk': {
    no: 'Pastell og kritt kan løsne ved berøring eller vibrasjon. Hold verket stabilt og unngå kontakt med overflaten.',
    en: 'Pastel and chalk can lift through touch or vibration. Keep the work stable and avoid surface contact.',
  },
  'glitter-delicate': {
    no: 'Glitter og andre løse detaljer må ikke børstes. Kontakt kunstneren før rengjøring.',
    en: 'Do not brush glitter or other loose details. Contact the artist before cleaning.',
  },
}

export function getCareGuidance(locale: Locale, painting: Painting) {
  return {
    label: locale === 'no' ? 'Pleieveiledning' : 'Care guidance',
    title:
      locale === 'no'
        ? 'Slik tar du vare på maleriet'
        : 'Caring for the painting',
    items: [
      ...baseline[locale],
      ...painting.careProfiles.map(
        (profile) => profileGuidance[profile][locale],
      ),
    ],
    exceptionalNote: painting.exceptionalCareNote?.[locale],
  }
}
