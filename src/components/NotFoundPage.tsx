import { useRouterState } from '@tanstack/react-router'

import { getLocaleFromPathname, localizedPaths } from '#/lib/i18n/routes'

export function NotFoundPage() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const locale = getLocaleFromPathname(pathname)
  const paths = localizedPaths[locale]
  const content =
    locale === 'no'
      ? {
          title: 'Siden finnes ikke',
          intro: 'Lenken kan være feil eller siden kan ha blitt flyttet.',
          gallery: 'Se alle malerier',
          home: 'Gå til forsiden',
        }
      : {
          title: 'Page not found',
          intro: 'The link may be incorrect or the page may have moved.',
          gallery: 'View all paintings',
          home: 'Go to the home page',
        }

  return (
    <main className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-12">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-muted-foreground">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          {content.title}
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">{content.intro}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={paths.paintings}
            className="inline-flex min-h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {content.gallery}
          </a>
          <a
            href={paths.home}
            className="inline-flex min-h-11 items-center rounded-md border border-border px-5 text-sm font-semibold hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {content.home}
          </a>
        </div>
      </div>
    </main>
  )
}
