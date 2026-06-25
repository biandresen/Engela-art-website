export const locales = ['no', 'en'] as const

export type Locale = (typeof locales)[number]

export const LANGUAGE_COOKIE_NAME = 'engela-art-language'
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

type LanguageRequest = {
  cookieHeader?: string
  acceptLanguageHeader?: string
}

export function resolvePreferredLocale({
  cookieHeader,
  acceptLanguageHeader,
}: LanguageRequest): Locale {
  return (
    readLanguageCookie(cookieHeader) ??
    readPreferredBrowserLanguage(acceptLanguageHeader) ??
    'no'
  )
}

export function isLocale(value: string | undefined): value is Locale {
  return locales.some((locale) => locale === value)
}

export function createLanguagePreferenceCookie(
  locale: Locale,
  isSecure: boolean,
): string {
  const secure = isSecure ? '; Secure' : ''

  return `${LANGUAGE_COOKIE_NAME}=${locale}; Max-Age=${LANGUAGE_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`
}

function readLanguageCookie(header?: string): Locale | undefined {
  if (!header) {
    return undefined
  }

  for (const cookie of header.split(/;\s*/)) {
    const separatorIndex = cookie.indexOf('=')

    if (separatorIndex === -1) {
      continue
    }

    const name = cookie.slice(0, separatorIndex)
    const value = safelyDecodeCookieValue(cookie.slice(separatorIndex + 1))

    if (name === LANGUAGE_COOKIE_NAME && isLocale(value)) {
      return value
    }
  }

  return undefined
}

function safelyDecodeCookieValue(value: string): string | undefined {
  try {
    return decodeURIComponent(value)
  } catch {
    return undefined
  }
}

function readPreferredBrowserLanguage(header?: string): Locale | undefined {
  if (!header) {
    return undefined
  }

  const preferences = header
    .split(',')
    .map((part, index) => {
      const [language = '', ...parameters] = part.trim().split(';')
      const qualityParameter = parameters.find((parameter) =>
        parameter.trim().startsWith('q='),
      )
      const quality = qualityParameter
        ? Number(qualityParameter.trim().slice(2))
        : 1

      return {
        language: language.toLowerCase(),
        quality: Number.isFinite(quality) ? quality : 0,
        index,
      }
    })
    .sort(
      (left, right) => right.quality - left.quality || left.index - right.index,
    )

  for (const preference of preferences) {
    if (preference.quality <= 0) {
      continue
    }

    const primaryLanguage = preference.language.split('-')[0]

    if (primaryLanguage === 'en') {
      return 'en'
    }

    if (
      primaryLanguage === 'no' ||
      primaryLanguage === 'nb' ||
      primaryLanguage === 'nn'
    ) {
      return 'no'
    }
  }

  return undefined
}
