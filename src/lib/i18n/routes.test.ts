import { describe, expect, it } from 'vitest'

import {
  getEquivalentLocalizedPath,
  getLocaleFromPathname,
  isSafeLocalizedRedirect,
  localizedPaths,
} from './routes'

describe('localized route switching', () => {
  it('defines both language trees for every public shell destination', () => {
    expect(localizedPaths.no).toEqual({
      home: '/no',
      paintings: '/no/malerier',
      commissions: '/no/bestillingsverk',
      about: '/no/om',
      contact: '/no/kontakt',
      privacy: '/no/personvern',
      sales: '/no/salg-og-retur',
    })
    expect(localizedPaths.en).toEqual({
      home: '/en',
      paintings: '/en/paintings',
      commissions: '/en/commissions',
      about: '/en/about',
      contact: '/en/contact',
      privacy: '/en/privacy',
      sales: '/en/sales-and-returns',
    })
  })

  it('preserves a painting slug and gallery query state', () => {
    expect(
      getEquivalentLocalizedPath(
        '/no/malerier/sommer',
        '?status=available&sort=price-asc',
        'en',
      ),
    ).toBe('/en/paintings/sommer?status=available&sort=price-asc')
  })

  it('maps translated static route segments', () => {
    expect(getEquivalentLocalizedPath('/en/sales-and-returns', '', 'no')).toBe(
      '/no/salg-og-retur',
    )
  })

  it('detects the explicit locale without consulting preferences', () => {
    expect(getLocaleFromPathname('/en/contact')).toBe('en')
    expect(getLocaleFromPathname('/no/kontakt')).toBe('no')
  })

  it('rejects external and cross-locale language redirects', () => {
    expect(isSafeLocalizedRedirect('https://example.com', 'en')).toBe(false)
    expect(isSafeLocalizedRedirect('/no/malerier', 'en')).toBe(false)
    expect(isSafeLocalizedRedirect('/en/paintings?status=sold', 'en')).toBe(
      true,
    )
  })
})
