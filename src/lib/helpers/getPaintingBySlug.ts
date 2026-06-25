import { paintings } from '#/local-db/paintings'
import type { Painting } from '#/types'

export function getPaintingBySlug(slug: string): Painting | undefined {
  return paintings.find((painting) => painting.slug === slug)
}
