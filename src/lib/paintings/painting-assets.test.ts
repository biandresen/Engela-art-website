import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import sharp from 'sharp'

import { paintingCatalog } from '#/local-db/paintings'

import { verifyPaintingCatalogAssets } from './asset-policy'
import { createPaintingCatalog } from './catalog'
import type { PaintingRecord } from './types'

const root = process.cwd()
const manifestPath = resolve(
  root,
  'public/assets/paintings/manifest.generated.json',
)

type PaintingAssetManifest = {
  version: number
  paintings: Array<{
    slug: string
    watermark: {
      asset: string
      corner: string
      opacity: number
      scale: number
      margin: number
      pixelDifferenceVerified: boolean
    }
    images: Array<{
      role: 'main' | 'room-context'
      variants: Array<{
        path: string
        format: 'avif' | 'webp' | 'jpeg'
        width: number
        height: number
        sha256: string
      }>
    }>
  }>
}

describe('painting image pipeline', () => {
  it('provides hash-verified responsive watermarked derivatives for six paintings', async () => {
    const manifest = JSON.parse(
      await readFile(manifestPath, 'utf8'),
    ) as PaintingAssetManifest

    expect(manifest.version).toBe(1)
    expect(manifest.paintings).toHaveLength(6)

    for (const painting of manifest.paintings) {
      expect(painting.watermark.pixelDifferenceVerified).toBe(true)
      expect(painting.images.map((image) => image.role)).toEqual([
        'main',
        'room-context',
      ])

      for (const image of painting.images) {
        expect(
          new Set(image.variants.map((variant) => variant.width)).size,
        ).toBe(2)
        expect(image.variants).toHaveLength(6)

        for (const variant of image.variants) {
          const absolutePath = resolve(
            root,
            'public',
            variant.path.replace(/^\//, ''),
          )
          const [contents, metadata] = await Promise.all([
            readFile(absolutePath),
            sharp(absolutePath).metadata(),
          ])

          expect(createHash('sha256').update(contents).digest('hex')).toBe(
            variant.sha256,
          )
          expect(metadata.width).toBe(variant.width)
          expect(metadata.height).toBe(variant.height)
          expect(metadata.format).toBe(
            variant.format === 'avif' ? 'heif' : variant.format,
          )
        }
      }
    }
  })

  it('rejects catalog assets that are missing or not attested by the watermark manifest', async () => {
    await expect(
      verifyPaintingCatalogAssets(paintingCatalog, {
        publicRoot: resolve(root, 'public'),
        manifestPath,
      }),
    ).resolves.toBeUndefined()

    const firstPainting = paintingCatalog.all()[0]
    expect(firstPainting).toBeDefined()

    const invalidCatalog = createPaintingCatalog([
      {
        ...firstPainting,
        images: firstPainting.images.map((image, imageIndex) =>
          imageIndex === 0
            ? {
                ...image,
                variants: image.variants.map((variant, variantIndex) =>
                  variantIndex === 0
                    ? {
                        ...variant,
                        fallback:
                          '/assets/paintings/missing/unwatermarked-master.jpg',
                      }
                    : variant,
                ),
              }
            : image,
        ),
      } satisfies PaintingRecord,
    ])

    await expect(
      verifyPaintingCatalogAssets(invalidCatalog, {
        publicRoot: resolve(root, 'public'),
        manifestPath,
      }),
    ).rejects.toThrow(/missing or is not a generated watermarked derivative/)
  })
})
