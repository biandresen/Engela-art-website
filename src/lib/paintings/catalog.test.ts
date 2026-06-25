import { describe, expect, it } from 'vitest'

import {
  createPaintingCatalog,
  PaintingCatalogValidationError,
} from './catalog'
import type { PaintingRecord } from './types'

describe('painting catalog', () => {
  it('derives orientation and total face area from numeric dimensions', () => {
    const catalog = createPaintingCatalog([
      createPaintingRecord({
        widthCm: 80,
        heightCm: 40,
      }),
    ])

    expect(catalog.all()).toMatchObject([
      {
        orientation: 'landscape',
        areaCm2: 3200,
      },
    ])
  })

  it('retains responsive image variants with intrinsic dimensions', () => {
    const catalog = createPaintingCatalog([createPaintingRecord()])

    expect(catalog.all()[0]?.images[0]).toMatchObject({
      width: 640,
      height: 960,
      variants: [
        {
          width: 480,
          height: 720,
          avif: '/assets/paintings/temporary/main-480.avif',
          webp: '/assets/paintings/temporary/main-480.webp',
          fallback: '/assets/paintings/temporary/main-480.jpg',
        },
        {
          width: 640,
          height: 960,
          avif: '/assets/paintings/temporary/main-640.avif',
          webp: '/assets/paintings/temporary/main-640.webp',
          fallback: '/assets/paintings/temporary/main-640.jpg',
        },
      ],
    })
  })

  it('rejects invalid collection content with actionable validation issues', () => {
    const first = createPaintingRecord({
      paintingId: 'EA-2025-001',
      slug: 'duplicate-entry',
      medium: { no: '', en: '' },
      widthCm: 0,
      listedPriceNok: 10.5,
      images: [
        {
          role: 'detail',
          alt: { no: '', en: '' },
          width: 0,
          height: 0,
          variants: [
            {
              width: 0,
              height: 0,
              avif: '/master.png',
              webp: '/master.png',
              fallback: '/master.png',
            },
          ],
        },
      ],
      careProfiles: [
        'unknown-profile',
      ] as unknown as PaintingRecord['careProfiles'],
      featured: true,
    })
    const second = createPaintingRecord({
      paintingId: first.paintingId,
      slug: first.slug,
      featured: true,
      featuredOrder: 1,
    })
    const third = createPaintingRecord({
      paintingId: 'EA-2026-003',
      slug: 'third-entry',
      featured: true,
      featuredOrder: 1,
    })

    expect(() => createPaintingCatalog([first, second, third])).toThrow(
      PaintingCatalogValidationError,
    )

    try {
      createPaintingCatalog([first, second, third])
    } catch (error) {
      expect(error).toBeInstanceOf(PaintingCatalogValidationError)
      expect((error as PaintingCatalogValidationError).issues).toEqual(
        expect.arrayContaining([
          expect.stringContaining('year segment must match'),
          expect.stringContaining('medium.no'),
          expect.stringContaining('widthCm'),
          expect.stringContaining('listedPriceNok'),
          expect.stringContaining('main image'),
          expect.stringContaining('room-context image'),
          expect.stringContaining('careProfiles'),
          expect.stringContaining('featuredOrder is required'),
          expect.stringContaining('Duplicate painting ID'),
          expect.stringContaining('Duplicate painting slug'),
          expect.stringContaining('Duplicate featured order'),
        ]),
      )
    }
  })

  it('looks up paintings by slug and selects featured work in editorial order', () => {
    const first = createPaintingRecord({
      paintingId: 'EA-2026-001',
      slug: 'first',
      featured: true,
      featuredOrder: 2,
    })
    const second = createPaintingRecord({
      paintingId: 'EA-2026-002',
      slug: 'second',
      featured: false,
    })
    const third = createPaintingRecord({
      paintingId: 'EA-2026-003',
      slug: 'third',
      featured: true,
      featuredOrder: 1,
    })
    const catalog = createPaintingCatalog([first, second, third])

    expect(catalog.getBySlug('second')?.paintingId).toBe('EA-2026-002')
    expect(catalog.getBySlug('missing')).toBeUndefined()
    expect(catalog.featured().map((painting) => painting.slug)).toEqual([
      'third',
      'first',
    ])
  })

  it('filters combined catalog criteria and sorts with deterministic defaults', () => {
    const catalog = createPaintingCatalog([
      createPaintingRecord({
        paintingId: 'EA-2025-001',
        title: 'Zulu',
        slug: 'zulu',
        year: 2025,
        status: 'available',
        widthCm: 80,
        heightCm: 40,
        listedPriceNok: 4000,
      }),
      createPaintingRecord({
        paintingId: 'EA-2026-002',
        title: 'Beta',
        slug: 'beta',
        year: 2026,
        status: 'sold',
        widthCm: 30,
        heightCm: 60,
        listedPriceNok: 2000,
      }),
      createPaintingRecord({
        paintingId: 'EA-2026-003',
        title: 'Alpha',
        slug: 'alpha',
        year: 2026,
        status: 'available',
        widthCm: 50,
        heightCm: 50,
        listedPriceNok: 3000,
      }),
      createPaintingRecord({
        paintingId: 'EA-2024-004',
        title: 'Gamma',
        slug: 'gamma',
        year: 2024,
        status: 'available',
        widthCm: 60,
        heightCm: 30,
        listedPriceNok: 1000,
      }),
    ])

    expect(catalog.query().map((painting) => painting.slug)).toEqual([
      'alpha',
      'beta',
      'zulu',
      'gamma',
    ])
    expect(
      catalog
        .query({
          status: 'available',
          orientation: 'landscape',
          sort: 'price-asc',
        })
        .map((painting) => painting.slug),
    ).toEqual(['gamma', 'zulu'])
    expect(
      catalog.query({ sort: 'area-desc' }).map((painting) => painting.slug),
    ).toEqual(['zulu', 'alpha', 'beta', 'gamma'])
    expect(
      catalog.query({ sort: 'area-asc' }).map((painting) => painting.slug),
    ).toEqual(['beta', 'gamma', 'alpha', 'zulu'])
    expect(
      catalog.query({ sort: 'year-asc' }).map((painting) => painting.slug),
    ).toEqual(['gamma', 'zulu', 'alpha', 'beta'])
    expect(
      catalog.query({ sort: 'price-desc' }).map((painting) => painting.slug),
    ).toEqual(['zulu', 'alpha', 'beta', 'gamma'])
  })
})

