'use client'

import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'

import type { Locale } from '#/lib/i18n/locale'
import { getFaqItems } from '#/lib/legal/faq'

type FaqSectionProps = {
  locale: Locale
  scope: 'contact' | 'full'
}

const labels = {
  no: {
    title: 'Ofte stilte spørsmål',
  },
  en: {
    title: 'Frequently asked',
  },
} as const

export function FaqSection({ locale, scope }: FaqSectionProps) {
  const items = getFaqItems(locale, scope)
  const copy = labels[locale]
  const hash = useRouterState({
    select: (state) => state.location.hash,
  })

  useEffect(() => {
    function openFaq(id: string) {
      const normalizedId = id.startsWith('#') ? id.slice(1) : id

      if (!normalizedId) {
        return
      }

      const target = document.getElementById(normalizedId)
      const details =
        target instanceof HTMLDetailsElement
          ? target
          : target?.closest('details')

      if (details instanceof HTMLDetailsElement) {
        details.open = true
      }
    }

    function openTargetedFaq() {
      openFaq(window.location.hash)
    }

    openFaq(hash)
    openTargetedFaq()
    window.addEventListener('hashchange', openTargetedFaq)

    return () => window.removeEventListener('hashchange', openTargetedFaq)
  }, [hash])

  return (
    <section aria-labelledby={`${scope}-faq-title`} className="space-y-4">
      <h2
        id={`${scope}-faq-title`}
        className="text-lg font-semibold text-foreground"
      >
        {copy.title}
      </h2>
      <div className="divide-y divide-border border-y border-border">
        {items.map((item) => (
          <details key={item.key} id={item.id} className="group py-3">
            <summary className="cursor-pointer list-none font-medium text-foreground marker:content-[''] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
              {item.question}
            </summary>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
