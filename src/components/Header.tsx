import { useRouterState } from '@tanstack/react-router'

import { getNavigationLabels } from '#/lib/i18n/content'
import {
  getEquivalentLocalizedPath,
  getLocaleFromPathname,
  localizedPaths,
} from '#/lib/i18n/routes'

import { MobileNavigation } from './MobileNavigation'

export default function Header() {
  const location = useRouterState({
    select: (state) => state.location,
  })
  const locale = getLocaleFromPathname(location.pathname)
  const targetLocale = locale === 'no' ? 'en' : 'no'
  const labels = getNavigationLabels(locale)
  const paths = localizedPaths[locale]
  const navigationItems = [
    { href: paths.home, label: labels.home },
    { href: paths.paintings, label: labels.paintings },
    { href: paths.commissions, label: labels.commissions },
    { href: paths.about, label: labels.about },
    { href: paths.contact, label: labels.contact },
  ]
  const equivalentPath = getEquivalentLocalizedPath(
    location.pathname,
    location.searchStr,
    targetLocale,
  )
  const languageHref = `/api/language?${new URLSearchParams({
    locale: targetLocale,
    redirect: equivalentPath,
  })}`

  return (
    <header className="relative z-20 border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-5 sm:px-8 lg:px-12">
        <a
          href={paths.home}
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          Engela Art
        </a>

        <nav aria-label={labels.navigation} className="hidden md:block">
          <ul className="flex items-center gap-5 text-sm sm:gap-8">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={
                    location.pathname === item.href ? 'page' : undefined
                  }
                  className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring aria-[current=page]:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={languageHref}
            hrefLang={targetLocale}
            lang={targetLocale}
            className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-semibold text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {labels.switchLanguage}
          </a>
          <MobileNavigation
            items={navigationItems}
            menuLabel={labels.openMenu}
            closeLabel={labels.closeMenu}
          />
        </div>
      </div>
    </header>
  )
}
