'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

import type { Locale } from '#/lib/i18n/locale'

const scrollThresholdPx = 560

const labels = {
  no: 'Til toppen',
  en: 'Back to top',
} as const satisfies Record<Locale, string>

export function BackToTopControl({ locale }: { locale: Locale }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    function updateVisibility() {
      setIsVisible(window.scrollY > scrollThresholdPx)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })

    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  function handleClick() {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <button
      type="button"
      aria-label={labels[locale]}
      onClick={handleClick}
      className="fixed right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-30 inline-flex size-11 items-center justify-center rounded-md border border-border bg-surface/95 text-foreground shadow-sm backdrop-blur transition hover:border-primary/40 hover:bg-background hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:right-6 md:bottom-6"
    >
      <ArrowUp aria-hidden="true" focusable="false" className="size-5" />
    </button>
  )
}
