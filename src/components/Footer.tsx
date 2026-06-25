import { Facebook, Instagram } from 'lucide-react'
import { useRouterState } from '@tanstack/react-router'

import { getFooterLabels } from '#/lib/i18n/content'
import { getLocaleFromPathname, localizedPaths } from '#/lib/i18n/routes'
import { env } from '#/env'

export default function Footer() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const locale = getLocaleFromPathname(pathname)
  const labels = getFooterLabels(locale)
  const paths = localizedPaths[locale]

  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p>© {new Date().getFullYear()} Engela Art</p>
        <div className="flex items-center gap-4">
          <a
            href={env.VITE_INSTAGRAM_URL ?? 'https://www.instagram.com/'}
            target="_blank"
            rel="noreferrer"
            aria-label={labels.instagram}
            className="rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <Instagram aria-hidden="true" />
          </a>
          <a
            href={env.VITE_FACEBOOK_URL ?? 'https://www.facebook.com/'}
            target="_blank"
            rel="noreferrer"
            aria-label={labels.facebook}
            className="rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <Facebook aria-hidden="true" />
          </a>
          <a
            href={paths.contact}
            className="w-fit underline-offset-4 hover:text-foreground hover:underline"
          >
            {labels.contact}
          </a>
        </div>
      </div>
    </footer>
  )
}
