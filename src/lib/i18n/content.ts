import type { Locale } from './locale'
import type { LocalizedRouteKey } from './routes'

const navigation = {
  no: {
    navigation: 'Hovednavigasjon',
    home: 'Hjem',
    paintings: 'Malerier',
    commissions: 'Bestillingsverk',
    about: 'Om',
    contact: 'Kontakt',
    switchLanguage: 'English',
    openMenu: 'Åpne meny',
    closeMenu: 'Lukk meny',
  },
  en: {
    navigation: 'Main navigation',
    home: 'Home',
    paintings: 'Paintings',
    commissions: 'Commissions',
    about: 'About',
    contact: 'Contact',
    switchLanguage: 'Norsk',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
} as const

const pageContent: Record<
  Locale,
  Record<LocalizedRouteKey | 'painting', { title: string; intro: string }>
> = {
  no: {
    home: {
      title: 'Original kunst av Anne Mari Engelsrud',
      intro: 'Oppdag malerier og kunstneren bak Engela Art.',
    },
    paintings: {
      title: 'Malerier',
      intro: 'Utforsk originale malerier fra Engela Art.',
    },
    painting: {
      title: 'Maleri',
      intro: 'Se detaljer om dette originale maleriet.',
    },
    commissions: {
      title: 'Bestillingsverk',
      intro: 'Les om muligheten for et maleri inspirert av Anne Maris uttrykk.',
    },
    about: {
      title: 'Om Anne Mari',
      intro: 'Bli kjent med kunstneren og prosessen bak arbeidene.',
    },
    contact: {
      title: 'Kontakt',
      intro: 'Ta kontakt med Engela Art.',
    },
    privacy: {
      title: 'Personvernerklæring',
      intro: 'Informasjon om hvordan Engela Art behandler personopplysninger.',
    },
    sales: {
      title: 'Salg, vilkår og retur',
      intro: 'Informasjon om vilkår, betaling, levering og retur.',
    },
  },
  en: {
    home: {
      title: 'Original art by Anne Mari Engelsrud',
      intro: 'Discover paintings and the artist behind Engela Art.',
    },
    paintings: {
      title: 'Paintings',
      intro: 'Explore original paintings from Engela Art.',
    },
    painting: {
      title: 'Painting',
      intro: 'View details about this original painting.',
    },
    commissions: {
      title: 'Commissions',
      intro: "Learn about paintings inspired by Anne Mari's artistic practice.",
    },
    about: {
      title: 'About Anne Mari',
      intro: 'Meet the artist and learn about her creative process.',
    },
    contact: {
      title: 'Contact',
      intro: 'Get in touch with Engela Art.',
    },
    privacy: {
      title: 'Privacy',
      intro: 'How Engela Art processes personal information.',
    },
    sales: {
      title: 'Sales, terms, and returns',
      intro: 'Information about terms, payment, delivery, and returns.',
    },
  },
}

export function getNavigationLabels(locale: Locale) {
  return navigation[locale]
}

export function getPageContent(
  locale: Locale,
  page: LocalizedRouteKey | 'painting',
) {
  return pageContent[locale][page]
}

export function getFooterLabels(locale: Locale) {
  return locale === 'no'
    ? {
        navigation: 'Bunnnavigasjon',
        navigationHeading: 'Utforsk',
        legalAndContact: 'Juridiske lenker og kontakt',
        legalAndContactHeading: 'Praktisk',
        follow: 'Følg Engela Art',
        brandSummary:
          'Originale malerier, bestillingsverk og kunst direkte fra Engela Art.',
        home: 'Hjem',
        paintings: 'Malerier',
        commissions: 'Bestillingsverk',
        about: 'Om',
        privacy: 'Personvernerklæring',
        sales: 'Salg, vilkår og retur',
        email: 'Send e-post til Engela Art',
        emailAddress: 'kontakt@engelaart.no',
        instagram: 'Engela Art på Instagram',
        contact: 'Kontakt',
        copyrightOwner: 'Art by Engela Art.',
        copyrightWarning:
          'Alt innhold og alle kunstverk er beskyttet av opphavsrett og må ikke brukes eller kopieres uten skriftlig tillatelse fra Engela Art.',
      }
    : {
        navigation: 'Footer navigation',
        navigationHeading: 'Explore',
        legalAndContact: 'Legal and contact links',
        legalAndContactHeading: 'Practical',
        follow: 'Follow Engela Art',
        brandSummary:
          'Original paintings, commissions, and artwork directly from Engela Art.',
        home: 'Home',
        paintings: 'Paintings',
        commissions: 'Commissions',
        about: 'About',
        privacy: 'Privacy',
        sales: 'Sales, terms, and returns',
        email: 'Email Engela Art',
        emailAddress: 'kontakt@engelaart.no',
        instagram: 'Engela Art on Instagram',
        contact: 'Contact',
        copyrightOwner: 'Art by Engela Art.',
        copyrightWarning:
          'All content and artworks are protected by copyright and may not be used or copied without written permission from Engela Art.',
      }
}
