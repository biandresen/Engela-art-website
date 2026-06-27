import { getPageContent } from '#/lib/i18n/content'
import type { Locale } from '#/lib/i18n/locale'
import type { LocalizedRouteKey } from '#/lib/i18n/routes'
import { localizedPaths } from '#/lib/i18n/routes'
import { presentPainting } from '#/lib/paintings/presentation'
import type { Painting } from '#/lib/paintings/types'
import { paintingCatalog } from '#/local-db/paintings'

export type SeoPage = LocalizedRouteKey | 'painting'

export type AlternateLink = {
  hrefLang: 'no' | 'en' | 'x-default'
  href: string
}

export type OpenGraphImage = {
  url: string
  width: number
  height: number
  alt: string
}

export type PageSeo = {
  title: string
  description: string
  canonicalUrl: string
  alternates: Array<AlternateLink>
  openGraph: {
    type: 'website' | 'article'
    url: string
    title: string
    description: string
    image: OpenGraphImage
  }
  structuredData: Array<Record<string, unknown>>
}

export type SitemapEntry = {
  loc: string
  alternates: Array<AlternateLink>
}

export type SeoHead = {
  meta: Array<Record<string, string>>
  links: Array<Record<string, string>>
  scripts: Array<{ type: string; children: string }>
}

const siteOrigin = 'https://engelaart.no'

const routeKeys = [
  'home',
  'paintings',
  'commissions',
  'about',
  'contact',
  'privacy',
  'sales',
] as const satisfies ReadonlyArray<LocalizedRouteKey>

const localizedDescriptions: Record<
  Locale,
  Record<SeoPage, (painting?: Painting) => string>
> = {
  no: {
    home: () =>
      'Originale malerier fra Engela Art. Utforsk tilgjengelige arbeider, kunstnerhistorien og hvordan du kan sende en trygg forespørsel.',
    paintings: () =>
      'Utforsk originale malerier fra Engela Art med status, mål, medium, teknikk og oppgitt pris i NOK.',
    painting: (painting) =>
      painting
        ? `${painting.title} fra Engela Art. Se status, mål, medium, teknikk, pris og hvordan du kan sende en forespørsel.`
        : getPageContent('no', 'painting').intro,
    commissions: () =>
      'Les hvordan Engela Art vurderer bestillingsverk inspirert av eksisterende arbeider, med startpriser, tidslinjer og forespørsel.',
    about: () =>
      'Bli kjent med Engela og prosessen bak de originale maleriene fra Engela Art.',
    contact: () =>
      'Ta kontakt med Engela Art om malerier, interesseliste, lignende arbeider eller bestillingsverk.',
    privacy: () =>
      'Les personvernerklæringen for Engela Art om behandlingsansvar, kontaktskjema, e-post, analyse, feilovervåking, lagring, rettigheter og språkkapsel.',
    sales: () =>
      'Les vilkår og praktisk informasjon om NOK-priser, faktura, betaling, henting i Nannestad, sporbar frakt, angrerett, reklamasjon og retur hos Engela Art.',
  },
  en: {
    home: () =>
      'Original paintings by Engela Art. Explore available work, the artist story, and how to send a clear inquiry.',
    paintings: () =>
      'Explore original paintings from Engela Art with status, dimensions, medium, technique, and listed NOK prices.',
    painting: (painting) =>
      painting
        ? `${painting.title} by Engela Art. View status, dimensions, medium, technique, price, and how to send an inquiry.`
        : getPageContent('en', 'painting').intro,
    commissions: () =>
      'Learn how Engela Art reviews inspired-by commission inquiries, including starting prices, timelines, and the inquiry process.',
    about: () =>
      'Meet Engela and learn about the process behind the original paintings from Engela Art.',
    contact: () =>
      'Get in touch with Engela Art about paintings, interest lists, similar work, or commissions.',
    privacy: () =>
      'Read the Engela Art privacy notice covering controller details, inquiry email, analytics, monitoring, retention, rights, and the language cookie.',
    sales: () =>
      'Terms and practical information about NOK prices, invoice payment, Nannestad pickup, tracked shipping, withdrawal rights, complaints, and returns at Engela Art.',
  },
}

export function buildPageSeo({
  locale,
  page,
  path,
  paintingSlug,
}: {
  locale: Locale
  page: SeoPage
  path: string
  paintingSlug?: string
}): PageSeo {
  const painting =
    page === 'painting' && paintingSlug
      ? paintingCatalog.getBySlug(paintingSlug)
      : undefined
  const canonicalPath = getCanonicalPath(locale, page, painting?.slug)
  const title = getSeoTitle(locale, page, painting)
  const description = localizedDescriptions[locale][page](painting)
  const canonicalUrl = absoluteUrl(canonicalPath)
  const openGraphImage = painting
    ? getPaintingOpenGraphImage(locale, painting)
    : getDefaultOpenGraphImage()

  void path

  return {
    title,
    description,
    canonicalUrl,
    alternates: getAlternates(page, painting?.slug),
    openGraph: {
      type: painting ? 'article' : 'website',
      url: canonicalUrl,
      title,
      description,
      image: openGraphImage,
    },
    structuredData: painting ? [buildVisualArtwork(locale, painting)] : [],
  }
}

