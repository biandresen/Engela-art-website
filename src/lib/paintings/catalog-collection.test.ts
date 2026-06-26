import { describe, expect, it } from 'vitest'

import { paintingCatalog } from '#/local-db/paintings'

describe('complete painting collection', () => {
  it('validates all six temporary catalog entries as one collection', () => {
    const paintings = paintingCatalog.all()

    expect(paintings).toHaveLength(6)
    expect(new Set(paintings.map((painting) => painting.paintingId)).size).toBe(
      6,
    )
    expect(new Set(paintings.map((painting) => painting.slug)).size).toBe(6)

    for (const painting of paintings) {
      expect(painting.metadataApproval).toBe('temporary')
      expect(painting.title).toMatch(/^Temporary painting 0[1-6]$/)
      expect(painting.technique.no).toContain('Midlertidig teknikktekst')
      expect(painting.technique.en).toContain('Temporary technique text')
      expect(painting.images.map((image) => image.role)).toEqual([
        'main',
        'room-context',
      ])
      expect(
        painting.images.every((image) => image.variants.length === 2),
      ).toBe(true)
    }
  })
})
