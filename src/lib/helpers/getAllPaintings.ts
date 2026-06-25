import { paintings } from '#/local-db/paintings'
import type { Painting } from '#/types'

export function getAllPaintings(): Array<Painting> {
  return paintings
}