function createPaintingRecord(
  overrides: Partial<PaintingRecord> = {},
): PaintingRecord {
  return {
    paintingId: 'EA-2026-001',
    metadataApproval: 'temporary',
    title: 'Temporary catalog entry 01',
    slug: 'temporary-catalog-entry-01',
    medium: {
      no: 'Midlertidig mediumtekst – avventer kunstnergodkjenning.',
      en: 'Temporary medium text — awaiting artist approval.',
    },
    visualSummary: {
      no: 'Midlertidig bildetekst – avventer kunstnergodkjenning.',
      en: 'Temporary visual summary — awaiting artist approval.',
    },
    widthCm: 40,
    heightCm: 60,
    depthCm: 2,
    year: 2026,
    listedPriceNok: 1000,
    status: 'available',
    images: [
      {
        role: 'main',
        alt: {
          no: 'Midlertidig alternativ tekst.',
          en: 'Temporary alternative text.',
        },
        width: 640,
        height: 960,
        variants: [
          {
            width: 480,
            height: 720,
            avif: '/assets/paintings/temporary/main-480.avif',
            webp: '/assets/paintings/temporary/main-480.webp',
            fallback: '/assets/paintings/temporary/main-480.jpg',
          },
          {
            width: 640,
            height: 960,
            avif: '/assets/paintings/temporary/main-640.avif',
            webp: '/assets/paintings/temporary/main-640.webp',
            fallback: '/assets/paintings/temporary/main-640.jpg',
          },
        ],
      },
      {
        role: 'room-context',
        alt: {
          no: 'Midlertidig romvisualisering.',
          en: 'Temporary room visualization.',
        },
        caption: {
          no: 'Midlertidig visualisering. Ramme og møbler følger ikke med.',
          en: 'Temporary visualization. Frame and furnishings are not included.',
        },
        width: 960,
        height: 720,
        variants: [
          {
            width: 640,
            height: 480,
            avif: '/assets/paintings/temporary/room-context-640.avif',
            webp: '/assets/paintings/temporary/room-context-640.webp',
            fallback: '/assets/paintings/temporary/room-context-640.jpg',
          },
          {
            width: 960,
            height: 720,
            avif: '/assets/paintings/temporary/room-context-960.avif',
            webp: '/assets/paintings/temporary/room-context-960.webp',
            fallback: '/assets/paintings/temporary/room-context-960.jpg',
          },
        ],
      },
    ],
    featured: false,
    careProfiles: ['acrylic'],
    ...overrides,
  }
}
