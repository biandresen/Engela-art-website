import type { Locale } from '#/lib/i18n/locale'
import { getPageContent } from '#/lib/i18n/content'

export function LocalizedAboutPage({ locale }: { locale: Locale }) {
  const content = getPageContent(locale, 'about')
  const portraitAlt =
    locale === 'no'
      ? 'Portrett av Engela, kunstneren bak Engela Art'
      : 'Portrait of Engela, the artist behind Engela Art'

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(18rem,30rem)] md:items-center lg:px-12">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Engela Art
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          {content.title}
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          {content.intro}
        </p>
      </div>

      <picture>
        <source
          type="image/avif"
          srcSet="/assets/portrait/engela-480.avif 480w, /assets/portrait/engela-768.avif 768w, /assets/portrait/engela-960.avif 960w"
          sizes="(min-width: 768px) 40vw, 100vw"
        />
        <source
          type="image/webp"
          srcSet="/assets/portrait/engela-480.webp 480w, /assets/portrait/engela-768.webp 768w, /assets/portrait/engela-960.webp 960w"
          sizes="(min-width: 768px) 40vw, 100vw"
        />
        <img
          src="/assets/portrait/engela-960.jpg"
          width="960"
          height="1200"
          alt={portraitAlt}
          className="h-auto w-full rounded-md bg-surface object-cover"
        />
      </picture>
    </main>
  )
}
