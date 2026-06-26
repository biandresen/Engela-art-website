import type { Locale } from '#/lib/i18n/locale'
import { getPageContent } from '#/lib/i18n/content'
import { localizedPaths } from '#/lib/i18n/routes'
import { getAboutContent } from '#/lib/about/about'
import {
  TestimonialsSection,
  getApprovedTestimonials,
} from '#/lib/testimonials/testimonials'
import { env } from '#/env'

import { Button } from './ui/button'

export function LocalizedAboutPage({ locale }: { locale: Locale }) {
  const content = getPageContent(locale, 'about')
  const about = getAboutContent(locale)
  const paths = localizedPaths[locale]
  const testimonials = getApprovedTestimonials()

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(18rem,30rem)] md:items-center lg:px-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {about.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {content.intro}
          </p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {about.approvalLabel}
          </p>
          <p className="mt-3 leading-7 text-muted-foreground">{about.intro}</p>
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
            alt={about.portraitAlt}
            className="h-auto w-full rounded-md bg-surface object-cover"
          />
        </picture>
      </section>

      <section className="bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-2 lg:px-12">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {about.storyTitle}
            </h2>
            <div className="mt-5 space-y-5 text-lg leading-8 text-muted-foreground">
              {about.storyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {about.processTitle}
            </h2>
            <ul className="mt-5 space-y-3 text-muted-foreground">
              {about.processItems.map((item) => (
                <li key={item} className="border-t border-border pt-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {about.contactTitle}
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {about.contactText}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <a href={paths.contact}>{about.contactAction}</a>
            </Button>
            <Button asChild variant="link" size="lg">
              <a
                href={env.VITE_INSTAGRAM_URL ?? 'https://www.instagram.com/'}
                target="_blank"
                rel="noreferrer"
              >
                {about.instagramAction}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <TestimonialsSection
        locale={locale}
        entries={testimonials}
        heading={about.testimonialsHeading}
        intro={about.testimonialsIntro}
      />
    </main>
  )
}