export function getSitemapEntries(): Array<SitemapEntry> {
  const pageEntries = routeKeys.flatMap((routeKey) =>
    (['no', 'en'] as const).map((locale) => ({
      loc: absoluteUrl(localizedPaths[locale][routeKey]),
      alternates: getAlternates(routeKey),
    })),
  )

  const paintingEntries = paintingCatalog.all().flatMap((painting) =>
    (['no', 'en'] as const).map((locale) => ({
      loc: absoluteUrl(getCanonicalPath(locale, 'painting', painting.slug)),
      alternates: getAlternates('painting', painting.slug),
    })),
  )

  return [...pageEntries, ...paintingEntries]
}

export function buildSitemapXml(entries = getSitemapEntries()): string {
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
${entry.alternates
  .map(
    (alternate) =>
      `    <xhtml:link rel="alternate" hreflang="${alternate.hrefLang}" href="${escapeXml(alternate.href)}" />`,
  )
  .join('\n')}
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
}

export function buildSeoHead(seo: PageSeo): SeoHead {
  return {
    meta: [
      { title: seo.title },
      {
        name: 'description',
        content: seo.description,
      },
      {
        property: 'og:type',
        content: seo.openGraph.type,
      },
      {
        property: 'og:url',
        content: seo.openGraph.url,
      },
      {
        property: 'og:title',
        content: seo.openGraph.title,
      },
      {
        property: 'og:description',
        content: seo.openGraph.description,
      },
      {
        property: 'og:image',
        content: seo.openGraph.image.url,
      },
      {
        property: 'og:image:width',
        content: String(seo.openGraph.image.width),
      },
      {
        property: 'og:image:height',
        content: String(seo.openGraph.image.height),
      },
      {
        property: 'og:image:alt',
        content: seo.openGraph.image.alt,
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: seo.canonicalUrl,
      },
      ...seo.alternates.map((alternate) => ({
        rel: 'alternate',
        hrefLang: alternate.hrefLang,
        href: alternate.href,
      })),
    ],
    scripts: seo.structuredData.map((entry) => ({
      type: 'application/ld+json',
      children: JSON.stringify(entry),
    })),
  }
}

function getSeoTitle(
  locale: Locale,
  page: SeoPage,
  painting?: Painting,
): string {
  const title = painting?.title ?? getPageContent(locale, page).title

  return `${title} | Engela Art`
}

function getCanonicalPath(
  locale: Locale,
  page: SeoPage,
  paintingSlug?: string,
): string {
  if (page === 'painting') {
    if (!paintingSlug) {
      return localizedPaths[locale].paintings
    }

    return `${localizedPaths[locale].paintings}/${paintingSlug}`
  }

  return localizedPaths[locale][page]
}

function getAlternates(
  page: SeoPage,
  paintingSlug?: string,
): Array<AlternateLink> {
  return [
    {
      hrefLang: 'no',
      href: absoluteUrl(getCanonicalPath('no', page, paintingSlug)),
    },
    {
      hrefLang: 'en',
      href: absoluteUrl(getCanonicalPath('en', page, paintingSlug)),
    },
    {
      hrefLang: 'x-default',
      href: `${siteOrigin}/`,
    },
  ]
}

function getDefaultOpenGraphImage(): OpenGraphImage {
  return {
    url: absoluteUrl('/assets/brand/og-default.jpg'),
    width: 1200,
    height: 630,
    alt: 'Engela Art palette-and-leaves brand artwork',
  }
}

function getPaintingOpenGraphImage(
  locale: Locale,
  painting: Painting,
): OpenGraphImage {
  const { mainImage } = presentPainting(locale, painting)
  const largestVariant = [...mainImage.variants].sort(
    (left, right) => right.width - left.width,
  )[0]

  return {
    url: absoluteUrl(largestVariant.fallback),
    width: largestVariant.width,
    height: largestVariant.height,
    alt: mainImage.alt[locale],
  }
}

function buildVisualArtwork(
  locale: Locale,
  painting: Painting,
): Record<string, unknown> {
  const artwork: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: painting.title,
    identifier: painting.paintingId,
    artMedium: painting.medium[locale],
    description: painting.visualSummary[locale],
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: locale === 'no' ? 'Teknikk' : 'Technique',
        value: painting.technique[locale],
      },
    ],
    dateCreated: String(painting.year),
    width: {
      '@type': 'QuantitativeValue',
      value: painting.widthCm,
      unitCode: 'CMT',
    },
    height: {
      '@type': 'QuantitativeValue',
      value: painting.heightCm,
      unitCode: 'CMT',
    },
    depth: {
      '@type': 'QuantitativeValue',
      value: painting.depthCm,
      unitCode: 'CMT',
    },
    image: getPaintingOpenGraphImage(locale, painting).url,
    url: absoluteUrl(getCanonicalPath(locale, 'painting', painting.slug)),
  }

  if (painting.status === 'available') {
    artwork.offers = {
      '@type': 'Offer',
      priceCurrency: 'NOK',
      price: painting.listedPriceNok,
      availability: 'https://schema.org/InStock',
      url: artwork.url,
    }
  }

  return artwork
}

function absoluteUrl(path: string): string {
  return new URL(path, siteOrigin).toString()
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}
