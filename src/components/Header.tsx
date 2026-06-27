import { useRouterState } from '@tanstack/react-router'
import { Home, Images, Languages, Mail, Paintbrush, User } from 'lucide-react'

import { getNavigationLabels } from '#/lib/i18n/content'
import {
  getEquivalentLocalizedPath,
  getLocaleFromPathname,
  localizedPaths,
} from '#/lib/i18n/routes'
import { captureAnalyticsEvent } from '#/lib/integrations/client-analytics'

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
    { href: paths.home, label: labels.home, icon: Home },
    { href: paths.paintings, label: labels.paintings, icon: Images },
    { href: paths.commissions, label: labels.commissions, icon: Paintbrush },
    { href: paths.about, label: labels.about, icon: User },
    { href: paths.contact, label: labels.contact, icon: Mail },
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
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:gap-6 sm:px-8 lg:px-12">
        <a
          href={paths.home}
          aria-label="Engela Art"
          className="block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <picture>
            <source
              srcSet="/assets/brand/logo-header-dark.webp"
              type="image/webp"
            />
            <img
              src="/assets/brand/logo-header-dark.png"
              width="720"
              height="202"
              alt="Engela Art"
              className="h-auto w-28 sm:w-52"
            />
          </picture>
        </a>

        <nav aria-label={labels.navigation} className="hidden md:block">
          <ul className="flex items-center gap-5 text-sm lg:gap-8">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={
                    location.pathname === item.href ? 'page' : undefined
                  }
                  className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring aria-[current=page]:text-foreground"
                >
                  <item.icon
                    aria-hidden="true"
                    focusable="false"
                    className="mr-1.5 inline size-3.5 align-[-0.125em]"
                    strokeWidth={1.75}
                  />
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
            onClick={() =>
              captureAnalyticsEvent({
                name: 'language_selected',
                from: locale,
                to: targetLocale,
              })
            }
            className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Languages
              aria-hidden="true"
              focusable="false"
              className="size-4 shrink-0 text-muted-foreground"
              strokeWidth={1.75}
            />
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
