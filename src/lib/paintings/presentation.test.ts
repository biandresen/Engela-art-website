import { describe, expect, it } from 'vitest'

import { getPaintingStatusClassName } from './presentation'

describe('painting presentation', () => {
  it('uses distinct accessible status flag treatments', () => {
    expect(getPaintingStatusClassName('available')).toBe(
      'border-2 border-available bg-available/10 text-available',
    )
    expect(getPaintingStatusClassName('reserved')).toBe(
      'border-2 border-reserved bg-reserved/14 text-reserved',
    )
    expect(getPaintingStatusClassName('sold')).toBe(
      'border-2 border-sold bg-sold/10 text-sold',
    )
  })
})
