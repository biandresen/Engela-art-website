import { describe, expect, it } from 'vitest'

import { paintingCatalog } from '#/local-db/paintings'

describe('complete painting collection', () => {
  it('validates all six public catalog entries as one collection', () => {
    const paintings = paintingCatalog.all()

    expect(paintings).toHaveLength(6)
    expect(new Set(paintings.map((painting) => painting.paintingId)).size).toBe(
      6,
    )
    expect(new Set(paintings.map((painting) => painting.slug)).size).toBe(6)

    for (const painting of paintings) {
      expect(painting.metadataApproval).toBe('artist-approved')
      expect(painting.title.trim()).not.toBe('')
      expect(painting.technique.no).toContain('Lagvis arbeid')
      expect(painting.technique.en).toContain('Layered brushwork')
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
