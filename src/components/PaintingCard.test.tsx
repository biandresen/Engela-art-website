// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { PaintingCard } from './PaintingCard'
import type { PaintingPresentation } from '#/lib/paintings/presentation'
import type { Painting, PaintingImage } from '#/lib/paintings/types'

afterEach(cleanup)

describe('painting card', () => {
  it('groups painting image, title, status, metadata, and price in one card', () => {
    render(
      <PaintingCard
        presentation={presentation}
        locale="en"
        href="/en/paintings/example"
        headingLevel={2}
        imageSizes="100vw"
        metadataNotice="Original painting from Engela Art"
        showFullMetadata
      />,
    )

    const card = screen.getByRole('article')
    const link = within(card).getByRole('link')

    expect(link.getAttribute('href')).toBe('/en/paintings/example')
    expect(
      within(card).getByRole('img', { name: 'Main artwork view' }),
    ).toBeTruthy()
    expect(
      within(card).getByRole('img', { name: 'Room-context preview' }),
    ).toBeTruthy()
    expect(within(card).getByRole('heading', { level: 2 }).textContent).toBe(
      'Example painting',
    )
    expect(card.textContent).toContain('Available')
    expect(card.textContent).toContain('Acrylic on canvas')
    expect(card.textContent).toContain('Layered palette knife texture')
    expect(card.textContent).toContain('2026 · 40 × 50 × 2 cm')
    expect(card.textContent).toContain('Price: NOK 4,500')
    expect(card.textContent).toContain('Original painting from Engela Art')
    expect(card.textContent).toContain(
      'Room image is illustrative. Frame and furnishings are not included.',
    )
  })

  it('falls back to the main image when no room-context image exists', () => {
    render(
      <PaintingCard
        presentation={{
          ...presentation,
          roomContextImage: undefined,
        }}
        locale="en"
        href="/en/paintings/example"
        headingLevel={3}
        imageSizes="100vw"
        metadataNotice="Original painting from Engela Art"
      />,
    )

    const card = screen.getByRole('article')

    expect(within(card).getAllByRole('img')).toHaveLength(1)
    expect(
      within(card).getByRole('img', { name: 'Main artwork view' }),
    ).toBeTruthy()
    expect(within(card).getByRole('heading', { level: 3 }).textContent).toBe(
      'Example painting',
    )
    expect(card.textContent).toContain('Price: NOK 4,500')
  })
})

const mainImage = createImage('main', 'Main artwork view')
const roomContextImage = createImage('room-context', 'Room-context preview')

const painting: Painting = {
  paintingId: 'EA-2026-999',
  metadataApproval: 'artist-approved',
  title: 'Example painting',
  slug: 'example',
  medium: {
    no: 'Akryl på lerret',
    en: 'Acrylic on canvas',
  },
  technique: {
    no: 'Lagvis palettknivstruktur',
    en: 'Layered palette knife texture',
  },
  visualSummary: {
    no: 'Eksempeltekst',
    en: 'Example text',
  },
  widthCm: 40,
  heightCm: 50,
  depthCm: 2,
  year: 2026,
  listedPriceNok: 4500,
  status: 'available',
  images: [mainImage, roomContextImage],
  featured: false,
  careProfiles: ['acrylic'],
  orientation: 'portrait',
  areaCm2: 2000,
}

const presentation: PaintingPresentation = {
  painting,
  mainImage,
  roomContextImage,
  statusLabel: 'Available',
  priceLabel: 'Price: NOK 4,500',
}

function createImage(
  role: PaintingImage['role'],
  englishAlt: string,
): PaintingImage {
  return {
    role,
    alt: {
      no: englishAlt,
      en: englishAlt,
    },
    caption:
      role === 'room-context'
        ? {
            no: 'Room image is illustrative. Frame and furnishings are not included.',
            en: 'Room image is illustrative. Frame and furnishings are not included.',
          }
        : undefined,
    width: 960,
    height: 1200,
    variants: [
      {
        width: 480,
        height: 600,
        avif: `/assets/paintings/example/${role}-480.avif`,
        webp: `/assets/paintings/example/${role}-480.webp`,
        fallback: `/assets/paintings/example/${role}-480.jpg`,
      },
      {
        width: 960,
        height: 1200,
        avif: `/assets/paintings/example/${role}-960.avif`,
        webp: `/assets/paintings/example/${role}-960.webp`,
        fallback: `/assets/paintings/example/${role}-960.jpg`,
      },
    ],
  }
}
