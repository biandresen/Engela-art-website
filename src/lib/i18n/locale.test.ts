import { describe, expect, it } from 'vitest'

import {
  createLanguagePreferenceCookie,
  resolvePreferredLocale,
} from './locale'

describe('root language resolution', () => {
  it('uses an explicit valid preference before the browser language', () => {
    expect(
      resolvePreferredLocale({
        cookieHeader: 'engela-art-language=en',
        acceptLanguageHeader: 'nb-NO,nb;q=0.9,en;q=0.8',
      }),
    ).toBe('en')
  })

  it('uses the highest-priority supported browser language without a cookie', () => {
    expect(
      resolvePreferredLocale({
        acceptLanguageHeader: 'de-DE,de;q=0.9,en;q=0.8,nb;q=0.7',
      }),
    ).toBe('en')
  })

  it('ignores invalid preferences and falls back to Norwegian', () => {
    expect(
      resolvePreferredLocale({
        cookieHeader: 'engela-art-language=de',
        acceptLanguageHeader: 'de-DE,de;q=0.9',
      }),
    ).toBe('no')
  })

  it('ignores malformed cookie encoding instead of failing the request', () => {
    expect(
      resolvePreferredLocale({
        cookieHeader: 'engela-art-language=%E0%A4%A',
        acceptLanguageHeader: 'en-US',
      }),
    ).toBe('en')
  })
})

describe('language preference cookie', () => {
  it('is server-readable for one year with production-safe attributes', () => {
    expect(createLanguagePreferenceCookie('en', true)).toBe(
      'engela-art-language=en; Max-Age=31536000; Path=/; SameSite=Lax; Secure',
    )
  })
})
