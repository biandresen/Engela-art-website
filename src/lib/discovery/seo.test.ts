import { describe, expect, it } from 'vitest'

import { buildPageSeo, buildSitemapXml, getSitemapEntries } from './seo'

describe('SEO discovery metadata', () => {
  it('builds localized canonical metadata and reciprocal alternates for normal pages', () => {
    const metadata = buildPageSeo({
      locale: 'en',
      page: 'contact',
      path: '/en/contact?type=painting&painting=temporary-painting-01',
    })

    expect(metadata.title).toBe('Contact | Engela Art')
    expect(metadata.description).toContain('Get in touch with Engela Art')
    expect(metadata.canonicalUrl).toBe('https://engelaart.no/en/contact')
    expect(metadata.openGraph.url).toBe('https://engelaart.no/en/contact')
    expect(metadata.openGraph.image.url).toBe(
      'https://engelaart.no/assets/brand/og-default.jpg',
    )
    expect(metadata.alternates).toEqual([
      {
        hrefLang: 'no',
        href: 'https://engelaart.no/no/kontakt',
      },
      {
        hrefLang: 'en',
        href: 'https://engelaart.no/en/contact',
      },
      {
        hrefLang: 'x-default',
        href: 'https://engelaart.no/',
      },
    ])
    expect(metadata.structuredData).toEqual([])
  })

  it('points filtered gallery metadata to the base gallery canonical URL', () => {
    const metadata = buildPageSeo({
      locale: 'no',
      page: 'paintings',
      path: '/no/malerier?status=available&orientation=landscape&sort=price-desc',
    })

    expect(metadata.title).toBe('Malerier | Engela Art')
    expect(metadata.canonicalUrl).toBe('https://engelaart.no/no/malerier')
    expect(metadata.alternates.map((alternate) => alternate.href)).toEqual([
      'https://engelaart.no/no/malerier',
      'https://engelaart.no/en/paintings',
      'https://engelaart.no/',
    ])
  })

  it('describes the expanded legal pages without adding extra canonical routes', () => {
    const privacy = buildPageSeo({
      locale: 'no',
      page: 'privacy',
      path: '/no/personvern',
    })
    const sales = buildPageSeo({
      locale: 'en',
      page: 'sales',
      path: '/en/sales-and-returns',
    })

    expect(privacy.title).toBe('Personvernerklæring | Engela Art')
    expect(privacy.description).toContain('behandlingsansvar')
    expect(privacy.description).toContain('språkkapsel')
    expect(privacy.canonicalUrl).toBe('https://engelaart.no/no/personvern')
    expect(sales.title).toBe('Sales, terms, and returns | Engela Art')
    expect(sales.description).toContain('NOK prices')
    expect(sales.description).toContain('Nannestad pickup')
    expect(sales.description).toContain('tracked shipping')
    expect(sales.canonicalUrl).toBe('https://engelaart.no/en/sales-and-returns')
  })

  it('emits truthful VisualArtwork data and available-only offers for paintings', () => {
    const available = buildPageSeo({
      locale: 'en',
      page: 'painting',
      path: '/en/paintings/temporary-painting-01',
      paintingSlug: 'temporary-painting-01',
    })
    const sold = buildPageSeo({
      locale: 'en',
      page: 'painting',
      path: '/en/paintings/temporary-painting-03',
      paintingSlug: 'temporary-painting-03',
    })

    expect(available.title).toBe('Jordvarme | Engela Art')
    expect(available.openGraph.type).toBe('article')
    expect(available.openGraph.image.url).toBe(
      'https://engelaart.no/assets/paintings/temporary-painting-01/main-960.jpg',
    )
    expect(available.structuredData).toHaveLength(1)
    expect(available.structuredData[0]).toMatchObject({
      '@type': 'VisualArtwork',
      name: 'Jordvarme',
      identifier: 'EA-2026-001',
      artMedium: 'Acrylic and texture paste on canvas.',
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Technique',
          value:
            'Layered brushwork, palette-knife marks, and built-up texture.',
        },
      ],
      offers: {
        '@type': 'Offer',
        priceCurrency: 'NOK',
        price: 1000,
        availability: 'https://schema.org/InStock',
      },
    })

    expect(sold.structuredData).toHaveLength(1)
    expect(sold.structuredData[0]).toMatchObject({
      '@type': 'VisualArtwork',
      name: 'Stille glede',
    })
    expect(sold.structuredData[0]).not.toHaveProperty('offers')
  })

  it('generates one sitemap for canonical public pages without query or private states', () => {
    const entries = getSitemapEntries()
    const locations = entries.map((entry) => entry.loc)

    expect(locations).toContain('https://engelaart.no/no')
    expect(locations).toContain('https://engelaart.no/en')
    expect(locations).toContain('https://engelaart.no/no/malerier')
    expect(locations).toContain('https://engelaart.no/en/paintings')
    expect(locations).toContain('https://engelaart.no/no/personvern')
    expect(locations).toContain('https://engelaart.no/en/privacy')
    expect(locations).toContain('https://engelaart.no/no/salg-og-retur')
    expect(locations).toContain('https://engelaart.no/en/sales-and-returns')
    expect(locations).toContain(
      'https://engelaart.no/no/malerier/temporary-painting-01',
    )
    expect(locations).toContain(
      'https://engelaart.no/en/paintings/temporary-painting-03',
    )
    expect(locations.some((location) => location.includes('?'))).toBe(false)
    expect(locations.some((location) => location.includes('success'))).toBe(
      false,
    )
    expect(locations.some((location) => location.includes('preview'))).toBe(
      false,
    )
    expect(locations.some((location) => location.includes('private'))).toBe(
      false,
    )
    expect(locations.some((location) => location.includes('terms'))).toBe(false)
    expect(locations.some((location) => location.includes('payment'))).toBe(
      false,
    )

    const paintingEntry = entries.find((entry) =>
      entry.loc.endsWith('/en/paintings/temporary-painting-01'),
    )

    expect(paintingEntry?.alternates).toEqual([
      {
        hrefLang: 'no',
        href: 'https://engelaart.no/no/malerier/temporary-painting-01',
      },
      {
        hrefLang: 'en',
        href: 'https://engelaart.no/en/paintings/temporary-painting-01',
      },
      {
        hrefLang: 'x-default',
        href: 'https://engelaart.no/',
      },
    ])

    const xml = buildSitemapXml(entries)

    expect(xml).toContain('<loc>https://engelaart.no/en/paintings</loc>')
    expect(xml).toContain(
      '<xhtml:link rel="alternate" hreflang="no" href="https://engelaart.no/no/malerier" />',
    )
    expect(xml).not.toContain('status=')
  })
})
