import { paintings } from '#/local-db/paintings'
import type { Painting } from '#/types'

export function getFeaturedPaintings(): Array<Painting> {
  return paintings.filter((painting) => painting.featured)
}
