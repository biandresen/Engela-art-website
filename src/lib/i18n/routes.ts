import type { Locale } from './locale'

export type LocalizedRouteKey =
  | 'home'
  | 'paintings'
  | 'commissions'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'sales'

export const localizedPaths: Record<
  Locale,
  Record<LocalizedRouteKey, string>
> = {
  no: {
    home: '/no',
    paintings: '/no/malerier',
    commissions: '/no/bestillingsverk',
    about: '/no/om',
    contact: '/no/kontakt',
    privacy: '/no/personvern',
    sales: '/no/salg-og-retur',
  },
  en: {
    home: '/en',
    paintings: '/en/paintings',
    commissions: '/en/commissions',
    about: '/en/about',
    contact: '/en/contact',
    privacy: '/en/privacy',
    sales: '/en/sales-and-returns',
  },
}

export function getLocaleFromPathname(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'no'
}

export function getEquivalentLocalizedPath(
  pathname: string,
  search: string,
  targetLocale: Locale,
): string {
  const sourceLocale = getLocaleFromPathname(pathname)
  const sourcePaintingPath = `${localizedPaths[sourceLocale].paintings}/`

  if (pathname.startsWith(sourcePaintingPath)) {
    const slug = pathname.slice(sourcePaintingPath.length)

    return `${localizedPaths[targetLocale].paintings}/${slug}${search}`
  }

  const routeEntry = Object.entries(localizedPaths[sourceLocale]).find(
    ([, path]) => path === pathname,
  )
  const routeKey = routeEntry?.[0] as LocalizedRouteKey | undefined

  return `${localizedPaths[targetLocale][routeKey ?? 'home']}${search}`
}

export function isSafeLocalizedRedirect(
  redirectPath: string,
  locale: Locale,
): boolean {
  if (!redirectPath.startsWith('/') || redirectPath.startsWith('//')) {
    return false
  }

  try {
    const url = new URL(redirectPath, 'https://engelaart.no')

    return getLocaleFromPathname(url.pathname) === locale
  } catch {
    return false
  }
}
