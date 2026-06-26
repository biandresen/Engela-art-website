import { Facebook, Instagram } from 'lucide-react'
import { useRouterState } from '@tanstack/react-router'

import { env } from '#/env'
import { getFooterLabels } from '#/lib/i18n/content'
import { getLocaleFromPathname, localizedPaths } from '#/lib/i18n/routes'
import { captureAnalyticsEvent } from '#/lib/integrations/client-analytics'

export default function Footer() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const locale = getLocaleFromPathname(pathname)
  const labels = getFooterLabels(locale)
  const paths = localizedPaths[locale]

  return (
    <footer className="mt-16 bg-footer text-footer-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <div className="flex items-center gap-4">
          <picture>
            <source
              srcSet="/assets/brand/logo-footer-light.webp"
              type="image/webp"
            />
            <img
              src="/assets/brand/logo-footer-light.png"
              width="720"
              height="202"
              alt="Engela Art"
              className="h-auto w-44"
              loading="lazy"
            />
          </picture>
          <p>© {new Date().getFullYear()}</p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={env.VITE_INSTAGRAM_URL ?? 'https://www.instagram.com/'}
            target="_blank"
            rel="noreferrer"
            aria-label={labels.instagram}
            onClick={() =>
              captureAnalyticsEvent({
                name: 'outbound_link_clicked',
                language: locale,
                destination: 'instagram',
              })
            }
            className="rounded-sm hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-footer-foreground"
          >
            <Instagram aria-hidden="true" />
          </a>
          <a
            href={env.VITE_FACEBOOK_URL ?? 'https://www.facebook.com/'}
            target="_blank"
            rel="noreferrer"
            aria-label={labels.facebook}
            onClick={() =>
              captureAnalyticsEvent({
                name: 'outbound_link_clicked',
                language: locale,
                destination: 'facebook',
              })
            }
            className="rounded-sm hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-footer-foreground"
          >
            <Facebook aria-hidden="true" />
          </a>
          <a
            href={paths.contact}
            className="w-fit rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-footer-foreground"
          >
            {labels.contact}
          </a>
        </div>
      </div>
    </footer>
  )
}
