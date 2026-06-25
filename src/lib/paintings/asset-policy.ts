import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import type { PaintingCatalog } from './catalog'

type AssetPolicyOptions = {
  publicRoot: string
  manifestPath: string
}

type AssetManifest = {
  paintings: Array<{
    slug: string
    watermark: {
      pixelDifferenceVerified: boolean
    }
    images: Array<{
      variants: Array<{
        path: string
        sha256: string
      }>
    }>
  }>
}

export async function verifyPaintingCatalogAssets(
  catalog: PaintingCatalog,
  { publicRoot, manifestPath }: AssetPolicyOptions,
): Promise<void> {
  const manifest = JSON.parse(
    await readFile(manifestPath, 'utf8'),
  ) as AssetManifest
  const attestedAssets = new Map<string, string>()

  for (const painting of manifest.paintings) {
    if (!painting.watermark.pixelDifferenceVerified) {
      throw new Error(
        `Painting ${painting.slug} does not have a verified baked-in watermark`,
      )
    }

    for (const image of painting.images) {
      for (const variant of image.variants) {
        attestedAssets.set(variant.path, variant.sha256)
      }
    }
  }

  for (const painting of catalog.all()) {
    for (const image of painting.images) {
      for (const variant of image.variants) {
        await verifyVariant(variant.avif)
        await verifyVariant(variant.webp)
        await verifyVariant(variant.fallback)
      }
    }
  }

  async function verifyVariant(publicPath: string): Promise<void> {
    const expectedHash = attestedAssets.get(publicPath)

    if (!expectedHash) {
      throw new Error(
        `${publicPath} is missing or is not a generated watermarked derivative`,
      )
    }

    let contents: Buffer
    try {
      contents = await readFile(
        resolve(publicRoot, publicPath.replace(/^\//, '')),
      )
    } catch {
      throw new Error(
        `${publicPath} is missing or is not a generated watermarked derivative`,
      )
    }

    const actualHash = createHash('sha256').update(contents).digest('hex')

    if (actualHash !== expectedHash) {
      throw new Error(
        `${publicPath} does not match its generated watermarked derivative hash`,
      )
    }
  }
}
