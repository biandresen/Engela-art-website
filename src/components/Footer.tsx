import { Facebook, Instagram, Mail } from 'lucide-react'
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
  const navigationLinks = [
    { href: paths.home, label: labels.home },
    { href: paths.paintings, label: labels.paintings },
    { href: paths.commissions, label: labels.commissions },
    { href: paths.about, label: labels.about },
    { href: paths.contact, label: labels.contact },
  ]
  const legalLinks = [
    { href: paths.privacy, label: labels.privacy },
    { href: paths.sales, label: labels.sales },
  ]
  const textLinkClass =
    'w-fit rounded-sm underline-offset-4 transition hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-footer-foreground'
  const iconLinkClass =
    'inline-flex size-10 items-center justify-center rounded-md border border-footer-foreground/25 bg-footer-foreground/10 transition hover:border-footer-foreground/50 hover:bg-footer-foreground/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-footer-foreground'

  return (
    <footer className="mt-16 border-t border-primary/35 bg-footer text-footer-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 text-sm sm:px-8 lg:grid-cols-[1.25fr_1fr_1fr] lg:px-12">
        <div className="max-w-sm">
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
              className="h-auto w-56"
              loading="lazy"
            />
          </picture>
          <p className="mt-4 leading-6 text-footer-foreground/80">
            {labels.brandSummary}
          </p>
        </div>

        <nav aria-label={labels.navigation}>
          <h2 className="text-xs font-semibold tracking-[0.12em] text-footer-foreground/70 uppercase">
            {labels.navigationHeading}
          </h2>
          <ul className="mt-4 grid gap-3">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={textLinkClass}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid gap-8">
          <nav aria-label={labels.legalAndContact}>
            <h2 className="text-xs font-semibold tracking-[0.12em] text-footer-foreground/70 uppercase">
              {labels.legalAndContactHeading}
            </h2>
            <ul className="mt-4 grid gap-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={textLinkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${labels.emailAddress}`}
                  aria-label={labels.email}
                  onClick={() =>
                    captureAnalyticsEvent({
                      name: 'outbound_link_clicked',
                      language: locale,
                      destination: 'email',
                    })
                  }
                  className={`${textLinkClass} inline-flex items-center gap-2`}
                >
                  <Mail aria-hidden="true" className="size-4" />
                  {labels.emailAddress}
                </a>
              </li>
            </ul>
          </nav>

          {(env.VITE_INSTAGRAM_URL || env.VITE_FACEBOOK_URL) && (
            <nav aria-label={labels.follow}>
              <h2 className="text-xs font-semibold tracking-[0.12em] text-footer-foreground/70 uppercase">
                {labels.follow}
              </h2>
              <div className="mt-4 flex gap-3">
                {env.VITE_INSTAGRAM_URL && (
                  <a
                    href={env.VITE_INSTAGRAM_URL}
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
                    className={iconLinkClass}
                  >
                    <Instagram aria-hidden="true" className="size-5" />
                  </a>
                )}
                {env.VITE_FACEBOOK_URL && (
                  <a
                    href={env.VITE_FACEBOOK_URL}
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
                    className={iconLinkClass}
                  >
                    <Facebook aria-hidden="true" className="size-5" />
                  </a>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>

      <div className="border-t border-footer-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs leading-5 text-footer-foreground/75 sm:px-8 lg:px-12">
          <p>
            © {new Date().getFullYear()} {labels.copyrightOwner}
          </p>
          <p>{labels.copyrightWarning}</p>
        </div>
      </div>
    </footer>
  )
}
