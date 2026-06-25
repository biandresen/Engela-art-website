import type { Locale } from '#/lib/i18n/locale'
import type { LocalizedRouteKey } from '#/lib/i18n/routes'
import { getPageContent } from '#/lib/i18n/content'

type LocalizedPageProps = {
  locale: Locale
  page: LocalizedRouteKey | 'painting'
  paintingTitle?: string
}

export function LocalizedPage({
  locale,
  page,
  paintingTitle,
}: LocalizedPageProps) {
  const content = getPageContent(locale, page)

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Engela Art
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {paintingTitle ?? content.title}
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          {content.intro}
        </p>
      </div>
    </main>
  )
}
